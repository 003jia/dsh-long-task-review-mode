/** Shared settings, inference requests, and Remote views for local Laya. */
import type { Branded } from '@deepseek-ai/dsh-brand';
import type { RemoteResult, TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol';
import type { SessionId, SessionSeq } from '@deepseek-ai/dsh-session/types';
/** Correlates one settings-page invocation and its cancellation. */
export type LayaRequestId = Branded<'LayaRequestId'>;
/** Persisted settings contain a local executable and non-secret model controls. */
export interface LayaSettings {
    enabled: boolean;
    launcher: string;
    device: 'auto' | 'cpu' | 'mps' | 'cuda';
    models: string[];
    preload: boolean;
    offline: boolean;
    timeoutMs: number;
}
/** Classification and task routing perform inference; model routing only explains checkpoint selection. */
export type LayaMode = 'classify' | 'task-route' | 'model-route';
/** A candidate's name is returned as the selected class or task destination. */
export interface LayaCandidate {
    name: string;
    description: string;
}
/** One bounded manual invocation; the Host always constructs an object-valued MCP state. */
export interface LayaRequest {
    id: LayaRequestId;
    mode: LayaMode;
    text: string;
    instructions: string;
    candidates: LayaCandidate[];
    lang: 'auto' | 'zh' | 'en';
}
/** Actual discovered tool metadata, without executing the tool. */
export interface LayaTool {
    name: string;
    description: string;
    schema: string;
}
/** A read of the controller's configuration and live MCP connection. */
export interface LayaView {
    settings: LayaSettings;
    phase: 'disabled' | 'connecting' | 'ready' | 'failed';
    error: string | null;
    actualDevice: string | null;
    loadedModels: string[];
    version: string | null;
    statusJson: string | null;
    tools: LayaTool[];
    completionReviews: LayaCompletionReview[];
}
/** Text and recorded tool evidence supplied by the completion policy. */
export interface LayaCompletionRequest {
    requirement: string;
    output: string;
    evidence: string[];
    /** When `'opinion'`, the judge scores content quality and expects no execution receipts. */
    taskType?: 'execution' | 'opinion' | undefined;
    /** Require independent confirmation that all mandatory criteria have evidence. */
    critical?: boolean | undefined;
}
/** Task-type gate decision for one checklist item. */
export interface LayaTaskClassification {
    type: 'execution' | 'opinion';
    confidence: number;
}
/** A stable task requirement; model completion is separate from Laya approval. */
export interface LayaTaskItem {
    taskType?: 'execution' | 'opinion';
    id: string;
    title: string;
    requirement: string;
    status: 'pending' | 'in_progress' | 'completed';
    result: string;
    evidenceIds: string[];
    /** Earlier task IDs whose delivered behavior this task depends on. */
    dependsOn?: string[] | undefined;
    /** Source paths whose modification invalidates this item's prior judgment. */
    affectedPaths?: string[] | undefined;
    /** A mandatory requirement cannot pass on a percentage alone. */
    critical?: boolean | undefined;
}
/** Laya selects a gap category; it does not generate a free-form explanation. */
export type LayaGap = 'missing' | 'partial' | 'evidence' | 'constraints' | 'defect' | 'none';
/** Each ordinal score is normalized to a share of the five-level rubric. */
export interface LayaCompletionScore {
    rate: number;
    dimensions: {
        name: 'coverage' | 'constraints' | 'evidence';
        rate: number;
    }[];
    confidence: number | null;
    model: string | null;
    device: string | null;
    elapsedMs: number;
    json: string;
    gap?: LayaGap | undefined;
    /** Binary confirmation of mandatory requirements, requested only for critical work. */
    criticalSatisfied?: boolean | undefined;
}
/** Per-item judgment retained with the exact requirement and submitted evidence references. */
export interface LayaTaskAssessment extends LayaTaskItem {
    fingerprint: string;
    score: LayaCompletionScore | null;
    passed: boolean;
    reason: string;
    reused: boolean;
}
/** One durable completion decision, retained in the session's review notice. */
export interface LayaCompletionReview {
    sessionId: SessionId;
    turn: number;
    attempt: number;
    at: number;
    outputSeq: SessionSeq | null;
    threshold: number;
    maxRepairs: number;
    outcome: 'progress' | 'passed' | 'repair' | 'blocked' | 'error';
    error: string | null;
    requirement: string;
    output: string;
    evidence: string[];
    score: LayaCompletionScore | null;
    policy?: 'task-items-v1' | 'task-items-v2' | undefined;
    stage?: 'tasks' | 'overall' | undefined;
    items?: LayaTaskAssessment[] | undefined;
    passedItems?: number | undefined;
    totalItems?: number | undefined;
    /** Primary-model self assessments are separate from Laya judgments. */
    reviewer?: 'laya' | 'jev' | 'primary' | undefined;
    /** Items actually scored in this receipt; cached items are excluded. */
    assessedTaskIds?: string[] | undefined;
    /** First item still awaiting approval in the plan's order. */
    currentTaskId?: string | null | undefined;
    /** Primary model's explanation mapping an overall gap to affected task items. */
    repairAnalysis?: string | null | undefined;
    /** Detects repeated stopping candidates without new work. */
    progressKey?: string | undefined;
    /** A blocked outcome caused by repeated unchanged repair candidates. */
    stalled?: boolean | undefined;
}
/** Existing local MCP provider's completion-scoring face. */
export interface LayaCompletionEvaluator {
    status(): LayaView;
    /**
     * Estimate completion of one task candidate.
     * @param request - original requirement, candidate answer and execution evidence.
     * @param signal - caller cancellation.
     * @returns ordinal completion estimates, distinct from confidence.
     */
    evaluateCompletion(request: LayaCompletionRequest, signal: AbortSignal): Promise<LayaCompletionScore>;
    /**
     * Classify one checklist item before its assessment so opinion items are judged on content
     * rather than execution receipts.
     * @param request - item title and requirement.
     * @param signal - caller cancellation.
     * @returns task type with the choice confidence; `execution` is the fail-safe default.
     */
    classifyTask(request: {
        title: string;
        requirement: string;
    }, signal: AbortSignal): Promise<LayaTaskClassification>;
}
/** Completion policy reads its durable projection for loaded sessions. */
export interface LayaCompletionHistory {
    /** @returns bounded recent decisions derived from live session logs. */
    list(): LayaCompletionReview[];
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        layaController: LayaCompletionEvaluator;
        claudeCompletionReviews: LayaCompletionHistory;
    }
}
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'laya-completion-review': {
            kind: 'laya-completion-review';
            form: 'notice';
            summary: string;
            review: LayaCompletionReview;
        };
        'claude-loop-alignment': {
            kind: 'claude-loop-alignment';
        };
        'laya-task-list': {
            kind: 'laya-task-list';
            form: 'notice';
            summary: string;
            turn: number;
            tasks: LayaTaskItem[];
            taskKind?: 'coding' | 'non_coding' | undefined;
            reviewMode?: 'laya' | 'self' | 'skip' | undefined;
            routingReason?: string | undefined;
            contextRequirement?: string | undefined;
            inheritedRequirement?: string | undefined;
            inheritedIncomplete?: boolean | undefined;
            invalidatedTaskIds?: string[] | undefined;
            repairAnalysis?: string | undefined;
            overallRepairResolved?: boolean | undefined;
        };
        'laya-task-protocol': {
            kind: 'laya-task-protocol';
        };
        'laya-assessment-start': {
            kind: 'laya-assessment-start';
            form: 'notice';
            summary: string;
            turn: number;
        };
    }
}
/** Result summary accompanies the bounded original JSON response. */
export interface LayaResult {
    id: LayaRequestId;
    tool: 'laya_predict' | 'laya_route';
    elapsedMs: number;
    selected: string | null;
    confidence: number | null;
    lowConfidence: boolean;
    model: string | null;
    device: string | null;
    json: string;
}
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface TypertRemoteMap {
        'laya/status': () => Promise<RemoteResult<LayaView>>;
        'laya/save': (settings: LayaSettings) => Promise<RemoteResult<LayaView>>;
        'laya/reconnect': () => Promise<RemoteResult<LayaView>>;
        'laya/refresh': () => Promise<RemoteResult<LayaView>>;
        'laya/run': (request: LayaRequest) => Promise<RemoteResult<LayaResult>>;
        'laya/cancel': (request: {
            id: LayaRequestId;
        }) => Promise<RemoteResult<{
            cancelled: boolean;
        }>>;
    }
    interface TypertRemoteNamespaceMap {
        laya: TypertRemoteNamespace<'laya'>;
    }
}
