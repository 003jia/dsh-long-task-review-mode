/** Browser half: a native right-sidebar tab and a session header launcher. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '../types.ts'
import { LoopPanel, LoopToggle, type LoopOpenInjected } from './LoopPanel.tsx'
import { en, zh, type LoopKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Loop observer copy. */
    loopFlow: LoopKey
  }
}

const TAB_ID = '@deepseek-ai/dsh-client-ui-loop-flow'
const TAB_KIND = 'claude-loop-flow'
/** Native sidebar navigation, registration and copy services. */
export const inject = ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight']

/**
 * Register the Loop page through the desktop's native tab extension points.
 * @param ctx - Client context with the native sidebar services.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register('loopFlow', { en, zh }), 'ui-loop-flow: dictionaries')
  const t = ctx.locale.bind('loopFlow')
  ctx.effect(() => ctx.sidebarRightTabs.register({
    id: TAB_ID, kind: TAB_KIND, priority: 'extension',
    title: () => t('title'),
    guide: [{ id: TAB_KIND, order: 10, title: () => t('title'), description: () => t('source') }],
  }), 'ui-loop-flow: native tab type')
  ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
    name: 'sidebar.right.pane.tab', key: TAB_ID, locale: 'loopFlow',
  }, LoopPanel))
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities', id: TAB_KIND, order: 20, locale: 'loopFlow',
    inject: (sessionId): LoopOpenInjected => ({
      openLoop: () => { ctx.sidebarRight.openTabIn(sessionId, TAB_KIND) },
    }),
  }, LoopToggle))
}
