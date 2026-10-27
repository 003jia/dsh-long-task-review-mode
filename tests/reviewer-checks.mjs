/** Real Loader/Gateway/credential storage; only the external Jev server is scripted. */
import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {readFileSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {formalRequire} from './formal-imports.mjs'
const {credentialRef}=await import(formalRequire.resolve('@deepseek-ai/dsh-credentials'))
export async function checkReviewers({ctx,root,service,peer,owner,user,run,plan,local}){
 const checks=[],requests=[],secret='fixture-JEV-credential-not-for-production';let mode='valid',responseModel='jev-fixture-1'
 const server=createServer(async(req,res)=>{
  const chunks=[];for await(const c of req)chunks.push(c)
  const body=JSON.parse(Buffer.concat(chunks));requests.push(body);assert.equal(req.headers.authorization,'Bearer '+secret)
  if(mode==='hold')return
  if(mode==='http'){res.writeHead(401);res.end(JSON.stringify({error:secret}));return}
  if(mode==='large'){res.end('x'.repeat(300000));return}
  const answers=Object.fromEntries(Object.entries(body.questions).map(([name,q])=>[name,q.type==='score'?{type:'score',score:3.8,confidence:.8,legend:Object.fromEntries(q.criteria.map((v,i)=>[i,v])),probabilities:{'0':0,'1':0,'2':0,'3':.2,'4':.8}}:{type:'choice',choice:name==='critical'?'satisfied':'none',confidence:.9,probabilities:Object.fromEntries(Object.keys(q.criteria).map(k=>[k,k===(name==='critical'?'satisfied':'none')?1:0]))}]))
  const result={model:responseModel,answers,usage:{input_tokens:100,output_tokens:10}}
  if(mode==='missing')delete result.usage
  if(mode==='badscore')answers.completion.score=3
  if(mode==='badchoice')delete answers.critical.probabilities.unsupported
  res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result))
 })
 await new Promise((done,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',done)})
 try{
  const original=(await service.request({op:'settings'})).loop
  const edited={...original,maxToolTurns:60,snipAtRatio:.75,maxTokensRecoveryLimit:5,deferMcpTools:false}
  const saved=await ctx.typertGateway.invoke({peer,namespace:'longTasks',method:'request',args:{request:{op:'saveLoop',loop:edited}}})
  assert.deepEqual(saved.loop,edited);assert.ok(readFileSync(join(root,'cordis.patch.yml'),'utf8').includes('0.75'))
  await assert.rejects(()=>ctx.typertGateway.invoke({peer,namespace:'longTasks',method:'request',args:{request:{op:'saveLoop',loop:{...edited,snipAtRatio:2}}}}))
  assert.deepEqual((await service.request({op:'settings'})).loop,edited)
  await service.request({op:'saveLoop',loop:original});checks.push('Claude Loop configuration persists through the real editor; invalid remote saves preserve accepted values')
  const legacy=await owner('legacy-local');await service.request({op:'long',sessionId:legacy.id});await service.request({op:'pause',sessionId:legacy.id});const legacyRecord=structuredClone(service.state(legacy.session));delete legacyRecord.reviewer;delete legacyRecord.resolvedReviewerModel;service.update(legacy.session,legacyRecord)
  const localHistory=structuredClone(service.state(local.session).acceptances)
  await service.request({op:'pause',sessionId:local.id})
  const settings={backend:'jev',endpoint:`http://127.0.0.1:${server.address().port}/v1/systemone`,model:'jev-latest',timeoutMs:1000}
  const savedCloud=await service.request({op:'saveReviewer',reviewer:settings,apiKey:secret})
  assert.equal(savedCloud.reviewer.phase,'configured');assert.equal(savedCloud.reviewer.credentialConfigured,true)
  assert.ok(!JSON.stringify(savedCloud).includes(secret));assert.ok(!readFileSync(join(root,'cordis.patch.yml'),'utf8').includes(secret));assert.ok(readFileSync(join(root,'home/.credentials.yaml'),'utf8').includes(secret))
  await assert.rejects(()=>service.request({op:'saveReviewer',reviewer:{...settings,endpoint:'https://example.invalid/changed'}}),/重新填写密钥/)
  assert.equal((await service.request({op:'settings'})).reviewer.settings.endpoint,settings.endpoint)
  const tested=await service.request({op:'testReviewer',backend:'jev'});assert.equal(tested.reviewer.phase,'ready');assert.equal(tested.reviewer.test.model,responseModel)
  assert.equal(service.state(local.session).acceptances.length,localHistory.length)
  checks.push('Jev uses the System One endpoint, validates a real HTTP response, and stores only a credential reference in settings and snapshots')
  await service.request({op:'resume',sessionId:legacy.id});assert.equal(service.state(legacy.session).reviewer,null);await service.request({op:'pause',sessionId:legacy.id})
  const cloud=await owner('cloud-job');await service.request({op:'long',sessionId:cloud.id});user(cloud,0,'Explain 2 + 2')
  const doc=plan(1);doc.tasks[0].taskType='opinion';doc.tasks[0].affectedPaths=[]
  writeFileSync(join(root,'plan.md'),'```json\n'+JSON.stringify(doc)+'\n```\n');await run({planPath:'plan.md'})
  await run({taskUpdate:{id:'T01',status:'completed',result:'2 + 2 equals 4; two objects combined with two objects gives four.',evidenceIds:[]}})
  assert.equal(service.state(cloud.session).resolvedReviewerModel,responseModel)
  assert.equal(ctx.sessionProjections.stateOf(cloud.session,'claudeCompletionReview').reviews.at(-1).reviewer,'jev')
  const oldRef=service.state(cloud.session).reviewer.credentialRef
  await service.request({op:'saveReviewer',reviewer:settings,apiKey:secret+'-rotated'});assert.equal(ctx.reviewers.selection().credentialRef,oldRef);assert.equal((await ctx.credentials.resolve(credentialRef(oldRef))).value,secret+'-rotated')
  await service.request({op:'saveReviewer',reviewer:settings,apiKey:secret})
  await service.request({op:'saveReviewer',reviewer:{...settings,backend:'laya'}})
  assert.equal(service.state(cloud.session).reviewer.backend,'jev');assert.equal(service.state(local.session).reviewer.backend,'laya')
  cloud.session.append('assistant/message',{turn:0,step:0,interrupted:false,stream:[],message:{role:'assistant',source:{kind:'model',provider:'fixture',model:'no-network'},content:[{type:'text',text:'2 + 2 equals 4 because combining two objects with two objects gives four.'}]}},{surfaceOp:'append'})
  await ctx.claudeCompletionReviews.assess(cloud,0,AbortSignal.timeout(5000));assert.equal(service.state(cloud.session).phase,'done');assert.equal(requests.at(-1).model,responseModel)
  assert.deepEqual(service.state(local.session).acceptances,localHistory)
  await service.request({op:'resume',sessionId:local.id});assert.equal(service.state(local.session).reviewer.backend,'laya')
  await service.request({op:'saveReviewer',reviewer:settings});const mismatch=await owner('cloud-version');await service.request({op:'long',sessionId:mismatch.id});const pinSample={taskType:'opinion',requirement:'Explain 2 + 2',output:'It equals four.',evidence:[]};await service.evaluate(mismatch,pinSample,AbortSignal.timeout(5000));responseModel='jev-fixture-2';await assert.rejects(()=>service.evaluate(mismatch,pinSample,AbortSignal.timeout(5000)),/版本改变/);assert.equal(service.state(mismatch.session).acceptances.length,0);responseModel='jev-fixture-1';await service.request({op:'pause',sessionId:mismatch.id})
  checks.push('Legacy records stay local; same-endpoint key rotation reaches frozen jobs; actual Jev version changes cannot publish acceptance')
  checks.push('Cloud item and overall acceptance use Jev; selection changes preserve existing local approvals and pin the cloud job to its resolved version')
  const selected={...ctx.reviewers.selection(),backend:'jev'},sample={taskType:'opinion',requirement:'Explain 2 + 2',output:'It equals four.',evidence:[]}
  for(const failure of ['http','missing','badscore','badchoice','large']){mode=failure;await assert.rejects(()=>ctx.reviewers.evaluate(selected,sample,AbortSignal.timeout(5000)),error=>!error.message.includes(secret))}
  mode='hold';await assert.rejects(()=>ctx.reviewers.evaluate(selected,sample,AbortSignal.timeout(5000)))
  const pending=service.request({op:'testReviewer',backend:'jev'});const rejected=assert.rejects(()=>pending,/取消/)
  while(!(await service.request({op:'settings'})).reviewer.phase.includes('checking'))await new Promise(done=>setImmediate(done))
  await service.request({op:'cancelReviewerTest'});await rejected
  assert.equal((await service.request({op:'settings'})).reviewer.test,null)
  checks.push('HTTP/auth errors, incomplete answers, inconsistent probabilities, oversized responses, timeouts and cancellation never produce acceptance or a fallback')
  mode='valid';await service.request({op:'saveReviewer',reviewer:{...settings,backend:'laya'}})
  return {checks,httpRequests:requests.length,liveCloud:false}
 }finally{server.closeAllConnections();await new Promise(done=>server.close(done))}
}
