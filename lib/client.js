window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-long-task",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region bundled module
		const css$6 = ".i0ChjG_panel{box-sizing:border-box;border-left:.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);width:100%;min-width:0;height:100%;min-height:0;color:var(--dsw-alias-label-primary);flex:auto;padding:20px 16px;font:13px/20px system-ui,sans-serif;overflow-y:auto}.i0ChjG_header{justify-content:space-between;align-items:flex-start;margin-bottom:18px;display:flex}.i0ChjG_header h2{letter-spacing:-.3px;margin:0;font-size:16px;font-weight:500}.i0ChjG_header p{color:var(--dsw-alias-label-tertiary);margin:4px 0 0;font-size:11px}.i0ChjG_close,.i0ChjG_toggle{color:inherit;cursor:pointer;font:inherit;background:0 0;border:0;border-radius:6px}.i0ChjG_close{padding:0 5px;font-size:22px;line-height:26px}.i0ChjG_toggle{align-items:center;gap:5px;padding:5px 8px;display:inline-flex}.i0ChjG_toggle>span:first-child{font-size:18px}.i0ChjG_toggle:hover,.i0ChjG_close:hover{background:var(--dsw-specific-tip)}.i0ChjG_toggle:focus-visible,.i0ChjG_close:focus-visible,.i0ChjG_step summary:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:3px}.i0ChjG_status{color:var(--dsw-alias-state-business-primary);align-items:center;gap:7px;font-size:12px;display:flex}.i0ChjG_dot,.i0ChjG_toolDot{background:currentColor;border-radius:50%;flex:none;width:6px;height:6px}.i0ChjG_status[data-phase=done]{color:var(--dsw-alias-state-success-primary)}.i0ChjG_status[data-phase=error]{color:var(--dsw-alias-state-error-primary)}.i0ChjG_status[data-phase=waiting],.i0ChjG_status[data-phase=limited],.i0ChjG_status[data-phase=blocked]{color:var(--dsw-alias-state-warn-label)}.i0ChjG_status[data-phase=idle],.i0ChjG_status[data-phase=aborted],.i0ChjG_status[data-phase=interrupted]{color:var(--dsw-alias-label-tertiary)}.i0ChjG_metrics{border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:repeat(3,1fr);gap:8px;padding:18px 0;display:grid}.i0ChjG_metrics div{flex-direction:column;gap:3px;display:flex}.i0ChjG_metrics strong{font-variant-numeric:tabular-nums;font-size:23px;font-weight:500}.i0ChjG_metrics span{color:var(--dsw-alias-label-tertiary);font-size:11px}.i0ChjG_usage{border-bottom:.5px solid var(--dsw-alias-border-l1);padding:16px 0}.i0ChjG_usage header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;display:flex}.i0ChjG_usage h3{margin:0;font-size:13px;font-weight:500}.i0ChjG_usageScopes{gap:4px;display:flex}.i0ChjG_usageScopes button{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:4px;padding:4px 7px;font-size:12px}.i0ChjG_usageScopes button[aria-pressed=true]{color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent)}.i0ChjG_usageScopes button:focus-visible,.i0ChjG_usageDetails summary:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color);outline-offset:2px}.i0ChjG_usageTotal{color:var(--dsw-alias-label-secondary);margin:12px 0 4px}.i0ChjG_usageTotal strong{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);font-size:20px;font-weight:500}.i0ChjG_usageOutcomes{color:var(--dsw-alias-label-secondary);margin:0 0 10px;font-size:12px}.i0ChjG_usageDetails summary{cursor:pointer;font-size:12px}.i0ChjG_usageList{max-height:280px;margin:8px 0 0;padding:0;list-style:none;overflow-y:auto}.i0ChjG_usageList li{border-top:.5px solid var(--dsw-alias-border-l1);padding:8px 0}.i0ChjG_usageList li>div{justify-content:space-between;align-items:baseline;gap:12px;display:flex}.i0ChjG_usageList code{overflow-wrap:anywhere;min-width:0;font-size:11px}.i0ChjG_usageList strong{font-variant-numeric:tabular-nums;flex:none;font-size:12px;font-weight:500}.i0ChjG_usageList p{color:var(--dsw-alias-label-secondary);margin:3px 0 0;font-size:11px}.i0ChjG_usageHint{color:var(--dsw-alias-label-tertiary);margin:10px 0 0;font-size:11px;line-height:16px}.i0ChjG_diagram{gap:12px;margin:22px 0 26px;display:flex}.i0ChjG_stages{flex:1;min-width:0;margin:0;padding:0;list-style:none}.i0ChjG_stage{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;align-items:center;gap:10px;margin-bottom:16px;padding:11px 9px;display:flex;position:relative}.i0ChjG_stage:not(:last-child):after{content:\"↓\";color:var(--dsw-alias-label-tertiary);line-height:17px;position:absolute;top:100%;left:22px}.i0ChjG_stage:last-child{margin-bottom:0}.i0ChjG_stageNumber{color:var(--dsw-alias-label-tertiary);font:11px ui-monospace,monospace}.i0ChjG_stage>div{flex-direction:column;gap:2px;min-width:0;display:flex}.i0ChjG_stage strong{font-size:12px;font-weight:500}.i0ChjG_stage div span{color:var(--dsw-alias-label-tertiary);font-size:10px}.i0ChjG_stage[data-current]{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 5%, transparent)}.i0ChjG_stage[data-passed] .i0ChjG_stageNumber{color:var(--dsw-alias-state-success-primary)}.i0ChjG_stageMarker{color:var(--dsw-alias-state-business-primary);margin-left:auto;font-size:9px}.i0ChjG_returnPath{border-right:1px dashed var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary);flex-direction:column;justify-content:space-between;align-items:center;margin:92px 0 16px;padding-right:5px;display:flex}.i0ChjG_returnPath span:nth-child(2){writing-mode:vertical-rl;letter-spacing:1px;font-size:10px}.i0ChjG_history>summary{cursor:pointer;align-items:center;gap:8px;padding:8px 0;list-style:none;display:flex}.i0ChjG_history>summary:before{content:\"▾\";color:var(--dsw-alias-label-tertiary)}.i0ChjG_history:not([open])>summary:before{content:\"▸\"}.i0ChjG_history>summary::-webkit-details-marker{display:none}.i0ChjG_history>summary h3{flex:1;margin:0;font-size:12px;font-weight:500}.i0ChjG_history>summary>span{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;font-size:11px}.i0ChjG_history>summary:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color);outline-offset:2px}.i0ChjG_historyBody{overscroll-behavior:contain;scrollbar-gutter:stable;max-height:min(360px,45vh);padding-right:4px;overflow-y:auto}.i0ChjG_step{border-top:.5px solid var(--dsw-alias-border-l1);padding:8px 0}.i0ChjG_step summary{cursor:pointer;justify-content:space-between;align-items:center;list-style:none;display:flex}.i0ChjG_step summary:before{content:\"▾\";color:var(--dsw-alias-label-tertiary);margin-right:6px}.i0ChjG_step:not([open]) summary:before{content:\"▸\"}.i0ChjG_step summary>span:first-child{flex:1}.i0ChjG_step summary>span:last-child{color:var(--dsw-alias-label-tertiary);font:11px ui-monospace,monospace}.i0ChjG_tools{margin:9px 0 0;padding:0;list-style:none}.i0ChjG_tools li{color:var(--dsw-alias-state-success-primary);align-items:center;gap:7px;margin:7px 0;display:flex}.i0ChjG_tools code{color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:11px;overflow:hidden}.i0ChjG_tools li>span:last-child{flex:none;font-size:10px}.i0ChjG_tools li[data-tool-status=running]{color:var(--dsw-alias-state-business-primary)}.i0ChjG_tools li[data-tool-status=error]{color:var(--dsw-alias-state-error-primary)}.i0ChjG_tools li[data-tool-status=interrupted]{color:var(--dsw-alias-label-tertiary)}.i0ChjG_notice,.i0ChjG_noTools,.i0ChjG_finishReason,.i0ChjG_reason,.i0ChjG_footer{color:var(--dsw-alias-label-tertiary);font-size:11px}.i0ChjG_finishReason{margin-top:5px;font-family:ui-monospace,monospace;display:inline-block}.i0ChjG_noTools{margin:7px 0 0}.i0ChjG_reason{margin-top:14px}.i0ChjG_footer{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:18px;font-size:10px}.i0ChjG_footer p{margin:5px 0 0}.i0ChjG_completion{flex-wrap:wrap;align-items:baseline;gap:8px;margin-top:16px;display:flex}.i0ChjG_completion>span:first-child{color:var(--dsw-alias-label-secondary)}.i0ChjG_completion strong{font-variant-numeric:tabular-nums;font-size:20px;font-weight:500}.i0ChjG_reviewOutcome{margin-left:auto;font-size:12px}.i0ChjG_assessments{margin-bottom:24px}.i0ChjG_assessments h3{margin:0 0 8px;font-size:13px;font-weight:500}.i0ChjG_assessments>p{margin:0 0 12px}.i0ChjG_reviewTurn{border-top:.5px solid var(--dsw-alias-border-l1);padding:12px 0}.i0ChjG_reviewTurn>summary{cursor:pointer;flex-wrap:wrap;gap:8px;display:flex}.i0ChjG_reviewTurn>summary:before,.i0ChjG_review summary:before{content:\"▸\";color:var(--dsw-alias-label-secondary)}.i0ChjG_reviewTurn[open]>summary:before,.i0ChjG_review[open]>summary:before{content:\"▾\"}.i0ChjG_reviewTurn>summary>span:last-child{color:var(--dsw-alias-label-secondary);margin-left:auto;font-size:12px}.i0ChjG_review{padding:12px 0 0}.i0ChjG_review summary{cursor:pointer;flex-wrap:wrap;align-items:baseline;gap:8px;display:flex}.i0ChjG_review summary>span:first-child{flex-direction:column;flex:1;min-width:100px;display:flex}.i0ChjG_review summary small{color:var(--dsw-alias-label-secondary);font-size:12px}.i0ChjG_review summary strong,.i0ChjG_stepReview strong{font-variant-numeric:tabular-nums;font-weight:500}.i0ChjG_reviewDetails{color:var(--dsw-alias-label-secondary);margin:12px 0 0}.i0ChjG_reviewDetails>div{flex-wrap:wrap;gap:8px;margin-top:4px;display:flex}.i0ChjG_reviewDetails dt{flex:1}.i0ChjG_reviewDetails dd{font-variant-numeric:tabular-nums;margin:0}.i0ChjG_reviewError{overflow-wrap:anywhere;color:var(--dsw-alias-state-error-primary);margin:12px 0 0}.i0ChjG_stepReview{flex-wrap:wrap;align-items:baseline;gap:8px;margin-top:8px;font-size:12px;display:flex}.i0ChjG_completion[data-outcome=passed] .i0ChjG_reviewOutcome,.i0ChjG_review[data-outcome=passed] .i0ChjG_reviewOutcome,.i0ChjG_stepReview[data-outcome=passed]{color:var(--dsw-alias-state-success-primary)}.i0ChjG_completion[data-outcome=repair] .i0ChjG_reviewOutcome,.i0ChjG_review[data-outcome=repair] .i0ChjG_reviewOutcome,.i0ChjG_stepReview[data-outcome=repair]{color:var(--dsw-alias-state-warn-label)}.i0ChjG_completion[data-outcome=blocked] .i0ChjG_reviewOutcome,.i0ChjG_completion[data-outcome=error] .i0ChjG_reviewOutcome,.i0ChjG_review[data-outcome=blocked] .i0ChjG_reviewOutcome,.i0ChjG_review[data-outcome=error] .i0ChjG_reviewOutcome,.i0ChjG_stepReview[data-outcome=blocked],.i0ChjG_stepReview[data-outcome=error]{color:var(--dsw-alias-state-error-primary)}.i0ChjG_review summary:focus-visible,.i0ChjG_reviewTurn>summary:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:3px}.i0ChjG_taskSummary{margin:16px 0 0}.i0ChjG_taskSummary>div{flex-wrap:wrap;align-items:baseline;gap:8px;display:flex}.i0ChjG_taskSummary>div strong{font-variant-numeric:tabular-nums;font-size:20px;font-weight:500}.i0ChjG_taskSummary>p{color:var(--dsw-alias-label-secondary);margin:4px 0 12px}.i0ChjG_taskItems{margin:12px 0 0;padding:0;list-style:none}.i0ChjG_taskItems>li{border-top:.5px solid var(--dsw-alias-border-l1);padding:12px 0}.i0ChjG_taskItems summary{cursor:pointer;flex-wrap:wrap;align-items:baseline;gap:8px;display:flex}.i0ChjG_taskItems summary>span:first-child{overflow-wrap:anywhere;flex:1;min-width:100px}.i0ChjG_taskItems summary strong{font-variant-numeric:tabular-nums;font-weight:500}.i0ChjG_taskItems summary>span:last-child{color:var(--dsw-alias-label-secondary);font-size:12px}.i0ChjG_taskItems li[data-passed=true] summary>span:last-child{color:var(--dsw-alias-state-success-primary)}.i0ChjG_taskItems p{overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary);margin:8px 0 0}.i0ChjG_taskItems .i0ChjG_taskGap{color:var(--dsw-alias-state-warn-label)}.i0ChjG_taskItems summary:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color);outline-offset:3px}.i0ChjG_completionDialog{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);width:min(520px,100vw - 32px);max-height:min(80vh,680px);color:var(--dsw-alias-label-primary);border-radius:14px;padding:22px;font:13px/20px system-ui,sans-serif;overflow:auto;box-shadow:0 18px 54px #00000038}.i0ChjG_completionDialog::backdrop{background:#00000052}.i0ChjG_completionDialogHeader{justify-content:space-between;align-items:flex-start;gap:18px;display:flex}.i0ChjG_completionDialogHeader h2{margin:0;font-size:17px;font-weight:550}.i0ChjG_completionDialogHeader p{max-width:420px;color:var(--dsw-alias-label-tertiary);margin:5px 0 0;font-size:11px;line-height:16px}.i0ChjG_completionOverall{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 6%, transparent);border-radius:10px;flex-wrap:wrap;align-items:baseline;gap:10px;margin-top:20px;padding:14px;display:flex}.i0ChjG_completionOverall strong{font-variant-numeric:tabular-nums;font-size:24px;font-weight:550}.i0ChjG_completionOverall>span:first-child{color:var(--dsw-alias-label-secondary)}.i0ChjG_completionOverall>span:last-child{color:var(--dsw-alias-label-secondary);margin-left:auto}.i0ChjG_completionNoticeItems{margin-top:18px}.i0ChjG_completionNoticeItems h3{margin:0 0 6px;font-size:12px;font-weight:550}.i0ChjG_completionNoticeItems ul{margin:0;padding:0;list-style:none}.i0ChjG_completionNoticeItems li{border-top:1px solid var(--dsw-alias-border-l1);justify-content:space-between;gap:16px;padding:9px 0;display:flex}.i0ChjG_completionNoticeItems li>span{overflow-wrap:anywhere;min-width:0}.i0ChjG_completionNoticeItems li>strong{color:var(--dsw-alias-label-secondary);text-align:right;flex:none;font-size:11px;font-weight:500}.i0ChjG_completionNoticeItems li[data-passed=true]>strong{color:var(--dsw-alias-state-success-primary)}.i0ChjG_planInfo{border-bottom:.5px solid var(--dsw-alias-border-l1);overflow-wrap:anywhere;padding:12px 0;font-size:13px;line-height:20px}.i0ChjG_planInfo p{margin:8px 0}.i0ChjG_planInfo summary{cursor:pointer}.i0ChjG_planInfo code{white-space:normal}.i0ChjG_taskRequirement{color:var(--dsw-alias-label-secondary);white-space:pre-wrap;overflow-wrap:anywhere}";
		const tagId$6 = "@deepseek-ai/dsh-long-task/LoopPanel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId$6;
			tag.textContent = css$6;
			document.head.appendChild(tag);
		}
		var LoopPanel_module_css_default = {
			"assessments": "i0ChjG_assessments",
			"close": "i0ChjG_close",
			"completion": "i0ChjG_completion",
			"completionDialog": "i0ChjG_completionDialog",
			"completionDialogHeader": "i0ChjG_completionDialogHeader",
			"completionNoticeItems": "i0ChjG_completionNoticeItems",
			"completionOverall": "i0ChjG_completionOverall",
			"diagram": "i0ChjG_diagram",
			"dot": "i0ChjG_dot",
			"finishReason": "i0ChjG_finishReason",
			"footer": "i0ChjG_footer",
			"header": "i0ChjG_header",
			"history": "i0ChjG_history",
			"historyBody": "i0ChjG_historyBody",
			"metrics": "i0ChjG_metrics",
			"noTools": "i0ChjG_noTools",
			"notice": "i0ChjG_notice",
			"panel": "i0ChjG_panel",
			"planInfo": "i0ChjG_planInfo",
			"reason": "i0ChjG_reason",
			"returnPath": "i0ChjG_returnPath",
			"review": "i0ChjG_review",
			"reviewDetails": "i0ChjG_reviewDetails",
			"reviewError": "i0ChjG_reviewError",
			"reviewOutcome": "i0ChjG_reviewOutcome",
			"reviewTurn": "i0ChjG_reviewTurn",
			"stage": "i0ChjG_stage",
			"stageMarker": "i0ChjG_stageMarker",
			"stageNumber": "i0ChjG_stageNumber",
			"stages": "i0ChjG_stages",
			"status": "i0ChjG_status",
			"step": "i0ChjG_step",
			"stepReview": "i0ChjG_stepReview",
			"taskGap": "i0ChjG_taskGap",
			"taskItems": "i0ChjG_taskItems",
			"taskRequirement": "i0ChjG_taskRequirement",
			"taskSummary": "i0ChjG_taskSummary",
			"toggle": "i0ChjG_toggle",
			"toolDot": "i0ChjG_toolDot",
			"tools": "i0ChjG_tools",
			"usage": "i0ChjG_usage",
			"usageDetails": "i0ChjG_usageDetails",
			"usageHint": "i0ChjG_usageHint",
			"usageList": "i0ChjG_usageList",
			"usageOutcomes": "i0ChjG_usageOutcomes",
			"usageScopes": "i0ChjG_usageScopes",
			"usageTotal": "i0ChjG_usageTotal"
		};
		//#endregion
		//#region src/panel/client/ToolUsage.tsx
		/** Compact per-name invocation counts, supplied by the Host's session projection. */
		/** Read-only counters with a local turn/session scope selector. */
		function ToolUsage({ usage, t }) {
			const [scope, setScope] = (0, react.useState)("current");
			const stats = usage?.[scope];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: LoopPanel_module_css_default.usage,
				"aria-label": t("toolUsage"),
				"data-tool-usage": true,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("toolUsage") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: LoopPanel_module_css_default.usageScopes,
					role: "group",
					"aria-label": t("usageScope"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": scope === "current",
						onClick: () => setScope("current"),
						children: t("thisTurn")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": scope === "session",
						onClick: () => setScope("session"),
						children: t("wholeSession")
					})]
				})] }), stats === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: LoopPanel_module_css_default.notice,
					children: t("usageUnavailable")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: LoopPanel_module_css_default.usageTotal,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: stats.total }),
							" ",
							t("usageTimes"),
							" · ",
							stats.tools.length,
							" ",
							t("toolKinds")
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: LoopPanel_module_css_default.usageOutcomes,
						children: [
							t("success"),
							" ",
							stats.success,
							" · ",
							t("toolError"),
							" ",
							stats.error,
							stats.running > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								" · ",
								t("pending"),
								" ",
								stats.running
							] }),
							stats.interrupted > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								" · ",
								t("interruptedTool"),
								" ",
								stats.interrupted
							] })
						]
					}),
					stats.tools.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: LoopPanel_module_css_default.notice,
						children: t("usageEmpty")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: LoopPanel_module_css_default.usageDetails,
						open: true,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("usageByTool") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
							className: LoopPanel_module_css_default.usageList,
							children: stats.tools.map((tool) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								"data-usage-tool": tool.name,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
									title: tool.name,
									children: tool.name
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [
									tool.total,
									" ",
									t("usageTimes")
								] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
									t("success"),
									" ",
									tool.success,
									" · ",
									t("toolError"),
									" ",
									tool.error,
									tool.running > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
										" · ",
										t("pending"),
										" ",
										tool.running
									] }),
									tool.interrupted > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
										" · ",
										t("interruptedTool"),
										" ",
										tool.interrupted
									] })
								] })]
							}, tool.name))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: LoopPanel_module_css_default.usageHint,
						children: t("usageHint")
					})
				] })]
			});
		}
		//#endregion
		//#region src/panel/client/LoopPanel.tsx
		const terminalPhases = [
			"done",
			"aborted",
			"blocked",
			"error",
			"limited",
			"interrupted"
		];
		/** Header entry sharing the session's panel visibility preference. */
		function LoopToggle({ openLoop, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				className: LoopPanel_module_css_default.toggle,
				type: "button",
				onClick: openLoop,
				"aria-label": t("toggle"),
				title: t("toggle"),
				"data-loop-toggle": true,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: "↻"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("loopLabel") })]
			});
		}
		function elapsed(start, end, t) {
			if (end === null) return "—";
			return `${Math.max(0, (end - start) / 1e3).toFixed(1)} ${t("seconds")}`;
		}
		function percentage(rate) {
			return `${(rate * 100).toFixed(1)}%`;
		}
		function outcomeKey(outcome) {
			if (outcome === "progress") return "reviewProgress";
			return outcome === "passed" ? "reviewPassed" : outcome === "repair" ? "reviewRepair" : outcome === "blocked" ? "reviewBlocked" : "reviewError";
		}
		/** Session sidebar entry; no subscription or execution machinery lives in this component. */
		function LoopPanel({ sessionId, useProjection, useSession, useSessionStatus, useTabInfo, t }) {
			const flow = useProjection("claude-loop-flow");
			const usage = useProjection("claude-loop-tool-usage");
			const [completionNotice, setCompletionNotice] = (0, react.useState)(null);
			const noticeDialog = (0, react.useRef)(null);
			const observed = (0, react.useRef)(null);
			const notifiedReview = (0, react.useRef)("");
			const pending = useSessionStatus((snapshot) => snapshot.get(sessionId)?.pendingInteraction !== void 0);
			const { tab } = useTabInfo();
			const openState = useSession((session) => session.openState);
			const terminal = flow !== void 0 && terminalPhases.includes(flow.phase);
			const phase = pending && !terminal ? "waiting" : flow?.phase ?? "idle";
			const latestReview = (flow?.reviews ?? []).at(-1);
			const currentItems = (flow?.tasks ?? []).map((task) => {
				return latestReview?.items?.find((item) => item.id === task.id && item.status === task.status && item.title === task.title && item.requirement === task.requirement && item.result === task.result && JSON.stringify(item.evidenceIds) === JSON.stringify(task.evidenceIds)) ?? {
					...task,
					passed: false,
					reason: "",
					score: null,
					reused: false
				};
			});
			const verified = currentItems.filter((item) => item.passed).length;
			const reviewCurrent = latestReview !== void 0 && (flow?.taskSeq == null || latestReview.seq >= flow.taskSeq);
			(0, react.useEffect)(() => {
				const current = {
					sessionId,
					turn: flow?.turn ?? null,
					phase: flow?.phase ?? "idle",
					reviewSeq: latestReview?.seq ?? -1
				};
				const previous = observed.current;
				observed.current = current;
				if (previous === null || previous.sessionId !== current.sessionId || previous.turn !== current.turn || current.phase !== "done") return;
				const finishedNow = previous.phase !== "done" || current.reviewSeq > previous.reviewSeq;
				const reviewKey = `${current.sessionId}:${current.turn}:${current.reviewSeq}`;
				if (finishedNow && latestReview?.stage === "overall" && latestReview.turn === current.turn && notifiedReview.current !== reviewKey) {
					notifiedReview.current = reviewKey;
					setCompletionNotice(latestReview);
				}
			}, [
				sessionId,
				flow?.turn,
				flow?.phase,
				latestReview?.seq
			]);
			(0, react.useEffect)(() => {
				const dialog = noticeDialog.current;
				if (completionNotice !== null && dialog !== null && !dialog.open) dialog.showModal();
				return () => {
					if (dialog?.open) dialog.close();
				};
			}, [completionNotice]);
			const noticeItems = completionNotice?.items ?? [];
			const noticePassed = noticeItems.filter((item) => item.passed).length;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
				className: LoopPanel_module_css_default.panel,
				"aria-label": t("title"),
				"data-loop-panel": true,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dialog", {
						ref: noticeDialog,
						className: LoopPanel_module_css_default.completionDialog,
						"aria-labelledby": "loop-completion-title",
						onClose: () => setCompletionNotice(null),
						onClick: (event) => {
							if (event.target === event.currentTarget) setCompletionNotice(null);
						},
						children: completionNotice !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
								className: LoopPanel_module_css_default.completionDialogHeader,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
									id: "loop-completion-title",
									children: t("completionNoticeTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("completionPurpose") })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									className: LoopPanel_module_css_default.close,
									type: "button",
									"aria-label": t("close"),
									onClick: () => setCompletionNotice(null),
									children: "×"
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: LoopPanel_module_css_default.completionOverall,
								"aria-label": t("overallCompletion"),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("overallCompletion") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: completionNotice.score === null ? t("notScored") : percentage(completionNotice.score.rate) }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(outcomeKey(completionNotice.outcome)) })
								]
							}),
							noticeItems.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: LoopPanel_module_css_default.completionNoticeItems,
								"aria-label": t("taskSummary"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h3", { children: [
									noticePassed,
									"/",
									noticeItems.length,
									" ",
									t("verifiedItems")
								] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: noticeItems.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
									"data-passed": item.passed,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item.title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: item.score === null ? t(item.status === "completed" ? "awaitingApproval" : "unfinished") : `${percentage(item.score.rate)} · ${t(item.passed ? "reviewPassed" : "reviewRepair")}` })]
								}, item.id)) })]
							})
						] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: LoopPanel_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: flow?.turn === null || flow === void 0 ? t("idleTitle") : `${t("turn")} ${flow.turn}` })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							className: LoopPanel_module_css_default.close,
							type: "button",
							onClick: () => tab.actions.close(),
							"aria-label": t("close"),
							children: "×"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: LoopPanel_module_css_default.status,
						"data-phase": phase,
						role: "status",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LoopPanel_module_css_default.dot }), t(phase)]
					}),
					flow === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: LoopPanel_module_css_default.notice,
						children: t(openState === "loading" || openState === "cold" ? "loading" : openState === "error" ? "historyError" : "unavailable")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						flow.taskKind === "coding" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: LoopPanel_module_css_default.planInfo,
							"aria-label": t("planSource"),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [t(flow.reviewMode === "self" ? "primaryReview" : "independentReview"), latestReview?.reviewer && latestReview.reviewer !== "primary" ? " · " + latestReview.reviewer.toUpperCase() : ""] }),
								flow.reviewMode === "laya" && (flow.plan === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									role: "status",
									children: t("planAwaiting")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
										t("planSource"),
										" · ",
										t("planRevision"),
										" ",
										flow.plan.revision
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: flow.plan.goal }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: flow.plan.path }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										t("planScope"),
										" · ",
										flow.plan.scope
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("planExceptions") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										t("planRecoverable"),
										" · ",
										flow.plan.exceptions.recoverable
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										t("planRevisionRule"),
										" · ",
										flow.plan.exceptions.revisePlan
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										t("planBlocked"),
										" · ",
										flow.plan.exceptions.blocked
									] })
								] })),
								flow.planError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: LoopPanel_module_css_default.taskGap,
									role: "alert",
									children: [
										t("planInvalid"),
										" · ",
										flow.planError
									]
								}),
								flow.exception !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: LoopPanel_module_css_default.taskGap,
									role: "status",
									children: [
										t("exceptionNotice"),
										" · ",
										flow.exception.taskId,
										" · ",
										flow.exception.summary
									]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: LoopPanel_module_css_default.completion,
							"data-outcome": latestReview?.outcome,
							role: "status",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(latestReview?.policy === "task-items-v1" || currentItems.length > 0 ? "overallCompletion" : "completion") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: latestReview?.score == null || !reviewCurrent ? t(latestReview?.outcome === "error" || currentItems.length === 0 && latestReview?.policy !== "task-items-v1" ? "notScored" : "awaitingOverall") : percentage(latestReview.score.rate) }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: LoopPanel_module_css_default.reviewOutcome,
									children: latestReview === void 0 || !reviewCurrent ? t("noAssessment") : t(outcomeKey(latestReview.outcome))
								})
							]
						}),
						currentItems.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: LoopPanel_module_css_default.taskSummary,
							"aria-label": t("taskSummary"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [
								verified,
								"/",
								currentItems.length
							] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								t("verifiedItems"),
								" · ",
								percentage(verified / currentItems.length)
							] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TaskRows, {
								items: currentItems,
								t
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: LoopPanel_module_css_default.metrics,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: flow.totalSteps }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("steps") })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: flow.totalCalls }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("calls") })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: flow.failedCalls }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("failures") })] })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ToolUsage, {
							usage,
							t
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FlowDiagram, {
							flow,
							waiting: pending && !terminal,
							t
						}),
						flow.turn === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: LoopPanel_module_css_default.notice,
							children: t("empty")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
							className: LoopPanel_module_css_default.history,
							"aria-label": t("timeline"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("timeline") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								flow.totalSteps,
								" ",
								t("historySteps")
							] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: LoopPanel_module_css_default.historyBody,
								children: [flow.omittedSteps > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: LoopPanel_module_css_default.notice,
									children: [
										t("omitted"),
										" · ",
										flow.omittedSteps
									]
								}), flow.steps.map((step) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
									className: LoopPanel_module_css_default.step,
									open: step.endedAt === null,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											t("step"),
											" ",
											step.number
										] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: elapsed(step.startedAt, step.endedAt, t) })] }),
										step.finishReason !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: LoopPanel_module_css_default.finishReason,
											children: t(step.finishReason === "tool-calls" ? "requestedTools" : step.finishReason === "max-tokens" ? "limited" : "responseEnded")
										}),
										step.tools.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: LoopPanel_module_css_default.noTools,
											children: t("noTools")
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
											className: LoopPanel_module_css_default.tools,
											children: step.tools.map((tool) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
												"data-tool-status": tool.status,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: LoopPanel_module_css_default.toolDot,
														"aria-hidden": "true"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
														title: tool.name,
														children: tool.name
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(tool.status === "running" ? "pending" : tool.status === "error" ? "toolError" : tool.status === "interrupted" ? "interruptedTool" : "success") })
												]
											}, tool.id))
										})
									]
								}, step.number))]
							})]
						})
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
						className: LoopPanel_module_css_default.footer,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("source") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("modelOnly") })]
					})
				]
			});
		}
		function TaskRows({ items, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: LoopPanel_module_css_default.taskItems,
				children: items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
					"data-passed": item.passed,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								item.id,
								" · ",
								item.title
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: item.score === null ? t("notScored") : percentage(item.score.rate) }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(item.passed ? "reviewPassed" : item.score !== null ? "reviewRepair" : item.status === "completed" ? "awaitingApproval" : "unfinished") })
						] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: LoopPanel_module_css_default.taskRequirement,
							children: item.requirement
						}),
						!item.passed && item.reason !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: LoopPanel_module_css_default.taskGap,
							children: item.score?.gap === void 0 ? item.reason : t(`gap_${item.score.gap}`)
						})
					] })
				}, item.id))
			});
		}
		function FlowDiagram({ flow, waiting, t }) {
			const last = flow.steps.at(-1);
			const stages = [
				{
					key: "input",
					hint: "inputHint",
					phase: "input"
				},
				{
					key: "model",
					hint: "modelHint",
					phase: "model"
				},
				{
					key: "tools",
					hint: "toolsHint",
					phase: "tools"
				},
				{
					key: "feedback",
					hint: "feedbackHint",
					phase: "feedback"
				},
				...flow.reviewMode === "skip" ? [] : [{
					key: flow.reviewMode === "self" ? "primaryReview" : "assessing",
					hint: "assessmentStageHint",
					phase: "assessing"
				}],
				{
					key: "decision",
					hint: "decisionHint",
					phase: "done"
				}
			];
			const active = terminalPhases.includes(flow.phase) ? stages.length - 1 : stages.findIndex((stage) => stage.phase === flow.phase);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: LoopPanel_module_css_default.diagram,
				"aria-label": t("title"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
					className: LoopPanel_module_css_default.stages,
					children: stages.map((stage, index) => {
						const skipped = (index === 2 || index === 3) && last !== void 0 && last.tools.length === 0 && last.endedAt !== null;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: LoopPanel_module_css_default.stage,
							"data-current": active === index || void 0,
							"data-passed": flow.turn !== null && index < active && !skipped || void 0,
							"aria-current": active === index ? "step" : void 0,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: LoopPanel_module_css_default.stageNumber,
									children: String(index + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t(stage.key) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(skipped ? "noTools" : stage.hint) })] }),
								active === index && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: LoopPanel_module_css_default.stageMarker,
									"aria-hidden": "true",
									children: waiting ? "◷" : "●"
								})
							]
						}, stage.key);
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: LoopPanel_module_css_default.returnPath,
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "↑" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("repeat") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "↲" })
					]
				})]
			});
		}
		//#endregion
		//#region src/panel/client/locales.ts
		/** Copy for execution stages and end states. */
		const en$1 = {
			title: "Long Task Mode",
			toggle: "Open long-task progress",
			close: "Close agent loop",
			turn: "Turn",
			steps: "Steps",
			calls: "Top-level calls",
			failures: "Failed tools",
			toolUsage: "Tool usage",
			usageScope: "Count scope",
			thisTurn: "This turn",
			wholeSession: "Whole session",
			usageTimes: "calls",
			toolKinds: "tools",
			usageByTool: "Counts by tool",
			usageEmpty: "No recorded calls in this scope.",
			usageUnavailable: "Tool usage unavailable. Check the Host plugin version.",
			usageHint: "Counts recorded attempts, including failures and nested dispatches. New retry calls count again. Child sessions have separate statistics.",
			input: "Receive task",
			model: "Model request",
			tools: "Execute tools",
			feedback: "Return results",
			decision: "Continue or finish",
			inputHint: "User input and injected context",
			modelHint: "Prepare context and request the model",
			toolsHint: "Run the requested tool batch",
			feedbackHint: "Feed observations into the next request",
			decisionHint: "Tool results lead to another step",
			repeat: "Next step",
			idle: "Waiting for a task",
			done: "Completed",
			aborted: "Cancelled",
			blocked: "Blocked",
			error: "Failed",
			limited: "Output limit reached",
			interrupted: "Interrupted",
			waiting: "Waiting for your response",
			pending: "Running",
			success: "Succeeded",
			toolError: "Failed",
			noTools: "No dispatched tools",
			timeline: "Execution history",
			historySteps: "steps",
			step: "Step",
			empty: "Send a task to see the live execution loop.",
			unavailable: "Loop data unavailable. Check that the host plugin is loaded.",
			loading: "Loading execution history…",
			historyError: "Unable to load session history.",
			omitted: "Earlier steps omitted",
			source: "From committed session events",
			reason: "End reason",
			modelOnly: "This panel shows execution status, not private model thoughts.",
			results: "Tool results recorded",
			interruptedTool: "Interrupted",
			requestedTools: "Requested tools",
			responseEnded: "Model response ended",
			completion: "Estimated completion",
			notScored: "No score",
			noAssessment: "No completion assessment yet",
			planSource: "Task plan",
			planRevision: "Revision",
			planAwaiting: "Create and import plan.md before execution",
			planInvalid: "Plan needs attention",
			planScope: "Scope",
			planExceptions: "Exception rules",
			planRecoverable: "Recovery",
			planRevisionRule: "Plan revision",
			planBlocked: "Blocker",
			primaryReview: "Primary-model self review",
			independentReview: "Independent model review",
			exceptionNotice: "Current exception",
			assessments: "Completion assessments",
			assessmentCount: "assessments",
			assessmentHint: "Each completion attempt records item scores and gaps. The whole original request is assessed after all items pass.",
			initialReview: "Initial assessment",
			repairReview: "After repair",
			reviewPassed: "Passed",
			reviewRepair: "Needs repair",
			reviewBlocked: "Repair limit reached",
			reviewError: "Assessment failed",
			threshold: "Required score",
			repairs: "Repairs completed",
			coverage: "Scope coverage",
			constraints: "Constraints",
			evidence: "Evidence",
			confidence: "Scoring confidence",
			assessmentTime: "Assessment time",
			omittedReviews: "Earlier assessments omitted",
			loopLabel: "Long task",
			idleTitle: "Long Task Mode",
			seconds: "s",
			strictlyAbove: "Above",
			atLeast: "At least",
			continuous: "Until approved",
			overallCompletion: "Overall completion",
			awaitingOverall: "Awaiting overall review",
			reviewProgress: "Item scores updated",
			taskReview: "Task item assessment",
			taskSummary: "Task completion",
			verifiedItems: "items approved",
			modelCompleted: "Model marked complete",
			modelStatus: "Model status",
			declaredComplete: "Marked complete",
			working: "In progress",
			unstarted: "Not started",
			unfinished: "Unfinished",
			awaitingApproval: "Awaiting review",
			reusedAssessment: "Previous approval retained; submitted work and recorded evidence are unchanged.",
			completionNoticeTitle: "Task completion check",
			completionPurpose: "The selected model checks each requested item against the completed work and evidence so you can see what is done and what still needs attention.",
			assessing: "Model assessment",
			assessmentStageHint: "Judge task items, then the original request",
			gap_missing: "A requested deliverable or scope item is missing.",
			gap_partial: "Requested behavior is incomplete.",
			gap_evidence: "Completion is not sufficiently supported by evidence.",
			gap_constraints: "A requirement or constraint is not met.",
			gap_defect: "The evidence shows a defect or failed operation.",
			gap_none: "Below the threshold; inspect this requirement and its evidence."
		};
		/** Simplified Chinese copy for the loop observer. */
		const zh$1 = {
			title: "长任务模式",
			toggle: "查看长任务进度",
			close: "关闭 Agent 循环",
			turn: "轮次",
			steps: "模型请求",
			calls: "顶层工具调用",
			failures: "失败工具",
			toolUsage: "工具使用统计",
			usageScope: "统计范围",
			thisTurn: "本轮",
			wholeSession: "整个会话",
			usageTimes: "次",
			toolKinds: "种工具",
			usageByTool: "各工具调用次数",
			usageEmpty: "此范围尚无调用记录。",
			usageUnavailable: "暂无工具统计，请检查主机侧插件版本。",
			usageHint: "按调用事件计次，包含失败和嵌套调用；新重试另计。子会话单独统计。",
			input: "接收任务",
			model: "模型请求",
			tools: "执行工具",
			feedback: "结果回传",
			decision: "继续或结束",
			inputHint: "用户输入与注入上下文",
			modelHint: "组织上下文并请求模型",
			toolsHint: "执行模型发起的工具调用",
			feedbackHint: "观察结果进入下一次请求",
			decisionHint: "需要更多操作时进入下一步",
			repeat: "下一步",
			idle: "等待任务",
			done: "已完成",
			aborted: "已取消",
			blocked: "已阻塞",
			error: "运行失败",
			limited: "输出已达上限",
			interrupted: "已中断",
			waiting: "等待你的回应",
			pending: "执行中",
			success: "已成功",
			toolError: "失败",
			noTools: "本步未执行工具",
			timeline: "执行记录",
			historySteps: "步",
			step: "步骤",
			empty: "发送任务后，这里会显示实时执行循环。",
			unavailable: "暂无循环数据，请检查主机侧插件是否已加载。",
			loading: "正在加载执行记录…",
			historyError: "无法加载会话记录。",
			omitted: "较早的步骤已省略",
			source: "来自已记录的会话事件",
			reason: "结束原因",
			modelOnly: "展示实际执行状态，不推断模型内部思维。",
			results: "工具结果已记录",
			interruptedTool: "已中断",
			requestedTools: "请求执行工具",
			responseEnded: "模型响应结束",
			completion: "估计完成评分",
			notScored: "未返回评分",
			noAssessment: "尚无完成评估",
			planSource: "任务计划",
			planRevision: "版本",
			planAwaiting: "执行前须生成并导入 plan.md",
			planInvalid: "计划需要处理",
			planScope: "任务范围",
			planExceptions: "异常处理规则",
			planRecoverable: "可恢复异常",
			planRevisionRule: "计划修订",
			planBlocked: "无法继续",
			primaryReview: "主模型自评",
			independentReview: "独立模型验收",
			exceptionNotice: "当前异常",
			assessments: "完成评估",
			assessmentCount: "次评估",
			assessmentHint: "每次提交完成结果后记录各项分数和未完成原因；各项达标后，再对照原始需求整体验收。",
			initialReview: "初次评估",
			repairReview: "修复后复评",
			reviewPassed: "已通过",
			reviewRepair: "需修复",
			reviewBlocked: "达到修复上限",
			reviewError: "评估失败",
			threshold: "通过要求",
			repairs: "已修复轮数",
			coverage: "需求覆盖",
			constraints: "约束遵守",
			evidence: "执行证据",
			confidence: "评分置信度",
			assessmentTime: "评估耗时",
			omittedReviews: "较早的评估已省略",
			loopLabel: "长任务",
			idleTitle: "长任务模式",
			seconds: "秒",
			strictlyAbove: "高于",
			atLeast: "大于等于",
			continuous: "直到通过",
			overallCompletion: "任务总完成度",
			awaitingOverall: "待整体验收",
			reviewProgress: "逐项评分已更新",
			taskReview: "任务项验收",
			taskSummary: "任务完成情况",
			verifiedItems: "项验收通过",
			modelCompleted: "模型标记完成",
			modelStatus: "模型状态",
			declaredComplete: "标记完成",
			working: "进行中",
			unstarted: "未开始",
			unfinished: "未完成",
			awaitingApproval: "待验收",
			reusedAssessment: "交付内容和记录证据未变，保留前次验收结果。",
			completionNoticeTitle: "任务完成情况",
			completionPurpose: "所选验收模型会依据已完成的工作和执行证据逐项核对需求，帮助确认哪些已完成、哪些仍需处理。",
			assessing: "模型验收",
			assessmentStageHint: "逐项判断，再对照原始需求整体验收",
			gap_missing: "缺少要求的交付内容或需求项。",
			gap_partial: "要求的功能仍有未完成部分。",
			gap_evidence: "现有证据不足以支持完成声明。",
			gap_constraints: "未满足任务要求或用户约束。",
			gap_defect: "证据中存在缺陷或失败操作。",
			gap_none: "评分未达阈值，需要对照本项要求和证据分析缺口。"
		};
		//#endregion
		//#region src/panel/client/index.ts
		const TAB_ID = "@deepseek-ai/dsh-client-ui-loop-flow";
		const TAB_KIND = "claude-loop-flow";
		/**
		* Register the Loop page through the desktop's native tab extension points.
		* @param ctx - Client context with the native sidebar services.
		*/
		function apply$1(ctx) {
			ctx.effect(() => ctx.locale.register("loopFlow", {
				en: en$1,
				zh: zh$1
			}), "ui-loop-flow: dictionaries");
			const t = ctx.locale.bind("loopFlow");
			ctx.effect(() => ctx.sidebarRightTabs.register({
				id: TAB_ID,
				kind: TAB_KIND,
				priority: "extension",
				title: () => t("title"),
				guide: [{
					id: TAB_KIND,
					order: 10,
					title: () => t("title"),
					description: () => t("source")
				}]
			}), "ui-loop-flow: native tab type");
			ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
				name: "sidebar.right.pane.tab",
				key: TAB_ID,
				locale: "loopFlow"
			}, LoopPanel));
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: TAB_KIND,
				order: 20,
				locale: "loopFlow",
				inject: (sessionId) => ({ openLoop: () => {
					ctx.sidebarRight.openTabIn(sessionId, TAB_KIND);
				} })
			}, LoopToggle));
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
				throw new Error("cached value already set");
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid$1 = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid$1(v));
			} else def.pattern ?? (def.pattern = uuid$1());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
			def.inclusive = false;
			$ZodUnion.init(inst, def);
			const _super = inst._zod.parse;
			defineLazy(inst._zod, "propValues", () => {
				const propValues = {};
				for (const option of def.options) {
					const pv = option._zod.propValues;
					if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
					for (const [k, v] of Object.entries(pv)) {
						if (!propValues[k]) propValues[k] = /* @__PURE__ */ new Set();
						for (const val of v) propValues[k].add(val);
					}
				}
				return propValues;
			});
			const disc = cached(() => {
				const opts = def.options;
				const map = /* @__PURE__ */ new Map();
				for (const o of opts) {
					const values = o._zod.propValues?.[def.discriminator];
					if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
					for (const v of values) {
						if (map.has(v)) throw new Error(`Duplicate discriminator value "${String(v)}"`);
						map.set(v, o);
					}
				}
				return map;
			});
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!isObject(input)) {
					payload.issues.push({
						code: "invalid_type",
						expected: "object",
						input,
						inst
					});
					return payload;
				}
				const opt = disc.value.get(input?.[def.discriminator]);
				if (opt) return opt._zod.run(payload, ctx);
				if (def.unionFallback || ctx.direction === "backward") return _super(payload, ctx);
				payload.issues.push({
					code: "invalid_union",
					errors: [],
					note: "No matching discriminator",
					discriminator: def.discriminator,
					options: Array.from(disc.value.keys()),
					input,
					path: [def.discriminator],
					inst
				});
				return payload;
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
			else vals.push(Number(val));
			else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function uuid(params) {
			return /* @__PURE__ */ _uuid(ZodUUID, params);
		}
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			return new ZodObject({
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			});
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("ZodDiscriminatedUnion", (inst, def) => {
			ZodUnion.init(inst, def);
			$ZodDiscriminatedUnion.init(inst, def);
		});
		function discriminatedUnion(discriminator, options, params) {
			return new ZodDiscriminatedUnion({
				type: "union",
				options,
				discriminator,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			return new ZodEnum({
				type: "enum",
				entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/reviewer-wire.ts
		/** Non-secret reviewer settings. Secrets are accepted only on the write boundary. */
		const endpointSchema = string().trim().url().max(2048).refine((value) => {
			const u = new URL(value);
			return !u.username && !u.password && !u.search && !u.hash && (u.protocol === "https:" || u.protocol === "http:" && [
				"localhost",
				"127.0.0.1",
				"[::1]"
			].includes(u.hostname));
		}, "Use an HTTPS endpoint without credentials or query parameters (HTTP is allowed for loopback proxies).");
		const reviewerSettingsSchema = object({
			backend: _enum(["laya", "jev"]),
			endpoint: endpointSchema,
			model: string().trim().min(1).max(100),
			timeoutMs: number().int().min(1e3).max(36e5)
		}).strict();
		reviewerSettingsSchema.extend({
			credentialRef: string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
			revision: string()
		}).strict();
		//#endregion
		//#region src/wire.ts
		/** Shared, strict operator contract. Mode changes never originate from model tools. */
		const PACKAGE$1 = "@deepseek-ai/dsh-long-task";
		/** Existing Claude Loop controls, independent of long-task acceptance history. */
		const loopSettingsSchema = object({
			deferMcpTools: boolean(),
			maxToolTurns: number().int().min(0).max(1e5),
			snipAtRatio: number().min(0).max(1),
			compactAtRatio: number().min(0).max(1),
			turnTokenBudget: number().int().min(0).max(1e9),
			budgetCompletionRatio: number().min(0).max(1),
			budgetDiminishingDelta: number().int().min(0).max(1e9),
			maxTokensRecoveryLimit: number().int().min(0).max(1e3),
			planAgentModel: string().trim().max(200).nullable(),
			layaReviewMaxRepairs: number().int().min(0).max(10),
			layaReviewTimeoutMs: number().int().min(1e3).max(36e5),
			layaReviewStallRounds: number().int().min(0).max(100)
		}).strict();
		const requestSchema$1 = discriminatedUnion("op", [
			object({
				op: literal("status"),
				sessionId: string().min(1).max(200)
			}).strict(),
			object({
				op: _enum([
					"long",
					"ordinary",
					"pause",
					"resume",
					"end",
					"new",
					"acknowledge"
				]),
				sessionId: string().min(1).max(200)
			}).strict(),
			object({ op: literal("settings") }).strict(),
			object({
				op: literal("saveReviewPolicy"),
				enabled: boolean()
			}).strict(),
			object({
				op: literal("saveReviewer"),
				reviewer: reviewerSettingsSchema,
				apiKey: string().trim().min(1).max(4096).optional()
			}).strict(),
			object({
				op: literal("testReviewer"),
				backend: _enum(["laya", "jev"])
			}).strict(),
			object({ op: literal("cancelReviewerTest") }).strict(),
			object({
				op: literal("saveLoop"),
				loop: loopSettingsSchema
			}).strict(),
			object({
				op: literal("save"),
				maxModelTokens: number().min(1e3).max(1e9).optional(),
				maxCost: number().min(0).max(1e6).optional(),
				inputPerMillion: number().min(0).max(1e6).optional(),
				outputPerMillion: number().min(0).max(1e6).optional(),
				threshold: number().min(0).max(100),
				noProgressLimit: number().int().min(1).max(20),
				maxToolCalls: number().int().min(1).max(1e5),
				maxAssessments: number().int().min(1).max(1e4),
				maxMinutes: number().min(1).max(10080)
			}).strict()
		]);
		const remoteContribution$1 = {
			package: PACKAGE$1,
			descriptors: [{
				id: `${PACKAGE$1}#longTasks/request`,
				service: "longTasks",
				namespace: "longTasks",
				method: "request",
				invocation: { kind: "direct" },
				parameters: [{
					name: "request",
					wire: "request",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: `${PACKAGE$1}#Request`,
						create: () => requestSchema$1
					}
				}],
				result: { mode: "src-json" }
			}]
		};
		//#endregion
		//#region src/laya/wire.ts
		/** Validated Remote codecs shared by the installed Host and Client. */
		/** Package identity used by both Remote registries and the Client module loader. */
		const PACKAGE = "@deepseek-ai/dsh-client-ui-laya";
		const requestId = uuid().transform((value) => value);
		/** Validates settings received from a file or Remote caller. */
		const settingsSchema = object({
			enabled: boolean(),
			launcher: string().trim().min(1).max(4096),
			device: _enum([
				"auto",
				"cpu",
				"mps",
				"cuda"
			]),
			models: array(string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_-]+$/)).min(1).max(8),
			preload: boolean(),
			offline: boolean(),
			timeoutMs: number().int().min(1e3).max(36e5)
		}).strict().refine((value) => new Set(value.models).size === value.models.length, "Checkpoint names must be unique.");
		/** Candidate budgets follow Laya's recommendation to shortlist larger choice sets. */
		const requestSchema = object({
			id: requestId,
			mode: _enum([
				"classify",
				"task-route",
				"model-route"
			]),
			text: string().trim().min(1).max(16e3),
			instructions: string().trim().min(1).max(2e3),
			candidates: array(object({
				name: string().trim().min(1).max(100),
				description: string().trim().min(1).max(1e3)
			}).strict()).min(2).max(20),
			lang: _enum([
				"auto",
				"zh",
				"en"
			])
		}).strict().refine((value) => new Set(value.candidates.map((item) => item.name)).size === value.candidates.length, "Candidate names must be unique.");
		/** Validates completion results crossing MCP and durable session boundaries. */
		const completionScoreSchema = object({
			rate: number().min(0).max(1),
			dimensions: array(object({
				name: _enum([
					"coverage",
					"constraints",
					"evidence"
				]),
				rate: number().min(0).max(1)
			})),
			confidence: number().min(0).max(1).nullable(),
			model: string().nullable(),
			device: string().nullable(),
			elapsedMs: number().nonnegative(),
			json: string(),
			gap: _enum([
				"missing",
				"partial",
				"evidence",
				"constraints",
				"defect",
				"none"
			]).optional(),
			criticalSatisfied: boolean().optional()
		});
		/** Review notices are known user/message events, so older desktops can still read the log. */
		const completionReviewSchema = object({
			sessionId: string().transform((value) => value),
			turn: number().int().nonnegative(),
			attempt: number().int().nonnegative(),
			at: number().nonnegative(),
			outputSeq: number().int().nonnegative().transform((value) => value).nullable(),
			threshold: number().min(0).max(100),
			maxRepairs: number().int().nonnegative(),
			reviewer: _enum([
				"laya",
				"jev",
				"primary"
			]).optional(),
			outcome: _enum([
				"progress",
				"passed",
				"repair",
				"blocked",
				"error"
			]),
			error: string().nullable(),
			requirement: string(),
			output: string(),
			evidence: array(string()),
			score: completionScoreSchema.nullable(),
			policy: _enum(["task-items-v1", "task-items-v2"]).optional(),
			stage: _enum(["tasks", "overall"]).optional(),
			passedItems: number().int().nonnegative().optional(),
			totalItems: number().int().nonnegative().optional(),
			items: array(object({
				id: string(),
				title: string(),
				requirement: string(),
				status: _enum([
					"pending",
					"in_progress",
					"completed"
				]),
				result: string(),
				evidenceIds: array(string()),
				fingerprint: string(),
				score: completionScoreSchema.nullable(),
				passed: boolean(),
				reason: string(),
				reused: boolean()
			})).optional()
		});
		const viewSchema = object({
			settings: settingsSchema,
			phase: _enum([
				"disabled",
				"connecting",
				"ready",
				"failed"
			]),
			error: string().nullable(),
			actualDevice: string().nullable(),
			loadedModels: array(string()),
			version: string().nullable(),
			statusJson: string().nullable(),
			tools: array(object({
				name: string(),
				description: string(),
				schema: string()
			})),
			completionReviews: array(completionReviewSchema)
		});
		const resultSchema = object({
			id: requestId,
			tool: _enum(["laya_predict", "laya_route"]),
			elapsedMs: number().nonnegative(),
			selected: string().nullable(),
			confidence: number().min(0).max(1).nullable(),
			lowConfidence: boolean(),
			model: string().nullable(),
			device: string().nullable(),
			json: string()
		});
		function descriptor(method, result, input) {
			return {
				id: `${PACKAGE}#laya/${method}`,
				service: "layaController",
				namespace: "laya",
				method,
				invocation: { kind: "direct" },
				parameters: input === void 0 ? [] : [{
					name: "request",
					wire: "request",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: `${PACKAGE}#${method}Request`,
						create: () => input
					}
				}],
				result: {
					mode: "strict",
					typeSymbol: `${PACKAGE}#${method}Result`,
					create: () => result
				}
			};
		}
		/** Explicit descriptors avoid a dependency on another plugin's generated Remote assembly. */
		const remoteContribution = {
			package: PACKAGE,
			descriptors: [
				descriptor("status", viewSchema),
				descriptor("save", viewSchema, settingsSchema),
				descriptor("reconnect", viewSchema),
				descriptor("refresh", viewSchema),
				descriptor("run", resultSchema, requestSchema),
				descriptor("cancel", object({ cancelled: boolean() }), object({ id: requestId }).strict())
			]
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region bundled module
		const css$5 = ".ykYHGq_button{box-sizing:border-box;border-radius:var(--dsw-radius-md);cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:none;justify-content:center;align-items:center;gap:4px;padding:0 14px;font-size:14px;line-height:22px;display:inline-flex}.ykYHGq_button:disabled{cursor:not-allowed;opacity:.4}.ykYHGq_md{height:36px}.ykYHGq_sm{border-radius:var(--dsw-radius-sm);height:28px;padding:0 10px;font-size:12px;line-height:18px}.ykYHGq_primary{background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground)}.ykYHGq_primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.ykYHGq_ghost:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.ykYHGq_ghost:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}.ykYHGq_outline{border:.5px solid var(--dsw-alias-border-l3);background:0 0}.ykYHGq_outline:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.ykYHGq_toolbar{background:var(--dsw-alias-button-tool-bar-fill)}.ykYHGq_toolbar:hover:not(:disabled){background:var(--dsw-alias-button-tool-bar-hover)}.ykYHGq_icon{justify-content:center;align-items:center;width:16px;height:16px;display:inline-flex}";
		const tagId$5 = "@deepseek-ai/dsh-long-task/Button.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var Button_module_css_default = {
			"button": "ykYHGq_button",
			"ghost": "ykYHGq_ghost",
			"icon": "ykYHGq_icon",
			"md": "ykYHGq_md",
			"outline": "ykYHGq_outline",
			"primary": "ykYHGq_primary",
			"sm": "ykYHGq_sm",
			"toolbar": "ykYHGq_toolbar"
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/Button.tsx
		/**
		* Render a button.
		* @param props.variant - visual family (default 'ghost').
		* @param props.size - 'md' 36px control with 12px corners or 'sm' 28px control with 8px corners.
		* @param props.icon - optional leading 16px icon node.
		* @param ref - native button for focus management and overlay anchors.
		* @returns the button element; native button attributes pass through.
		*/
		const Button = (0, react.forwardRef)(function Button({ variant = "ghost", size = "md", icon, className, children, ...rest }, ref) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				ref,
				type: "button",
				className: clsx(Button_module_css_default.button, Button_module_css_default[variant], Button_module_css_default[size], className),
				...rest,
				children: [icon != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: Button_module_css_default.icon,
					children: icon
				}), children]
			});
		});
		//#endregion
		//#region bundled module
		const css$4 = ".z4fuhq_switch{box-sizing:border-box;corner-shape:round;background:var(--dsw-alias-border-l3);cursor:pointer;border:0;border-radius:999px;flex:none;width:36px;height:20px;padding:2px;position:relative}.z4fuhq_switch[aria-checked=true]{background:var(--dsw-alias-brand-primary)}.z4fuhq_switch:disabled{cursor:default;opacity:.5}.z4fuhq_switch:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}.z4fuhq_thumb{corner-shape:round;background:var(--dsw-alias-label-primary-foreground);border-radius:50%;width:16px;height:16px;transition:transform .12s;display:block}.z4fuhq_switch[aria-checked=false] .z4fuhq_thumb{background:var(--dsw-alias-switch-thumb)}.z4fuhq_switch[aria-checked=true] .z4fuhq_thumb{transform:translate(16px)}";
		const tagId$4 = "@deepseek-ai/dsh-long-task/Switch.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var Switch_module_css_default = {
			"switch": "z4fuhq_switch",
			"thumb": "z4fuhq_thumb"
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/Switch.tsx
		/**
		* Render a toggle switch.
		* @param props.checked - the current state; the control is fully controlled.
		* @param props.onChange - called with the state the click asks for.
		* @param props.label - localized accessible name, owned by the render site.
		* @param props.disabled - whether the control refuses input; owners also set it
		* while a write is in flight, not only when a deployment locks the toggle.
		* @param props.title - localized hover text, typically why the toggle is locked.
		* @param props.className - extra class for layout placement.
		* @returns the switch element.
		*/
		function Switch({ checked, onChange, label, disabled = false, title, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				role: "switch",
				"aria-checked": checked,
				"aria-label": label,
				title,
				disabled,
				className: clsx(Switch_module_css_default.switch, className),
				onClick: () => {
					onChange(!checked);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: Switch_module_css_default.thumb })
			});
		}
		const IconCheckOutlineArtwork = ({ size = 16, className, strokeWidth }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			width: size,
			height: size,
			className,
			viewBox: "0 0 16 16",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			"aria-hidden": "true",
			strokeWidth,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4",
				stroke: "currentColor"
			})
		});
		/** Regular one-pixel IconCheckOutline artwork. */
		const IconCheckOutlineRegular = (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconCheckOutlineArtwork, {
			...props,
			strokeWidth: 1
		});
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/overlay-top-margin.ts
		/** Shared viewport inset for overlays, derived from the desktop frame's reserved top strip. */
		/**
		* Resolve the top margin an overlay keeps from the viewport edge.
		* @param min - the overlay's own viewport margin in px, used as the floor.
		* @returns the larger of `min` and the frame clearance plus 20px; fullscreen keeps only the 20px gap.
		*/
		function overlayTopMargin(min) {
			const root = document.documentElement;
			const clearance = Number.parseFloat(getComputedStyle(root).getPropertyValue("--dsh-frame-top-clearance"));
			if (Number.isNaN(clearance)) return min;
			return Math.max(min, (root.hasAttribute("data-fullscreen") ? 0 : clearance) + 20);
		}
		/**
		* Delay a pointer-dismissed popup's close so the pointer can cross the gap
		* between anchor and popup. A pending close is dropped on unmount.
		* @param close - runs when the grace elapses with no re-entry; read at fire
		* time, so callers may pass a fresh closure each render.
		* @returns the {@link PointerGrace} handle.
		*/
		function usePointerGrace(close) {
			const timerRef = (0, react.useRef)(null);
			const closeRef = (0, react.useRef)(close);
			closeRef.current = close;
			const cancel = (0, react.useCallback)(() => {
				if (timerRef.current === null) return;
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}, []);
			const arm = (0, react.useCallback)(() => {
				cancel();
				timerRef.current = setTimeout(() => {
					timerRef.current = null;
					closeRef.current();
				}, 200);
			}, [cancel]);
			(0, react.useEffect)(() => cancel, [cancel]);
			return {
				arm,
				cancel
			};
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/keyboard-composition.ts
		/** Composition lifetime for local keyboard handlers, including a late closing keydown. */
		/**
		* Observe composition until its closing key is released or consumed.
		* @param document - document whose input events belong to the caller.
		* @returns an event guard and a disposer for all listeners.
		*/
		function observeComposition(document) {
			let composing = false;
			let ended = false;
			const start = () => {
				composing = true;
			};
			const end = () => {
				composing = false;
				ended = true;
			};
			const release = () => {
				ended = false;
			};
			const blur = () => {
				composing = false;
				ended = false;
			};
			document.addEventListener("compositionstart", start, true);
			document.addEventListener("compositionend", end, true);
			document.addEventListener("keyup", release, true);
			document.defaultView?.addEventListener("blur", blur);
			return {
				guards: (event) => {
					const guarded = composing || ended || event.isComposing || event.keyCode === 229;
					ended = false;
					return guarded;
				},
				dispose: () => {
					document.removeEventListener("compositionstart", start, true);
					document.removeEventListener("compositionend", end, true);
					document.removeEventListener("keyup", release, true);
					document.defaultView?.removeEventListener("blur", blur);
				}
			};
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/focus.ts
		/** Focus presentation for automatic entry and restoration. */
		const releases = /* @__PURE__ */ new WeakMap();
		const navigationKeys = new Set([
			"Tab",
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"Home",
			"End"
		]);
		/**
		* Focus an automatic destination without a focus outline until keyboard navigation or blur.
		* The theme suppresses outlines while data-dsh-automatic-focus is present; borders and shadows remain intact.
		* Tab and directional navigation restore normal focus styling.
		* @param element - control or container receiving automatic focus.
		* @param options - browser focus options, including scroll preservation.
		*/
		function focusWithoutRing(element, options) {
			releases.get(element)?.();
			const release = () => {
				element.removeAttribute("data-dsh-automatic-focus");
				element.removeEventListener("blur", release);
				element.removeEventListener("keydown", navigate, true);
				releases.delete(element);
			};
			const navigate = (event) => {
				if (!event.isComposing && !event.ctrlKey && !event.altKey && !event.metaKey && navigationKeys.has(event.key)) release();
			};
			releases.set(element, release);
			element.setAttribute("data-dsh-automatic-focus", "");
			element.addEventListener("blur", release);
			element.addEventListener("keydown", navigate, true);
			element.focus(options);
			if (!element.matches(":focus")) release();
		}
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/useModalLayer.ts
		/** Shared modal keyboard ownership and focus lifetime. */
		const layers = /* @__PURE__ */ new WeakMap();
		/**
		* Whether an anchor belongs behind the current modal and must yield keyboard input.
		* @param anchor - local control owning the input handler.
		* @returns true when another modal owns the foreground.
		*/
		function isBehindModal(anchor) {
			if (anchor === null) return false;
			const top = layers.get(anchor.ownerDocument)?.at(-1);
			return top !== void 0 && !top.element.contains(anchor);
		}
		//#endregion
		//#region bundled module
		const css$3 = ".d_0SOG_keys{color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;align-items:center;gap:3px;font-size:12px;line-height:16px;display:inline-flex}.d_0SOG_key{box-sizing:border-box;font:inherit;justify-content:center;align-items:center;display:inline-flex}.d_0SOG_tooltip{color:inherit;gap:2px;font-size:11px;line-height:14px}.d_0SOG_tooltip .d_0SOG_key{background:var(--dsw-alias-tooltip-key-bg);border:0;border-radius:4px;min-width:16px;height:16px;padding:0 2px}.d_0SOG_separator{font:inherit}.d_0SOG_joined{box-sizing:border-box;background:var(--dsw-alias-tooltip-key-bg);border-radius:4px;height:16px;padding:0 4px}.d_0SOG_joined .d_0SOG_key{background:0 0;border:0;min-width:0;height:auto;padding:0}";
		const tagId$3 = "@deepseek-ai/dsh-long-task/ShortcutKeys.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var ShortcutKeys_module_css_default = {
			"joined": "d_0SOG_joined",
			"key": "d_0SOG_key",
			"keys": "d_0SOG_keys",
			"separator": "d_0SOG_separator",
			"tooltip": "d_0SOG_tooltip"
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/ShortcutKeys.tsx
		/** Shared shortcut keycaps; callers supply the effective platform presentation. */
		/**
		* Render one command's keycaps without owning binding defaults or localized copy.
		* @param props - effective key labels, presentation variant and optional interaction styling.
		* @returns unboxed keys by default, or tooltip keycaps with plus-separated combinations grouped together.
		*/
		function ShortcutKeys({ keys, variant = "plain", className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: clsx(ShortcutKeys_module_css_default.keys, variant === "tooltip" && ShortcutKeys_module_css_default.tooltip, variant === "tooltip" && keys.includes("+") && ShortcutKeys_module_css_default.joined, className),
				children: keys.map((key, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", {
					className: key === "+" ? ShortcutKeys_module_css_default.separator : ShortcutKeys_module_css_default.key,
					children: key
				}, index))
			});
		}
		//#endregion
		//#region bundled module
		const css$2 = ".HlmRAW_surface,.HlmRAW_backing{border-radius:var(--dsw-radius-lg)}.HlmRAW_compact{border-radius:var(--dsw-radius-md)}:where(.HlmRAW_surface){position:relative}.HlmRAW_surface{anchor-name:var(--dsh-menu-anchor);isolation:isolate}.HlmRAW_material{z-index:-1;border-radius:inherit;background:var(--dsw-menu-surface-fill);backdrop-filter:var(--dsw-menu-backdrop-filter);pointer-events:none;position:absolute;inset:0}.HlmRAW_backing{display:none}html[data-platform=darwin] .HlmRAW_backing{position-anchor:var(--dsh-menu-anchor);top:anchor(top);left:anchor(left);width:anchor-size(width, 0px);height:anchor-size(height, 0px);z-index:-1;background:var(--dsw-alias-bg-base);pointer-events:none;display:block;position:fixed}";
		const tagId$2 = "@deepseek-ai/dsh-long-task/MenuSurface.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var MenuSurface_module_css_default = {
			"backing": "HlmRAW_backing",
			"compact": "HlmRAW_compact",
			"material": "HlmRAW_material",
			"surface": "HlmRAW_surface"
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/MenuSurface.tsx
		/** Shared menu material and the macOS backing that lets Chromium blur transparent windows. */
		/**
		* Paint a menu and, on macOS, an opaque backing behind the page content within its bounds.
		* CSS anchors keep each backing aligned during placement, resizing, and nested-menu movement.
		* @param props - Div content and placement, and compact geometry.
		* @param ref - The visible menu div, excluding the non-interactive backing.
		* @returns Menu content plus a backing portal removed with the menu.
		*/
		const MenuSurface = (0, react.forwardRef)(function MenuSurface({ compact = false, className, style, children, ...props }, ref) {
			const id = (0, react.useId)();
			const backingRef = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				document.body.appendChild(backingRef.current);
			}, []);
			const anchorStyle = { "--dsh-menu-anchor": `--dsh-menu-${id.replaceAll(":", "")}` };
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				...props,
				ref,
				"data-menu-material": "translucent",
				className: clsx(MenuSurface_module_css_default.surface, compact && MenuSurface_module_css_default.compact, className),
				style: {
					...style,
					...anchorStyle
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					className: MenuSurface_module_css_default.material
				}), children]
			}), (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: backingRef,
				"aria-hidden": "true",
				"data-menu-backing": "",
				className: clsx(MenuSurface_module_css_default.backing, compact && MenuSurface_module_css_default.compact),
				style: {
					...anchorStyle,
					visibility: style?.visibility
				}
			}), document.body)] });
		});
		//#endregion
		//#region bundled module
		const css$1 = ".FdsO-W_root{display:inline-flex;position:relative}.FdsO-W_list,.FdsO-W_submenu{box-sizing:border-box;--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-elevation-prominent);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border:0;flex-direction:column;gap:0;padding:4px;display:flex}.FdsO-W_list{z-index:100;min-width:144px;max-width:360px;position:absolute;top:calc(100% + 4px);left:0}.FdsO-W_portal{z-index:1100;position:fixed;top:auto;left:auto}.FdsO-W_sideTop{top:auto;bottom:calc(100% + 4px)}.FdsO-W_alignEnd{left:auto;right:0}.FdsO-W_scrollable{max-height:calc(100vh - 12px - max(12px, var(--dsh-frame-overlay-top,12px)))}.FdsO-W_viewport{flex-direction:column;min-height:0;display:flex}.FdsO-W_scrollable .FdsO-W_viewport{overflow-y:auto}.FdsO-W_footer{border-top:.5px solid var(--dsw-alias-border-l2);flex-direction:column;flex:none;margin-top:3px;padding-top:3px;display:flex}.FdsO-W_itemWrap{position:relative}.FdsO-W_item{border-radius:var(--dsw-radius-md);cursor:pointer;width:100%;min-height:34px;color:var(--dsw-alias-label-primary);text-align:left;background:0 0;border:none;align-items:center;gap:6px;padding:6px 8px;font-size:13px;line-height:20px;display:flex}.FdsO-W_item:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.FdsO-W_item:focus-visible:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);outline:none}.FdsO-W_denseList .FdsO-W_item{min-height:30px;padding-block:4px}.FdsO-W_denseList .FdsO-W_label{padding-block:3px}.FdsO-W_list.FdsO-W_compactList,.FdsO-W_submenu.FdsO-W_compactList{min-width:156px;padding:4px}.FdsO-W_compactList .FdsO-W_item{border-radius:var(--dsw-radius-sm);gap:5px;min-height:24px;padding:2px 6px;font-size:11px;line-height:17px}.FdsO-W_compactList .FdsO-W_itemIcon{width:12px;height:12px}.FdsO-W_compactList .FdsO-W_separator{margin:2px}.FdsO-W_compactList .FdsO-W_label{padding:3px 6px;font-size:10px;line-height:15px}.FdsO-W_item:disabled{opacity:.4;cursor:not-allowed}.FdsO-W_itemIcon{width:14px;height:14px;color:var(--dsw-alias-menu-icon);flex:none;justify-content:center;align-items:center;display:inline-flex}.FdsO-W_itemIcon svg,.FdsO-W_check{width:14px;height:14px}.FdsO-W_compactList .FdsO-W_itemIcon svg,.FdsO-W_compactList .FdsO-W_check{width:12px;height:12px}.FdsO-W_itemLabel{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.FdsO-W_shortcut{flex:none;margin-inline-start:auto}.FdsO-W_shortcut .FdsO-W_shortcutKeys{color:var(--dsw-alias-label-caption);font-size:11px;line-height:16px}.FdsO-W_check{color:var(--dsw-alias-label-primary);flex:none}.FdsO-W_selected{background:0 0}.FdsO-W_selectedFill{background:var(--dsw-alias-interactive-bg-hover)}.FdsO-W_danger,.FdsO-W_danger .FdsO-W_itemIcon{color:var(--dsw-alias-state-error-primary)}.FdsO-W_danger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger)}.FdsO-W_danger:focus-visible:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger);outline:none}.FdsO-W_label{color:var(--dsw-alias-label-tertiary);padding:6px 8px;font-size:11px;line-height:15px}.FdsO-W_separator{background:var(--dsw-alias-border-l2);height:.5px;margin:3px 2px}.FdsO-W_separator+.FdsO-W_separator,.FdsO-W_separator+.FdsO-W_itemWrap>.FdsO-W_separator:first-child,.FdsO-W_itemWrap:first-child>.FdsO-W_separator:first-child{display:none}.FdsO-W_submenu{z-index:101;min-width:163px;position:absolute;top:auto;bottom:-4px;left:calc(100% + 10px)}.FdsO-W_submenu:before{content:\"\";width:10px;position:absolute;top:0;bottom:0;left:-10px}";
		const tagId$1 = "@deepseek-ai/dsh-long-task/Menu.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var Menu_module_css_default = {
			"alignEnd": "FdsO-W_alignEnd",
			"check": "FdsO-W_check",
			"compactList": "FdsO-W_compactList",
			"danger": "FdsO-W_danger",
			"denseList": "FdsO-W_denseList",
			"footer": "FdsO-W_footer",
			"item": "FdsO-W_item",
			"itemIcon": "FdsO-W_itemIcon",
			"itemLabel": "FdsO-W_itemLabel",
			"itemWrap": "FdsO-W_itemWrap",
			"label": "FdsO-W_label",
			"list": "FdsO-W_list",
			"portal": "FdsO-W_portal",
			"root": "FdsO-W_root",
			"scrollable": "FdsO-W_scrollable",
			"selected": "FdsO-W_selected",
			"selectedFill": "FdsO-W_selectedFill",
			"separator": "FdsO-W_separator",
			"shortcut": "FdsO-W_shortcut",
			"shortcutKeys": "FdsO-W_shortcutKeys",
			"sideTop": "FdsO-W_sideTop",
			"submenu": "FdsO-W_submenu",
			"viewport": "FdsO-W_viewport"
		};
		//#endregion
		//#region ../../dsh-upgrades/upgrade-0.2.1-alpha.2/packages/client/ui-primitives/src/Menu.tsx
		function isSeparator(entry) {
			return "type" in entry && entry.type === "separator";
		}
		function isLabel(entry) {
			return "type" in entry && entry.type === "label";
		}
		/** Unplaced portal list: hidden but laid out at a fixed origin so offsetWidth/offsetHeight are real. */
		const MEASURE_STYLE = {
			visibility: "hidden",
			left: 0,
			top: 0
		};
		/**
		* Render an anchored dropdown menu. While the list is open its keys mirror the
		* composer's: Tab settles the focused row — from the trigger, Tab enters the
		* list instead — and Escape or Shift+Tab close it and return focus to the
		* anchor's first button, and selecting a row does the same — the rows unmount
		* with the list. Only a keyboard on the trigger or inside the list is
		* intercepted; Tab presses elsewhere on the page stay the browser's.
		* @param props.autoFocus - focus the first item on open; the arrow keys walk the list either way.
		* @param props.open - whether the list is showing (owner-controlled).
		* @param props.anchor - the trigger element (rendered in place).
		* @param props.items - selectable data rows and optional separators (default none; with no `children` either, the list is empty).
		* @param props.selectedId - row shown as selected.
		* @param props.selectedIds - rows shown as selected when a menu contains independent option groups.
		* @param props.onSelect - data-row activation callback (not called for disabled rows or submenu parents that only open children).
		* @param props.onClose - invoked on outside click, Escape, or a window blur
		* that moved focus into an iframe (the only signal a pointerdown inside a
		* cross-origin iframe leaves).
		* @param props.align - list alignment against the anchor (default 'start').
		* @param props.side - open below (`bottom`, default) or above (`top`) the anchor.
		* @param props.portal - render the list into document.body, fixed-positioned
		* from the anchor rect (follows movement and resizing while open). Use when an
		* ancestor's overflow clipping would crop the in-place list; default false
		* keeps the pure-CSS in-place behavior.
		* @param props.closeOnPointerLeave - close the list once the pointer has left
		* both trigger and list for the pointer grace (default false keeps it open
		* until outside click/Escape/selection). The grace makes the 4px trigger->list
		* gap and a brief overshoot survivable; coming back cancels the close.
		* @param props.dense - reduce vertical row spacing without changing the standard typography or card width.
		* @param props.compact - use reduced menu typography and spacing.
		* @param props.getAnchorRect - portal mode only: supply the anchor rect
		* directly (e.g. from a host-owned trigger button) instead of measuring the
		* Menu's own wrapper span. Required when the wrapper isn't itself laid out at
		* the trigger (render-prop anchors, effect-positioned proxies — measuring the
		* wrapper there races the host's layout effects). Called on open, each animation
		* frame, and scroll/resize; return null to skip placement for that frame.
		* @param props.footer - rows pinned below the scrolling items area, separated
		* by a hairline; they stay visible while the items above scroll.
		* @param props.children - component rows rendered after `items` in the same
		* list, each a `role="menuitem"` button such as {@link MenuItemButton}; they
		* share the keyboard walk, the submenu exclusivity, and the post-selection
		* focus return.
		* @param props.selection - how a selected row is marked: a trailing check
		* (`'check'`, default — figma .Menu_cell) or the hover fill held on the row
		* with no check (`'fill'`, for icon-labelled rows where a trailing glyph
		* crowds the cell).
		* @param props.className - extra class on the anchor wrapper span.
		* @param props.listClassName - extra class on the dropdown card itself; the
		* only style hook that reaches a portaled list, which renders under
		* document.body outside the owner's DOM subtree.
		* @returns anchor wrapper with the conditional list.
		*/
		function Menu({ open, anchor, items = [], children, selectedId, selectedIds, onSelect, onClose, align = "start", side = "bottom", portal = false, closeOnPointerLeave = false, dense = false, compact = false, autoFocus = false, selection = "check", getAnchorRect, footer, className, listClassName }) {
			const rootRef = (0, react.useRef)(null);
			const listRef = (0, react.useRef)(null);
			/** Index the arrow walk last focused, the resume point when focus left the rows. */
			const walkIndex = (0, react.useRef)(null);
			/**
			* The control that had the keyboard when this menu opened — its own trigger,
			* which an anchor that wraps several controls (a split button) would not be
			* able to name by position.
			*/
			const triggerRef = (0, react.useRef)(null);
			const selectingWithTab = (0, react.useRef)(false);
			/**
			* Hand the keyboard back to the trigger that opened the menu — or, when the
			* anchor never held it, to the anchor's first button. Focus left on a removed
			* row otherwise falls to the page body, where the next Tab restarts from the
			* top of the page.
			* @param navigation - whether explicit keyboard traversal should retain its focus indicator.
			*/
			const refocusAnchor = (navigation = false) => {
				const trigger = triggerRef.current;
				const target = trigger !== null && document.contains(trigger) && !trigger.disabled ? trigger : rootRef.current?.querySelector("button:not(:disabled)");
				if (target == null) return;
				if (navigation) target.focus();
				else focusWithoutRing(target);
			};
			/**
			* Post-selection focus, for the paths where the rows unmount with the list.
			* A selection whose owner keeps the menu open is left alone, and so is an
			* owner that moved focus itself (a presented file card hands it to its
			* preview button): only a keyboard left on the closing list (or on the body
			* its removal produced) comes back to the trigger.
			*/
			const refocusAfterSelection = () => {
				const navigation = selectingWithTab.current;
				queueMicrotask(() => {
					if (openRef.current) return;
					const active = document.activeElement;
					if (active === null || active === document.body || listRef.current?.contains(active) === true) refocusAnchor(navigation);
				});
			};
			const openRef = (0, react.useRef)(open);
			openRef.current = open;
			const [openSubmenuId, setOpenSubmenuId] = (0, react.useState)(null);
			const [fixedPos, setFixedPos] = (0, react.useState)(null);
			const { arm: armClose, cancel: cancelClose } = usePointerGrace(onClose);
			(0, react.useLayoutEffect)(() => {
				if (!open || !portal) {
					setFixedPos(null);
					return;
				}
				const place = () => {
					let r;
					if (getAnchorRect !== void 0) r = getAnchorRect();
					else
 /* v8 ignore next 2 -- the ref is attached before the layout effect runs and the listeners die with it. */
					r = rootRef.current?.getBoundingClientRect() ?? null;
					if (r === null) return;
					const MARGIN = 12;
					const vw = window.innerWidth;
					const vh = window.innerHeight;
					const listEl = listRef.current;
					const lw = listEl?.offsetWidth ?? 0;
					const lh = listEl?.offsetHeight ?? 0;
					let x;
					let y;
					if (side === "right") {
						x = r.right + 4;
						y = r.top;
					} else if (align === "start") {
						x = r.left;
						y = side === "bottom" ? r.bottom + 4 : r.top - lh - 4;
					} else {
						x = r.right - lw;
						y = side === "bottom" ? r.bottom + 4 : r.top - lh - 4;
					}
					if (lw > 0) x = Math.min(Math.max(x, MARGIN), vw - lw - MARGIN);
					if (lh > 0) y = Math.min(Math.max(y, overlayTopMargin(MARGIN)), vh - lh - MARGIN);
					setFixedPos((current) => current?.left === x && current.top === y ? current : {
						left: x,
						top: y
					});
				};
				place();
				const track = () => {
					place();
					frame = requestAnimationFrame(track);
				};
				let frame = requestAnimationFrame(track);
				window.addEventListener("scroll", place, true);
				window.addEventListener("resize", place);
				return () => {
					cancelAnimationFrame(frame);
					window.removeEventListener("scroll", place, true);
					window.removeEventListener("resize", place);
				};
			}, [
				open,
				portal,
				align,
				side,
				getAnchorRect
			]);
			(0, react.useEffect)(() => {
				if (!open) {
					triggerRef.current = null;
					return;
				}
				const active = document.activeElement;
				triggerRef.current = active instanceof HTMLElement && rootRef.current?.contains(active) === true ? active : null;
			}, [open]);
			(0, react.useEffect)(() => {
				if (!open || !autoFocus) return;
				const first = listRef.current?.querySelector("button:not(:disabled)");
				walkIndex.current = first === void 0 || first === null ? null : 0;
				if (first != null) focusWithoutRing(first);
			}, [open, autoFocus]);
			(0, react.useEffect)(() => {
				if (!open) {
					setOpenSubmenuId(null);
					walkIndex.current = null;
					return;
				}
				const composition = observeComposition(document);
				const onPointerDown = (e) => {
					if (!(e.target instanceof Node)) return;
					if (rootRef.current?.contains(e.target) === true) return;
					if (listRef.current?.contains(e.target) === true) return;
					onClose();
				};
				const onKeyDown = (e) => {
					if (composition.guards(e) || isBehindModal(rootRef.current) || e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
					const focused = document.activeElement;
					const insideList = listRef.current?.contains(focused) === true;
					const anchored = rootRef.current?.contains(focused) === true || insideList;
					if (e.key === "Escape" && !e.shiftKey) {
						e.preventDefault();
						if (e.repeat) return;
						onClose();
						if (anchored || autoFocus) refocusAnchor();
					}
					if (e.key === "Tab") {
						const list = listRef.current;
						if (list === null || !anchored) return;
						if (e.shiftKey) {
							e.preventDefault();
							onClose();
							refocusAnchor(true);
							return;
						}
						if (insideList) {
							if (focused instanceof Element && focused.getAttribute("role") === "menuitem") {
								e.preventDefault();
								selectingWithTab.current = true;
								try {
									focused.click();
								} finally {
									selectingWithTab.current = false;
								}
							}
							return;
						}
						const row = list.querySelector("button:not(:disabled)");
						if (row === null) return;
						e.preventDefault();
						row.focus();
						walkIndex.current = 0;
						return;
					}
					if (![
						"ArrowDown",
						"ArrowUp",
						"Home",
						"End"
					].includes(e.key)) return;
					const list = listRef.current;
					if (list === null || !anchored) return;
					const buttons = Array.from(list.querySelectorAll("button:not(:disabled)"));
					if (buttons.length === 0) return;
					const index = buttons.indexOf(focused);
					const from = index >= 0 ? index : walkIndex.current;
					const next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : from === null ? e.key === "ArrowDown" ? 0 : buttons.length - 1 : (from + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
					e.preventDefault();
					walkIndex.current = next;
					buttons[next]?.focus();
				};
				const onWindowBlur = () => {
					if (document.activeElement instanceof HTMLIFrameElement) onClose();
				};
				document.addEventListener("pointerdown", onPointerDown);
				const onEscape = (event) => {
					if (event.key === "Escape") onKeyDown(event);
				};
				const onOtherKey = (event) => {
					if (event.key !== "Escape") onKeyDown(event);
				};
				document.addEventListener("keydown", onOtherKey);
				document.addEventListener("keydown", onEscape, true);
				window.addEventListener("blur", onWindowBlur);
				return () => {
					composition.dispose();
					document.removeEventListener("pointerdown", onPointerDown);
					document.removeEventListener("keydown", onOtherKey);
					document.removeEventListener("keydown", onEscape, true);
					window.removeEventListener("blur", onWindowBlur);
				};
			}, [
				open,
				onClose,
				autoFocus
			]);
			(0, react.useEffect)(() => {
				if (!open) cancelClose();
			}, [open, cancelClose]);
			const scrollable = !items.some((entry) => !isSeparator(entry) && !isLabel(entry) && entry.submenu !== void 0 && entry.submenu.length > 0);
			const renderEntry = (entry) => {
				if (isSeparator(entry)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: Menu_module_css_default.separator,
					role: "separator"
				}, entry.id);
				if (isLabel(entry)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: Menu_module_css_default.label,
					role: "presentation",
					children: entry.text
				}, entry.id);
				const hasSub = entry.submenu !== void 0 && entry.submenu.length > 0;
				const subOpen = hasSub && openSubmenuId === entry.id;
				const selected = entry.id === selectedId || selectedIds?.includes(entry.id) === true;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: Menu_module_css_default.itemWrap,
					onMouseEnter: hasSub ? () => {
						setOpenSubmenuId(entry.id);
					} : void 0,
					onMouseLeave: () => {
						setOpenSubmenuId(null);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "menuitem",
						className: clsx(Menu_module_css_default.item, selected && (selection === "fill" ? Menu_module_css_default.selectedFill : Menu_module_css_default.selected), entry.danger === true && Menu_module_css_default.danger),
						disabled: entry.disabled,
						"aria-keyshortcuts": entry.shortcut?.aria,
						"aria-haspopup": hasSub ? "menu" : void 0,
						"aria-expanded": hasSub ? subOpen : void 0,
						onFocus: hasSub ? () => {
							setOpenSubmenuId(entry.id);
						} : void 0,
						onClick: () => {
							if (hasSub) {
								setOpenSubmenuId(entry.id);
								return;
							}
							onSelect?.(entry.id);
						},
						children: [
							entry.icon !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: Menu_module_css_default.itemIcon,
								children: entry.icon
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: Menu_module_css_default.itemLabel,
								children: entry.label
							}),
							entry.shortcut !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: Menu_module_css_default.shortcut,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShortcutKeys, {
									keys: entry.shortcut.keys,
									className: Menu_module_css_default.shortcutKeys
								})
							}),
							selected && selection === "check" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconCheckOutlineRegular, { className: Menu_module_css_default.check })
						]
					}), subOpen && entry.submenu !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuSurface, {
						compact,
						className: clsx(Menu_module_css_default.submenu, compact && Menu_module_css_default.compactList),
						role: "menu",
						children: entry.submenu.map((sub) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "menuitem",
							className: Menu_module_css_default.item,
							disabled: sub.disabled,
							"aria-keyshortcuts": sub.shortcut?.aria,
							onClick: () => {
								onSelect?.(sub.id);
								refocusAfterSelection();
							},
							children: [
								sub.icon !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: Menu_module_css_default.itemIcon,
									children: sub.icon
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: Menu_module_css_default.itemLabel,
									children: sub.label
								}),
								sub.shortcut !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: Menu_module_css_default.shortcut,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShortcutKeys, {
										keys: sub.shortcut.keys,
										className: Menu_module_css_default.shortcutKeys
									})
								})
							]
						}, sub.id))
					})]
				}, entry.id);
			};
			const collapseSubmenuFrom = (e) => {
				const row = e.target instanceof Element ? e.target.closest("button[role=\"menuitem\"]") : null;
				if (row === null || row.getAttribute("aria-haspopup") === "menu") return;
				if (row.closest("[role=\"menu\"]") !== e.currentTarget) return;
				setOpenSubmenuId(null);
			};
			const list = open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(MenuSurface, {
				compact,
				ref: listRef,
				className: clsx(Menu_module_css_default.list, listClassName, dense && Menu_module_css_default.denseList, compact && Menu_module_css_default.compactList, scrollable && Menu_module_css_default.scrollable, portal && Menu_module_css_default.portal, side === "top" && !portal && Menu_module_css_default.sideTop, align === "end" && !portal && Menu_module_css_default.alignEnd),
				style: portal ? fixedPos ?? MEASURE_STYLE : void 0,
				role: "menu",
				onClick: (e) => {
					e.stopPropagation();
					const row = e.target instanceof Element ? e.target.closest("button[role=\"menuitem\"]") : null;
					if (row !== null && row.getAttribute("aria-haspopup") !== "menu") refocusAfterSelection();
				},
				onMouseOver: collapseSubmenuFrom,
				onFocus: collapseSubmenuFrom,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: Menu_module_css_default.viewport,
					role: "presentation",
					children: [items.map(renderEntry), children]
				}), footer !== void 0 && footer.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: Menu_module_css_default.footer,
					role: "presentation",
					children: footer.map(renderEntry)
				})]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				ref: rootRef,
				className: clsx(Menu_module_css_default.root, className),
				onPointerEnter: closeOnPointerLeave ? cancelClose : void 0,
				onPointerLeave: closeOnPointerLeave ? () => {
					if (open) armClose();
				} : void 0,
				children: [anchor, portal ? list !== false && (0, react_dom.createPortal)(list, document.body) : list]
			});
		}
		//#endregion
		//#region bundled module
		const css = ".D9ulDa_mode{color:var(--dsw-alias-label-secondary);flex-wrap:wrap;align-items:center;gap:8px;font-size:12px;display:flex}.D9ulDa_mode select,.D9ulDa_mode button,.D9ulDa_settings input,.D9ulDa_settings select{font:inherit;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-sm,4px);max-width:100%;padding:6px 12px}.D9ulDa_mode button,.D9ulDa_settings button{cursor:pointer}.D9ulDa_mode :focus-visible,.D9ulDa_settings :focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color);outline-offset:2px}.D9ulDa_detail{overflow-wrap:anywhere;flex-basis:100%}.D9ulDa_error{color:var(--dsw-alias-state-error-primary,var(--dsw-alias-label-primary));overflow-wrap:anywhere}.D9ulDa_settings{min-width:0;max-width:680px;color:var(--dsw-alias-label-primary);font:13px/20px system-ui,sans-serif}.D9ulDa_field{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin:16px 0;display:flex}.D9ulDa_field input:not([type=checkbox]){flex:1;min-width:0;max-width:340px}.D9ulDa_settings details{margin:24px 0}.D9ulDa_settings summary{cursor:pointer}.D9ulDa_settings button:disabled,.D9ulDa_mode button:disabled{opacity:.5;cursor:default}.D9ulDa_group{border-bottom:.5px solid var(--dsw-alias-border-l1);margin:24px 0;padding-bottom:24px}.D9ulDa_group h3{margin:0 0 12px;font-size:14px;font-weight:500}.D9ulDa_presets{flex-direction:column;gap:8px;display:flex}.D9ulDa_presets button{text-align:left;flex-wrap:wrap;justify-content:space-between;gap:8px;height:auto;min-height:36px;display:flex}.D9ulDa_presetHint,.D9ulDa_muted{color:var(--dsw-alias-label-secondary);font-size:12px}.D9ulDa_actions{flex-wrap:wrap;gap:8px;display:flex}.D9ulDa_code{white-space:pre-wrap;overflow-wrap:anywhere;max-height:280px;overflow:auto}";
		const tagId = "@deepseek-ai/dsh-long-task/LongTask.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-long-task";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var LongTask_module_css_default = {
			"actions": "D9ulDa_actions",
			"code": "D9ulDa_code",
			"detail": "D9ulDa_detail",
			"error": "D9ulDa_error",
			"field": "D9ulDa_field",
			"group": "D9ulDa_group",
			"mode": "D9ulDa_mode",
			"muted": "D9ulDa_muted",
			"presetHint": "D9ulDa_presetHint",
			"presets": "D9ulDa_presets",
			"settings": "D9ulDa_settings"
		};
		//#endregion
		//#region src/client/Mode.tsx
		/** Framework-derived session props and journal projection; actions carry explicit operator intent. */
		function Mode({ sessionId, useProjection, act, open, t }) {
			const job = useProjection("long-task-job");
			const [error, setError] = (0, react.useState)(""), [busy, setBusy] = (0, react.useState)(false), [menu, setMenu] = (0, react.useState)(false);
			const action = async (op) => {
				setBusy(true);
				setError("");
				try {
					await act({
						op,
						sessionId
					});
				} catch (e) {
					setError(String(e));
				} finally {
					setBusy(false);
				}
			};
			if (!job?.jobId) return null;
			const entries = [{
				type: "label",
				id: "state",
				text: t(job.phase === "done" && (job.route === "non_coding" || !job.reviewEnabled) ? "completedNormal" : job.phase) + " · " + (job.route === "pending" ? t("routing") : job.route === "non_coding" ? t("nonCoding") : !job.reviewEnabled ? t("selfReview") : job.reviewer?.backend === "jev" ? "JEV" : "Laya")
			}, {
				id: "open",
				label: t("open")
			}];
			if (job.mode === "long" && job.phase === "active") entries.push({
				id: "pause",
				label: t("pause"),
				disabled: busy
			});
			else if (job.phase !== "ended" && job.phase !== "done") entries.push({
				id: "resume",
				label: t("resume"),
				disabled: busy
			});
			if (job.phase !== "active") entries.push({
				id: "new",
				label: t("newJob"),
				disabled: busy
			});
			if (job.phase !== "ended") entries.push({
				id: "end",
				label: t("end"),
				disabled: busy
			});
			if (job.pendingCalls.length) entries.push({
				type: "label",
				id: "uncertain",
				text: t("unknown")
			}, {
				id: "acknowledge",
				label: t("ack"),
				disabled: busy
			});
			if (job.changes.length) entries.push({
				type: "label",
				id: "changes",
				text: t("changes") + ": " + job.changes.map((c) => c.taskId).join(", ")
			});
			if (job.reason) entries.push({
				type: "label",
				id: "reason",
				text: job.reason
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: LongTask_module_css_default.mode,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Menu, {
					open: menu,
					portal: true,
					align: "end",
					items: entries,
					onClose: () => setMenu(false),
					anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: LongTask_module_css_default.jobTrigger,
						"aria-label": t("jobActions"),
						"aria-haspopup": "menu",
						"aria-expanded": menu,
						onClick: () => setMenu(!menu),
						children: [
							t("long"),
							" · ",
							t(job.phase === "done" && (job.route === "non_coding" || !job.reviewEnabled) ? "completedNormal" : job.phase),
							" ▾"
						]
					}),
					onSelect: (id) => {
						setMenu(false);
						if (id === "open") open();
						else if ([
							"pause",
							"resume",
							"end",
							"new",
							"acknowledge"
						].includes(id)) action(id);
					}
				}), error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					role: "alert",
					className: LongTask_module_css_default.error,
					children: error
				})]
			});
		}
		//#endregion
		//#region src/client/presets.ts
		/** Original Claude Loop presets stage drafts; Save commits them. */
		const presets = [
			{
				name: "presetBalanced",
				hint: "presetBalancedHint",
				values: {
					maxToolTurns: 30,
					snipAtRatio: .6,
					compactAtRatio: 0,
					turnTokenBudget: 0,
					budgetCompletionRatio: .9,
					budgetDiminishingDelta: 500,
					maxTokensRecoveryLimit: 3,
					planAgentModel: null
				}
			},
			{
				name: "presetLong",
				hint: "presetLongHint",
				values: {
					maxToolTurns: 0,
					snipAtRatio: .5,
					compactAtRatio: 0,
					turnTokenBudget: 0,
					budgetCompletionRatio: .9,
					budgetDiminishingDelta: 500,
					maxTokensRecoveryLimit: 10,
					planAgentModel: null
				}
			},
			{
				name: "presetFrugal",
				hint: "presetFrugalHint",
				values: {
					maxToolTurns: 12,
					snipAtRatio: .5,
					compactAtRatio: 0,
					turnTokenBudget: 6e3,
					budgetCompletionRatio: .9,
					budgetDiminishingDelta: 500,
					maxTokensRecoveryLimit: 3,
					planAgentModel: null
				}
			},
			{
				name: "presetCareful",
				hint: "presetCarefulHint",
				values: {
					maxToolTurns: 60,
					snipAtRatio: .75,
					compactAtRatio: 0,
					turnTokenBudget: 0,
					budgetCompletionRatio: .9,
					budgetDiminishingDelta: 500,
					maxTokensRecoveryLimit: 5,
					planAgentModel: null
				}
			}
		];
		//#endregion
		//#region src/client/Settings.tsx
		/** Unified settings with explicit saves and retained drafts after failures. */
		function Settings({ act, layaStatus, saveLaya, reconnect, t }) {
			const [draft, setDraft] = (0, react.useState)(null), [loop, setLoop] = (0, react.useState)(null);
			const [reviewer, setReviewer] = (0, react.useState)(null), [reviewerDraft, setReviewerDraft] = (0, react.useState)(null), [key, setKey] = (0, react.useState)("");
			const [laya, setLaya] = (0, react.useState)(null), [preferences, setPreferences] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(""), [notice, setNotice] = (0, react.useState)(""), [busy, setBusy] = (0, react.useState)(false), [testing, setTesting] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let live = true;
				Promise.all([act({ op: "settings" }), layaStatus()]).then(([s, l]) => {
					if (live) {
						setDraft(s.settings);
						setLoop(s.loop);
						setReviewer(s.reviewer);
						setReviewerDraft(s.reviewer.settings);
						setLaya(l);
						setPreferences(l.settings);
					}
				}).catch((e) => {
					if (live) setError(String(e));
				});
				return () => {
					live = false;
				};
			}, [act, layaStatus]);
			const run = async (fn, message = t("saved")) => {
				setBusy(true);
				setError("");
				setNotice("");
				try {
					await fn();
					setNotice(message);
				} catch (e) {
					setError(String(e));
				} finally {
					setBusy(false);
				}
			};
			const test = async (backend) => {
				setTesting(true);
				setError("");
				setNotice("");
				try {
					setReviewer((await act({
						op: "testReviewer",
						backend
					})).reviewer);
					setNotice(t("testPassed"));
				} catch (e) {
					setError(String(e));
					const s = await act({ op: "settings" }).catch(() => null);
					if (s) setReviewer(s.reviewer);
				} finally {
					setTesting(false);
				}
			};
			if (!draft || !preferences || !loop || !reviewer || !reviewerDraft) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				className: LongTask_module_css_default.settings,
				children: error ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "alert",
					children: error
				}) : t("loading")
			});
			const disabled = busy || testing, cloudDirty = JSON.stringify(reviewerDraft) !== JSON.stringify(reviewer.settings) || key !== "";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: LongTask_module_css_default.settings,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("hint") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: LongTask_module_css_default.group,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("claudeLoop") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("presetHint") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: LongTask_module_css_default.presets,
								children: presets.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									disabled,
									title: t(p.hint),
									onClick: () => {
										setLoop({
											...loop,
											...p.values
										});
										setNotice(t("staged"));
									},
									children: [t(p.name), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: LongTask_module_css_default.presetHint,
										children: t(p.hint)
									})]
								}, p.name))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
								t("currentLoop"),
								": ",
								loop.maxToolTurns === 0 ? t("unlimited") : loop.maxToolTurns,
								" ",
								t("toolSteps"),
								" · ",
								Math.round(loop.snipAtRatio * 100),
								"% ",
								t("trimContext"),
								" · ",
								loop.maxTokensRecoveryLimit,
								" ",
								t("resumes")
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: LongTask_module_css_default.field,
								children: [t("maxToolTurns"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "number",
									min: "0",
									value: loop.maxToolTurns,
									onChange: (e) => setLoop({
										...loop,
										maxToolTurns: Number(e.target.value)
									})
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: LongTask_module_css_default.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("deferMcpTools") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
									label: t("deferMcpTools"),
									checked: loop.deferMcpTools,
									disabled,
									onChange: (value) => setLoop({
										...loop,
										deferMcpTools: value
									})
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: LongTask_module_css_default.muted,
								children: t("toolHint")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								open: error ? true : void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("loopAdvanced") }),
									[
										"snipAtRatio",
										"compactAtRatio",
										"turnTokenBudget",
										"budgetCompletionRatio",
										"budgetDiminishingDelta",
										"maxTokensRecoveryLimit",
										"layaReviewMaxRepairs",
										"layaReviewTimeoutMs",
										"layaReviewStallRounds"
									].map((name) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t(name), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: name.endsWith("Ratio") ? "0.05" : "1",
											value: loop[name],
											onChange: (e) => setLoop({
												...loop,
												[name]: Number(e.target.value)
											})
										})]
									}, name)),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("planAgentModel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											value: loop.planAgentModel ?? "",
											onChange: (e) => setLoop({
												...loop,
												planAgentModel: e.target.value || null
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: LongTask_module_css_default.muted,
										children: t("loopAdvancedHint")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								disabled,
								onClick: () => void run(async () => {
									setLoop((await act({
										op: "saveLoop",
										loop
									})).loop);
								}),
								children: t("saveLoop")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: LongTask_module_css_default.group,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("reviewerTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("reviewerHint") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: LongTask_module_css_default.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("independentReview") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
									label: t("independentReview"),
									checked: draft.independentReview,
									disabled,
									onChange: (value) => setDraft({
										...draft,
										independentReview: value
									})
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("routingHint") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								disabled,
								onClick: () => void run(async () => {
									setDraft((await act({
										op: "saveReviewPolicy",
										enabled: draft.independentReview
									})).settings);
								}),
								children: t("saveReviewPolicy")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
								t("service"),
								": ",
								reviewer.settings.backend === "jev" ? t("cloudJev") : t("localLaya"),
								" · ",
								reviewer.settings.backend === "jev" ? t(reviewer.phase) : laya ? t(laya.phase) : t("loading")
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: LongTask_module_css_default.field,
								children: [t("reviewerBackend"), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									value: reviewerDraft.backend,
									disabled,
									onChange: (e) => setReviewerDraft({
										...reviewerDraft,
										backend: e.target.value
									}),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "laya",
										children: t("localLaya")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "jev",
										children: t("cloudJev")
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								disabled,
								onClick: () => void run(async () => {
									const s = await act({
										op: "saveReviewer",
										reviewer: reviewerDraft,
										...key ? { apiKey: key } : {}
									});
									setReviewer(s.reviewer);
									setReviewerDraft(s.reviewer.settings);
									setKey("");
								}),
								children: t("saveReviewer")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								open: reviewerDraft.backend === "jev" || error ? true : void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("cloudJev") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("jevProtocol") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										t("cloudStatus"),
										": ",
										t(reviewer.phase),
										" · ",
										reviewer.credentialConfigured ? t("keySaved") : t("keyMissing")
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("endpoint"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "url",
											value: reviewerDraft.endpoint,
											onChange: (e) => setReviewerDraft({
												...reviewerDraft,
												endpoint: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("jevModel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											value: reviewerDraft.model,
											onChange: (e) => setReviewerDraft({
												...reviewerDraft,
												model: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("apiKey"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "password",
											autoComplete: "new-password",
											value: key,
											placeholder: reviewer.credentialConfigured ? t("keyKeep") : t("keyMissing"),
											onChange: (e) => setKey(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("jevTimeout"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "number",
											min: "1000",
											value: reviewerDraft.timeoutMs,
											onChange: (e) => setReviewerDraft({
												...reviewerDraft,
												timeoutMs: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: LongTask_module_css_default.muted,
										children: t("cloudHint")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										disabled: disabled || cloudDirty || !reviewer.credentialConfigured,
										onClick: () => void test("jev"),
										children: t("testJev")
									}),
									cloudDirty && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: LongTask_module_css_default.muted,
										children: t("saveBeforeTest")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								open: error ? true : void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("localLaya") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										t("service"),
										": ",
										laya ? t(laya.phase) : t("loading"),
										" · ",
										t("actualDevice"),
										": ",
										laya?.actualDevice ?? "—"
									] }),
									laya?.error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										role: "alert",
										className: LongTask_module_css_default.error,
										children: laya.error
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: LongTask_module_css_default.field,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("enabled") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
											label: t("enabled"),
											checked: preferences.enabled,
											disabled,
											onChange: (value) => setPreferences({
												...preferences,
												enabled: value
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("launcher"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											value: preferences.launcher,
											onChange: (e) => setPreferences({
												...preferences,
												launcher: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("device"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
											value: preferences.device,
											onChange: (e) => setPreferences({
												...preferences,
												device: e.target.value
											}),
											children: [
												"auto",
												"cpu",
												"mps",
												"cuda"
											].map((v) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", { children: v }, v))
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("localModels"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											value: preferences.models.join(", "),
											onChange: (e) => setPreferences({
												...preferences,
												models: e.target.value.split(",").map((v) => v.trim())
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: LongTask_module_css_default.field,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("preload") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
											label: t("preload"),
											checked: preferences.preload,
											disabled,
											onChange: (value) => setPreferences({
												...preferences,
												preload: value
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: LongTask_module_css_default.field,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("offline") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
											label: t("offline"),
											checked: preferences.offline,
											disabled,
											onChange: (value) => setPreferences({
												...preferences,
												offline: value
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t("localTimeout"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "number",
											min: "1000",
											value: preferences.timeoutMs,
											onChange: (e) => setPreferences({
												...preferences,
												timeoutMs: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: LongTask_module_css_default.actions,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
												disabled,
												onClick: () => void run(async () => {
													const l = await saveLaya(preferences);
													setLaya(l);
													setPreferences(l.settings);
												}),
												children: t("saveService")
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
												disabled,
												onClick: () => void run(async () => {
													setLaya(await reconnect());
												}, t("reconnected")),
												children: t("reconnect")
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
												disabled: disabled || laya?.phase !== "ready" || JSON.stringify(preferences) !== JSON.stringify(laya.settings),
												onClick: () => void test("laya"),
												children: t("testLaya")
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [
										t("availableTools"),
										" (",
										laya?.tools.length ?? 0,
										")"
									] }), laya?.tools.map((tool) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: tool.name }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: tool.description }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
											className: LongTask_module_css_default.code,
											children: tool.schema
										})
									] }, tool.name))] })
								]
							}),
							testing && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								role: "status",
								children: [
									t("checking"),
									" ",
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										onClick: () => void act({ op: "cancelReviewerTest" }).catch((e) => setError(String(e))),
										children: t("cancelTest")
									})
								]
							}),
							reviewer.test && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								role: "status",
								children: [
									reviewer.test.backend === "jev" ? "JEV" : "Laya",
									" · ",
									reviewer.test.model ?? "—",
									" · ",
									(reviewer.test.rate * 100).toFixed(1),
									"% · ",
									reviewer.test.elapsedMs,
									" ms · ",
									t("testSample")
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: LongTask_module_css_default.group,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("budgetsTitle") }),
							[
								"threshold",
								"noProgressLimit",
								"maxToolCalls",
								"maxAssessments",
								"maxMinutes"
							].map((name, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: LongTask_module_css_default.field,
								children: [t([
									"threshold",
									"noProgress",
									"tools",
									"assessments",
									"minutes"
								][i]), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "number",
									value: draft[name],
									onChange: (e) => setDraft({
										...draft,
										[name]: Number(e.target.value)
									})
								})]
							}, name)),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
								open: error ? true : void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("costAdvanced") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("costHint") }),
									[
										"maxModelTokens",
										"maxCost",
										"inputPerMillion",
										"outputPerMillion"
									].map((name, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: LongTask_module_css_default.field,
										children: [t([
											"tokens",
											"cost",
											"inputPrice",
											"outputPrice"
										][i]), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											value: draft[name],
											onChange: (e) => setDraft({
												...draft,
												[name]: Number(e.target.value)
											})
										})]
									}, name))
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								disabled,
								onClick: () => void run(async () => {
									setDraft((await act({
										op: "save",
										...Object.fromEntries(Object.entries(draft).filter(([key]) => key !== "independentReview"))
									})).settings);
								}),
								children: t("saveBudgets")
							})
						]
					}),
					error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "alert",
						className: LongTask_module_css_default.error,
						children: error
					}),
					notice && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						role: "status",
						children: notice
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		const en = {
			independentReview: "Enable independent acceptance for code tasks",
			saveReviewPolicy: "Save acceptance switch",
			routingHint: "The main model first identifies code tasks. Non-code work answers normally; code uses plan.md plus Laya/Jev when enabled, or a normal task plan plus primary self-review when disabled. Applies to new jobs only.",
			routing: "Analyzing request",
			nonCoding: "Non-code · normal answer",
			selfReview: "Primary self-review",
			completedNormal: "Completed",
			jobActions: "Long-task controls",
			"claudeLoop": "Claude Loop",
			"presetHint": "Choose a preset, adjust values if needed, then save.",
			"presetBalanced": "Balanced (recommended)",
			"presetBalancedHint": "30 steps · trim at 60% · 3 resumes",
			"presetLong": "Long tasks",
			"presetLongHint": "Unlimited steps · trim at 50% · 10 resumes",
			"presetFrugal": "Save tokens",
			"presetFrugalHint": "12 steps · 6,000 output target · 3 resumes",
			"presetCareful": "Careful review",
			"presetCarefulHint": "60 steps · trim at 75% · 5 resumes",
			"staged": "Preset staged; save to apply.",
			"currentLoop": "Current draft",
			"unlimited": "Unlimited",
			"toolSteps": "steps per turn",
			"trimContext": "trim threshold",
			"resumes": "automatic resumes",
			"maxToolTurns": "Tool-use steps per turn (0: unlimited)",
			"deferMcpTools": "Discover MCP tools before loading schemas",
			"toolHint": "Per-turn steps and the total long-task tool budget apply together. The sidebar retains per-turn and session tool counts.",
			"loopAdvanced": "Claude Loop advanced settings",
			"snipAtRatio": "Trim context ratio (0–1; 0 disables)",
			"compactAtRatio": "Compact context ratio (0–1; 0 disables)",
			"turnTokenBudget": "Output target per turn (0 disables)",
			"budgetCompletionRatio": "Output target completion ratio (0–1)",
			"budgetDiminishingDelta": "Minimum output progress (tokens)",
			"maxTokensRecoveryLimit": "Resumes after output limit (0 disables)",
			"layaReviewMaxRepairs": "Maximum automatic repairs (0: budget-limited)",
			"layaReviewTimeoutMs": "Assessment timeout (ms)",
			"layaReviewStallRounds": "Unchanged-repair limit (0 disables)",
			"planAgentModel": "Planning helper model (blank: inherit)",
			"loopAdvancedHint": "Keep compaction ratio at 0 while automatic compaction is enabled. Long tasks also obey failure and resource budgets.",
			"saveLoop": "Save Claude Loop",
			"reviewerTitle": "Model acceptance",
			"reviewerHint": "Choose local Laya or cloud Jev for new tasks. Existing tasks retain their reviewer and accepted records.",
			"reviewerBackend": "Reviewer for new tasks",
			"localLaya": "Local Laya",
			"cloudJev": "Cloud JEV",
			"saveReviewer": "Save reviewer and interface",
			"jevProtocol": "TypeSafe System One protocol: POST the full endpoint below.",
			"cloudStatus": "Cloud interface",
			"unconfigured": "Not configured",
			"configured": "Configured, not verified",
			"checking": "Checking…",
			"keySaved": "Key stored",
			"keyMissing": "No key configured",
			"endpoint": "Full API endpoint",
			"jevModel": "Jev model",
			"apiKey": "API key (blank: keep stored key)",
			"keyKeep": "Stored; leave blank to keep",
			"jevTimeout": "Cloud request timeout (ms)",
			"cloudHint": "Cloud mode sends requirements, results and cited evidence to your saved endpoint. Keys stay in the Host credential store. No automatic fallback.",
			"testJev": "Validate Jev model",
			"testLaya": "Validate Laya model",
			"saveBeforeTest": "Save these values before validation.",
			"preload": "Preload local models",
			"localModels": "Local checkpoints (comma-separated)",
			"localTimeout": "Local request timeout (ms)",
			"availableTools": "Local model tools",
			"reconnected": "Local service reconnected",
			"testPassed": "A valid model response was received.",
			"cancelTest": "Cancel validation",
			"testSample": "Fixed sample only; this does not accept any task.",
			"budgetsTitle": "Long-task acceptance and budgets",
			"costAdvanced": "Token and cost budgets",
			ready: "Ready",
			connecting: "Connecting",
			disabled: "Disabled",
			failed: "Unavailable",
			actualDevice: "Actual device",
			saveBudgets: "Save budgets",
			saveService: "Save acceptance service",
			tokens: "Model token budget",
			cost: "Estimated cost budget (0 disables)",
			inputPrice: "Input price per million tokens",
			outputPrice: "Output price per million tokens",
			costHint: "Use the same currency for budget and prices. Estimate uses aggregate tokens without cache discounts; unavailable usage pauses a cost-limited task.",
			title: "Long Task Mode",
			ordinary: "Normal",
			long: "Long task",
			pause: "Pause",
			resume: "Continue",
			end: "End task",
			newJob: "New task",
			active: "Running",
			paused: "Paused",
			blocked: "Blocked",
			done: "Accepted",
			ended: "Ended",
			idle: "Ready",
			modeLabel: "Execution mode",
			open: "View task",
			loading: "Loading…",
			save: "Save",
			saved: "Saved",
			threshold: "Acceptance threshold (%)",
			noProgress: "Consecutive failed repairs",
			tools: "Tool call budget",
			assessments: "Assessment budget",
			minutes: "Active time budget (minutes)",
			advanced: "Local acceptance service",
			enabled: "Enable local Laya",
			launcher: "Launcher",
			device: "Device",
			offline: "Offline cache",
			reconnect: "Reconnect",
			changes: "Accepted artifacts changed; targeted revalidation required",
			reason: "Status",
			current: "Current item",
			service: "Acceptance service",
			plan: "Plan",
			hint: "Explicitly enable per conversation. Plans and accepted records survive compression and new turns.",
			unknown: "Previous action has no confirmed result. Verify its artifacts before continuing.",
			ack: "I verified uncertain actions",
			enableService: "Enable and connect Laya before starting.",
			viewPlan: "View plan path"
		};
		const zh = {
			independentReview: "代码任务启用独立验收",
			saveReviewPolicy: "保存验收开关",
			routingHint: "主模型先判断是否为代码任务。非代码任务正常回答；代码任务开启评估时按 plan.md 交由 Laya/Jev 验收，关闭时制定普通计划并由主模型自检。仅对新任务生效。",
			routing: "分析需求中",
			nonCoding: "非代码 · 正常回答",
			selfReview: "主模型自检",
			completedNormal: "已完成",
			jobActions: "长任务操作",
			"claudeLoop": "Claude Loop",
			"presetHint": "选一个预设，按需调整后点保存。",
			"presetBalanced": "省心默认（推荐）",
			"presetBalancedHint": "每轮30步 · 60%开始精简 · 续写3次",
			"presetLong": "长任务不打断",
			"presetLongHint": "步数不限 · 50%开始精简 · 续写10次",
			"presetFrugal": "省钱模式",
			"presetFrugalHint": "每轮12步 · 输出目标6000 · 续写3次",
			"presetCareful": "稳妥复核",
			"presetCarefulHint": "每轮60步 · 75%开始精简 · 续写5次",
			"staged": "预设已填入，保存后生效。",
			"currentLoop": "当前草稿",
			"unlimited": "不限",
			"toolSteps": "步／轮",
			"trimContext": "开始精简",
			"resumes": "次自动续写",
			"maxToolTurns": "每轮工具调用步数（0 为不限）",
			"deferMcpTools": "先发现 MCP 工具，再加载调用参数",
			"toolHint": "每轮步数和长任务总工具预算同时生效；侧栏保留本轮及全会话的调用统计。",
			"loopAdvanced": "Claude Loop 高级设置",
			"snipAtRatio": "上下文精简比例（0–1，0 为关闭）",
			"compactAtRatio": "上下文压缩比例（0–1，0 为关闭）",
			"turnTokenBudget": "每轮输出目标（0 为不设）",
			"budgetCompletionRatio": "输出目标收尾比例（0–1）",
			"budgetDiminishingDelta": "最低输出进展（Token）",
			"maxTokensRecoveryLimit": "截断后自动续写次数（0 为关闭）",
			"layaReviewMaxRepairs": "最多自动修复轮数（0 为按总预算）",
			"layaReviewTimeoutMs": "验收超时（毫秒）",
			"layaReviewStallRounds": "无变化修复上限（0 为关闭）",
			"planAgentModel": "规划助手模型（留空跟随主模型）",
			"loopAdvancedHint": "已启用自动压缩时，压缩比例请保持0。长任务仍受连续失败次数及资源总预算限制。",
			"saveLoop": "保存 Claude Loop 配置",
			"reviewerTitle": "模型验收",
			"reviewerHint": "为新任务选择本地 Laya 或云端 Jev；已有任务保留原验收模型和通过记录。",
			"reviewerBackend": "新任务的验收模型",
			"localLaya": "本地 Laya 模型",
			"cloudJev": "云端 JEV 模型",
			"saveReviewer": "保存验收模型与接口",
			"jevProtocol": "使用 TypeSafe System One 协议，向下方完整接口地址发送 POST 请求。",
			"cloudStatus": "云端接口状态",
			"unconfigured": "未配置",
			"configured": "已配置，尚未校验",
			"checking": "校验中…",
			"keySaved": "密钥已保存",
			"keyMissing": "尚未配置密钥",
			"endpoint": "完整 API 接口地址",
			"jevModel": "Jev 模型名称",
			"apiKey": "API 密钥（留空保留已存密钥）",
			"keyKeep": "已保存，留空即可保留",
			"jevTimeout": "云端请求超时（毫秒）",
			"cloudHint": "云端模式将需求、结果和引用证据发送至你保存的地址；密钥保存在 Host 凭据服务。不会自动切换验收模型。",
			"testJev": "校验 Jev 模型",
			"testLaya": "校验 Laya 模型",
			"saveBeforeTest": "请先保存当前配置，再校验模型。",
			"preload": "预加载本地模型",
			"localModels": "本地检查点（英文逗号分隔）",
			"localTimeout": "本地请求超时（毫秒）",
			"availableTools": "本地模型工具调用项",
			"reconnected": "本地服务已重新连接",
			"testPassed": "已收到有效的模型校验响应。",
			"cancelTest": "取消校验",
			"testSample": "仅为固定样例校验，不计入任务验收。",
			"budgetsTitle": "长任务验收与预算",
			"costAdvanced": "Token 与费用预算",
			ready: "已就绪",
			connecting: "连接中",
			disabled: "未启用",
			failed: "不可用",
			actualDevice: "实际设备",
			saveBudgets: "保存预算",
			saveService: "保存验收服务",
			tokens: "模型 Token 预算",
			cost: "预估费用预算（0 为不启用）",
			inputPrice: "每百万输入 Token 单价",
			outputPrice: "每百万输出 Token 单价",
			costHint: "预算与单价使用同一币种；按总 Token 保守估算，不扣缓存折扣。费用预算开启后，缺少用量将暂停任务。",
			title: "长任务模式",
			ordinary: "普通",
			long: "长任务",
			pause: "暂停",
			resume: "继续",
			end: "结束任务",
			newJob: "新建任务",
			active: "运行中",
			paused: "已暂停",
			blocked: "受阻",
			done: "已验收",
			ended: "已结束",
			idle: "待开始",
			modeLabel: "执行模式",
			open: "查看任务",
			loading: "读取中…",
			save: "保存",
			saved: "已保存",
			threshold: "验收阈值（%）",
			noProgress: "连续修复未通过次数",
			tools: "工具调用预算",
			assessments: "评分次数预算",
			minutes: "运行时长预算（分钟）",
			advanced: "本地验收服务",
			enabled: "启用本地 Laya",
			launcher: "启动器",
			device: "设备",
			offline: "仅使用离线缓存",
			reconnect: "重新连接",
			changes: "已验收交付物变化，需要定向复验",
			reason: "状态",
			current: "当前任务",
			service: "验收服务",
			plan: "计划",
			hint: "按会话显式开启，计划与通过记录在压缩和新回合后保留。",
			unknown: "上次动作缺少可信结果，继续前请核查真实产物。",
			ack: "我已核查不确定动作",
			enableService: "开始前请先启用并连接 Laya。",
			viewPlan: "查看计划路径"
		};
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"slots",
			"locale",
			"remote",
			"sidebarRightTabs",
			"sidebarRight"
		];
		async function apply(ctx) {
			apply$1(ctx);
			await ctx.remote.$mount(remoteContribution$1);
			await ctx.remote.$mount(remoteContribution);
			ctx.effect(() => ctx.locale.register("longTask", {
				en,
				zh
			}), "long task dictionaries");
			const t = ctx.locale.bind("longTask");
			ctx.inject(["remote.longTasks", "remote.laya"], (ctx) => {
				const act = async (request) => {
					const result = await ctx.remote.longTasks.request(request);
					if (!result.ok) throw new Error(result.error.message);
					return result.value;
				};
				const layaStatus = async () => {
					const r = await ctx.remote.laya.status();
					if (!r.ok) throw new Error(r.error.message);
					return r.value;
				};
				ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
					name: "conversation.session.header.utilities",
					id: "long-task-actions",
					order: 15,
					locale: "longTask",
					inject: (sessionId) => ({
						act,
						open: () => {
							ctx.sidebarRight.openTabIn(sessionId, "claude-loop-flow");
						}
					})
				}, Mode));
				ctx.slots.inject("settings.section", () => ctx.slots.register({
					name: "settings.section",
					id: "long-task",
					order: 30,
					label: () => t("title"),
					locale: "longTask",
					inject: () => ({
						act,
						layaStatus,
						saveLaya: async (settings) => {
							const r = await ctx.remote.laya.save(settings);
							if (!r.ok) throw new Error(r.error.message);
							return r.value;
						},
						reconnect: async () => {
							const r = await ctx.remote.laya.reconnect();
							if (!r.ok) throw new Error(r.error.message);
							return r.value;
						}
					})
				}, Settings));
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map