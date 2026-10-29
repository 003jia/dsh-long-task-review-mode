/** Native desktop plugin with a self-contained Node observer. */
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const dshSource=process.env.DSH_SOURCE
if(!dshSource)throw new Error('Set DSH_SOURCE to a built compatible DSH source workspace')
const {clientBundle}=await import(pathToFileURL(resolve(dshSource,'packages/client/tsdown.client.ts')).href)
const preset = clientBundle('@deepseek-ai/dsh-long-task', ['src/index.ts'], {
  lib: { deps: { alwaysBundle: ['zod', /^@modelcontextprotocol\//, 'acorn','js-yaml'], neverBundle: [/^@deepseek-ai\//] } },
})
// This independent repository is outside the monorepo package roster. Keep the
// shared CSS/module wrapper and pin the only value imports used by its browser face.
const shared = new Set(['react', 'react/jsx-runtime', 'react-dom', '@deepseek-ai/cordis', '@deepseek-ai/dsh-client-store'])
export default (input: Parameters<typeof preset>[0]) => preset(input).map(config =>
  config.name?.endsWith('/client') ? { ...config,
    deps: { neverBundle: (name: string) => shared.has(name), alwaysBundle: (name: string) => !shared.has(name) },
    plugins: [...(config.plugins ?? []).filter(plugin => plugin && 'name' in plugin && plugin.name !== 'dsh-client-bundle-purity'), {
      name: 'standalone-client-imports', resolveId(name: string) {
        if(name==='@deepseek-ai/dsh-client-ui-primitives')return '\0long-task-controls'

        if (name.startsWith('@deepseek-ai/') && !shared.has(name)) throw new Error(`Unsupported browser value import: ${name}`)
        return null
      },
      load(id:string){if(id==='\0long-task-controls')return ['Button','Switch','Menu'].map(name=>`export {${name}} from ${JSON.stringify(resolve(dshSource,'packages/client/ui-primitives/src/'+name+'.tsx'))};`).join('\n')},
    }],
  } : { ...config, target: 'es2022' })
