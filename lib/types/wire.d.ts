/** Shared, strict operator contract. Mode changes never originate from model tools. */
import { z } from 'zod';
import { type ReviewerView, type ReviewerSelection } from './reviewer-wire.ts';
import type { RemoteResult, TypertRemoteContribution, TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol';
export declare const PACKAGE = "@deepseek-ai/dsh-long-task";
/** Existing Claude Loop controls, independent of long-task acceptance history. */
export declare const loopSettingsSchema: z.ZodObject<{
    deferMcpTools: z.ZodBoolean;
    maxToolTurns: z.ZodNumber;
    snipAtRatio: z.ZodNumber;
    compactAtRatio: z.ZodNumber;
    turnTokenBudget: z.ZodNumber;
    budgetCompletionRatio: z.ZodNumber;
    budgetDiminishingDelta: z.ZodNumber;
    maxTokensRecoveryLimit: z.ZodNumber;
    planAgentModel: z.ZodNullable<z.ZodString>;
    layaReviewMaxRepairs: z.ZodNumber;
    layaReviewTimeoutMs: z.ZodNumber;
    layaReviewStallRounds: z.ZodNumber;
}, z.core.$strict>;
export type LoopSettings = z.infer<typeof loopSettingsSchema>;
export declare const requestSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"status">;
    sessionId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodEnum<{
        long: "long";
        ordinary: "ordinary";
        pause: "pause";
        resume: "resume";
        end: "end";
        new: "new";
        acknowledge: "acknowledge";
    }>;
    sessionId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"settings">;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"saveReviewPolicy">;
    enabled: z.ZodBoolean;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"saveReviewer">;
    reviewer: z.ZodObject<{
        backend: z.ZodEnum<{
            laya: "laya";
            jev: "jev";
        }>;
        endpoint: z.ZodString;
        model: z.ZodString;
        timeoutMs: z.ZodNumber;
    }, z.core.$strict>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"testReviewer">;
    backend: z.ZodEnum<{
        laya: "laya";
        jev: "jev";
    }>;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"cancelReviewerTest">;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"saveLoop">;
    loop: z.ZodObject<{
        deferMcpTools: z.ZodBoolean;
        maxToolTurns: z.ZodNumber;
        snipAtRatio: z.ZodNumber;
        compactAtRatio: z.ZodNumber;
        turnTokenBudget: z.ZodNumber;
        budgetCompletionRatio: z.ZodNumber;
        budgetDiminishingDelta: z.ZodNumber;
        maxTokensRecoveryLimit: z.ZodNumber;
        planAgentModel: z.ZodNullable<z.ZodString>;
        layaReviewMaxRepairs: z.ZodNumber;
        layaReviewTimeoutMs: z.ZodNumber;
        layaReviewStallRounds: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"save">;
    maxModelTokens: z.ZodOptional<z.ZodNumber>;
    maxCost: z.ZodOptional<z.ZodNumber>;
    inputPerMillion: z.ZodOptional<z.ZodNumber>;
    outputPerMillion: z.ZodOptional<z.ZodNumber>;
    threshold: z.ZodNumber;
    noProgressLimit: z.ZodNumber;
    maxToolCalls: z.ZodNumber;
    maxAssessments: z.ZodNumber;
    maxMinutes: z.ZodNumber;
}, z.core.$strict>], "op">;
export type Request = z.infer<typeof requestSchema>;
export interface FileRecord {
    path: string;
    type: 'file' | 'directory' | 'symlink';
    hash: string;
    bytes: number;
}
export interface Acceptance {
    jobId: string;
    taskId: string;
    at: number;
    fingerprint: string;
    result: string;
    evidenceIds: string[];
    score: number;
    paths: string[];
    files: FileRecord[];
}
export interface JobState {
    route: 'pending' | 'coding' | 'non_coding';
    routingReason: string;
    reviewEnabled: boolean;
    inputTurn: number | null;
    reviewer: ReviewerSelection | null;
    resolvedReviewerModel: string | null;
    resumeRequested: boolean;
    mode: 'ordinary' | 'long';
    jobId: string | null;
    cwd: string;
    phase: 'idle' | 'active' | 'paused' | 'blocked' | 'done' | 'ended';
    reason: string;
    startedAt: number;
    elapsedMs: number;
    activeSince: number;
    threshold: number;
    inputTokens: number;
    outputTokens: number;
    usageUnknown: boolean;
    toolCalls: number;
    assessments: number;
    noProgress: number;
    lastProgress: string;
    acceptances: Acceptance[];
    changes: {
        taskId: string;
        paths: string[];
        reason: string;
    }[];
    revalidating: string[];
    pendingCalls: string[];
    history: {
        jobId: string;
        phase: string;
        at: number;
    }[];
}
export interface Snapshot {
    reviewer: ReviewerView;
    loop: LoopSettings;
    job: JobState | null;
    laya: {
        phase: string;
        error: string | null;
    };
    settings: {
        independentReview: boolean;
        maxModelTokens: number;
        maxCost: number;
        inputPerMillion: number;
        outputPerMillion: number;
        threshold: number;
        noProgressLimit: number;
        maxToolCalls: number;
        maxAssessments: number;
        maxMinutes: number;
    };
    planPath: string | null;
    currentTaskId: string | null;
    tasks: {
        id: string;
        title: string;
        passed: boolean;
    }[];
}
export declare const remoteContribution: TypertRemoteContribution;
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface TypertRemoteMap {
        'longTasks/request': (request: Request) => Promise<RemoteResult<Snapshot>>;
    }
    interface TypertRemoteNamespaceMap {
        longTasks: TypertRemoteNamespace<'longTasks'>;
    }
}
