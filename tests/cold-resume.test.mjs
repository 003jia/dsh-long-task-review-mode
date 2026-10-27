import test from 'node:test'
import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {mkdtempSync,realpathSync,mkdirSync,rmSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
test('independent processes restore the same job and never regrade the first accepted item',()=>{
 const root=realpathSync(mkdtempSync(join(tmpdir(),'dsh-cold-long-'))),stages=[];mkdirSync(join(root,'home'))
 try{for(const stage of ['seed','resume']){
  const r=spawnSync(process.env.DSH_NODE??'/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness',[resolve(import.meta.dirname,'cold-worker.mjs'),stage,root],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},encoding:'utf8',timeout:30000})
  assert.equal(r.status,0,r.stdout+'\n'+r.stderr);stages.push(JSON.parse(r.stdout.trim().split('\n').at(-1)))
 }
 assert.equal(stages[0].jobId,stages[1].jobId)
 writeFileSync(resolve(import.meta.dirname,'../test-results/long-task-cold-resume-20261027.json'),JSON.stringify({realLoader:true,separateProcesses:true,scriptedInference:true,stages},null,2)+'\n');console.log(stages)
 }finally{rmSync(root,{recursive:true,force:true})}
})
