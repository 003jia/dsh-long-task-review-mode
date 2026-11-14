import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import test from 'node:test'
import {resolve} from 'node:path'
test('plan checks pass through approval and the shell seam',()=>{
 const r=spawnSync('/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness',[resolve(import.meta.dirname,'checks-permissions.mjs')],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},encoding:'utf8',timeout:45000})
 assert.equal(r.status,0,r.stdout+'\n'+r.stderr);console.log(r.stdout)
})
