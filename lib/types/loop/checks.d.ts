export interface CheckResult {
    command: string;
    exitCode: number | null;
    output: string;
    timedOut: boolean;
    denied?: string;
}
/** One command runner; production routes through the deployment shell and approval services. */
export type CheckRunner = (command: string, cwd: string, signal: AbortSignal) => Promise<CheckResult>;
export declare const CHECK_OUTPUT_LIMIT = 4000;
/**
 * Environment retained for plan checks. Provider and cloud credentials are not
 * copied; the shell executor additionally applies its own credential scrub.
 * @returns the minimal environment entries present on this host.
 */
export declare function checkEnvironment(): Record<string, string>;
/** Direct fallback used only when the deployment composes no shell executor. */
export declare const directCheckRunner: CheckRunner;
/**
 * Run declared shell commands sequentially in the job workspace.
 * @param cwd - session working directory the plan was written for.
 * @param commands - plan.md `checks` entries.
 * @param signal - cancellation; aborted runs reject instead of returning partial results.
 * @param run - execution path; defaults to the direct fallback for compositions without a shell service.
 * @returns one bounded result per command, in declaration order.
 */
export declare function runChecks(cwd: string, commands: readonly string[], signal: AbortSignal, run?: CheckRunner): Promise<CheckResult[]>;
