/**
 * dsh-cc-loop-alignment — agent tools.
 *
 * `snip`: model-driven history removal (Claude Code SnipTool analog). Removes
 * the oldest surface nodes before the kept tail and replaces them with one
 * placeholder user message, following the shadow-price protocol used by
 * dsh-tool-result-pruner: a log-only `compaction/prune` pricing event is
 * appended immediately before the surface replacement. No summarizer/LLM call.
 *
 * `plan_agent`: read-only software-architect subagent (Claude Code
 * PLAN_AGENT analog). Delegates planning to a subagent scoped by a read-only
 * tool allowlist and `maxDepth: 1`, returning a step-by-step plan.
 */
import type { Context } from '@deepseek-ai/cordis';
import { type ToolDefinition } from '@deepseek-ai/dsh-tools';
/**
 * Build the `snip` tool.
 * @param ctx - host plugin context (tokenMeter read via ctx.get).
 * @returns the registered tool definition.
 */
export declare function makeSnipTool(ctx: Context): ToolDefinition;
/**
 * Build the `plan_agent` tool.
 * @param ctx - host plugin context (subagents read via ctx.get).
 * @returns the registered tool definition.
 */
export declare function makePlanAgentTool(ctx: Context): ToolDefinition;
