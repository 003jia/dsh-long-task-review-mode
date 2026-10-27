/** Plan delegation across the two desktop subagent lifecycle APIs. */
import type { SubagentResult, SubagentStartRequest } from '@deepseek-ai/dsh-subagent'

interface PlanRun {
  readonly result: Promise<SubagentResult>
  dispose(): Promise<void>
}
interface PlanRuntime {
  start?: (provider: string, request: SubagentStartRequest) => Promise<PlanRun>
  startActivation?: (spec: {
    provider: string; label: string; request: Omit<SubagentStartRequest, 'label' | 'signal'>
    signal: AbortSignal; delivery: 'caller'
  }) => Promise<PlanRun>
}

/**
 * Keep plan results with the calling tool and preserve its cancellation and read-only filter.
 * @param runtime - loaded desktop's subagent lifecycle service.
 * @param provider - backend selected for plan delegation.
 * @param request - plan task and scoped execution options.
 * @returns activation whose result and disposal belong to this tool call.
 */
export function startPlanSubagent(runtime: PlanRuntime, provider: string, request: SubagentStartRequest): Promise<PlanRun> {
  if (runtime.startActivation !== undefined) {
    const { label = 'plan-agent', signal, ...task } = request
    return runtime.startActivation({ provider, label, request: task, signal, delivery: 'caller' })
  }
  if (runtime.start !== undefined) return runtime.start(provider, request)
  throw new Error('The subagent service exposes no supported plan activation method')
}
