/** Validated Remote codecs shared by the installed Host and Client. */
import { z } from 'zod';
import type { TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol';
import type { LayaRequest, LayaSettings, LayaCompletionReview, LayaCompletionScore } from './types.ts';
/** Package identity used by both Remote registries and the Client module loader. */
export declare const PACKAGE = "@deepseek-ai/dsh-client-ui-laya";
/** Validates settings received from a file or Remote caller. */
export declare const settingsSchema: z.ZodType<LayaSettings>;
/** Candidate budgets follow Laya's recommendation to shortlist larger choice sets. */
export declare const requestSchema: z.ZodType<LayaRequest>;
/** Validates completion results crossing MCP and durable session boundaries. */
export declare const completionScoreSchema: z.ZodType<LayaCompletionScore>;
/** Review notices are known user/message events, so older desktops can still read the log. */
export declare const completionReviewSchema: z.ZodType<LayaCompletionReview>;
/** Explicit descriptors avoid a dependency on another plugin's generated Remote assembly. */
export declare const remoteContribution: TypertRemoteContribution;
