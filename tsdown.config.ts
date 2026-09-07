/**
 * Standalone build config for the dsh-cc-loop-alignment plugin.
 * Uses the repo's shared client-bundle preset: node-half lib/ plus the
 * browser bundle lib/client.js for the GUI's __ModuleLoader__.
 */
import { clientBundle } from './build/tsdown.client.ts'

export default clientBundle('@003jia/dsh-cc-loop-alignment', ['src/index.ts', 'src/invariant.ts'], {
  libExternal: [
    '@deepseek-ai/dsh-agent',
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-compaction',
    '@deepseek-ai/dsh-llm',
    '@deepseek-ai/dsh-session',
    '@deepseek-ai/dsh-settings',
    '@deepseek-ai/dsh-subagent',
    '@deepseek-ai/dsh-token-meter',
    '@deepseek-ai/dsh-system-prompt',
    '@deepseek-ai/dsh-tools',
    'schemastery',
  ],
})
