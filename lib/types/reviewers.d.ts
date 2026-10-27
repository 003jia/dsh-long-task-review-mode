/** Host-owned reviewer selection, credential references and bounded Jev HTTP requests. */
import { Service, type Context } from '@deepseek-ai/cordis';
import type { Config } from './index.ts';
import type { LayaCompletionRequest, LayaCompletionScore } from './laya/types.ts';
import { type ReviewerSelection, type ReviewerSettings, type ReviewerView } from './reviewer-wire.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        reviewers: Reviewers;
    }
}
export declare class Reviewers extends Service {
    private config;
    static inject: string[];
    private lifetime;
    private checking;
    private verifiedRevision;
    private testResult;
    private error;
    private errorBackend;
    constructor(ctx: Context, config: Config);
    [Service.init](): AsyncGenerator<() => void, void, void>;
    selection(): ReviewerSelection;
    view(): Promise<ReviewerView>;
    save(settings: ReviewerSettings, apiKey?: string): Promise<void>;
    require(selection: ReviewerSelection | null): Promise<void>;
    cancel(): void;
    test(backend: 'laya' | 'jev'): Promise<void>;
    evaluate(selection: ReviewerSelection | null, request: LayaCompletionRequest, signal: AbortSignal): Promise<LayaCompletionScore>;
}
