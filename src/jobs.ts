/** Durable session-bound jobs; the session journal owns persistence, independent of chat compression. */
import {type Context,Service} from '@deepseek-ai/cordis'
import {TypertRemoteService,Remote} from '@deepseek-ai/dsh-typert-protocol'
import {createUserMessage} from '@deepseek-ai/dsh-llm'
import {randomUUID} from 'node:crypto'
import {z} from 'zod'
import type {Agent} from '@deepseek-ai/dsh-agent'
import {appendPluginRecord,type Session} from '@deepseek-ai/dsh-session'
import type {LayaCompletionRequest,LayaCompletionScore,LayaTaskAssessment} from './laya/types.ts'
import type {Config} from './index.ts'
import {type JobState,type Snapshot,type Request,type Acceptance,requestSchema,loopSettingsSchema} from './wire.ts'
import {jobSchema,readJobRecord} from './job-record.ts'
import {capture,differences,hash} from './artifacts.ts'
import type {} from '@deepseek-ai/dsh-session-projection'
import type {} from '@deepseek-ai/dsh-agent-preset-registry'
import {LONG_TASK_PRESET} from './mode-preset.ts'
const empty=():JobState=>({route:'pending',routingReason:'',reviewEnabled:true,inputTurn:null,reviewer:null,resolvedReviewerModel:null,resumeRequested:false,mode:'ordinary',jobId:null,cwd:'',phase:'idle',reason:'',startedAt:0,elapsedMs:0,activeSince:0,threshold:70,inputTokens:0,outputTokens:0,usageUnknown:false,toolCalls:0,assessments:0,noProgress:0,lastProgress:'',acceptances:[],changes:[],revalidating:[],pendingCalls:[],history:[]})
declare module '@deepseek-ai/dsh-session-projection' {interface SessionProjectionStateMap {'long-task-job':JobState} interface SessionProjectionMap {'long-task-job':JobState}}
declare module '@deepseek-ai/cordis' {interface Context {longTasks:LongTasks}}
export class LongTasks extends TypertRemoteService {
 static inject=['reviewers','sessions','sessionProjections','settings','tools','systemPrompt']
 private stopped=new AbortController()
 private seenSessions=new Set<string>()
 private masks=new Map<Agent,()=>void>()
 private turnJobs=new Map<Agent,{turn:number;jobId:string}>()
 private writes:Promise<unknown>=Promise.resolve()
 constructor(ctx:Context,private config:Config){super(ctx,'longTasks')}
 async* [Service.init]():AsyncGenerator<()=>void,void,void>{
  yield ()=>{this.stopped.abort();for(const off of this.masks.values())off();this.masks.clear();this.turnJobs.clear()}
  this.ctx.sessionProjections.register({key:'long-task-job',stateVersion:2,stateSchema:jobSchema,init:empty,
   apply(state,event):JobState{
    const record=readJobRecord(event)
    if(record)return record
    if(event.type==='user/message'&&event.data.source.kind==='user'&&state.mode==='long'&&state.jobId&&['paused','blocked'].includes(state.phase)){
     const text=event.data.content.filter(block=>block.type==='text').map(block=>block.text).join(' ').trim()
     if(/^(继续|接着|继续任务|继续当前任务|continue|resume)[。.!！]?$/i.test(text))return {...state,resumeRequested:true}
    }
    if(!state.jobId||state.phase!=='active')return state
    if(event.type==='assistant/message')return {...state,inputTokens:state.inputTokens+(event.data.usage?.inputTokens??0),outputTokens:state.outputTokens+(event.data.usage?.outputTokens??0),usageUnknown:state.usageUnknown||event.data.usage===undefined}
    if(event.type==='tool/call')return {...state,toolCalls:state.toolCalls+1,pendingCalls:[...state.pendingCalls,event.data.callId]}
    if(event.type==='tool/result')return {...state,pendingCalls:state.pendingCalls.filter(id=>id!==event.data.message.source.callId)}
    if(event.type==='turn/end'&&event.data.reason.kind!=='completed')return {...state,phase:'paused',reason:'本轮已中断；继续前先核查未完成动作。',elapsedMs:state.elapsedMs+Math.max(0,event.time-state.activeSince),activeSince:0}
    return state
   },wire:{viewSchema:jobSchema,view:state=>state}})
  // After process reload the journal can contain an active job; do not resume business work automatically.
  for(const session of this.ctx.sessions.list()){
   const job=this.state(session)
   if(job.phase==='active')this.update(session,{...job,phase:'paused',reason:job.pendingCalls.length?'上次动作结果不确定；请先核查产物再继续。':'应用已重载；点击继续恢复原任务。',activeSince:0})
  }
  this.ctx.on('agent/pre-step',async({agent,turn,signal},next)=>{
   let job=this.state(agent.session)
   const preset=this.ctx.get('agentPresets')?.composedPreset(agent.ctx)??agent.session.header.agentPreset
   if(preset===LONG_TASK_PRESET&&(!job.jobId||job.phase==='done'&&this.turnJobs.get(agent)?.turn!==turn)&&agent.session.header.origin!=='subagent'){await this.dispatch({op:'long',sessionId:agent.session.id},turn);job=this.state(agent.session)}
   const old=this.turnJobs.get(agent)
   if(job.mode==='long'&&job.resumeRequested&&['paused','blocked'].includes(job.phase)){await this.request({op:'resume',sessionId:agent.session.id});job=this.state(agent.session)}
   if(old?.turn===turn&&(job.phase!=='active'||job.jobId!==old.jobId||job.mode!=='long'))throw new Error('长任务已停止：'+job.reason)
   const on=this.active(agent)
   if(on){this.masks.get(agent)?.();this.masks.delete(agent);this.turnJobs.set(agent,{turn,jobId:job.jobId!})
    const budget=this.budgetIssue(job);if(budget){this.pause(agent,budget);throw new Error(budget)}
    await this.before(agent,signal)
   }else if(job.mode!=='long'&&preset!==LONG_TASK_PRESET&&!this.masks.has(agent))this.masks.set(agent,agent.ctx.tools.restrict({deny:['loop_tasks','laya_tasks']}))
   const decision=await next()
   if(decision.kind!=='reject'&&job.mode==='long'&&job.jobId&&['paused','blocked'].includes(job.phase)){
    const human=[...decision.messages].reverse().find(message=>message.source.kind==='user')
    const text=human?.content.filter(block=>block.type==='text').map(block=>block.text).join(' ').trim()??''
    if(/^(继续|接着|继续任务|继续当前任务|continue|resume)[。.!！]?$/i.test(text)){
     await this.request({op:'resume',sessionId:agent.session.id});job=this.state(agent.session)
     this.masks.get(agent)?.();this.masks.delete(agent);this.turnJobs.set(agent,{turn,jobId:job.jobId!})
     await this.before(agent,signal)
    }
   }
   return decision
  })
  this.ctx.on('agent/disposed',({agent})=>{this.masks.get(agent)?.();this.masks.delete(agent);this.turnJobs.delete(agent)})
  this.ctx.on('system-prompt/assemble',async(_assembly,context,next)=>{
   const assembled=await next(),agent=context.agent
   // Newer DSH applies provider-owned tools after the presentation waterfall.
   // The pre-step scoped restriction above remains authoritative for ordinary mode.
   if(!Array.isArray(assembled.tools))return assembled
   const preset=agent?(this.ctx.get('agentPresets')?.composedPreset(agent.ctx)??agent.session.header.agentPreset):undefined
   if(!agent||this.state(agent.session).mode!=='long'&&preset!==LONG_TASK_PRESET)return {...assembled,tools:assembled.tools.filter(t=>!['loop_tasks','laya_tasks'].includes(t.name))}
   return assembled
  })
  this.ctx.tools.guard(exec=>{
   if(!exec.agent||exec.agent.session.header.origin==='subagent')return
   const job=this.state(exec.agent.session)
   if(['loop_tasks','laya_tasks'].includes(exec.name)&&job.mode!=='long')return '请先在输入区显式开启长任务模式。'
   if(job.mode==='long'&&job.phase!=='active')return `长任务已暂停：${job.reason}。请在界面继续或切换普通模式。`
   if(job.mode==='long'){
    if(job.pendingCalls.some(id=>id!==exec.callId)&&!['loop_tasks','laya_tasks','read','ls','glob','grep','read_image'].includes(exec.name))return '存在结果不确定的旧动作，请核查后在界面确认。'
    const elapsed=job.elapsedMs+Math.max(0,Date.now()-job.activeSince)
    if(job.toolCalls>this.config.maxToolCalls.get()||elapsed>this.config.maxMinutes.get()*60000){this.pause(exec.agent,'长任务执行预算已达到上限。');return '长任务预算已用尽，请调整设置后继续。'}
   }
  })
 }
 /** Determine owned task-tool availability before the model step is admitted. */
 toolVisible(agent:Agent):boolean{
  const preset=this.ctx.get('agentPresets')?.composedPreset(agent.ctx)??agent.session.header.agentPreset
  return this.state(agent.session).mode==='long'||preset===LONG_TASK_PRESET
 }
 budgetIssue(job:JobState):string|null{
  if(job.inputTokens+job.outputTokens>=this.config.maxModelTokens.get())return '模型 Token 预算已达到上限。'
  if(this.config.maxCost.get()>0){
   if(this.config.inputPerMillion.get()<=0||this.config.outputPerMillion.get()<=0||job.usageUnknown)return '费用预算缺少有效单价或实际用量，无法继续计费核验。'
   if((job.inputTokens*this.config.inputPerMillion.get()+job.outputTokens*this.config.outputPerMillion.get())/1000000>=this.config.maxCost.get())return '按配置单价估算的费用达到预算。'
  }
  return null
 }
 state(session:Session):JobState{
  const job=this.ctx.sessionProjections.stateOf(session,'long-task-job')??empty()
  if(!this.seenSessions.has(session.id)){
   this.seenSessions.add(session.id)
   if(job.phase==='active'){
    const paused:JobState={...job,phase:'paused',activeSince:0,reason:'应用或插件已重载；核查未完成动作后点击继续。'}
    this.update(session,paused);return paused
   }
  }
  return job
 }
 active(agent:Agent):boolean{const job=this.state(agent.session);return job.mode==='long'&&job.phase==='active'&&agent.session.header.origin!=='subagent'}
 update(session:Session,job:JobState):void{
  appendPluginRecord(session,'plugin:long-task/state',job)
 }
 pause(agent:Agent,reason:string):void{const job=this.state(agent.session);if(job.phase==='active')this.update(agent.session,{...job,phase:'blocked',reason,elapsedMs:job.elapsedMs+Math.max(0,Date.now()-job.activeSince),activeSince:0})}
 async before(agent:Agent,signal:AbortSignal):Promise<void>{
  signal=AbortSignal.any([signal,this.stopped.signal])
  const job=this.state(agent.session)
  if(!this.active(agent))throw new Error('长任务未运行，请在界面继续。')
  if(job.cwd!==agent.session.header.cwd)throw new Error('工作目录与任务绑定不一致；请创建新任务。')
  const latest=new Map(job.acceptances.map(a=>[a.taskId,a]));const changes:JobState['changes']=[]
  for(const accepted of latest.values()){
   try {const files=await capture(agent,accepted.paths,signal);const paths=differences(accepted.files,files)
    if(paths.length)changes.push({taskId:accepted.taskId,paths,reason:'已验收，交付物变化待复核'})
   }catch(e){signal.throwIfAborted();changes.push({taskId:accepted.taskId,paths:accepted.paths,reason:String(e)})}
  }
  if(JSON.stringify(job.changes)!==JSON.stringify(changes))this.update(agent.session,{...this.state(agent.session),changes})
  // Changes are addressed explicitly with revalidateTaskIds; never erase history or reset a dependency chain.
 }
 revalidate(agent:Agent,ids:string[],reason:string):void{
  const job=this.state(agent.session)
  for(const id of ids){if(!job.acceptances.some(a=>a.taskId===id))throw new Error('只能定向复验已有通过记录的任务：'+id);if(!job.changes.some(change=>change.taskId===id))throw new Error('未检测到该已通过项的交付物变化，保留原验收：'+id)}
  this.update(agent.session,{...job,revalidating:ids,reason})
 }
 assertUnchanged(agent:Agent):void{const job=this.state(agent.session);const unresolved=job.changes.filter(x=>!job.revalidating.includes(x.taskId));if(unresolved.length)throw new Error('已验收交付物变化，请核查差异并单独提交 revalidateTaskIds 和 repairAnalysis：'+JSON.stringify(unresolved))}
 async evaluate(agent:Agent,request:LayaCompletionRequest,signal:AbortSignal):Promise<LayaCompletionScore>{
  const job=this.state(agent.session),selection=job.reviewer
  const score=await this.ctx.reviewers.evaluate(selection&&job.resolvedReviewerModel?{...selection,model:job.resolvedReviewerModel}:selection,request,signal)
  signal.throwIfAborted()
  if(!this.active(agent)||this.state(agent.session).jobId!==job.jobId||this.stopped.signal.aborted)throw new Error('评分期间任务已停止，未发布结果。')
  if(selection?.backend==='jev'){
   if(job.resolvedReviewerModel&&job.resolvedReviewerModel!==score.model)throw new Error('JEV 实际模型版本改变，请核查接口后继续；保留已通过记录。')
   if(!job.resolvedReviewerModel){this.update(agent.session,{...this.state(agent.session),resolvedReviewerModel:score.model});await this.ctx.sessions.flush(agent.session)}
  }
  return score
 }
 async route(agent:Agent,kind:'coding'|'non_coding',reason:string,signal:AbortSignal):Promise<void>{
  const job=this.state(agent.session)
  if(job.route!=='pending'){if(job.route!==kind)throw new Error('当前任务的分流已固定；不能切换分类绕过验收。');return}
  signal.throwIfAborted()
  this.update(agent.session,{...job,route:kind,routingReason:reason})
  await this.ctx.sessions.flush(agent.session)
  if(kind==='coding'&&job.reviewEnabled){try{await this.ctx.reviewers.require(job.reviewer)}catch(error){this.pause(agent,String(error));throw error}}
 }
 async prepare(agent:Agent,item:LayaTaskAssessment,signal:AbortSignal):Promise<Acceptance>{
  const paths=item.affectedPaths??[]
  if(item.taskType!=='opinion'&&paths.length===0)throw new Error('执行任务必须在 plan.md 的 affectedPaths 中声明实际交付路径；文本分析可用 taskType=opinion。')
  return {jobId:this.state(agent.session).jobId!,taskId:item.id,at:Date.now(),fingerprint:item.fingerprint,result:item.result,evidenceIds:[...item.evidenceIds],score:0,paths:[...paths],files:await capture(agent,paths,signal)}
 }
 async accept(agent:Agent,prepared:Acceptance,score:number,signal:AbortSignal):Promise<void>{
  const fresh=await capture(agent,prepared.paths,signal)
  if(!this.active(agent)||this.stopped.signal.aborted||this.state(agent.session).jobId!==prepared.jobId)throw new Error('评分期间任务已暂停，未发布通过结果。')
  if(differences(prepared.files,fresh).length)throw new Error('交付物在评分期间变化，结果未通过；请重新提交。')
  this.update(agent.session,{...this.state(agent.session),acceptances:[...this.state(agent.session).acceptances,{...prepared,score}],revalidating:this.state(agent.session).revalidating.filter(id=>id!==prepared.taskId),changes:this.state(agent.session).changes.filter(x=>x.taskId!==prepared.taskId)})
  await this.ctx.sessions.flush(agent.session)
 }
 attempt(agent:Agent,key:string):void{
  const job=this.state(agent.session)
  if(job.assessments>=this.config.maxAssessments.get()){this.pause(agent,'评分预算已用尽。');throw new Error('评分预算已用尽。')}
  if(job.noProgress>=this.config.noProgressLimit.get()){this.pause(agent,'连续无有效进展达到上限。');throw new Error('连续无有效进展达到上限，请核查证据后继续。')}
  if(job.lastProgress===key){const next={...job,noProgress:job.noProgress+1};this.update(agent.session,next);if(next.noProgress>=this.config.noProgressLimit.get())this.pause(agent,'相同证据与交付物重复提交，未再次请求评分。');throw Object.assign(new Error('证据和交付物未变化，未重复评分；先取得新的有效进展。'),{name:'NoEffectiveProgress'})}
  this.update(agent.session,{...job,assessments:job.assessments+1,lastProgress:key})
 }
 verdict(agent:Agent,passed:boolean):void{const job=this.state(agent.session);this.update(agent.session,{...job,noProgress:passed?0:job.noProgress+1});if(!passed&&job.noProgress+1>=this.config.noProgressLimit.get())this.pause(agent,'连续三次或配置次数的修复未通过，已暂停。')}
 completed(agent:Agent):void{const job=this.state(agent.session);this.update(agent.session,{...job,phase:'done',reason:job.route==='non_coding'?'非代码任务已正常完成。':job.reviewEnabled?'全部任务与整体交付均已通过独立验收。':'代码任务已完成主模型自检，未进行独立验收。',elapsedMs:job.elapsedMs+Math.max(0,Date.now()-job.activeSince),activeSince:0})}
 async snapshot(id?:string):Promise<Snapshot>{
  const session=id?this.ctx.sessions.get(id as Session['id']):undefined,review=session?this.ctx.sessionProjections.stateOf(session,'claudeCompletionReview'):undefined
  const job=session?this.state(session):null
  const loop=loopSettingsSchema.parse(Object.fromEntries(Object.keys(loopSettingsSchema.shape).map(key=>[key,this.config.loop[key as keyof typeof loopSettingsSchema.shape].get()??null])))
  return {reviewer:await this.ctx.reviewers.view(),loop,job,laya:{phase:this.ctx.get('layaController')?.status().phase??'disabled',error:this.ctx.get('layaController')?.status().error??null},settings:{independentReview:this.config.independentReview.get(),maxModelTokens:this.config.maxModelTokens.get(),maxCost:this.config.maxCost.get(),inputPerMillion:this.config.inputPerMillion.get(),outputPerMillion:this.config.outputPerMillion.get(),threshold:this.config.loop.layaReviewThreshold.get(),noProgressLimit:this.config.noProgressLimit.get(),maxToolCalls:this.config.maxToolCalls.get(),maxAssessments:this.config.maxAssessments.get(),maxMinutes:this.config.maxMinutes.get()},planPath:review?.plan?.path??null,currentTaskId:review?.tasks.find(t=>!review.assessments[t.id]?.passed)?.id??null,tasks:review?.tasks.map(t=>({id:t.id,title:t.title,passed:review.assessments[t.id]?.passed===true}))??[]}
 }
 @Remote
 async request(raw:Request):Promise<Snapshot>{return this.dispatch(raw)}
 private async dispatch(raw:Request,inputTurn:number|null=null):Promise<Snapshot>{
  const request=requestSchema.parse(raw)
  if(request.op==='cancelReviewerTest'){this.ctx.reviewers.cancel();return this.snapshot()}
   if(request.op==='testReviewer'){await this.ctx.reviewers.test(request.backend);return this.snapshot()}
  const operation=async()=>{
   if(request.op==='saveReviewer'){await this.ctx.reviewers.save(request.reviewer,request.apiKey);return this.snapshot()}
   if(request.op==='settings')return this.snapshot()
   if(request.op==='saveReviewPolicy'){await this.ctx.settings.update('long-task',{independentReview:request.enabled});return this.snapshot()}
   if(request.op==='saveLoop'){await this.ctx.settings.update('long-task',{loop:request.loop});return this.snapshot()}
   if(request.op==='save'){
    const prices={maxModelTokens:request.maxModelTokens??this.config.maxModelTokens.get(),maxCost:request.maxCost??this.config.maxCost.get(),inputPerMillion:request.inputPerMillion??this.config.inputPerMillion.get(),outputPerMillion:request.outputPerMillion??this.config.outputPerMillion.get()}
    if(prices.maxCost>0&&(prices.inputPerMillion<=0||prices.outputPerMillion<=0))throw new Error('启用费用预算须填写输入与输出的每百万 Token 单价。')
    await this.ctx.settings.update('long-task',{...prices,loop:{layaReviewThreshold:request.threshold},noProgressLimit:request.noProgressLimit,maxToolCalls:request.maxToolCalls,maxAssessments:request.maxAssessments,maxMinutes:request.maxMinutes})
    return this.snapshot()
   }
   const session=this.ctx.sessions.get(request.sessionId as Session['id']);if(!session||session.header.origin==='subagent')throw new Error('会话不存在或不是主会话。')
   if(request.op==='status')return this.snapshot(request.sessionId)
   let job=this.state(session)
   if(request.op==='long'||request.op==='new'||request.op==='resume'){
    if(request.op==='new'&&job.phase==='active')throw new Error('先暂停或结束当前任务，再新建任务。')
    if(request.op==='new'||!job.jobId||job.phase==='ended'||job.phase==='done')job={...empty(),history:[...job.history,...job.jobId?[{jobId:job.jobId,phase:job.phase,at:Date.now()}]:[]],jobId:randomUUID(),cwd:session.header.cwd??'',startedAt:Date.now(),threshold:this.config.loop.layaReviewThreshold.get(),reviewer:this.ctx.reviewers.selection(),reviewEnabled:this.config.independentReview.get(),inputTurn}
    if(job.route==='coding'&&job.reviewEnabled)await this.ctx.reviewers.require(job.reviewer)
    job={...job,...request.op==='resume'?{noProgress:0,lastProgress:''}:{},resumeRequested:false,mode:'long',phase:'active',reason:job.pendingCalls.length?'存在结果不确定的旧动作，先核查真实产物；禁止自动重试。':'',activeSince:Date.now()}
   }else if(request.op==='acknowledge')job={...job,pendingCalls:[],reason:'用户已核查上次不确定动作，仍须按真实证据继续。'}
   else if(request.op==='end')job={...job,mode:'ordinary',phase:'ended',reason:'用户结束任务。',elapsedMs:job.elapsedMs+(job.activeSince?Date.now()-job.activeSince:0),activeSince:0}
   else job={...job,mode:request.op==='ordinary'?'ordinary':'long',phase:job.jobId?'paused':'idle',reason:request.op==='ordinary'?'已切换普通模式，原任务保留。':'用户暂停任务。',elapsedMs:job.elapsedMs+(job.activeSince?Date.now()-job.activeSince:0),activeSince:0}
   this.update(session,job);await this.ctx.sessions.flush(session);return this.snapshot(request.sessionId)
  }
  const pending=this.writes.then(operation);this.writes=pending.catch(()=>{});return pending
 }
}

declare module '@deepseek-ai/dsh-llm' {interface MessageSourceMap {'long-task-state':{kind:'long-task-state';form:'notice';summary:string;job:JobState}}}

declare module '@deepseek-ai/dsh-session/types' {interface PluginRecordMap {'plugin:long-task/state':JobState}}
