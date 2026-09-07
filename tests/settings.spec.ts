/** Settings lifecycle coverage for the Claude Code loop-alignment plugin. */

import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { SettingsProvider } from '@deepseek-ai/dsh-settings'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'

import * as plugin from '../src/index.ts'

/** In-memory settings provider for lifecycle tests. */
class MemorySettings extends SettingsProvider {
  protected load(): Promise<Record<string, unknown>> {
    return Promise.resolve({})
  }

  protected persist(_ns: SettingsNamespace, _section: Record<string, unknown>): Promise<void> {
    return Promise.resolve()
  }
}

const contexts: Context[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => Promise.resolve(ctx.fiber.dispose())))
})

describe('cc-loop settings section', () => {
  it('registers when the optional settings provider mounts after the plugin', async () => {
    const ctx = new Context()
    contexts.push(ctx)
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(ToolRuntime)
    await ctx.plugin(plugin)

    await ctx.plugin(MemorySettings)

    const section = ctx.settings.describe({ redactSecrets: true })
      .find(candidate => candidate.ns === plugin.CC_LOOP_NAMESPACE)
    expect(section?.value).toMatchObject({
      enabled: true,
      maxToolTurns: 20,
      snipAtRatio: 0.6,
    })
  })
})
