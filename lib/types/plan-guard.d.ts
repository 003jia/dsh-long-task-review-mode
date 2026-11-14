/** Read-only tool scope for the plan subagent. Mounted by the long-task-plan preset. */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "long-task-plan-guard";
export declare const inject: string[];
/** Restrict the mounting scope to read-only inspection tools. */
export declare function apply(ctx: Context): void;
