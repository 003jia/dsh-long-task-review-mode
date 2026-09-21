import claudeModesExtension from "./bundle.mjs";

const stripAnsi = (value) => value.replace(/\x1b\[[0-9;]*m/g, "");
const visibleWidth = (value) => stripAnsi(value).length;
let pass = 0;
let fail = 0;

function check(name, condition, extra = "") {
  if (condition) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}${extra ? ` ${extra}` : ""}`);
  }
}

function makeHarness({ hasUI = true, selectAnswer = "Allow", confirmAnswer = true, branch = [] } = {}) {
  const state = {
    commands: new Map(), shortcuts: new Map(), events: new Map(), flags: new Map(), bus: new Map(),
    statuses: [], notices: [], entries: [], prompts: [],
    activeTools: ["bash", "read", "edit", "write", "grep", "find", "ls", "questionnaire"],
    editorFactory: undefined, footerFactory: undefined, headerFactory: undefined, renderRequests: 0,
  };
  const pi = {
    registerFlag: (name, options) => state.flags.set(name, options),
    registerCommand: (name, options) => state.commands.set(name, options),
    registerShortcut: (shortcut, options) => state.shortcuts.set(shortcut, options),
    on: (event, handler) => { const handlers = state.events.get(event) ?? []; handlers.push(handler); state.events.set(event, handlers); },
    events: { on: (channel, handler) => state.bus.set(channel, handler), emit: () => {} },
    appendEntry: (customType, data) => state.entries.push({ type: "custom", customType, data }),
    getFlag: () => undefined,
    getAllTools: () => ["bash", "read", "edit", "write", "grep", "find", "ls", "questionnaire"].map((name) => ({ name })),
    getActiveTools: () => [...state.activeTools],
    setActiveTools: (tools) => { state.activeTools = [...tools]; },
    getThinkingLevel: () => "medium",
  };
  const ctx = {
    hasUI, mode: "tui", cwd: "/Users/test/project",
    model: { provider: "test-provider", id: "test-model", contextWindow: 128000 },
    getContextUsage: () => ({ contextWindow: 128000, percent: 12.5 }),
    ui: {
      theme: { fg: (color, text) => `<${color}>${text}` },
      setHeader: (factory) => { state.headerFactory = factory; },
      setEditorComponent: (factory) => { state.editorFactory = factory; },
      setFooter: (factory) => { state.footerFactory = factory; },
      setStatus: (key, value) => state.statuses.push({ key, value }),
      notify: (message, level) => state.notices.push({ message, level }),
      select: async (title, options) => { state.prompts.push({ title, options }); return selectAnswer; },
      confirm: async (title, message) => { state.prompts.push({ title, message }); return confirmAnswer; },
    },
    sessionManager: { getBranch: () => branch, getEntries: () => [], getSessionFile: () => "/tmp/pi-claude-modes-verify-session.jsonl" },
  };
  claudeModesExtension(pi);
  state.pi = pi; state.ctx = ctx;
  return state;
}

const fire = async (h, event, arg = {}) => (await Promise.all((h.events.get(event) ?? []).map((handler) => handler(arg, h.ctx)))).filter((value) => value !== undefined);
const start = (h) => fire(h, "session_start", { type: "session_start" });
const runCommand = (h, name, args = "") => h.commands.get(name).handler(args, h.ctx);
const lastStatus = (h) => h.statuses.at(-1)?.value ?? "";

console.log("== registration and startup ==");
{
  const h = makeHarness();
  await start(h);
  check("Claude editor, footer and header are registered", Boolean(h.editorFactory && h.footerFactory && h.headerFactory));
  check("five permission modes remain available", /normal, accept-edits, plan, bypass-permissions, or dont-ask/.test(h.flags.get("cc-mode").description));
  check("model_select persistence hook is registered", h.events.has("model_select"));
  check("normal status is rendered", lastStatus(h) === "<muted>● NORMAL（普通确认）", lastStatus(h));
  const header = h.headerFactory().render(100).join("\n");
  check("header includes model, cwd and commands", /test-model/.test(header) && /Users\/test\/project/.test(header) && /\/cost/.test(header), header);
  const footer = h.footerFactory({}, {}, { getExtensionStatuses: () => [] });
  const footerLine = footer.render(120).join("\n");
  check("footer includes mode, context and model thinking", /default/.test(footerLine) && /ctx 13%\/128k/.test(footerLine) && /medium/.test(footerLine), footerLine);
  const editor = h.editorFactory({ requestRender: () => { h.renderRequests++; } }, { fg: (color, text) => `<${color}>${text}` }, {});
  editor.setText("a long input with a native cursor marker");
  const lines = editor.render(80);
  check("editor has Claude prompt marker", lines.some((line) => stripAnsi(line).startsWith("❯ ")), lines.join(" || "));
  check("editor does not leak the :c cursor marker", !lines.join("\n").includes(":c"), lines.join(" || "));
  check("editor output respects terminal width", lines.every((line) => visibleWidth(line) <= 80), lines.map(visibleWidth).join(","));
  h.bus.get("session-cost:update")?.({ text: "💰 $0.012 ≈¥0.09", cost: 0.012 });
  const costFooter = h.footerFactory({}, {}, { getExtensionStatuses: () => [] }).render(120).join("\n");
  check("session cost is merged into footer", /\$0\.012/.test(costFooter) && /¥0\.09/.test(costFooter), costFooter);
}

console.log("== everyday mode cycle and Advanced permissions ==");
{
  const h = makeHarness({ selectAnswer: undefined });
  await start(h);
  await runCommand(h, "mode");
  check("picker exposes Default, Accept edits, Plan and Advanced", h.prompts.at(-1)?.options?.join(" | ") === "● Default · 修改前确认 | ○ Accept edits · 自动编辑，命令仍需确认 | ○ Plan · 只读分析与规划 | Advanced… · 全部放行 / 无人值守拒绝", JSON.stringify(h.prompts.at(-1)?.options));
  const cycle = [];
  for (let i = 0; i < 3; i++) { await h.shortcuts.get("shift+tab").handler(h.ctx); cycle.push(lastStatus(h)); }
  check("Shift+Tab cycles only the three everyday modes", cycle.map((value) => value.replace(/<[a-z]+>/, "")).join(" | ") === "⏵⏵ ACCEPT EDITS（自动接受编辑） | ⏸ PLAN（计划（只读规划）） | ● NORMAL（普通确认）", cycle.join(" | "));
}

console.log("== permission behavior ==");
{
  const normal = makeHarness();
  await start(normal);
  const dangerous = await normal.events.get("tool_call")[0]({ toolName: "bash", input: { command: "rm -rf build" } }, normal.ctx);
  check("normal mode confirms dangerous bash", dangerous === undefined && normal.prompts.length === 1);
  const accept = makeHarness();
  await start(accept);
  await runCommand(accept, "accept-edits");
  check("accept-edits allows file edits", await accept.events.get("tool_call")[0]({ toolName: "edit", input: { path: "a.ts" } }, accept.ctx) === undefined);
  const promptCount = accept.prompts.length;
  await accept.events.get("tool_call")[0]({ toolName: "bash", input: { command: "rm -rf build" } }, accept.ctx);
  check("accept-edits still confirms dangerous bash", accept.prompts.length === promptCount + 1);
  const plan = makeHarness();
  await start(plan);
  await runCommand(plan, "plan");
  const blocked = await plan.events.get("tool_call")[0]({ toolName: "edit", input: { path: "a.ts" } }, plan.ctx);
  check("plan mode blocks file edits", blocked?.block === true);
}

console.log("== width regression guard ==");
{
  const h = makeHarness();
  await start(h);
  const editor = h.editorFactory({ requestRender: () => {} }, { fg: (color, text) => `<${color}>${text}` }, {});
  editor.setText("x".repeat(400));
  const widths = [20, 40, 80, 149];
  const overflow = widths.flatMap((width) => editor.render(width).filter((line) => visibleWidth(line) > width).map((line) => ({ width, actual: visibleWidth(line) })));
  check("custom editor never renders beyond terminal width", overflow.length === 0, JSON.stringify(overflow));
}

console.log(`\n${fail ? "FAILURES" : "PASS"}: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
