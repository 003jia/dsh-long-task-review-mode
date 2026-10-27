import type { PropsRuntime, PropsLocale, InjectFace } from '@deepseek-ai/dsh-client-ui-slots';
import type { Request, Snapshot } from '../wire.ts';
export interface ModeActions {
    act(request: Request): Promise<Snapshot>;
    open(): void;
}
type Props = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<'longTask'> & InjectFace<ModeActions>;
export declare function Mode({ sessionId, useProjection, act, open, t }: Props): import("react").JSX.Element | null;
export {};
