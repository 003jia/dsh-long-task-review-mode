/**
 * Claude-style permission modes for pi.
 *
 * Modes (aligned with Claude Code's five permission modes; the first three
 * form the everyday Shift+Tab cycle and the last two live under Advanced):
 * - normal (CC `default`): ask before edits and non-read-only bash commands.
 * - accept-edits (CC `acceptEdits`): allow edits automatically, still confirm dangerous bash.
 * - plan: disable edit/write and allow only read-only bash commands.
 * - bypass-permissions (CC `bypassPermissions`): approve every tool call without asking.
 * - dont-ask (CC `dontAsk`): never prompt; anything that would need confirmation is denied.
 *
 * Every mode carries a Chinese label describing its main purpose, shown in the
 * footer, the `/mode` picker and `/mode` status output, e.g. `plan（计划）`.
 *
 * Based on pi's official plan-mode extension example. The active mode is shown
 * in the pi footer through the `cc-mode` extension status key and is persisted
 * per session branch.
 *
 * Shift+Tab cycles the everyday modes (normal → accept-edits → plan). Note that
 * pi binds shift+tab to app.thinking.cycle by default (a
 * reserved keybinding), so this shortcut only takes effect after moving
 * app.thinking.cycle off shift+tab in ~/.pi/agent/keybindings.json (see README).
 */

import type { ExtensionAPI, ExtensionContext, ToolCallEventResult } from "@earendil-works/pi-coding-agent";
import { Key, truncateToWidth, type TUI } from "@earendil-works/pi-tui";
import { ClaudeCodeEditor, renderStatus } from "./claude-editor.ts";
import { rememberModel } from "./model-preference.ts";
import { isReadonlyCommand } from "./utils.ts";

export type ClaudeMode = "normal" | "accept-edits" | "plan" | "bypass-permissions" | "dont-ask";

interface ModeState {
	mode: ClaudeMode;
	toolsBeforeMode?: string[];
}

interface ModeContextDetails {
	mode: ClaudeMode;
}

const MODE_ENTRY_TYPE = "cc-mode-state";
const MODE_CONTEXT_TYPE = "cc-mode-context";
const MODE_FLAG = "cc-mode";
const PLAN_DISABLED_TOOLS = new Set(["edit", "write"]);
const MODE_VALUES: ClaudeMode[] = ["normal", "accept-edits", "plan", "bypass-permissions", "dont-ask"];
/** Cycle order used by the Shift+Tab mode-switch shortcut. */
const MODE_CYCLE: ClaudeMode[] = ["normal", "accept-edits", "plan"];

/** Chinese description of each mode's main purpose, e.g. `plan（计划）`. */
const MODE_ZH: Record<ClaudeMode, string> = {
	normal: "普通确认",
	"accept-edits": "自动接受编辑",
	plan: "计划（只读规划）",
	"bypass-permissions": "全部放行",
	"dont-ask": "一律拒绝",
};

const MODE_LABELS: Record<ClaudeMode, string> = {
	normal: `● NORMAL（${MODE_ZH.normal}）`,
	"accept-edits": `⏵⏵ ACCEPT EDITS（${MODE_ZH["accept-edits"]}）`,
	plan: `⏸ PLAN（${MODE_ZH.plan}）`,
	"bypass-permissions": `⏩ BYPASS PERMISSIONS（${MODE_ZH["bypass-permissions"]}）`,
	"dont-ask": `✕ DONT ASK（${MODE_ZH["dont-ask"]}）`,
};

/**
 * Claude Code-style hint text shown on the line below the input box, e.g.
 * `⏵⏵ accept edits on (shift+tab to cycle)`. Mirrors Claude Code's own wording.
 */
const MODE_HINTS: Record<ClaudeMode, string> = {
	normal: "default · shift+tab to cycle",
	"accept-edits": "⏵⏵ accept edits on (shift+tab to cycle)",
	plan: "⏸ plan mode on (shift+tab to cycle)",
	"bypass-permissions": "⏩ bypass permissions on (shift+tab to cycle)",
	"dont-ask": "✕ dont ask on (shift+tab to cycle)",
};

/** Compact `name（中文作用）` form, used by pickers and help output. */
const MODE_OPTIONS: Record<ClaudeMode, string> = {
	normal: `normal（${MODE_ZH.normal}）`,
	"accept-edits": `accept-edits（${MODE_ZH["accept-edits"]}）`,
	plan: `plan（${MODE_ZH.plan}）`,
	"bypass-permissions": `bypass-permissions（${MODE_ZH["bypass-permissions"]}）`,
	"dont-ask": `dont-ask（${MODE_ZH["dont-ask"]}）`,
};

type ModeColor = "muted" | "accent" | "warning" | "error" | "dim";

const MODE_COLORS: Record<ClaudeMode, ModeColor> = {
	normal: "muted",
	"accept-edits": "accent",
	plan: "warning",
	"bypass-permissions": "error",
	"dont-ask": "dim",
};

/**
 * Accepted user input aliases (separators are stripped before lookup), so both
 * the extension's kebab-case names and Claude Code's camelCase names work:
 * `acceptEdits`, `bypassPermissions`, `dontAsk`, `default`.
 */
const MODE_ALIASES: Record<string, ClaudeMode> = {
	normal: "normal",
	default: "normal",
	acceptedits: "accept-edits",
	plan: "plan",
	bypasspermissions: "bypass-permissions",
	bypass: "bypass-permissions",
	dontask: "dont-ask",
};

function isClaudeMode(value: unknown): value is ClaudeMode {
	return typeof value === "string" && MODE_VALUES.includes(value as ClaudeMode);
}

/** Normalize user input into a canonical mode, accepting CC-style aliases. */
function normalizeMode(value: string): ClaudeMode | undefined {
	const key = value.trim().toLowerCase().replace(/[\s_-]+/g, "");
	return MODE_ALIASES[key];
}

function getModeFromEntries(entries: readonly unknown[]): ModeState | undefined {
	let latest: ModeState | undefined;
	for (const entry of entries) {
		if (!entry || typeof entry !== "object") continue;
		const candidate = entry as { type?: string; customType?: string; data?: unknown };
		if (candidate.type !== "custom" || candidate.customType !== MODE_ENTRY_TYPE) continue;
		const data = candidate.data;
		if (!data || typeof data !== "object") continue;
		const state = data as { mode?: unknown; toolsBeforeMode?: unknown };
		if (!isClaudeMode(state.mode)) continue;
		latest = {
			mode: state.mode,
			toolsBeforeMode: Array.isArray(state.toolsBeforeMode)
				? state.toolsBeforeMode.filter((name): name is string => typeof name === "string")
				: undefined,
		};
	}
	return latest;
}

function getModeFromFlag(value: boolean | string | undefined): ClaudeMode | undefined {
	if (typeof value !== "string") return undefined;
	return normalizeMode(value);
}

function getAvailableToolNames(pi: ExtensionAPI): Set<string> {
	return new Set(pi.getAllTools().map((tool) => tool.name));
}

function filterAvailableTools(toolNames: readonly string[], available: Set<string>): string[] {
	return [...new Set(toolNames.filter((name) => available.has(name)))];
}

function createPlanTools(
	baselineTools: readonly string[],
	availableTools: Set<string>,
): string[] {
	const preserved = baselineTools.filter((name) => !PLAN_DISABLED_TOOLS.has(name));
	const requiredPlanTools = ["read", "bash", "grep", "find", "ls", "questionnaire"];
	return filterAvailableTools([...preserved, ...requiredPlanTools], availableTools);
}

/** All five modes with their Chinese purpose, shown by `/mode` status output. */
function modeHelpText(): string {
	return MODE_VALUES.map((mode) => MODE_OPTIONS[mode]).join("\n");
}

export default function claudeModesExtension(pi: ExtensionAPI): void {
	let currentMode: ClaudeMode = "normal";
	let toolsBeforeMode: string[] | undefined;
	let currentModel: ExtensionContext["model"];
	let activeTui: TUI | undefined;
	/** 最近一次从 session-cost 扩展广播来的费用文本，并进输入框下方的 hint 行。 */
	let latestCost: string | undefined;

	// 监听 session-cost 扩展的广播，把费用和模式/模型并成同一行。
	pi.events.on("session-cost:update", (payload: unknown) => {
		const data = payload as { text?: unknown } | undefined;
		latestCost = typeof data?.text === "string" ? data.text : undefined;
		activeTui?.requestRender();
	});

	function updateModeStatus(ctx: ExtensionContext): void {
		const color = MODE_COLORS[currentMode];
		ctx.ui.setStatus("cc-mode", ctx.ui.theme.fg(color, MODE_LABELS[currentMode]));
		activeTui?.requestRender();
	}

	function formatCwd(cwd: string): string {
		const home = process.env.HOME;
		if (home && cwd.startsWith(home)) {
			return `~${cwd.slice(home.length)}`;
		}
		return cwd;
	}

	function formatContext(ctx: ExtensionContext): string {
		const usage = ctx.getContextUsage();
		const contextWindow = usage?.contextWindow ?? currentModel?.contextWindow;
		if (!contextWindow || !usage || usage.percent === null) {
			return "ctx ?";
		}
		return `ctx ${Math.round(usage.percent)}%/${(contextWindow / 1000).toFixed(0)}k`;
	}

	function installClaudeEditor(ctx: ExtensionContext): void {
		if (!ctx.hasUI || ctx.mode !== "tui") {
			return;
		}

		currentModel = ctx.model;
		ctx.ui.setHeader(() => ({
			render: (width: number) => [
				ctx.ui.theme.fg("accent", "✳ Pi Code") + ctx.ui.theme.fg("dim", "  ·  Claude-style workspace"),
				ctx.ui.theme.fg("muted", `${currentModel?.id ?? "no model"} · ${currentModel?.provider ?? ""}`),
				ctx.ui.theme.fg("dim", formatCwd(ctx.cwd)),
				ctx.ui.theme.fg("dim", "/mode  权限模式   /model  模型   /cost  费用   /hotkeys  快捷键"),
			].map((line) => truncateToWidth(line, width, "…")),
			invalidate() {},
		}));
		ctx.ui.setFooter((_tui, _theme, footerData) => ({
			render: (width: number) => {
				const theme = ctx.ui.theme;
				const mode = theme.fg(MODE_COLORS[currentMode], MODE_HINTS[currentMode]);
				const cost = latestCost?.replace(/^💰\s*/, "") ?? "费用待加载";
				const details = theme.fg("dim", `${pi.getThinkingLevel()} · ${formatContext(ctx)} · `)
					+ theme.fg("accent", cost);
				const notices = [...footerData.getExtensionStatuses()]
					.filter(([key]) => key !== "cc-mode" && key !== "session-cost")
					.map(([, value]) => truncateToWidth(value, width, "…"));
				return [...renderStatus(mode, details, width), ...notices];
			},
			invalidate() {},
		}));
		ctx.ui.setEditorComponent((tui, theme, keybindings) => {
			activeTui = tui;
			const editor = new ClaudeCodeEditor(tui, theme, keybindings, { embedWorkingStatus: true });
			editor.chromeColor = (text: string) => ctx.ui.theme.fg("borderMuted", text);
			return editor;
		});
	}

	function persistMode(): void {
		pi.appendEntry<ModeState>(MODE_ENTRY_TYPE, {
			mode: currentMode,
			toolsBeforeMode,
		});
	}

	function restoreBaselineTools(): void {
		const available = getAvailableToolNames(pi);
		const baseline = toolsBeforeMode ?? pi.getActiveTools();
		pi.setActiveTools(filterAvailableTools(baseline, available));
	}

	function applyModeTools(): void {
		if (currentMode === "plan") {
			const available = getAvailableToolNames(pi);
			pi.setActiveTools(createPlanTools(toolsBeforeMode ?? pi.getActiveTools(), available));
			return;
		}
		restoreBaselineTools();
	}

	function applyMode(mode: ClaudeMode, ctx: ExtensionContext, persist: boolean): void {
		if (mode !== "normal" && toolsBeforeMode === undefined) {
			toolsBeforeMode = pi.getActiveTools();
		}
		currentMode = mode;
		if (mode === "normal") {
			restoreBaselineTools();
			toolsBeforeMode = undefined;
		} else {
			applyModeTools();
		}
		if (persist) persistMode();
		updateModeStatus(ctx);
	}

	/**
	 * Apply a mode requested by the user. Entering `bypass-permissions`
	 * interactively asks for confirmation first, because it removes every
	 * permission check for the rest of the session.
	 */
	async function switchMode(mode: ClaudeMode, ctx: ExtensionContext, persist: boolean): Promise<boolean> {
		if (mode === "bypass-permissions" && currentMode !== "bypass-permissions" && ctx.hasUI) {
			const confirmed = await ctx.ui.confirm(
				"Enable bypass permissions?",
				"All permission checks are bypassed: file edits and any shell command run without confirmation. Continue?",
			);
			if (!confirmed) {
				ctx.ui.notify("Bypass permissions cancelled.", "warning");
				return false;
			}
		}
		applyMode(mode, ctx, persist);
		return true;
	}

	async function confirmToolCall(
		title: string,
		description: string,
		reason: string,
		ctx: ExtensionContext,
	): Promise<ToolCallEventResult | undefined> {
		if (!ctx.hasUI) return { block: true, reason: `${reason} (no UI available for confirmation)` };
		const choice = await ctx.ui.select(`${title}\n\n${description}\n\nAllow this call?`, ["Allow", "Deny"]);
		if (choice === "Allow") return undefined;
		return { block: true, reason };
	}

	function getModeContext(): string | undefined {
		if (currentMode === "plan") {
			return [
				"[CLAUDE PLAN MODE ACTIVE]",
				"You are in read-only planning mode.",
				"Do not modify files or run state-changing commands.",
				"Use read-only tools to inspect the project and produce a concrete implementation plan.",
				"The edit and write tools are disabled; bash is restricted to read-only commands.",
			].join("\n");
		}
		if (currentMode === "accept-edits") {
			return [
				"[CLAUDE ACCEPT EDITS MODE ACTIVE]",
				"File edits are pre-approved for this session.",
				"Continue to ask before destructive or dangerous shell commands.",
			].join("\n");
		}
		if (currentMode === "bypass-permissions") {
			return [
				"[CLAUDE BYPASS PERMISSIONS MODE ACTIVE]",
				"Every tool call is auto-approved; no confirmation prompts will appear.",
				"Stay strictly within the user's intent, avoid destructive commands, and do not touch unrelated files.",
			].join("\n");
		}
		if (currentMode === "dont-ask") {
			return [
				"[CLAUDE DONT ASK MODE ACTIVE]",
				"Permission prompts are disabled for this session.",
				"Operations that would need confirmation (file edits, non read-only shell commands) are denied automatically.",
				"Prefer read-only tools, and state clearly what the user must approve manually.",
			].join("\n");
		}
		return undefined;
	}

	pi.registerFlag(MODE_FLAG, {
		description:
			"Start pi in a Claude-style permission mode: normal, accept-edits, plan, bypass-permissions, or dont-ask",
		type: "string",
	});

	function notifyMode(ctx: ExtensionContext): void {
		ctx.ui.notify(`Mode: ${MODE_LABELS[currentMode]}`, "info");
	}

	async function handleModeCommand(args: string, ctx: ExtensionContext): Promise<void> {
		const requested = args.trim();
		const requestedMode = requested ? normalizeMode(requested) : undefined;
		if (requestedMode) {
			if (await switchMode(requestedMode, ctx, true)) notifyMode(ctx);
			return;
		}
		if (requested && requested.toLowerCase() !== "status") {
			ctx.ui.notify(`Usage: /mode [${MODE_VALUES.join("|")}|status]\n${modeHelpText()}`, "warning");
			return;
		}
		if (requested.toLowerCase() === "status" || !ctx.hasUI) {
			ctx.ui.notify(`Mode: ${MODE_LABELS[currentMode]}\n\n${modeHelpText()}`, "info");
			return;
		}
		const labels = [
			"Default · 修改前确认",
			"Accept edits · 自动编辑，命令仍需确认",
			"Plan · 只读分析与规划",
		];
		const options = labels.map((label, index) => `${MODE_CYCLE[index] === currentMode ? "●" : "○"} ${label}`);
		options.push("Advanced… · 全部放行 / 无人值守拒绝");
		const selected = await ctx.ui.select(`权限模式 · 当前 ${MODE_OPTIONS[currentMode]}`, options);
		const selectedIndex = selected ? options.indexOf(selected) : -1;
		if (selectedIndex === 3) {
			const advancedModes: ClaudeMode[] = ["bypass-permissions", "dont-ask"];
			const advancedOptions = advancedModes.map((mode) => MODE_OPTIONS[mode]);
			const advanced = await ctx.ui.select("高级模式 · 不参与 Shift+Tab 日常循环", advancedOptions);
			const index = advanced ? advancedOptions.indexOf(advanced) : -1;
			if (index >= 0) await switchMode(advancedModes[index], ctx, true);
			return;
		}
		if (selectedIndex >= 0 && (await switchMode(MODE_CYCLE[selectedIndex], ctx, true))) {
			notifyMode(ctx);
		}
	}

	pi.registerCommand("mode", {
		description: "Show or change Claude-style permission mode",
		handler: async (args, ctx) => handleModeCommand(args, ctx),
	});

	pi.registerCommand("modes", {
		description: "Select Claude-style permission mode",
		handler: async (args, ctx) => handleModeCommand(args, ctx),
	});

	pi.registerCommand("normal", {
		description: "Enter normal mode (普通确认)",
		handler: async (_args, ctx) => {
			await switchMode("normal", ctx, true);
		},
	});

	pi.registerCommand("accept-edits", {
		description: "Enter accept-edits mode (自动接受编辑)",
		handler: async (_args, ctx) => {
			await switchMode("accept-edits", ctx, true);
		},
	});

	pi.registerCommand("plan", {
		description: "Enter read-only plan mode (计划)",
		handler: async (_args, ctx) => {
			await switchMode("plan", ctx, true);
		},
	});

	pi.registerCommand("bypass-permissions", {
		description: "Enter bypass-permissions mode (全部放行)",
		handler: async (_args, ctx) => {
			await switchMode("bypass-permissions", ctx, true);
		},
	});

	pi.registerCommand("dont-ask", {
		description: "Enter dont-ask mode (一律拒绝)",
		handler: async (_args, ctx) => {
			await switchMode("dont-ask", ctx, true);
		},
	});

	pi.registerShortcut(Key.ctrlAlt("p"), {
		description: "Toggle plan mode",
		handler: async (ctx) => {
			await switchMode(currentMode === "plan" ? "normal" : "plan", ctx, true);
		},
	});

	pi.registerShortcut(Key.shift("tab"), {
		description: "Cycle permission mode: Default → Accept edits → Plan",
		handler: async (ctx) => {
			const next = MODE_CYCLE[(MODE_CYCLE.indexOf(currentMode) + 1) % MODE_CYCLE.length];
			await switchMode(next, ctx, true);
		},
	});

	pi.on("tool_call", async (event, ctx) => {
		if (currentMode === "plan") {
			if (event.toolName === "edit" || event.toolName === "write") {
				return {
					block: true,
					reason: "Plan mode: file modification tools are disabled. Switch to /mode normal or /mode accept-edits.",
				};
			}
			if (event.toolName === "bash") {
				const command = String(event.input.command ?? "");
				if (!isReadonlyCommand(command)) {
					return {
						block: true,
						reason: `Plan mode: bash command is not read-only or is not allowlisted.\nCommand: ${command}`,
					};
				}
			}
			return undefined;
		}

		if (currentMode === "bypass-permissions") {
			return undefined;
		}

		if (currentMode === "dont-ask") {
			if (event.toolName === "edit" || event.toolName === "write") {
				return {
					block: true,
					reason:
						"Dont-ask mode: file modifications need confirmation, but permission prompts are disabled, so the call was denied.",
				};
			}
			if (event.toolName === "bash") {
				const command = String(event.input.command ?? "");
				if (!isReadonlyCommand(command)) {
					return {
						block: true,
						reason: `Dont-ask mode: only read-only commands are allowed without confirmation.\nCommand: ${command}`,
					};
				}
			}
			return undefined;
		}

		if (event.toolName === "bash") {
			const command = String(event.input.command ?? "");
			const requiresConfirmation = !isReadonlyCommand(command);
			if (requiresConfirmation) {
				return confirmToolCall(
					"Command confirmation",
					command,
					currentMode === "normal"
						? "Normal mode requires confirmation for non-read-only shell commands."
						: "Accept-edits mode still requires confirmation for non-read-only shell commands.",
					ctx,
				);
			}
			return undefined;
		}

		if (currentMode === "normal" && (event.toolName === "edit" || event.toolName === "write")) {
			return confirmToolCall(
				"File modification confirmation",
				String(event.input.path ?? "(unknown path)"),
				"Normal mode requires confirmation before editing or writing files.",
				ctx,
			);
		}
		return undefined;
	});

	pi.on("before_agent_start", () => {
		const content = getModeContext();
		if (!content) return;
		return {
			message: {
				customType: MODE_CONTEXT_TYPE,
				content,
				display: false,
				details: { mode: currentMode } satisfies ModeContextDetails,
			},
		};
	});

	pi.on("context", (event) => {
		return {
			messages: event.messages.filter((message) => {
				const candidate = message as { role?: string; customType?: string; details?: unknown };
				if (candidate.role !== "custom" || candidate.customType !== MODE_CONTEXT_TYPE) return true;
				const details = candidate.details as Partial<ModeContextDetails> | undefined;
				return details?.mode === currentMode;
			}),
		};
	});

	pi.on("session_start", (_event, ctx) => {
		installClaudeEditor(ctx);
		const saved = getModeFromEntries(ctx.sessionManager.getBranch());
		const flagMode = getModeFromFlag(pi.getFlag(MODE_FLAG));
		currentMode = flagMode ?? saved?.mode ?? "normal";
		toolsBeforeMode = saved?.toolsBeforeMode;
		applyMode(currentMode, ctx, false);
	});

	pi.on("session_tree", (_event, ctx) => {
		currentModel = ctx.model;
		const saved = getModeFromEntries(ctx.sessionManager.getBranch());
		currentMode = saved?.mode ?? "normal";
		toolsBeforeMode = saved?.toolsBeforeMode;
		applyMode(currentMode, ctx, false);
	});

	pi.on("model_select", async (event, ctx) => {
		currentModel = event.model;
		activeTui?.requestRender();
		await rememberModel(event, ctx);
	});

	pi.on("session_shutdown", () => {
		activeTui = undefined;
		currentModel = undefined;
		latestCost = undefined;
	});
}
