/** Plan-check execution through the approval and shell seams; only wiring is scripted. */
import {formalRequire,nativeExecutorPackages} from './formal-imports.mjs'
import assert from 'node:assert/strict'
import {mkdtempSync,realpathSync,writeFileSync,rmSync,mkdirSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
import {reportPath} from './report-path.mjs'
const {Context}=await import(formalRequire.resolve('@deepseek-ai/cordis'))
const {mountRootInclude,readProfilePatches}=await import('@deepseek-ai/dsh-app-boot')
const load=async name=>{const m=await import(formalRequire.resolve('@deepseek-ai/'+name));return m.default??m}
const root=realpathSync(mkdtempSync(join(tmpdir(),'dsh-checks-'))),ctx=new Context(),handles=[],checks=[]
ctx.baseUrl=pathToFileURL(root+'/').href;mkdirSync(join(root,'home'))
ctx.provide('profileContext',{home:join(root,'home'),dir:root,name:'fixture',cwd:root,patchPath:join(root,'cordis.patch.yml'),installAnchor:join(root,'package.json'),startedBundles:[],overlays:[]})
writeFileSync(join(root,'cordis.patch.yml'),'[]');writeFileSync(join(root,'package.json'),'{}')
const approvals=[],executed=[]
let policy='ask',outcome='denied'
ctx.provide('approval',{config:{policy:'ask'},overrideOf:()=>policy,request:async request=>{approvals.push(request);return outcome}})
let shellResult={exitCode:0,signal:null,timedOut:false,stdout:{text:'ok',truncated:false},stderr:{text:'',truncated:false}}
ctx.provide('shell',{resolve:request=>request,execute:async spec=>{executed.push(spec);return{result:async()=>shellResult}}})
try{
 await ctx.plugin(await load('cordis-plugin-loader')).await();ctx.loader.builtins.group=await load('cordis-plugin-group');ctx.loader.builtins.include=await load('cordis-plugin-include')
 const rows=['dsh-llm','dsh-session','dsh-session-projection','dsh-system-prompt','dsh-tools',...nativeExecutorPackages,'dsh-agent','dsh-agent-loop','dsh-typert-registry','dsh-api-remote-access','dsh-api-gateway','dsh-config-editor','dsh-settings','dsh-agent-preset-registry'].map((name,i)=>({id:'core-'+i,name:'@deepseek-ai/'+name,...name==='dsh-agent-loop'?{config:{agents:[]}}:name==='dsh-agent-preset-registry'?{config:{default:'standard'}}:{}}))
 rows.push({id:'persist',name:'@deepseek-ai/dsh-session-persistence-jsonl',config:{root:join(root,'sessions'),compression:'none'}},{id:'fs',name:'@deepseek-ai/dsh-fs-local',config:{cwd:root}},{id:'standard',name:'@deepseek-ai/dsh-agent-preset',config:{id:'standard',plugins:[]}},{id:'long-task',name:process.env.DSH_LONG_TASK_TEST_HOST??resolve(import.meta.dirname,'../lib/index.js'),config:{loop:{maxToolTurns:0}}})
 const bundle=join(root,'node_modules/@fixture/runtime');mkdirSync(bundle,{recursive:true});writeFileSync(join(bundle,'package.json'),JSON.stringify({name:'@fixture/runtime',version:'1.0.0',dsh:{bundle:{patch:'./cordis.patch.yml'}}}));writeFileSync(join(bundle,'cordis.patch.yml'),JSON.stringify([{insert:rows}]))
 writeFileSync(join(root,'package.json'),JSON.stringify({private:true,dependencies:{'@fixture/runtime':'1.0.0'},dsh:{profile:{bundles:['@fixture/runtime']}}}));writeFileSync(join(root,'cordis.yml'),'[]')
 await mountRootInclude(ctx,join(root,'cordis.yml'),readProfilePatches('dsh',ctx.profileContext));await ctx.loader.await()
 if(!ctx.get('longTasks')||!ctx.get('claudeCompletionReviews'))throw Error(JSON.stringify([...ctx.loader.entries()].map(e=>({id:e.options.id,state:e.fiber?.state,error:String(e.fiber?.error??'')}))))
 const owner=await ctx.agents.create({sessionId:'checks',meta:{cwd:root},agentOptions:{provider:'fixture',model:'fixture'}});handles.push(owner)
 await ctx.longTasks.request({op:'long',sessionId:owner.agent.id})
 const item={id:'T01',checks:['touch ~/probe']}
 const run=()=>ctx.claudeCompletionReviews.runItemChecks(owner.agent,item,AbortSignal.timeout(5000))
 let lines=await run()
 assert.equal(lines,null,'a denied check must fail the item')
 assert.equal(executed.length,0,'a denied check must not reach the shell')
 assert.equal(approvals.length,1);assert.match(approvals[0].reason,/touch ~\/probe/);assert.equal(approvals[0].toolName,'bash')
 checks.push('A check denied by approval never executes and fails the item')
 outcome='allowed-once';item.checks=['touch ~/probe','node --version']
 lines=await run()
 assert.ok(Array.isArray(lines)&&lines.length===2,JSON.stringify(lines))
 assert.equal(executed.length,2);assert.equal(approvals.length,3,'each distinct command asks once, the repeated one does not')
 const before=executed.length;lines=await run()
 assert.ok(Array.isArray(lines));assert.equal(executed.length,before+2,'approved commands run again without a new ask');assert.equal(approvals.length,3)
 checks.push('Approved commands run through the shell once confirmed and are reused within the job')
 policy='never';const deniedBefore=executed.length
 lines=await run();assert.equal(lines,null);assert.equal(executed.length,deniedBefore,'policy never must not execute checks')
 checks.push('Approval policy never fails closed without prompting or executing')
 writeFileSync(reportPath('long-task-checks-permissions-20261114.json'),JSON.stringify({checks,approvals:approvals.length,executed:executed.length},null,2))
 console.log(JSON.stringify({checks,approvals:approvals.length,executed:executed.length}))
}finally{for(const h of handles.reverse())await h.dispose();await ctx.fiber.dispose();rmSync(root,{recursive:true,force:true})}
