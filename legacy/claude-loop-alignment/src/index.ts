/**
 * dsh-cc-loop-alignment — host half. Aligns the dsh agent loop with Claude
 * Code's agent loop on existing extension points, ported from the dynamic
 * `claude-loop-alignment` plugin:
 *
 * - maxToolTurns: per-turn tool-use budget (Claude Code `max_turns`).
 * - snip pass: context-pressure tool-result pruning (CC cheap-compression
 *   layer) at `snipAtRatio`.
 * - optional pressure compaction via `ctx.compaction` at `compactAtRatio`
 *   (keep 0 when dsh-compaction-basic runs with auto:true).
 * - token budget: per-user-turn output-token budget with nudge-continuation
 *   and diminishing-returns stop (CC `query/tokenBudget.ts`).
 * - max-output-tokens recovery: steer the CC "Resume directly" message after
 *   a step that hit the output cap (CC `max_output_tokens` recovery).
 * - Tools: `snip` (model-driven history removal) and `plan_agent` (read-only
 *   architect subagent, CC PLAN_AGENT) — see tools.ts.
 *
 * The browser half (./client) renders the settings card in the web GUI plugin
 * section. Configuration flows back through the settings namespace and
 * re-syncs every surface (CC `installSettingsSection` pattern).
 */

import type { Context } from '@deepseek-ai/cordis'
import z from 'schemastery'
import type { Agent, PreStepDecision } from '@deepseek-ai/dsh-agent'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-tools'
import { mountOnce } from './mount-once.ts'
import { makePlanAgentTool, makeSnipTool } from './tools.ts'

/** Stable cordis plugin name. */
export const name = 'cc-loop'

/** Services required before the surfaces can mount. */
export const inject = ['tools', 'systemPrompt'] as const

/**
 * Settings namespace of this plugin — the section the web settings surface
 * edits. Spelled here rather than imported: the browser half spells the same
 * value and must not depend on a Host package.
 */
export const CC_LOOP_NAMESPACE = settingsNamespace('dsh-cc-loop')

/** Plugin config, validated by the same-named schemastery schema. */
export interface Config {
  /** Max tool-use steps per user turn (0 disables the budget). */
  maxToolTurns?: number
  /** Context-pressure ratio that triggers the pruner snip pass (0 disables). */
  snipAtRatio?: number
  /** Context-pressure ratio that triggers summary compaction (0 disables). */
  compactAtRatio?: number
  /** Per-user-turn output-token budget (0 disables). */
  turnTokenBudget?: number
  /** Stop nudging once this share of the budget is consumed. */
  budgetCompletionRatio?: number
  /** Stop after >=3 continuations that each added fewer tokens than this. */
  budgetDiminishingDelta?: number
  /** Max-output-tokens recovery steering attempts (0 disables). */
  maxTokensRecoveryLimit?: number
  /** Whether a system-prompt section announces the plugin to every agent. */
  announceToAgent?: boolean
  /** Master switch for the plugin (listeners, tools, prompt section). */
  enabled?: boolean
}

const DEFAULT_MAX_TOOL_TURNS = 20
const DEFAULT_SNIP_AT_RATIO = 0.6
const DEFAULT_COMPACT_AT_RATIO = 0
const DEFAULT_TURN_TOKEN_BUDGET = 0
const DEFAULT_BUDGET_COMPLETION_RATIO = 0.9
const DEFAULT_BUDGET_DIMINISHING_DELTA = 500
const DEFAULT_MAX_TOKENS_RECOVERY_LIMIT = 3
const DEFAULT_ANNOUNCE = true

const ratioSchema = z.number().min(0).max(1)
const countSchema = z.number().step(1).min(0)

export const Config: z<Config> = z.object({
  maxToolTurns: countSchema.default(DEFAULT_MAX_TOOL_TURNS),
  snipAtRatio: ratioSchema.default(DEFAULT_SNIP_AT_RATIO),
  compactAtRatio: ratioSchema.default(DEFAULT_COMPACT_AT_RATIO),
  turnTokenBudget: countSchema.default(DEFAULT_TURN_TOKEN_BUDGET),
  budgetCompletionRatio: ratioSchema.default(DEFAULT_BUDGET_COMPLETION_RATIO),
  budgetDiminishingDelta: countSchema.default(DEFAULT_BUDGET_DIMINISHING_DELTA),
  maxTokensRecoveryLimit: countSchema.default(DEFAULT_MAX_TOKENS_RECOVERY_LIMIT),
  announceToAgent: z.boolean().default(DEFAULT_ANNOUNCE),
  enabled: z.boolean().default(true),
})

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 160

/** Model-facing announcement: plugin presence, capabilities, and limits. */
export const CC_LOOP_GUIDANCE = '本机已安装 Claude Loop Alignment 插件（Claude Code agent loop 行为对齐）：每用户轮次限制工具调用步数上限 maxToolTurns；上下文压力达 snipAtRatio 时自动剪枝工具结果；可配 token 预算（turnTokenBudget）在轮内以提示续写；输出截断时自动注入断点续写指令；提供 snip（模型主动剪除历史）与 plan_agent（只读规划子代理）工具。参数可在设置-插件中调整。'

/** One plugin-sourced steer message; the loop appends it as a user message. */
function steerMessage(text: string): ReturnType<typeof createUserMessage> {
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'plugin', plugin: 'dsh-cc-loop-alignment' },
  })
}

/**
 * Mount the loop mechanisms, tools, and announcement.
 * @param ctx - host plugin context carrying tools/systemPrompt.
 * @param config - resolved plugin config (schema defaults applied by the loader).
 */
export const apply = mountOnce('@003jia/dsh-cc-loop-alignment', applyImpl)

function applyImpl(ctx: Context, config?: Config): void {
  // The live source the surfaces read: the settings section once the web
  // settings surface is served, the composition entry otherwise.
  let current: () => Config = () => config ?? {}
  const resolve = (): Required<Config> => ({
    maxToolTurns: current().maxToolTurns ?? DEFAULT_MAX_TOOL_TURNS,
    snipAtRatio: current().snipAtRatio ?? DEFAULT_SNIP_AT_RATIO,
    compactAtRatio: current().compactAtRatio ?? DEFAULT_COMPACT_AT_RATIO,
    turnTokenBudget: current().turnTokenBudget ?? DEFAULT_TURN_TOKEN_BUDGET,
    budgetCompletionRatio: current().budgetCompletionRatio ?? DEFAULT_BUDGET_COMPLETION_RATIO,
    budgetDiminishingDelta: current().budgetDiminishingDelta ?? DEFAULT_BUDGET_DIMINISHING_DELTA,
    maxTokensRecoveryLimit: current().maxTokensRecoveryLimit ?? DEFAULT_MAX_TOKENS_RECOVERY_LIMIT,
    announceToAgent: current().announceToAgent ?? DEFAULT_ANNOUNCE,
    enabled: current().enabled ?? true,
  })

  // Per-agent enforcement state, keyed by session id string.
  const enforced = new Map<string, { turn: number; injected: boolean }>()
  const budgetTrackers = new Map<string, {
    continuationCount: number
    lastGlobalTurnTokens: number
    lastDeltaTokens: number
  }>()
  const maxTokensTrackers = new Map<string, number>()

  let disposeTools: (() => void) | undefined
  let disposeSection: (() => void) | undefined

  /** Authoritative count of tool-use steps already executed in this turn. */
  const toolStepCount = (agent: Agent, turn: number): number => {
    let count = 0
    for (const event of agent.session.events) {
      if (event.type !== 'assistant/message') continue
      if (event.data.turn !== turn) continue
      const hasToolCall = event.data.message.content.some(block => block.type === 'tool-call')
      if (hasToolCall) count += 1
    }
    return count
  }

  /** Sum of this turn's assistant output tokens (budget metering). */
  const turnOutputTokens = (agent: Agent, turn: number): number => {
    let total = 0
    for (const event of agent.session.events) {
      if (event.type !== 'assistant/message') continue
      if (event.data.turn !== turn) continue
      const usage = event.data.usage
      if (usage && typeof usage.outputTokens === 'number') total += usage.outputTokens
    }
    return total
  }

  /** Terminal finish reason of the most recent step, read from the chunk stream. */
  const lastFinishKind = (agent: Agent): string | undefined => {
    for (let index = agent.session.events.length - 1; index >= 0; index -= 1) {
      const event = agent.session.events[index]
      if (event.type !== 'assistant/chunk') continue
      const chunk = event.data.chunk
      if (chunk && chunk.type === 'finish' && chunk.reason) return chunk.reason.kind
    }
    return undefined
  }

  /** Measured context pressure: estimated total tokens / routed context window. */
  const measureRatio = async (agent: Agent, signal: AbortSignal): Promise<number | undefined> => {
    const header = agent.session.requestHeader()
    const route = header && header.config ? header.config : undefined
    if (!route || !route.provider || !route.model) return undefined
    const meter = ctx.get('tokenMeter')
    const llm = ctx.get('llm')
    if (!meter || !llm) return undefined
    let contextWindow: number | undefined
    try {
      const info = await llm.resolveModelInfo(route.provider, route.model, signal)
      contextWindow = info?.context?.contextWindow
    } catch {
      return undefined
    }
    if (typeof contextWindow !== 'number' || contextWindow <= 0) return undefined
    let totalTokens: number | undefined
    try {
      totalTokens = meter.measure(agent.session).totalTokens
    } catch {
      return undefined
    }
    if (typeof totalTokens !== 'number') return undefined
    return totalTokens / contextWindow
  }

  /** Re-register every surface to match the current config source. */
  const sync = (): void => {
    const value = resolve()
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-cc-loop-alignment',
        order: SECTION_ORDER,
        text: CC_LOOP_GUIDANCE,
      })
    }
    disposeTools = ctx.effect(
      () => {
        const disposers = [
          ctx.tools.register(makeSnipTool(ctx)),
          ctx.tools.register(makePlanAgentTool(ctx)),
        ]
        return () => { for (const dispose of disposers) dispose() }
      },
      'dsh-cc-loop: tools',
    )
  }

  // ---- loop-boundary listeners (registered once; read config live) ----

  ctx.on('agent/pre-step', async (
    { agent, turn, step, signal },
    next,
  ): Promise<PreStepDecision> => {
    try {
      const value = resolve()
      if (!value.enabled) return next()
      if (signal.aborted) return next()
      const session = agent.session

      // CC-style pressure management: snip (prune), then optional summary.
      const ratio = await measureRatio(agent, signal)
      if (ratio !== undefined) {
        if (value.snipAtRatio > 0 && ratio >= value.snipAtRatio) {
          const pruner = ctx.get('toolResultPruner')
          if (pruner) {
            try {
              pruner.pruneSession(session)
              ctx.logger.info(
                `[cc-loop] snip: pruned tool-result surface at ${Math.round(ratio * 100)}% context pressure`,
              )
            } catch (error: unknown) {
              ctx.logger.warn(`[cc-loop] snip prune failed: ${String(error)}`)
            }
          }
        }
        if (value.compactAtRatio > 0 && ratio >= value.compactAtRatio) {
          const compaction = ctx.get('compaction')
          if (compaction) {
            try {
              const result = await compaction.compactIfNeeded(agent, 'pressure', signal)
              if (result !== null) {
                ctx.logger.info(`[cc-loop] compacted at pressure: shadowed ${result.shadowedSeqs.length} surface nodes`)
              }
            } catch (error: unknown) {
              ctx.logger.warn(`[cc-loop] pressure compaction failed: ${String(error)}`)
            }
          }
        }
      }

      // CC-style max_turns budget.
      if (value.maxToolTurns > 0) {
        const key = String(session.id)
        let state = enforced.get(key)
        if (!state || state.turn !== turn) {
          state = { turn, injected: false }
          enforced.set(key, state)
        }
        const toolSteps = toolStepCount(agent, turn)
        if (toolSteps >= value.maxToolTurns) {
          if (state.injected) {
            ctx.logger.info(`[cc-loop] maxToolTurns exceeded (${toolSteps} >= ${value.maxToolTurns}): rejecting the next step`)
            return { kind: 'reject' }
          }
          state.injected = true
          const decision = await next()
          if (decision.kind === 'reject') return decision
          ctx.logger.info(`[cc-loop] maxToolTurns reached (${toolSteps}): injecting stop instruction at turn ${turn} step ${step}`)
          return {
            ...decision,
            messages: [
              ...decision.messages,
              steerMessage(
                '[turn budget] The configured maximum tool-use steps for this turn have been reached. '
                + 'Do not call any more tools. Give the final answer now, based on the tool results already available. '
                + `(limit: ${value.maxToolTurns})`,
              ),
            ],
          }
        }
      }
      return next()
    } catch (error: unknown) {
      ctx.logger.warn(`[cc-loop] pre-step listener error: ${String(error)}`)
      return next()
    }
  })

  ctx.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    try {
      const value = resolve()
      if (!value.enabled) return
      if (signal.aborted) return
      const session = agent.session
      const key = String(session.id)

      // CC-style max-output-tokens recovery.
      if (value.maxTokensRecoveryLimit > 0) {
        const finishKind = lastFinishKind(agent)
        if (finishKind === 'max-tokens') {
          const count = maxTokensTrackers.get(key) ?? 0
          if (count < value.maxTokensRecoveryLimit) {
            maxTokensTrackers.set(key, count + 1)
            ctx.logger.info(`[cc-loop] max-tokens recovery #${count + 1}: steering resume message`)
            agent.steer(steerMessage(
              'Output token limit hit. Resume directly \u2014 no apology, no recap of what you were doing. '
              + 'Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.',
            ))
            return
          }
          ctx.logger.info(`[cc-loop] max-tokens recovery exhausted (${count} >= ${value.maxTokensRecoveryLimit})`)
        } else if ((maxTokensTrackers.get(key) ?? 0) > 0) {
          maxTokensTrackers.set(key, 0)
        }
      }

      // CC-style token budget with nudge continuation.
      if (value.turnTokenBudget > 0) {
        let tracker = budgetTrackers.get(key)
        if (!tracker) {
          tracker = { continuationCount: 0, lastGlobalTurnTokens: 0, lastDeltaTokens: 0 }
          budgetTrackers.set(key, tracker)
        }
        const turnTokens = turnOutputTokens(agent, turn)
        const pct = Math.round((turnTokens / value.turnTokenBudget) * 100)
        const delta = turnTokens - tracker.lastGlobalTurnTokens
        const diminishing = tracker.continuationCount >= 3
          && delta < value.budgetDiminishingDelta
          && tracker.lastDeltaTokens < value.budgetDiminishingDelta
        if (!diminishing && turnTokens < value.turnTokenBudget * value.budgetCompletionRatio) {
          tracker.continuationCount += 1
          tracker.lastDeltaTokens = delta
          tracker.lastGlobalTurnTokens = turnTokens
          ctx.logger.info(`[cc-loop] token budget: nudging continuation #${tracker.continuationCount} at ${pct}%`)
          agent.steer(steerMessage(
            `Stopped at ${pct}% of token target (${turnTokens.toLocaleString('en-US')} / `
            + `${value.turnTokenBudget.toLocaleString('en-US')}). Keep working \u2014 do not summarize.`,
          ))
          return
        }
        if (diminishing || tracker.continuationCount > 0) {
          ctx.logger.info(`[cc-loop] token budget: turn complete at ${pct}%${diminishing ? ' (diminishing returns)' : ''}`)
        }
      }
    } catch (error: unknown) {
      ctx.logger.warn(`[cc-loop] turn-stopping listener error: ${String(error)}`)
    }
  })

  // Release per-session state when an agent goes idle (user turn fully ended).
  ctx.on('agent/status', ({ agent, status }) => {
    if (status !== 'idle') return
    const key = String(agent.session.id)
    enforced.delete(key)
    maxTokensTrackers.delete(key)
    budgetTrackers.delete(key)
  })

  installSettingsSection(ctx, CC_LOOP_NAMESPACE, Config, config ?? {}, {
    setSource(source) {
      current = source
    },
    onChange: sync,
  })

  // Initial registration from the composition entry (covers deployments with
  // no settings service, whose optional injection never fires).
  sync()
}
