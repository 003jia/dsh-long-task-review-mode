/**
 * cc-loop-alignment — pi port of `@003jia/dsh-cc-loop-alignment`.
 *
 * Aligns pi's agent loop with Claude Code's loop using existing extension
 * points only:
 *
 *   maxToolTurns             per-user-turn tool-use budget + grace stop step
 *   snip pass (snipAtRatio)  context-pressure pruning of old tool results
 *   snip tool                model-driven removal of old history
 *   turnTokenBudget          output-token budget with nudge continuation
 *   maxTokensRecoveryLimit   Claude Code "Resume directly" recovery
 *   compactAtRatio           optional pressure compaction via ctx.compact()
 *   announceToAgent          system-prompt section describing the mechanisms
 *
 * The dsh web settings card has no pi equivalent, so configuration lives in
 * `$PI_CODING_AGENT_DIR/cc-loop-alignment.json` and is edited with /cc-loop.
 *
 * Install: the package root is registered through `pi install`; do not also
 * place a copy in `~/.pi/agent/extensions/`, or the extension will load twice.
 * See README.md for the mechanism-to-hook mapping and the behaviour notes.
 */

import type { ConfigKey } from "./config.ts";
import {
	CONFIG_HELP,
	CONFIG_KEYS,
	DEFAULT_CONFIG,
	createStats,
	formatStatus,
	loadConfig,
	saveConfig,
	setConfigValue,
} from "./config.ts";
import type {
	ContextEventResult,
	ExtensionAPI,
	ExtensionCommandContext,
	ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { LoopController } from "./loop.ts";
import { SnipController } from "./snip.ts";
import { makePlanAgentTool } from "./plan-agent.ts";
import { PLUGIN_GUIDANCE } from "./prompts.ts";

/** Tools owned by this extension (used to disable them with `enabled: false`). */
const OWNED_TOOLS = ["snip", "plan_agent"] as const;

export default function ccLoopAlignment(pi: ExtensionAPI): void {
	const stats = createStats();
	let config = loadConfig();
	/** Tools we removed ourselves, so re-enabling restores exactly those. */
	const removedByUs: string[] = [];

	const log = (ctx: ExtensionContext | undefined, text: string): void => {
		stats.lastEvent = text;
		if (ctx?.hasUI) ctx.ui.setStatus("cc-loop", `cc-loop: ${text}`);
	};

	const loop = new LoopController(pi, () => config, stats, log);
	const snip = new SnipController(pi, () => config, stats, log);

	/** Keep the registered tool set in sync with `enabled`. */
	const applyEnabled = (ctx: ExtensionContext): void => {
		const active = pi.getActiveTools();
		if (config.enabled) {
			const restore = removedByUs.filter((name) => !active.includes(name));
			if (restore.length > 0) pi.setActiveTools([...active, ...restore]);
			removedByUs.length = 0;
			if (ctx.hasUI) ctx.ui.setStatus("cc-loop", undefined);
			return;
		}
		const removed = active.filter((name) => (OWNED_TOOLS as readonly string[]).includes(name));
		if (removed.length > 0) {
			pi.setActiveTools(active.filter((name) => !(OWNED_TOOLS as readonly string[]).includes(name)));
		}
		removedByUs.length = 0;
		removedByUs.push(...removed);
		if (ctx.hasUI) ctx.ui.setStatus("cc-loop", "cc-loop: disabled");
	};

	const editInteractively = async (ctx: ExtensionCommandContext): Promise<void> => {
		for (;;) {
			const options = CONFIG_KEYS.map((key) => `${key} = ${String(config[key])}`);
			options.push("done (save & close)", "reset to defaults");
			const choice = await ctx.ui.select("cc-loop-alignment", options);
			if (!choice || choice.startsWith("done")) return;
			if (choice.startsWith("reset")) {
				config = { ...DEFAULT_CONFIG };
				saveConfig(config);
				applyEnabled(ctx);
				continue;
			}
			const key = choice.split(" = ")[0] as ConfigKey;
			const value = await ctx.ui.input(`${key}`, String(config[key]));
			if (value === undefined) continue;
			const result = setConfigValue(config, key, value);
			if (result.error) {
				ctx.ui.notify(result.error, "error");
				continue;
			}
			config = result.config;
			saveConfig(config);
			applyEnabled(ctx);
		}
	};

	// ---- tools -----------------------------------------------------------

	pi.registerTool(snip.tool);
	pi.registerTool(makePlanAgentTool(() => config, log));

	// ---- loop mechanisms -------------------------------------------------

	pi.on("before_agent_start", (event) => {
		loop.resetForUserTurn();
		if (!config.enabled || !config.announceToAgent) return;
		return { systemPrompt: `${event.systemPrompt}\n\n${PLUGIN_GUIDANCE}` };
	});

	pi.on("tool_call", () => loop.onToolCall());

	pi.on("turn_end", (event, ctx) => {
		loop.onTurnEnd(event, ctx);
	});

	pi.on("agent_settled", (_event, ctx) => {
		loop.onSettled(ctx);
		if (ctx.hasUI) ctx.ui.setStatus("cc-loop", config.enabled ? undefined : "cc-loop: disabled");
	});

	// ---- history snip pass + snip tool projection ------------------------

	pi.on("context", (event, ctx) => snip.onContext(event, ctx) as ContextEventResult | undefined);

	pi.on("session_start", (_event, ctx) => {
		snip.restore(ctx);
		applyEnabled(ctx);
	});

	// ---- configuration ---------------------------------------------------

	pi.registerCommand("cc-loop", {
		description: "Show or edit cc-loop-alignment settings (Claude Code loop alignment)",
		handler: async (args, ctx) => {
			const parts = args.trim().split(/\s+/).filter(Boolean);
			const [command = "status", ...rest] = parts;

			if (command === "help") {
				ctx.ui.notify(CONFIG_HELP, "info");
				return;
			}
			if (command === "edit") {
				await editInteractively(ctx);
				return;
			}
			if (command === "reset") {
				config = { ...DEFAULT_CONFIG };
				saveConfig(config);
				applyEnabled(ctx);
				ctx.ui.notify("cc-loop: defaults restored", "info");
				return;
			}
			if (command === "reload") {
				config = loadConfig();
				applyEnabled(ctx);
				ctx.ui.notify("cc-loop: config reloaded from disk", "info");
				return;
			}
			if ((CONFIG_KEYS as readonly string[]).includes(command)) {
				const key = command as ConfigKey;
				if (rest.length === 0) {
					ctx.ui.notify(`${key} = ${String(config[key])}`, "info");
					return;
				}
				const result = setConfigValue(config, key, rest.join(" "));
				if (result.error) {
					ctx.ui.notify(result.error, "error");
					return;
				}
				config = result.config;
				saveConfig(config);
				applyEnabled(ctx);
				ctx.ui.notify(`cc-loop: ${key} = ${String(config[key])}`, "info");
				return;
			}
			ctx.ui.notify(`cc-loop: unknown subcommand "${command}"\n\n${CONFIG_HELP}`, "warning");
		},
	});

	// Expose the resolved config + counters for debugging without a UI.
	log(undefined, `cc-loop-alignment ready (${config.enabled ? "enabled" : "disabled"})`);
	if (process.env.PI_CC_LOOP_DEBUG === "1") {
		console.error(`[cc-loop] ${formatStatus(config, stats)}`);
	}
}
