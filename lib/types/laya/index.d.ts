/** One local Laya MCP connection shared by model tools and task evaluation. */
import { type Context, type Volatile } from '@deepseek-ai/cordis';
import schema from '@deepseek-ai/schemastery';
import type { LayaSettings } from './types.ts';
export type { LayaCompletionRequest, LayaTaskItem, LayaTaskAssessment, LayaGap, LayaCompletionScore, LayaCompletionReview, LayaCompletionEvaluator, LayaCompletionHistory } from './types.ts';
/** The profile stores this object atomically; saves explicitly reconcile the connection. */
export interface Config {
    /** Executable, device, preload, cache and call-budget controls. */
    preferences: Volatile<LayaSettings>;
    /** Initialization deadline, including discovery and the first status request. */
    startupTimeoutMs: number;
    /** Complete original JSON response budget for the settings page. */
    maxResponseCharacters: number;
    /** UTF-8 state budget stays below the checkpoint's token ceiling; larger inputs are refused. */
    completionInputBytes: number;
    /** Answering budget for the locally installed 8192-position ModernBERT checkpoints. */
    completionMaxTokens: number;
}
/** Loader identity; settings writes target the bundle's ui-laya row. */
export declare const name = "client-ui-laya";
/** Host registry is available before mounting the controller. */
export declare const inject: string[];
/** Local model defaults do not require a wrapper or a model download. */
export declare const Config: schema<Schemastery.ObjectS<NoInfer<{
    preferences: schema<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: schema<boolean, boolean, "defined">;
        launcher: schema<string, string, "defined">;
        device: schema<"auto" | "cpu" | "mps" | "cuda", "auto" | "cpu" | "mps" | "cuda", "defined">;
        models: schema<string[], string[], "defined">;
        preload: schema<boolean, boolean, "defined">;
        offline: schema<boolean, boolean, "defined">;
        timeoutMs: schema<number, number, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: schema<boolean, boolean, "defined">;
        launcher: schema<string, string, "defined">;
        device: schema<"auto" | "cpu" | "mps" | "cuda", "auto" | "cpu" | "mps" | "cuda", "defined">;
        models: schema<string[], string[], "defined">;
        preload: schema<boolean, boolean, "defined">;
        offline: schema<boolean, boolean, "defined">;
        timeoutMs: schema<number, number, "defined">;
    }>>>, "volatile">;
    startupTimeoutMs: schema<number, number, "defined">;
    maxResponseCharacters: schema<number, number, "defined">;
    completionInputBytes: schema<number, number, "defined">;
    completionMaxTokens: schema<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    preferences: schema<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: schema<boolean, boolean, "defined">;
        launcher: schema<string, string, "defined">;
        device: schema<"auto" | "cpu" | "mps" | "cuda", "auto" | "cpu" | "mps" | "cuda", "defined">;
        models: schema<string[], string[], "defined">;
        preload: schema<boolean, boolean, "defined">;
        offline: schema<boolean, boolean, "defined">;
        timeoutMs: schema<number, number, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: schema<boolean, boolean, "defined">;
        launcher: schema<string, string, "defined">;
        device: schema<"auto" | "cpu" | "mps" | "cuda", "auto" | "cpu" | "mps" | "cuda", "defined">;
        models: schema<string[], string[], "defined">;
        preload: schema<boolean, boolean, "defined">;
        offline: schema<boolean, boolean, "defined">;
        timeoutMs: schema<number, number, "defined">;
    }>>>, "volatile">;
    startupTimeoutMs: schema<number, number, "defined">;
    maxResponseCharacters: schema<number, number, "defined">;
    completionInputBytes: schema<number, number, "defined">;
    completionMaxTokens: schema<number, number, "defined">;
}>>, "plain">;
/** @param ctx - plugin scope owning the Remote registration and controller lifetime. @param config - validated deployment settings. */
export declare function apply(ctx: Context, config: Config): void;
