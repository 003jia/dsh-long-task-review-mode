/**
 * cc-loop settings-card copy: zh is the key source, en mirrors the key set.
 */
import type { SettingsCardKey as PluginCardKey } from './PluginSettingsCard.tsx';
/** Shared card-chrome copy keys this locale must cover. */
export type CcLoopKey = PluginCardKey<'settings.title' | 'settings.description' | 'settings.enabled' | 'settings.enabledHint' | 'settings.announceToAgent' | 'settings.announceToAgentHint' | 'settings.maxToolTurns' | 'settings.maxToolTurnsHint' | 'settings.snipAtRatio' | 'settings.snipAtRatioHint' | 'settings.compactAtRatio' | 'settings.compactAtRatioHint' | 'settings.turnTokenBudget' | 'settings.turnTokenBudgetHint' | 'settings.budgetCompletionRatio' | 'settings.budgetCompletionRatioHint' | 'settings.budgetDiminishingDelta' | 'settings.budgetDiminishingDeltaHint' | 'settings.maxTokensRecoveryLimit' | 'settings.maxTokensRecoveryLimitHint' | 'settings.inherit' | 'settings.on' | 'settings.off' | 'settings.overridden' | 'settings.reset' | 'settings.invalidNumber'>;
/** Chinese copy (key source). */
export declare const zh: Record<CcLoopKey, string>;
/** English copy. */
export declare const en: Record<CcLoopKey, string>;
