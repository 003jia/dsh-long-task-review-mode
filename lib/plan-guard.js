//#region src/plan-guard.ts
const name = "long-task-plan-guard";
const inject = ["tools"];
/** Tools a planning child may use; mutations, delegation and delivery stay out. */
const PLAN_TOOL_ALLOW = [
	"read",
	"glob",
	"grep",
	"read_image",
	"describe_image",
	"get_goal",
	"job_list",
	"job_output",
	"list_agents",
	"session_search",
	"session_trace",
	"web_search",
	"web_fetch"
];
/** Restrict the mounting scope to read-only inspection tools. */
function apply(ctx) {
	ctx.tools.restrict({ allow: PLAN_TOOL_ALLOW });
}
//#endregion
export { apply, inject, name };
