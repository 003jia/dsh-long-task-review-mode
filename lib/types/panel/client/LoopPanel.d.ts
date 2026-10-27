/** Live loop diagram and tool ledger, using framework-bound session hooks. */
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots';
/** Session-specific action bound by the plugin assembly. */
export interface LoopOpenInjected {
    /** Reveal the Loop tab in this session's right sidebar. */
    openLoop(): void;
}
type PanelProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsLocale<'loopFlow'>;
type ToggleProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<'loopFlow'> & InjectFace<LoopOpenInjected>;
/** Header entry sharing the session's panel visibility preference. */
export declare function LoopToggle({ openLoop, t }: ToggleProps): import("react").JSX.Element;
/** Session sidebar entry; no subscription or execution machinery lives in this component. */
export declare function LoopPanel({ sessionId, useProjection, useSession, useSessionStatus, useTabInfo, t }: PanelProps): import("react").JSX.Element;
export {};
