/** Deterministic checks declared in plan.md; a failure gates acceptance before any model review. */
import {execFile} from 'node:child_process'

export interface CheckResult{command:string;exitCode:number|null;output:string;timedOut:boolean;denied?:string}

/** One command runner; production routes through the deployment shell and approval services. */
export type CheckRunner=(command:string,cwd:string,signal:AbortSignal)=>Promise<CheckResult>

const TIMEOUT_MS=60000
export const CHECK_OUTPUT_LIMIT=4000

/**
 * Environment retained for plan checks. Provider and cloud credentials are not
 * copied; the shell executor additionally applies its own credential scrub.
 * @returns the minimal environment entries present on this host.
 */
export function checkEnvironment():Record<string,string>{
 const env:Record<string,string>={}
 for(const key of ['PATH','HOME','TMPDIR','LANG','LC_ALL'])if(process.env[key]!==undefined)env[key]=process.env[key]!
 return env
}

function bounded(output:string):string{
 return output.slice(0,CHECK_OUTPUT_LIMIT)+(output.length>CHECK_OUTPUT_LIMIT?'\n[output truncated]':'')
}

/** Direct fallback used only when the deployment composes no shell executor. */
export const directCheckRunner:CheckRunner=(command,cwd,signal)=>new Promise(resolve=>{
 execFile('sh',['-c',command],{cwd,timeout:TIMEOUT_MS,maxBuffer:1024*1024,env:checkEnvironment(),signal},(error,stdout,stderr)=>{
  const timedOut=error!==null&&error.killed===true
  const exitCode=error===null?0:typeof error.code==='number'?error.code:null
  resolve({command,exitCode,output:bounded(stdout+stderr),timedOut})
 })
})

/**
 * Run declared shell commands sequentially in the job workspace.
 * @param cwd - session working directory the plan was written for.
 * @param commands - plan.md `checks` entries.
 * @param signal - cancellation; aborted runs reject instead of returning partial results.
 * @param run - execution path; defaults to the direct fallback for compositions without a shell service.
 * @returns one bounded result per command, in declaration order.
 */
export async function runChecks(cwd:string,commands:readonly string[],signal:AbortSignal,run:CheckRunner=directCheckRunner):Promise<CheckResult[]>{
 const results:CheckResult[]=[]
 for(const command of commands){
  signal.throwIfAborted()
  results.push(await run(command,cwd,signal))
 }
 return results
}
