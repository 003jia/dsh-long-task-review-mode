/** Installed rc.3 Loader, sessions, projections, gateway, tools, filesystem and persistence. Only inference is scripted. */
import {formalRequire} from './formal-imports.mjs'
import assert from 'node:assert/strict'
import {checkReviewers} from './reviewer-checks.mjs'
import {mkdtempSync,realpathSync,writeFileSync,readFileSync,rmSync,mkdirSync,symlinkSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const {defineTool}=await import(formalRequire.resolve('@deepseek-ai/dsh-tools'))
const {Context}=await import(formalRequire.resolve('@deepseek-ai/cordis'))
const {mountRootInclude,readProfilePatches}=await import(formalRequire.resolve('@deepseek-ai/dsh-app-boot'))
const {Peer}=await import(formalRequire.resolve('@deepseek-ai/dsh-client-connection'))
const {LlmAdapter,ToolCallId,createUserMessage}=await import(formalRequire.resolve('@deepseek-ai/dsh-llm'))
const load=async name=>{const m=await import(formalRequire.resolve('@deepseek-ai/'+name));return m.default??m.FileSettingsProvider??m}
const root=realpathSync(mkdtempSync(join(tmpdir(),'dsh-long-task-'))),ctx=new Context();ctx.baseUrl=pathToFileURL(root+'/').href
mkdirSync(join(root,'home'));ctx.provide('profileContext',{home:join(root,'home'),dir:root,name:'fixture',patchPath:join(root,'cordis.patch.yml'),installAnchor:join(root,'package.json'),cwd:root,startedBundles:[],overlays:[]});
const checks=[],handles=[];let sequence=0,evaluations=0,rate=.95,active,afterEvaluation
const realAgentRequests=[]
class Model extends LlmAdapter{async resolveModel(provider,id){return{provider,id,name:id,inputModalities:['text']}}async*stream(request){realAgentRequests.push(request);assert.ok(!request.tools?.some(t=>['loop_tasks','laya_tasks'].includes(t.name)));yield {type:'block-start',index:0,blockType:'text'};yield {type:'block-end',index:0,block:{type:'text',text:'Hello from normal mode.'}};yield {type:'finish',reason:{kind:'stop'}}}}
class Summary extends LlmAdapter{async resolveModel(provider,id){return{provider,id,name:id,inputModalities:['text']}}async*stream(){yield {type:'block-start',index:0,blockType:'text'};yield {type:'block-end',index:0,block:{type:'text',text:'Seven passed; continue T08 only.'}};yield {type:'finish',reason:{kind:'stop'}}}}
const score=()=>({rate,confidence:.99,criticalSatisfied:true,gap:rate>.7?'none':'partial',dimensions:[],model:'scripted',device:null,elapsedMs:1,json:'{}'})
const tools=async(name,args,agent=active)=>{
 const turn=ctx.sessionProjections.stateOf(agent.session,'claudeCompletionReview').turn,callId=ToolCallId('fixture-'+ ++sequence)
 agent.session.append('step/start',{turn,step:0})
 agent.session.append('assistant/message',{turn,step:0,interrupted:false,stream:[],message:{role:'assistant',source:{kind:'model',provider:'fixture',model:'no-network'},content:[{type:'tool-call',id:callId,name,arguments:JSON.stringify(args)}]}},{surfaceOp:'append'})
 agent.session.append('tool/call',{turn,step:0,callId,name,arguments:JSON.stringify(args)})
 const r=await ctx.tools.execute({name,arguments:args,agent,callId,signal:AbortSignal.timeout(5000)})
 const event=agent.session.append('tool/result',{turn,step:0,message:{id:'msg-'+sequence,role:'tool',source:{kind:'tool',callId},toolCallId:callId,content:r.content,isError:r.isError},...r.error?{error:r.error}:{}},{surfaceOp:'append'})
 agent.session.append('step/end',{turn,step:0});return{result:r,event,text:r.content.filter(c=>c.type==='text').map(c=>c.text).join('\n')}
}
const run=async args=>{if(ctx.longTasks.state(active.session).route==='pending'&&args.kind===undefined){const routed=await tools('loop_tasks',{kind:'coding',reason:'Fixture code implementation or code analysis request'});assert.equal(routed.result.isError,false,routed.text)}const r=await tools('loop_tasks',{view:'full',...args});assert.equal(r.result.isError,false,r.text);return JSON.parse(r.text)}
const deny=async args=>{const r=await tools('loop_tasks',{view:'full',...args});assert.equal(r.result.isError,true,r.text);return r.text}
const owner=async id=>{const h=await ctx.agents.create({sessionId:id,meta:{cwd:root},agentOptions:{provider:'fixture',model:'no-network'}});handles.push(h);active=h.agent;void active.runMaintenance(s=>new Promise(r=>s.addEventListener('abort',r,{once:true})));return active}
const user=(agent,turn,text)=>{agent.session.append('turn/start',{turn});agent.session.append('user/message',createUserMessage({source:{kind:'user'},content:[{type:'text',text}]}),{surfaceOp:'append'})}
const plan=(count=8)=>({format:'claude-loop-plan/v1',revision:1,goal:'Create and verify fixture artifacts',scope:'Only fixture files',tasks:Array.from({length:count},(_,i)=>({id:'T'+String(i+1).padStart(2,'0'),title:'Artifact '+(i+1),requirement:'Deliver the specified fixture file.',deliverables:['Verified file'],evidence:['Real execution receipt'],dependsOn:i?['T'+String(i).padStart(2,'0')]:[],affectedPaths:['artifact'+(i+1)+'.txt'],critical:true})),exceptions:{recoverable:'Repair current item',revisePlan:'Record reason and affected IDs',blocked:'Pause with cause'},changes:[]})
try{
 await ctx.plugin(await load('cordis-plugin-loader')).await();ctx.loader.builtins.group=await load('cordis-plugin-group');ctx.loader.builtins.include=await load('cordis-plugin-include')
 const rows=['dsh-llm','dsh-session','dsh-session-projection','dsh-system-prompt','dsh-tools','dsh-agent','dsh-agent-loop','dsh-typert-registry','dsh-api-remote-access','dsh-api-gateway'].map((name,i)=>({id:'core-'+i,name:'@deepseek-ai/'+name,...name==='dsh-agent-loop'?{config:{agents:[]}}:{}}))
 rows.push({id:'credentials',name:'@deepseek-ai/dsh-credentials-local',config:{dshHome:join(root,'home'),watch:false}},{id:'editor',name:'@deepseek-ai/dsh-config-editor'},{id:'settings',name:'@deepseek-ai/dsh-settings'},
 {id:'persistence',name:'@deepseek-ai/dsh-session-persistence-jsonl',config:{root:join(root,'sessions'),compression:'none'}},
 {id:'fs',name:'@deepseek-ai/dsh-fs-local',config:{cwd:root}}, {id:'meter',name:'@deepseek-ai/dsh-token-meter'},
 {id:'compaction',name:'@deepseek-ai/dsh-compaction-basic',config:{auto:false,summarizationProvider:'summary',summarizationModel:'no-network',maxTokens:512}},
 {id:'long-task',name:resolve(import.meta.dirname,'../lib/index.js'),config:{loop:{maxToolTurns:0}}})
 const bundle=join(root,'node_modules/@fixture/runtime');mkdirSync(bundle,{recursive:true});writeFileSync(join(bundle,'package.json'),JSON.stringify({name:'@fixture/runtime',version:'1.0.0',dsh:{bundle:{patch:'./cordis.patch.yml'}}}));writeFileSync(join(bundle,'cordis.patch.yml'),JSON.stringify([{insert:rows}]))
 writeFileSync(join(root,'package.json'),JSON.stringify({private:true,dependencies:{'@fixture/runtime':'1.0.0'},dsh:{profile:{bundles:['@fixture/runtime']}}}));writeFileSync(join(root,'cordis.patch.yml'),'[]');writeFileSync(join(root,'cordis.yml'),'[]');await mountRootInclude(ctx,join(root,'cordis.yml'),readProfilePatches('dsh',ctx.profileContext));await ctx.loader.await()
 await new Promise((done,fail)=>{const timer=setTimeout(()=>fail(Error('Long task services not ready')),5000);ctx.inject(['longTasks','claudeCompletionReviews'],()=>{clearTimeout(timer);done()})})
 if(!ctx.get('longTasks')||!ctx.get('claudeCompletionReviews'))throw Error(JSON.stringify([...ctx.loader.entries()].map(e=>({id:e.options.id,state:e.fiber?.state,error:String(e.fiber?.error??'')}))))
 ctx.llm.registerAdapter(['fixture'],new Model());ctx.llm.registerAdapter(['summary'],new Summary())
 const internal=ctx.layaController
 internal.status=()=>({settings:{enabled:false,launcher:'unused',device:'cpu',models:['multilingual'],preload:false,offline:true,timeoutMs:600000},phase:'ready',error:null,actualDevice:'cpu',loadedModels:[],version:null,statusJson:null,tools:[],completionReviews:[]})
 internal.evaluateCompletion=async()=>{evaluations++;await afterEvaluation?.();afterEvaluation=undefined;return score()}
 const service=ctx.longTasks
 const saved=await service.request({op:'save',threshold:70,noProgressLimit:3,maxToolCalls:2200,maxAssessments:200,maxMinutes:240});assert.equal(saved.settings.maxToolCalls,2200);assert.ok(readFileSync(join(root,'cordis.patch.yml'),'utf8').includes('2200'));checks.push('Unified settings save through actual configEditor, persist and read back');
 const a=await owner('durable-a');user(a,0,'Create eight fixture files')
 assert.equal(ctx.claudeCompletionReviews.instructionFor(a,[]),null);await deny({planPath:'plan.md'});assert.equal(evaluations,0)
 const peer=new Peer(ctx,{principal:{kind:'owner'}})
 const remote=await ctx.typertGateway.invoke({peer,namespace:'longTasks',method:'request',args:{request:{op:'long',sessionId:a.id}}});assert.equal(remote.job.phase,'active')
 await assert.rejects(()=>ctx.typertGateway.invoke({peer,namespace:'longTasks',method:'request',args:{request:{op:'long',sessionId:a.id,extra:true}}}))
 checks.push('Real Loader and strict Gateway mode dispatch; ordinary chat skips routing and grading')
 // User enabled mode after creating the session, before entering the long-task requirement.
 user(a,1,'Create eight fixture files')
 const doc=plan();writeFileSync(join(root,'plan.md'),'```json\n'+JSON.stringify(doc)+'\n```\n')
 await run({planPath:'plan.md'})
 ctx.tools.register(defineTool({name:'fixture_execute',description:'Create a fixture',parameters:{i:{type:'integer',required:true}},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:args=>{writeFileSync(join(root,'artifact'+args.i+'.txt'),'verified-'+args.i);return 'Verified artifact '+args.i}}))
 for(let i=1;i<=7;i++){const receipt=await tools('fixture_execute',{i});await run({taskUpdate:{id:'T'+String(i).padStart(2,'0'),status:'completed',result:'Delivered artifact '+i,evidenceIds:[String(receipt.event.seq)]}})}
 let before=await run({}),job=service.state(a.session);assert.equal(job.acceptances.length,7);const jobId=job.jobId;const originals=JSON.stringify(before.tasks.slice(0,7))
 await deny({kind:'non_coding',reason:'Attempt to skip the remaining code task'});await service.request({op:'saveReviewPolicy',enabled:false});assert.equal(service.state(a.session).reviewEnabled,true);await deny({selfReview:{stage:'tasks',taskId:'T08',rate:100,reason:'Attempt self-review bypass',criticalSatisfied:true}});await service.request({op:'saveReviewPolicy',enabled:true})
 const corrupt=structuredClone(before.tasks);corrupt[0].result='see report';await deny({tasks:corrupt});assert.equal(JSON.stringify((await run({})).tasks.slice(0,7)),originals)
 await deny({revalidateTaskIds:['T01'],repairAnalysis:'Reopen unchanged work'})
 const changedType=structuredClone(before.tasks);changedType[0].taskType='opinion';await deny({tasks:changedType})
 assert.equal(JSON.stringify((await run({})).tasks.slice(0,7)),originals)
 checks.push('Seven accepted records are immutable; full-list rewrites, unchanged revalidation and grading-type changes are rejected atomically')
 const surface=a.session.surface;await ctx.compaction.compactRegion(surface.nodes[0],surface.nodes.at(-1),a,AbortSignal.timeout(5000))
 user(a,2,'继续');let resumed=await run({});assert.equal(resumed.currentTaskId,'T08');assert.equal(service.state(a.session).jobId,jobId);assert.equal(JSON.stringify(resumed.tasks.slice(0,7)),originals);assert.equal(evaluations,7)
 checks.push('Actual compaction plus new turn continue T08 with same jobId and no regrading of T01–T07')
 const b=await owner('ordinary-b');user(b,0,'Hello');assert.equal(service.state(b.session).mode,'ordinary');assert.equal(ctx.claudeCompletionReviews.instructionFor(b,[]),null);active=a
 await service.request({op:'ordinary',sessionId:a.id});assert.equal(service.state(a.session).phase,'paused');assert.equal(ctx.claudeCompletionReviews.instructionFor(a,[]),null)
 await service.request({op:'resume',sessionId:a.id});assert.equal(service.state(a.session).jobId,jobId);assert.equal((await run({})).currentTaskId,'T08')
 checks.push('Per-session mode isolation and explicit pause/resume preserve the job')
 writeFileSync(join(root,'artifact2.txt'),'manually changed bytes')
 const receipt=await tools('fixture_execute',{i:8});await deny({taskUpdate:{id:'T08',status:'completed',result:'Delivered artifact 8',evidenceIds:[String(receipt.event.seq)]}})
 assert.equal(service.state(a.session).acceptances.length,7);assert.equal(service.state(a.session).changes[0].taskId,'T02');assert.equal(evaluations,7)
 assert.equal(ctx.sessionProjections.stateOf(a.session,'claudeCompletionReview').assessments.T02.passed,true)
 await run({revalidateTaskIds:['T02'],repairAnalysis:'Shared artifact changed; verify exact final bytes for task 2.'})
 const r2=await tools('fixture_execute',{i:2});await run({taskUpdate:{id:'T02',status:'completed',result:'Reverified final artifact 2',evidenceIds:[String(r2.event.seq)]}})
 assert.equal(service.state(a.session).acceptances.length,8);assert.equal(service.state(a.session).changes.length,0);assert.equal(evaluations,8)
 await run({taskUpdate:{id:'T08',status:'completed',result:'Delivered artifact 8',evidenceIds:[String(receipt.event.seq)]}})
 assert.equal(evaluations,9)
 checks.push('Manual byte modification blocks a new acceptance, retains history and triggers only explicit T02 revalidation')
 a.session.append('assistant/message',{turn:2,step:0,interrupted:false,stream:[],message:{role:'assistant',source:{kind:'model',provider:'fixture',model:'no-network'},content:[{type:'text',text:'All eight artifacts were delivered and verified.'}]}},{surfaceOp:'append'})
 rate=.65;assert.equal(await ctx.claudeCompletionReviews.assess(a,2,AbortSignal.timeout(5000)),true)
 await deny({overallRepair:{affectedTaskIds:['T01','T02','T03','T04','T05','T06','T07','T08'],analysis:'Reword all passed work'}})
 assert.equal(Object.values(ctx.sessionProjections.stateOf(a.session,'claudeCompletionReview').assessments).filter(t=>t.passed).length,8)
 await run({overallRepair:{affectedTaskIds:[],analysis:'Improve the final delivery summary while preserving every accepted item.',summaryOnly:true}})
 rate=.95;a.session.append('assistant/message',{turn:2,step:0,interrupted:false,stream:[],message:{role:'assistant',source:{kind:'model',provider:'fixture',model:'no-network'},content:[{type:'text',text:'All eight final fixture artifacts are delivered and independently verified.'}]}},{surfaceOp:'append'})
 checks.push('An aggregate summary failure cannot reopen unchanged passed work without new defect evidence')
 assert.equal(await ctx.claudeCompletionReviews.assess(a,2,AbortSignal.timeout(5000)),false);assert.equal(service.state(a.session).phase,'done');assert.equal(evaluations,11)
 checks.push('Final acceptance uses current artifact bytes and completes the durable job')
 // Bounded repair: wording changes cannot refresh the execution progress key.
 const c=await owner('failed-c');await service.request({op:'long',sessionId:c.id});user(c,0,'Create one fixture');writeFileSync(join(root,'plan.md'),'```json\n'+JSON.stringify(plan(1))+'\n```\n');await run({planPath:'plan.md'});rate=.4
 const cReceipt=await tools('fixture_execute',{i:1});await run({taskUpdate:{id:'T01',status:'completed',result:'First failed result',evidenceIds:[String(cReceipt.event.seq)]}});const failedEvaluations=evaluations
 await deny({taskUpdate:{id:'T01',status:'completed',result:'Reworded failed result',evidenceIds:[String(cReceipt.event.seq)]}})
 assert.equal(evaluations,failedEvaluations);assert.equal(service.state(c.session).noProgress,2);assert.equal(service.state(c.session).phase,'active')
 await deny({taskUpdate:{id:'T01',status:'completed',result:'Third rewording',evidenceIds:[String(cReceipt.event.seq)]}})
 assert.equal(service.state(c.session).phase,'blocked');assert.equal(service.state(c.session).noProgress,3);assert.equal(service.state(c.session).acceptances.length,0)
 checks.push('Three no-progress attempts pause; rewording cannot reset the budget or repeat Laya grading')
 // Real bounded filesystem seam, including non-text artifacts, directories, links and size failures.
 rate=.95;const item={id:'X',fingerprint:'x',result:'artifact',evidenceIds:[],taskType:'execution',affectedPaths:['artifact1.txt']}
 const snapshot=await service.prepare(c,item,AbortSignal.timeout(5000));assert.equal(snapshot.files[0].type,'file')
 mkdirSync(join(root,'directory'));writeFileSync(join(root,'directory/a.bin'),Buffer.from([0,255,13,10]));item.affectedPaths=['directory'];const directory=await service.prepare(c,item,AbortSignal.timeout(5000));assert.equal(directory.files.length,2)
 writeFileSync(join(root,'directory/b.bin'),Buffer.from([3]));const directory2=await service.prepare(c,item,AbortSignal.timeout(5000));assert.equal(directory2.files.length,3);assert.notEqual(directory.files.find(x=>x.type==='directory').hash,directory2.files.find(x=>x.type==='directory').hash)
 symlinkSync('/private/tmp',join(root,'outside-link'));item.affectedPaths=['outside-link'];await assert.rejects(()=>service.prepare(c,item,AbortSignal.timeout(5000)))
 item.affectedPaths=['missing.txt'];await assert.rejects(()=>service.prepare(c,item,AbortSignal.timeout(5000)))
 writeFileSync(join(root,'large.bin'),Buffer.alloc(17*1024*1024));item.affectedPaths=['large.bin'];await assert.rejects(()=>service.prepare(c,item,AbortSignal.timeout(5000)))
 checks.push('Binary bytes and directory additions are tracked; missing files, out-of-root links and oversized artifacts fail closed')
 // Pure analysis uses actual content, not fabricated execution receipts.
 const d=await owner('opinion-d');await service.request({op:'long',sessionId:d.id});user(d,0,'Analyze a reasoning question');const opinion=plan(1);opinion.tasks[0].taskType='opinion';opinion.tasks[0].affectedPaths=[];writeFileSync(join(root,'plan.md'),'```json\n'+JSON.stringify(opinion)+'\n```\n');await run({planPath:'plan.md'});await run({taskUpdate:{id:'T01',status:'completed',result:'A justified analysis with concrete examples.',evidenceIds:[]}});assert.equal(service.state(d.session).acceptances.length,1)
 checks.push('Opinion tasks accept content without invented execution receipts')
 const e=await owner('unavailable-e');await service.request({op:'long',sessionId:e.id});user(e,0,'Create one fixture');writeFileSync(join(root,'plan.md'),'```json\n'+JSON.stringify(plan(1))+'\n```\n');await run({planPath:'plan.md'});const eReceipt=await tools('fixture_execute',{i:1});const evaluate=internal.evaluateCompletion;internal.evaluateCompletion=async()=>{throw Error('Fixture Laya disconnected')}
 await deny({taskUpdate:{id:'T01',status:'completed',result:'Delivered 1',evidenceIds:[String(eReceipt.event.seq)]}});assert.equal(service.state(e.session).phase,'blocked');assert.equal(service.state(e.session).acceptances.length,0);internal.evaluateCompletion=evaluate
 checks.push('Unavailable Laya blocks explicitly without zero scores or primary-model fallback')
 // A scoring race cannot publish approval against modified bytes.
 const f=await owner('racing-f');await service.request({op:'long',sessionId:f.id});user(f,0,'Create one fixture');writeFileSync(join(root,'plan.md'),'```json\n'+JSON.stringify(plan(1))+'\n```\n');await run({planPath:'plan.md'});const fReceipt=await tools('fixture_execute',{i:1});afterEvaluation=()=>writeFileSync(join(root,'artifact1.txt'),'changed during grading')
 await deny({taskUpdate:{id:'T01',status:'completed',result:'Delivered 1',evidenceIds:[String(fReceipt.event.seq)]}});assert.equal(service.state(f.session).acceptances.length,0)
 checks.push('Artifact changes during Laya await prevent publishing a stale acceptance')
 active=a
 const finished=agent=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{off();reject(Error('Agent timed out'))},8000);const off=ctx.on('session/event',(s,event)=>{if(s.id===agent.id&&event.type==='turn/end'){clearTimeout(timer);off();resolve(event.data.reason)}})})
 const normal=await ctx.agents.create({sessionId:'live-normal',meta:{cwd:root},agentOptions:{provider:'fixture',model:'no-network'}});handles.push(normal);const normalDone=finished(normal.agent);normal.agent.followup(createUserMessage({source:{kind:'user'},content:[{type:'text',text:'Hello'}]}));await normalDone;await normal.agent.whenIdle();assert.equal(realAgentRequests.length,1)
 assert.ok(!realAgentRequests[0].messages.some(m=>m.source?.kind==='laya-task-protocol'))
 checks.push('Actual ordinary Agent uses one model request, with neither long-task schemas nor routing protocol')
 ctx.tools.register(defineTool({name:'write',description:'Write the isolated plan',parameters:{path:{type:'string',required:true},content:{type:'string',required:true}},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:args=>{assert.equal(args.path,'plan.md');writeFileSync(join(root,args.path),args.content);return 'Saved plan.md'}}))
 let liveStep=0;const livePlan=plan(2)
 class Live extends LlmAdapter{
  async resolveModel(provider,id){return{provider,id,name:id,inputModalities:['text']}}
  async*stream(request){
   const n=++liveStep;let name,args
   if(n===1){name='write';args={path:'plan.md',content:'```json\n'+JSON.stringify(livePlan)+'\n```\n'}}
   else if(n===2){name='loop_tasks';args={kind:'coding',reason:'Implement the requested fixture code artifacts',planPath:'plan.md'}}
   else if(n===3||n===6){name='fixture_execute';args={i:n===3?1:2}}
   else if(n===4||n===7){name='loop_tasks';args={}}
   else if(n===5||n===8){
    const response=[...request.messages].reverse().flatMap(m=>m.role==='tool'?m.content:[]).filter(b=>b.type==='text').map(b=>{try{return JSON.parse(b.text)}catch{return null}}).find(v=>v?.receipts)
    const receipt=response.receipts.filter(r=>r.text.startsWith('fixture_execute: OK')).at(-1);name='loop_tasks';args={taskUpdate:{id:n===5?'T01':'T02',status:'completed',result:'Verified final artifact '+(n===5?1:2),evidenceIds:[receipt.id]}}
   }else if(n===9){yield {type:'block-start',index:0,blockType:'text'};yield {type:'block-end',index:0,block:{type:'text',text:'Both fixture files are delivered and verified.'}};yield {type:'finish',reason:{kind:'stop'}};return}
   else throw Error('Unexpected live request '+n)
   const id=ToolCallId('live-'+n);yield {type:'block-start',index:0,blockType:'tool-call'};yield {type:'tool-call-delta',index:0,id,name,argumentsDelta:JSON.stringify(args)};yield {type:'block-end',index:0,block:{type:'tool-call',id,name,arguments:JSON.stringify(args)}};yield {type:'finish',reason:{kind:'tool-calls'}}
  }
 }
 ctx.llm.registerAdapter(['live'],new Live())
 const liveToolErrors=[];ctx.on('session/event',(s,e)=>{if(s.id==='live-long'&&e.type==='tool/result'&&e.data.message.isError)liveToolErrors.push(e.data.message)})
 const live=await ctx.agents.create({sessionId:'live-long',meta:{cwd:root},agentOptions:{provider:'live',model:'scripted'}});handles.push(live);await service.request({op:'long',sessionId:live.agent.id});await service.request({op:'pause',sessionId:live.agent.id});const liveDone=finished(live.agent);live.agent.followup(createUserMessage({source:{kind:'user'},content:[{type:'text',text:'继续'}]}));const liveEnd=await liveDone;await live.agent.whenIdle();assert.equal(liveEnd.kind,'completed');assert.equal(liveStep,9);assert.deepEqual(liveToolErrors,[]);assert.equal(service.state(live.agent.session).phase,'done');assert.equal(service.state(live.agent.session).acceptances.length,2)
 checks.push('Actual long-task Agent resumes the same paused job from an explicit user continue message and executes plan import, two item grades and final acceptance')
 await ctx.sessionPersistence.flush();const disk=await ctx.sessionPersistence.open(live.agent.id,'read');const restored=(await disk.read()).events;await disk.close();assert.ok(restored.some(e=>e.type==='plugin:long-task/state'&&e.data.jobId===service.state(live.agent.session).jobId));checks.push('The actual JSONL persistence provider flushes and reads back jobId and immutable acceptance records')
 const reviewerChecks=await checkReviewers({ctx,root,service,peer,owner,user,run,plan,local:d});checks.push(...reviewerChecks.checks)
 writeFileSync(resolve(import.meta.dirname,'../test-results/long-task-reviewers-20261027.json'),JSON.stringify(reviewerChecks,null,2))
 active=a
 const entry=[...ctx.loader.entries()].find(e=>e.options.id==='long-task');await entry.fiber.dispose();assert.equal(ctx.get('longTasks'),undefined);assert.equal(ctx.get('claudeCompletionReviews'),undefined)
 await ctx.plugin(await import(pathToFileURL(resolve(import.meta.dirname,'../lib/index.js')).href),{loop:{maxToolTurns:0}}).await();assert.ok(ctx.longTasks);assert.equal(ctx.longTasks.state(a.session).jobId,jobId);assert.equal(ctx.longTasks.state(a.session).acceptances.length,10-1)
 checks.push('Dispose/reload reconstructs durable job and acceptance history without duplicate services')
 writeFileSync(resolve(import.meta.dirname,'../test-results/long-task-runtime-20261026.json'),JSON.stringify({checks,evaluations,scriptedInference:true,realLoader:true},null,2))
 console.log(JSON.stringify({ok:true,checks,evaluations},null,2))
}finally{for(const h of handles.reverse())await h.dispose();await ctx.fiber.dispose();rmSync(root,{recursive:true,force:true})}
