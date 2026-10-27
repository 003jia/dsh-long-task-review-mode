/** Validated Remote codecs shared by the installed Host and Client. */
import { z } from 'zod'
import type { InvocationDescriptor, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import type { LayaRequestId, LayaRequest, LayaSettings, LayaView, LayaResult, LayaCompletionReview, LayaCompletionScore } from './types.ts'
import type { SessionId, SessionSeq } from '@deepseek-ai/dsh-session/types'

/** Package identity used by both Remote registries and the Client module loader. */
export const PACKAGE = '@deepseek-ai/dsh-client-ui-laya'
const requestId = z.uuid().transform(value => value as LayaRequestId)
/** Validates settings received from a file or Remote caller. */
export const settingsSchema: z.ZodType<LayaSettings> = z.object({
  enabled: z.boolean(), launcher: z.string().trim().min(1).max(4096),
  device: z.enum(['auto', 'cpu', 'mps', 'cuda']),
  models: z.array(z.string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_-]+$/)).min(1).max(8),
  preload: z.boolean(), offline: z.boolean(), timeoutMs: z.number().int().min(1000).max(3600000),
}).strict().refine(value => new Set(value.models).size === value.models.length, 'Checkpoint names must be unique.')
/** Candidate budgets follow Laya's recommendation to shortlist larger choice sets. */
export const requestSchema: z.ZodType<LayaRequest> = z.object({
  id: requestId, mode: z.enum(['classify', 'task-route', 'model-route']),
  text: z.string().trim().min(1).max(16000), instructions: z.string().trim().min(1).max(2000),
  candidates: z.array(z.object({
    name: z.string().trim().min(1).max(100), description: z.string().trim().min(1).max(1000),
  }).strict()).min(2).max(20), lang: z.enum(['auto', 'zh', 'en']),
}).strict().refine(value => new Set(value.candidates.map(item => item.name)).size === value.candidates.length,
  'Candidate names must be unique.')
/** Validates completion results crossing MCP and durable session boundaries. */
export const completionScoreSchema: z.ZodType<LayaCompletionScore> = z.object({

  rate: z.number().min(0).max(1),
  dimensions: z.array(z.object({ name: z.enum(['coverage', 'constraints', 'evidence']), rate: z.number().min(0).max(1) })),
  confidence: z.number().min(0).max(1).nullable(), model: z.string().nullable(), device: z.string().nullable(),
  elapsedMs: z.number().nonnegative(), json: z.string(),
  gap: z.enum(['missing', 'partial', 'evidence', 'constraints', 'defect', 'none']).optional(), criticalSatisfied: z.boolean().optional(),
})
/** Review notices are known user/message events, so older desktops can still read the log. */
export const completionReviewSchema: z.ZodType<LayaCompletionReview> = z.object({
  sessionId: z.string().transform(value => value as SessionId),
  turn: z.number().int().nonnegative(), attempt: z.number().int().nonnegative(),
  at: z.number().nonnegative(),
  outputSeq: z.number().int().nonnegative().transform(value => value as SessionSeq).nullable(),
  threshold: z.number().min(0).max(100), maxRepairs: z.number().int().nonnegative(),
  reviewer:z.enum(['laya','jev','primary']).optional(),
  outcome: z.enum(['progress', 'passed', 'repair', 'blocked', 'error']), error: z.string().nullable(), requirement: z.string(), output: z.string(), evidence: z.array(z.string()),
  score: completionScoreSchema.nullable(),
  policy: z.enum(['task-items-v1','task-items-v2']).optional(), stage: z.enum(['tasks', 'overall']).optional(),
  passedItems: z.number().int().nonnegative().optional(), totalItems: z.number().int().nonnegative().optional(),
  items: z.array(z.object({ id: z.string(), title: z.string(), requirement: z.string(),
    status: z.enum(['pending', 'in_progress', 'completed']), result: z.string(), evidenceIds: z.array(z.string()),
    fingerprint: z.string(), score: completionScoreSchema.nullable(), passed: z.boolean(), reason: z.string(), reused: z.boolean(),
  })).optional(),
})
const viewSchema: z.ZodType<LayaView> = z.object({
  settings: settingsSchema, phase: z.enum(['disabled', 'connecting', 'ready', 'failed']),
  error: z.string().nullable(), actualDevice: z.string().nullable(), loadedModels: z.array(z.string()),
  version: z.string().nullable(), statusJson: z.string().nullable(),
  tools: z.array(z.object({ name: z.string(), description: z.string(), schema: z.string() })),
  completionReviews: z.array(completionReviewSchema),
})
const resultSchema: z.ZodType<LayaResult> = z.object({
  id: requestId, tool: z.enum(['laya_predict', 'laya_route']), elapsedMs: z.number().nonnegative(),
  selected: z.string().nullable(), confidence: z.number().min(0).max(1).nullable(), lowConfidence: z.boolean(),
  model: z.string().nullable(), device: z.string().nullable(), json: z.string(),
})
function descriptor(method: string, result: z.ZodType, input?: z.ZodType): InvocationDescriptor {
  return {
    id: `${PACKAGE}#laya/${method}`, service: 'layaController', namespace: 'laya', method,
    invocation: { kind: 'direct' },
    parameters: input === undefined ? [] : [{ name: 'request', wire: 'request', source: 'json',
      codec: { mode: 'strict', typeSymbol: `${PACKAGE}#${method}Request`, create: () => input } }],
    result: { mode: 'strict', typeSymbol: `${PACKAGE}#${method}Result`, create: () => result },
  }
}
/** Explicit descriptors avoid a dependency on another plugin's generated Remote assembly. */
export const remoteContribution: TypertRemoteContribution = {
  package: PACKAGE,
  descriptors: [descriptor('status', viewSchema), descriptor('save', viewSchema, settingsSchema),
    descriptor('reconnect', viewSchema), descriptor('refresh', viewSchema), descriptor('run', resultSchema, requestSchema),
    descriptor('cancel', z.object({ cancelled: z.boolean() }), z.object({ id: requestId }).strict())],
}
