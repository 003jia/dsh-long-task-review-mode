/**
 * dsh-cc-loop-alignment — agent tools.
 *
 * `snip`: model-driven history removal (Claude Code SnipTool analog). Removes
 * the oldest surface nodes before the kept tail and replaces them with one
 * placeholder user message, following the shadow-price protocol used by
 * dsh-tool-result-pruner: a log-only `compaction/prune` pricing event is
 * appended immediately before the surface replacement. No summarizer/LLM call.
 *
 * `plan_agent`: read-only software-architect subagent (Claude Code
 * PLAN_AGENT analog). Delegates planning to a subagent scoped by a read-only
 * tool allowlist and `maxDepth: 1`, returning a step-by-step plan.
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-compaction'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { SubagentRuntime } from '@deepseek-ai/dsh-subagent'
import type { TokenMeter } from '@deepseek-ai/dsh-token-meter'
import { defineTool, type ToolDefinition, type ToolRunContext } from '@deepseek-ai/dsh-tools'

const PLUGIN = 'dsh-cc-loop-alignment'

/** One plugin-sourced message; the loop appends it as a user message. */
function pluginMessage(text: string): ReturnType<typeof createUserMessage> {
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'plugin', plugin: PLUGIN },
  })
}

/** Read-only architect prompt (Claude Code PLAN_AGENT, adapted to dsh tools). */
function planPrompt(instruction: string, perspective: string | undefined): string {
  const lens = perspective
    ? `You are asked to apply this specific perspective to your design: ${perspective}\n\n`
    : ''
  return [
    'You are a software architect and planning specialist. Your role is to explore the codebase and design an implementation plan.',
    '',
    '=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===',
    'This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from creating, modifying, deleting, moving, or copying files, and from running any command that changes system state. You do NOT have access to write or shell tools - attempting to use them will fail.',
    '',
    'Your tools are limited to read-only exploration: read (read files), glob (find files by pattern), grep (search file contents), read_image/describe_image, and the read-only inspection tools.',
    '',
    `Requirements:\n${instruction}`,
    '',
    lens,
    '## Your Process',
    '1. Understand Requirements: Focus on the requirements and your assigned perspective.',
    '2. Explore Thoroughly: read any relevant files, find existing patterns and conventions, understand the current architecture, identify similar features as reference, trace relevant code paths.',
    '3. Design Solution: create an implementation approach, consider trade-offs and architectural decisions, follow existing patterns.',
    '4. Detail the Plan: provide a step-by-step implementation strategy, identify dependencies and sequencing, anticipate potential challenges.',
    '',
    '## Required Output',
    'End your response with:',
    '### Critical Files for Implementation',
    'List 3-5 files most critical for implementing this plan.',
    '',
    'REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files.',
  ].join('\n')
}

/** Allowlist of read-only tools the plan subagent may inherit (scoped registrations of the subagent itself are never filtered). */
const PLAN_TOOL_ALLOW = [
  'read', 'glob', 'grep', 'read_image', 'describe_image',
  'get_goal', 'job_list', 'job_output', 'list_agents',
]

/**
 * Build the `snip` tool.
 * @param ctx - host plugin context (tokenMeter read via ctx.get).
 * @returns the registered tool definition.
 */
export function makeSnipTool(ctx: Context): ToolDefinition {
  return defineTool({
    name: 'snip',
    description: 'Remove the oldest part of the conversation history at the model\u2019s discretion (Claude Code SnipTool analog). '
      + 'Deletes all surface messages before the most recent `keep_recent` messages and replaces them with one small '
      + 'placeholder, freeing context without summarization. Use when early discussion is no longer relevant. '
      + 'Returns the number of messages and tokens removed.',
    parameters: {
      keep_recent: {
        type: 'integer',
        description: 'How many of the most recent surface messages to keep. Default 15, minimum 1.',
      },
      reason: {
        type: 'string',
        description: 'Optional one-line reason, recorded in the placeholder text.',
      },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          removed: { type: 'integer', required: true },
          kept: { type: 'integer', required: true },
          shadowedTokens: { type: 'integer', required: true },
        },
        additionalProperties: false,
      },
      render: (_args, value) => [
        { type: 'text', text: `snip: removed ${value.removed} message(s), kept ${value.kept} (${value.shadowedTokens} tokens freed)` },
      ],
    },
    isConcurrencySafe: () => false,
    async execute(args: { keep_recent?: number; reason?: string }, exec: ToolRunContext): Promise<{
      removed: number
      kept: number
      shadowedTokens: number
    }> {
      const agent = exec.agent
      if (!agent) throw new Error('snip requires an owning agent')
      const session = agent.session
      const meter = ctx.get('tokenMeter') as TokenMeter | undefined
      const nodes = [...session.surface.nodes]
      if (nodes.length === 0) return { removed: 0, kept: 0, shadowedTokens: 0 }
      let keep = typeof args.keep_recent === 'number' && Number.isFinite(args.keep_recent)
        ? Math.trunc(args.keep_recent)
        : 15
      if (keep < 1) keep = 1
      const shadowCount = nodes.length - keep
      if (shadowCount <= 0) return { removed: 0, kept: nodes.length, shadowedTokens: 0 }
      const shadowedSeqs = nodes.slice(0, shadowCount)
      const start = nodes[0]
      const end = nodes[shadowCount - 1]
      let shadowedTokens = 0
      if (meter) {
        try {
          const measurement = meter.measure(session)
          if (measurement && Array.isArray(measurement.nodes)) {
            const bySeq = new Map(measurement.nodes.map(node => [node.seq, node]))
            for (const seq of shadowedSeqs) {
              const node = bySeq.get(seq)
              if (node && typeof node.tokens === 'number') shadowedTokens += node.tokens
            }
          }
        } catch {
          // Metering is best-effort; the replacement still lands.
        }
      }
      const reason = typeof args.reason === 'string' ? args.reason.slice(0, 200) : undefined
      const message = pluginMessage(
        `[History snipped at the model's request: earlier messages were removed.${reason ? ` Reason: ${reason}` : ''}]`,
      )
      // Shadow-price protocol: the metering event must be appended
      // synchronously right before its surface replacement.
      const pruneEvent = session.append('compaction/prune', {
        shadowedRange: { start, end },
        shadowedSeqs: [...shadowedSeqs],
        shadowedTokenCount: shadowedTokens,
      })
      session.append('user/message', message, {
        surfaceOp: { op: 'replace', start, end },
        sourceEventSeqs: [pruneEvent.seq, ...shadowedSeqs],
      })
      ctx.logger.info(`[cc-loop] snip tool: removed ${shadowCount} message(s) (${shadowedTokens} tokens)`)
      return { removed: shadowCount, kept: nodes.length - shadowCount, shadowedTokens }
    },
  })
}

/**
 * Build the `plan_agent` tool.
 * @param ctx - host plugin context (subagents read via ctx.get).
 * @returns the registered tool definition.
 */
export function makePlanAgentTool(ctx: Context): ToolDefinition {
  return defineTool({
    name: 'plan_agent',
    description: 'Delegate planning to a read-only software-architect subagent (Claude Code PLAN_AGENT analog). '
      + 'Use for implementation planning: the subagent explores the codebase with read-only tools and returns a '
      + 'step-by-step plan with critical files, without modifying anything. Best used in plan mode before exit_plan_mode.',
    parameters: {
      instruction: {
        type: 'string',
        description: 'The requirements to plan for: the task, the goal, and any constraints. Include relevant file paths.',
      },
      perspective: {
        type: 'string',
        description: 'Optional design perspective/lens to apply while planning (e.g. minimal-diff, performance-first, testability).',
      },
    },
    output: {
      schema: {
        type: 'object',
        properties: { summary: { type: 'string', required: true }, plan: { type: 'string', required: true } },
        additionalProperties: false,
      },
      render: (_args, value) => [
        { type: 'text', text: value.summary },
        { type: 'text', text: `\n\n--- Plan Agent output ---\n\n${value.plan}` },
      ],
    },
    isConcurrencySafe: () => false,
    async execute(args: { instruction?: string; perspective?: string }, exec: ToolRunContext): Promise<{
      summary: string
      plan: string
    }> {
      const agent = exec.agent
      if (!agent) throw new Error('plan_agent requires an owning agent')
      const subagents = ctx.get('subagents') as SubagentRuntime | undefined
      if (!subagents) throw new Error('plan_agent: subagent service unavailable')
      const names = subagents.list()
      if (names.length === 0) throw new Error('plan_agent: no subagent provider is registered')
      // Pick the first provider that supports start-time tool filtering
      // (in-process backends implement the scoped tools.restrict() window).
      let providerName: string | undefined
      for (const name of names) {
        const provider = subagents.getProvider(name)
        if (provider && provider.capabilities && provider.capabilities.toolFilter === true) {
          providerName = name
          break
        }
      }
      if (!providerName) {
        throw new Error('plan_agent: no subagent provider with tool-filter capability (read-only scoping required)')
      }
      const promptText = planPrompt(
        String(args.instruction ?? ''),
        args.perspective === undefined ? undefined : String(args.perspective),
      )
      const run = await subagents.start(providerName, {
        label: 'plan-agent',
        prompt: [{ type: 'text', text: promptText }],
        parent: agent,
        signal: exec.signal,
        maxDepth: 1,
        toolFilter: { allow: PLAN_TOOL_ALLOW },
      })
      try {
        const result = await run.result
        const text = result.output
          .filter(block => block.type === 'text')
          .map(block => block.text)
          .join('\n')
        const reason = result.stopReason
        if (reason !== 'completed' && reason !== 'max-tokens') {
          throw new Error(`plan subagent ended with stop reason ${reason}${text ? `:\n${text}` : ''}`)
        }
        if (!text.trim()) throw new Error('plan subagent produced no output')
        const firstLine = text.trim().split('\n').find(line => line.trim() !== '') ?? ''
        const summary = firstLine
          ? `Plan agent\u300c${firstLine.slice(0, 120)}\u300d (${reason})`
          : `Plan agent finished (${reason})`
        return { summary, plan: text }
      } finally {
        await run.dispose()
      }
    },
  })
}
