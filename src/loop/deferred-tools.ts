/** Scope-preserving, durable on-demand MCP declarations for native-tool agent requests. */
import type { Context, Volatile } from '@deepseek-ai/cordis'
import type {ProjectionHandle} from '@deepseek-ai/dsh-session-projection'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { z } from 'zod'

interface Selection { names: string[]; pending: Record<string, string> }
declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    'claude-tool-selection': { kind: 'claude-tool-selection'; form: 'notice'; summary: string; names: string[] }
  }
}
const mcp = (name: string): boolean => name.startsWith('mcp__')
const primary = (agent: Agent): boolean => agent.session.header.origin !== 'subagent' && (agent.session.header.delegationDepth ?? 0) === 0

/** Register scope-level MCP gating, explicit discovery and the matching execution gate under one plugin lifetime.
 *
 * DSH 0.2.2 tool declarations are owned by tool providers, so this plugin hides
 * unselected MCP tools with an agent-scoped `tools.restrict()` deny instead of
 * rewriting prompt assembly. One restriction applies per agent; every change
 * replaces it so a selected tool becomes visible to the next model step.
 * @param ctx - owning plugin context.
 * @param enabled - live rollback switch; PTC and delegated scopes retain their existing tool contracts.
 */
export async function registerDeferredTools(ctx: Context, enabled: Volatile<boolean>): Promise<void> {
  /** Session projection keeping explicit selections and tools that executed successfully. */
  const selectionHandle: ProjectionHandle<Selection> = await ctx.sessionProjections.register({ key: 'claudeToolSelection', stateVersion: 1,
    stateSchema: z.object({ names: z.array(z.string()), pending: z.record(z.string(), z.string()) }),
    init: () => ({ names: [], pending: {} }),
    apply(state, event) {
      if (event.type === 'user/message' && event.data.source.kind === 'claude-tool-selection') {
        const parsed = z.array(z.string().refine(mcp)).safeParse(event.data.source.names)
        return parsed.success ? { ...state, names: [...new Set(parsed.data)].sort() } : state
      }
      // Preserve tools that really executed before installation or context compaction.
      if (event.type === 'tool/call' && mcp(event.data.name)) return { ...state,
        pending: { ...state.pending, [event.data.callId]: event.data.name } }
      if (event.type === 'tool/result' && event.surfaceOp === 'append') {
        const id = event.data.message.source.callId, name = state.pending[id]
        if (name === undefined) return state
        const { [id]: _settled, ...pending } = state.pending
        return { pending, names: event.data.message.isError || event.data.error !== undefined
          ? state.names : [...new Set([...state.names, name])].sort() }
      }
      return state
    },
  })
  const selected = (agent: Agent): string[] => selectionHandle.stateOf(agent.session)?.names ?? []
  /** Agents carrying a deny restriction applied by this plugin. */
  const gated = new Set<Agent>()
  /** Primary agents whose declarations this plugin reconciles when tools change. */
  const tracked = new Set<Agent>()
  /** Exact deny list in force, so unchanged steps do not rebuild restrictions. */
  const inForce = new WeakMap<Agent, string>()
  /** Disposer of the current agent-scoped restriction. */
  const restricted = new WeakMap<Agent, () => void>()

  const globalMcpNames = (): string[] => ctx.tools.schemas()
    .map(schema => schema.name).filter(mcp).sort()

  const release = (agent: Agent): void => {
    if (restricted.get(agent) !== undefined) {
      reconciling = true
      try { restricted.get(agent)?.() } finally { reconciling = false }
      restricted.delete(agent)
    }
    gated.delete(agent)
    inForce.delete(agent)
  }

  /** Agents whose selected executor presents only the `run_code` program transport. */
  const programPresentation = new WeakSet<Agent>()
  /** Agents whose presentation was resolved successfully at least once. */
  const presentationKnown = new WeakSet<Agent>()
  /** Whether this plugin is currently changing a restriction, whose own `tools/change` must not recurse. */
  let reconciling = false

  /** Resolve whether this agent's request uses the program transport.
   * PTC keeps its generated SDK; an unresolvable presentation fails open so MCP tools stay callable.
   * @param agent - the primary agent whose selected executor is being read.
   * @returns whether the agent presents the program transport.
   */
  const usesProgramTransport = async (agent: Agent): Promise<boolean> => {
    if (programPresentation.has(agent)) return true
    if (presentationKnown.has(agent)) return false
    try {
      const assembly = await ctx.systemPrompt.assemble({ scope: agent })
      presentationKnown.add(agent)
      if (!assembly.tools.some(tool => tool.name === 'run_code')) return false
      programPresentation.add(agent)
      return true
    } catch (error) {
      ctx.logger.warn(`[long-task] could not resolve the tool presentation for session ${String(agent.session.id)}; MCP tools stay loaded: ${String(error)}`)
      return true
    }
  }

  /** Reconcile one agent's visible MCP declarations with its persisted selection. */
  const gate = (agent: Agent): void => {
    if (!primary(agent)) return
    if (!enabled.get()) { release(agent); return }
    const chosen = new Set(selected(agent))
    const deny = globalMcpNames().filter(name => !chosen.has(name))
    if (deny.length === 0) { release(agent); return }
    const key = deny.join('\n')
    if (inForce.get(agent) === key) return
    restricted.get(agent)?.()
    restricted.delete(agent)
    try {
      reconciling = true
      try { restricted.set(agent, agent.ctx.tools.restrict({ deny })) } finally { reconciling = false }
      gated.add(agent)
      inForce.set(agent, key)
    } catch (error) {
      gated.delete(agent)
      inForce.delete(agent)
      ctx.logger.warn(`[long-task] MCP tool gating is unavailable for session ${String(agent.session.id)}: ${String(error)}`)
    }
  }

  /** Gate a primary agent before its next model step, leaving the program transport uncovered. */
  const gateForStep = async (agent: Agent): Promise<void> => {
    if (!primary(agent)) return
    if (!enabled.get() || await usesProgramTransport(agent)) { release(agent); return }
    gate(agent)
  }

  ctx.on('agent/created', ({ agent }) => { if (primary(agent)) tracked.add(agent); gate(agent) })
  ctx.on('agent/pre-step', async ({ agent }, next) => { await gateForStep(agent); return next() })
  // MCP servers register their tools after startup and after reconnects. Reconcile immediately so a
  // tool that arrives between pre-step and assembly cannot slip into that request undeclared-but-visible.
  ctx.on('tools/change', () => {
    if (reconciling) return
    for (const agent of [...tracked]) if (!programPresentation.has(agent)) gate(agent)
  })
  ctx.on('agent/disposed', ({ agent }) => { tracked.delete(agent); release(agent) })
  // Restrictions live on each agent scope, so unloading this plugin must lift them explicitly.
  ctx.effect(() => () => { for (const agent of [...tracked]) release(agent) })
  ctx.tools.guard(exec => {
    const agent = exec.agent
    if (!enabled.get() || agent === undefined || !gated.has(agent) || !mcp(exec.name) || selected(agent).includes(exec.name)) return undefined
    return `Load this MCP tool with tool_catalog({names:["${exec.name}"]}) before calling it. Existing scope and approval restrictions still apply.`
  })
  ctx.tools.register(defineTool({ name: 'tool_catalog', description:
    'Find and load MCP tools on demand. Unloaded MCP tools are absent from your requests; calling this tool enables matching ones for the next request. '
    + 'Search by provider or capability (for example github, browser, knowledge or search), or supply exact names. '
    + 'Selections are retained across context compaction. Returns descriptions and names, not execution results. '
    + 'Use offset for more matches. Existing tool permissions and approvals remain enforced.',
  parameters: {
    query: { type: 'string', description: 'Space-separated search terms matched against available tool names and descriptions.' },
    names: { type: 'array', items: { type: 'string' }, description: 'Exact tool names to activate, up to 20. All must be available in this scope.' },
    limit: { type: 'integer', description: 'Maximum search matches to activate, default 5, maximum 20.' },
    offset: { type: 'integer', description: 'Search page offset, default 0.' },
  },
  output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
  isConcurrencySafe: () => false,
  async execute(args, exec) {
    const agent = exec.agent
    if (agent === undefined || !primary(agent)) throw new Error('tool_catalog requires a primary agent.')
    const parsed = z.object({ query: z.string().trim().max(500).optional(), names: z.array(z.string().min(1)).min(1).max(20).optional(),
      limit: z.number().int().min(1).max(20).default(5), offset: z.number().int().min(0).default(0) }).parse(args)
    if (!parsed.names && !parsed.query) throw new Error('Supply query or exact names; an empty query does not load every tool.')
    // Discovery reads the global catalog; this agent's own deny restriction must not hide candidates.
    const available = ctx.tools.schemas().filter(schema => mcp(schema.name))
      .sort((a, b) => a.name.localeCompare(b.name))
    if (parsed.names?.some(name => !available.some(schema => schema.name === name))) {
      throw new Error('A requested MCP tool is unavailable in this scope. No tools were activated.')
    }
    const terms = (parsed.query ?? '').toLowerCase().split(/\s+/).filter(Boolean)
    const matches = available.filter(schema => parsed.names ? parsed.names.includes(schema.name)
      : terms.every(term => `${schema.name} ${schema.description}`.toLowerCase().includes(term)))
    const page = parsed.names ? matches : matches.slice(parsed.offset, parsed.offset + parsed.limit)
    const previous = selected(agent), names = [...new Set([...previous, ...page.map(schema => schema.name)])].sort()
    exec.signal.throwIfAborted()
    if (names.length !== previous.length) agent.session.append('user/message', createUserMessage({ source: {
      kind: 'claude-tool-selection', form: 'notice', summary: 'MCP tools loaded on demand', names },
    content: [{ type: 'text', text: `MCP tools now available: ${page.map(schema => schema.name).join(', ')}. Call them using their next-request schemas.` }] }), { surfaceOp: 'append' })
    await gateForStep(agent)
    return JSON.stringify({ matched: matches.length, activated: page.map(schema => ({ name: schema.name, description: schema.description.slice(0, 180) })),
      nextOffset: !parsed.names && parsed.offset + page.length < matches.length ? parsed.offset + page.length : null,
      instruction: 'Loaded schemas will appear in your next request. Call the selected tool to execute it; loading does not grant additional permissions.' })
  },
  }))
}
