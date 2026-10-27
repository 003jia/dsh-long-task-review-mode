/** Original Claude Loop presets stage drafts; Save commits them. */
export declare const presets: readonly [{
    readonly name: "presetBalanced";
    readonly hint: "presetBalancedHint";
    readonly values: {
        readonly maxToolTurns: 30;
        readonly snipAtRatio: 0.6;
        readonly compactAtRatio: 0;
        readonly turnTokenBudget: 0;
        readonly budgetCompletionRatio: 0.9;
        readonly budgetDiminishingDelta: 500;
        readonly maxTokensRecoveryLimit: 3;
        readonly planAgentModel: null;
    };
}, {
    readonly name: "presetLong";
    readonly hint: "presetLongHint";
    readonly values: {
        readonly maxToolTurns: 0;
        readonly snipAtRatio: 0.5;
        readonly compactAtRatio: 0;
        readonly turnTokenBudget: 0;
        readonly budgetCompletionRatio: 0.9;
        readonly budgetDiminishingDelta: 500;
        readonly maxTokensRecoveryLimit: 10;
        readonly planAgentModel: null;
    };
}, {
    readonly name: "presetFrugal";
    readonly hint: "presetFrugalHint";
    readonly values: {
        readonly maxToolTurns: 12;
        readonly snipAtRatio: 0.5;
        readonly compactAtRatio: 0;
        readonly turnTokenBudget: 6000;
        readonly budgetCompletionRatio: 0.9;
        readonly budgetDiminishingDelta: 500;
        readonly maxTokensRecoveryLimit: 3;
        readonly planAgentModel: null;
    };
}, {
    readonly name: "presetCareful";
    readonly hint: "presetCarefulHint";
    readonly values: {
        readonly maxToolTurns: 60;
        readonly snipAtRatio: 0.75;
        readonly compactAtRatio: 0;
        readonly turnTokenBudget: 0;
        readonly budgetCompletionRatio: 0.9;
        readonly budgetDiminishingDelta: 500;
        readonly maxTokensRecoveryLimit: 5;
        readonly planAgentModel: null;
    };
}];
