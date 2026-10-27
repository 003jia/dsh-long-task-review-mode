/**
 * dsh-cc-loop-alignment — host half. Aligns the dsh agent loop with Claude
 * Code's agent loop on existing extension points, ported from the dynamic
 * `claude-loop-alignment` plugin:
 *
 * - maxToolTurns: per-turn tool-use budget (Claude Code `max_turns`).
 * - snip pass: context-pressure tool-result pruning (CC cheap-compression
 *   layer) at `snipAtRatio`.
 * - optional pressure compaction via `ctx.compaction` at `compactAtRatio`
 *   (keep 0 when dsh-compaction-basic runs with auto:true).
 * - token budget: per-user-turn output-token budget with nudge-continuation
 *   and diminishing-returns stop (CC `query/tokenBudget.ts`).
 * - max-output-tokens recovery: steer the CC "Resume directly" message after
 *   a step that hit the output cap (CC `max_output_tokens` recovery).
 * - Tools: `snip` (model-driven history removal) and `plan_agent` (read-only
 *   architect subagent, CC PLAN_AGENT) — see tools.ts.
 *
 * The browser half (./client) renders the settings card in the web GUI plugin
 * section. Configuration flows back through the settings namespace and
 * re-syncs every surface (CC `installSettingsSection` pattern).
 */
import type { Context } from '@deepseek-ai/cordis';
import z from 'schemastery';
/** Stable cordis plugin name. */
export declare const name = "cc-loop";
/** Services required before the surfaces can mount. */
export declare const inject: readonly ["tools", "systemPrompt"];
/**
 * Settings namespace of this plugin — the section the web settings surface
 * edits. Spelled here rather than imported: the browser half spells the same
 * value and must not depend on a Host package.
 */
export declare const CC_LOOP_NAMESPACE: import("@deepseek-ai/dsh-settings").SettingsNamespace;
/** Plugin config, validated by the same-named schemastery schema. */
export interface Config {
    /** Max tool-use steps per user turn (0 disables the budget). */
    maxToolTurns?: number;
    /** Context-pressure ratio that triggers the pruner snip pass (0 disables). */
    snipAtRatio?: number;
    /** Context-pressure ratio that triggers summary compaction (0 disables). */
    compactAtRatio?: number;
    /** Per-user-turn output-token budget (0 disables). */
    turnTokenBudget?: number;
    /** Stop nudging once this share of the budget is consumed. */
    budgetCompletionRatio?: number;
    /** Stop after >=3 continuations that each added fewer tokens than this. */
    budgetDiminishingDelta?: number;
    /** Max-output-tokens recovery steering attempts (0 disables). */
    maxTokensRecoveryLimit?: number;
    /** Whether a system-prompt section announces the plugin to every agent. */
    announceToAgent?: boolean;
    /** Master switch for the plugin (listeners, tools, prompt section). */
    enabled?: boolean;
}
export declare const Config: z<Config>;
/** Model-facing announcement: plugin presence, capabilities, and limits. */
export declare const CC_LOOP_GUIDANCE = "\u672C\u673A\u5DF2\u5B89\u88C5 Claude Loop Alignment \u63D2\u4EF6\uFF08Claude Code agent loop \u884C\u4E3A\u5BF9\u9F50\uFF09\uFF1A\u6BCF\u7528\u6237\u8F6E\u6B21\u9650\u5236\u5DE5\u5177\u8C03\u7528\u6B65\u6570\u4E0A\u9650 maxToolTurns\uFF1B\u4E0A\u4E0B\u6587\u538B\u529B\u8FBE snipAtRatio \u65F6\u81EA\u52A8\u526A\u679D\u5DE5\u5177\u7ED3\u679C\uFF1B\u53EF\u914D token \u9884\u7B97\uFF08turnTokenBudget\uFF09\u5728\u8F6E\u5185\u4EE5\u63D0\u793A\u7EED\u5199\uFF1B\u8F93\u51FA\u622A\u65AD\u65F6\u81EA\u52A8\u6CE8\u5165\u65AD\u70B9\u7EED\u5199\u6307\u4EE4\uFF1B\u63D0\u4F9B snip\uFF08\u6A21\u578B\u4E3B\u52A8\u526A\u9664\u5386\u53F2\uFF09\u4E0E plan_agent\uFF08\u53EA\u8BFB\u89C4\u5212\u5B50\u4EE3\u7406\uFF09\u5DE5\u5177\u3002\u53C2\u6570\u53EF\u5728\u8BBE\u7F6E-\u63D2\u4EF6\u4E2D\u8C03\u6574\u3002";
/**
 * Mount the loop mechanisms, tools, and announcement.
 * @param ctx - host plugin context carrying tools/systemPrompt.
 * @param config - resolved plugin config (schema defaults applied by the loader).
 */
export declare const apply: typeof applyImpl;
declare function applyImpl(ctx: Context, config?: Config): void;
export {};
