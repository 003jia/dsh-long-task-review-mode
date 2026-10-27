/** Package-owned invariant companion. @module @deepseek-ai/dsh-claude-loop-alignment/invariant */
import type { Context } from '@deepseek-ai/cordis';
declare module '@deepseek-ai/cordis' {
    interface Context {
        invariants: {
            register(owner: string, install: () => void): () => void;
        };
    }
}
/** Cordis companion plugin name. */
export declare const name = "claude-loop-alignment-invariant";
/** Service required before the companion can reserve package ownership. */
export declare const inject: string[];
/** Register this package's invariant companion. */
export declare const apply: (ctx: Context) => Promise<() => void>;
