/**
 * The cc-loop settings card: the Claude Code loop-alignment parameters.
 * Registers into the `web-ui.plugin.item` slot the web-ui plugin group
 * renders, bound to the `dsh-cc-loop` settings namespace.
 */

import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import { PluginSettingsCard, ValueField, BooleanField } from './PluginSettingsCard.tsx'
import { CardForm, booleanField, numberField, type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts'

/** The cc-loop fields this card edits (the namespace's full schema). */
export interface CcLoopSettings {
  /** Master switch for the plugin. */
  enabled?: boolean
  /** Whether a system-prompt section announces the plugin to every agent. */
  announceToAgent?: boolean
  /** Max tool-use steps per user turn (0 disables the budget). */
  maxToolTurns?: number
  /** Context-pressure ratio that triggers the pruner snip pass (0 disables). */
  snipAtRatio?: number
  /** Context-pressure ratio that triggers summary compaction (0 disables). */
  compactAtRatio?: number
  /** Per-user-turn output-token budget (0 disables). */
  turnTokenBudget?: number
  /** Stop nudging once this share of the budget is consumed. */
  budgetCompletionRatio?: number
  /** Stop after >=3 continuations that each added fewer tokens than this. */
  budgetDiminishingDelta?: number
  /** Max-output-tokens recovery steering attempts (0 disables). */
  maxTokensRecoveryLimit?: number
}

/** What the cc-loop card renders. */
export interface CcLoopSettingsCardState extends CardShell {
  enabled: CardFieldState
  announceToAgent: CardFieldState
  maxToolTurns: CardFieldState
  snipAtRatio: CardFieldState
  compactAtRatio: CardFieldState
  turnTokenBudget: CardFieldState
  budgetCompletionRatio: CardFieldState
  budgetDiminishingDelta: CardFieldState
  maxTokensRecoveryLimit: CardFieldState
}

/** The registration-side face the card's slot entry injects. */
export interface CcLoopSettingsCardFace extends CardActions {
  hooks: {
    /** Card snapshot bound by the renderer as useCcLoopSettingsCard. */
    ccLoopSettingsCard: SnapshotStore<CcLoopSettingsCardState>
  }
}

/** Bridges the `dsh-cc-loop` scope onto the card's staged form. */
export class CcLoopSettingsCardController {
  private readonly form: CardForm<CcLoopSettings>
  private readonly store: SnapshotStore<CcLoopSettingsCardState>

  /** @param scope - the bound settings scope for the `dsh-cc-loop` namespace. */
  constructor(scope: SettingsScope<CcLoopSettings>) {
    this.form = new CardForm(scope, [
      booleanField('enabled'),
      booleanField('announceToAgent'),
      numberField('maxToolTurns', { integer: true, min: 0 }),
      numberField('snipAtRatio', { min: 0 }),
      numberField('compactAtRatio', { min: 0 }),
      numberField('turnTokenBudget', { integer: true, min: 0 }),
      numberField('budgetCompletionRatio', { min: 0 }),
      numberField('budgetDiminishingDelta', { integer: true, min: 0 }),
      numberField('maxTokensRecoveryLimit', { integer: true, min: 0 }),
    ])
    this.store = this.form.bind(() => this.projection())
  }

  private projection(): CcLoopSettingsCardState {
    return {
      ...this.form.shell(),
      enabled: this.form.field('enabled'),
      announceToAgent: this.form.field('announceToAgent'),
      maxToolTurns: this.form.field('maxToolTurns'),
      snipAtRatio: this.form.field('snipAtRatio'),
      compactAtRatio: this.form.field('compactAtRatio'),
      turnTokenBudget: this.form.field('turnTokenBudget'),
      budgetCompletionRatio: this.form.field('budgetCompletionRatio'),
      budgetDiminishingDelta: this.form.field('budgetDiminishingDelta'),
      maxTokensRecoveryLimit: this.form.field('maxTokensRecoveryLimit'),
    }
  }

  /**
   * Build the face the card's slot registration injects.
   * @returns the card's snapshot and its form actions.
   */
  inject(): CcLoopSettingsCardFace {
    return { hooks: { ccLoopSettingsCard: this.store }, ...this.form.actions() }
  }

  /**
   * Release the card's scope subscription and bound stores; the slot
   * disposer calls this on teardown.
   */
  dispose(): void {
    this.form.dispose()
  }
}

/** Props the renderer binds for the cc-loop card. */
export type CcLoopSettingsCardProps =
  PropsRuntime<'web-ui.plugin.item'>
  & PropsLocale<'cc-loop'>
  & InjectFace<CcLoopSettingsCardFace>

/**
 * Render the cc-loop card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export function CcLoopSettingsCard(props: CcLoopSettingsCardProps) {
  const { t } = props
  const state = props.useCcLoopSettingsCard(snapshot => snapshot)
  const disabled = !state.writable
  const fieldProps = {
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    invalidLabel: t('settings.invalidNumber'),
    disabled,
  }
  return (
    <PluginSettingsCard
      t={t}
      titleKey="settings.title"
      descriptionKey="settings.description"
      state={state}
      onSave={props.save}
      onDiscard={props.discard}
    >
      <BooleanField
        inheritLabel={t('settings.inherit')}
        id="settings-cc-loop-enabled"
        label={t('settings.enabled')}
        hint={t('settings.enabledHint')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.enabled}
        onEdit={(text) => { props.edit('enabled', text) }}
        onReset={() => { props.resetField('enabled') }}
      />
      <BooleanField
        inheritLabel={t('settings.inherit')}
        id="settings-cc-loop-announce"
        label={t('settings.announceToAgent')}
        hint={t('settings.announceToAgentHint')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.announceToAgent}
        onEdit={(text) => { props.edit('announceToAgent', text) }}
        onReset={() => { props.resetField('announceToAgent') }}
      />
      <ValueField
        id="settings-cc-loop-max-turns"
        label={t('settings.maxToolTurns')}
        hint={t('settings.maxToolTurnsHint')}
        numeric
        placeholder="20"
        {...fieldProps}
        {...state.maxToolTurns}
        onEdit={(text) => { props.edit('maxToolTurns', text) }}
        onReset={() => { props.resetField('maxToolTurns') }}
      />
      <ValueField
        id="settings-cc-loop-snip-ratio"
        label={t('settings.snipAtRatio')}
        hint={t('settings.snipAtRatioHint')}
        placeholder="0.6"
        {...fieldProps}
        {...state.snipAtRatio}
        onEdit={(text) => { props.edit('snipAtRatio', text) }}
        onReset={() => { props.resetField('snipAtRatio') }}
      />
      <ValueField
        id="settings-cc-loop-compact-ratio"
        label={t('settings.compactAtRatio')}
        hint={t('settings.compactAtRatioHint')}
        placeholder="0"
        {...fieldProps}
        {...state.compactAtRatio}
        onEdit={(text) => { props.edit('compactAtRatio', text) }}
        onReset={() => { props.resetField('compactAtRatio') }}
      />
      <ValueField
        id="settings-cc-loop-token-budget"
        label={t('settings.turnTokenBudget')}
        hint={t('settings.turnTokenBudgetHint')}
        placeholder="0"
        {...fieldProps}
        {...state.turnTokenBudget}
        onEdit={(text) => { props.edit('turnTokenBudget', text) }}
        onReset={() => { props.resetField('turnTokenBudget') }}
      />
      <ValueField
        id="settings-cc-loop-budget-ratio"
        label={t('settings.budgetCompletionRatio')}
        hint={t('settings.budgetCompletionRatioHint')}
        placeholder="0.9"
        {...fieldProps}
        {...state.budgetCompletionRatio}
        onEdit={(text) => { props.edit('budgetCompletionRatio', text) }}
        onReset={() => { props.resetField('budgetCompletionRatio') }}
      />
      <ValueField
        id="settings-cc-loop-diminishing"
        label={t('settings.budgetDiminishingDelta')}
        hint={t('settings.budgetDiminishingDeltaHint')}
        placeholder="500"
        {...fieldProps}
        {...state.budgetDiminishingDelta}
        onEdit={(text) => { props.edit('budgetDiminishingDelta', text) }}
        onReset={() => { props.resetField('budgetDiminishingDelta') }}
      />
      <ValueField
        id="settings-cc-loop-max-tokens-recovery"
        label={t('settings.maxTokensRecoveryLimit')}
        hint={t('settings.maxTokensRecoveryLimitHint')}
        placeholder="3"
        {...fieldProps}
        {...state.maxTokensRecoveryLimit}
        onEdit={(text) => { props.edit('maxTokensRecoveryLimit', text) }}
        onReset={() => { props.resetField('maxTokensRecoveryLimit') }}
      />
    </PluginSettingsCard>
  )
}
