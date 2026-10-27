/**
 * Claude Code agent-loop alignment for the DeepSeek Harness.
 *
 * This plugin layers Claude Code's loop behavior onto DSH's existing
 * extension points, without touching the loop kernel:
 *
 * - `maxToolTurns` — a per-turn tool-use budget (Claude Code `max_turns`
 *   analog). DSH documents "no built-in turn budget"; this enforces one at
 *   the `agent/pre-step` waterfall: once the cap is reached, one grace step
 *   runs with an injected stop instruction; a model that still calls tools
 *   has the following step rejected and the turn closes.
 * - `snipAtRatio` — a cheap per-turn "snip" pass: when the routed model's
 *   context pressure exceeds the configured ratio, the optional
 *   `toolResultPruner` prunes oversized tool results (silently no-ops without
 *   that sibling service). Plus a model-driven `snip` tool that replaces the
 *   oldest history with one placeholder (Claude Code SnipTool analog).
 * - `compactAtRatio` — pressure compaction through `ctx.compaction`. Keep at
 *   0 when `dsh-compaction-basic` runs with `auto: true` (it already checks
 *   exactly this seam itself).
 * - `turnTokenBudget` — Claude Code `TOKEN_BUDGET` analog: steer the model to
 *   keep working up to a token target, stopping at completion ratio or
 *   diminishing returns.
 * - `maxTokensRecoveryLimit` — Claude Code `max_output_tokens` recovery:
 *   steer a resume message after a `max-tokens` finish, up to the limit.
 * - `plan_agent` — a read-only software-architect subagent tool (Claude Code
 *   PLAN_AGENT analog) gated on a subagent provider with `toolFilter`
 *   capability, so the child can only read.
 *
 * Every optional service is read through `ctx.get()` with an undefined
 * check. Enabled completion assessment stops explicitly if its evaluator fails.
 *
 * - Interactive fields are `Volatile`; deployment capture budgets are fixed
 *   for the projection lifetime and require a reload.
 * @module @deepseek-ai/dsh-claude-loop-alignment
 */
import { Context } from '@deepseek-ai/cordis';
import type { Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Plugin name, also the message source tag. */
export declare const name = "claude-loop-alignment";
/** Runtime configuration of the claude-loop-alignment plugin. */
export interface ClaudeLoopAlignmentConfig {
    /** Offer MCP schemas only after scope-preserving discovery; native primary agents only. */
    deferMcpTools: Volatile<boolean>;
    /** Max tool-use steps allowed per user turn; 0 disables the budget. */
    maxToolTurns: Volatile<number>;
    /** Prune tool-result surface once measured pressure exceeds this ratio of the routed model's context window. */
    snipAtRatio: Volatile<number>;
    /** Call ctx.compaction.compactIfNeeded at the same pressure point; keep 0 when compaction-basic runs with auto:true. */
    compactAtRatio: Volatile<number>;
    /** Claude Code TOKEN_BUDGET analog (output tokens per turn); 0 disables. */
    turnTokenBudget: Volatile<number>;
    /** Fraction of the token target where continuation nudges stop and the turn completes. */
    budgetCompletionRatio: Volatile<number>;
    /** Output-token delta below which continuation is judged diminishing. */
    budgetDiminishingDelta: Volatile<number>;
    /** Max consecutive max-tokens resume steers per session; 0 disables recovery. */
    maxTokensRecoveryLimit: Volatile<number>;
    /** Optional model override for the plan subagent (null = inherit). */
    planAgentModel: Volatile<string | null>;
    /** Enable Laya completion assessment for primary tasks. */
    layaReviewEnabled: Volatile<boolean>;
    /** Legacy setting retained for profile compatibility; non-coding tasks always skip supervision. */
    layaReviewCodeOnly: Volatile<boolean>;
    /** Legacy item classifier setting retained for profile compatibility; coding items use execution evidence. */
    layaReviewTaskTypeGate: Volatile<boolean>;
    /** Every item and the final overall percentage must meet this threshold. */
    layaReviewThreshold: Volatile<number>;
    /** Automatic repair limit; 0 continues until approval or external interruption. */
    layaReviewMaxRepairs: Volatile<number>;
    /** Assessment timeout in milliseconds. */
    layaReviewTimeoutMs: Volatile<number>;
    /** Consecutive unchanged repair candidates before stopping; 0 disables stagnation detection. */
    layaReviewStallRounds: Volatile<number>;
    /** Legacy capture setting retained for configuration compatibility; receipt fields own item evidence. */
    layaReviewEvidenceEntries: number;
    /** Legacy capture setting retained for configuration compatibility; receipt fields own item evidence. */
    layaReviewEvidenceCharacters: number;
    /** Capture budget, fixed for the lifetime of this projection. */
    layaReviewHistoryEntries: number;
    /** Capture budget, fixed for the lifetime of this projection. */
    layaReviewRequirementCharacters: number;
    /** Capture budget, fixed for the lifetime of this projection. */
    layaReviewOutputCharacters: number;
    /** Maximum immutable task requirements in one turn. */
    layaReviewTaskLimit: number;
    /** Recent receipts retained in addition to receipts referenced by tasks. */
    layaReviewReceiptEntries: number;
    /** Per-receipt excerpt capture budget. */
    layaReviewReceiptCharacters: number;
    /** Maximum complete plan.md text; oversized files are rejected, never truncated. */
    layaReviewPlanCharacters: number;
}
/** Loader input: every field optional, carrying its plain pre-volatile type. */
export interface ClaudeLoopAlignmentInput {
    deferMcpTools?: boolean;
    maxToolTurns?: number;
    snipAtRatio?: number;
    compactAtRatio?: number;
    turnTokenBudget?: number;
    budgetCompletionRatio?: number;
    budgetDiminishingDelta?: number;
    maxTokensRecoveryLimit?: number;
    planAgentModel?: string | null;
    layaReviewEnabled?: boolean;
    layaReviewCodeOnly?: boolean;
    layaReviewTaskTypeGate?: boolean;
    layaReviewThreshold?: number;
    layaReviewMaxRepairs?: number;
    layaReviewTimeoutMs?: number;
    layaReviewStallRounds?: number;
    layaReviewEvidenceEntries?: number;
    layaReviewEvidenceCharacters?: number;
    layaReviewHistoryEntries?: number;
    layaReviewRequirementCharacters?: number;
    layaReviewOutputCharacters?: number;
    layaReviewTaskLimit?: number;
    layaReviewReceiptEntries?: number;
    layaReviewReceiptCharacters?: number;
    layaReviewPlanCharacters?: number;
}
export declare const Config: z<ClaudeLoopAlignmentInput, ClaudeLoopAlignmentConfig>;
/** Durable assessment state uses the shared session and projection services. The tool registry is
 * declared so `laya_tasks` and `snip` register after it exists: reading `ctx.get('tools')` during
 * apply returned undefined whenever this plugin applied first, and registration was skipped silently. */
export declare const inject: string[];
/**
 * Plugin entry: registers loop hooks and task-checklist, snip and planning tools.
 * @param ctx - plugin context.
 * @param config - validated plugin configuration.
 */
export declare function apply(ctx: Context, config: ClaudeLoopAlignmentConfig): void;
