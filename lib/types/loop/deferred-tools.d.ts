/** Scope-preserving, durable on-demand MCP declarations for native-tool agent requests. */
import type { Context, Volatile } from '@deepseek-ai/cordis';
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
/** Register scope-level MCP gating, explicit discovery and the matching execution gate under one plugin lifetime.
 *
 * DSH 0.2.2 tool declarations are owned by tool providers, so this plugin hides
 * unselected MCP tools with an agent-scoped `tools.restrict()` deny instead of
 * rewriting prompt assembly. One restriction applies per agent; every change
 * replaces it so a selected tool becomes visible to the next model step.
 * @param ctx - owning plugin context.
 * @param enabled - live rollback switch; PTC and delegated scopes retain their existing tool contracts.
 */
export declare function registerDeferredTools(ctx: Context, enabled: Volatile<boolean>): Promise<void>;
