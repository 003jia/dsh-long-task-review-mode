/** Observable execution phases; model internals are not inferred. */
export type LoopPhase = 'idle' | 'input' | 'model' | 'tools' | 'feedback' | 'assessing' | 'done' | 'aborted' | 'blocked' | 'error' | 'limited' | 'interrupted';
/** Model-declared checklist; approval comes only from matching assessment records. */
export interface LoopTask {
    id: string;
    title: string;
    requirement: string;
    status: 'pending' | 'in_progress' | 'completed';
    result: string;
    evidenceIds: string[];
}
/** Per-item display data from a completion receipt. */
export interface LoopTaskReview extends LoopTask {
    passed: boolean;
    reason: string;
    reused: boolean;
    score: {
        rate: number;
        gap?: 'missing' | 'partial' | 'evidence' | 'constraints' | 'defect' | 'none' | undefined;
    } | null;
}
/** One dispatched tool, paired with its durable result. */
export interface LoopTool {
    id: string;
    name: string;
    status: 'running' | 'success' | 'error' | 'interrupted';
    startedAt: number;
    endedAt: number | null;
}
/** One model request and its tool batch. */
export interface LoopStep {
    number: number;
    startedAt: number;
    endedAt: number | null;
    finishReason: string | null;
    tools: LoopTool[];
}
/** Display fields from a durable Laya review; excludes prompts, responses and raw model JSON. */
export interface LoopReview {
    seq: number;
    turn: number;
    step: number | null;
    attempt: number;
    at: number;
    threshold: number;
    maxRepairs: number;
    outcome: 'progress' | 'passed' | 'repair' | 'blocked' | 'error';
    error: string | null;
    policy?: 'task-items-v1' | 'task-items-v2' | undefined;
    reviewer?: 'laya' | 'jev' | 'primary' | undefined;
    stage?: 'tasks' | 'overall' | undefined;
    items?: LoopTaskReview[] | undefined;
    passedItems?: number | undefined;
    totalItems?: number | undefined;
    score: {
        rate: number;
        confidence: number | null;
        elapsedMs: number;
        dimensions: {
            name: 'coverage' | 'constraints' | 'evidence';
            rate: number;
        }[];
    } | null;
}
/** Latest turn, replayable from committed session events without storing output content. */
export interface LoopFlow {
    jobId: string | null;
    turn: number | null;
    phase: LoopPhase;
    reason: string | null;
    startedAt: number | null;
    endedAt: number | null;
    totalSteps: number;
    totalCalls: number;
    failedCalls: number;
    omittedSteps: number;
    steps: LoopStep[];
    omittedReviews: number;
    reviews: LoopReview[];
    tasks: LoopTask[];
    taskSeq: number | null;
    taskKind: 'coding' | 'non_coding' | null;
    reviewMode: 'laya' | 'self' | 'skip' | null;
    plan: {
        path: string;
        hash: string;
        revision: number;
        goal: string;
        scope: string;
        exceptions: {
            recoverable: string;
            revisePlan: string;
            blocked: string;
        };
    } | null;
    planError: string | null;
    exception: {
        kind: 'recoverable' | 'blocked';
        taskId: string;
        summary: string;
    } | null;
}
/** Counts of recorded invocation attempts, including failures and interruptions. */
export interface ToolUsageCounts {
    total: number;
    success: number;
    error: number;
    running: number;
    interrupted: number;
}
/** Counts for one exact registered name; compatibility aliases remain separate. */
export interface ToolUsageRow extends ToolUsageCounts {
    name: string;
}
/** Aggregate exposed to the sidebar, without per-call identity or tool payloads. */
export interface ToolUsageSummary extends ToolUsageCounts {
    tools: ToolUsageRow[];
}
/** Current-turn and session counts for this session only, including logged PTC children. */
export interface ToolUsageView {
    turn: number | null;
    current: ToolUsageSummary;
    session: ToolUsageSummary;
}
/** Private replay index for pairing and deduplication; never sent to the Client. */
export interface ToolUsageCall {
    id: string;
    step: number;
    name: string;
    kind: 'native' | 'nested';
    status: 'running' | 'success' | 'error' | 'interrupted';
}
/** Host checkpoint keeps small per-turn identity buckets so replay cannot count twice. */
export interface ToolUsageState {
    lastSeq: number;
    turn: number | null;
    current: Record<string, ToolUsageCounts>;
    session: Record<string, ToolUsageCounts>;
    calls: Record<string, Record<string, ToolUsageCall>>;
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionStateMap {
        /** Latest turn's pure fold state. */
        'claude-loop-flow': LoopFlow;
        /** Tool identity and count state reconstructed from the full durable log. */
        'claude-loop-tool-usage': ToolUsageState;
    }
    interface SessionProjectionMap {
        /** Latest turn's execution graph and retained step ledger. */
        'claude-loop-flow': LoopFlow;
        /** Bounded-by-tool-name aggregates, never arguments or results. */
        'claude-loop-tool-usage': ToolUsageView;
    }
}
