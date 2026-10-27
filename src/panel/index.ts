/** Host observer for the loop-flow panel, driven solely by committed session events. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-session-projection'
import schema from '@deepseek-ai/schemastery'
import { emptyLoopFlow, foldLoopFlow, loopFlowSchema } from './projection.ts'
import { emptyToolUsage, foldToolUsage, toolUsageStateSchema, toolUsageView, toolUsageViewSchema } from './tool-usage.ts'
export type { LoopFlow, LoopPhase, LoopStep, LoopTool, LoopReview, LoopTask, LoopTaskReview, ToolUsageView, ToolUsageRow } from './types.ts'

/** Loader plugin identity. */
export const name = 'client-ui-loop-flow'
/** The projection registry owns replay, publication, and subscription disposal. */
export const inject = ['sessionProjections']
/** Deployment choice for retained execution history. */
export interface Config {
  maxSteps: number
  maxReviews: number
}
/** Validated Loader configuration. */
export const Config = schema.object({
  maxSteps: schema.number().min(1).max(500).step(1).default(80),
  maxReviews: schema.number().min(1).max(100).step(1).default(20),
})

/**
 * Register the latest-turn execution projection. No model-facing input is added.
 * @param ctx - host context with session projections.
 * @param config - validated plugin configuration.
 */
export function apply(ctx: Context, config: Config): void {
  ctx.sessionProjections.register({
    key: 'claude-loop-flow', stateSchema: loopFlowSchema, stateVersion: 5,
    init: emptyLoopFlow, apply: (state, event) => foldLoopFlow(state, event, config.maxSteps, config.maxReviews),
    wire: { viewSchema: loopFlowSchema, view: state => state },
  })
  ctx.sessionProjections.register({
    key: 'claude-loop-tool-usage', stateSchema: toolUsageStateSchema, stateVersion: 1,
    init: emptyToolUsage, apply: foldToolUsage,
    wire: { viewSchema: toolUsageViewSchema, view: toolUsageView },
  })
}
