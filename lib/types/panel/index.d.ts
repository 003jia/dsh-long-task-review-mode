/** Host observer for the loop-flow panel, driven solely by committed session events. */
import type { Context } from '@deepseek-ai/cordis';
import schema from '@deepseek-ai/schemastery';
export type { LoopFlow, LoopPhase, LoopStep, LoopTool, LoopReview, LoopTask, LoopTaskReview, ToolUsageView, ToolUsageRow } from './types.ts';
/** Loader plugin identity. */
export declare const name = "client-ui-loop-flow";
/** The projection registry owns replay, publication, and subscription disposal. */
export declare const inject: string[];
/** Deployment choice for retained execution history. */
export interface Config {
    maxSteps: number;
    maxReviews: number;
}
/** Validated Loader configuration. */
export declare const Config: schema<Schemastery.ObjectS<NoInfer<{
    maxSteps: schema<number, number, "defined">;
    maxReviews: schema<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    maxSteps: schema<number, number, "defined">;
    maxReviews: schema<number, number, "defined">;
}>>, "plain">;
/**
 * Register the latest-turn execution projection. No model-facing input is added.
 * @param ctx - host context with session projections.
 * @param config - validated plugin configuration.
 */
export declare function apply(ctx: Context, config: Config): void;
