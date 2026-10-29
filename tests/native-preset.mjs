/** Released Loader/preset registry and actual Agent, with only inference scripted. */
import {formalRequire,nativeExecutorPackages} from './formal-imports.mjs'
import assert from 'node:assert/strict'
import {mkdtempSync,realpathSync,writeFileSync,rmSync,mkdirSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const {Context}=await import(formalRequire.resolve('@deepseek-ai/cordis'))
const {LlmAdapter,createUserMessage}=await import(formalRequire.resolve('@deepseek-ai/dsh-llm'))
const {defineTool}=await import(formalRequire.resolve('@deepseek-ai/dsh-tools'))
const root=realpathSync(mkdtempSync(join(tmpdir(),'dsh-native-long-'))),ctx=new Context(),handles=[],checks=[]
const load=async name=>{const m=await import(formalRequire.resolve('@deepseek-ai/'+name));return m.default??m}
ctx.baseUrl=pathToFileURL(root+'/').href
mkdirSync(join(root,'home'));ctx.provide('profileContext',{home:join(root,'home'),dir:root,name:'fixture',cwd:root,patchPath:join(root,'cordis.patch.yml'),installAnchor:join(root,'package.json'),startedBundles:[],overlays:[]});writeFileSync(join(root,'cordis.patch.yml'),'[]');writeFileSync(join(root,'package.json'),'{}')
let observedNative=false
class Model extends LlmAdapter{
 async resolveModel(provider,id){return{provider,id,name:id,inputModalities:['text']}}
 async* stream(request){
  if(nativeExecutorPackages.length){assert.ok(request.tools.some(t=>t.name==='mcp__fixture__visible'));assert.ok(!request.tools.some(t=>t.name==='mcp__fixture__hidden'))}
  const long=request.messages.some(m=>m.source?.kind==='laya-task-protocol')||request.tools.some(t=>t.name==='loop_tasks')
  if(active.id==='chosen'){
   assert.equal(long,true);assert.ok(request.tools.some(t=>t.name==='preset_probe'))
   assert.equal(ctx.longTasks.state(active.session).mode,'long');assert.equal(ctx.longTasks.state(active.session).phase,'active')
   observedNative=true
   ctx.longTasks.pause(active,'Fixture pause after verifying native selection')
  }else assert.equal(long,false)
  yield{type:'block-start',index:0,blockType:'text'};yield{type:'block-end',index:0,block:{type:'text',text:'Fixture observed the selected mode.'}};yield{type:'finish',reason:{kind:'stop'}}
 }
}
let active
try{
 await ctx.plugin(await load('cordis-plugin-loader')).await();ctx.loader.builtins.group=await load('cordis-plugin-group');ctx.loader.builtins.include=await load('cordis-plugin-include')
 const probe=join(root,'preset-probe.mjs');writeFileSync(probe,`import {defineTool} from ${JSON.stringify(formalRequire.resolve('@deepseek-ai/dsh-tools'))};export const inject=['tools'];export function apply(ctx){ctx.effect(()=>ctx.tools.register(defineTool({name:'preset_probe',description:'Standard capability retained by long-task',parameters:{},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:()=> 'probe'})),'probe')}`)
 const rows=['dsh-llm','dsh-session','dsh-session-projection','dsh-system-prompt','dsh-tools',...nativeExecutorPackages,'dsh-agent','dsh-agent-loop','dsh-typert-registry','dsh-api-remote-access','dsh-api-gateway','dsh-config-editor','dsh-settings','dsh-agent-preset-registry'].map((name,i)=>({id:'core-'+i,name:'@deepseek-ai/'+name,...name==='dsh-agent-loop'?{config:{agents:[]}}:name==='dsh-agent-preset-registry'?{config:{default:'standard'}}:{}}))
 rows.push({id:'standard',name:'@deepseek-ai/dsh-agent-preset',config:{id:'standard',order:1,plugins:[{id:'probe',name:probe}]}},{id:'long-task',name:process.env.DSH_LONG_TASK_TEST_HOST??resolve(import.meta.dirname,'../lib/index.js'),config:{loop:{maxToolTurns:0}}})
 writeFileSync(join(root,'cordis.yml'),JSON.stringify(rows));await ctx.loader.create({name:'cordis:include',config:{path:'./cordis.yml'}});await ctx.loader.await()
 const roster=await ctx.agentPresets.list();assert.deepEqual(roster.map(r=>r.id),['standard','long-task']);assert.ok(!roster[1].broken,roster[1].broken);assert.equal(ctx.agentPresets.defaultId,'standard')
 const base=await ctx.agentPresets.readDocument('standard'),long=await ctx.agentPresets.readDocument('long-task');assert.equal(base.content,long.content)
 checks.push('Native roster adds exactly one long-task choice, preserves Standard composition and does not change the default')
 ctx.layaController.status=()=>({phase:'ready',error:null});ctx.llm.registerAdapter(['fixture'],new Model())
 for(const visible of [true,false])ctx.tools.register(defineTool({name:'mcp__fixture__'+(visible?'visible':'hidden'),description:'Provider admission fixture',parameters:{},output:{schema:{type:'string'},render:(_a,v)=>[{type:'text',text:v}]},execute:()=> 'fixture'}),{when:()=>visible})
 const create=async(id,model)=>{const h=await ctx.agents.create({sessionId:id,meta:{cwd:root,agentPreset:'standard'},agentOptions:{provider:'fixture',model},setup:async child=>{await ctx.agentPresets.mount(child,'standard')}});handles.push(h);return h.agent}
 const run=async agent=>{active=agent;const done=new Promise((yes,no)=>{const timer=setTimeout(()=>{off();no(Error('Native preset Agent timeout'))},5000);const off=ctx.on('session/event',(s,e)=>{if(s.id===agent.id&&e.type==='turn/end'){clearTimeout(timer);off();yes(e.data.reason)}})});agent.followup(createUserMessage({source:{kind:'user'},content:[{type:'text',text:'Inspect the active execution mode.'}]}));const reason=await done;await agent.whenIdle();assert.equal(reason.kind,'completed',JSON.stringify(reason))}
 const ordinary=await create('ordinary','ordinary');await run(ordinary);assert.equal(ctx.longTasks.state(ordinary.session).jobId,null)
 const chosen=await create('chosen','long');await ctx.agentPresets.select(chosen,'long-task')
  assert.equal(ctx.sessionProjections.stateOf(chosen.session,'agentPreset'),'long-task');assert.equal(ctx.longTasks.state(chosen.session).jobId,null)
 await run(chosen);assert.equal(observedNative,true);assert.ok(ctx.longTasks.state(chosen.session).jobId)
 const original=ctx.longTasks.state(chosen.session).jobId;await assert.rejects(()=>ctx.agentPresets.select(chosen,'standard'),/already started/)
 assert.equal(ctx.longTasks.state(chosen.session).jobId,original)
 checks.push('Native blank-session selection starts long-task coordination before the first actual model request; Standard remains ordinary')
 checks.push('After the first turn the native preset remains locked and the durable job is preserved')
 const entry=[...ctx.loader.entries()].find(e=>e.options.id==='long-task');await entry.fiber.dispose();assert.equal((await ctx.agentPresets.list()).some(p=>p.id==='long-task'),false);assert.equal(ctx.agentPresets.defaultId,'standard')
 checks.push('Disposing the plugin removes only its menu choice and keeps Standard registered')
 writeFileSync(resolve(import.meta.dirname,'../test-results/long-task-native-preset-20261027.json'),JSON.stringify({realLoader:true,scriptedInference:true,checks},null,2));console.log(JSON.stringify({checks}))
}finally{for(const h of handles.reverse())await h.dispose();await ctx.fiber.dispose();rmSync(root,{recursive:true,force:true})}
