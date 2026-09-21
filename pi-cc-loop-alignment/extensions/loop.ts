/**
 * cc-loop-alignment — loop mechanisms (dsh host half, ported).
 *
 * Three mechanisms live here, all driven from pi lifecycle hooks:
 *
 * - maxToolTurns: counts assistant steps that produced tool calls within one
 *   user turn. On reaching the cap a single "stop now" instruction is steered
 *   into the running loop; if the model calls tools again the batch is blocked
 *   with `terminate`, which closes the turn.
 * - token budget: while the per-turn output budget is unmet and the model
 *   stopped calling tools, a nudge continuation is steered in. Three
 *   consecutive continuations that each add fewer than
 *   `budgetDiminishingDelta` tokens end the nudging (diminishing returns).
 * - max-output-tokens recovery: after a step whose `stopReason` is `length`,
 *   the Claude Code "Resume directly" message is steered in, up to
 *   `maxTokensRecoveryLimit` times.
 * - pressure compaction: optional `ctx.compact()` once context pressure
 *   reaches `compactAtRatio` (evaluated when the agent settles, never
 *   mid-stream).
 */

import type { ExtensionAPI, ExtensionContext, ToolCallEventResult, TurnEndEvent } from "@earendil-works/pi-coding-agent";
import type { CcLoopConfig, CcLoopStats } from "./config.ts";
import { scalePressureRatio } from "./config.ts";
import { MAX_TOKENS_RESUME, TOOL_BUDGET_BLOCK_REASON, budgetNudge, turnBudgetStop } from "./prompts.ts";

/** Minimal structural view of an assistant message; avoids importing ai types. */
interface AssistantLike {
	role: "assistant";
	usage?: { output?: number };
	stopReason?: string;
}

function asAssistant(message: unknown): AssistantLike | undefined {
	if (!message || typeof message !== "object") return undefined;
	const candidate = message as { role?: string };
	return candidate.role === "assistant" ? (message as AssistantLike) : undefined;
}

/** Stop nudging after this many consecutive continuations. */
const DIMINISHING_MIN_CONTINUATIONS = 3;
/** Cooldown between extension-triggered compactions. */
const COMPACT_COOLDOWN_MS = 60_000;

export type LoopLog = (ctx: ExtensionContext | undefined, text: string) => void;

export class LoopController {
	private toolSteps = 0;
	private graceInjected = false;
	private blockTools = false;
	private outputTokens = 0;
	private continuationCount = 0;
	private lastMeteredTokens = 0;
	private lastDeltaTokens = 0;
	private maxTokenRecoveries = 0;
	private lastCompactAt = 0;

	constructor(
		private readonly pi: ExtensionAPI,
		private readonly config: () => CcLoopConfig,
		private readonly stats: CcLoopStats,
		private readonly log: LoopLog,
	) {}

	/** Called once per user prompt: clears all per-user-turn state. */
	resetForUserTurn(): void {
		this.toolSteps = 0;
		this.graceInjected = false;
		this.blockTools = false;
		this.outputTokens = 0;
		this.continuationCount = 0;
		this.lastMeteredTokens = 0;
		this.lastDeltaTokens = 0;
		this.maxTokenRecoveries = 0;
	}

	/** Blocks tool calls after the grace step — only in `toolBudgetMode: "block"`. */
	onToolCall(): ToolCallEventResult | undefined {
		if (!this.config().enabled) return undefined;
		if (!this.blockTools) return undefined;
		this.stats.toolCallBlocks += 1;
		return { block: true, reason: TOOL_BUDGET_BLOCK_REASON, terminate: true };
	}

	/** Drives the budget, recovery, and stop instructions after each step. */
	onTurnEnd(event: TurnEndEvent, ctx: ExtensionContext): void {
		const config = this.config();
		if (!config.enabled) return;

		const assistant = asAssistant(event.message);
		if (!assistant) return;
		if (typeof assistant.usage?.output === "number") this.outputTokens += assistant.usage.output;

		if (this.recoverFromOutputCap(assistant, config, ctx)) return;
		if (this.enforceToolBudget(event, config, ctx)) return;
		this.nudgeForTokenBudget(event, config, ctx);
	}

	/** Optional pressure compaction, evaluated only when the run has settled. */
	onSettled(ctx: ExtensionContext): void {
		const config = this.config();
		if (!config.enabled || config.compactAtRatio <= 0) return;
		if (Date.now() - this.lastCompactAt < COMPACT_COOLDOWN_MS) return;
		const usage = ctx.getContextUsage();
		if (!usage || usage.percent === null) return;
		const threshold = scalePressureRatio(config.compactAtRatio, usage.contextWindow);
		if (usage.percent / 100 < threshold) return;
		this.lastCompactAt = Date.now();
		this.stats.compactions += 1;
		this.log(ctx, `pressure compaction at ${Math.round(usage.percent)}%`);
		// Note: the callbacks fire after the session is replaced by the compaction,
		// so they must not touch the captured `ctx` (it becomes stale).
		ctx.compact({
			customInstructions: "Preserve decisions, file paths, and open tasks; drop stale tool output.",
			onError: (error) => console.error(`[cc-loop] pressure compaction failed: ${error.message}`),
		});
	}

	/** Claude Code `max_output_tokens` recovery. Returns true when it steered. */
	private recoverFromOutputCap(
		assistant: AssistantLike,
		config: CcLoopConfig,
		ctx: ExtensionContext,
	): boolean {
		if (assistant.stopReason !== "length") {
			this.maxTokenRecoveries = 0;
			return false;
		}
		if (config.maxTokensRecoveryLimit <= 0) return false;
		if (this.maxTokenRecoveries >= config.maxTokensRecoveryLimit) {
			this.log(ctx, `max-token recovery exhausted (${this.maxTokenRecoveries})`);
			return false;
		}
		this.maxTokenRecoveries += 1;
		this.stats.maxTokenRecoveries += 1;
		this.log(ctx, `max-token recovery #${this.maxTokenRecoveries}`);
		this.pi.sendMessage(
			{ customType: "cc-loop", content: MAX_TOKENS_RESUME, display: true },
			{ deliverAs: "steer" },
		);
		return true;
	}

	/**
	 * Claude Code `max_turns` budget. Returns true when the turn was steered to
	 * a stop (grace instruction) or is already past the grace step.
	 */
	private enforceToolBudget(
		event: TurnEndEvent,
		config: CcLoopConfig,
		ctx: ExtensionContext,
	): boolean {
		if (config.maxToolTurns <= 0) return false;
		if (event.toolResults.length === 0) return false;
		this.toolSteps += 1;
		if (this.toolSteps < config.maxToolTurns) return false;
		if (this.graceInjected) return false;
		this.graceInjected = true;
		if (config.toolBudgetMode === "block") this.blockTools = true;
		this.stats.toolBudgetHits += 1;
		this.log(
			ctx,
			`tool budget ${this.toolSteps}/${config.maxToolTurns}: stop instruction steered (mode: ${config.toolBudgetMode})`,
		);
		this.pi.sendMessage(
			{
				customType: "cc-loop",
				content: turnBudgetStop(config.maxToolTurns, this.toolSteps),
				display: true,
			},
			{ deliverAs: "steer" },
		);
		return true;
	}

	/** Claude Code token-budget nudge continuation with diminishing-returns stop. */
	private nudgeForTokenBudget(
		event: TurnEndEvent,
		config: CcLoopConfig,
		ctx: ExtensionContext,
	): void {
		if (config.turnTokenBudget <= 0) return;
		// Only nudge when the model stopped calling tools; otherwise the turn is
		// still making progress on its own.
		if (event.toolResults.length > 0) return;

		const tokens = this.outputTokens;
		const percent = Math.round((tokens / config.turnTokenBudget) * 100);
		const delta = tokens - this.lastMeteredTokens;
		const diminishing =
			this.continuationCount >= DIMINISHING_MIN_CONTINUATIONS &&
			delta < config.budgetDiminishingDelta &&
			this.lastDeltaTokens < config.budgetDiminishingDelta;

		if (!diminishing && tokens < config.turnTokenBudget * config.budgetCompletionRatio) {
			this.continuationCount += 1;
			this.lastDeltaTokens = delta;
			this.lastMeteredTokens = tokens;
			this.stats.budgetNudges += 1;
			this.log(ctx, `token budget nudge #${this.continuationCount} at ${percent}%`);
			this.pi.sendMessage(
				{
					customType: "cc-loop",
					content: budgetNudge(percent, tokens, config.turnTokenBudget),
					display: true,
				},
				{ deliverAs: "steer" },
			);
			return;
		}
		if (diminishing || this.continuationCount > 0) {
			this.log(ctx, `token budget turn complete at ${percent}%${diminishing ? " (diminishing returns)" : ""}`);
		}
	}
}
