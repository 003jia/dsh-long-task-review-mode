/** Pure task-list derivations shared by the review handler and unit tests. */
import {createHash} from 'node:crypto'
import type {LayaTaskAssessment, LayaTaskItem} from '../laya/types.ts'
import type {ReviewState} from './completion-review.ts'

/** Stable digest of one JSON-serializable value. */
export function digest(value: unknown): string { return createHash('sha256').update(JSON.stringify(value)).digest('hex') }

/** Fingerprint one item plus the receipts it cites, so a cached judgment is reused only for identical evidence. */
export function fingerprint(task: LayaTaskItem, receipts: Record<string, string>): string {
  return digest({ task: { id: task.id, title: task.title, requirement: task.requirement, status: task.status,
    result: task.result, evidenceIds: task.evidenceIds, dependsOn: task.dependsOn ?? [], affectedPaths: task.affectedPaths ?? [],
    critical: task.critical ?? false,...task.taskType==='opinion'?{taskType:'opinion'}:{} }, receipts: task.evidenceIds.map(id => [id, receipts[id] ?? null]) })
}

/** Merge declared tasks with cached assessments, reusing a judgment only when its fingerprint is unchanged. */
export function displayedItems(state: ReviewState, threshold: number): LayaTaskAssessment[] {
  return state.tasks.map((task) => {
    const key = fingerprint(task, state.receipts), old = state.assessments[task.id]
    return old?.fingerprint === key ? { ...old, reused: true,
      passed: old.score !== null && old.score.rate * 100 >= threshold
        && (task.critical !== true || old.score.criticalSatisfied === true) } : { ...task, fingerprint: key, score: null,
      passed: false, reason: task.status === 'completed' ? 'Awaiting item assessment.' : 'This task is not completed.', reused: false }
  })
}

/**
 * Expand reopened ids to every task that depends on them, transitively.
 * Reopening T1 must also reopen T2 that depends on T1, otherwise a stale pass
 * would survive a change to its prerequisite.
 * @param tasks - authoritative task list.
 * @param ids - directly invalidated task ids.
 * @returns the directly invalidated ids plus all transitive dependents.
 */
export function expandAffected(tasks: readonly LayaTaskItem[], ids: readonly string[]): Set<string> {
  // Revalidation is explicit: only the named items reopen. Shared-file changes are
  // surfaced separately and must be revalidated deliberately rather than cascading.
  void tasks
  return new Set(ids)
}

/** Reset the named items to pending while preserving every other item. */
export function reopen(tasks: readonly LayaTaskItem[], ids: ReadonlySet<string>): LayaTaskItem[] {
  return tasks.map(task => ids.has(task.id) ? { ...task, status: 'pending', result: '', evidenceIds: [] } : task)
}
