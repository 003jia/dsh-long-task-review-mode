/** Browser half: a native right-sidebar tab and a session header launcher. */
import type { Context } from '@deepseek-ai/cordis';
import { type LoopKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Loop observer copy. */
        loopFlow: LoopKey;
    }
}
/** Native sidebar navigation, registration and copy services. */
export declare const inject: string[];
/**
 * Register the Loop page through the desktop's native tab extension points.
 * @param ctx - Client context with the native sidebar services.
 */
export declare function apply(ctx: Context): void;
