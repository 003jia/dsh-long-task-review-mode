/**
 * cc-loop-alignment — `plan_agent` tool (Claude Code PLAN_AGENT analogue).
 *
 * dsh implements this with its subagent runtime plus a start-time tool filter.
 * pi has no in-process subagent API, so the planner runs as an isolated
 * `pi --mode json` child process, mirroring `examples/extensions/subagent`:
 *
 * - read-only tool allowlist (`read,grep,find,ls`, no bash/write/edit)
 * - extensions disabled, so the planner cannot recurse into this tool
 * - the architect prompt is appended to pi's own system prompt
 * - NDJSON stdout is parsed to collect the final plan and usage
 */

import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { Type } from "typebox";
import { Text } from "@earendil-works/pi-tui";
import type { ExtensionContext, ToolDefinition } from "@earendil-works/pi-coding-agent";
import type { CcLoopConfig } from "./config.ts";
import type { LoopLog } from "./loop.ts";
import { architectPrompt } from "./prompts.ts";

/** Read-only allowlist for the planner child process. */
export const PLAN_TOOL_ALLOW = ["read", "grep", "find", "ls"];

const MAX_PLAN_BYTES = 50 * 1024;
const UPDATE_THROTTLE_MS = 400;

interface PlanUsage {
	input: number;
	output: number;
	cacheRead: number;
	cacheWrite: number;
	cost: number;
	turns: number;
}

interface PlanRun {
	exitCode: number;
	stderr: string;
	text: string;
	stopReason?: string;
	errorMessage?: string;
	turns: number;
	usage: PlanUsage;
	model?: string;
}

function emptyUsage(): PlanUsage {
	return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0, turns: 0 };
}

function getPiInvocation(args: string[]): { command: string; args: string[] } {
	const currentScript = process.argv[1];
	const isBunVirtualScript = currentScript?.startsWith("/$bunfs/root/");
	if (currentScript && !isBunVirtualScript && fs.existsSync(currentScript)) {
		return { command: process.execPath, args: [currentScript, ...args] };
	}
	const execName = path.basename(process.execPath).toLowerCase();
	if (!/^(node|bun)(\.exe)?$/.test(execName)) {
		return { command: process.execPath, args };
	}
	return { command: "pi", args };
}

/** Extract the last assistant text block from a JSON-mode message. */
function assistantText(message: unknown): string {
	const content = (message as { content?: unknown }).content;
	if (!Array.isArray(content)) return "";
	return content
		.filter((part): part is { type: "text"; text: string } =>
			Boolean(part) && typeof part === "object" && (part as { type?: string }).type === "text")
		.map((part) => part.text)
		.join("\n");
}

function truncatePlan(text: string): string {
	if (Buffer.byteLength(text, "utf8") <= MAX_PLAN_BYTES) return text;
	let truncated = text.slice(0, MAX_PLAN_BYTES);
	while (Buffer.byteLength(truncated, "utf8") > MAX_PLAN_BYTES) truncated = truncated.slice(0, -1);
	return `${truncated}\n\n[Plan output truncated; the full text is preserved in the tool details.]`;
}

async function writeArchitectPrompt(contents: string): Promise<{ dir: string; file: string }> {
	const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "cc-loop-plan-"));
	const file = path.join(dir, "architect.md");
	await fs.promises.writeFile(file, contents, { encoding: "utf8", mode: 0o600 });
	return { dir, file };
}

/** Spawn the read-only planner and collect its answer. */
async function runPlanAgent(
	ctx: ExtensionContext,
	instruction: string,
	perspective: string | undefined,
	modelPattern: string | undefined,
	signal: AbortSignal | undefined,
	onProgress: ((text: string) => void) | undefined,
): Promise<PlanRun> {
	const args = [
		"--mode",
		"json",
		"-p",
		"--no-session",
		"--no-extensions",
		"--tools",
		PLAN_TOOL_ALLOW.join(","),
	];
	if (modelPattern && modelPattern.trim() !== "") args.push("--model", modelPattern.trim());
	else if (ctx.model) args.push("--model", `${ctx.model.provider}/${ctx.model.id}`);
	if (ctx.thinkingLevel) args.push("--thinking", ctx.thinkingLevel);

	const prompt = await writeArchitectPrompt(architectPrompt(instruction, perspective));
	const result: PlanRun = {
		exitCode: 0,
		stderr: "",
		text: "",
		turns: 0,
		usage: emptyUsage(),
		model: ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : undefined,
	};
	let lastUpdate = 0;

	try {
		args.push("--append-system-prompt", prompt.file);
		args.push(`Task: ${instruction}`);

		let wasAborted = false;
		const invocation = getPiInvocation(args);
		const exitCode = await new Promise<number>((resolve) => {
			const child = spawn(invocation.command, invocation.args, {
				cwd: ctx.cwd,
				shell: false,
				stdio: ["ignore", "pipe", "pipe"],
			});
			let buffer = "";

			const processLine = (line: string) => {
				if (!line.trim()) return;
				let event: { type?: string; message?: unknown };
				try {
					event = JSON.parse(line);
				} catch {
					return;
				}
				if (event.type !== "message_end" || !event.message) return;
				const message = event.message as {
					role?: string;
					model?: string;
					usage?: {
						input?: number;
						output?: number;
						cacheRead?: number;
						cacheWrite?: number;
						cost?: { total?: number };
					};
					stopReason?: string;
					errorMessage?: string;
				};
				if (message.role !== "assistant") return;

				result.turns += 1;
				const usage = message.usage;
				if (usage) {
					result.usage.input += usage.input ?? 0;
					result.usage.output += usage.output ?? 0;
					result.usage.cacheRead += usage.cacheRead ?? 0;
					result.usage.cacheWrite += usage.cacheWrite ?? 0;
					result.usage.cost += usage.cost?.total ?? 0;
				}
				if (message.model) result.model = message.model;
				if (message.stopReason) result.stopReason = message.stopReason;
				if (message.errorMessage) result.errorMessage = message.errorMessage;
				const text = assistantText(message);
				if (text) result.text = text;

				const now = Date.now();
				if (onProgress && now - lastUpdate >= UPDATE_THROTTLE_MS) {
					lastUpdate = now;
					onProgress(result.text);
				}
			};

			child.stdout.on("data", (data: Buffer) => {
				buffer += data.toString();
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";
				for (const line of lines) processLine(line);
			});
			child.stderr.on("data", (data: Buffer) => {
				result.stderr += data.toString();
			});
			child.on("close", (code) => {
				if (buffer.trim()) processLine(buffer);
				resolve(code ?? 0);
			});
			child.on("error", (error) => {
				result.stderr += `${String(error)}\n`;
				resolve(1);
			});

			if (signal) {
				const kill = () => {
					wasAborted = true;
					child.kill("SIGTERM");
					setTimeout(() => {
						if (!child.killed) child.kill("SIGKILL");
					}, 5000);
				};
				if (signal.aborted) kill();
				else signal.addEventListener("abort", kill, { once: true });
			}
		});

		result.exitCode = exitCode;
		if (wasAborted) throw new Error("plan_agent was aborted");
	} finally {
		try {
			fs.rmSync(prompt.dir, { recursive: true, force: true });
		} catch {
			/* best effort */
		}
	}
	return result;
}

/** Build the `plan_agent` tool. */
export function makePlanAgentTool(config: () => CcLoopConfig, log: LoopLog): ToolDefinition {
	return {
		name: "plan_agent",
		label: "Plan Agent",
		description:
			"Delegate planning to a read-only software-architect subagent (Claude Code PLAN_AGENT analogue). " +
			"Use for implementation planning: the subagent explores the codebase with read-only tools (read, grep, " +
			"find, ls) and returns a step-by-step plan with critical files, without modifying anything. " +
			"Best used before starting a multi-file change; it runs in an isolated context window.",
		promptSnippet: "Delegate read-only implementation planning to an architect subagent",
		promptGuidelines: [
			"Use plan_agent when a task needs an implementation plan before editing, especially for multi-file or architectural changes.",
		],
		parameters: Type.Object({
			instruction: Type.String({
				description:
					"The requirements to plan for: the task, the goal, and any constraints. Include relevant file paths.",
			}),
			perspective: Type.Optional(
				Type.String({
					description:
						"Optional design perspective to apply while planning (for example minimal-diff, performance-first, testability).",
				}),
			),
			model: Type.Optional(
				Type.String({
					description:
						"Optional model pattern for the planner (provider/id or id, for example opencode-go/deepseek-v4-flash). " +
						"Defaults to the current session model. See /cc-loop for a list.",
				}),
			),
		}),
		executionMode: "sequential",
		async execute(_toolCallId, params, signal, onUpdate, ctx) {
			if (!config().enabled) {
				throw new Error("cc-loop-alignment is disabled (run /cc-loop enabled true)");
			}
			const instruction = params.instruction.trim();
			if (!instruction) throw new Error("plan_agent: instruction must not be empty");
			const startedAt = Date.now();
			log(ctx, "plan_agent: read-only planner started");

			const run = await runPlanAgent(ctx, instruction, params.perspective, params.model, signal, (text) => {
				onUpdate?.({
					content: [{ type: "text", text: text || "(planning...)" }],
					details: { running: true },
				});
			});
			const elapsedMs = Date.now() - startedAt;

			if (run.exitCode !== 0) {
				throw new Error(
					`plan_agent failed (exit ${run.exitCode}): ${(run.errorMessage ?? run.stderr.trim()) || "no output"}`,
				);
			}
			if (run.stopReason === "error" || run.stopReason === "aborted") {
				throw new Error(
					`plan_agent ended with stop reason ${run.stopReason}${run.errorMessage ? `: ${run.errorMessage}` : ""}`,
				);
			}
			const plan = run.text.trim();
			if (!plan) throw new Error("plan_agent produced no output");
			const firstLine = plan.split("\n").find((line) => line.trim() !== "") ?? "";
			const summary = firstLine ? `Plan agent「${firstLine.slice(0, 120)}」` : "Plan agent finished";
			log(ctx, `plan_agent: plan ready (${run.turns} turn(s), ${(elapsedMs / 1000).toFixed(1)}s)`);

			return {
				content: [{ type: "text", text: truncatePlan(plan) }],
				details: {
					summary,
					plan,
					stopReason: run.stopReason,
					turns: run.turns,
					model: run.model,
					elapsedMs,
					usage: run.usage,
				},
			};
		},
		renderCall(args, theme) {
			const lens = args.perspective ? ` ${theme.fg("dim", `[${args.perspective}]`)}` : "";
			const preview = args.instruction.length > 80 ? `${args.instruction.slice(0, 80)}…` : args.instruction;
			return new Text(
				`${theme.fg("toolTitle", theme.bold("plan_agent "))}${theme.fg("muted", preview)}${lens}`,
				0,
				0,
			);
		},
		renderResult(result, options, theme) {
			const details = result.details as { summary?: string; turns?: number } | undefined;
			if (options.isPartial) {
				return new Text(theme.fg("warning", "plan_agent: planning..."), 0, 0);
			}
			const head = `${theme.fg("success", "✓ plan_agent ")}${theme.fg("muted", details?.summary ?? "done")}`;
			if (!options.expanded) {
				return new Text(`${head}${theme.fg("dim", ` (${details?.turns ?? 0} turns, ctrl+o to expand)`)}`, 0, 0);
			}
			const body = result.content
				.filter((part): part is { type: "text"; text: string } => part.type === "text")
				.map((part) => part.text)
				.join("\n");
			return new Text(`${head}\n\n${body}`, 0, 0);
		},
	};
}
