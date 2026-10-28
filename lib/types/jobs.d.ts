/** Durable session-bound jobs; the session journal owns persistence, independent of chat compression. */
import { type Context, Service } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { Agent } from '@deepseek-ai/dsh-agent';
import { type Session } from '@deepseek-ai/dsh-session';
import type { LayaCompletionRequest, LayaCompletionScore, LayaTaskAssessment } from './laya/types.ts';
import type { Config } from './index.ts';
import { type JobState, type Snapshot, type Request, type Acceptance } from './wire.ts';
declare module '@deepseek-ai/dsh-session-projection' {
    interface SessionProjectionStateMap {
        'long-task-job': JobState;
    }
    interface SessionProjectionMap {
        'long-task-job': JobState;
    }
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        longTasks: LongTasks;
    }
}
export declare class LongTasks extends TypertRemoteService {
    private config;
    static inject: string[];
    private stopped;
    private seenSessions;
    private masks;
    private turnJobs;
    private writes;
    constructor(ctx: Context, config: Config);
    [Service.init](): AsyncGenerator<() => void, void, void>;
    budgetIssue(job: JobState): string | null;
    state(session: Session): JobState;
    active(agent: Agent): boolean;
    update(session: Session, job: JobState): void;
    pause(agent: Agent, reason: string): void;
    before(agent: Agent, signal: AbortSignal): Promise<void>;
    revalidate(agent: Agent, ids: string[], reason: string): void;
    assertUnchanged(agent: Agent): void;
    evaluate(agent: Agent, request: LayaCompletionRequest, signal: AbortSignal): Promise<LayaCompletionScore>;
    route(agent: Agent, kind: 'coding' | 'non_coding', reason: string, signal: AbortSignal): Promise<void>;
    prepare(agent: Agent, item: LayaTaskAssessment, signal: AbortSignal): Promise<Acceptance>;
    accept(agent: Agent, prepared: Acceptance, score: number, signal: AbortSignal): Promise<void>;
    attempt(agent: Agent, key: string): void;
    verdict(agent: Agent, passed: boolean): void;
    completed(agent: Agent): void;
    snapshot(id?: string): Promise<Snapshot>;
    request(raw: Request): Promise<Snapshot>;
    private dispatch;
}
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'long-task-state': {
            kind: 'long-task-state';
            form: 'notice';
            summary: string;
            job: JobState;
        };
    }
}
declare module '@deepseek-ai/dsh-session/types' {
    interface PluginRecordMap {
        'plugin:long-task/state': JobState;
    }
}
