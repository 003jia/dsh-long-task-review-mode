/**
 * cc-loop-alignment — prompt strings.
 *
 * Ported from `@003jia/dsh-cc-loop-alignment` (dsh/cordis plugin). The wording
 * follows the original, adapted from dsh tool names to pi built-ins.
 */

/** System-prompt announcement section (dsh `CC_LOOP_GUIDANCE`). */
export const PLUGIN_GUIDANCE = [
	"## Claude Loop Alignment",
	"本机已安装 cc-loop-alignment 插件（与 Claude Code agent loop 行为对齐）：",
	"- 每个用户轮次有工具调用步数上限（maxToolTurns）；达到上限后会先收到一次收尾指令，若仍调用工具则该步被拦截。",
	"- 上下文压力达到阈值时自动剪枝旧的工具结果（snip pass），并可用 snip 工具主动裁掉更早的历史。",
	"- 可配置轮次输出 token 预算（turnTokenBudget），未达标时会提示续写而不是总结。",
	"- 输出被 token 上限截断时会自动注入断点续写指令。",
	"- 提供 plan_agent 工具：只读的架构规划子代理，用于产出实施计划。",
	"参数可通过 /cc-loop 命令查看和修改。",
].join("\n");

/** Injected as a steer message when the per-turn tool budget is reached. */
export function turnBudgetStop(limit: number, steps: number): string {
	return [
		"[turn budget] The configured maximum tool-use steps for this turn have been reached",
		`(${steps} >= ${limit}). Do not call any more tools.`,
		"Give the final answer now, based on the tool results already available.",
		"If the task is genuinely incomplete, say exactly what remains instead of starting new work.",
	].join(" ");
}

/** Reason attached to every blocked tool call after the grace step. */
export const TOOL_BUDGET_BLOCK_REASON =
	"cc-loop: per-turn tool-use budget exhausted. Finish the answer with the results you already have.";

/** Injected after a step that hit the provider output-token cap. */
export const MAX_TOKENS_RESUME =
	"Output token limit hit. Resume directly — no apology, no recap of what you were doing. " +
	"Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.";

/** Injected while the per-turn output budget is not yet met. */
export function budgetNudge(percent: number, used: number, budget: number): string {
	return (
		`Stopped at ${percent}% of token target (${used.toLocaleString("en-US")} / ` +
		`${budget.toLocaleString("en-US")}). Keep working — do not summarize.`
	);
}

/** Placeholder that replaces the prefix removed by the `snip` tool. */
export function snipPlaceholder(reason: string | undefined): string {
	const suffix = reason ? ` Reason: ${reason}` : "";
	return `[History snipped at the model's request: earlier messages were removed.${suffix}]`;
}

/** Placeholder that replaces the content of pruned tool results. */
export function prunedToolResultPlaceholder(count?: number): string {
	if (count !== undefined && count > 0) {
		return `[tool result snipped to free context — ${count} older tool result${count === 1 ? "" : "s"} replaced]`;
	}
	return "[tool result snipped to free context]";
}

/** Read-only software-architect prompt (Claude Code PLAN_AGENT analogue). */
export function architectPrompt(instruction: string, perspective: string | undefined): string {
	const lens = perspective
		? `You are asked to apply this specific perspective to your design: ${perspective}\n`
		: "";
	return [
		"You are a software architect and planning specialist. Your role is to explore the codebase and design an implementation plan.",
		"",
		"=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===",
		"This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from creating, modifying, deleting, moving, or copying files, and from running any command that changes system state. You do NOT have write or shell tools - attempting to use them will fail.",
		"Your tools are limited to read-only exploration: read, grep, find, and ls.",
		"",
		"Requirements:",
		instruction,
		"",
		lens,
		"## Your Process",
		"1. Understand Requirements: focus on the requirements and your assigned perspective.",
		"2. Explore Thoroughly: read the relevant files, find existing patterns and conventions, understand the current architecture, identify similar features as reference, trace the relevant code paths.",
		"3. Design Solution: create an implementation approach, consider trade-offs and architectural decisions, and follow existing patterns.",
		"4. Detail the Plan: provide a step-by-step implementation strategy, identify dependencies and sequencing, and anticipate potential challenges.",
		"",
		"## Required Output",
		"End your response with a section:",
		"### Critical Files for Implementation",
		"List the 3-5 files most critical for implementing this plan.",
		"",
		"REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files.",
	].join("\n");
}
