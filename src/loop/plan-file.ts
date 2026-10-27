/** Validated, replayable plan.md documents. Runtime progress is kept outside the file. */
import { createHash } from 'node:crypto'
import { z } from 'zod'
import type { LayaTaskItem } from '../laya/types.ts'

const text = z.string().trim().min(1).max(1200)
const id = z.string().regex(/^[A-Za-z0-9_-]{1,40}$/)
const specification = z.object({
  id, taskType: z.enum(['execution','opinion']).default('execution'), title: z.string().trim().min(1).max(200), requirement: text,
  deliverables: z.array(text).min(1).max(8), evidence: z.array(text).min(1).max(8),
  dependsOn: z.array(id).max(40), affectedPaths: z.array(z.string().trim().min(1).max(4096)).max(32),
  critical: z.boolean(),
}).strict()

/** Versioned plan data accepted only from the file parser or a durable recorded snapshot. */
export const planDocumentSchema = z.object({
  format: z.literal('claude-loop-plan/v1'), revision: z.number().int().positive(),
  goal: text, scope: text, tasks: z.array(specification).min(1).max(100),
  exceptions: z.object({ recoverable: text, revisePlan: text, blocked: text }).strict(),
  changes: z.array(z.object({ revision: z.number().int().positive(), reason: text,
    affectedTaskIds: z.array(id).min(1).max(100) }).strict()).max(100),
}).strict()

/** The accepted file and its exact hash, suitable for replay without accessing today's filesystem. */
export const boundPlanSchema = z.object({
  path: z.string(), directory: z.string(), hash: z.string(), document: planDocumentSchema,
})
export type PlanDocument = z.infer<typeof planDocumentSchema>
export type BoundPlan = z.infer<typeof boundPlanSchema>

/** Example returned to the primary model before it creates the task's own plan.md. */
export const planTemplate = '# Task plan\n\n```json\n' + JSON.stringify({
  format: 'claude-loop-plan/v1', revision: 1, goal: 'Overall task goal', scope: 'Included scope and constraints',
  tasks: [{ id: 'T1', title: 'First deliverable', requirement: 'Specific acceptance criteria',
    deliverables: ['Expected artifact or behavior'], evidence: ['Actual verification needed'],
    dependsOn: [], affectedPaths: ['path/to/deliverable'], taskType:'execution', critical: true }],
  exceptions: { recoverable: 'Retry or repair the current item and resubmit evidence.',
    revisePlan: 'Append a revision reason and affected IDs; resync and reassess affected tasks.',
    blocked: 'Record the blocker and needed condition; do not claim completion.' }, changes: [],
}, null, 2) + '\n```\n'

/**
 * Parse exactly one JSON block in plan.md and validate task ordering and revision history.
 * @param content - complete bounded Markdown text.
 * @param taskLimit - configured maximum task count.
 * @returns the authoritative plan document.
 */
export function parsePlan(content: string, taskLimit: number): PlanDocument {
  const blocks = [...content.matchAll(/^```json\s*\r?\n([\s\S]*?)^```\s*$/gm)]
  if (blocks.length !== 1) throw new Error('plan.md must contain exactly one fenced json block; see docs/plan-template.md.')
  const plan = planDocumentSchema.parse(JSON.parse(blocks[0]![1]!))
  if (plan.tasks.length > taskLimit) throw new Error(`plan.md exceeds the configured ${taskLimit} task limit.`)
  const earlier = new Set<string>()
  for (const task of plan.tasks) {
    if (earlier.has(task.id)) throw new Error(`Duplicate plan task ${task.id}.`)
    if (task.dependsOn.some(value => !earlier.has(value))) throw new Error(`Dependencies of ${task.id} must name earlier tasks.`)
    if (planRequirement(task).length > 1200) throw new Error(`Combined acceptance criteria, deliverables and evidence for ${task.id} exceed 1200 characters.`)
    earlier.add(task.id)
  }
  let revision = 1
  for (const change of plan.changes) {
    if (change.revision !== ++revision || change.affectedTaskIds.some(value => !earlier.has(value))) {
      throw new Error('Plan changes must list consecutive revisions and existing affected task IDs.')
    }
  }
  if (plan.revision !== revision) throw new Error('Plan revision must match its complete change history, starting at revision 1.')
  return plan
}

/**
 * Hash the complete file, including explanatory Markdown.
 * @param content - complete file text.
 * @returns SHA-256 identifying the imported file.
 */
export function planHash(content: string): string { return createHash('sha256').update(content).digest('hex') }

function planRequirement(task: PlanDocument['tasks'][number]): string {
  return `${task.requirement}\nDeliverables:\n${task.deliverables.join('\n')}\nVerification evidence:\n${task.evidence.join('\n')}`
}

/**
 * Derive immutable task definitions while preserving progress of unchanged tasks.
 * @param plan - validated document.
 * @param previous - previously imported runtime items.
 * @returns tasks whose acceptance criteria come only from plan.md.
 */
export function planTasks(plan: PlanDocument, previous: readonly LayaTaskItem[]): LayaTaskItem[] {
  return plan.tasks.map(spec => {
    const definition = { id: spec.id, taskType: spec.taskType, title: spec.title, requirement: planRequirement(spec),
      dependsOn: spec.dependsOn, affectedPaths: spec.affectedPaths, critical: spec.critical }
    const old = previous.find(item => item.id === spec.id)
    return { ...definition, status: old?.status ?? 'pending', result: old?.result ?? '', evidenceIds: old?.evidenceIds ?? [] }
  })
}

/**
 * Validate an explicit revision without deleting or weakening accepted scope.
 * @param old - prior accepted document.
 * @param next - replacement document read from the same file.
 * @returns IDs to reopen, before dependency expansion.
 */
export function revisedTasks(old: PlanDocument, next: PlanDocument): string[] {
  if (JSON.stringify(old) === JSON.stringify(next)) return []
  if (next.revision !== old.revision + 1 || JSON.stringify(next.changes.slice(0, -1)) !== JSON.stringify(old.changes)) {
    throw new Error('Revise plan.md by one revision and append a reason with affectedTaskIds; preserve prior history.')
  }
  if (!next.goal.includes(old.goal) || !next.scope.includes(old.scope)) throw new Error('Preserve the accepted goal and scope; a human scope change starts a new plan.')
  const affected = new Set(next.changes.at(-1)!.affectedTaskIds)
  for (const [index, prior] of old.tasks.entries()) {
    const task = next.tasks[index]
    if (task?.id !== prior.id || task.taskType!==prior.taskType || !task.requirement.includes(prior.requirement)
      || prior.critical && !task.critical
      || (['deliverables', 'evidence', 'dependsOn', 'affectedPaths'] as const).some(key => prior[key].some(value => !task[key].includes(value)))) {
      throw new Error(`Preserve ${prior.id}, its order and accepted requirements. Expand scope explicitly rather than weakening it.`)
    }
    if (JSON.stringify(prior) !== JSON.stringify(task)) affected.add(prior.id)
  }
  for (const task of next.tasks.slice(old.tasks.length)) affected.add(task.id)
  if (old.goal !== next.goal || old.scope !== next.scope || JSON.stringify(old.exceptions) !== JSON.stringify(next.exceptions)) {
    for (const task of next.tasks) affected.add(task.id)
  }
  return [...affected]
}
