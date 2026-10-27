/** Original Claude Loop presets stage drafts; Save commits them. */
export const presets=[
 {name:'presetBalanced',hint:'presetBalancedHint',values:{maxToolTurns:30,snipAtRatio:.6,compactAtRatio:0,turnTokenBudget:0,budgetCompletionRatio:.9,budgetDiminishingDelta:500,maxTokensRecoveryLimit:3,planAgentModel:null}},
 {name:'presetLong',hint:'presetLongHint',values:{maxToolTurns:0,snipAtRatio:.5,compactAtRatio:0,turnTokenBudget:0,budgetCompletionRatio:.9,budgetDiminishingDelta:500,maxTokensRecoveryLimit:10,planAgentModel:null}},
 {name:'presetFrugal',hint:'presetFrugalHint',values:{maxToolTurns:12,snipAtRatio:.5,compactAtRatio:0,turnTokenBudget:6000,budgetCompletionRatio:.9,budgetDiminishingDelta:500,maxTokensRecoveryLimit:3,planAgentModel:null}},
 {name:'presetCareful',hint:'presetCarefulHint',values:{maxToolTurns:60,snipAtRatio:.75,compactAtRatio:0,turnTokenBudget:0,budgetCompletionRatio:.9,budgetDiminishingDelta:500,maxTokensRecoveryLimit:5,planAgentModel:null}},
] as const
