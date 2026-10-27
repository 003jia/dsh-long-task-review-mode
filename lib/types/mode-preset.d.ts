/** Add one native choice using the deployment's existing Standard composition. */
import { Service, type Context } from '@deepseek-ai/cordis';
export declare const LONG_TASK_PRESET = "long-task";
export declare class LongTaskPreset {
    private ctx;
    static inject: string[];
    constructor(ctx: Context);
    [Service.init](): AsyncGenerator<() => Promise<void>, void, unknown>;
}
