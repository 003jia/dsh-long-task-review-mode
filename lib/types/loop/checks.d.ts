export interface CheckResult {
    command: string;
    exitCode: number | null;
    output: string;
    timedOut: boolean;
}
/**
 * Run declared shell commands sequentially in the job workspace.
 * @param cwd - session working directory the plan was written for.
 * @param commands - plan.md `checks` entries, executed via `sh -c`.
 * @param signal - cancellation; aborted runs reject instead of returning partial results.
 * @returns one bounded result per command, in declaration order.
 */
export declare function runChecks(cwd: string, commands: readonly string[], signal: AbortSignal): Promise<CheckResult[]>;
