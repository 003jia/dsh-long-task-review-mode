/** Host-collected deliverable evidence: bounded git diff plus text excerpts, never model-selected. */
import {execFile} from 'node:child_process'
import {readFile,stat} from 'node:fs/promises'
import {resolve,sep} from 'node:path'

const DIFF_CHARS=4000,MAX_FILE_BYTES=262144,MAX_EXCERPT_LINES=80,TOTAL_CHARS=8000

function git(cwd:string,args:string[]):Promise<string|null>{
 return new Promise(resolve=>{execFile('git',args,{cwd,timeout:8000,maxBuffer:512*1024},(error,stdout)=>resolve(error?null:String(stdout)))})
}

/**
 * Collect bounded evidence for declared affected paths: tracked changes via git diff
 * when available, plus head excerpts of readable text files (covers untracked files).
 * Binary, oversized, missing and out-of-workspace paths contribute nothing.
 * @param cwd - session working directory.
 * @param paths - plan-declared affected paths, relative to cwd.
 * @param signal - cancellation.
 * @returns evidence text, possibly empty; never throws for unreadable paths.
 */
export async function codeEvidence(cwd:string,paths:readonly string[],signal:AbortSignal):Promise<string>{
 signal.throwIfAborted()
 if(!cwd||paths.length===0)return ''
 const root=resolve(cwd),parts:string[]=[]
 const diff=await git(cwd,['diff','--no-color','--',...paths])
 if(diff!==null&&diff.trim()!=='')parts.push('[git diff --no-color]\n'+diff.slice(0,DIFF_CHARS)+(diff.length>DIFF_CHARS?'\n[diff truncated]':''))
 let budget=TOTAL_CHARS-parts.join('\n').length-16
 for(const path of paths){
  signal.throwIfAborted()
  if(budget<=120)break
  const abs=resolve(root,path)
  if(abs!==root&&!abs.startsWith(root+sep))continue
  try{
   const info=await stat(abs)
   if(!info.isFile()||info.size>MAX_FILE_BYTES)continue
   const text=await readFile(abs,'utf8')
   if(text.includes('\0'))continue
   const block=`[file ${path}]\n${text.split('\n').slice(0,MAX_EXCERPT_LINES).join('\n')}`
   if(block.length>budget)break
   parts.push(block);budget-=block.length+1
  }catch{/* Missing, unreadable or concurrently changed paths contribute no excerpt. */}
 }
 return parts.join('\n')
}
