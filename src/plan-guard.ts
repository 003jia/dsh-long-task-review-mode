/** Read-only tool scope for the plan subagent. Mounted by the long-task-plan preset. */
import type {Context} from '@deepseek-ai/cordis'

export const name='long-task-plan-guard'
export const inject=['tools']
/** Tools a planning child may use; mutations, delegation and delivery stay out. */
const PLAN_TOOL_ALLOW=['read','glob','grep','read_image','describe_image','get_goal','job_list','job_output','list_agents','session_search','session_trace','web_search','web_fetch']

/** Restrict the mounting scope to read-only inspection tools. */
export function apply(ctx:Context):void{
 ctx.tools.restrict({allow:PLAN_TOOL_ALLOW})
}
