import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ToolUsageView } from '../types.ts';
/** Read-only counters with a local turn/session scope selector. */
export declare function ToolUsage({ usage, t }: {
    usage: ToolUsageView | undefined;
    t: PropsLocale<'loopFlow'>['t'];
}): import("react").JSX.Element;
