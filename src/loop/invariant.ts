/** Package-owned invariant companion. @module @deepseek-ai/dsh-claude-loop-alignment/invariant */

import type { Context } from '@deepseek-ai/cordis'
// Earlier profiles may load this companion; the current runtime does not ship its legacy type package.
declare module '@deepseek-ai/cordis' {
  interface Context {
    invariants: { register(owner: string, install: () => void): () => void }
  }
}

const PACKAGE_NAME = '@deepseek-ai/dsh-claude-loop-alignment'

/** Cordis companion plugin name. */
export const name = 'claude-loop-alignment-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/** No runtime invariant: the alignment contributes independent existing extension points. */
const install = () => {}

/** Register this package's invariant companion. */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
