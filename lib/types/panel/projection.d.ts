/** Pure execution fold; streaming token deltas never republish the projection. */
import { z } from 'zod';
import type { SessionEvent } from '@deepseek-ai/dsh-session/types';
import type { LoopFlow } from './types.ts';
/** Validates the complete projection before it crosses the host transport. */
export declare const loopFlowSchema: z.ZodObject<{
    jobId: z.ZodNullable<z.ZodString>;
    turn: z.ZodNullable<z.ZodNumber>;
    phase: z.ZodEnum<{
        error: "error";
        input: "input";
        model: "model";
        idle: "idle";
        blocked: "blocked";
        done: "done";
        tools: "tools";
        aborted: "aborted";
        feedback: "feedback";
        assessing: "assessing";
        limited: "limited";
        interrupted: "interrupted";
    }>;
    reason: z.ZodNullable<z.ZodString>;
    startedAt: z.ZodNullable<z.ZodNumber>;
    endedAt: z.ZodNullable<z.ZodNumber>;
    totalSteps: z.ZodNumber;
    totalCalls: z.ZodNumber;
    failedCalls: z.ZodNumber;
    omittedSteps: z.ZodNumber;
    omittedReviews: z.ZodNumber;
    reviews: z.ZodArray<z.ZodObject<{
        turn: z.ZodNumber;
        attempt: z.ZodNumber;
        at: z.ZodNumber;
        threshold: z.ZodNumber;
        maxRepairs: z.ZodNumber;
        outcome: z.ZodEnum<{
            error: "error";
            blocked: "blocked";
            progress: "progress";
            passed: "passed";
            repair: "repair";
        }>;
        error: z.ZodNullable<z.ZodString>;
        policy: z.ZodOptional<z.ZodEnum<{
            "task-items-v1": "task-items-v1";
            "task-items-v2": "task-items-v2";
        }>>;
        stage: z.ZodOptional<z.ZodEnum<{
            tasks: "tasks";
            overall: "overall";
        }>>;
        reviewer: z.ZodOptional<z.ZodEnum<{
            laya: "laya";
            jev: "jev";
            primary: "primary";
        }>>;
        passedItems: z.ZodOptional<z.ZodNumber>;
        totalItems: z.ZodOptional<z.ZodNumber>;
        items: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            requirement: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                in_progress: "in_progress";
                completed: "completed";
            }>;
            result: z.ZodString;
            evidenceIds: z.ZodArray<z.ZodString>;
            passed: z.ZodBoolean;
            reason: z.ZodString;
            reused: z.ZodBoolean;
            score: z.ZodNullable<z.ZodObject<{
                rate: z.ZodNumber;
                gap: z.ZodOptional<z.ZodEnum<{
                    missing: "missing";
                    partial: "partial";
                    evidence: "evidence";
                    constraints: "constraints";
                    defect: "defect";
                    none: "none";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
        score: z.ZodNullable<z.ZodObject<{
            rate: z.ZodNumber;
            confidence: z.ZodNullable<z.ZodNumber>;
            elapsedMs: z.ZodNumber;
            dimensions: z.ZodArray<z.ZodObject<{
                name: z.ZodEnum<{
                    evidence: "evidence";
                    constraints: "constraints";
                    coverage: "coverage";
                }>;
                rate: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        seq: z.ZodNumber;
        step: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        requirement: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            in_progress: "in_progress";
            completed: "completed";
        }>;
        result: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    taskSeq: z.ZodNullable<z.ZodNumber>;
    taskKind: z.ZodNullable<z.ZodEnum<{
        coding: "coding";
        non_coding: "non_coding";
    }>>;
    reviewMode: z.ZodNullable<z.ZodEnum<{
        laya: "laya";
        self: "self";
        skip: "skip";
    }>>;
    plan: z.ZodNullable<z.ZodObject<{
        path: z.ZodString;
        hash: z.ZodString;
        revision: z.ZodNumber;
        goal: z.ZodString;
        scope: z.ZodString;
        exceptions: z.ZodObject<{
            recoverable: z.ZodString;
            revisePlan: z.ZodString;
            blocked: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    planError: z.ZodNullable<z.ZodString>;
    exception: z.ZodNullable<z.ZodObject<{
        kind: z.ZodEnum<{
            blocked: "blocked";
            recoverable: "recoverable";
        }>;
        taskId: z.ZodString;
        summary: z.ZodString;
    }, z.core.$strip>>;
    steps: z.ZodArray<z.ZodObject<{
        number: z.ZodNumber;
        startedAt: z.ZodNumber;
        endedAt: z.ZodNullable<z.ZodNumber>;
        finishReason: z.ZodNullable<z.ZodString>;
        tools: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            status: z.ZodEnum<{
                error: "error";
                success: "success";
                running: "running";
                interrupted: "interrupted";
            }>;
            startedAt: z.ZodNumber;
            endedAt: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Create an empty event-derived loop state.
 * @returns a fresh execution ledger.
 */
export declare function emptyLoopFlow(): LoopFlow;
/**
 * Fold a committed event into the latest turn's ledger. Tool failures remain
 * separate from turn failures: a model can recover from a failed tool.
 * @param state - state through the previous event.
 * @param event - committed event in session order.
 * @param maxSteps - retained steps; full-turn counters survive truncation.
 * @param maxReviews - retained assessment receipts across turns.
 * @returns the new state, or the same reference for unrelated events.
 */
export declare function foldLoopFlow(state: LoopFlow, event: SessionEvent, maxSteps: number, maxReviews?: number): LoopFlow;
