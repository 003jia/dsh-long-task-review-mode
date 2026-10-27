/** Live loop diagram and tool ledger, using framework-bound session hooks. */
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import { useEffect, useRef, useState } from 'react'
import type { LoopFlow, LoopPhase, LoopReview, LoopTaskReview } from '../types.ts'
import type { LoopKey } from './locales.ts'
import css from './LoopPanel.module.css'
import { ToolUsage } from './ToolUsage.tsx'

/** Session-specific action bound by the plugin assembly. */
export interface LoopOpenInjected {
  /** Reveal the Loop tab in this session's right sidebar. */
  openLoop(): void
}
type PanelProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsLocale<'loopFlow'>
type ToggleProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<'loopFlow'> & InjectFace<LoopOpenInjected>

const terminalPhases: readonly LoopPhase[] = ['done', 'aborted', 'blocked', 'error', 'limited', 'interrupted']

/** Header entry sharing the session's panel visibility preference. */
export function LoopToggle({ openLoop, t }: ToggleProps) {
  return <button className={css.toggle} type="button" onClick={openLoop}
    aria-label={t('toggle')} title={t('toggle')} data-loop-toggle>
    <span aria-hidden="true">↻</span><span>{t('loopLabel')}</span>
  </button>
}

function elapsed(start: number, end: number | null, t: PropsLocale<'loopFlow'>['t']): string {
  if (end === null) return '—'
  return `${Math.max(0, (end - start) / 1000).toFixed(1)} ${t('seconds')}`
}

function percentage(rate: number): string { return `${(rate * 100).toFixed(1)}%` }

function outcomeKey(outcome: LoopReview['outcome']): LoopKey {
  if (outcome === 'progress') return 'reviewProgress'
  return outcome === 'passed' ? 'reviewPassed' : outcome === 'repair' ? 'reviewRepair'
    : outcome === 'blocked' ? 'reviewBlocked' : 'reviewError'
}

/** Session sidebar entry; no subscription or execution machinery lives in this component. */
export function LoopPanel({ sessionId, useProjection, useSession, useSessionStatus, useTabInfo, t }: PanelProps) {
  const flow = useProjection('claude-loop-flow')
  const usage = useProjection('claude-loop-tool-usage')
  const [completionNotice, setCompletionNotice] = useState<LoopReview | null>(null)
  const noticeDialog = useRef<HTMLDialogElement>(null)
  const observed = useRef<{ sessionId: string; turn: number | null; phase: LoopPhase; reviewSeq: number } | null>(null)
  const notifiedReview = useRef('')
  const pending = useSessionStatus(snapshot => snapshot.get(sessionId)?.pendingInteraction !== undefined)
  const { tab } = useTabInfo()
  const openState = useSession(session => session.openState)
  const terminal = flow !== undefined && terminalPhases.includes(flow.phase)
  const phase: LoopKey = pending && !terminal ? 'waiting' : flow?.phase ?? 'idle'
  const currentReviews = flow?.reviews ?? []
  const latestReview = currentReviews.at(-1)
  const currentItems: LoopTaskReview[] = (flow?.tasks ?? []).map(task => {
    const judged = latestReview?.items?.find(item => item.id === task.id && item.status === task.status
      && item.title === task.title && item.requirement === task.requirement
      && item.result === task.result && JSON.stringify(item.evidenceIds) === JSON.stringify(task.evidenceIds))
    return judged ?? { ...task, passed: false, reason: '', score: null, reused: false }
  })
  const verified = currentItems.filter(item => item.passed).length
  const reviewCurrent = latestReview !== undefined && (flow?.taskSeq == null || latestReview.seq >= flow.taskSeq)
  useEffect(() => {
    const current = { sessionId, turn: flow?.turn ?? null, phase: flow?.phase ?? 'idle' as LoopPhase,
      reviewSeq: latestReview?.seq ?? -1 }
    const previous = observed.current
    observed.current = current
    if (previous === null || previous.sessionId !== current.sessionId || previous.turn !== current.turn
      || current.phase !== 'done') return
    const finishedNow = previous.phase !== 'done' || current.reviewSeq > previous.reviewSeq
    const reviewKey = `${current.sessionId}:${current.turn}:${current.reviewSeq}`
    if (finishedNow && latestReview?.stage === 'overall' && latestReview.turn === current.turn
      && notifiedReview.current !== reviewKey) {
      notifiedReview.current = reviewKey
      setCompletionNotice(latestReview)
    }
  }, [sessionId, flow?.turn, flow?.phase, latestReview?.seq])
  useEffect(() => {
    const dialog = noticeDialog.current
    if (completionNotice !== null && dialog !== null && !dialog.open) dialog.showModal()
    return () => { if (dialog?.open) dialog.close() }
  }, [completionNotice])
  const noticeItems = completionNotice?.items ?? []
  const noticePassed = noticeItems.filter(item => item.passed).length
  return <aside className={css.panel} aria-label={t('title')} data-loop-panel>
    <dialog ref={noticeDialog} className={css.completionDialog} aria-labelledby="loop-completion-title"
      onClose={() => setCompletionNotice(null)} onClick={event => {
        if (event.target === event.currentTarget) setCompletionNotice(null)
      }}>
      {completionNotice !== null && <>
        <header className={css.completionDialogHeader}>
          <div><h2 id="loop-completion-title">{t('completionNoticeTitle')}</h2>
            <p>{t('completionPurpose')}</p></div>
          <button className={css.close} type="button" aria-label={t('close')} onClick={() => setCompletionNotice(null)}>×</button>
        </header>
        <section className={css.completionOverall} aria-label={t('overallCompletion')}>
          <span>{t('overallCompletion')}</span>
          <strong>{completionNotice.score === null ? t('notScored') : percentage(completionNotice.score.rate)}</strong>
          <span>{t(outcomeKey(completionNotice.outcome))}</span>
        </section>
        {noticeItems.length > 0 && <section className={css.completionNoticeItems} aria-label={t('taskSummary')}>
          <h3>{noticePassed}/{noticeItems.length} {t('verifiedItems')}</h3>
          <ul>{noticeItems.map(item => <li key={item.id} data-passed={item.passed}>
            <span>{item.title}</span>
            <strong>{item.score === null ? t(item.status === 'completed' ? 'awaitingApproval' : 'unfinished')
              : `${percentage(item.score.rate)} · ${t(item.passed ? 'reviewPassed' : 'reviewRepair')}`}</strong>
          </li>)}</ul>
        </section>}
      </>}
    </dialog>
    <header className={css.header}>
      <div><h2>{t('title')}</h2><p>{flow?.turn === null || flow === undefined ? t('idleTitle') : `${t('turn')} ${flow.turn}`}</p></div>
      <button className={css.close} type="button" onClick={() => tab.actions.close()} aria-label={t('close')}>×</button>
    </header>
    <div className={css.status} data-phase={phase} role="status"><span className={css.dot} />{t(phase)}</div>
    {flow === undefined ? <p className={css.notice}>{t(openState === 'loading' || openState === 'cold' ? 'loading' : openState === 'error' ? 'historyError' : 'unavailable')}</p> : <>
      {flow.taskKind === 'coding' && <section className={css.planInfo} aria-label={t('planSource')}>
        <p>{t(flow.reviewMode === 'self' ? 'primaryReview' : 'independentReview')}{latestReview?.reviewer&&latestReview.reviewer!=='primary'?' · '+latestReview.reviewer.toUpperCase():''}</p>
        {flow.reviewMode === 'laya' && (flow.plan === null ? <p role="status">{t('planAwaiting')}</p> : <details>
          <summary>{t('planSource')} · {t('planRevision')} {flow.plan.revision}</summary>
          <p>{flow.plan.goal}</p><code>{flow.plan.path}</code>
          <p>{t('planScope')} · {flow.plan.scope}</p>
          <strong>{t('planExceptions')}</strong>
          <p>{t('planRecoverable')} · {flow.plan.exceptions.recoverable}</p>
          <p>{t('planRevisionRule')} · {flow.plan.exceptions.revisePlan}</p>
          <p>{t('planBlocked')} · {flow.plan.exceptions.blocked}</p>
        </details>)}
        {flow.planError !== null && <p className={css.taskGap} role="alert">{t('planInvalid')} · {flow.planError}</p>}
        {flow.exception !== null && <p className={css.taskGap} role="status">{t('exceptionNotice')} · {flow.exception.taskId} · {flow.exception.summary}</p>}
      </section>}
      <div className={css.completion} data-outcome={latestReview?.outcome} role="status">
        <span>{t(latestReview?.policy === 'task-items-v1' || currentItems.length > 0 ? 'overallCompletion' : 'completion')}</span>
        <strong>{latestReview?.score == null || !reviewCurrent ? t(latestReview?.outcome === 'error' || currentItems.length === 0 && latestReview?.policy !== 'task-items-v1' ? 'notScored' : 'awaitingOverall') : percentage(latestReview.score.rate)}</strong>
        <span className={css.reviewOutcome}>{latestReview === undefined || !reviewCurrent ? t('noAssessment') : t(outcomeKey(latestReview.outcome))}</span>
      </div>
      {currentItems.length > 0 && <section className={css.taskSummary} aria-label={t('taskSummary')}>
        <div><strong>{verified}/{currentItems.length}</strong><span>{t('verifiedItems')} · {percentage(verified / currentItems.length)}</span></div>
        <TaskRows items={currentItems} t={t} />
      </section>}
      <div className={css.metrics}>
        <div><strong>{flow.totalSteps}</strong><span>{t('steps')}</span></div>
        <div><strong>{flow.totalCalls}</strong><span>{t('calls')}</span></div>
        <div><strong>{flow.failedCalls}</strong><span>{t('failures')}</span></div>
      </div>
      <ToolUsage usage={usage} t={t} />
      <FlowDiagram flow={flow} waiting={pending && !terminal} t={t} />
      {flow.turn === null && <p className={css.notice}>{t('empty')}</p>}
      <details className={css.history} aria-label={t('timeline')}>
        <summary><h3>{t('timeline')}</h3><span>{flow.totalSteps} {t('historySteps')}</span></summary>
        <div className={css.historyBody}>
          {flow.omittedSteps > 0 && <p className={css.notice}>{t('omitted')} · {flow.omittedSteps}</p>}
          {flow.steps.map(step => <details key={step.number} className={css.step} open={step.endedAt === null}>
            <summary><span>{t('step')} {step.number}</span><span>{elapsed(step.startedAt, step.endedAt, t)}</span></summary>
            {step.finishReason !== null && <span className={css.finishReason}>{t(step.finishReason === 'tool-calls' ? 'requestedTools' : step.finishReason === 'max-tokens' ? 'limited' : 'responseEnded')}</span>}
            {step.tools.length === 0 ? <p className={css.noTools}>{t('noTools')}</p> : <ul className={css.tools}>
              {step.tools.map(tool => <li key={tool.id} data-tool-status={tool.status}>
                <span className={css.toolDot} aria-hidden="true" /><code title={tool.name}>{tool.name}</code>
                <span>{t(tool.status === 'running' ? 'pending' : tool.status === 'error' ? 'toolError' : tool.status === 'interrupted' ? 'interruptedTool' : 'success')}</span>
              </li>)}
            </ul>}
          </details>)}
        </div>
      </details>
    </>}
    <footer className={css.footer}><span>{t('source')}</span><p>{t('modelOnly')}</p></footer>
  </aside>
}

function TaskRows({ items, t }: { items: readonly LoopTaskReview[]; t: PropsLocale<'loopFlow'>['t'] }) {
  return <ul className={css.taskItems}>{items.map(item => <li key={item.id} data-passed={item.passed}>
    <details>
      <summary><span>{item.id} · {item.title}</span><strong>{item.score === null ? t('notScored') : percentage(item.score.rate)}</strong>
        <span>{t(item.passed ? 'reviewPassed' : item.score !== null ? 'reviewRepair' : item.status === 'completed' ? 'awaitingApproval' : 'unfinished')}</span></summary>
      <p className={css.taskRequirement}>{item.requirement}</p>
      {!item.passed && item.reason !== '' && <p className={css.taskGap}>{item.score?.gap === undefined ? item.reason : t(`gap_${item.score.gap}`)}</p>}
    </details>
  </li>)}</ul>
}

function FlowDiagram({ flow, waiting, t }: { flow: LoopFlow; waiting: boolean; t: PropsLocale<'loopFlow'>['t'] }) {
  const last = flow.steps.at(-1)
  const stages: { key: LoopKey; hint: LoopKey; phase: LoopPhase }[] = [
    { key: 'input', hint: 'inputHint', phase: 'input' },
    { key: 'model', hint: 'modelHint', phase: 'model' },
    { key: 'tools', hint: 'toolsHint', phase: 'tools' },
    { key: 'feedback', hint: 'feedbackHint', phase: 'feedback' },
    ...(flow.reviewMode === 'skip' ? [] : [{ key: flow.reviewMode === 'self' ? 'primaryReview' as const : 'assessing' as const,
      hint: 'assessmentStageHint' as const, phase: 'assessing' as const }]),
    { key: 'decision', hint: 'decisionHint', phase: 'done' },
  ]
  const active = terminalPhases.includes(flow.phase) ? stages.length - 1 : stages.findIndex(stage => stage.phase === flow.phase)
  return <div className={css.diagram} aria-label={t('title')}>
    <ol className={css.stages}>
      {stages.map((stage, index) => {
        const skipped = (index === 2 || index === 3) && last !== undefined && last.tools.length === 0 && last.endedAt !== null
        return <li key={stage.key} className={css.stage} data-current={active === index || undefined}
          data-passed={flow.turn !== null && index < active && !skipped || undefined}
          aria-current={active === index ? 'step' : undefined}>
          <span className={css.stageNumber}>{String(index + 1).padStart(2, '0')}</span>
          <div><strong>{t(stage.key)}</strong><span>{t(skipped ? 'noTools' : stage.hint)}</span></div>
          {active === index && <span className={css.stageMarker} aria-hidden="true">{waiting ? '◷' : '●'}</span>}
        </li>
      })}
    </ol>
    <div className={css.returnPath} aria-hidden="true"><span>↑</span><span>{t('repeat')}</span><span>↲</span></div>
  </div>
}
