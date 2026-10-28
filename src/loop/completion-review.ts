/** Primary-model task routing, sequential delivery, per-item review and final requirement assessment. */
import { Context, Service } from '@deepseek-ai/cordis'
import { createHash } from 'node:crypto'
import { z } from 'zod'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ToolRuntime } from '@deepseek-ai/dsh-tools'
import type { ContentBlock, UserMessage } from '@deepseek-ai/dsh-llm'
import type { Agent } from '@deepseek-ai/dsh-agent'
import {readJobRecord} from '../job-record.ts'
import type { SessionId, SessionSeq } from '@deepseek-ai/dsh-session/types'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import type {} from '@deepseek-ai/dsh-session'
import type { LayaCompletionReview, LayaCompletionScore, LayaTaskItem, LayaTaskAssessment, LayaGap } from '../laya/types.ts'
import type { ClaudeLoopAlignmentConfig } from './index.ts'
import { writtenSourcePaths } from './coding-scope.ts'
import type {} from '@deepseek-ai/dsh-fs'
import type {} from '@deepseek-ai/dsh-working-directory'
import { boundPlanSchema, parsePlan, planHash, planTasks, revisedTasks, planTemplate } from './plan-file.ts'
import type { BoundPlan } from './plan-file.ts'
import {hash} from '../artifacts.ts'
import { isPlanningProgram } from './planning-program.ts'

type TaskKind = 'coding' | 'non_coding'
type ReviewMode = 'laya' | 'self' | 'skip'
interface PreviousWork {
  plan: BoundPlan | null
  reviewMode: 'laya' | 'self'
  contextRequirement: string
  tasks: LayaTaskItem[]
  assessments: Record<string, LayaTaskAssessment>
  receipts: Record<string, string>
  exception: ReviewState['exception']
}
export interface ReviewState {
  jobId: string | null
  pendingRequirement:string
  pendingContext:boolean
  threshold: number
  turn: number
  repairs: number
  instructed: boolean
  taskKind: TaskKind | null
  reviewMode: ReviewMode | null
  routingReason: string
  contextRequirement: string
  previousRequirement: string
  previousRequirementIncomplete: boolean
  previousWork: PreviousWork | null
  requirement: string
  requirementIncomplete: boolean
  requiresContextInterpretation: boolean
  output: string
  outputIncomplete: boolean
  outputSeq: SessionSeq | null
  calls: Record<string, { name: string; paths: string[] }>
  receipts: Record<string, string>
  dirtyPaths: string[]
  dirtyPathsIncomplete: boolean
  tasks: LayaTaskItem[]
  taskRequirement: string
  assessments: Record<string, LayaTaskAssessment>
  overallRepair: boolean
  repairAnalysis: string | null
  stalls: number
  lastRepairKey: string
  reviews: LayaCompletionReview[]
  plan: BoundPlan | null
  planError: string | null
  exception: { kind: 'recoverable' | 'blocked'; taskId: string; summary: string } | null
}
declare module '@deepseek-ai/dsh-session-projection' {
  interface SessionProjectionStateMap { claudeCompletionReview: ReviewState }
}
const taskSchema = z.object({
  taskType: z.enum(['execution','opinion']).default('execution'),
  id: z.string().trim().min(1).max(40).regex(/^[A-Za-z0-9_-]+$/), title: z.string().trim().min(1).max(200),
  requirement: z.string().trim().min(1).max(1200), status: z.enum(['pending', 'in_progress', 'completed']),
  result: z.string().max(1200), evidenceIds: z.array(z.string().regex(/^\d+$/)).max(8),
  dependsOn: z.array(z.string()).max(40).default([]), affectedPaths: z.array(z.string().trim().min(1).max(4096)).max(32).default([]),
  critical: z.boolean().default(false),
}).strict()
const taskUpdateSchema = taskSchema.pick({ id: true, status: true, result: true, evidenceIds: true })
const scoreSchema: z.ZodType<LayaCompletionScore> = z.object({
  rate: z.number().min(0).max(1), confidence: z.number().min(0).max(1).nullable(),
  dimensions: z.array(z.object({ name: z.enum(['coverage', 'constraints', 'evidence']), rate: z.number().min(0).max(1) })),
  model: z.string().nullable(), device: z.string().nullable(), elapsedMs: z.number().nonnegative(), json: z.string(),
  gap: z.enum(['missing', 'partial', 'evidence', 'constraints', 'defect', 'none']).optional(), criticalSatisfied: z.boolean().optional(),
})
const itemSchema: z.ZodType<LayaTaskAssessment> = taskSchema.extend({ fingerprint: z.string(), score: scoreSchema.nullable(),
  passed: z.boolean(), reason: z.string(), reused: z.boolean() })
const reviewSchema: z.ZodType<LayaCompletionReview> = z.object({
  sessionId: z.string().transform(value => value as SessionId), turn: z.number().int().nonnegative(),
  attempt: z.number().int().nonnegative(), at: z.number().nonnegative(),
  outputSeq: z.number().int().nonnegative().transform(value => value as SessionSeq).nullable(),
  threshold: z.number().min(0).max(100), maxRepairs: z.number().int().nonnegative(),
  outcome: z.enum(['progress', 'passed', 'repair', 'blocked', 'error']), error: z.string().nullable(),
  requirement: z.string(), output: z.string(), evidence: z.array(z.string()), score: scoreSchema.nullable(),
  policy: z.enum(['task-items-v1', 'task-items-v2']).optional(), stage: z.enum(['tasks', 'overall']).optional(),
  items: z.array(itemSchema).optional(), passedItems: z.number().int().nonnegative().optional(),
  totalItems: z.number().int().nonnegative().optional(), reviewer: z.enum(['laya', 'jev', 'primary']).optional(),
  assessedTaskIds: z.array(z.string()).optional(), currentTaskId: z.string().nullable().optional(),
  repairAnalysis: z.string().nullable().optional(), progressKey: z.string().optional(), stalled: z.boolean().optional(),
})
const planNotice = z.object({ turn: z.number().int(), tasks: z.array(taskSchema),
  plan: boundPlanSchema.nullable().optional(), planError: z.string().nullable().optional(),
  preserveDirty: z.boolean().optional(),
  restoredWork: z.object({ receipts: z.record(z.string(), z.string()), assessments: z.record(z.string(), itemSchema) }).optional(),
  exception: z.object({ kind: z.enum(['recoverable', 'blocked']), taskId: z.string(), summary: z.string() }).nullable().optional(),
  taskKind: z.enum(['coding', 'non_coding']).optional(), reviewMode: z.enum(['laya', 'self', 'skip']).optional(),
  routingReason: z.string().optional(), contextRequirement: z.string().optional(), inheritedRequirement: z.string().optional(),
  inheritedIncomplete: z.boolean().optional(),
  invalidatedTaskIds: z.array(z.string()).optional(), repairAnalysis: z.string().optional(), overallRepairResolved: z.boolean().optional(),
})
const stateSchema: z.ZodType<ReviewState> = z.object({
  jobId:z.string().nullable(),pendingRequirement:z.string().default(''),pendingContext:z.boolean().default(false),threshold:z.number(),
  plan: boundPlanSchema.nullable(), planError: z.string().nullable(),
  exception: z.object({ kind: z.enum(['recoverable', 'blocked']), taskId: z.string(), summary: z.string() }).nullable(),
  turn: z.number().int(), repairs: z.number().int().nonnegative(), instructed: z.boolean(),
  taskKind: z.enum(['coding', 'non_coding']).nullable(), reviewMode: z.enum(['laya', 'self', 'skip']).nullable(), routingReason: z.string(), contextRequirement: z.string(),
  previousRequirement: z.string(), previousRequirementIncomplete: z.boolean(),
  previousWork: z.object({ plan: boundPlanSchema.nullable(), reviewMode: z.enum(['laya', 'self']), contextRequirement: z.string(),
    tasks: z.array(taskSchema), assessments: z.record(z.string(), itemSchema), receipts: z.record(z.string(), z.string()),
    exception: z.object({ kind: z.enum(['recoverable', 'blocked']), taskId: z.string(), summary: z.string() }).nullable(),
  }).nullable(),
  requirement: z.string(), requirementIncomplete: z.boolean(), output: z.string(), outputIncomplete: z.boolean(),
  requiresContextInterpretation: z.boolean(),
  outputSeq: z.number().int().nonnegative().transform(value => value as SessionSeq).nullable(),
  calls: z.record(z.string(), z.object({ name: z.string(), paths: z.array(z.string()) })),
  receipts: z.record(z.string(), z.string()), dirtyPaths: z.array(z.string()), dirtyPathsIncomplete: z.boolean(),
  tasks: z.array(taskSchema), taskRequirement: z.string(),
  assessments: z.record(z.string(), itemSchema), overallRepair: z.boolean(), repairAnalysis: z.string().nullable(),
  stalls: z.number().int().nonnegative(), lastRepairKey: z.string(), reviews: z.array(reviewSchema),
})
const selfReviewSchema = z.object({ stage: z.enum(['tasks', 'overall']), taskId: z.string().optional(),
  rate: z.number().min(0).max(100), reason: z.string().trim().min(1).max(1200),
  candidate: z.string().min(1).max(16000).optional(), criticalSatisfied: z.boolean().optional(),
}).strict()
const overallRepairSchema = z.object({ affectedTaskIds: z.array(z.string()).max(40),
  analysis: z.string().trim().min(1).max(1200), defectEvidenceIds:z.array(z.string()).max(8).optional(), summaryOnly: z.boolean().optional() }).strict()
const gaps: Record<LayaGap, string> = {
  missing: 'A requested deliverable or scope item is missing.', partial: 'Requested behavior is only partially delivered.',
  evidence: 'The supplied evidence does not sufficiently substantiate completion.', constraints: 'A requirement or user constraint is not satisfied.',
  defect: 'The recorded result contains a defect or failed operation.',
  none: 'The completion estimate is below the threshold; inspect the requirement and evidence for remaining gaps.',
}
// A missing routing/checklist declaration is a protocol error, not unlimited quality repair.
const PROTOCOL_ROUND_LIMIT = 2
function textOf(content: readonly ContentBlock[]): string {
  return content.flatMap(block => block.type === 'text' ? [block.text] : []).join('\n')
}
function digest(value: unknown): string { return createHash('sha256').update(JSON.stringify(value)).digest('hex') }
function fingerprint(task: LayaTaskItem, receipts: Record<string, string>): string {
  return digest({ task: { id: task.id, title: task.title, requirement: task.requirement, status: task.status,
    result: task.result, evidenceIds: task.evidenceIds, dependsOn: task.dependsOn ?? [], affectedPaths: task.affectedPaths ?? [],
    critical: task.critical ?? false,...task.taskType==='opinion'?{taskType:'opinion'}:{} }, receipts: task.evidenceIds.map(id => [id, receipts[id] ?? null]) })
}
function displayedItems(state: ReviewState, threshold: number): LayaTaskAssessment[] {
  return state.tasks.map((task) => {
    const key = fingerprint(task, state.receipts), old = state.assessments[task.id]
    return old?.fingerprint === key ? { ...old, reused: true,
      passed: old.score !== null && old.score.rate * 100 >= threshold
        && (task.critical !== true || old.score.criticalSatisfied === true) } : { ...task, fingerprint: key, score: null,
      passed: false, reason: task.status === 'completed' ? 'Awaiting item assessment.' : 'This task is not completed.', reused: false }
  })
}
function expandAffected(tasks: readonly LayaTaskItem[], ids: readonly string[]): Set<string> {
  return new Set(ids)
}
function normalizedPath(path: string): string { return path.replace(/\\/g, '/').replace(/^\.\//, '') }
function dirtyItems(state: ReviewState): Set<string> {
  if (state.dirtyPathsIncomplete) return expandAffected(state.tasks, Object.keys(state.assessments))
  const ids = state.tasks.filter(task => state.assessments[task.id] !== undefined && (task.affectedPaths ?? []).some((path) => {
    const tracked = normalizedPath(path)
    return state.dirtyPaths.some((value) => {
      const changed = normalizedPath(value)
      return tracked === changed || tracked.endsWith('/' + changed) || changed.endsWith('/' + tracked)
    })
  })).map(task => task.id)
  return expandAffected(state.tasks, ids)
}
function reopen(tasks: readonly LayaTaskItem[], ids: ReadonlySet<string>): LayaTaskItem[] {
  return tasks.map(task => ids.has(task.id) ? { ...task, status: 'pending', result: '', evidenceIds: [] } : task)
}
function definition(config: ClaudeLoopAlignmentConfig): ProjectionDefinition<'claudeCompletionReview'> {
  const empty = (): ReviewState => ({ jobId:null,pendingRequirement:'',pendingContext:false,threshold:config.layaReviewThreshold.get(),turn: -1, repairs: 0, instructed: false, taskKind: null, reviewMode: null, routingReason: '', contextRequirement: '',
    previousRequirement: '', previousRequirementIncomplete: false, previousWork: null, requirement: '', requirementIncomplete: false, requiresContextInterpretation: false,
    output: '', outputIncomplete: false, outputSeq: null, calls: {}, receipts: {}, dirtyPaths: [], dirtyPathsIncomplete: false, tasks: [], taskRequirement: '',
    assessments: {}, overallRepair: false, repairAnalysis: null, stalls: 0, lastRepairKey: '', reviews: [], plan: null, planError: null, exception: null })
  return { key: 'claudeCompletionReview', stateVersion: 8, stateSchema, init: empty,
    apply(state, event) {
      const record=readJobRecord(event)
      if(record){const job=record;if(job.jobId!==null&&job.jobId!==state.jobId)return {...empty(),turn:state.turn,jobId:job.jobId,threshold:job.threshold,...job.inputTurn===state.turn?{requirement:state.pendingRequirement.slice(0,config.layaReviewRequirementCharacters),requiresContextInterpretation:state.pendingContext,requirementIncomplete:state.pendingRequirement.length>config.layaReviewRequirementCharacters}:{}};return state}
      switch (event.type) {
        case 'turn/start': if(state.jobId!==null)return {...state,turn:event.data.turn,pendingRequirement:'',pendingContext:false,output:'',outputSeq:null,outputIncomplete:false,instructed:false}
          return { ...empty(), turn: event.data.turn, reviews: state.reviews,
          previousRequirement: state.taskKind === 'coding' ? state.requirement : state.previousRequirement,
          previousRequirementIncomplete: state.taskKind === 'coding' ? (state.requirementIncomplete
            || state.requiresContextInterpretation && state.contextRequirement.trim() === '') : state.previousRequirementIncomplete,
          previousWork: state.taskKind === 'coding' && (state.reviewMode === 'laya' || state.reviewMode === 'self')
            ? { plan: state.plan, reviewMode: state.reviewMode, contextRequirement: state.contextRequirement, tasks: state.tasks,
              assessments: state.assessments, receipts: state.receipts, exception: state.exception } : state.previousWork }
        case 'user/message': {
          const source = event.data.source
          if(source.kind==='long-task-state'&&source.job&&typeof source.job==='object'&&'jobId' in source.job){
            const job=source.job as {jobId:string|null;threshold:number}
            if(job.jobId!==null&&job.jobId!==state.jobId)return {...empty(),turn:state.turn,jobId:job.jobId,threshold:job.threshold}
            return state
          }
          if (source.kind === 'laya-task-protocol') return { ...state, instructed: true }
          if (source.kind === 'laya-task-list') {
            const parsed = planNotice.safeParse(source)
            if (!parsed.success || parsed.data.turn !== state.turn) return state
            const plan = parsed.data
            const requirement = [plan.inheritedRequirement, state.requirement].filter(Boolean).join('\n\n')
            const invalidated = new Set(plan.invalidatedTaskIds ?? [])
            const receipts = plan.restoredWork?.receipts ?? state.receipts
            const assessments = Object.fromEntries(Object.entries(plan.restoredWork?.assessments ?? state.assessments).filter(([id, item]) => {
              const task = plan.tasks.find(task => task.id === id)
              return !invalidated.has(id) && task !== undefined && item.fingerprint === fingerprint(task, receipts)
            }))
            return { ...state, taskKind: plan.taskKind ?? state.taskKind ?? 'coding',
              plan: plan.plan === undefined ? state.plan : plan.plan,
              planError: plan.planError === undefined ? state.planError : plan.planError,
              exception: plan.exception === undefined ? state.exception : plan.exception,
              reviewMode: plan.reviewMode ?? state.reviewMode ?? 'laya', routingReason: plan.routingReason ?? state.routingReason,
              tasks: plan.tasks, taskRequirement: requirement, assessments, receipts,
              dirtyPaths: plan.preserveDirty === true ? state.dirtyPaths : [],
              dirtyPathsIncomplete: plan.preserveDirty === true && state.dirtyPathsIncomplete,
              contextRequirement: plan.contextRequirement ?? state.contextRequirement,
              requirement: requirement.slice(0, config.layaReviewRequirementCharacters),
              requirementIncomplete: state.requirementIncomplete || plan.inheritedIncomplete === true
                || requirement.length > config.layaReviewRequirementCharacters,
              repairAnalysis: plan.repairAnalysis ?? state.repairAnalysis,
              overallRepair: plan.overallRepairResolved === true ? false : state.overallRepair }
          }
          if (source.kind === 'laya-completion-review') {
            const parsed = reviewSchema.safeParse(source.review)
            if (!parsed.success) return state
            const review = parsed.data
            if (review.turn !== state.turn) return { ...state, reviews: [...state.reviews, review].slice(-config.layaReviewHistoryEntries) }
            const assessments = { ...state.assessments }
            for (const item of review.items ?? []) if (item.score !== null) assessments[item.id] = item
            const repair = review.progressKey !== undefined
            return { ...state, assessments,
              repairs: review.outcome === 'repair' ? Math.max(state.repairs, review.attempt + 1) : state.repairs,
              stalls: repair ? review.progressKey === state.lastRepairKey ? state.stalls + 1 : 0 : state.stalls,
              lastRepairKey: repair ? review.progressKey ?? '' : state.lastRepairKey,
              overallRepair: review.stage === 'overall' && review.outcome === 'repair'
                && (review.score !== null || review.error?.toLowerCase().includes('budget') === true) ? true : state.overallRepair,
              reviews: [...state.reviews, review].slice(-config.layaReviewHistoryEntries) }
          }
          if (source.kind !== 'user') return state
          state={...state,pendingRequirement:[state.pendingRequirement,textOf(event.data.content)].filter(Boolean).join('\n\n'),pendingContext:state.pendingContext||event.data.content.some(block=>block.type!=='text')}
          if(state.jobId!==null&&state.requirement.trim()!=='')return {...state,instructed:false}
          const text = textOf(event.data.content), joined = [state.requirement, text].filter(Boolean).join('\n\n')
          return { ...state, taskKind: null, reviewMode: null, instructed: false,
            requirement: joined.slice(0, config.layaReviewRequirementCharacters),
            requiresContextInterpretation: state.requiresContextInterpretation || event.data.content.some(block => block.type !== 'text'),
            requirementIncomplete: state.requirementIncomplete || joined.length > config.layaReviewRequirementCharacters
              || text.trim() === '' && event.data.content.length === 0 }
        }
        case 'assistant/message': {
          if (event.data.message.content.some(block => block.type === 'tool-call')) return state
          const output = textOf(event.data.message.content)
          return { ...state, output: output.slice(0, config.layaReviewOutputCharacters),
            outputIncomplete: event.data.interrupted === true || output.length > config.layaReviewOutputCharacters
              || event.data.stream.some(record => record.type === 'chunk' && record.chunk.type === 'finish' && record.chunk.reason.kind === 'max-tokens'),
            outputSeq: event.seq }
        }
        case 'tool/call': return { ...state, calls: { ...state.calls, [event.data.callId]:
          { name: event.data.name, paths: writtenSourcePaths(event.data.name, event.data.arguments) } } }
        case 'tool/result': {
          if (event.surfaceOp !== 'append') return state
          const id = event.data.message.source.callId, call = state.calls[id], name = call?.name ?? 'unknown'
          const calls = Object.fromEntries(Object.entries(state.calls).filter(([key]) => key !== id))
          if (name === 'loop_tasks' || /laya_(tasks|predict|route|status)/.test(name)) return { ...state, calls }
          const failed = event.data.message.isError === true || event.data.error !== undefined
          const raw = textOf(event.data.message.content)
          const receipt = `${name}: ${failed ? 'ERROR' : 'OK'}\n` + raw.slice(0, config.layaReviewReceiptCharacters)
            + (raw.length > config.layaReviewReceiptCharacters ? '\n[excerpt; full receipt not included]' : '')
          const entries: [string, string][] = [...Object.entries(state.receipts), [String(event.seq), receipt]]
          const recent = new Set(entries.slice(-config.layaReviewReceiptEntries).map(([key]) => key))
          const referenced = new Set(state.tasks.flatMap(task => task.evidenceIds))
          const paths = failed ? state.dirtyPaths : [...new Set([...state.dirtyPaths, ...call?.paths ?? []])]
          return { ...state, calls, dirtyPaths: paths.slice(-config.layaReviewReceiptEntries),
            dirtyPathsIncomplete: state.dirtyPathsIncomplete || paths.length > config.layaReviewReceiptEntries,
            receipts: Object.fromEntries(entries.filter(([key]) => recent.has(key) || referenced.has(key))) }
        }
        default: return state
      }
    },
  }
}
class CompletionReviewBlockedError extends Error {
  constructor(message: string) { super(message); this.name = 'LayaCompletionReviewBlocked' }
}

/** The primary model owns the plan; Laya supplies optional independent judgments through the existing MCP connection. */
export class CompletionReviews extends Service {
  static inject = ['sessions', 'sessionProjections']
  /** @param ctx - owning plugin context. @param config - validated loop configuration. */
  constructor(ctx: Context, private readonly config: ClaudeLoopAlignmentConfig) {
    super(ctx, 'claudeCompletionReviews')
    ctx.sessionProjections.register(definition(config))
  }
  /**
   * Read Laya history without presenting primary-model self reports as Laya judgments.
   * @returns recent Laya decisions, newest first.
   */
  list(): LayaCompletionReview[] {
    return this.ctx.sessions.list().flatMap(session => this.ctx.sessionProjections.stateOf(session, 'claudeCompletionReview')?.reviews ?? [])
      .filter(review => review.reviewer !== 'primary').sort((a, b) => b.at - a.at).slice(0, this.config.layaReviewHistoryEntries)
  }
  /**
   * Identify a routed primary coding task.
   * @param agent - task owner.
   * @returns whether completion review applies.
   */
  enabledFor(agent: Agent): boolean { return this.primary(agent) && this.state(agent).taskKind === 'coding' }
  /**
   * Construct a deliberate loop stop.
   * @param message - reason.
   * @returns the terminal failure.
   */
  blocked(message: string): Error { return new CompletionReviewBlockedError(message) }
  /**
   * Identify intentional stops.
   * @param error - caught failure.
   * @returns whether the loop must stop.
   */
  isBlocked(error: unknown): boolean { return error instanceof CompletionReviewBlockedError }
  private primary(agent: Agent): boolean {
    return this.ctx.get('longTasks')?.active(agent) === true && agent.session.header.origin !== 'subagent' && (agent.session.header.delegationDepth ?? 0) === 0
  }
  private state(agent: Agent): ReviewState {
    const state = this.ctx.sessionProjections.stateOf(agent.session, 'claudeCompletionReview')
    if (state === undefined) throw this.blocked('The task projection is unavailable.')
    return state
  }
  private planMessage(state: ReviewState, tasks: LayaTaskItem[], fields: Omit<z.infer<typeof planNotice>, 'turn' | 'tasks'> = {}): UserMessage {
    return createUserMessage({ source: { kind: 'laya-task-list', form: 'notice', summary: 'Claude loop task plan',
      turn: state.turn, tasks, ...fields }, content: [{ type: 'text', text: JSON.stringify({ taskCount: tasks.length, taskKind: fields.taskKind ?? state.taskKind,
      reviewMode: fields.reviewMode ?? state.reviewMode, invalidatedTaskIds: fields.invalidatedTaskIds ?? [],
      repairAnalysis: fields.repairAnalysis ?? state.repairAnalysis,
      plan: (() => { const plan = fields.plan === undefined ? state.plan : fields.plan
        return plan === null ? null : { path: plan.path, revision: plan.document.revision } })(),
      planError: fields.planError === undefined ? state.planError : fields.planError,
      exception: fields.exception === undefined ? state.exception : fields.exception,
      instruction: 'Task state updated. Read loop_tasks for the current item; use view=full for the complete retained plan, requirements, scores and receipts.' }) }] })
  }

  private async readPlan(agent: Agent, path: string, signal: AbortSignal, directory?: string): Promise<BoundPlan> {
    const fs = agent.ctx.get('fs')
    if (fs === undefined) throw new Error('The task filesystem is unavailable; plan.md cannot be imported.')
    const cwd = directory ?? agent.ctx.get('workingDirectory')?.get(agent.session) ?? agent.session.header.cwd
    if (cwd === undefined) throw new Error('The task working directory is unavailable.')
    const root = await fs.resolve(cwd, { signal }), target = await fs.resolve(path, { cwd, signal })
    const canonical = fs.processPath(target)
    if (!fs.contains(root, target) || canonical.replace(/\\/g, '/').split('/').at(-1) !== 'plan.md') {
      throw new Error('Import a file named plan.md inside this task working directory; symlinks outside it are not allowed.')
    }
    let content = ''
    for await (const chunk of await fs.streamText(target, signal)) {
      signal.throwIfAborted()
      content += chunk
      if (content.length > this.config.layaReviewPlanCharacters) throw new Error('plan.md exceeds its configured character limit; no truncated plan is accepted.')
    }
    signal.throwIfAborted()
    return { path: canonical, directory: cwd, hash: planHash(content), document: parsePlan(content, this.config.layaReviewTaskLimit) }
  }

  private async checkPlan(agent: Agent, signal: AbortSignal): Promise<string | null> {
    const state = this.state(agent)
    if (state.reviewMode !== 'laya' || state.taskKind !== 'coding') return null
    let issue: string | null = null
    try {
      if (state.plan === null) throw new Error('Create a valid plan.md and import it with loop_tasks.planPath before task execution.')
      const current = await this.readPlan(agent, state.plan.path, signal, state.plan.directory)
      if (current.hash !== state.plan.hash) throw new Error('plan.md changed. Import its explicit revision through loop_tasks.planPath before continuing.')
    } catch (error) {
      signal.throwIfAborted()
      issue = error instanceof Error ? error.message : String(error)
    }
    if (issue !== state.planError) agent.session.append('user/message', this.planMessage(state, state.tasks, { planError: issue, preserveDirty: true }), { surfaceOp: 'append' })
    return issue
  }

  private planningTool(name: string, args: unknown): boolean {
    if (name === 'run_code') return args !== null && typeof args === 'object' && 'code' in args && typeof args.code === 'string'
      && isPlanningProgram(args.code, this.config.layaReviewPlanCharacters * 2)
    if (['loop_tasks', 'laya_tasks', 'read', 'read_image', 'glob', 'grep', 'ls', 'snip', 'plan_agent'].includes(name)) return true
    if (!['write', 'edit'].includes(name) || args === null || typeof args !== 'object' || !('path' in args)) return false
    return typeof args.path === 'string' && args.path.replace(/\\/g, '/').split('/').at(-1) === 'plan.md'
  }
  private reconcile(agent: Agent): ReviewState {
    return this.state(agent)
  }
  /**
   * Request one semantic route decision from the primary model, and publish related source invalidation before the next step.
   * @param agent - primary task owner.
   * @param messages - input pending admission.
   * @returns a logged instruction or task-state notice, or null.
   */
  instructionFor(agent: Agent, _messages: readonly UserMessage[]): UserMessage | null {
    if(!this.primary(agent))return null
    const state=this.state(agent),job=this.ctx.longTasks.state(agent.session)
    if(state.instructed)return null
    const header='The user selected Long Task Mode. The host owns the durable job and freezes the independent-acceptance switch for this job. '
    const branch=job.route==='pending'
      ?'First analyze the actual human request. Declare loop_tasks({kind:"coding" or "non_coding",reason:"your semantic justification"}) before execution. This decision is whether the request concerns code, not whether it is simple or complex. Implementation, debugging, code reading and code review are coding; pure chat, writing and non-code research are non_coding. Do not call Laya/Jev for classification. Non-code work answers normally without a mandatory plan or acceptance. For code the host chooses independent acceptance or primary self-review from the saved user switch. '
      :job.route==='non_coding'
      ?'This is non-code work. Answer normally and use tools as needed. Do not create a mandatory plan.md or request model acceptance. '
      :!job.reviewEnabled
      ?'Independent acceptance is disabled for this code job. Declare an ordinary ordered plan via loop_tasks.tasks, execute it and submit explicit selfReview for each completed item, then the overall final candidate. A fixed plan.md is not required. Do not call Laya/Jev or label self-review as independent approval. '
      :'Independent acceptance is enabled for this code job. First create plan.md in the exact returned claude-loop-plan/v1 format and import planPath. It defines overall goal, scope, fixed task IDs, dependencies, deliverables, evidence, exception and revision rules. Execution tasks declare real affectedPaths and receipts. The selected Laya/Jev reviewer assesses only the current item, then the overall request. Before a valid plan, only reads/searches and writing plan.md (or restricted planning run_code) are allowed. Recoverable errors retry within budget; record plan changes with reason and affected IDs; blockers pause explicitly. '
    const shared='Read loop_tasks for the saved route, currentTaskId, receipts and plan template. Continue the same unfinished job across compaction and turns; never resend approved items. Submit taskUpdate only for the current item; preserve earlier results, evidence, scores and criteria. Changed accepted files require separate targeted revalidation with reasons. No automatic fallback, threshold reductions, permission changes or unrequested external actions.'
    return createUserMessage({source:{kind:'laya-task-protocol',form:'notice',summary:'Long task routing and plan protocol'},content:[{type:'text',text:header+branch+shared}]})
  }

  /**
   * Register routing, plan and self-review execution independent of the Laya switch.
   * @param tools - owning tool registry.
   */
  registerTool(tools: ToolRuntime): void {
    this.ctx.on('tools/pre-execute', async (exec, next) => {
      if (exec.agent !== undefined && this.primary(exec.agent) && !this.planningTool(exec.name, exec.arguments)) {
        await this.checkPlan(exec.agent, exec.signal)
      }
      return next()
    })
    tools.guard(exec => {
      if (exec.agent === undefined || !this.primary(exec.agent) || this.planningTool(exec.name, exec.arguments)) return undefined
      const state = this.state(exec.agent)
      if(this.ctx.longTasks.state(exec.agent.session).route==='pending')return 'First declare coding/non_coding and a reason through loop_tasks before execution.'
      if(state.taskKind==='coding'&&state.reviewMode==='self'&&state.tasks.length===0)return 'Declare the ordinary task plan through loop_tasks.tasks before execution.'
      if (state.taskKind !== 'coding' || state.reviewMode !== 'laya') return undefined
      if (state.exception?.kind === 'blocked') return `Task ${state.exception.taskId} is blocked: ${state.exception.summary}. Resolve it and submit exception.kind=resume.`
      if (state.overallRepair) return 'Map the overall gap to affected tasks with loop_tasks.overallRepair before executing a repair.'
      return state.plan === null ? 'Import a valid plan.md through loop_tasks.planPath before executing this task.' : state.planError ?? undefined
    })
    for (const name of ['loop_tasks', 'laya_tasks']) tools.register(defineTool({ name, description:
      'Read the durable task route, plan, current item and receipts. '
      + 'Submit taskUpdate for currentTaskId only; the host retains all other results and approvals. '
      + 'First declare coding/non_coding with a reason. The Host freezes the user-selected independent-acceptance switch: code uses the saved Laya/Jev reviewer when enabled, or primary selfReview when disabled; non-code skips acceptance. '
      + 'In independent-review mode create a valid plan.md and import planPath before execution; tasks and acceptance criteria are derived only from that file. '
      + 'After an overall failure, map the gap to affectedTaskIds/new tasks using overallRepair before resubmission. '
      + 'laya_tasks is a compatibility alias; prefer loop_tasks.',
    parameters: {
      revalidateTaskIds:{type:'array',items:{type:'string'},description:'Explicitly revalidate changed accepted artifacts. Supply repairAnalysis, separately from taskUpdate.'},
      kind: { type: 'string', enum: ['coding', 'non_coding'], description: 'Your semantic decision about the actual user request; declare once.' },
      planPath: { type: 'string', description: 'Import or resync the real plan.md file in the task directory. Omit for a progress update or read.' },
      taskUpdate: { type: 'object', additionalProperties: false, description: 'Update only currentTaskId. Omit all other tasks; their results, receipts and approvals stay on the host. Do not combine with tasks.', properties: {
        id: { type: 'string', required: true },
        status: { type: 'string', required: true, enum: ['pending', 'in_progress', 'completed'] },
        result: { type: 'string', required: true, description: 'Actual deliverable and evidence explanation for this item only.' },
        evidenceIds: { type: 'array', required: true, items: { type: 'string' } },
      } },
      exception: { type: 'object', additionalProperties: false, properties: {
        kind: { type: 'string', required: true, enum: ['recoverable', 'blocked', 'resume'] },
        taskId: { type: 'string', required: true }, summary: { type: 'string', required: true, description: 'Observed problem, recovery action or resolved blocking condition.' },
      } },
      reason: { type: 'string', description: 'Brief basis for the route decision.' },
      contextRequirement: { type: 'string', description: 'Interpretation of accepted context referenced by the user; retain the human text. Preserve this interpretation until the human changes scope.' },
      repairAnalysis: { type: 'string', description: 'Short primary-model summary of which acceptance criterion and evidence show a gap, and the intended repair.' },
      resume: { type: 'boolean', description: 'For a coding continuation, include the preceding coding requirement.' },
      view: { type: 'string', enum: ['summary', 'full'], description: 'Default summary: current item, progress and recent receipts. full: all retained requirements, tasks, plan, scores and receipts; use after context loss or to inspect other items.' },
      receiptIds: { type: 'array', items: { type: 'string' }, description: 'Up to eight receipt IDs to read in full; otherwise brief excerpts.' },
      invalidateTaskIds: { type: 'array', items: { type: 'string' }, description: 'Approved items affected by shared-code changes; dependencies also reopen.' },
      tasks: { type: 'array', description: 'Declare the full ordered plan in self mode; legacy full-list progress remains accepted. Approved items are immutable unless explicitly invalidated. Prefer taskUpdate for progress.', items: {
        type: 'object', additionalProperties: false, properties: {
          id: { type: 'string', required: true }, title: { type: 'string', required: true },
          requirement: { type: 'string', required: true, description: 'Exact acceptance criteria and user constraints; preserve existing scope.' },
          status: { type: 'string', required: true, enum: ['pending', 'in_progress', 'completed'] },
          result: { type: 'string', required: true, description: 'Actual deliverable and evidence explanation; empty until delivered.' },
          evidenceIds: { type: 'array', required: true, items: { type: 'string' } },
          dependsOn: { type: 'array', items: { type: 'string' }, description: 'Earlier task IDs whose behavior this item relies on.' },
          affectedPaths: { type: 'array', items: { type: 'string' }, description: 'Source paths whose change requires this item to be reviewed again.' },
          critical: { type: 'boolean', description: 'True for mandatory requirements; a percentage alone cannot approve these.' },
        },
      } },
      selfReview: { type: 'object', additionalProperties: false, properties: {
        stage: { type: 'string', required: true, enum: ['tasks', 'overall'] }, taskId: { type: 'string' },
        rate: { type: 'number', required: true, description: 'Self-estimated completion percentage, 0–100.' },
        reason: { type: 'string', required: true, description: 'Specific remaining gap or evidence supporting completion.' },
        candidate: { type: 'string', description: 'Required for overall self review; use this exact text as the final answer.' },
        criticalSatisfied: { type: 'boolean', description: 'Explicit self report that every mandatory criterion is met.' },
      } },
      overallRepair: { type: 'object', additionalProperties: false, properties: {
        affectedTaskIds: { type: 'array', required: true, items: { type: 'string' } },
        analysis: { type: 'string', required: true, description: 'Your specific analysis connecting the overall gap to affected/new tasks.' },
        defectEvidenceIds:{type:'array',items:{type:'string'},description:'New real receipts demonstrating a defect in an approved item. Unchanged approved work cannot be reopened from a summary-only judgment.'},
        summaryOnly: { type: 'boolean', description: 'Only for an evidence-summary gap or candidate-budget error; no code claim is changed.' },
      } },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    isConcurrencySafe: () => false,
    execute: async (args, exec) => {
      const agent = exec.agent
      if (agent === undefined || !this.primary(agent)) throw new Error('loop_tasks requires a primary agent.')
      await this.ctx.longTasks.before(agent,exec.signal)
      let state = this.reconcile(agent)
      if(args.taskUpdate!==undefined||args.tasks!==undefined)this.ctx.longTasks.assertUnchanged(agent)
      const view = z.enum(['summary', 'full']).parse(args.view ?? 'summary')
      const hasProgress = args.tasks !== undefined || args.taskUpdate !== undefined
      if (args.tasks !== undefined && args.taskUpdate !== undefined) throw new Error('Submit taskUpdate or tasks, not both.')
      const selected = z.array(z.string().regex(/^\d+$/)).max(8).parse(args.receiptIds ?? [])
      for (const id of selected) if (state.receipts[id] === undefined) throw new Error(`Unknown receipt ${id}.`)
      const job=this.ctx.longTasks.state(agent.session)
      const declared=args.kind===undefined?undefined:z.enum(['coding','non_coding']).parse(args.kind)
      const kind:TaskKind|null=declared??(job.route==='pending'?null:job.route)
      if(kind===null){if(hasProgress||args.planPath!==undefined||args.selfReview!==undefined)throw new Error('Declare coding/non_coding and a reason before submitting a plan or progress.');return this.response(agent,state)}
      if(job.route==='pending'&&(typeof args.reason!=='string'||args.reason.trim()===''))throw new Error('Provide the reason for your route.')
      if(kind==='non_coding'&&(hasProgress||args.planPath!==undefined||args.selfReview!==undefined||args.overallRepair!==undefined||args.exception!==undefined))throw new Error('Non-code tasks answer normally without plan submissions or review.')
      await this.ctx.longTasks.route(agent,kind,String(args.reason??job.routingReason),exec.signal)
      const mode:ReviewMode=kind==='non_coding'?'skip':job.reviewEnabled?'laya':'self'
      const restored = args.resume === true && state.taskKind === null && state.previousWork?.reviewMode === mode ? state.previousWork : null
      if (restored !== null) {
        if (hasProgress || args.selfReview !== undefined || args.overallRepair !== undefined || args.exception !== undefined) {
          throw new Error('Resume the accepted plan separately before submitting progress or resolving a blocker.')
        }
        state = { ...state, tasks: restored.tasks, assessments: restored.assessments, receipts: restored.receipts,
          plan: restored.plan, contextRequirement: restored.contextRequirement, exception: restored.exception }
      }
      if (args.selfReview !== undefined && mode !== 'self') throw new Error('Self review cannot substitute for independent model assessment.')
      const contextRequirement = z.string().max(this.config.layaReviewRequirementCharacters)
        .parse(args.contextRequirement ?? state.contextRequirement)
      const repairAnalysis = args.repairAnalysis === undefined ? undefined : z.string().trim().min(1).max(1200).parse(args.repairAnalysis)
      if (state.contextRequirement !== '' && contextRequirement !== state.contextRequirement && state.taskRequirement === state.requirement) {
        throw new Error('Preserve the accepted context interpretation until the human changes the requirement.')
      }
      const inherited = args.resume === true && state.taskKind === null ? state.previousRequirement : ''
      if (args.resume === true && inherited === '' && state.taskKind === null) throw new Error('There is no preceding coding request to resume.')
      const invalidated = z.array(z.string()).max(this.config.layaReviewTaskLimit).parse(args.revalidateTaskIds ?? args.invalidateTaskIds ?? [])
      if(invalidated.length){
        if(hasProgress||args.planPath!==undefined||!args.repairAnalysis)throw new Error('定向复验须单独提交 revalidateTaskIds 与 repairAnalysis。')
        this.ctx.longTasks.revalidate(agent,invalidated,String(args.repairAnalysis))
      }
      for (const id of invalidated) if (!state.tasks.some(task => task.id === id)) throw new Error(`Unknown task ${id}.`)
      let affected = expandAffected(state.tasks, invalidated)
      let imported: BoundPlan | undefined
      const importPath = args.planPath ?? (restored?.plan?.path)
      if (mode === 'laya' && importPath !== undefined) {
        imported = await this.readPlan(agent, z.string().min(1).parse(importPath), exec.signal, state.plan?.directory)
        if (state.plan !== null && imported.path !== state.plan.path) throw new Error('Keep the initial plan.md path for this task.')
        affected = expandAffected(planTasks(imported.document, state.tasks), [...affected,
          ...state.plan === null ? [] : revisedTasks(state.plan.document, imported.document)])
        if (hasProgress || args.selfReview !== undefined || args.exception !== undefined) throw new Error('Import the plan separately from progress, exceptions and review submissions.')
      } else if (mode === 'self' && args.planPath !== undefined) throw new Error('The plan.md import applies only to independent model review; use the normal task plan in self mode.')
      if (mode === 'laya' && imported === undefined) {
        const issue = await this.checkPlan(agent, exec.signal)
        state = this.state(agent)
        if (issue !== null && (hasProgress || args.overallRepair !== undefined || args.exception !== undefined)) throw new Error(issue)
        if (state.plan === null && hasProgress) throw new Error('Import a valid plan.md before declaring progress.')
      }
      let tasks = args.tasks === undefined ? reopen(state.tasks, affected)
        : z.array(taskSchema).min(1).max(this.config.layaReviewTaskLimit).parse(args.tasks)
      const taskUpdate = args.taskUpdate === undefined ? undefined : taskUpdateSchema.parse(args.taskUpdate)
      if (taskUpdate !== undefined) {
        if (!tasks.some(task => task.id === taskUpdate.id)) throw new Error(`Unknown task ${taskUpdate.id}; read loop_tasks for currentTaskId.`)
        tasks = tasks.map(task => task.id === taskUpdate.id ? { ...task, ...taskUpdate } : task)
      }
      if (imported !== undefined) tasks = reopen(planTasks(imported.document, state.tasks), affected)
      const authoritative = imported ?? state.plan
      if (mode === 'laya' && authoritative !== null) {
        const definitions = planTasks(authoritative.document, [])
        if (tasks.length !== definitions.length || definitions.some((spec, index) => {
          const task = tasks[index]
          return task === undefined || task.id !== spec.id || task.taskType!==spec.taskType || task.title !== spec.title || task.requirement !== spec.requirement
            || task.critical !== spec.critical || JSON.stringify(task.dependsOn) !== JSON.stringify(spec.dependsOn)
            || JSON.stringify(task.affectedPaths) !== JSON.stringify(spec.affectedPaths)
        })) throw new Error('Task definitions must match plan.md exactly. Revise and resync the file to change task scope.')
      }
      const exception = args.exception === undefined ? undefined : z.object({
        kind: z.enum(['recoverable', 'blocked', 'resume']), taskId: z.string(), summary: z.string().trim().min(1).max(1200),
      }).strict().parse(args.exception)
      if (exception !== undefined) {
        if (mode !== 'laya' || state.plan === null) throw new Error('Plan exceptions require an imported plan.')
        if (hasProgress || args.overallRepair !== undefined) throw new Error('Record an exception separately from task progress.')
        const current = displayedItems(state, state.threshold).find(item => !item.passed)
        if (exception.taskId !== current?.id) throw new Error('An exception must name the current unapproved item.')
        if (exception.kind === 'resume' && state.exception?.kind !== 'blocked') throw new Error('There is no blocked current item to resume.')
      }
      if (state.exception?.kind === 'blocked' && hasProgress) throw new Error('Resolve the blocker with exception.kind=resume before advancing.')
      const repair = args.overallRepair === undefined ? null : overallRepairSchema.parse(args.overallRepair)
      if (repair !== null) {
        if (!state.overallRepair) throw new Error('There is no unresolved overall assessment to repair.')
        for (const id of repair.affectedTaskIds) if (!state.tasks.some(task => task.id === id)) throw new Error(`Unknown task ${id}.`)
        const added = tasks.some(task => !state.tasks.some(old => old.id === task.id))
        const latest = state.reviews.filter(review => review.turn === state.turn && review.stage === 'overall').at(-1)
        if (repair.summaryOnly === true && latest?.score?.criticalSatisfied !== true && latest?.score?.gap !== 'evidence' && latest?.error?.includes('budget') !== true) {
          throw new Error('A summary-only repair is allowed only for insufficient summary evidence or a candidate-budget error.')
        }
        if (repair.affectedTaskIds.length === 0 && !added && repair.summaryOnly !== true) {
          throw new Error('Identify affected task IDs or append missing scope before repairing the overall request.')
        }
        for(const receiptId of repair.defectEvidenceIds??[])if(state.receipts[receiptId]===undefined)throw new Error('Unknown defect evidence receipt '+receiptId)
        for(const id of repair.affectedTaskIds){
          const old=state.assessments[id]
          if(!old?.passed)continue
          const changed=this.ctx.longTasks.state(agent.session).changes.some(change=>change.taskId===id)
          const revised=imported!==undefined&&tasks.find(task=>task.id===id)?.requirement!==state.tasks.find(task=>task.id===id)?.requirement
          const fresh=(repair.defectEvidenceIds??[]).some(receiptId=>!old.evidenceIds.includes(receiptId))
          if(!changed&&!revised&&!fresh)throw new Error(`Approved task ${id} has no changed artifact, revised criterion or new defect evidence. Keep its approval. Use overallRepair.summaryOnly for the final answer; do not restart unchanged accepted items.`)
        }
        affected = expandAffected(tasks, [...affected, ...repair.affectedTaskIds])
        tasks = reopen(tasks, affected)
      }
      if (new Set(tasks.map(task => task.id)).size !== tasks.length) throw new Error('Task IDs must be unique.')
      if (state.taskRequirement === state.requirement && state.tasks.some((old, index) => tasks[index]?.id !== old.id)) {
        throw new Error('Preserve the existing task order and append missing scope after it.')
      }
      for (const old of imported === undefined && state.taskRequirement === state.requirement ? state.tasks : []) {
        const item = tasks.find(task => task.id === old.id)
        if (item === undefined || item.title !== old.title || item.requirement !== old.requirement
            || old.critical === true && item.critical !== true
            || (old.dependsOn ?? []).some(id => !item.dependsOn?.includes(id))
            || (old.affectedPaths ?? []).some(path => !item.affectedPaths?.includes(path))) {
          throw new Error(`Preserve task ${old.id}, its requirement and known dependencies/paths. Append missing scope.`)
        }
      }
      // Reject accidental full-list rewrites before recording any new plan or review.
      // Actual code/plan invalidation still reopens the affected dependency chain.
      for (const item of displayedItems(state, state.threshold)) {
        const task = tasks.find(task => task.id === item.id)
        if (item.passed && !affected.has(item.id) && task !== undefined && fingerprint(task, state.receipts) !== item.fingerprint) {
          throw new Error(`Approved task ${item.id} is immutable. Submit only the current item using taskUpdate; prior results and scores are preserved. For actual changes, invalidateTaskIds or revise plan.md separately.`)
        }
      }
      // Revising an unapproved submission invalidates its cached judgment and dependencies.
      const changedApproved = state.tasks.filter(old => state.assessments[old.id] !== undefined
          && tasks.some(task => task.id === old.id && fingerprint(task, state.receipts) !== fingerprint(old, state.receipts)))
        .map(task => task.id)
      affected = expandAffected(tasks, [...affected, ...changedApproved])
      const effectiveItems = displayedItems({ ...state, tasks: reopen(state.tasks, affected),
        assessments: Object.fromEntries(Object.entries(state.assessments).filter(([id]) => !affected.has(id))) },
      state.threshold)
      const currentId = effectiveItems.find(item => !item.passed)?.id
        ?? tasks.find(task => !state.tasks.some(old => old.id === task.id))?.id ?? null
      if (taskUpdate !== undefined && taskUpdate.id !== currentId) throw new Error(`Only current task ${currentId ?? 'none'} may receive taskUpdate.`)
      for (const [index, task] of tasks.entries()) {
        const earlier = new Set(tasks.slice(0, index).map(item => item.id))
        if ((task.dependsOn ?? []).some(id => !earlier.has(id))) throw new Error(`Dependencies of ${task.id} must name earlier items.`)
        if (task.status === 'completed' && task.result.trim() === '') throw new Error(`Completed task ${task.id} needs its actual deliverable.`)
        if (mode === 'laya' && task.taskType!=='opinion' && task.status === 'completed' && task.evidenceIds.length === 0) throw new Error(`Completed task ${task.id} needs actual execution evidence IDs from this session.`)
        for (const id of task.evidenceIds) if (state.receipts[id] === undefined) throw new Error(`Unknown receipt ${id}; read loop_tasks for evidence IDs.`)
        const old = state.tasks.find(item => item.id === task.id)
        const changed = old === undefined || fingerprint(old, state.receipts) !== fingerprint(task, state.receipts)
        if (task.id !== currentId && changed && task.status !== 'pending' && !affected.has(task.id)) {
          throw new Error(`Only current task ${currentId ?? 'none'} may advance. Leave ${task.id} pending or preserve its approved result.`)
        }
        if (affected.has(task.id) && task.id !== currentId) tasks[index] = { ...task, status: 'pending', result: '', evidenceIds: [] }
      }
      const changedPlan = state.taskKind===null || args.kind !== undefined || hasProgress || imported !== undefined || exception !== undefined || affected.size > 0 || inherited !== ''
        || repair !== null || contextRequirement !== state.contextRequirement || repairAnalysis !== undefined
      if (changedPlan) {
        agent.session.append('user/message', this.planMessage(state, tasks, { taskKind: kind, reviewMode: mode,
          ...(restored === null ? {} : { restoredWork: { receipts: restored.receipts, assessments: restored.assessments },
            exception: restored.exception }),
          ...(imported === undefined ? {} : { plan: imported, planError: null }),
          ...(hasProgress && state.exception?.kind === 'recoverable' ? { exception: null } : {}),
          ...(exception === undefined ? {} : { exception: exception.kind === 'resume' ? null : {
            kind: exception.kind, taskId: exception.taskId, summary: exception.summary },
            repairAnalysis: exception.summary }),
          routingReason: z.string().max(1200).parse(args.reason ?? state.routingReason), contextRequirement,
          invalidatedTaskIds: [...affected],
          ...(repairAnalysis === undefined ? {} : { repairAnalysis }),
          ...(inherited === '' ? {} : { inheritedRequirement: inherited, inheritedIncomplete: state.previousRequirementIncomplete }),
          ...(repair === null ? {} : { repairAnalysis: repair.analysis, overallRepairResolved: true }),
        }), { surfaceOp: 'append' })
      }
      state = this.state(agent)
      if (restored !== null) this.record(agent, 'tasks', displayedItems(state, state.threshold), null, 'progress', [])
      if (args.selfReview !== undefined) {
        this.selfAssess(agent, selfReviewSchema.parse(args.selfReview))
      } else if (mode === 'laya' && hasProgress) {
        const current = displayedItems(state, state.threshold).find(item => !item.passed)
        if (current?.status === 'completed') await this.assessItem(agent, current.id, exec.signal)
      }
      return this.response(agent,this.state(agent), selected, view)
    },
    presentCall: args => ({ card: 'generic', title: 'Claude loop task plan', kind: 'other', rawInput: args.taskUpdate ?? args.tasks }),
    }))
  }
  private judgingRequirement(state: ReviewState): string {
    return state.requirement + (state.contextRequirement === '' ? '' : '\n\n[Primary-model interpretation of referenced accepted context; original human text retained above]\n' + state.contextRequirement)
      + (state.plan === null ? '' : `\n\n[Accepted plan.md revision ${state.plan.document.revision}]\nGoal: ${state.plan.document.goal}\nScope: ${state.plan.document.scope}`)
  }
  private response(agent:Agent,state: ReviewState, selected: readonly string[] = [], view: 'summary' | 'full' = 'summary'): string {
    const items = displayedItems(state, state.threshold), current = items.find(item => !item.passed)
    const full = view === 'full'
    const receipts = Object.entries(state.receipts).filter(([id]) => selected.length === 0 || selected.includes(id))
    return JSON.stringify({ view, fullStateAvailable: true, independentReviewEnabled:this.ctx.longTasks.state(agent.session).reviewEnabled,taskKind: state.taskKind, reviewMode: state.reviewMode, skipped: state.taskKind === 'non_coding',
      routingReason: state.routingReason, currentTaskId: current?.id ?? null,
      tasks: full ? state.tasks : state.tasks.filter(task => task.id === current?.id),
      plan: full || state.plan === null ? state.plan : { path: state.plan.path, revision: state.plan.document.revision,
        goal: state.plan.document.goal, scope: state.plan.document.scope }, planError: state.planError, exception: state.exception,
      ...(state.plan === null && state.reviewMode === 'laya' ? { planTemplate } : {}),
      ...(full ? { originalRequirement: state.requirement, contextRequirement: state.contextRequirement,
        precedingCodingRequirement: state.previousRequirement } : { recovery: 'Read loop_tasks with view=full to recover all retained human requirements, tasks, approvals and receipts.' }),
      threshold: state.threshold, overallRepairRequired: state.overallRepair,
      repairAnalysis: state.repairAnalysis, assessment: { reviewer: state.reviewMode === 'self' ? 'primary' : this.ctx.longTasks.state(agent.session).reviewer?.backend??'laya',
        passedItems: items.filter(item => item.passed).length, totalItems: items.length,
        items: (full ? items : items.filter(item => item.id === current?.id)).map(item => ({ id: item.id, rate: item.score?.rate ?? null, passed: item.passed, reason: item.reason })) },
      receiptCount: Object.keys(state.receipts).length,
      receipts: (full || selected.length > 0 ? receipts : receipts.slice(-8))
        .map(([id, text]) => ({ id, text: !full && selected.length === 0 ? text.slice(0, 200) : text,
          excerpted: !full && selected.length === 0 && text.length > 200 })),
      instruction: state.taskKind === null ? 'Analyze the human requirement and declare kind=coding or non_coding with a reason. The host chooses independent or self review from the saved user switch.'
        : state.taskKind === 'non_coding' ? 'Answer normally. Laya and code self review are skipped.'
          : state.reviewMode === 'laya' && (state.plan === null || state.planError !== null) ? (state.planError ?? 'Write plan.md using planTemplate, then import planPath before execution.')
          : state.exception?.kind === 'blocked' ? 'Wait for the blocking condition; do not mark this task or the overall request completed.'
          : state.tasks.length === 0 ? 'Declare a complete ordered coding task plan before execution.'
            : state.overallRepair ? 'Analyze the overall gap. Submit overallRepair naming affected tasks or append missing tasks, then reapprove them.'
              : current !== undefined ? `Work on ${current.id} only. Submit taskUpdate={id:"${current.id}",status,result,evidenceIds}; omit other items. Approved results and scores are retained by the host. `
          + (state.reviewMode === 'self' ? 'Submit your explicit selfReview; this is not independent Laya approval.' : 'The selected independent reviewer judges only this item.')
                : 'All items passed. Submit the final candidate for overall review against the original human requirement. '
            + (state.reviewMode === 'self' ? 'First submit an overall selfReview with the exact final candidate.' : '') })
  }
  private record(agent: Agent, stage: 'tasks' | 'overall', items: LayaTaskAssessment[], score: LayaCompletionScore | null,
    outcome: LayaCompletionReview['outcome'], assessedTaskIds: string[], error: string | null = null,
    candidate?: string, progressKey?: string, stalled = false): LayaCompletionReview {
    const state = this.state(agent), reviewer = state.reviewMode === 'self' ? 'primary' : this.ctx.longTasks.state(agent.session).reviewer?.backend??'laya'
    const passedItems = items.filter(item => item.passed).length
    const review: LayaCompletionReview = { sessionId: agent.session.id, turn: state.turn, attempt: state.repairs, at: Date.now(),
      outputSeq: state.outputSeq, threshold: state.threshold, maxRepairs: this.config.layaReviewMaxRepairs.get(),
      outcome, error, requirement: this.judgingRequirement(state), output: candidate ?? state.output,
      evidence: [...new Set(state.tasks.flatMap(task => task.evidenceIds))].flatMap(id => state.receipts[id] === undefined ? [] : [`[${id}] ${state.receipts[id]}`]),
      score, policy: 'task-items-v2', stage, items, passedItems, totalItems: state.tasks.length, reviewer,
      assessedTaskIds, currentTaskId: items.find(item => !item.passed)?.id ?? null, repairAnalysis: state.repairAnalysis,
      ...(progressKey === undefined ? {} : { progressKey }), stalled }
    const receipt = `[Claude loop ${reviewer === 'primary' ? 'primary-model self review' : reviewer.toUpperCase()+' review'}] ${passedItems}/${items.length} items passed; `
      + `threshold >= ${review.threshold}%; overall ${score === null ? 'not assessed' : `${(score.rate * 100).toFixed(1)}%`}; ${outcome}.\n`
      + items.filter(item => assessedTaskIds.includes(item.id) || item.id === review.currentTaskId).map(item =>
        `${item.id} ${item.title}: ${item.score === null ? item.status : `${(item.score.rate * 100).toFixed(1)}%`}; ${item.reason}`).join('\n')
      + (score !== null && outcome !== 'passed' ? `\nOverall gap: ${gaps[score.gap ?? 'none']}` : '')
      + (error === null ? '' : `\nReview failure: ${error}`)
    agent.session.append('user/message', createUserMessage({ source: { kind: 'laya-completion-review', form: 'notice',
      summary: `${reviewer}: ${passedItems}/${items.length} · ${stage} · ${outcome}`, review },
    content: [{ type: 'text', text: receipt }] }), { surfaceOp: 'append' })
    return review
  }
  private async assessItem(agent: Agent, id: string, signal: AbortSignal): Promise<void> {
    await this.ctx.longTasks.before(agent,signal)
    this.ctx.longTasks.assertUnchanged(agent)
    const issue = await this.checkPlan(agent, signal)
    if (issue !== null) throw this.blocked(issue)
    const state = this.state(agent), items = displayedItems(state, state.threshold)
    const index = items.findIndex(item => item.id === id)
    const item = items[index]
    if (item === undefined || item.status !== 'completed')return
    if(item.score!==null){if(!item.passed){const prepared=await this.ctx.longTasks.prepare(agent,item,signal);this.ctx.longTasks.attempt(agent,hash({id,requirement:item.requirement,files:prepared.files,...item.taskType==='opinion'?{content:item.result}:{},receipts:item.evidenceIds.map(id=>state.receipts[id]??'')}))}return}
    const failed = state.reviews.filter(review => review.turn === state.turn && review.outcome === 'error'
      && review.requirement === this.judgingRequirement(state) && review.items?.some(value => value.id === id
        && value.fingerprint === item.fingerprint)).at(-1)
    if (failed !== undefined) throw this.blocked(failed.error ?? 'This unchanged assessment already failed; resolve the error before retrying.')
    signal.throwIfAborted()
    try {
      if (state.requirementIncomplete || state.requiresContextInterpretation && state.contextRequirement.trim() === '') {
        throw new Error('The original requirement is incomplete or its attached context has no explicit interpretation.')
      }
      const evaluator = this.ctx.longTasks
      agent.session.append('user/message', createUserMessage({ source: { kind: 'laya-assessment-start', form: 'notice',
        summary: `${this.ctx.longTasks.state(agent.session).reviewer?.backend??'laya'}: assessing ${id}`, turn: state.turn }, content: [{ type: 'text', text: `[Independent review] Assessing only ${id}: ${item.requirement}` }] }), { surfaceOp: 'append' })
      const prepared=await this.ctx.longTasks.prepare(agent,item,signal)
      this.ctx.longTasks.attempt(agent,hash({id,requirement:item.requirement,files:prepared.files,...item.taskType==='opinion'?{content:item.result}:{},receipts:item.evidenceIds.map(id=>state.receipts[id]??'')}))
      const score = await evaluator.evaluate(agent, { taskType:item.taskType, requirement: item.requirement, output: item.result,
        evidence: item.taskType==='opinion'?[]:['Self-reported completion is not independent evidence.', ...item.evidenceIds.map(id => state.receipts[id] ?? '[unavailable]')],
        critical: item.critical === true }, AbortSignal.any([signal, AbortSignal.timeout(this.config.layaReviewTimeoutMs.get())]))
      signal.throwIfAborted()
      const changed = await this.checkPlan(agent, signal)
      const latest = this.state(agent), submitted = latest.tasks.find(task => task.id === id)
      if (changed !== null || this.state(agent).plan?.hash !== state.plan?.hash
        || latest.turn !== state.turn || submitted === undefined || fingerprint(submitted, latest.receipts) !== item.fingerprint) {
        throw new Error(changed ?? 'The plan or submitted result changed during assessment; resubmit the current task.')
      }
      const passed = score.rate * 100 >= state.threshold
        && (item.critical !== true || score.criticalSatisfied === true)
      if(passed)await this.ctx.longTasks.accept(agent,prepared,score.rate,signal)
      this.ctx.longTasks.verdict(agent,passed)
      items[index] = { ...item, score, passed, reused: false,
        reason: passed ? 'Approved against this item and cited receipts.' : item.critical === true && score.criticalSatisfied !== true
          ? 'A mandatory acceptance criterion is not substantiated. Repair it and resubmit this item.' : gaps[score.gap ?? 'none'] }
      this.record(agent, 'tasks', items, null, 'progress', [id])
    } catch (error) {
      signal.throwIfAborted()
      if(this.state(agent).jobId!==state.jobId)throw this.blocked('任务实例已改变，旧评审结果未发布。')
      const message = `Task ${id}: ${error instanceof Error ? error.message : String(error)}`
      this.record(agent, 'tasks', items, null, 'error', [id], message)
      if(!(error instanceof Error&&error.name==='NoEffectiveProgress'))this.ctx.longTasks.pause(agent,message)
      throw this.blocked(message)
    }
  }
  private selfAssess(agent: Agent, self: z.infer<typeof selfReviewSchema>): void {
    const state = this.state(agent), items = displayedItems(state, state.threshold)
    const current = items.find(item => !item.passed)
    const score: LayaCompletionScore = { rate: self.rate / 100, dimensions: [], confidence: null, model: null,
      device: null, elapsedMs: 0, json: JSON.stringify(self), criticalSatisfied: self.criticalSatisfied === true,
      gap: self.rate >= state.threshold ? 'none' : 'partial' }
    if (self.stage === 'tasks') {
      if (current === undefined || self.taskId !== current.id || current.status !== 'completed') throw new Error('Self-review the completed current task only.')
      const passed = self.rate >= state.threshold && (current.critical !== true || self.criticalSatisfied === true)
      this.ctx.longTasks.verdict(agent,passed)
      const updated = items.map(item => item.id === current.id ? { ...item, score, passed, reason: self.reason, reused: false } : item)
      this.record(agent, 'tasks', updated, null, 'progress', [current.id])
    } else {
      if (current !== undefined || items.length === 0 || state.overallRepair) throw new Error('Approve each item and resolve overall repair before overall self review.')
      if (self.candidate === undefined) throw new Error('Overall self review requires the actual final candidate.')
      if (state.requirementIncomplete) throw new Error('The original requirement is incomplete.')
      const passed = self.rate >= state.threshold && self.criticalSatisfied === true
      this.ctx.longTasks.verdict(agent,passed)
      agent.session.append('user/message', this.planMessage(state, state.tasks, { repairAnalysis: self.reason }), { surfaceOp: 'append' })
      this.record(agent, 'overall', items, score, passed ? 'passed' : 'repair', [], null, self.candidate,
        digest({ items: items.map(item => item.fingerprint), candidate: self.candidate }))
    }
  }
  private continueTask(agent: Agent, stage: 'tasks' | 'overall', items: LayaTaskAssessment[], score: LayaCompletionScore | null,
    message: string, error: string | null = null): boolean {
    const state = this.state(agent), key = digest({ stage, items: items.map(item => item.fingerprint),
      ...(stage === 'overall' ? { candidate: state.output } : {}) })
    const limit = this.config.layaReviewMaxRepairs.get(), stallLimit = this.config.layaReviewStallRounds.get()
    const stalls = key === state.lastRepairKey ? state.stalls + 1 : 0
    const stalled = stallLimit > 0 && stalls >= stallLimit
    const failureCandidate = score !== null || error !== null || state.overallRepair
      || items.some(item => !item.passed && item.score !== null)
    const blocked = stalled || failureCandidate && limit > 0 && state.repairs >= limit
    const failure = stalled ? 'Repair stalled: the same submitted work and evidence were repeated without progress.'
      : blocked ? 'The configured repair limit was reached.' : error
    this.record(agent, stage, items, score, blocked ? 'blocked' : failureCandidate ? 'repair' : 'progress', [], failure, undefined, key, stalled)
    if (blocked) throw this.blocked(failure ?? 'Completion review was blocked.')
    agent.steer(createUserMessage({ source: { kind: 'claude-loop-alignment' }, content: [{ type: 'text', text:
      `[Claude loop next action] ${message}\n`
      + 'Preserve the original human requirement. Read loop_tasks for the current item and recent evidence; use view=full after context loss to recover all retained requirements, tasks, scores and receipts. Preserve unrelated approved work. '
      + 'Explain specific gaps before repair; do not invent verification or exceed user authorization.' }] }))
    return true
  }
  /**
   * Review the final candidate only after every task item is approved; direct incomplete work back to its current item.
   * @param agent - primary task owner.
   * @param turn - durable turn number.
   * @param signal - execution cancellation.
   * @returns whether continuation requires a fresh tool budget.
   */
  async assess(agent: Agent, turn: number, signal: AbortSignal): Promise<boolean> {
    if (!this.primary(agent)) return false
    signal.throwIfAborted()
    await this.ctx.longTasks.before(agent,signal)
    this.ctx.longTasks.assertUnchanged(agent)
    let state = this.reconcile(agent)
    if (state.turn !== turn) throw this.blocked('Task state does not match this turn.')
    if (state.taskKind === 'non_coding'){this.ctx.longTasks.completed(agent);return false}
    if (state.exception?.kind === 'blocked') throw this.blocked(`Task ${state.exception.taskId}: ${state.exception.summary}`)
    const planIssue = state.reviewMode==='laya'?await this.checkPlan(agent, signal):null
    state = this.state(agent)
    if (planIssue !== null) {
      if (state.stalls >= PROTOCOL_ROUND_LIMIT) throw this.blocked(planIssue)
      return this.continueTask(agent, 'tasks', displayedItems(state, state.threshold), null,
        `${planIssue} Read loop_tasks for planTemplate and the required exception rules. Fix and import the file before continuing.`)
    }
    const failure = state.reviews.filter(review => review.turn === turn && review.outcome === 'error'
      && review.requirement === this.judgingRequirement(state)).at(-1)
    if (failure?.stage === 'overall' && failure.output === state.output) throw this.blocked(failure.error ?? 'Overall assessment failed.')
    let items = displayedItems(state, state.threshold)
    if (state.taskKind === null || items.length === 0) {
      if (state.stalls >= PROTOCOL_ROUND_LIMIT) throw this.blocked('The model did not declare a route and coding plan through loop_tasks.')
      return this.continueTask(agent, 'tasks', items, null, 'Declare coding/non_coding with loop_tasks. Code tasks need a complete ordered plan; non-code answers need no Laya review.')
    }
    if (state.overallRepair) return this.continueTask(agent, 'overall', items, null,
      'Map the failed overall judgment to affected task IDs or missing tasks using overallRepair. Repair and individually reapprove them before resubmitting.')
    let current = items.find(item => !item.passed)
    if (current?.status === 'completed' && state.reviewMode === 'laya') {
      await this.assessItem(agent, current.id, signal)
      state = this.state(agent); items = displayedItems(state, state.threshold)
      current = items.find(item => !item.passed)
    }
    if (current !== undefined) return this.continueTask(agent, 'tasks', items, null,
      `Continue current task ${current.id}: ${current.requirement}. Gap: ${current.reason}. `
      + (state.reviewMode === 'self' ? 'Submit an explicit item selfReview after delivery.' : 'Repair and resubmit this item; other approved items keep their scores.'))
    if (state.output.trim() === '' || state.outputIncomplete) return this.continueTask(agent, 'overall', items, null,
      'Provide a complete concise final delivery candidate for overall assessment.')
    if (state.reviewMode === 'self') {
      const overall = state.reviews.filter(review => review.turn === turn && review.stage === 'overall' && review.reviewer === 'primary').at(-1)
      if (overall?.outcome === 'passed' && overall.output.trim() === state.output.trim()){this.ctx.longTasks.completed(agent);return false}
      return this.continueTask(agent, 'overall', items, null,
        'Submit an overall selfReview against the original request, with criticalSatisfied and candidate matching your final answer exactly. Then output that approved candidate.')
    }
    let score: LayaCompletionScore
    try {
      if (state.requirementIncomplete || state.requiresContextInterpretation && state.contextRequirement.trim() === '') {
        throw new Error('The original requirement is incomplete or its attached context has no explicit interpretation.')
      }
      const evaluator = this.ctx.longTasks
      agent.session.append('user/message', createUserMessage({ source: { kind: 'laya-assessment-start', form: 'notice',
        summary: 'Independent model: overall assessment', turn }, content: [{ type: 'text', text: '[Independent review] All items passed. Assessing the whole original human requirement.' }] }), { surfaceOp: 'append' })
      this.ctx.longTasks.attempt(agent,hash({stage:'overall',items:items.map(x=>x.fingerprint),output:state.output}))
      score = await evaluator.evaluate(agent, {taskType:items.every(item=>item.taskType==='opinion')?'opinion':'execution',requirement: this.judgingRequirement(state), output: state.output, critical: true,
        evidence: items.every(item=>item.taskType==='opinion')?[]:items.map(item => `${item.id} ${item.title}: ${item.requirement}\nDelivered: ${item.result}\n`
          + item.evidenceIds.map(id => `[receipt ${id}] ${state.receipts[id] ?? '[unavailable]'}`).join('\n')) },
      AbortSignal.any([signal, AbortSignal.timeout(this.config.layaReviewTimeoutMs.get())]))
    } catch (error) {
      signal.throwIfAborted()
      const message = error instanceof Error ? error.message : String(error)
      if (error instanceof Error && error.name === 'LayaCandidateBudgetExceeded') return this.continueTask(agent, 'overall', items, null,
        'Shorten the final summary while preserving requirements and evidence. Resolve this candidate-budget repair with overallRepair.summaryOnly.', message)
      this.record(agent, 'overall', items, null, 'error', [], message)
      this.ctx.longTasks.pause(agent,message)
      throw this.blocked(message)
    }
    signal.throwIfAborted()
    const changed = await this.checkPlan(agent, signal)
    const latest = this.state(agent), currentItems = displayedItems(latest, state.threshold)
    if (changed !== null || latest.plan?.hash !== state.plan?.hash || latest.turn !== state.turn
      || latest.overallRepair || latest.exception?.kind === 'blocked' || latest.output !== state.output
      || currentItems.length !== items.length || currentItems.some((item, index) => !item.passed || item.fingerprint !== items[index]?.fingerprint)) {
      throw this.blocked(changed ?? 'The accepted plan changed during overall assessment; reapprove affected tasks first.')
    }
    if (score.rate * 100 >= state.threshold && score.criticalSatisfied === true) {
      await this.ctx.longTasks.before(agent,signal)
      this.ctx.longTasks.assertUnchanged(agent)
      this.record(agent, 'overall', items, score, 'passed', [])
      this.ctx.longTasks.completed(agent)
      return false
    }
    this.ctx.longTasks.verdict(agent,false)
    return this.continueTask(agent, 'overall', items, score,
      `Overall gap: ${gaps[score.gap ?? 'none']}. Analyze the original scope, identify affected task IDs or append missing tasks through overallRepair, then repair and reapprove those items.`)
  }
}
