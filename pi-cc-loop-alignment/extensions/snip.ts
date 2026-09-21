/**
 * cc-loop-alignment — history snipping (dsh `toolResultPruner` + `snip` tool).
 *
 * pi extensions cannot rewrite session history; the `context` hook is the only
 * place a request can be reshaped, and it is non-destructive. Both mechanisms
 * therefore work by recording an intent and projecting it on every request:
 *
 * - Automatic snip pass: once measured context pressure reaches `snipAtRatio`,
 *   the content of older `toolResult` messages is replaced with a one-line
 *   placeholder. `toolCall`/`toolResult` pairing is preserved, so providers
 *   never see orphaned tool calls.
 * - `snip` tool: the model deletes the oldest part of the conversation, either
 *   by message count (`keep_recent`) or by an approximate token budget
 *   (`keep_recent_tokens`). The cut is rounded forward to the most recent user
 *   turn, the removed prefix is replaced by a single placeholder, and
 *   compaction/branch summaries are never dropped. The intent is persisted with
 *   a custom session entry so a resumed session keeps the snipped view.
 */

import { Type } from "typebox";
import { Text } from "@earendil-works/pi-tui";
import type { ExtensionAPI, ExtensionContext, ToolDefinition } from "@earendil-works/pi-coding-agent";
import type { CcLoopConfig, CcLoopStats } from "./config.ts";
import { scalePressureRatio } from "./config.ts";
import type { LoopLog } from "./loop.ts";
import { prunedToolResultPlaceholder, snipPlaceholder } from "./prompts.ts";

/** Custom session entry that remembers the model-requested snip across reloads. */
const SNIP_ENTRY_TYPE = "cc-loop-snip";
/** Marker prefix used to detect already-pruned tool results. */
const PRUNED_PREFIX = "[tool result snipped";
/** Default number of trailing messages kept by the `snip` tool. */
const DEFAULT_KEEP_RECENT = 15;

interface MinimalMessage {
	role?: string;
	content?: unknown;
	timestamp?: number;
	[k: string]: unknown;
}

const PROTECTED_ROLES = new Set(["custom", "branchSummary", "compactionSummary"]);

function isProtected(message: MinimalMessage | undefined): boolean {
	return message?.role !== undefined && PROTECTED_ROLES.has(message.role);
}

function textOfContent(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	let text = "";
	for (const part of content) {
		if (part && typeof part === "object" && (part as { type?: string }).type === "text") {
			text += String((part as { text?: unknown }).text ?? "");
		}
	}
	return text;
}

function alreadyPruned(message: MinimalMessage): boolean {
	return textOfContent(message.content).startsWith(PRUNED_PREFIX);
}

function makeUserMessage(text: string): MinimalMessage {
	return { role: "user", content: [{ type: "text", text }], timestamp: Date.now() };
}

function prependToUserMessage(message: MinimalMessage, text: string): MinimalMessage {
	const content = message.content;
	if (typeof content === "string") return { ...message, content: `${text}\n\n${content}` };
	if (Array.isArray(content)) return { ...message, content: [{ type: "text", text }, ...content] };
	return { ...message, content: [{ type: "text", text }] };
}

/** Replace the content of all but the newest `keepToolResults` tool results. */
function pruneToolResults(
	messages: MinimalMessage[],
	keepToolResults: number,
): MinimalMessage[] {
	const indexes: number[] = [];
	for (let index = 0; index < messages.length; index += 1) {
		if (messages[index].role === "toolResult") indexes.push(index);
	}
	if (indexes.length <= keepToolResults) return messages;
	const cutoff = indexes[indexes.length - keepToolResults];
	let changed = false;
	const placeholder = prunedToolResultPlaceholder(indexes.length - keepToolResults);
	const next = messages.map((message, index) => {
		if (index >= cutoff || message.role !== "toolResult" || alreadyPruned(message)) return message;
		changed = true;
		return { ...message, content: [{ type: "text", text: placeholder }] };
	});
	return changed ? next : messages;
}

/**
 * Replace the oldest tool results (full content -> placeholder) until the
 * estimated size of the request stays under `budgetTokens`. Works on the
 * oldest messages first so the newest tool results stay intact.
 */
function pruneToolResultsToBudget(
	messages: MinimalMessage[],
	budgetTokens: number,
): MinimalMessage[] {
	if (budgetTokens <= 0) return messages;
	let current = approximateTokens(messages);
	if (current <= budgetTokens) return messages;
	const next = messages.slice();
	const placeholder = prunedToolResultPlaceholder();
	let changed = false;
	for (let index = 0; index < next.length && current > budgetTokens; index += 1) {
		const message = next[index];
		if (message.role !== "toolResult" || alreadyPruned(message)) continue;
		const before = estimateTokensOfMessage(message);
		next[index] = { ...message, content: [{ type: "text", text: placeholder }] };
		current = current - before + estimateTokensOfMessage(next[index]);
		changed = true;
	}
	return changed ? next : messages;
}

/**
 * Shared tail of the prefix cut: round the target index forward to a user
 * message (never leave a dangling tool result), then never drop summaries.
 * Returns the cut index, or undefined when nothing can be removed.
 */
function finalizePrefixCut(messages: MinimalMessage[], targetIndex: number): number | undefined {
	if (targetIndex <= 0 || targetIndex >= messages.length) return undefined;
	let cut = targetIndex;
	while (cut < messages.length && messages[cut]?.role !== "user") cut += 1;
	if (cut >= messages.length) return undefined;
	for (let index = 0; index < cut; index += 1) {
		if (isProtected(messages[index])) {
			cut = index;
			break;
		}
	}
	return cut > 0 ? cut : undefined;
}

/**
 * Choose where to cut a prefix snip by message count.
 *
 * The kept tail may never start on an orphan assistant/toolResult message
 * (pi projections cannot leave a dangling tool call), so the cut is rounded
 * forward to the start of the most recent user turn: everything before that
 * user message is dropped. `keepRecent` is therefore an upper bound on the
 * kept tail, and compaction/branch summaries are never dropped.
 */
export function planPrefixSnip(messages: MinimalMessage[], keepRecent: number): number | undefined {
	const target = messages.length - keepRecent;
	if (target <= 0) return undefined;
	return finalizePrefixCut(messages, target);
}

/**
 * Choose where to cut a prefix snip by an approximate token budget: keep the
 * newest tail whose messages sum to at most `budgetTokens` (Claude Code keeps
 * the recent tail by weight too). Same user-boundary rounding as the count
 * variant applies.
 */
export function planPrefixSnipTokens(messages: MinimalMessage[], budgetTokens: number): number | undefined {
	if (budgetTokens <= 0 || messages.length === 0) return undefined;
	let target = messages.length;
	let accrued = 0;
	while (target > 0) {
		const tokens = estimateTokensOfMessage(messages[target - 1]);
		if (accrued + tokens > budgetTokens) break;
		accrued += tokens;
		target -= 1;
	}
	return finalizePrefixCut(messages, target);
}

function applyPrefixSnip(
	messages: MinimalMessage[],
	cut: number,
	placeholder: string,
): MinimalMessage[] {
	const kept = messages.slice(cut);
	const first = kept[0];
	if (first === undefined) return messages;
	if (first.role === "user") {
		kept[0] = prependToUserMessage(first, placeholder);
	} else if (!isProtected(first)) {
		kept.unshift(makeUserMessage(placeholder));
	}
	return kept;
}

function estimateSerializedTokens(value: unknown): number {
	if (typeof value === "string") return Math.max(1, Math.round(value.length / 4));
	let serialized = "";
	try {
		serialized = JSON.stringify(value) ?? "";
	} catch {
		serialized = String(value);
	}
	return Math.max(1, Math.round(serialized.length / 4));
}

/**
 * Estimate content tokens without throwing away non-text blocks. In
 * particular, assistant tool calls, their JSON arguments, thinking blocks,
 * and image payload metadata all contribute to context pressure.
 */
function estimateContentTokens(content: unknown): number {
	if (typeof content === "string") return estimateSerializedTokens(content);
	if (!Array.isArray(content)) return estimateSerializedTokens(content);
	return Math.max(
		1,
		content.reduce((total, part) => {
			if (part && typeof part === "object") {
				const type = (part as { type?: string }).type;
				if (type === "text" || type === "thinking") {
					return total + estimateSerializedTokens((part as { text?: unknown }).text ?? "");
				}
			}
			return total + estimateSerializedTokens(part);
		}, 0),
	);
}

/**
 * Rough token estimate of one message (~4 chars/token, min 1), including
 * message envelope fields that are omitted by text-only estimators.
 */
function estimateTokensOfMessage(message: MinimalMessage | undefined): number {
	if (!message) return 0;
	const envelope = {
		role: message.role,
		toolCallId: message.toolCallId,
		toolName: message.toolName,
	};
	return Math.max(1, estimateContentTokens(message.content) + estimateSerializedTokens(envelope));
}

function approximateTokens(messages: MinimalMessage[]): number {
	return messages.reduce((total, message) => total + estimateTokensOfMessage(message), 0);
}

export class SnipController {
	/** Messages from the most recent `context` event (pre-projection). */
	private lastMessages: MinimalMessage[] | undefined;
	/** Persisted model-requested prefix snip, if any. */
	private snipKeep: number | undefined;
	private snipKeepTokens: number | undefined;
	private snipReason: string | undefined;
	/** Edge-triggered: count/log the automatic pass once per pressure episode. */
	private autoSnipArmed = false;

	constructor(
		private readonly pi: ExtensionAPI,
		private readonly config: () => CcLoopConfig,
		private readonly stats: CcLoopStats,
		private readonly log: LoopLog,
	) {}

	/** Rebuild the latest persisted snip intent from session custom entries. */
	restore(ctx: ExtensionContext): void {
		this.snipKeep = undefined;
		this.snipKeepTokens = undefined;
		this.snipReason = undefined;
		this.lastMessages = undefined;
		this.autoSnipArmed = false;

		// A session can contain multiple snip entries. The latest one is the
		// authoritative mode; do not merge an old count-mode entry with a newer
		// token-mode entry (or vice versa).
		let latest:
			| { keepRecent?: unknown; keepRecentTokens?: unknown; reason?: unknown }
			| undefined;
		for (const entry of ctx.sessionManager.getEntries()) {
			if (entry.type !== "custom" || entry.customType !== SNIP_ENTRY_TYPE) continue;
			latest = entry.data as typeof latest;
		}
		if (!latest) return;
		if (typeof latest.keepRecent === "number" && Number.isFinite(latest.keepRecent)) {
			this.snipKeep = Math.max(1, Math.trunc(latest.keepRecent));
		}
		if (typeof latest.keepRecentTokens === "number" && Number.isFinite(latest.keepRecentTokens)) {
			this.snipKeepTokens = Math.max(1, Math.trunc(latest.keepRecentTokens));
		}
		this.snipReason = typeof latest.reason === "string" ? latest.reason : undefined;
	}

	/** Project the snip pass and any model-requested snip onto this request. */
	onContext(event: { messages: unknown[] }, ctx: ExtensionContext): { messages: unknown[] } | undefined {
		const config = this.config();
		const messages = event.messages as MinimalMessage[];
		this.lastMessages = messages;
		if (!config.enabled) return undefined;

		let projected = messages;
		let changed = false;

		if (this.snipKeep !== undefined || this.snipKeepTokens !== undefined) {
			const cut =
				this.snipKeepTokens !== undefined
					? planPrefixSnipTokens(projected, this.snipKeepTokens)
					: planPrefixSnip(projected, this.snipKeep ?? 1);
			if (cut !== undefined) {
				projected = applyPrefixSnip(projected, cut, snipPlaceholder(this.snipReason));
				changed = true;
			}
		}

		if (config.snipAtRatio > 0) {
			const usage = ctx.getContextUsage();
			const threshold = usage ? scalePressureRatio(config.snipAtRatio, usage.contextWindow) : config.snipAtRatio;
			const ratio = usage && usage.percent !== null ? usage.percent / 100 : undefined;
			if (ratio !== undefined && ratio >= threshold) {
				const pruned =
					config.snipKeepTailTokens > 0
						? pruneToolResultsToBudget(projected, config.snipKeepTailTokens)
						: pruneToolResults(projected, config.snipKeepToolResults);
				if (pruned !== projected) {
					projected = pruned;
					changed = true;
					if (!this.autoSnipArmed) {
						this.autoSnipArmed = true;
						this.stats.autoSnips += 1;
						this.log(
							ctx,
							`snip pass at ${Math.round(usage.percent)}% context pressure` +
								(config.snipKeepTailTokens > 0
									? ` (keep ~${config.snipKeepTailTokens} tokens)`
									: ` (keep ${config.snipKeepToolResults} tool results)`),
						);
					}
				}
			} else if (ratio !== undefined && this.autoSnipArmed && ratio < threshold * 0.9) {
				// Hysteresis: re-arm only after pressure has clearly dropped.
				this.autoSnipArmed = false;
			}
		}

		return changed ? { messages: projected } : undefined;
	}

	/** The model-facing `snip` tool. */
	get tool(): ToolDefinition {
		return snipToolDefinition(this);
	}

	/**
	 * Executes a model-requested prefix snip. Called by the tool definition.
	 * @param keepRecentInput message-count keep mode (default 15)
	 * @param keepRecentTokensInput approximate token-budget keep mode (wins over count)
	 */
	runSnip(
		keepRecentInput: number | undefined,
		keepRecentTokensInput: number | undefined,
		reasonInput: string | undefined,
		ctx: ExtensionContext,
	): { removed: number; kept: number; approxTokensFreed: number; message: string } {
		const config = this.config();
		if (!config.enabled) {
			throw new Error("cc-loop-alignment is disabled (run /cc-loop enabled true)");
		}
		const messages = this.lastMessages;
		if (!messages) throw new Error("snip: no request context captured yet; try again after the next step");

		const reason = typeof reasonInput === "string" ? reasonInput.slice(0, 200) : undefined;
		const mode = keepRecentTokensInput !== undefined ? "tokens" : "count";
		let cut: number | undefined;
		let keepLabel: string;
		if (mode === "tokens") {
			const budget = Math.max(1, Math.trunc(keepRecentTokensInput));
			cut = planPrefixSnipTokens(messages, budget);
			keepLabel = `~${budget} tokens`;
		} else {
			let keep = DEFAULT_KEEP_RECENT;
			if (typeof keepRecentInput === "number" && Number.isFinite(keepRecentInput)) {
				keep = Math.max(1, Math.trunc(keepRecentInput));
			}
			cut = planPrefixSnip(messages, keep);
			keepLabel = `${keep} messages`;
		}
		if (cut === undefined) {
			return {
				removed: 0,
				kept: messages.length,
				approxTokensFreed: 0,
				message: `snip: nothing to remove (${messages.length} messages, keeping ${keepLabel}).`,
			};
		}

		const removed = cut;
		const kept = messages.length - cut;
		const approxTokensFreed = approximateTokens(messages.slice(0, cut));
		this.snipKeep = mode === "count" ? (typeof keepRecentInput === "number" ? Math.max(1, Math.trunc(keepRecentInput)) : DEFAULT_KEEP_RECENT) : undefined;
		this.snipKeepTokens = mode === "tokens" ? Math.max(1, Math.trunc(keepRecentTokensInput)) : undefined;
		this.snipReason = reason;
		this.stats.snipToolRuns += 1;
		this.pi.appendEntry(SNIP_ENTRY_TYPE, {
			keepRecent: this.snipKeep,
			keepRecentTokens: this.snipKeepTokens,
			removed,
			reason,
			at: Date.now(),
		});
		this.log(ctx, `snip tool: removed ${removed} message(s) (~${approxTokensFreed} tokens)`);
		return {
			removed,
			kept,
			approxTokensFreed,
			message:
				`snip: removed the ${removed} oldest message(s), kept ${kept} ` +
				`(~${approxTokensFreed} tokens freed, keeping ${keepLabel}). The snipped view applies from the ` +
				"next request and replaces the removed history with one placeholder.",
		};
	}
}

function snipToolDefinition(controller: SnipController): ToolDefinition {
	return {
		name: "snip",
		label: "Snip History",
		description:
			"Remove the oldest part of the conversation history at your discretion (Claude Code SnipTool analogue). " +
			"Deletes every message before the most recent `keep_recent` messages and replaces them with one small " +
			"placeholder, freeing context without summarization. Use when early discussion is no longer relevant. " +
			"Returns how many messages and approximate tokens were removed.",
		promptSnippet: "Drop the oldest conversation history when early discussion became irrelevant",
		promptGuidelines: [
			"Use snip when early conversation history is no longer relevant and context pressure is high; this is cheaper than asking for a summary.",
		],
		parameters: Type.Object({
			keep_recent: Type.Optional(
				Type.Integer({
					minimum: 1,
					description: `How many of the most recent messages to keep (count mode). Default ${DEFAULT_KEEP_RECENT}. Conflicts with keep_recent_tokens.`,
				}),
			),
			keep_recent_tokens: Type.Optional(
				Type.Integer({
					minimum: 1,
					description:
						"Approximate tokens to keep in the recent tail (token mode; wins over keep_recent). " +
						"Keeps the newest messages whose combined size stays under this budget.",
				}),
			),
			reason: Type.Optional(
				Type.String({ description: "Optional one-line reason, recorded in the placeholder text." }),
			),
		}),
		executionMode: "sequential",
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			const result = controller.runSnip(
				params.keep_recent,
				params.keep_recent_tokens,
				params.reason,
				ctx,
			);
			return {
				content: [{ type: "text", text: result.message }],
				details: {
					removed: result.removed,
					kept: result.kept,
					approxTokensFreed: result.approxTokensFreed,
				},
			};
		},
		renderCall(args, theme) {
			const mode =
				args.keep_recent_tokens !== undefined
					? `keep ~${args.keep_recent_tokens} tokens`
					: `keep ${args.keep_recent ?? DEFAULT_KEEP_RECENT}`;
			const reason = args.reason ? ` ${theme.fg("dim", `"${args.reason}"`)}` : "";
			return new Text(`${theme.fg("toolTitle", theme.bold("snip "))}${theme.fg("muted", mode)}${reason}`, 0, 0);
		},
		renderResult(result, _options, theme) {
			const details = result.details as { removed?: number; kept?: number; approxTokensFreed?: number } | undefined;
			if (!details || !details.removed) {
				return new Text(theme.fg("muted", "snip: nothing removed"), 0, 0);
			}
			const text =
				theme.fg("success", "✓ snip ") +
				theme.fg("muted", `removed ${details.removed}, kept ${details.kept ?? 0}`) +
				theme.fg("dim", ` (~${details.approxTokensFreed ?? 0} tokens)`);
			return new Text(text, 0, 0);
		},
	};
}
