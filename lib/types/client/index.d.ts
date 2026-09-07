/**
 * Browser-half entry for the dsh-cc-loop-alignment plugin — runs inside the
 * dsh web GUI. Registers the plugin settings card into the web-ui plugin
 * group (`web-ui.plugin.item` child slot declared by dsh-web-ui-settings),
 * bound to the `dsh-cc-loop` settings namespace the host half registers.
 *
 * Export discipline (family rule): the /client surface carries what cordis
 * loading needs plus types only — all value exports stay internal.
 */
import type { ClientContext, SettingsScope, SettingsScopeSpec } from '@deepseek-ai/dsh-client-runtime/client';
import { type CcLoopKey as SettingsCardKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** cc-loop settings-card copy. */
        'cc-loop': SettingsCardKey;
    }
    interface SlotMap {
        /**
         * The child slot the Web UI plugin group declares; this card registers
         * into the group instead of the top-level `settings.plugin.item` list.
         * Spelled here with the same shape so this package can register without
         * depending on the sibling UI package.
         */
        'web-ui.plugin.item': {
            kind: 'list';
            scope: 'root';
            owner: SettingsPluginItemOwnerProps;
        };
    }
}
/** Owner share of a plugin card (the section supplies nothing). */
export interface SettingsPluginItemOwnerProps {
    /** Marker field: card owner props are intentionally empty. */
    children?: never;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /**
         * Optional rc.6 compatibility binder provided by dsh-web-ui-settings;
         * absent when that group plugin is not installed, so callers fall back to
         * the official settings scope.
         */
        webUiSettings?: {
            bind<S>(spec: SettingsScopeSpec<S>): SettingsScope<S>;
        };
    }
}
/** Services required by this plugin. */
export declare const inject: readonly ["slots", "locale", "connection", "settingsScope", "remote"];
/**
 * Register the cc-loop surface: the plugin settings card over the
 * `dsh-cc-loop` namespace, contributed to the plugin-configuration section.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
