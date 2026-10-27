/** A single native Client bundle with a per-session input control and unified settings. */
import type {Context} from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import {apply as panel} from '../panel/client/index.ts'
import {remoteContribution,type Request} from '../wire.ts'
import {remoteContribution as layaContract} from '../laya/wire.ts'
import {Mode} from './Mode.tsx'
import {Settings} from './Settings.tsx'
import {en,zh,type Key} from './locales.ts'
declare module '@deepseek-ai/dsh-client-ui-slots' {interface LocaleNamespaceMap {longTask:Key}}
export const inject=['slots','locale','remote','sidebarRightTabs','sidebarRight']
export async function apply(ctx:Context):Promise<void>{
 panel(ctx)
 await ctx.remote.$mount(remoteContribution);await ctx.remote.$mount(layaContract)
 ctx.effect(()=>ctx.locale.register('longTask',{en,zh}),'long task dictionaries')
 const t=ctx.locale.bind('longTask')
 ctx.inject(['remote.longTasks','remote.laya'],ctx=>{
  const act=async(request:Request)=>{const result=await ctx.remote.longTasks.request(request);if(!result.ok)throw new Error(result.error.message);return result.value}
  const layaStatus=async()=>{const r=await ctx.remote.laya.status();if(!r.ok)throw new Error(r.error.message);return r.value}
  ctx.slots.inject('conversation.session.header.utilities',()=>ctx.slots.register({name:'conversation.session.header.utilities',id:'long-task-actions',order:15,locale:'longTask',inject:sessionId=>({act,open:()=>{ctx.sidebarRight.openTabIn(sessionId,'claude-loop-flow')}})},Mode))
  ctx.slots.inject('settings.section',()=>ctx.slots.register({name:'settings.section',id:'long-task',order:30,label:()=>t('title'),locale:'longTask',inject:()=>({act,layaStatus,saveLaya:async(settings)=>{const r=await ctx.remote.laya.save(settings);if(!r.ok)throw new Error(r.error.message);return r.value},reconnect:async()=>{const r=await ctx.remote.laya.reconnect();if(!r.ok)throw new Error(r.error.message);return r.value}})},Settings))
 })
}
