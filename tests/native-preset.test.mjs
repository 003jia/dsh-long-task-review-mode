import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {resolve} from 'node:path'
import test from 'node:test'
test('native mode menu selects the durable long-task workflow',()=>{
 const result=spawnSync(process.env.DSH_NODE??'/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness',[resolve(import.meta.dirname,'native-preset.mjs')],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},encoding:'utf8',timeout:15000})
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);console.log(result.stdout)
})
