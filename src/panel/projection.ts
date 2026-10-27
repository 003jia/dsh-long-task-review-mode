import {readJobRecord} from '../job-record.ts'
/** Pure execution fold; streaming token deltas never republish the projection. */
import { z } from 'zod'
import type { SessionEvent } from '@deepseek-ai/dsh-session/types'
import type { LoopFlow, LoopPhase, LoopStep } from './types.ts'

const taskFields = z.object({ id: z.string(), title: z.string(), requirement: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed']), result: z.string(), evidenceIds: z.array(z.string()) })

const reviewFields = z.object({
  turn: z.number().int().nonnegative(), attempt: z.number().int().nonnegative(), at: z.number().nonnegative(),
  threshold: z.number().min(0).max(100), maxRepairs: z.number().int().nonnegative(),
  outcome: z.enum(['progress', 'passed', 'repair', 'blocked', 'error']), error: z.string().nullable(),
  policy: z.enum(['task-items-v1', 'task-items-v2']).optional(), stage: z.enum(['tasks', 'overall']).optional(),
  reviewer: z.enum(['laya', 'jev', 'primary']).optional(),
  passedItems: z.number().int().nonnegative().optional(), totalItems: z.number().int().nonnegative().optional(),
  items: z.array(taskFields.extend({ passed: z.boolean(), reason: z.string(), reused: z.boolean(),
    score: z.object({ rate: z.number().min(0).max(1), gap: z.enum(['missing', 'partial', 'evidence', 'constraints', 'defect', 'none']).optional() }).nullable(),
  })).optional(),
  score: z.object({
    rate: z.number().min(0).max(1), confidence: z.number().min(0).max(1).nullable(),
    elapsedMs: z.number().nonnegative(),
    dimensions: z.array(z.object({ name: z.enum(['coverage', 'constraints', 'evidence']), rate: z.number().min(0).max(1) })),
  }).nullable(),
})
const reviewNotice = z.object({ kind: z.literal('laya-completion-review'), review: reviewFields })
const planFields = z.object({ path: z.string(), hash: z.string(), revision: z.number().int(), goal: z.string(), scope: z.string(),
  exceptions: z.object({ recoverable: z.string(), revisePlan: z.string(), blocked: z.string() }) })
const exceptionFields = z.object({ kind: z.enum(['recoverable', 'blocked']), taskId: z.string(), summary: z.string() })
const taskNotice = z.object({ kind: z.literal('laya-task-list'), turn: z.number().int(), tasks: z.array(taskFields),
  taskKind: z.enum(['coding', 'non_coding']).optional(), reviewMode: z.enum(['laya', 'self', 'skip']).optional(),
  plan: z.object({ path: z.string(), hash: z.string(), document: z.object({ revision: z.number().int(), goal: z.string(), scope: z.string(),
    exceptions: z.object({ recoverable: z.string(), revisePlan: z.string(), blocked: z.string() }) }) })
    .transform(value => ({ path: value.path, hash: value.hash, ...value.document })).nullable().optional(),
  planError: z.string().nullable().optional(), exception: exceptionFields.nullable().optional(),
})
const assessmentStart = z.object({ kind: z.literal('laya-assessment-start'), turn: z.number().int() })

/** Validates the complete projection before it crosses the host transport. */
export const loopFlowSchema = z.object({
  jobId:z.string().nullable(),
  turn: z.number().int().nullable(),
  phase: z.enum(['idle', 'input', 'model', 'tools', 'feedback', 'assessing', 'done', 'aborted', 'blocked', 'error', 'limited', 'interrupted']),
  reason: z.string().nullable(),
  startedAt: z.number().nullable(),
  endedAt: z.number().nullable(),
  totalSteps: z.number().int().nonnegative(),
  totalCalls: z.number().int().nonnegative(),
  failedCalls: z.number().int().nonnegative(),
  omittedSteps: z.number().int().nonnegative(),
  omittedReviews: z.number().int().nonnegative(),
  reviews: z.array(reviewFields.extend({ seq: z.number().int().nonnegative(), step: z.number().int().nullable() })),
  tasks: z.array(taskFields), taskSeq: z.number().int().nullable(),
  taskKind: z.enum(['coding', 'non_coding']).nullable(), reviewMode: z.enum(['laya', 'self', 'skip']).nullable(),
  plan: planFields.nullable(), planError: z.string().nullable(), exception: exceptionFields.nullable(),
  steps: z.array(z.object({
    number: z.number().int(), startedAt: z.number(), endedAt: z.number().nullable(),
    finishReason: z.string().nullable(),
    tools: z.array(z.object({
      id: z.string(), name: z.string(), status: z.enum(['running', 'success', 'error', 'interrupted']),
      startedAt: z.number(), endedAt: z.number().nullable(),
    })),
  })),
})

/**
 * Create an empty event-derived loop state.
 * @returns a fresh execution ledger.
 */
export function emptyLoopFlow(): LoopFlow {
  return { jobId:null,turn: null, phase: 'idle', reason: null, startedAt: null, endedAt: null,
    totalSteps: 0, totalCalls: 0, failedCalls: 0, omittedSteps: 0, steps: [], omittedReviews: 0, reviews: [], tasks: [], taskSeq: null,
    taskKind: null, reviewMode: null, plan: null, planError: null, exception: null }
}

function updateStep(state: LoopFlow, number: number, update: (step: LoopStep) => LoopStep): LoopStep[] {
  return state.steps.map(step => step.number === number ? update(step) : step)
}

function endPhase(kind: string): LoopPhase {
  switch (kind) {
    case 'completed': return 'done'
    case 'aborted': return 'aborted'
    case 'error': return 'error'
    case 'max-tokens': return 'limited'
    case 'blocked': return 'blocked'
    default: return 'interrupted' // Unknown extension reasons do not prove successful completion.
  }
}

/**
 * Fold a committed event into the latest turn's ledger. Tool failures remain
 * separate from turn failures: a model can recover from a failed tool.
 * @param state - state through the previous event.
 * @param event - committed event in session order.
 * @param maxSteps - retained steps; full-turn counters survive truncation.
 * @param maxReviews - retained assessment receipts across turns.
 * @returns the new state, or the same reference for unrelated events.
 */
export function foldLoopFlow(state: LoopFlow, event: SessionEvent, maxSteps: number, maxReviews = 20): LoopFlow {
  const job=readJobRecord(event)
  if(job?.jobId&&job.jobId!==state.jobId)return {...emptyLoopFlow(),turn:state.turn,jobId:job.jobId}
  switch (event.type) {
    case 'turn/start':
      return { ...emptyLoopFlow(), jobId:state.jobId,tasks:state.tasks,taskKind:state.taskKind,reviewMode:state.reviewMode,plan:state.plan,planError:state.planError,exception:state.exception,taskSeq:state.taskSeq,turn: event.data.turn, phase: 'input', startedAt: event.time,
        reviews: state.reviews, omittedReviews: state.omittedReviews }
    case 'user/message': {
      if(event.data.source.kind==='long-task-state'&&event.data.source.job.jobId!==null&&event.data.source.job.jobId!==state.jobId)return {...emptyLoopFlow(),turn:state.turn,jobId:event.data.source.job.jobId}
      if (event.surfaceOp !== 'append') return state
      const tasks = taskNotice.safeParse(event.data.source)
      if (tasks.success && tasks.data.turn === state.turn) return { ...state, tasks: tasks.data.tasks, taskSeq: event.seq,
        taskKind: tasks.data.taskKind ?? state.taskKind, reviewMode: tasks.data.reviewMode ?? state.reviewMode,
        plan: tasks.data.plan === undefined ? state.plan : tasks.data.plan,
        planError: tasks.data.planError === undefined ? state.planError : tasks.data.planError,
        exception: tasks.data.exception === undefined ? state.exception : tasks.data.exception,
        phase: tasks.data.exception?.kind === 'blocked' ? 'blocked' : tasks.data.exception === null ? 'feedback' : state.phase,
      }
      const start = assessmentStart.safeParse(event.data.source)
      if (start.success && start.data.turn === state.turn) return { ...state, phase: 'assessing' }
      const parsed = reviewNotice.safeParse(event.data.source)
      if (!parsed.success) return state
      const review = parsed.data.review
      const reviews = [...state.reviews, { ...review, seq: event.seq,
        step: review.turn === state.turn ? state.steps.at(-1)?.number ?? null : null }]
      const removed = Math.max(0, reviews.length - maxReviews)
      return { ...state, phase: review.turn === state.turn ? 'feedback' : state.phase,
        reviews: reviews.slice(removed), omittedReviews: state.omittedReviews + removed }
    }
    case 'step/start': {
      if (event.data.turn !== state.turn) return state
      const steps = [...state.steps, { number: event.data.step, startedAt: event.time,
        endedAt: null, finishReason: null, tools: [] }]
      const removed = Math.max(0, steps.length - maxSteps)
      return { ...state, phase: 'model', totalSteps: state.totalSteps + 1,
        omittedSteps: state.omittedSteps + removed, steps: steps.slice(removed) }
    }
    case 'assistant/message': {
      if (event.data.turn !== state.turn) return state
      let finishReason: string | null = null
      for (const record of event.data.stream) {
        if (record.type === 'chunk' && record.chunk.type === 'finish') {
          finishReason = record.chunk.reason.kind
        }
      }
      return { ...state, steps: updateStep(state, event.data.step,
        step => ({ ...step, finishReason })) }
    }
    case 'tool/call':
      if (event.data.turn !== state.turn) return state
      return { ...state, phase: 'tools', totalCalls: state.totalCalls + 1,
        steps: updateStep(state, event.data.step, step => ({ ...step, tools: [...step.tools, {
          id: String(event.data.callId), name: event.data.name, status: 'running', startedAt: event.time, endedAt: null,
        }] })) }
    case 'tool/result': {
      if (event.data.turn !== state.turn) return state
      const result = event.data.message
      const failed = result.isError === true || event.data.error !== undefined
      const id = String(result.source.callId)
      const steps = updateStep(state, event.data.step, step => ({ ...step,
        tools: step.tools.map(tool => tool.id === id
          ? { ...tool, status: failed ? 'error' : 'success', endedAt: event.time } : tool),
      }))
      return { ...state, phase: steps.some(step => step.tools.some(tool => tool.status === 'running')) ? 'tools' : 'feedback',
        failedCalls: state.failedCalls + Number(failed), steps }
    }
    case 'step/end':
      if (event.data.turn !== state.turn) return state
      return { ...state, phase: 'feedback', steps: updateStep(state, event.data.step,
        step => ({ ...step, endedAt: event.time })) }
    case 'turn/end': {
      if (event.data.turn !== state.turn) return state
      const phase = event.data.reason.kind === 'completed' && (state.exception?.kind === 'blocked' || state.planError !== null)
        ? 'blocked' : endPhase(event.data.reason.kind)
      return { ...state, phase, reason: event.data.reason.kind, endedAt: event.time,
        steps: state.steps.map(step => ({ ...step, endedAt: step.endedAt ?? event.time,
          tools: step.tools.map(tool => tool.status === 'running'
            ? { ...tool, status: 'interrupted', endedAt: event.time } : tool),
        })) }
    }
    default: return state
  }
}
