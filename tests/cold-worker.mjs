/** Cross-process cold resume using released Loader/session/persistence, with inference scripted. */
import {formalRequire,nativeExecutorPackages} from './formal-imports.mjs'
import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {join,resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const {Context}=await import(formalRequire.resolve('@deepseek-ai/cordis'))
const {LlmAdapter,ToolCallId,createUserMessage}=await import(formalRequire.resolve('@deepseek-ai/dsh-llm'))
const {defineTool}=await import(formalRequire.resolve('@deepseek-ai/dsh-tools'))
const load=async name=>{const m=await import(formalRequire.resolve('@deepseek-ai/'+name));return m.default??m}
const [stage,root]=process.argv.slice(2),ctx=new Context();ctx.baseUrl=pathToFileURL(root+'/').href
ctx.provide('profileContext',{home:join(root,'home'),dir:root,name:'fixture',cwd:root,patchPath:join(root,'cordis.patch.yml'),installAnchor:join(root,'package.json'),startedBundles:[],overlays:[]})
let owner,n=0,evaluations=0
const plan={format:'claude-loop-plan/v1',revision:1,goal:'Create two verified fixture files',scope:'Only fixture artifacts',tasks:[1,2].map(i=>({id:'T0'+i,title:'Artifact '+i,requirement:'Create the verified fixture artifact '+i,deliverables:['File artifact'+i+'.txt'],evidence:['Real execution receipt'],dependsOn:i===2?['T01']:[],affectedPaths:['artifact'+i+'.txt'],critical:true})),exceptions:{recoverable:'Repair current item',revisePlan:'Append reason and affected IDs',blocked:'Pause until resolved'},changes:[]}
function readState(request){
 for(const message of [...request.messages].reverse())if(message.role==='tool')for(const block of message.content)if(block.type==='text'){try{const value=JSON.parse(block.text);if(value.receipts)return value}catch{}}
 throw Error('Missing actual loop_tasks response')
}
class Model extends LlmAdapter{
 async resolveModel(provider,id){return{provider,id,name:id,inputModalities:['text']}}
 async*stream(request){
  const step=++n;let name,args
  if(stage==='seed'){
   if(step===1){name='write';args={path:'plan.md',content:'```json\n'+JSON.stringify(plan)+'\n```\n'}}
   else if(step===2){name='loop_tasks';args={kind:'coding',reason:'Implement two fixture code artifacts',planPath:'plan.md'}}
   else if(step===3){name='fixture_execute';args={i:1}}
   else if(step===4){name='loop_tasks';args={}}
   else if(step===5){const state=readState(request),receipt=state.receipts.filter(x=>x.text.startsWith('fixture_execute: OK')).at(-1);name='loop_tasks';args={taskUpdate:{id:'T01',status:'completed',result:'Verified cold artifact 1',evidenceIds:[receipt.id]}}}
   else throw Error('Seed must stop after the first accepted item')
  }else{
   if(step===1){name='fixture_execute';args={i:2}}
   else if(step===2){name='loop_tasks';args={}}
   else if(step===3){const state=readState(request),receipt=state.receipts.filter(x=>x.text.startsWith('fixture_execute: OK')).at(-1);name='loop_tasks';args={taskUpdate:{id:'T02',status:'completed',result:'Verified cold artifact 2',evidenceIds:[receipt.id]}}}
   else if(step===4){yield{type:'block-start',index:0,blockType:'text'};yield{type:'block-end',index:0,block:{type:'text',text:'Both cold fixture artifacts are delivered and verified.'}};yield{type:'finish',reason:{kind:'stop'}};return}
   else throw Error('Unexpected extra request after cold resume')
  }
  const id=ToolCallId('cold-'+stage+'-'+step);yield{type:'block-start',index:0,blockType:'tool-call'};yield{type:'tool-call-delta',index:0,id,name,argumentsDelta:JSON.stringify(args)};yield{type:'block-end',index:0,block:{type:'tool-call',id,name,arguments:JSON.stringify(args)}};yield{type:'finish',reason:{kind:'tool-calls'}}
 }
}
try{
 await ctx.plugin(await load('cordis-plugin-loader')).await();ctx.loader.builtins.group=await load('cordis-plugin-group');ctx.loader.builtins.include=await load('cordis-plugin-include')
 const rows=['dsh-llm','dsh-session','dsh-session-projection','dsh-system-prompt','dsh-tools',...nativeExecutorPackages,'dsh-agent','dsh-agent-loop','dsh-typert-registry','dsh-config-editor','dsh-settings'].map((name,i)=>({id:'core-'+i,name:'@deepseek-ai/'+name,...name==='dsh-agent-loop'?{config:{agents:[]}}:{}}))
 rows.push({id:'persistence',name:'@deepseek-ai/dsh-session-persistence-jsonl',config:{root:join(root,'sessions'),compression:'none'}},{id:'fs',name:'@deepseek-ai/dsh-fs-local',config:{cwd:root}},{id:'long-task',name:process.env.DSH_LONG_TASK_TEST_HOST??resolve(import.meta.dirname,'../lib/index.js'),config:{loop:{maxToolTurns:0}}})
 writeFileSync(join(root,'cordis.yml'),JSON.stringify(rows));await ctx.loader.create({name:'cordis:include',config:{path:'./cordis.yml'}});await ctx.loader.await();assert.ok(ctx.longTasks)
 ctx.llm.registerAdapter(['fixture'],new Model())
 ctx.layaController.status=()=>({phase:'ready',error:null})
 ctx.layaController.evaluateCompletion=async()=>{evaluations++;return{rate:.95,confidence:.99,criticalSatisfied:true,gap:'none',dimensions:[],model:'scripted',device:null,elapsedMs:1,json:'{}'}}
 ctx.tools.register(defineTool({name:'write',description:'Write isolated plan',parameters:{path:{type:'string',required:true},content:{type:'string',required:true}},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:args=>{assert.equal(args.path,'plan.md');writeFileSync(join(root,args.path),args.content);return 'Saved plan.md'}}))
 ctx.tools.register(defineTool({name:'fixture_execute',description:'Create the real isolated artifact',parameters:{i:{type:'integer',required:true}},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:args=>{writeFileSync(join(root,'artifact'+args.i+'.txt'),'cold verified '+args.i);return 'Verified artifact '+args.i}}))
 if(stage==='seed'){
  owner=await ctx.agents.create({sessionId:'cold-task',meta:{cwd:root},agentOptions:{provider:'fixture',model:'fixture'}})
  await ctx.longTasks.request({op:'long',sessionId:owner.agent.id})
  ctx.on('agent/pre-step',async({agent},next)=>{if(agent.id==='cold-task'&&ctx.longTasks.state(agent.session).acceptances.length===1)agent.abort();return next()})
 }else{
  owner=await ctx.agents.resume({resumeSessionId:'cold-task',agentOptions:{provider:'fixture',model:'fixture'}})
  const original=JSON.parse(readFileSync(join(root,'seed-result.json'))),job=ctx.longTasks.state(owner.agent.session),review=ctx.sessionProjections.stateOf(owner.agent.session,'claudeCompletionReview')
  assert.equal(job.jobId,original.jobId);assert.equal(job.phase,'paused');assert.equal(job.acceptances.length,1);assert.deepEqual({...review.assessments.T01,reused:false},{...original.assessment,reused:false});assert.deepEqual(job.acceptances[0],original.acceptance);assert.equal(review.tasks.find(t=>!review.assessments[t.id]?.passed).id,'T02');assert.equal(evaluations,0)
 }
 const finished=new Promise((resolve,reject)=>{const timer=setTimeout(()=>{off();reject(Error('Cold test timeout'))},10000);const off=ctx.on('session/event',(s,e)=>{if(s.id===owner.agent.id&&e.type==='turn/end'){clearTimeout(timer);off();resolve(e.data.reason)}})})
 owner.agent.followup(createUserMessage({source:{kind:'user'},content:[{type:'text',text:stage==='seed'?'Create two fixture files':'继续'}]}));const end=await finished;await owner.agent.whenIdle();await ctx.sessions.flush(owner.agent.session)
 const job=ctx.longTasks.state(owner.agent.session),review=ctx.sessionProjections.stateOf(owner.agent.session,'claudeCompletionReview')
 if(stage==='seed'){assert.equal(job.phase,'paused');assert.equal(evaluations,1);writeFileSync(join(root,'seed-result.json'),JSON.stringify({jobId:job.jobId,assessment:review.assessments.T01,acceptance:job.acceptances[0]}))}
 else{const original=JSON.parse(readFileSync(join(root,'seed-result.json')));assert.equal(end.kind,'completed');assert.equal(job.phase,'done');assert.equal(job.jobId,original.jobId);assert.equal(job.acceptances.length,2);assert.deepEqual({...review.assessments.T01,reused:false},{...original.assessment,reused:false});assert.deepEqual(job.acceptances[0],original.acceptance);assert.equal(evaluations,2);assert.equal(n,4)}
 console.log(JSON.stringify({stage,phase:job.phase,jobId:job.jobId,accepted:job.acceptances.length,evaluations,requests:n}))
}finally{await owner?.dispose();await ctx.fiber.dispose()}
