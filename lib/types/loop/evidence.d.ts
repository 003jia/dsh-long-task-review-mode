/**
 * Collect bounded evidence for declared affected paths: tracked changes via git diff
 * when available, plus head excerpts of readable text files (covers untracked files).
 * Binary, oversized, missing and out-of-workspace paths contribute nothing.
 * @param cwd - session working directory.
 * @param paths - plan-declared affected paths, relative to cwd.
 * @param signal - cancellation.
 * @returns evidence text, possibly empty; never throws for unreadable paths.
 */
export declare function codeEvidence(cwd: string, paths: readonly string[], signal: AbortSignal): Promise<string>;
