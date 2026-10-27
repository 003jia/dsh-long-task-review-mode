/** Compact per-name invocation counts, supplied by the Host's session projection. */
import { useState } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { ToolUsageView } from '../types.ts'
import css from './LoopPanel.module.css'

/** Read-only counters with a local turn/session scope selector. */
export function ToolUsage({ usage, t }: { usage: ToolUsageView | undefined; t: PropsLocale<'loopFlow'>['t'] }) {
  const [scope, setScope] = useState<'current' | 'session'>('current')
  const stats = usage?.[scope]
  return <section className={css.usage} aria-label={t('toolUsage')} data-tool-usage>
    <header><h3>{t('toolUsage')}</h3><div className={css.usageScopes} role="group" aria-label={t('usageScope')}>
      <button type="button" aria-pressed={scope === 'current'} onClick={() => setScope('current')}>{t('thisTurn')}</button>
      <button type="button" aria-pressed={scope === 'session'} onClick={() => setScope('session')}>{t('wholeSession')}</button>
    </div></header>
    {stats === undefined ? <p className={css.notice}>{t('usageUnavailable')}</p> : <>
      <p className={css.usageTotal}><strong>{stats.total}</strong> {t('usageTimes')} · {stats.tools.length} {t('toolKinds')}</p>
      <p className={css.usageOutcomes}>{t('success')} {stats.success} · {t('toolError')} {stats.error}
        {stats.running > 0 && <> · {t('pending')} {stats.running}</>}
        {stats.interrupted > 0 && <> · {t('interruptedTool')} {stats.interrupted}</>}</p>
      {stats.tools.length === 0 ? <p className={css.notice}>{t('usageEmpty')}</p> : <details className={css.usageDetails} open>
        <summary>{t('usageByTool')}</summary>
        <ol className={css.usageList}>{stats.tools.map(tool => <li key={tool.name} data-usage-tool={tool.name}>
          <div><code title={tool.name}>{tool.name}</code><strong>{tool.total} {t('usageTimes')}</strong></div>
          <p>{t('success')} {tool.success} · {t('toolError')} {tool.error}
            {tool.running > 0 && <> · {t('pending')} {tool.running}</>}
            {tool.interrupted > 0 && <> · {t('interruptedTool')} {tool.interrupted}</>}</p>
        </li>)}</ol>
      </details>}
      <p className={css.usageHint}>{t('usageHint')}</p>
    </>}
  </section>
}
