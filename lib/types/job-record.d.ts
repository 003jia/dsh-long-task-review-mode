import { z } from 'zod';
import { type SessionEvent } from '@deepseek-ai/dsh-session';
import type { JobState } from './wire.ts';
export declare const jobSchema: z.ZodObject<{
    route: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        coding: "coding";
        non_coding: "non_coding";
    }>>;
    planConfirmed: z.ZodDefault<z.ZodBoolean>;
    planAwaitingConfirmation: z.ZodDefault<z.ZodBoolean>;
    routingReason: z.ZodDefault<z.ZodString>;
    reviewEnabled: z.ZodDefault<z.ZodBoolean>;
    nonCodingMode: z.ZodDefault<z.ZodEnum<{
        direct: "direct";
        selfCheck: "selfCheck";
        independent: "independent";
    }>>;
    inputTurn: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    reviewer: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        backend: z.ZodEnum<{
            laya: "laya";
            jev: "jev";
        }>;
        endpoint: z.ZodString;
        model: z.ZodString;
        timeoutMs: z.ZodNumber;
        codeEvidence: z.ZodDefault<z.ZodBoolean>;
        credentialRef: z.ZodString;
        revision: z.ZodString;
    }, z.core.$strict>>>;
    resolvedReviewerModel: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    resumeRequested: z.ZodDefault<z.ZodBoolean>;
    mode: z.ZodEnum<{
        long: "long";
        ordinary: "ordinary";
    }>;
    jobId: z.ZodNullable<z.ZodString>;
    cwd: z.ZodString;
    phase: z.ZodEnum<{
        idle: "idle";
        active: "active";
        paused: "paused";
        blocked: "blocked";
        done: "done";
        ended: "ended";
    }>;
    reason: z.ZodString;
    startedAt: z.ZodNumber;
    elapsedMs: z.ZodNumber;
    activeSince: z.ZodNumber;
    threshold: z.ZodNumber;
    inputTokens: z.ZodDefault<z.ZodNumber>;
    outputTokens: z.ZodDefault<z.ZodNumber>;
    usageUnknown: z.ZodDefault<z.ZodBoolean>;
    toolCalls: z.ZodNumber;
    assessments: z.ZodNumber;
    noProgress: z.ZodNumber;
    lastProgress: z.ZodString;
    acceptances: z.ZodArray<z.ZodObject<{
        jobId: z.ZodString;
        taskId: z.ZodString;
        at: z.ZodNumber;
        fingerprint: z.ZodString;
        result: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString>;
        score: z.ZodNumber;
        paths: z.ZodArray<z.ZodString>;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            type: z.ZodEnum<{
                file: "file";
                directory: "directory";
                symlink: "symlink";
            }>;
            hash: z.ZodString;
            bytes: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    changes: z.ZodArray<z.ZodObject<{
        taskId: z.ZodString;
        paths: z.ZodArray<z.ZodString>;
        reason: z.ZodString;
    }, z.core.$strip>>;
    revalidating: z.ZodArray<z.ZodString>;
    pendingCalls: z.ZodArray<z.ZodString>;
    history: z.ZodArray<z.ZodObject<{
        jobId: z.ZodString;
        phase: z.ZodString;
        at: z.ZodNumber;
    }, z.core.$strip>>;
    budget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        limits: z.ZodObject<{
            toolCalls: z.ZodNumber;
            minutes: z.ZodNumber;
            modelTokens: z.ZodNumber;
            cost: z.ZodNumber;
            assessments: z.ZodNumber;
            noProgress: z.ZodNumber;
        }, z.core.$strip>;
        extra: z.ZodObject<{
            toolCalls: z.ZodOptional<z.ZodNumber>;
            minutes: z.ZodOptional<z.ZodNumber>;
            modelTokens: z.ZodOptional<z.ZodNumber>;
            cost: z.ZodOptional<z.ZodNumber>;
            assessments: z.ZodOptional<z.ZodNumber>;
            noProgress: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        warned80: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export interface JobRecord {
    job?: JobState;
    delta?: Partial<JobState>;
}
export declare function readJobRecord(event: SessionEvent): JobRecord | undefined;
/** Merge one record into the projection state; a snapshot replaces it. */
export declare function mergeJobRecord(state: JobState, record: JobRecord): JobState | undefined;
