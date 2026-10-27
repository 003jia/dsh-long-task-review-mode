import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import test from 'node:test'
import {resolve} from 'node:path'
test('rc.3 Loader, durable plan workflow, artifacts, finite repairs and native Remote',()=>{
 const r=spawnSync(process.env.DSH_NODE??'/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness',[resolve(import.meta.dirname,'runtime.mjs')],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},encoding:'utf8',timeout:45000})
 assert.equal(r.status,0,r.stdout+'\n'+r.stderr);console.log(r.stdout)
})
