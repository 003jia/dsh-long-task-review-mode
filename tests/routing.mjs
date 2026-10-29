/** Native preset plus real Loader/Agent/tools/JSONL; only model inference is scripted. */
import {formalRequire,nativeExecutorPackages} from './formal-imports.mjs'
import assert from 'node:assert/strict'
import {mkdtempSync,realpathSync,writeFileSync,readFileSync,rmSync,mkdirSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const {Context}=await import(formalRequire.resolve('@deepseek-ai/cordis'))
const {mountRootInclude,readProfilePatches}=await import(formalRequire.resolve('@deepseek-ai/dsh-app-boot'))
const {LlmAdapter,ToolCallId,createUserMessage}=await import(formalRequire.resolve('@deepseek-ai/dsh-llm'))
const {defineTool}=await import(formalRequire.resolve('@deepseek-ai/dsh-tools'))
const load=async name=>{const m=await import(formalRequire.resolve('@deepseek-ai/'+name));return m.default??m}
const root=realpathSync(mkdtempSync(join(tmpdir(),'dsh-route-flow-'))),ctx=new Context(),handles=[],checks=[]
ctx.baseUrl=pathToFileURL(root+'/').href;mkdirSync(join(root,'home'))
ctx.provide('profileContext',{home:join(root,'home'),dir:root,name:'fixture',cwd:root,patchPath:join(root,'cordis.patch.yml'),installAnchor:join(root,'package.json'),startedBundles:[],overlays:[]})
writeFileSync(join(root,'cordis.patch.yml'),'[]');writeFileSync(join(root,'package.json'),'{}')
let active,script,step,requireCalls=0,evaluations=0,errors=[],inspectErrors=false
const candidate='The fixture code is implemented and checked.'
const task={id:'T01',title:'Implement fixture',requirement:'Implement fixture code.',status:'pending',result:'',evidenceIds:[],affectedPaths:['fixture.js'],critical:true}
const doc={format:'claude-loop-plan/v1',revision:1,goal:'Implement fixture code.',scope:'Only fixture.js',tasks:[{id:'T01',title:task.title,requirement:task.requirement,deliverables:['fixture.js'],evidence:['Real execution receipt'],dependsOn:[],affectedPaths:['fixture.js'],critical:true}],exceptions:{recoverable:'Retry current item within budget',revisePlan:'Append reason and affected IDs',blocked:'Pause and explain'},changes:[]}
const stateOf=request=>{for(const message of [...request.messages].reverse())if(message.role==='tool')for(const b of message.content)if(b.type==='text'){try{const v=JSON.parse(b.text);if(v.receipts)return v}catch{}}throw Error('No real loop_tasks result')}
class Model extends LlmAdapter{
 async resolveModel(provider,id){return{provider,id,name:id,inputModalities:['text']}}
 async* stream(request){
  const current=step++,action=await script[current]?.(request)
  assert.ok(action,'Unexpected inference request '+current)
  if(action.text!==undefined){yield{type:'block-start',index:0,blockType:'text'};yield{type:'block-end',index:0,block:{type:'text',text:action.text}};yield{type:'finish',reason:{kind:'stop'}};return}
  const id=ToolCallId('route-'+active.id+'-'+current+'-'+Date.now()),args=JSON.stringify(action.args??{})
  yield{type:'block-start',index:0,blockType:'tool-call'};yield{type:'tool-call-delta',index:0,id,name:action.name,argumentsDelta:args};yield{type:'block-end',index:0,block:{type:'tool-call',id,name:action.name,arguments:args}};yield{type:'finish',reason:{kind:'tool-calls'}}
 }
}
const call=(name,args)=>()=>({name,args})
const codeRoute=()=>({name:'loop_tasks',args:{kind:'coding',reason:'The user requests implementation of a code artifact.'}})
const nonCodeRoute=()=>({name:'loop_tasks',args:{kind:'non_coding',reason:'The user asks a normal greeting, with no code work.'}})
const pending=request=>{assert.equal(ctx.longTasks.state(active.session).route,'pending');assert.ok(request.tools.some(t=>t.name==='loop_tasks'),JSON.stringify({request:request.tools.map(t=>t.name),schemas:ctx.tools.schemas(active).map(t=>t.name),job:ctx.longTasks.state(active.session)}));return nonCodeRoute()}
const run=async(agent,text,actions)=>{
 active=agent;script=actions;step=0;errors=[]
 const done=new Promise((yes,no)=>{const timer=setTimeout(()=>{off();no(Error('Routing Agent timeout'))},10000);const off=ctx.on('session/event',(session,event)=>{if(session.id===agent.id&&event.type==='turn/end'){clearTimeout(timer);off();yes(event.data.reason)}})})
 agent.followup(createUserMessage({source:{kind:'user'},content:[{type:'text',text}]}));const result=await done;await agent.whenIdle();assert.equal(result.kind,inspectErrors?'error':'completed',JSON.stringify(result));if(!inspectErrors)assert.deepEqual(errors,[]);return ctx.longTasks.state(agent.session)
}
try{
 await ctx.plugin(await load('cordis-plugin-loader')).await();ctx.loader.builtins.group=await load('cordis-plugin-group');ctx.loader.builtins.include=await load('cordis-plugin-include')
 const rows=['dsh-llm','dsh-session','dsh-session-projection','dsh-system-prompt','dsh-tools',...nativeExecutorPackages,'dsh-agent','dsh-agent-loop','dsh-typert-registry','dsh-api-remote-access','dsh-api-gateway','dsh-config-editor','dsh-settings','dsh-agent-preset-registry'].map((name,i)=>({id:'core-'+i,name:'@deepseek-ai/'+name,...name==='dsh-agent-loop'?{config:{agents:[]}}:name==='dsh-agent-preset-registry'?{config:{default:'standard'}}:{}}))
 rows.push({id:'persist',name:'@deepseek-ai/dsh-session-persistence-jsonl',config:{root:join(root,'sessions'),compression:'none'}},{id:'fs',name:'@deepseek-ai/dsh-fs-local',config:{cwd:root}},{id:'standard',name:'@deepseek-ai/dsh-agent-preset',config:{id:'standard',plugins:[]}},{id:'long-task',name:process.env.DSH_LONG_TASK_TEST_HOST??resolve(import.meta.dirname,'../lib/index.js'),config:{loop:{maxToolTurns:0}}})
 const bundle=join(root,'node_modules/@fixture/runtime');mkdirSync(bundle,{recursive:true});writeFileSync(join(bundle,'package.json'),JSON.stringify({name:'@fixture/runtime',version:'1.0.0',dsh:{bundle:{patch:'./cordis.patch.yml'}}}));writeFileSync(join(bundle,'cordis.patch.yml'),JSON.stringify([{insert:rows}]))
 writeFileSync(join(root,'package.json'),JSON.stringify({private:true,dependencies:{'@fixture/runtime':'1.0.0'},dsh:{profile:{bundles:['@fixture/runtime']}}}));writeFileSync(join(root,'cordis.yml'),'[]');await mountRootInclude(ctx,join(root,'cordis.yml'),readProfilePatches('dsh',ctx.profileContext));await ctx.loader.await()
 ctx.llm.registerAdapter(['fixture'],new Model())
 const require=ctx.reviewers.require.bind(ctx.reviewers);ctx.reviewers.require=async selection=>{requireCalls++;return require(selection)}
 ctx.layaController.status=()=>({phase:'disabled',error:null})
 ctx.layaController.evaluateCompletion=async()=>{evaluations++;return{rate:.95,confidence:.99,criticalSatisfied:true,gap:'none',dimensions:[],model:'fixture-laya',device:'cpu',elapsedMs:1,json:'{}'}}
 ctx.tools.register(defineTool({name:'write',description:'Fixture write',parameters:{path:{type:'string',required:true},content:{type:'string',required:true}},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:args=>{writeFileSync(join(root,args.path),args.content);return 'written'}}))
 ctx.tools.register(defineTool({name:'fixture_execute',description:'Implement fixture code',parameters:{},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:()=>{writeFileSync(join(root,'fixture.js'),'export const result = 42\n');return 'implemented'}}))
 ctx.tools.register(defineTool({name:'fixture_lookup',description:'Normal lookup',parameters:{},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:()=> 'normal lookup'}))
 ctx.on('session/event',(session,event)=>{if(session.id===active?.id&&event.type==='tool/result'&&event.data.message.isError)errors.push(event.data.message)})
 const create=async id=>{const h=await ctx.agents.create({sessionId:id,meta:{cwd:root,agentPreset:'standard'},agentOptions:{provider:'fixture',model:'fixture'},setup:async child=>{await ctx.agentPresets.mount(child,'standard')}});handles.push(h);await ctx.agentPresets.select(h.agent,'long-task');return h.agent}
 const plain=await create('non-code')
 let job=await run(plain,'Hello, answer normally.',[request=>{assert.equal(ctx.sessionProjections.stateOf(active.session,'claudeCompletionReview').requirement,'Hello, answer normally.');return pending(request)},call('fixture_lookup'),()=>({text:'Hello.'})])
 assert.equal(job.route,'non_coding');assert.equal(job.phase,'done');assert.equal(requireCalls,0);assert.equal(evaluations,0);assert.equal(ctx.sessionProjections.stateOf(plain.session,'claudeCompletionReview').plan,null)
 const previous=job.jobId;job=await run(plain,'Hello again.',[pending,()=>({text:'Hello again.'})]);assert.notEqual(job.jobId,previous);assert.equal(job.phase,'done');assert.equal(ctx.sessionProjections.stateOf(plain.session,'claudeCompletionReview').requirement,'Hello again.')
 checks.push('Native long-task preset routes non-code answers normally across consecutive turns, preserves the exact current human input and never checks an unavailable reviewer')
 await ctx.longTasks.request({op:'saveReviewPolicy',enabled:false});assert.equal((await ctx.longTasks.request({op:'settings'})).settings.independentReview,false);assert.match(readFileSync(join(root,'cordis.patch.yml'),'utf8'),/independentReview/)
 const self=await create('self-code')
 const selfBefore=evaluations
 job=await run(self,'Implement fixture code without independent acceptance.',[codeRoute,async()=>{await ctx.longTasks.request({op:'saveReviewPolicy',enabled:true});return{name:'loop_tasks',args:{tasks:[task]}}},call('fixture_execute'),call('loop_tasks',{taskUpdate:{id:'T01',status:'completed',result:'Implemented fixture.js',evidenceIds:[]}}),call('loop_tasks',{selfReview:{stage:'tasks',taskId:'T01',rate:95,reason:'Read the implemented code and checked its result.',criticalSatisfied:true}}),call('loop_tasks',{selfReview:{stage:'overall',rate:95,reason:'The original requested code is delivered.',criticalSatisfied:true,candidate}}),()=>({text:candidate})])
 assert.equal(job.route,'coding');assert.equal(job.reviewEnabled,false);assert.equal(job.phase,'done');assert.equal(evaluations,selfBefore);assert.equal(requireCalls,0);assert.equal(job.acceptances.length,0)
 let review=ctx.sessionProjections.stateOf(self.session,'claudeCompletionReview');assert.equal(review.plan,null);assert.equal(review.reviews.at(-1).reviewer,'primary')
 checks.push('Code with acceptance disabled uses an ordinary plan and explicit item/overall primary self-review without a fixed plan.md or Laya/Jev calls; changing the global switch cannot change the active job')
 ctx.layaController.status=()=>({phase:'ready',error:null})
 const independent=await create('review-code')
 job=await run(independent,'Implement fixture code with independent acceptance.',[codeRoute,call('write',{path:'plan.md',content:'```json\n'+JSON.stringify(doc)+'\n```'}),call('loop_tasks',{planPath:'plan.md'}),call('fixture_execute'),call('loop_tasks',{}),request=>{const view=stateOf(request),receipt=view.receipts.filter(r=>r.text.startsWith('fixture_execute: OK')).at(-1);return{name:'loop_tasks',args:{taskUpdate:{id:'T01',status:'completed',result:'Implemented fixture.js',evidenceIds:[receipt.id]}}}},()=>({text:candidate})])
 assert.equal(job.phase,'done');assert.equal(job.reviewEnabled,true);assert.equal(requireCalls,1);assert.equal(evaluations,2);assert.equal(job.acceptances.length,1)
 review=ctx.sessionProjections.stateOf(independent.session,'claudeCompletionReview');assert.equal(review.requirement,'Implement fixture code with independent acceptance.');assert.ok(review.plan);assert.equal(review.reviews.at(-1).reviewer,'laya')
 checks.push('Code with acceptance enabled imports the fixed plan.md, uses real tool receipts and receives one item plus one overall independent assessment')
 // The code route must block when its saved reviewer is unavailable, without changing to self review.
 ctx.layaController.status=()=>({phase:'disabled',error:null});const blocked=await create('blocked-code');inspectErrors=true
 job=await run(blocked,'Implement code while the reviewer is unavailable.',[codeRoute,()=>({text:'The reviewer is unavailable; this job is blocked.'})]);inspectErrors=false
 assert.equal(job.phase,'blocked');assert.equal(job.route,'coding');assert.equal(job.reviewEnabled,true);assert.equal(errors.length,1);assert.equal(evaluations,2)
 checks.push('Unavailable independent acceptance blocks only the enabled code branch and cannot silently fall back to primary review')
 // Legacy plugin records have neither route nor switch; they keep independent code acceptance.
 const legacy={...job};delete legacy.route;delete legacy.reviewEnabled;delete legacy.inputTurn;delete legacy.routingReason;ctx.longTasks.update(blocked.session,legacy)
 assert.equal(ctx.longTasks.state(blocked.session).route,'coding');assert.equal(ctx.longTasks.state(blocked.session).reviewEnabled,true)
 await ctx.sessions.flush(independent.session);const disk=await ctx.sessionPersistence.open(independent.id,'read');const events=(await disk.read()).events;await disk.close();assert.ok(events.some(e=>e.type==='plugin:long-task/state'&&e.data.route==='coding'&&e.data.reviewEnabled===true))
 checks.push('Route, reason and operator-selected acceptance switch persist in the real JSONL journal; legacy jobs retain independent code acceptance')
 writeFileSync(resolve(import.meta.dirname,'../test-results/long-task-flow-routing-20261028.json'),JSON.stringify({realLoader:true,realAgent:true,scriptedInference:true,checks,requireCalls,evaluations},null,2));console.log(JSON.stringify({checks,requireCalls,evaluations}))
}finally{for(const h of handles.reverse())await h.dispose();await ctx.fiber.dispose();rmSync(root,{recursive:true,force:true})}
