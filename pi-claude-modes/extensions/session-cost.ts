/**
 * session-cost — 在 pi 底部状态栏实时显示当前会话累计费用。
 *
 * 费用会同时写入 pi 状态栏并广播给 pi-claude-modes，后者把它并入
 * Claude Code 风格的输入框下方状态行。`/cost` 提供 token 与费用分解。
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const STATUS_KEY = "session-cost";
const STATUS_EVENT = "session-cost:update";
const USD_TO_CNY = 7.1;

interface CostTotals {
	cost: number;
	input: number;
	output: number;
	cacheRead: number;
	cacheWrite: number;
}

function computeSessionTotals(entries: readonly unknown[]): CostTotals {
	const totals: CostTotals = { cost: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
	for (const raw of entries) {
		if (!raw || typeof raw !== "object") continue;
		const entry = raw as {
			type?: string;
			message?: { role?: string; usage?: unknown };
			usage?: unknown;
		};
		let usage: unknown;
		if (entry.type === "message") {
			const message = entry.message;
			if (message?.role === "assistant") usage = message.usage;
			else if (message?.role === "toolResult" && message.usage) usage = message.usage;
		} else if ((entry.type === "branch_summary" || entry.type === "compaction") && entry.usage) {
			usage = entry.usage;
		}
		if (!usage || typeof usage !== "object") continue;
		const value = usage as {
			input?: number;
			output?: number;
			cacheRead?: number;
			cacheWrite?: number;
			cost?: { total?: number };
		};
		totals.cost += value.cost?.total ?? 0;
		totals.input += value.input ?? 0;
		totals.output += value.output ?? 0;
		totals.cacheRead += value.cacheRead ?? 0;
		totals.cacheWrite += value.cacheWrite ?? 0;
	}
	return totals;
}

function formatUsd(cost: number): string {
	return `$${cost.toFixed(3)}`;
}

function updateStatus(pi: ExtensionAPI, ctx: ExtensionContext): void {
	const { cost } = computeSessionTotals(ctx.sessionManager.getEntries());
	const usd = formatUsd(cost);
	const text = cost > 0 ? `💰 ${usd} ≈¥${(cost * USD_TO_CNY).toFixed(2)}` : `💰 ${usd}`;
	ctx.ui.setStatus(STATUS_KEY, ctx.ui.theme.fg("accent", text));
	pi.events.emit(STATUS_EVENT, { text, cost });
}

export default function sessionCostExtension(pi: ExtensionAPI): void {
	pi.on("session_start", (_event, ctx) => updateStatus(pi, ctx));
	pi.on("message_end", (_event, ctx) => updateStatus(pi, ctx));
	pi.on("agent_settled", (_event, ctx) => updateStatus(pi, ctx));
	pi.on("session_before_switch", (_event, ctx) => updateStatus(pi, ctx));

	pi.registerCommand("cost", {
		description: "Show current session cost & token breakdown",
		handler: async (_args, ctx) => {
			if (!ctx.hasUI) return;
			const totals = computeSessionTotals(ctx.sessionManager.getEntries());
			const promptTokens = totals.input + totals.cacheRead + totals.cacheWrite;
			const cny = (totals.cost * USD_TO_CNY).toFixed(2);
			const lines = [
				"── Session Cost ──",
				`Total: ${formatUsd(totals.cost)}  (≈ ¥${cny})`,
				"",
				"Tokens:",
				`  Input:    ${promptTokens.toLocaleString()}`,
				`  Cached:   ${totals.cacheRead.toLocaleString()}`,
				`  Output:   ${totals.output.toLocaleString()}`,
				`  Total:    ${(promptTokens + totals.output).toLocaleString()}`,
				"",
				`File: ${ctx.sessionManager.getSessionFile() ?? "in-memory"}`,
			].join("\n");
			ctx.ui.notify(lines, "info");
		},
	});
}
