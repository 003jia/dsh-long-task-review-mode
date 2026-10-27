/** A single native Client bundle with a per-session input control and unified settings. */
import type { Context } from '@deepseek-ai/cordis';
import { type Key } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        longTask: Key;
    }
}
export declare const inject: string[];
export declare function apply(ctx: Context): Promise<void>;
