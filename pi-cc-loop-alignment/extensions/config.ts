/**
 * cc-loop-alignment — configuration.
 *
 * The dsh original edits its settings through a web GUI card backed by the dsh
 * settings service. pi has no equivalent, so the same knobs live in
 * `$PI_CODING_AGENT_DIR/cc-loop-alignment.json` and are editable with the
 * `/cc-loop` command. `PI_CC_LOOP_CONFIG` overrides the file path (handy for
 * isolated tests).
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";

export interface CcLoopConfig {
	/** Master switch for the loop mechanisms, tools, and prompt section. */
	enabled: boolean;
	/** Whether the system-prompt section announces the plugin to the agent (off by default: it adds prompt-cache bytes). */
	announceToAgent: boolean;
	/** Max tool-use steps per user turn (0 disables the budget). */
	maxToolTurns: number;
	/**
	 * How the per-turn tool budget is enforced after the grace step:
	 * - "warn": steer a stop instruction but never block further tool calls
	 *   (closest to Claude Code `max_turns`)
	 * - "block": additionally block every tool call after the grace step
	 */
	toolBudgetMode: "warn" | "block";
	/** Context-pressure ratio that triggers the tool-result snip pass (scaled by window; 0 disables). */
	snipAtRatio: number;
	/** How many recent tool results the automatic snip pass leaves untouched (count mode). */
	snipKeepToolResults: number;
	/** Approximate tokens to keep in the tail for the automatic pass (0 uses count mode). */
	snipKeepTailTokens: number;
	/** Context-pressure ratio that triggers summary compaction (scaled by window; 0 disables). */
	compactAtRatio: number;
	/** Per-user-turn output-token budget (0 disables). */
	turnTokenBudget: number;
	/** Stop nudging once this share of the budget is consumed. */
	budgetCompletionRatio: number;
	/** Stop after >=3 continuations that each added fewer tokens than this. */
	budgetDiminishingDelta: number;
	/** Max-output-tokens recovery steering attempts (0 disables). */
	maxTokensRecoveryLimit: number;
}

export const DEFAULT_CONFIG: CcLoopConfig = {
	enabled: true,
	announceToAgent: false,
	maxToolTurns: 20,
	toolBudgetMode: "warn",
	snipAtRatio: 0.6,
	snipKeepToolResults: 8,
	snipKeepTailTokens: 0,
	compactAtRatio: 0,
	turnTokenBudget: 0,
	budgetCompletionRatio: 0.9,
	budgetDiminishingDelta: 500,
	// pi already has native recoverable-length/overflow compaction and retry;
	// keep this plugin layer opt-in to avoid duplicate recovery requests.
	maxTokensRecoveryLimit: 0,
};

/** Counters surfaced by `/cc-loop status`. */
export interface CcLoopStats {
	toolBudgetHits: number;
	toolCallBlocks: number;
	autoSnips: number;
	snipToolRuns: number;
	budgetNudges: number;
	maxTokenRecoveries: number;
	compactions: number;
	lastEvent?: string;
}

export function createStats(): CcLoopStats {
	return {
		toolBudgetHits: 0,
		toolCallBlocks: 0,
		autoSnips: 0,
		snipToolRuns: 0,
		budgetNudges: 0,
		maxTokenRecoveries: 0,
		compactions: 0,
	};
}

export const CONFIG_PATH_ENV = "PI_CC_LOOP_CONFIG";

const BOOLEAN_KEYS = ["enabled", "announceToAgent"] as const;
const NUMBER_KEYS = [
	"maxToolTurns",
	"snipAtRatio",
	"snipKeepToolResults",
	"snipKeepTailTokens",
	"compactAtRatio",
	"turnTokenBudget",
	"budgetCompletionRatio",
	"budgetDiminishingDelta",
	"maxTokensRecoveryLimit",
] as const;
const STRING_KEYS = ["toolBudgetMode"] as const;

const STRING_VALUES: Record<string, readonly string[]> = {
	toolBudgetMode: ["warn", "block"],
};

type BooleanKey = (typeof BOOLEAN_KEYS)[number];
type NumberKey = (typeof NUMBER_KEYS)[number];
type StringKey = (typeof STRING_KEYS)[number];
export type ConfigKey = BooleanKey | NumberKey | StringKey;

export const CONFIG_KEYS: readonly ConfigKey[] = [...BOOLEAN_KEYS, ...NUMBER_KEYS, ...STRING_KEYS];

const RATIO_KEYS = new Set<ConfigKey>(["snipAtRatio", "compactAtRatio", "budgetCompletionRatio"]);
const INTEGER_KEYS = new Set<ConfigKey>([
	"maxToolTurns",
	"snipKeepToolResults",
	"snipKeepTailTokens",
	"turnTokenBudget",
	"budgetDiminishingDelta",
	"maxTokensRecoveryLimit",
]);

/** Absolute path of the config file. */
export function configPath(): string {
	const override = process.env[CONFIG_PATH_ENV];
	return override && override.trim() !== "" ? override : join(getAgentDir(), "cc-loop-alignment.json");
}

function sanitizeNumber(key: ConfigKey, value: number): number | undefined {
	if (!Number.isFinite(value)) return undefined;
	if (value < 0) return undefined;
	if (RATIO_KEYS.has(key)) return value > 1 ? 1 : value;
	return INTEGER_KEYS.has(key) ? Math.trunc(value) : value;
}

/**
 * Reference window that pressure ratios are normalized against. Ratios were
 * tuned for Claude Code-class 200K windows; on bigger windows the same value
 * means "the same fullness", so it is scaled down proportionally.
 */
export const REFERENCE_CONTEXT_WINDOW = 200_000;

/** Scale a configured pressure ratio for the model's actual context window. */
export function scalePressureRatio(ratio: number, contextWindow: number): number {
	if (ratio <= 0 || !Number.isFinite(contextWindow) || contextWindow <= 0) return ratio;
	return ratio * Math.min(1, REFERENCE_CONTEXT_WINDOW / contextWindow);
}

/** Merge unknown input over the defaults, ignoring invalid values. */
export function resolveConfig(raw: unknown): CcLoopConfig {
	const config: CcLoopConfig = { ...DEFAULT_CONFIG };
	if (!raw || typeof raw !== "object") return config;
	const input = raw as Record<string, unknown>;
	for (const key of BOOLEAN_KEYS) {
		if (typeof input[key] === "boolean") config[key] = input[key];
	}
	for (const key of NUMBER_KEYS) {
		const value = input[key];
		if (typeof value !== "number") continue;
		const clean = sanitizeNumber(key, value);
		if (clean !== undefined) config[key] = clean;
	}
	for (const key of STRING_KEYS) {
		const value = input[key];
		if (typeof value !== "string") continue;
		if (STRING_VALUES[key].includes(value)) config[key] = value;
	}
	return config;
}

/** Read the config file, falling back to defaults when missing or invalid. */
export function loadConfig(): CcLoopConfig {
	try {
		return resolveConfig(JSON.parse(readFileSync(configPath(), "utf8")));
	} catch {
		return { ...DEFAULT_CONFIG };
	}
}

/** Persist the config file (creating the agent directory when needed). */
export function saveConfig(config: CcLoopConfig): void {
	const path = configPath();
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
}

/**
 * Apply a string-valued config edit (as typed after `/cc-loop <key> <value>`).
 * Returns the next config plus an error message when the value is invalid.
 */
export function setConfigValue(
	config: CcLoopConfig,
	key: string,
	rawValue: string,
): { config: CcLoopConfig; error?: string } {
	if (!(CONFIG_KEYS as readonly string[]).includes(key)) {
		return { config, error: `unknown config key: ${key} (try /cc-loop help)` };
	}
	const typedKey = key as ConfigKey;
	const text = rawValue.trim();
	if ((BOOLEAN_KEYS as readonly string[]).includes(typedKey)) {
		const normalized = text.toLowerCase();
		const truthy = ["true", "1", "on", "yes", "y", "enable", "enabled"];
		const falsy = ["false", "0", "off", "no", "n", "disable", "disabled"];
		if (truthy.includes(normalized)) return { config: { ...config, [typedKey]: true } };
		if (falsy.includes(normalized)) return { config: { ...config, [typedKey]: false } };
		return { config, error: `${typedKey} expects a boolean (true/false)` };
	}
	if ((STRING_KEYS as readonly string[]).includes(typedKey)) {
		const allowed = STRING_VALUES[typedKey];
		if (allowed.includes(text)) return { config: { ...config, [typedKey]: text } };
		return { config, error: `${typedKey} must be one of: ${allowed.join(" / ")}` };
	}
	if (text === "") return { config, error: `${typedKey} expects a number` };
	const value = Number(text);
	const clean = sanitizeNumber(typedKey, value);
	if (clean === undefined) {
		const hint = RATIO_KEYS.has(typedKey) ? "a ratio between 0 and 1" : "a non-negative number";
		return { config, error: `${typedKey} expects ${hint}` };
	}
	return { config: { ...config, [typedKey]: clean } };
}

/** Human-readable config + stats block for `/cc-loop status`. */
export function formatStatus(config: CcLoopConfig, stats: CcLoopStats): string {
	const lines = CONFIG_KEYS.map((key) => {
		const value = config[key];
		return `  ${key} = ${typeof value === "boolean" ? String(value) : value}`;
	});
	const statLines = [
		`  tool budget hits: ${stats.toolBudgetHits}`,
		`  tool calls blocked: ${stats.toolCallBlocks}`,
		`  auto snip passes: ${stats.autoSnips}`,
		`  snip tool runs: ${stats.snipToolRuns}`,
		`  budget nudges: ${stats.budgetNudges}`,
		`  max-token recoveries: ${stats.maxTokenRecoveries}`,
		`  pressure compactions: ${stats.compactions}`,
	];
	if (stats.lastEvent) statLines.push(`  last event: ${stats.lastEvent}`);
	return [
		`cc-loop-alignment — config (${configPath()})`,
		...lines,
		"",
		"session counters",
		...statLines,
	].join("\n");
}

export const CONFIG_HELP = [
	"cc-loop-alignment",
	"  /cc-loop                     show config + session counters",
	"  /cc-loop edit                interactively edit config values",
	"  /cc-loop <key> <value>       set one value and save",
	"  /cc-loop reset               restore defaults",
	"  /cc-loop help                this message",
	"",
	`config file: ${configPath()}`,
].join("\n");
