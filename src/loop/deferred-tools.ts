/** Scope-preserving, durable on-demand MCP declarations for native-tool agent requests. */
import type { Context, Volatile } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { z } from 'zod'

interface Selection { names: string[]; pending: Record<string, string> }
declare module '@deepseek-ai/dsh-session-projection' {
  interface SessionProjectionStateMap { claudeToolSelection: Selection }
}
declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    'claude-tool-selection': { kind: 'claude-tool-selection'; form: 'notice'; summary: string; names: string[] }
  }
}
const mcp = (name: string): boolean => name.startsWith('mcp__')
const primary = (agent: Agent): boolean => agent.session.header.origin !== 'subagent' && (agent.session.header.delegationDepth ?? 0) === 0

/** Register prompt filtering, explicit discovery and the matching execution gate under one plugin lifetime.
 * @param ctx - owning plugin context.
 * @param enabled - live rollback switch; PTC and delegated scopes retain their existing tool contracts.
 */
export function registerDeferredTools(ctx: Context, enabled: Volatile<boolean>): void {
  const catalogs = new WeakMap<Agent, Set<string>>()
  const active = new WeakSet<Agent>()
  ctx.sessionProjections.register({ key: 'claudeToolSelection', stateVersion: 1,
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
  const selected = (agent: Agent): string[] => ctx.sessionProjections.stateOf(agent.session, 'claudeToolSelection')?.names ?? []
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembly = await next(), agent = context.agent
    if (agent === undefined || context.scope !== agent || !primary(agent)) return assembly
    // PTC owns its generated SDK. Do not filter declarations independently of that SDK.
    if (!enabled.get() || assembly.tools.some(tool => tool.name === 'run_code') || !assembly.tools.some(tool => tool.name === 'tool_catalog')) {
      active.delete(agent); catalogs.delete(agent); return assembly
    }
    active.add(agent)
    catalogs.set(agent, new Set(assembly.tools.filter(tool => mcp(tool.name)).map(tool => tool.name)))
    const names = new Set(selected(agent))
    return { ...assembly, tools: assembly.tools.filter(tool => !mcp(tool.name) || names.has(tool.name)) }
  })
  ctx.tools.guard(exec => {
    const agent = exec.agent
    if (!enabled.get() || agent === undefined || !active.has(agent) || !mcp(exec.name) || selected(agent).includes(exec.name)) return undefined
    return `Load this MCP tool with tool_catalog({names:["${exec.name}"]}) before calling it. Existing scope and approval restrictions still apply.`
  })
  ctx.tools.register(defineTool({ name: 'tool_catalog', description:
    'Find and load MCP tools on demand. Search by provider or capability (for example github, browser, knowledge or search), or supply exact names. '
    + 'Matching tools are activated for your next request and retained across context compaction. Returns descriptions and names, not execution results. '
    + 'Use offset for more matches. Existing tool permissions and approvals remain enforced.',
  parameters: {
    query: { type: 'string', description: 'Space-separated search terms matched against visible tool names and descriptions.' },
    names: { type: 'array', items: { type: 'string' }, description: 'Exact tool names to activate, up to 20. All must be visible to this agent.' },
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
    const catalog = catalogs.get(agent)
    const visible = ctx.tools.schemas(agent).filter(tool => mcp(tool.name) && (!active.has(agent) || catalog?.has(tool.name)))
      .sort((a, b) => a.name.localeCompare(b.name))
    if (parsed.names?.some(name => !visible.some(tool => tool.name === name))) throw new Error('A requested MCP tool is unavailable in this scope. No tools were activated.')
    const terms = (parsed.query ?? '').toLowerCase().split(/\s+/).filter(Boolean)
    const matches = visible.filter(tool => parsed.names ? parsed.names.includes(tool.name)
      : terms.every(term => `${tool.name} ${tool.description}`.toLowerCase().includes(term)))
    const page = parsed.names ? matches : matches.slice(parsed.offset, parsed.offset + parsed.limit)
    const previous = selected(agent), names = [...new Set([...previous, ...page.map(tool => tool.name)])].sort()
    exec.signal.throwIfAborted()
    if (names.length !== previous.length) agent.session.append('user/message', createUserMessage({ source: {
      kind: 'claude-tool-selection', form: 'notice', summary: 'MCP tools loaded on demand', names },
    content: [{ type: 'text', text: `MCP tools now available: ${page.map(tool => tool.name).join(', ')}. Call them using their next-request schemas.` }] }), { surfaceOp: 'append' })
    return JSON.stringify({ matched: matches.length, activated: page.map(tool => ({ name: tool.name, description: tool.description.slice(0, 180) })),
      nextOffset: !parsed.names && parsed.offset + page.length < matches.length ? parsed.offset + page.length : null,
      instruction: 'Loaded schemas will appear in your next request. Call the selected tool to execute it; loading does not grant additional permissions.' })
  },
  }))
}
