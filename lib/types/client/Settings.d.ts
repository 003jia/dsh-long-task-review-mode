import type { PropsRuntime, PropsLocale, InjectFace } from '@deepseek-ai/dsh-client-ui-slots';
import type { Snapshot, Request } from '../wire.ts';
import type { LayaSettings, LayaView } from '../laya/types.ts';
export interface SettingsActions {
    act(request: Request): Promise<Snapshot>;
    layaStatus(): Promise<LayaView>;
    saveLaya(settings: LayaSettings): Promise<LayaView>;
    reconnect(): Promise<LayaView>;
}
type Props = PropsRuntime<'settings.section'> & PropsLocale<'longTask'> & InjectFace<SettingsActions>;
export declare function Settings({ act, layaStatus, saveLaya, reconnect, t }: Props): import("react").JSX.Element;
export {};
