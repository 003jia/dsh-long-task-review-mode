/** Non-secret reviewer settings. Secrets are accepted only on the write boundary. */
import {z} from 'zod'
export const endpointSchema=z.string().trim().url().max(2048).refine(value=>{
 const u=new URL(value)
 return !u.username&&!u.password&&!u.search&&!u.hash&&(u.protocol==='https:'||u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname))
},'Use an HTTPS endpoint without credentials or query parameters (HTTP is allowed for loopback proxies).')
export const reviewerSettingsSchema=z.object({backend:z.enum(['laya','jev']),endpoint:endpointSchema,model:z.string().trim().min(1).max(100),timeoutMs:z.number().int().min(1000).max(3600000)}).strict()
export type ReviewerSettings=z.infer<typeof reviewerSettingsSchema>
export const reviewerSelectionSchema=reviewerSettingsSchema.extend({credentialRef:z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),revision:z.string()}).strict()
export type ReviewerSelection=z.infer<typeof reviewerSelectionSchema>
export interface ReviewerView {settings:ReviewerSettings;credentialConfigured:boolean;phase:'unconfigured'|'configured'|'checking'|'ready'|'failed';error:string|null;test:{backend:'laya'|'jev';model:string|null;rate:number;elapsedMs:number;at:number}|null}
