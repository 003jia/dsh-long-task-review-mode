/** Primary-model task routing, sequential delivery, per-item review and final requirement assessment. */
import { Context, Service } from '@deepseek-ai/cordis';
import type { ToolRuntime } from '@deepseek-ai/dsh-tools';
import type { UserMessage } from '@deepseek-ai/dsh-llm';
import type { Agent } from '@deepseek-ai/dsh-agent';
import type { SessionSeq } from '@deepseek-ai/dsh-session/types';
import type { LayaCompletionReview, LayaTaskItem, LayaTaskAssessment } from '../laya/types.ts';
import type { ClaudeLoopAlignmentConfig } from './index.ts';
import type { BoundPlan } from './plan-file.ts';
type TaskKind = 'coding' | 'non_coding';
type ReviewMode = 'laya' | 'self' | 'skip';
interface PreviousWork {
    plan: BoundPlan | null;
    reviewMode: 'laya' | 'self';
    contextRequirement: string;
    tasks: LayaTaskItem[];
    assessments: Record<string, LayaTaskAssessment>;
    receipts: Record<string, string>;
    exception: ReviewState['exception'];
}
export interface ReviewState {
    jobId: string | null;
    pendingRequirement: string;
    pendingContext: boolean;
    threshold: number;
    turn: number;
    repairs: number;
    instructed: boolean;
    taskKind: TaskKind | null;
    reviewMode: ReviewMode | null;
    routingReason: string;
    contextRequirement: string;
    previousRequirement: string;
    previousRequirementIncomplete: boolean;
    previousWork: PreviousWork | null;
    requirement: string;
    requirementIncomplete: boolean;
    requiresContextInterpretation: boolean;
    output: string;
    outputIncomplete: boolean;
    outputSeq: SessionSeq | null;
    calls: Record<string, {
        name: string;
        paths: string[];
    }>;
    receipts: Record<string, string>;
    dirtyPaths: string[];
    dirtyPathsIncomplete: boolean;
    tasks: LayaTaskItem[];
    taskRequirement: string;
    assessments: Record<string, LayaTaskAssessment>;
    overallRepair: boolean;
    repairAnalysis: string | null;
    stalls: number;
    lastRepairKey: string;
    reviews: LayaCompletionReview[];
    plan: BoundPlan | null;
    planError: string | null;
    exception: {
        kind: 'recoverable' | 'blocked';
        taskId: string;
        summary: string;
    } | null;
}
declare module '@deepseek-ai/dsh-session-projection' {
    interface SessionProjectionStateMap {
        claudeCompletionReview: ReviewState;
    }
}
/** The primary model owns the plan; Laya supplies optional independent judgments through the existing MCP connection. */
export declare class CompletionReviews extends Service {
    private readonly config;
    static inject: string[];
    /** @param ctx - owning plugin context. @param config - validated loop configuration. */
    constructor(ctx: Context, config: ClaudeLoopAlignmentConfig);
    /**
     * Read Laya history without presenting primary-model self reports as Laya judgments.
     * @returns recent Laya decisions, newest first.
     */
    list(): LayaCompletionReview[];
    /**
     * Identify a routed primary coding task.
     * @param agent - task owner.
     * @returns whether completion review applies.
     */
    enabledFor(agent: Agent): boolean;
    /**
     * Construct a deliberate loop stop.
     * @param message - reason.
     * @returns the terminal failure.
     */
    blocked(message: string): Error;
    /**
     * Identify intentional stops.
     * @param error - caught failure.
     * @returns whether the loop must stop.
     */
    isBlocked(error: unknown): boolean;
    private primary;
    private state;
    private planMessage;
    private readPlan;
    private checkPlan;
    private planningTool;
    private reconcile;
    /**
     * Request one semantic route decision from the primary model, and publish related source invalidation before the next step.
     * @param agent - primary task owner.
     * @param messages - input pending admission.
     * @returns a logged instruction or task-state notice, or null.
     */
    instructionFor(agent: Agent, _messages: readonly UserMessage[]): UserMessage | null;
    /**
     * Register routing, plan and self-review execution independent of the Laya switch.
     * @param tools - owning tool registry.
     */
    registerTool(tools: ToolRuntime): void;
    private judgingRequirement;
    private response;
    private record;
    private assessItem;
    private selfAssess;
    private continueTask;
    /**
     * Review the final candidate only after every task item is approved; direct incomplete work back to its current item.
     * @param agent - primary task owner.
     * @param turn - durable turn number.
     * @param signal - execution cancellation.
     * @returns whether continuation requires a fresh tool budget.
     */
    assess(agent: Agent, turn: number, signal: AbortSignal): Promise<boolean>;
}
export {};
