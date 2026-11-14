import type { LayaTaskAssessment, LayaTaskItem } from '../laya/types.ts';
import type { ReviewState } from './completion-review.ts';
/** Stable digest of one JSON-serializable value. */
export declare function digest(value: unknown): string;
/** Fingerprint one item plus the receipts it cites, so a cached judgment is reused only for identical evidence. */
export declare function fingerprint(task: LayaTaskItem, receipts: Record<string, string>): string;
/** Merge declared tasks with cached assessments, reusing a judgment only when its fingerprint is unchanged. */
export declare function displayedItems(state: ReviewState, threshold: number): LayaTaskAssessment[];
/**
 * Expand reopened ids to every task that depends on them, transitively.
 * Reopening T1 must also reopen T2 that depends on T1, otherwise a stale pass
 * would survive a change to its prerequisite.
 * @param tasks - authoritative task list.
 * @param ids - directly invalidated task ids.
 * @returns the directly invalidated ids plus all transitive dependents.
 */
export declare function expandAffected(tasks: readonly LayaTaskItem[], ids: readonly string[]): Set<string>;
/** Reset the named items to pending while preserving every other item. */
export declare function reopen(tasks: readonly LayaTaskItem[], ids: ReadonlySet<string>): LayaTaskItem[];
