/** Single installation unit for explicit long-task execution, local grading and native UI. */
import type { Context, Volatile } from '@deepseek-ai/cordis';
import schema from '@deepseek-ai/schemastery';
import * as Loop from './loop/index.ts';
import * as Laya from './laya/index.ts';
import * as Panel from './panel/index.ts';
import type { ReviewerSelection } from './reviewer-wire.ts';
export type * from './laya/types.ts';
export type * from './panel/types.ts';
export declare const name = "long-task";
export declare const inject: string[];
export interface Config {
    reviewer: Volatile<ReviewerSelection>;
    reviewerMaxInputBytes: number;
    reviewerMaxResponseBytes: number;
    loop: Loop.ClaudeLoopAlignmentConfig;
    laya: Laya.Config;
    panel: Panel.Config;
    noProgressLimit: Volatile<number>;
    maxToolCalls: Volatile<number>;
    maxAssessments: Volatile<number>;
    maxMinutes: Volatile<number>;
    maxModelTokens: Volatile<number>;
    maxCost: Volatile<number>;
    inputPerMillion: Volatile<number>;
    outputPerMillion: Volatile<number>;
}
export declare const Config: schema<Schemastery.ObjectS<NoInfer<{
    reviewer: schema<NoInfer<Schemastery.ObjectS<NoInfer<{
        backend: schema<"laya" | "jev", "laya" | "jev", "defined">;
        endpoint: schema<string, string, "defined">;
        model: schema<string, string, "defined">;
        timeoutMs: schema<number, number, "defined">;
        credentialRef: schema<string, string, "defined">;
        revision: schema<string, string, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        backend: schema<"laya" | "jev", "laya" | "jev", "defined">;
        endpoint: schema<string, string, "defined">;
        model: schema<string, string, "defined">;
        timeoutMs: schema<number, number, "defined">;
        credentialRef: schema<string, string, "defined">;
        revision: schema<string, string, "defined">;
    }>>>, "volatile">;
    reviewerMaxInputBytes: schema<number, number, "defined">;
    reviewerMaxResponseBytes: schema<number, number, "defined">;
    maxModelTokens: schema<number, number, "volatile-defined">;
    maxCost: schema<number, number, "volatile-defined">;
    inputPerMillion: schema<number, number, "volatile-defined">;
    outputPerMillion: schema<number, number, "volatile-defined">;
    loop: schema<Loop.ClaudeLoopAlignmentInput, Loop.ClaudeLoopAlignmentConfig>;
    laya: schema<Schemastery.ObjectS<NoInfer<{
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
    panel: schema<Schemastery.ObjectS<NoInfer<{
        maxSteps: schema<number, number, "defined">;
        maxReviews: schema<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        maxSteps: schema<number, number, "defined">;
        maxReviews: schema<number, number, "defined">;
    }>>, "plain">;
    noProgressLimit: schema<number, number, "volatile-defined">;
    maxToolCalls: schema<number, number, "volatile-defined">;
    maxAssessments: schema<number, number, "volatile-defined">;
    maxMinutes: schema<number, number, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    reviewer: schema<NoInfer<Schemastery.ObjectS<NoInfer<{
        backend: schema<"laya" | "jev", "laya" | "jev", "defined">;
        endpoint: schema<string, string, "defined">;
        model: schema<string, string, "defined">;
        timeoutMs: schema<number, number, "defined">;
        credentialRef: schema<string, string, "defined">;
        revision: schema<string, string, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        backend: schema<"laya" | "jev", "laya" | "jev", "defined">;
        endpoint: schema<string, string, "defined">;
        model: schema<string, string, "defined">;
        timeoutMs: schema<number, number, "defined">;
        credentialRef: schema<string, string, "defined">;
        revision: schema<string, string, "defined">;
    }>>>, "volatile">;
    reviewerMaxInputBytes: schema<number, number, "defined">;
    reviewerMaxResponseBytes: schema<number, number, "defined">;
    maxModelTokens: schema<number, number, "volatile-defined">;
    maxCost: schema<number, number, "volatile-defined">;
    inputPerMillion: schema<number, number, "volatile-defined">;
    outputPerMillion: schema<number, number, "volatile-defined">;
    loop: schema<Loop.ClaudeLoopAlignmentInput, Loop.ClaudeLoopAlignmentConfig>;
    laya: schema<Schemastery.ObjectS<NoInfer<{
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
    panel: schema<Schemastery.ObjectS<NoInfer<{
        maxSteps: schema<number, number, "defined">;
        maxReviews: schema<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        maxSteps: schema<number, number, "defined">;
        maxReviews: schema<number, number, "defined">;
    }>>, "plain">;
    noProgressLimit: schema<number, number, "volatile-defined">;
    maxToolCalls: schema<number, number, "volatile-defined">;
    maxAssessments: schema<number, number, "volatile-defined">;
    maxMinutes: schema<number, number, "volatile-defined">;
}>>, "plain">;
export declare function apply(ctx: Context, config: Config): Promise<void>;
