/**
 * Browser-half entry for the dsh-cc-loop-alignment plugin — runs inside the
 * dsh web GUI. Registers the plugin settings card into the web-ui plugin
 * group (`web-ui.plugin.item` child slot declared by dsh-web-ui-settings),
 * bound to the `dsh-cc-loop` settings namespace the host half registers.
 *
 * Export discipline (family rule): the /client surface carries what cordis
 * loading needs plus types only — all value exports stay internal.
 */

import type { ClientContext, SettingsScope, SettingsScopeSpec } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the settings-surface SlotMap merge and the
// ctx.settingsScope Context merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { CcLoopSettingsCard, CcLoopSettingsCardController, type CcLoopSettings } from './SettingsCard.tsx'
import { en, zh, type CcLoopKey as SettingsCardKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** cc-loop settings-card copy. */
    'cc-loop': SettingsCardKey
  }

  interface SlotMap {
    /**
     * The child slot the Web UI plugin group declares; this card registers
     * into the group instead of the top-level `settings.plugin.item` list.
     * Spelled here with the same shape so this package can register without
     * depending on the sibling UI package.
     */
    'web-ui.plugin.item': { kind: 'list'; scope: 'root'; owner: SettingsPluginItemOwnerProps }
  }
}

/** Owner share of a plugin card (the section supplies nothing). */
export interface SettingsPluginItemOwnerProps {
  /** Marker field: card owner props are intentionally empty. */
  children?: never
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /**
     * Optional rc.6 compatibility binder provided by dsh-web-ui-settings;
     * absent when that group plugin is not installed, so callers fall back to
     * the official settings scope.
     */
    webUiSettings?: { bind<S>(spec: SettingsScopeSpec<S>): SettingsScope<S> }
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'cc-loop'

/** Settings namespace the card edits (the Host plugin registers it). */
const CC_LOOP_NS = 'dsh-cc-loop'

/** Services required by this plugin. */
export const inject = ['slots', 'locale', 'connection', 'settingsScope', 'remote'] as const

/**
 * Register the cc-loop surface: the plugin settings card over the
 * `dsh-cc-loop` namespace, contributed to the plugin-configuration section.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'cc-loop: dictionaries')

  ctx.inject(['webUiSettings'], (settingsCtx) => {
    const binder = settingsCtx.get('webUiSettings')
    if (binder === undefined) throw new Error('cc-loop: webUiSettings disappeared during injection')
    const controller = new CcLoopSettingsCardController(
      binder.bind<CcLoopSettings>({ namespace: CC_LOOP_NS }),
    )
    settingsCtx.effect(() => () => { controller.dispose() }, 'cc-loop: settings controller')
    settingsCtx.slots.inject('web-ui.plugin.item', () => settingsCtx.slots.register({
      name: 'web-ui.plugin.item',
      id: 'cc-loop',
      order: 105,
      locale: NS,
      inject: () => controller.inject(),
    }, CcLoopSettingsCard))
  })
}
