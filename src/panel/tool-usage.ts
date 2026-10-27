/** Read-only invocation statistics. Token chunks and schema discovery never count as calls. */
import { z } from 'zod'
import type {} from '@deepseek-ai/dsh-tools/types'
import type { SessionEvent } from '@deepseek-ai/dsh-session/types'
import type { ToolUsageCall, ToolUsageCounts, ToolUsageState, ToolUsageSummary, ToolUsageView } from './types.ts'

const counts = z.object({ total: z.number().int().nonnegative(), success: z.number().int().nonnegative(),
  error: z.number().int().nonnegative(), running: z.number().int().nonnegative(), interrupted: z.number().int().nonnegative() })
const call = z.object({ id: z.string(), step: z.number().int(), name: z.string(), kind: z.enum(['native', 'nested']),
  status: z.enum(['running', 'success', 'error', 'interrupted']) })
const summary = counts.extend({ tools: z.array(counts.extend({ name: z.string() })) })

/** Checkpoint schema for the private pairing index. */
export const toolUsageStateSchema = z.object({ lastSeq: z.number().int(), turn: z.number().int().nullable(),
  current: z.record(z.string(), counts), session: z.record(z.string(), counts),
  calls: z.record(z.string(), z.record(z.string(), call)) })
/** Only aggregate counters cross the Host/Client boundary. */
export const toolUsageViewSchema = z.object({ turn: z.number().int().nullable(), current: summary, session: summary })

const emptyCounts = (): ToolUsageCounts => ({ total: 0, success: 0, error: 0, running: 0, interrupted: 0 })
/** Create an empty session-local counter. */
export function emptyToolUsage(): ToolUsageState {
  return { lastSeq: -1, turn: null, current: {}, session: {}, calls: {} }
}

function transition(rows: Record<string, ToolUsageCounts>, name: string,
  previous: ToolUsageCall['status'] | null, next: ToolUsageCall['status']): Record<string, ToolUsageCounts> {
  const value = { ...(Object.hasOwn(rows, name) ? rows[name] : emptyCounts()) }
  if (previous === null) value.total++
  else value[previous]--
  value[next]++
  return { ...rows, [name]: value }
}

function record(state: ToolUsageState, turn: number, key: string, next: ToolUsageCall, seq: number): ToolUsageState {
  const bucket = state.calls[String(turn)] ?? {}, previous = bucket[key]
  if (previous !== undefined && (previous.status === next.status || previous.status === 'success' || previous.status === 'error')) return state
  return { ...state, lastSeq: seq,
    current: turn === state.turn ? transition(state.current, next.name, previous?.status ?? null, next.status) : state.current,
    session: transition(state.session, next.name, previous?.status ?? null, next.status),
    calls: { ...state.calls, [String(turn)]: { ...bucket, [key]: next } } }
}

/**
 * Fold recorded native calls/results and nested PTC dispatches. New call identities
 * count as new attempts; duplicate events/results and content replacements do not.
 * @param state - counter through the previous event.
 * @param event - committed event, in session order.
 * @returns immutable state; unrelated streaming events keep the same reference.
 */
export function foldToolUsage(state: ToolUsageState, event: SessionEvent): ToolUsageState {
  if (event.seq <= state.lastSeq) return state
  switch (event.type) {
    case 'turn/start':
      return state.turn === event.data.turn ? state : { ...state, lastSeq: event.seq, turn: event.data.turn, current: {} }
    case 'tool/call': {
      const data = event.data, key = JSON.stringify(['native', data.step, String(data.callId)])
      if (state.calls[String(data.turn)]?.[key] !== undefined) return state
      return record(state, data.turn, key, { id: String(data.callId), step: data.step, name: data.name,
        kind: 'native', status: 'running' }, event.seq)
    }
    case 'tool/result': {
      if (event.surfaceOp !== 'append') return state
      const data = event.data, key = JSON.stringify(['native', data.step, String(data.message.source.callId)])
      const previous = state.calls[String(data.turn)]?.[key]
      if (previous === undefined) return state
      return record(state, data.turn, key, { ...previous,
        status: data.message.isError === true || data.error !== undefined ? 'error' : 'success' }, event.seq)
    }
    case 'tool/ptc-dispatch-start':
    case 'tool/ptc-dispatch': {
      // The bridge encloses child events inside their root's execution. Reused
      // provider call IDs in later steps resolve to the newest root in this turn.
      if (state.turn === null) return state
      const data = event.data
      const root = Object.values(state.calls[String(state.turn)] ?? {}).findLast(c => c.kind === 'native' && c.id === String(data.rootCallId))
      if (root === undefined) return state
      const key = JSON.stringify(['nested', root.step, String(data.subCallId)])
      const previous = state.calls[String(state.turn)]?.[key]
      if (event.type === 'tool/ptc-dispatch-start' && previous !== undefined) return state
      return record(state, state.turn, key, { id: String(data.subCallId), step: root.step, name: data.name, kind: 'nested',
        status: event.type === 'tool/ptc-dispatch-start' ? 'running'
          : event.data.isError || event.data.error !== undefined ? 'error' : 'success' }, event.seq)
    }
    case 'turn/end': {
      let next = state
      for (const [key, value] of Object.entries(state.calls[String(event.data.turn)] ?? {})) {
        if (value.status === 'running') next = record(next, event.data.turn, key, { ...value, status: 'interrupted' }, event.seq)
      }
      return next
    }
    default: return state
  }
}

function summarize(rows: Record<string, ToolUsageCounts>): ToolUsageSummary {
  const tools = Object.entries(rows).map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => b.total - a.total || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  return { ...tools.reduce((sum, row) => ({ total: sum.total + row.total, success: sum.success + row.success,
    error: sum.error + row.error, running: sum.running + row.running, interrupted: sum.interrupted + row.interrupted }), emptyCounts()), tools }
}

/** Derive small display aggregates without exposing the replay identity index. */
export function toolUsageView(state: ToolUsageState): ToolUsageView {
  return { turn: state.turn, current: summarize(state.current), session: summarize(state.session) }
}
