import { z } from 'zod';
import type { LayaTaskItem } from '../laya/types.ts';
/** Versioned plan data accepted only from the file parser or a durable recorded snapshot. */
export declare const planDocumentSchema: z.ZodObject<{
    format: z.ZodLiteral<"claude-loop-plan/v1">;
    revision: z.ZodNumber;
    goal: z.ZodString;
    scope: z.ZodString;
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        taskType: z.ZodDefault<z.ZodEnum<{
            execution: "execution";
            opinion: "opinion";
        }>>;
        title: z.ZodString;
        requirement: z.ZodString;
        deliverables: z.ZodArray<z.ZodString>;
        evidence: z.ZodArray<z.ZodString>;
        dependsOn: z.ZodArray<z.ZodString>;
        affectedPaths: z.ZodArray<z.ZodString>;
        critical: z.ZodBoolean;
    }, z.core.$strict>>;
    exceptions: z.ZodObject<{
        recoverable: z.ZodString;
        revisePlan: z.ZodString;
        blocked: z.ZodString;
    }, z.core.$strict>;
    changes: z.ZodArray<z.ZodObject<{
        revision: z.ZodNumber;
        reason: z.ZodString;
        affectedTaskIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
/** The accepted file and its exact hash, suitable for replay without accessing today's filesystem. */
export declare const boundPlanSchema: z.ZodObject<{
    path: z.ZodString;
    directory: z.ZodString;
    hash: z.ZodString;
    document: z.ZodObject<{
        format: z.ZodLiteral<"claude-loop-plan/v1">;
        revision: z.ZodNumber;
        goal: z.ZodString;
        scope: z.ZodString;
        tasks: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            taskType: z.ZodDefault<z.ZodEnum<{
                execution: "execution";
                opinion: "opinion";
            }>>;
            title: z.ZodString;
            requirement: z.ZodString;
            deliverables: z.ZodArray<z.ZodString>;
            evidence: z.ZodArray<z.ZodString>;
            dependsOn: z.ZodArray<z.ZodString>;
            affectedPaths: z.ZodArray<z.ZodString>;
            critical: z.ZodBoolean;
        }, z.core.$strict>>;
        exceptions: z.ZodObject<{
            recoverable: z.ZodString;
            revisePlan: z.ZodString;
            blocked: z.ZodString;
        }, z.core.$strict>;
        changes: z.ZodArray<z.ZodObject<{
            revision: z.ZodNumber;
            reason: z.ZodString;
            affectedTaskIds: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type PlanDocument = z.infer<typeof planDocumentSchema>;
export type BoundPlan = z.infer<typeof boundPlanSchema>;
/** Example returned to the primary model before it creates the task's own plan.md. */
export declare const planTemplate: string;
/**
 * Parse exactly one JSON block in plan.md and validate task ordering and revision history.
 * @param content - complete bounded Markdown text.
 * @param taskLimit - configured maximum task count.
 * @returns the authoritative plan document.
 */
export declare function parsePlan(content: string, taskLimit: number): PlanDocument;
/**
 * Hash the complete file, including explanatory Markdown.
 * @param content - complete file text.
 * @returns SHA-256 identifying the imported file.
 */
export declare function planHash(content: string): string;
/**
 * Derive immutable task definitions while preserving progress of unchanged tasks.
 * @param plan - validated document.
 * @param previous - previously imported runtime items.
 * @returns tasks whose acceptance criteria come only from plan.md.
 */
export declare function planTasks(plan: PlanDocument, previous: readonly LayaTaskItem[]): LayaTaskItem[];
/**
 * Validate an explicit revision without deleting or weakening accepted scope.
 * @param old - prior accepted document.
 * @param next - replacement document read from the same file.
 * @returns IDs to reopen, before dependency expansion.
 */
export declare function revisedTasks(old: PlanDocument, next: PlanDocument): string[];
