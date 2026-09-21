import assert from "node:assert/strict";
import { CURSOR_MARKER, visibleWidth, stripTerminalSequences } from "@earendil-works/pi-tui";
import { ClaudeCodeEditor, renderStatus } from "../../extensions/claude-editor.ts";
import extension from "../../extensions/index.ts";

export default function verify(pi) {
    pi.on("session_start", async (_event, ctx) => {
        try {
            let checks = 0;
            ctx.ui.setEditorComponent((tui, theme, keys) => {
                const editor = new ClaudeCodeEditor(tui, theme, keys);
                editor.focused = true;
                for (const width of [10, 20, 40, 80, 100, 149, 200]) {
                    for (const padding of [0, 1, 3]) {
                        editor.setPaddingX(padding);
                        for (const text of ["", "hello", "中文输入，测试💰", "first\n第二行", "long input 中文 ".repeat(50)]) {
                            editor.setText(text);
                            const lines = editor.render(width);
                            assert.equal(lines.join("").split(CURSOR_MARKER).length - 1, 1, "cursor marker preserved");
                            assert.equal(stripTerminalSequences(lines.join("")).includes(":c"), false, "no cursor debris");
                            for (const line of lines) assert.ok(visibleWidth(line) <= width, `${width}: ${visibleWidth(line)}`);
                            checks++;
                        }
                    }
                }
                editor.setText(":c");
                editor.handleInput("\x7f");
                editor.handleInput("\x7f");
                assert.equal(editor.getText(), "");
                editor.handleInput("\x1b[200~粘贴中文\nsecond line\x1b[201~");
                assert.ok(editor.getText().includes("粘贴中文"));
                for (const width of [10, 20, 40, 80, 100, 149, 200]) {
                    const lines = renderStatus("⏵⏵ accept edits on (shift+tab to cycle)", "high · ctx 13% · $12.345 ≈¥87.65", width);
                    lines.forEach((line) => assert.ok(visibleWidth(line) <= width));
                    assert.ok(lines.join("").includes("$12.345"));
                }
                return editor;
            });
            const events = new Map();
            const commands = new Map();
            const shortcuts = new Map();
            let activeTools = ["read", "bash", "edit", "write"];
            const statuses = new Map();
            const saved = [];
            const notices = [];
            const selections = [];
            const confirmations = [];
            const api = {
                on: (name, handler) => events.set(name, handler),
                events: { on() {} },
                registerCommand: (name, spec) => commands.set(name, spec.handler),
                registerShortcut: (key, spec) => shortcuts.set(key, spec.handler),
                registerFlag() {}, getFlag() {},
                getActiveTools: () => activeTools,
                setActiveTools: (value) => { activeTools = value; },
                getAllTools: () => ["read", "bash", "edit", "write", "grep", "find", "ls"].map((name) => ({ name })),
                appendEntry: (_type, data) => saved.push(data),
            };
            const testCtx = {
                hasUI: true, mode: "test", model: undefined,
                sessionManager: { getBranch: () => [] },
                ui: {
                    theme: ctx.ui.theme,
                    setStatus: (key, value) => statuses.set(key, value),
                    notify: (value) => notices.push(value),
                    select: async (title, options) => { selections.push({ title, options }); return undefined; },
                    confirm: async () => { confirmations.push(true); return false; },
                },
            };
            extension(api);
            await events.get("session_start")({}, testCtx);
            for (const expected of ["accept-edits", "plan", "normal", "accept-edits", "plan", "normal"]) {
                await shortcuts.get("shift+tab")(testCtx);
                assert.equal(saved.at(-1).mode, expected);
                assert.equal(activeTools.includes("edit"), expected !== "plan");
            }
            assert.equal(notices.length, 0, "cycling does not spam transcript");
            await commands.get("mode")("", testCtx);
            assert.equal(selections.at(-1).options.length, 4);
            await commands.get("mode")("acceptEdits", testCtx);
            const call = events.get("tool_call");
            assert.equal(await call({ toolName: "edit", input: { path: "test.txt" } }, testCtx), undefined);
            assert.ok((await call({ toolName: "bash", input: { command: "node script.js" } }, testCtx)).block);
            await commands.get("mode")("plan", testCtx);
            assert.ok((await call({ toolName: "write", input: {} }, testCtx)).block);
            await commands.get("mode")("bypassPermissions", testCtx);
            assert.equal(confirmations.length, 1);
            assert.equal(saved.at(-1).mode, "plan", "bypass cancel preserves plan");
            console.error(`PASS: ${checks} native input renders; cursor, deletion, paste, status widths and mode policies`);
            process.exit(0);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}
