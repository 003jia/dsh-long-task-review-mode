/** Shared, strict operator contract. Mode changes never originate from model tools. */
import { z } from 'zod'
import {reviewerSettingsSchema,type ReviewerView,type ReviewerSelection} from './reviewer-wire.ts'
import type { RemoteResult, TypertRemoteContribution, TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol'
export const PACKAGE='@deepseek-ai/dsh-long-task'
/** Existing Claude Loop controls, independent of long-task acceptance history. */
export const loopSettingsSchema=z.object({
 deferMcpTools:z.boolean(),maxToolTurns:z.number().int().min(0).max(100000),
 snipAtRatio:z.number().min(0).max(1),compactAtRatio:z.number().min(0).max(1),
 turnTokenBudget:z.number().int().min(0).max(1000000000),budgetCompletionRatio:z.number().min(0).max(1),
 budgetDiminishingDelta:z.number().int().min(0).max(1000000000),maxTokensRecoveryLimit:z.number().int().min(0).max(1000),
 planAgentModel:z.string().trim().max(200).nullable(),
 layaReviewMaxRepairs:z.number().int().min(0).max(10),layaReviewTimeoutMs:z.number().int().min(1000).max(3600000),
 layaReviewStallRounds:z.number().int().min(0).max(100),
}).strict()
export type LoopSettings=z.infer<typeof loopSettingsSchema>
export const requestSchema=z.discriminatedUnion('op',[
  z.object({op:z.literal('status'),sessionId:z.string().min(1).max(200)}).strict(),
  z.object({op:z.enum(['long','ordinary','pause','resume','end','new','acknowledge']),sessionId:z.string().min(1).max(200)}).strict(),
  z.object({op:z.literal('settings')}).strict(),
  z.object({op:z.literal('saveReviewPolicy'),enabled:z.boolean()}).strict(),
  z.object({op:z.literal('saveReviewer'),reviewer:reviewerSettingsSchema,apiKey:z.string().trim().min(1).max(4096).optional()}).strict(),
  z.object({op:z.literal('testReviewer'),backend:z.enum(['laya','jev'])}).strict(),
  z.object({op:z.literal('cancelReviewerTest')}).strict(),
  z.object({op:z.literal('saveLoop'),loop:loopSettingsSchema}).strict(),
  z.object({op:z.literal('save'),maxModelTokens:z.number().min(1000).max(1000000000).optional(),maxCost:z.number().min(0).max(1000000).optional(),inputPerMillion:z.number().min(0).max(1000000).optional(),outputPerMillion:z.number().min(0).max(1000000).optional(),threshold:z.number().min(0).max(100),noProgressLimit:z.number().int().min(1).max(20),maxToolCalls:z.number().int().min(1).max(100000),maxAssessments:z.number().int().min(1).max(10000),maxMinutes:z.number().min(1).max(10080)}).strict(),
])
export type Request=z.infer<typeof requestSchema>
export interface FileRecord {path:string;type:'file'|'directory'|'symlink';hash:string;bytes:number}
export interface Acceptance {jobId:string;taskId:string;at:number;fingerprint:string;result:string;evidenceIds:string[];score:number;paths:string[];files:FileRecord[]}
export interface JobState {route:'pending'|'coding'|'non_coding';routingReason:string;reviewEnabled:boolean;inputTurn:number|null;reviewer:ReviewerSelection|null;resolvedReviewerModel:string|null;resumeRequested:boolean;mode:'ordinary'|'long';jobId:string|null;cwd:string;phase:'idle'|'active'|'paused'|'blocked'|'done'|'ended';reason:string;startedAt:number;elapsedMs:number;activeSince:number;threshold:number;inputTokens:number;outputTokens:number;usageUnknown:boolean;toolCalls:number;assessments:number;noProgress:number;lastProgress:string;acceptances:Acceptance[];changes:{taskId:string;paths:string[];reason:string}[];revalidating:string[];pendingCalls:string[];history:{jobId:string;phase:string;at:number}[]}
export interface Snapshot {reviewer:ReviewerView;loop:LoopSettings;job:JobState|null;laya:{phase:string;error:string|null};settings:{independentReview:boolean;maxModelTokens:number;maxCost:number;inputPerMillion:number;outputPerMillion:number;threshold:number;noProgressLimit:number;maxToolCalls:number;maxAssessments:number;maxMinutes:number};planPath:string|null;currentTaskId:string|null;tasks:{id:string;title:string;passed:boolean}[]}
export const remoteContribution:TypertRemoteContribution={package:PACKAGE,descriptors:[{
 id:`${PACKAGE}#longTasks/request`,service:'longTasks',namespace:'longTasks',method:'request',invocation:{kind:'direct'},
 parameters:[{name:'request',wire:'request',source:'json',codec:{mode:'strict',typeSymbol:`${PACKAGE}#Request`,create:()=>requestSchema}}],result:{mode:'src-json'},
}]}
declare module '@deepseek-ai/dsh-typert-protocol' {
 interface TypertRemoteMap {'longTasks/request':(request:Request)=>Promise<RemoteResult<Snapshot>>}
 interface TypertRemoteNamespaceMap {longTasks:TypertRemoteNamespace<'longTasks'>}
}
