/** Scope-preserving, durable on-demand MCP declarations for native-tool agent requests. */
import type { Context, Volatile } from '@deepseek-ai/cordis';
interface Selection {
    names: string[];
    pending: Record<string, string>;
}
declare module '@deepseek-ai/dsh-session-projection' {
    interface SessionProjectionStateMap {
        claudeToolSelection: Selection;
    }
}
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'claude-tool-selection': {
            kind: 'claude-tool-selection';
            form: 'notice';
            summary: string;
            names: string[];
        };
    }
}
/** Register prompt filtering, explicit discovery and the matching execution gate under one plugin lifetime.
 * @param ctx - owning plugin context.
 * @param enabled - live rollback switch; PTC and delegated scopes retain their existing tool contracts.
 */
export declare function registerDeferredTools(ctx: Context, enabled: Volatile<boolean>): void;
export {};
