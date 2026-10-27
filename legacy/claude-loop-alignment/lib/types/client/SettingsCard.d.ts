/**
 * The cc-loop settings card: the Claude Code loop-alignment parameters.
 * Registers into the `web-ui.plugin.item` slot the web-ui plugin group
 * renders, bound to the `dsh-cc-loop` settings namespace.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import { type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts';
/** The cc-loop fields this card edits (the namespace's full schema). */
export interface CcLoopSettings {
    /** Master switch for the plugin. */
    enabled?: boolean;
    /** Whether a system-prompt section announces the plugin to every agent. */
    announceToAgent?: boolean;
    /** Max tool-use steps per user turn (0 disables the budget). */
    maxToolTurns?: number;
    /** Context-pressure ratio that triggers the pruner snip pass (0 disables). */
    snipAtRatio?: number;
    /** Context-pressure ratio that triggers summary compaction (0 disables). */
    compactAtRatio?: number;
    /** Per-user-turn output-token budget (0 disables). */
    turnTokenBudget?: number;
    /** Stop nudging once this share of the budget is consumed. */
    budgetCompletionRatio?: number;
    /** Stop after >=3 continuations that each added fewer tokens than this. */
    budgetDiminishingDelta?: number;
    /** Max-output-tokens recovery steering attempts (0 disables). */
    maxTokensRecoveryLimit?: number;
}
/** What the cc-loop card renders. */
export interface CcLoopSettingsCardState extends CardShell {
    enabled: CardFieldState;
    announceToAgent: CardFieldState;
    maxToolTurns: CardFieldState;
    snipAtRatio: CardFieldState;
    compactAtRatio: CardFieldState;
    turnTokenBudget: CardFieldState;
    budgetCompletionRatio: CardFieldState;
    budgetDiminishingDelta: CardFieldState;
    maxTokensRecoveryLimit: CardFieldState;
}
/** The registration-side face the card's slot entry injects. */
export interface CcLoopSettingsCardFace extends CardActions {
    hooks: {
        /** Card snapshot bound by the renderer as useCcLoopSettingsCard. */
        ccLoopSettingsCard: SnapshotStore<CcLoopSettingsCardState>;
    };
}
/** Bridges the `dsh-cc-loop` scope onto the card's staged form. */
export declare class CcLoopSettingsCardController {
    private readonly form;
    private readonly store;
    /** @param scope - the bound settings scope for the `dsh-cc-loop` namespace. */
    constructor(scope: SettingsScope<CcLoopSettings>);
    private projection;
    /**
     * Build the face the card's slot registration injects.
     * @returns the card's snapshot and its form actions.
     */
    inject(): CcLoopSettingsCardFace;
    /**
     * Release the card's scope subscription and bound stores; the slot
     * disposer calls this on teardown.
     */
    dispose(): void;
}
/** Props the renderer binds for the cc-loop card. */
export type CcLoopSettingsCardProps = PropsRuntime<'web-ui.plugin.item'> & PropsLocale<'cc-loop'> & InjectFace<CcLoopSettingsCardFace>;
/**
 * Render the cc-loop card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export declare function CcLoopSettingsCard(props: CcLoopSettingsCardProps): import("react").JSX.Element;
