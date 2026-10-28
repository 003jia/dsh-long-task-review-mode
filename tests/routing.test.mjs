import test from 'node:test'
import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {resolve} from 'node:path'
test('native long-task mode follows the three flowchart branches',()=>{
 const result=spawnSync(process.env.DSH_NODE??'/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness',[resolve(import.meta.dirname,'routing.mjs')],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},encoding:'utf8',timeout:30000})
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);console.log(result.stdout)
})
