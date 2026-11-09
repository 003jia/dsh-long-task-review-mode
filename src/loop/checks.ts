/** Deterministic checks declared in plan.md; a failure gates acceptance before any model review. */
import {execFile} from 'node:child_process'

export interface CheckResult{command:string;exitCode:number|null;output:string;timedOut:boolean}

const TIMEOUT_MS=60000,MAX_OUTPUT=4000

/**
 * Run declared shell commands sequentially in the job workspace.
 * @param cwd - session working directory the plan was written for.
 * @param commands - plan.md `checks` entries, executed via `sh -c`.
 * @param signal - cancellation; aborted runs reject instead of returning partial results.
 * @returns one bounded result per command, in declaration order.
 */
export async function runChecks(cwd:string,commands:readonly string[],signal:AbortSignal):Promise<CheckResult[]>{
 const results:CheckResult[]=[]
 for(const command of commands){
  signal.throwIfAborted()
  results.push(await new Promise<CheckResult>(resolve=>{
   execFile('sh',['-c',command],{cwd,timeout:TIMEOUT_MS,maxBuffer:1024*1024},(error,stdout,stderr)=>{
    const timedOut=error!==null&&error.killed===true
    const exitCode=error===null?0:typeof error.code==='number'?error.code:null
    const raw=stdout+stderr
    resolve({command,exitCode,output:raw.slice(0,MAX_OUTPUT)+(raw.length>MAX_OUTPUT?'\n[output truncated]':''),timedOut})
   })
  }))
 }
 return results
}
