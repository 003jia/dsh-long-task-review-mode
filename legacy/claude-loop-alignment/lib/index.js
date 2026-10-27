import z from "schemastery";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import { defineTool } from "@deepseek-ai/dsh-tools";
//#region src/mount-once.ts
/**
* Host single-instance guard shared by the plugin family. The family bundle
* (dsh-web-ui-all / dsh-skins) namespaces every child row id (web-ui-*), so
* the loader accepts a standalone install of the same package side by side;
* without this guard the second instance would still re-register the same
* webserver routes, tools, settings namespaces, and system-prompt sections
* and fail the boot. mountOnce makes the second host apply a no-op for the
* lifetime of the first instance (the browser half is already deduped by
* package name in the client module host).
*
* The registry rides a global symbol so two module instances of the same
* package (npm copy vs repository link) still share one verdict. cordis
* `ctx.effect` runs its callback immediately and treats the callback's
* return value as the fiber disposer, so the unmarker is returned, not run.
*/
const MOUNTED = Symbol.for("dsh-web-ui.mounted-plugins");
function mountedSet() {
	const registry = globalThis;
	return registry[MOUNTED] ??= /* @__PURE__ */ new Set();
}
/**
* Wrap a cordis plugin apply so the package runs at most once per process.
* The first mount registers normally and unmarks when its fiber disposes;
* any later mount of the same package name is a no-op.
* @param packageName - npm package identity shared by every install source.
* @param fn - the original plugin apply.
* @returns an apply of the same shape.
*/
function mountOnce(packageName, fn) {
	return ((...args) => {
		const mounted = mountedSet();
		if (mounted.has(packageName)) return;
		mounted.add(packageName);
		args[0]?.effect?.(() => () => {
			mounted.delete(packageName);
		});
		return fn(...args);
	});
}
//#endregion
//#region src/tools.ts
const PLUGIN = "dsh-cc-loop-alignment";
/** One plugin-sourced message; the loop appends it as a user message. */
function pluginMessage(text) {
	return createUserMessage({
		content: [{
			type: "text",
			text
		}],
		source: {
			kind: "plugin",
			plugin: PLUGIN
		}
	});
}
/** Read-only architect prompt (Claude Code PLAN_AGENT, adapted to dsh tools). */
function planPrompt(instruction, perspective) {
	const lens = perspective ? `You are asked to apply this specific perspective to your design: ${perspective}\n\n` : "";
	return [
		"You are a software architect and planning specialist. Your role is to explore the codebase and design an implementation plan.",
		"",
		"=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===",
		"This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from creating, modifying, deleting, moving, or copying files, and from running any command that changes system state. You do NOT have access to write or shell tools - attempting to use them will fail.",
		"",
		"Your tools are limited to read-only exploration: read (read files), glob (find files by pattern), grep (search file contents), read_image/describe_image, and the read-only inspection tools.",
		"",
		`Requirements:\n${instruction}`,
		"",
		lens,
		"## Your Process",
		"1. Understand Requirements: Focus on the requirements and your assigned perspective.",
		"2. Explore Thoroughly: read any relevant files, find existing patterns and conventions, understand the current architecture, identify similar features as reference, trace relevant code paths.",
		"3. Design Solution: create an implementation approach, consider trade-offs and architectural decisions, follow existing patterns.",
		"4. Detail the Plan: provide a step-by-step implementation strategy, identify dependencies and sequencing, anticipate potential challenges.",
		"",
		"## Required Output",
		"End your response with:",
		"### Critical Files for Implementation",
		"List 3-5 files most critical for implementing this plan.",
		"",
		"REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files."
	].join("\n");
}
/** Allowlist of read-only tools the plan subagent may inherit (scoped registrations of the subagent itself are never filtered). */
const PLAN_TOOL_ALLOW = [
	"read",
	"glob",
	"grep",
	"read_image",
	"describe_image",
	"get_goal",
	"job_list",
	"job_output",
	"list_agents"
];
/**
* Build the `snip` tool.
* @param ctx - host plugin context (tokenMeter read via ctx.get).
* @returns the registered tool definition.
*/
function makeSnipTool(ctx) {
	return defineTool({
		name: "snip",
		description: "Remove the oldest part of the conversation history at the model’s discretion (Claude Code SnipTool analog). Deletes all surface messages before the most recent `keep_recent` messages and replaces them with one small placeholder, freeing context without summarization. Use when early discussion is no longer relevant. Returns the number of messages and tokens removed.",
		parameters: {
			keep_recent: {
				type: "integer",
				description: "How many of the most recent surface messages to keep. Default 15, minimum 1."
			},
			reason: {
				type: "string",
				description: "Optional one-line reason, recorded in the placeholder text."
			}
		},
		output: {
			schema: {
				type: "object",
				properties: {
					removed: {
						type: "integer",
						required: true
					},
					kept: {
						type: "integer",
						required: true
					},
					shadowedTokens: {
						type: "integer",
						required: true
					}
				},
				additionalProperties: false
			},
			render: (_args, value) => [{
				type: "text",
				text: `snip: removed ${value.removed} message(s), kept ${value.kept} (${value.shadowedTokens} tokens freed)`
			}]
		},
		isConcurrencySafe: () => false,
		async execute(args, exec) {
			const agent = exec.agent;
			if (!agent) throw new Error("snip requires an owning agent");
			const session = agent.session;
			const meter = ctx.get("tokenMeter");
			const nodes = [...session.surface.nodes];
			if (nodes.length === 0) return {
				removed: 0,
				kept: 0,
				shadowedTokens: 0
			};
			let keep = typeof args.keep_recent === "number" && Number.isFinite(args.keep_recent) ? Math.trunc(args.keep_recent) : 15;
			if (keep < 1) keep = 1;
			const shadowCount = nodes.length - keep;
			if (shadowCount <= 0) return {
				removed: 0,
				kept: nodes.length,
				shadowedTokens: 0
			};
			const shadowedSeqs = nodes.slice(0, shadowCount);
			const start = nodes[0];
			const end = nodes[shadowCount - 1];
			let shadowedTokens = 0;
			if (meter) try {
				const measurement = meter.measure(session);
				if (measurement && Array.isArray(measurement.nodes)) {
					const bySeq = new Map(measurement.nodes.map((node) => [node.seq, node]));
					for (const seq of shadowedSeqs) {
						const node = bySeq.get(seq);
						if (node && typeof node.tokens === "number") shadowedTokens += node.tokens;
					}
				}
			} catch {}
			const reason = typeof args.reason === "string" ? args.reason.slice(0, 200) : void 0;
			const message = pluginMessage(`[History snipped at the model's request: earlier messages were removed.${reason ? ` Reason: ${reason}` : ""}]`);
			const pruneEvent = session.append("compaction/prune", {
				shadowedRange: {
					start,
					end
				},
				shadowedSeqs: [...shadowedSeqs],
				shadowedTokenCount: shadowedTokens
			});
			session.append("user/message", message, {
				surfaceOp: {
					op: "replace",
					start,
					end
				},
				sourceEventSeqs: [pruneEvent.seq, ...shadowedSeqs]
			});
			ctx.logger.info(`[cc-loop] snip tool: removed ${shadowCount} message(s) (${shadowedTokens} tokens)`);
			return {
				removed: shadowCount,
				kept: nodes.length - shadowCount,
				shadowedTokens
			};
		}
	});
}
/**
* Build the `plan_agent` tool.
* @param ctx - host plugin context (subagents read via ctx.get).
* @returns the registered tool definition.
*/
function makePlanAgentTool(ctx) {
	return defineTool({
		name: "plan_agent",
		description: "Delegate planning to a read-only software-architect subagent (Claude Code PLAN_AGENT analog). Use for implementation planning: the subagent explores the codebase with read-only tools and returns a step-by-step plan with critical files, without modifying anything. Best used in plan mode before exit_plan_mode.",
		parameters: {
			instruction: {
				type: "string",
				description: "The requirements to plan for: the task, the goal, and any constraints. Include relevant file paths."
			},
			perspective: {
				type: "string",
				description: "Optional design perspective/lens to apply while planning (e.g. minimal-diff, performance-first, testability)."
			}
		},
		output: {
			schema: {
				type: "object",
				properties: {
					summary: {
						type: "string",
						required: true
					},
					plan: {
						type: "string",
						required: true
					}
				},
				additionalProperties: false
			},
			render: (_args, value) => [{
				type: "text",
				text: value.summary
			}, {
				type: "text",
				text: `\n\n--- Plan Agent output ---\n\n${value.plan}`
			}]
		},
		isConcurrencySafe: () => false,
		async execute(args, exec) {
			const agent = exec.agent;
			if (!agent) throw new Error("plan_agent requires an owning agent");
			const subagents = ctx.get("subagents");
			if (!subagents) throw new Error("plan_agent: subagent service unavailable");
			const names = subagents.list();
			if (names.length === 0) throw new Error("plan_agent: no subagent provider is registered");
			let providerName;
			for (const name of names) {
				const provider = subagents.getProvider(name);
				if (provider && provider.capabilities && provider.capabilities.toolFilter === true) {
					providerName = name;
					break;
				}
			}
			if (!providerName) throw new Error("plan_agent: no subagent provider with tool-filter capability (read-only scoping required)");
			const promptText = planPrompt(String(args.instruction ?? ""), args.perspective === void 0 ? void 0 : String(args.perspective));
			const run = await subagents.start(providerName, {
				label: "plan-agent",
				prompt: [{
					type: "text",
					text: promptText
				}],
				parent: agent,
				signal: exec.signal,
				maxDepth: 1,
				toolFilter: { allow: PLAN_TOOL_ALLOW }
			});
			try {
				const result = await run.result;
				const text = result.output.filter((block) => block.type === "text").map((block) => block.text).join("\n");
				const reason = result.stopReason;
				if (reason !== "completed" && reason !== "max-tokens") throw new Error(`plan subagent ended with stop reason ${reason}${text ? `:\n${text}` : ""}`);
				if (!text.trim()) throw new Error("plan subagent produced no output");
				const firstLine = text.trim().split("\n").find((line) => line.trim() !== "") ?? "";
				return {
					summary: firstLine ? `Plan agent\u300c${firstLine.slice(0, 120)}\u300d (${reason})` : `Plan agent finished (${reason})`,
					plan: text
				};
			} finally {
				await run.dispose();
			}
		}
	});
}
//#endregion
//#region src/index.ts
/** Stable cordis plugin name. */
const name = "cc-loop";
/** Services required before the surfaces can mount. */
const inject = ["tools", "systemPrompt"];
/**
* Settings namespace of this plugin — the section the web settings surface
* edits. Spelled here rather than imported: the browser half spells the same
* value and must not depend on a Host package.
*/
const CC_LOOP_NAMESPACE = settingsNamespace("dsh-cc-loop");
const DEFAULT_MAX_TOOL_TURNS = 20;
const DEFAULT_SNIP_AT_RATIO = .6;
const DEFAULT_COMPACT_AT_RATIO = 0;
const DEFAULT_TURN_TOKEN_BUDGET = 0;
const DEFAULT_BUDGET_COMPLETION_RATIO = .9;
const DEFAULT_BUDGET_DIMINISHING_DELTA = 500;
const DEFAULT_MAX_TOKENS_RECOVERY_LIMIT = 3;
const DEFAULT_ANNOUNCE = true;
const ratioSchema = z.number().min(0).max(1);
const countSchema = z.number().step(1).min(0);
const Config = z.object({
	maxToolTurns: countSchema.default(DEFAULT_MAX_TOOL_TURNS),
	snipAtRatio: ratioSchema.default(DEFAULT_SNIP_AT_RATIO),
	compactAtRatio: ratioSchema.default(DEFAULT_COMPACT_AT_RATIO),
	turnTokenBudget: countSchema.default(DEFAULT_TURN_TOKEN_BUDGET),
	budgetCompletionRatio: ratioSchema.default(DEFAULT_BUDGET_COMPLETION_RATIO),
	budgetDiminishingDelta: countSchema.default(DEFAULT_BUDGET_DIMINISHING_DELTA),
	maxTokensRecoveryLimit: countSchema.default(DEFAULT_MAX_TOKENS_RECOVERY_LIMIT),
	announceToAgent: z.boolean().default(DEFAULT_ANNOUNCE),
	enabled: z.boolean().default(true)
});
/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 160;
/** Model-facing announcement: plugin presence, capabilities, and limits. */
const CC_LOOP_GUIDANCE = "本机已安装 Claude Loop Alignment 插件（Claude Code agent loop 行为对齐）：每用户轮次限制工具调用步数上限 maxToolTurns；上下文压力达 snipAtRatio 时自动剪枝工具结果；可配 token 预算（turnTokenBudget）在轮内以提示续写；输出截断时自动注入断点续写指令；提供 snip（模型主动剪除历史）与 plan_agent（只读规划子代理）工具。参数可在设置-插件中调整。";
/** One plugin-sourced steer message; the loop appends it as a user message. */
function steerMessage(text) {
	return createUserMessage({
		content: [{
			type: "text",
			text
		}],
		source: {
			kind: "plugin",
			plugin: "dsh-cc-loop-alignment"
		}
	});
}
/**
* Mount the loop mechanisms, tools, and announcement.
* @param ctx - host plugin context carrying tools/systemPrompt.
* @param config - resolved plugin config (schema defaults applied by the loader).
*/
const apply = mountOnce("@003jia/dsh-cc-loop-alignment", applyImpl);
function applyImpl(ctx, config) {
	let current = () => config ?? {};
	const resolve = () => ({
		maxToolTurns: current().maxToolTurns ?? DEFAULT_MAX_TOOL_TURNS,
		snipAtRatio: current().snipAtRatio ?? DEFAULT_SNIP_AT_RATIO,
		compactAtRatio: current().compactAtRatio ?? DEFAULT_COMPACT_AT_RATIO,
		turnTokenBudget: current().turnTokenBudget ?? DEFAULT_TURN_TOKEN_BUDGET,
		budgetCompletionRatio: current().budgetCompletionRatio ?? DEFAULT_BUDGET_COMPLETION_RATIO,
		budgetDiminishingDelta: current().budgetDiminishingDelta ?? DEFAULT_BUDGET_DIMINISHING_DELTA,
		maxTokensRecoveryLimit: current().maxTokensRecoveryLimit ?? DEFAULT_MAX_TOKENS_RECOVERY_LIMIT,
		announceToAgent: current().announceToAgent ?? DEFAULT_ANNOUNCE,
		enabled: current().enabled ?? true
	});
	const enforced = /* @__PURE__ */ new Map();
	const budgetTrackers = /* @__PURE__ */ new Map();
	const maxTokensTrackers = /* @__PURE__ */ new Map();
	let disposeTools;
	let disposeSection;
	/** Authoritative count of tool-use steps already executed in this turn. */
	const toolStepCount = (agent, turn) => {
		let count = 0;
		for (const event of agent.session.events) {
			if (event.type !== "assistant/message") continue;
			if (event.data.turn !== turn) continue;
			if (event.data.message.content.some((block) => block.type === "tool-call")) count += 1;
		}
		return count;
	};
	/** Sum of this turn's assistant output tokens (budget metering). */
	const turnOutputTokens = (agent, turn) => {
		let total = 0;
		for (const event of agent.session.events) {
			if (event.type !== "assistant/message") continue;
			if (event.data.turn !== turn) continue;
			const usage = event.data.usage;
			if (usage && typeof usage.outputTokens === "number") total += usage.outputTokens;
		}
		return total;
	};
	/** Terminal finish reason of the most recent step, read from the chunk stream. */
	const lastFinishKind = (agent) => {
		for (let index = agent.session.events.length - 1; index >= 0; index -= 1) {
			const event = agent.session.events[index];
			if (event.type !== "assistant/chunk") continue;
			const chunk = event.data.chunk;
			if (chunk && chunk.type === "finish" && chunk.reason) return chunk.reason.kind;
		}
	};
	/** Measured context pressure: estimated total tokens / routed context window. */
	const measureRatio = async (agent, signal) => {
		const header = agent.session.requestHeader();
		const route = header && header.config ? header.config : void 0;
		if (!route || !route.provider || !route.model) return void 0;
		const meter = ctx.get("tokenMeter");
		const llm = ctx.get("llm");
		if (!meter || !llm) return void 0;
		let contextWindow;
		try {
			contextWindow = (await llm.resolveModelInfo(route.provider, route.model, signal))?.context?.contextWindow;
		} catch {
			return;
		}
		if (typeof contextWindow !== "number" || contextWindow <= 0) return void 0;
		let totalTokens;
		try {
			totalTokens = meter.measure(agent.session).totalTokens;
		} catch {
			return;
		}
		if (typeof totalTokens !== "number") return void 0;
		return totalTokens / contextWindow;
	};
	/** Re-register every surface to match the current config source. */
	const sync = () => {
		const value = resolve();
		if (disposeSection !== void 0) {
			disposeSection();
			disposeSection = void 0;
		}
		if (disposeTools !== void 0) {
			disposeTools();
			disposeTools = void 0;
		}
		if (!value.enabled) return;
		if (value.announceToAgent) disposeSection = ctx.systemPrompt.section({
			name: "plugin:dsh-cc-loop-alignment",
			order: SECTION_ORDER,
			text: CC_LOOP_GUIDANCE
		});
		disposeTools = ctx.effect(() => {
			const disposers = [ctx.tools.register(makeSnipTool(ctx)), ctx.tools.register(makePlanAgentTool(ctx))];
			return () => {
				for (const dispose of disposers) dispose();
			};
		}, "dsh-cc-loop: tools");
	};
	ctx.on("agent/pre-step", async ({ agent, turn, step, signal }, next) => {
		try {
			const value = resolve();
			if (!value.enabled) return next();
			if (signal.aborted) return next();
			const session = agent.session;
			const ratio = await measureRatio(agent, signal);
			if (ratio !== void 0) {
				if (value.snipAtRatio > 0 && ratio >= value.snipAtRatio) {
					const pruner = ctx.get("toolResultPruner");
					if (pruner) try {
						pruner.pruneSession(session);
						ctx.logger.info(`[cc-loop] snip: pruned tool-result surface at ${Math.round(ratio * 100)}% context pressure`);
					} catch (error) {
						ctx.logger.warn(`[cc-loop] snip prune failed: ${String(error)}`);
					}
				}
				if (value.compactAtRatio > 0 && ratio >= value.compactAtRatio) {
					const compaction = ctx.get("compaction");
					if (compaction) try {
						const result = await compaction.compactIfNeeded(agent, "pressure", signal);
						if (result !== null) ctx.logger.info(`[cc-loop] compacted at pressure: shadowed ${result.shadowedSeqs.length} surface nodes`);
					} catch (error) {
						ctx.logger.warn(`[cc-loop] pressure compaction failed: ${String(error)}`);
					}
				}
			}
			if (value.maxToolTurns > 0) {
				const key = String(session.id);
				let state = enforced.get(key);
				if (!state || state.turn !== turn) {
					state = {
						turn,
						injected: false
					};
					enforced.set(key, state);
				}
				const toolSteps = toolStepCount(agent, turn);
				if (toolSteps >= value.maxToolTurns) {
					if (state.injected) {
						ctx.logger.info(`[cc-loop] maxToolTurns exceeded (${toolSteps} >= ${value.maxToolTurns}): rejecting the next step`);
						return { kind: "reject" };
					}
					state.injected = true;
					const decision = await next();
					if (decision.kind === "reject") return decision;
					ctx.logger.info(`[cc-loop] maxToolTurns reached (${toolSteps}): injecting stop instruction at turn ${turn} step ${step}`);
					return {
						...decision,
						messages: [...decision.messages, steerMessage(`[turn budget] The configured maximum tool-use steps for this turn have been reached. Do not call any more tools. Give the final answer now, based on the tool results already available. (limit: ${value.maxToolTurns})`)]
					};
				}
			}
			return next();
		} catch (error) {
			ctx.logger.warn(`[cc-loop] pre-step listener error: ${String(error)}`);
			return next();
		}
	});
	ctx.on("agent/turn-stopping", ({ agent, turn, signal }) => {
		try {
			const value = resolve();
			if (!value.enabled) return;
			if (signal.aborted) return;
			const session = agent.session;
			const key = String(session.id);
			if (value.maxTokensRecoveryLimit > 0) {
				if (lastFinishKind(agent) === "max-tokens") {
					const count = maxTokensTrackers.get(key) ?? 0;
					if (count < value.maxTokensRecoveryLimit) {
						maxTokensTrackers.set(key, count + 1);
						ctx.logger.info(`[cc-loop] max-tokens recovery #${count + 1}: steering resume message`);
						agent.steer(steerMessage("Output token limit hit. Resume directly — no apology, no recap of what you were doing. Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces."));
						return;
					}
					ctx.logger.info(`[cc-loop] max-tokens recovery exhausted (${count} >= ${value.maxTokensRecoveryLimit})`);
				} else if ((maxTokensTrackers.get(key) ?? 0) > 0) maxTokensTrackers.set(key, 0);
			}
			if (value.turnTokenBudget > 0) {
				let tracker = budgetTrackers.get(key);
				if (!tracker) {
					tracker = {
						continuationCount: 0,
						lastGlobalTurnTokens: 0,
						lastDeltaTokens: 0
					};
					budgetTrackers.set(key, tracker);
				}
				const turnTokens = turnOutputTokens(agent, turn);
				const pct = Math.round(turnTokens / value.turnTokenBudget * 100);
				const delta = turnTokens - tracker.lastGlobalTurnTokens;
				const diminishing = tracker.continuationCount >= 3 && delta < value.budgetDiminishingDelta && tracker.lastDeltaTokens < value.budgetDiminishingDelta;
				if (!diminishing && turnTokens < value.turnTokenBudget * value.budgetCompletionRatio) {
					tracker.continuationCount += 1;
					tracker.lastDeltaTokens = delta;
					tracker.lastGlobalTurnTokens = turnTokens;
					ctx.logger.info(`[cc-loop] token budget: nudging continuation #${tracker.continuationCount} at ${pct}%`);
					agent.steer(steerMessage(`Stopped at ${pct}% of token target (${turnTokens.toLocaleString("en-US")} / ${value.turnTokenBudget.toLocaleString("en-US")}). Keep working \u2014 do not summarize.`));
					return;
				}
				if (diminishing || tracker.continuationCount > 0) ctx.logger.info(`[cc-loop] token budget: turn complete at ${pct}%${diminishing ? " (diminishing returns)" : ""}`);
			}
		} catch (error) {
			ctx.logger.warn(`[cc-loop] turn-stopping listener error: ${String(error)}`);
		}
	});
	ctx.on("agent/status", ({ agent, status }) => {
		if (status !== "idle") return;
		const key = String(agent.session.id);
		enforced.delete(key);
		maxTokensTrackers.delete(key);
		budgetTrackers.delete(key);
	});
	installSettingsSection(ctx, CC_LOOP_NAMESPACE, Config, config ?? {}, {
		setSource(source) {
			current = source;
		},
		onChange: sync
	});
	sync();
}
//#endregion
export { CC_LOOP_GUIDANCE, CC_LOOP_NAMESPACE, Config, apply, inject, name };
