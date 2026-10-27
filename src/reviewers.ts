/** Host-owned reviewer selection, credential references and bounded Jev HTTP requests. */
import {Service,type Context} from '@deepseek-ai/cordis'
import {credentialRef} from '@deepseek-ai/dsh-credentials'
import {randomUUID} from 'node:crypto'
import {z} from 'zod'
import type {Config} from './index.ts'
import type {LayaCompletionRequest,LayaCompletionScore} from './laya/types.ts'
import {completionQuestions} from './reviewer-rubric.ts'
import {reviewerSelectionSchema,type ReviewerSelection,type ReviewerSettings,type ReviewerView} from './reviewer-wire.ts'

const scalar=z.number().min(0).max(1)
const scoreAnswer=z.object({type:z.literal('score'),score:z.number().min(0).max(4),confidence:scalar,
 probabilities:z.object({'0':scalar,'1':scalar,'2':scalar,'3':scalar,'4':scalar}),legend:z.record(z.string(),z.string())})
const choiceAnswer=<T extends string>(choices:readonly [T,...T[]])=>z.object({type:z.literal('choice'),choice:z.enum(choices),confidence:scalar,probabilities:z.record(z.string(),scalar)})
const answerSchema=z.object({model:z.string().min(1).max(100),answers:z.object({completion:scoreAnswer,coverage:scoreAnswer,constraints:scoreAnswer,evidence:scoreAnswer,
 critical:choiceAnswer(['unsupported','satisfied']),gap:choiceAnswer(['missing','partial','evidence','constraints','defect','none'])}),
 usage:z.object({input_tokens:z.number().int().nonnegative(),output_tokens:z.number().int().nonnegative()})})
const sample:LayaCompletionRequest={taskType:'opinion',requirement:'Explain what 2 + 2 equals in one sentence.',output:'2 + 2 equals 4 because adding two objects to two objects gives four objects.',evidence:[],critical:true}
declare module '@deepseek-ai/cordis' {interface Context {reviewers:Reviewers}}
export class Reviewers extends Service {
 static inject=['settings']
 private lifetime=new AbortController()
 private checking:AbortController|undefined
 private verifiedRevision:string|null=null
 private testResult:ReviewerView['test']=null
 private error:string|null=null
 private errorBackend:'laya'|'jev'|null=null
 constructor(ctx:Context,private config:Config){super(ctx,'reviewers')}
 async* [Service.init]():AsyncGenerator<()=>void,void,void>{yield ()=>{this.lifetime.abort();this.checking?.abort()}}
 selection():ReviewerSelection{return reviewerSelectionSchema.parse(this.config.reviewer.get())}
 async view():Promise<ReviewerView>{
  const current=this.selection(),{credentialRef:ref,revision,...settings}=current
  const configured=await this.ctx.get('credentials')?.describe(credentialRef(ref))
  return {settings,credentialConfigured:configured?.configured===true,
   phase:this.checking?'checking':this.error&&this.errorBackend==='jev'?'failed':this.verifiedRevision===revision?'ready':configured?.configured?'configured':'unconfigured',error:this.errorBackend==='jev'?this.error:null,test:this.testResult}
 }
 async save(settings:ReviewerSettings,apiKey?:string):Promise<void>{
  const old=this.selection(),credentials=this.ctx.get('credentials')
  if(apiKey&&!credentials)throw new Error('凭据服务尚未加载，未保存密钥。')
  const hasKey=(await credentials?.describe(credentialRef(old.credentialRef)))?.configured===true
  if(old.endpoint!==settings.endpoint&&hasKey&&!apiKey)throw new Error('修改云端接口地址时请重新填写密钥，避免把旧密钥发给新地址。')
  const reuse=apiKey&&old.endpoint===settings.endpoint&&old.credentialRef.startsWith('DSH_LONG_TASK_JEV_')
  const previous=reuse?await credentials!.resolve(credentialRef(old.credentialRef)):undefined
  const ref=apiKey?(reuse?old.credentialRef:'DSH_LONG_TASK_JEV_'+randomUUID().replaceAll('-','_')):old.credentialRef
  if(apiKey)await credentials!.set(credentialRef(ref),apiKey)
  try{await this.ctx.settings.update('long-task',{reviewer:{...settings,credentialRef:ref,revision:randomUUID()}})}
  catch(error){if(apiKey){if(previous)await credentials!.set(credentialRef(ref),previous.value);else await credentials!.unset(credentialRef(ref))}throw error}
  this.cancel();this.verifiedRevision=null;this.testResult=null;this.error=null;this.errorBackend=null
 }
 async require(selection:ReviewerSelection|null):Promise<void>{
  if(!selection||selection.backend==='laya'){
   const status=this.ctx.get('layaController')?.status()
   if(status?.phase!=='ready')throw new Error('本地 Laya 尚未就绪：'+(status?.error??status?.phase??'未连接'))
  }else if(!(await this.ctx.get('credentials')?.describe(credentialRef(selection.credentialRef)))?.configured)throw new Error('尚未配置 JEV 密钥，请在长任务设置中保存并校验接口。')
 }
 cancel():void{this.checking?.abort();this.checking=undefined}
 async test(backend:'laya'|'jev'):Promise<void>{
  if(this.checking)throw new Error('已有模型校验正在执行。')
  const current=this.selection(),control=new AbortController();this.checking=control;this.error=null;this.errorBackend=null;this.testResult=null
  try{
   if(backend==='jev')this.verifiedRevision=null
   const selected={...current,backend};await this.require(selected)
   const score=await this.evaluate(selected,sample,control.signal)
   control.signal.throwIfAborted()
   if(current.revision!==this.selection().revision)throw new Error('校验期间设置已变化，请重新校验。')
   if(backend==='jev')this.verifiedRevision=current.revision
   this.testResult={backend,model:score.model,rate:score.rate,elapsedMs:score.elapsedMs,at:Date.now()}
  }catch(error){const message=control.signal.aborted?'模型校验已取消。':error instanceof Error?error.message:'模型校验失败。';if(current.revision===this.selection().revision){this.error=message;this.errorBackend=backend}throw new Error(message)}
  finally{if(this.checking===control)this.checking=undefined}
 }
 async evaluate(selection:ReviewerSelection|null,request:LayaCompletionRequest,signal:AbortSignal):Promise<LayaCompletionScore>{
  if(!selection||selection.backend==='laya'){
   const local=this.ctx.get('layaController');if(!local)throw new Error('本地 Laya 服务未加载。')
   return local.evaluateCompletion(request,AbortSignal.any([signal,this.lifetime.signal]))
  }
  const key=await this.ctx.get('credentials')?.resolve(credentialRef(selection.credentialRef))
  if(!key)throw new Error('JEV 密钥不可用。')
  const body=JSON.stringify({model:selection.model,state:{original_requirement:request.requirement,completion_candidate:request.output,execution_evidence:request.evidence,task_type:request.taskType??'execution'},questions:completionQuestions(request)})
  if(Buffer.byteLength(body,'utf8')>this.config.reviewerMaxInputBytes)throw new Error('JEV 输入超过配置预算；请拆分任务，未截断需求或证据。')
  const started=Date.now(),combined=AbortSignal.any([signal,this.lifetime.signal,AbortSignal.timeout(selection.timeoutMs)])
  let response:Response
  try{response=await fetch(selection.endpoint,{method:'POST',headers:{Authorization:'Bearer '+key.value,'Content-Type':'application/json'},body,signal:combined,redirect:'error'})}
  catch(error){combined.throwIfAborted();throw new Error('JEV 接口连接失败，请核对地址、网络和证书。')}
  if(!response.ok){await response.body?.cancel();throw new Error('JEV 请求失败（HTTP '+response.status+'）；请核对密钥、额度、限流或服务状态。')}
  const reader=response.body?.getReader();if(!reader)throw new Error('JEV 返回空响应。')
  let size=0;const chunks:Uint8Array[]=[]
  try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>this.config.reviewerMaxResponseBytes)throw new Error('JEV 响应超过配置预算。');chunks.push(part.value)}}
  finally{await reader.cancel();reader.releaseLock()}
  combined.throwIfAborted()
  let parsed:z.infer<typeof answerSchema>
  try{parsed=answerSchema.parse(JSON.parse(Buffer.concat(chunks).toString('utf8')))}catch(error){throw new Error('JEV 响应缺少有效的评分、概率、必选条件或用量；未记录通过。')}
  const a=parsed.answers
  for(const name of ['completion','coverage','constraints','evidence'] as const){
   const value=a[name],keys=Object.keys(value.probabilities),sum=keys.reduce((total,k)=>total+value.probabilities[k as keyof typeof value.probabilities],0)
   const mean=keys.reduce((total,k)=>total+Number(k)*value.probabilities[k as keyof typeof value.probabilities],0)
   if(Math.abs(sum-1)>.02||Math.abs(mean-value.score)>.03||keys.some(k=>!(k in value.legend)))throw new Error('JEV 评分分布不完整或不一致。')
  }
  for(const name of ['critical','gap'] as const){const value=a[name],expected=name==='critical'?['unsupported','satisfied']:['missing','partial','evidence','constraints','defect','none'];if(Object.keys(value.probabilities).length!==expected.length||expected.some(k=>value.probabilities[k]===undefined)||Math.abs(Object.values(value.probabilities).reduce((n,p)=>n+p,0)-1)>.02)throw new Error('JEV 选择题概率不完整。')}
  return {rate:a.completion.score/4,dimensions:(['coverage','constraints','evidence'] as const).map(name=>({name,rate:a[name].score/4})),confidence:a.completion.confidence,model:parsed.model,device:'cloud',elapsedMs:Date.now()-started,
   gap:a.gap.choice,criticalSatisfied:a.critical.choice==='satisfied',json:JSON.stringify({model:parsed.model,usage:parsed.usage,completion:a.completion.score,gap:a.gap.choice,criticalSatisfied:a.critical.choice==='satisfied'})}
 }
}
