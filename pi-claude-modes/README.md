# UI v2 update

日常模式现为 Default → Accept edits → Plan 三种循环；高级模式通过 `/mode` 的 Advanced 进入。输入、费用和模型状态布局已更新。当前说明和验证入口见 [UI-V2.md](UI-V2.md)。

# pi-claude-modes

基于 pi 官方 `plan-mode` 扩展示例封装的 Claude Code 风格权限模式，对齐 Claude Code 的五种
permission mode（`default` / `acceptEdits` / `plan` / `bypassPermissions` / `dontAsk`），其中前三种是日常快捷循环，后两种位于 Advanced。

## 模式

五种模式，各自的中文名称即其主要作用：

| 模式 | 中文作用 | Claude Code 对应 | 工具行为 | 适用场景 |
| --- | --- | --- | --- | --- |
| `normal` | 普通确认 | `default` | 修改文件和非只读 bash 命令逐次确认 | 默认开发模式 |
| `accept-edits` | 自动接受编辑 | `acceptEdits` | 自动允许 `edit`/`write`，危险 bash 仍需确认 | 快速连续修改 |
| `plan` | 计划（只读规划） | `plan` | 禁用 `edit`/`write`，bash 只允许只读命令白名单 | 分析、探索、规划 |
| `bypass-permissions` | 全部放行 | `bypassPermissions` | 所有工具调用直接放行，不再确认 | 完全信任的自动化任务 |
| `dont-ask` | 一律拒绝 | `dontAsk` | 不弹确认；需要确认的调用（改文件、非只读 bash）自动拒绝 | 无人值守 / CI，宁可失败也不放行 |

`/mode` 输入同时接受 Claude Code 的驼峰写法与常见简写：
`default` → `normal`，`acceptEdits` → `accept-edits`，`bypassPermissions` / `bypass` → `bypass-permissions`，
`dontAsk` → `dont-ask`。

## 前端显示

在 TUI 模式下，扩展会使用 Claude Code CLI 风格的输入区，并把当前费用并入状态行：

```text
> 请输入你的任务...
────────────────────────────────────────────────────────────
 default · shift+tab to cycle     deepseek-v4-flash · ctx 12%/128k · 💰 $0.011 ≈¥0.08
```

输入区保留 pi 原有的编辑、补全和快捷键能力，同时提供：

- `> ` Claude Code 风格的输入提示符；
- 底部左侧显示当前权限模式（如 `normal mode`、`plan mode`）；
- 底部右侧显示当前模型、上下文占用和工作目录；
- 工作中状态仍显示在输入框上边缘；
- `/cost` 显示当前会话的 token 与费用分解；费用扩展由本包自动加载。

五种模式会使用不同颜色，并在 footer 中显示中文作用：

```text
● NORMAL（普通确认）
⏵⏵ ACCEPT EDITS（自动接受编辑）
⏸ PLAN（计划（只读规划））
⏩ BYPASS PERMISSIONS（全部放行）
✕ DONT ASK（一律拒绝）
```

## 使用

```text
/mode                            打开模式选择器（选项带中文作用）
/mode status                     列出五种模式及中文作用
/mode normal                     普通确认模式
/mode accept-edits               自动接受编辑
/mode plan                       计划 / 只读规划模式
/mode bypass-permissions         全部放行（交互式切换会二次确认）
/mode dont-ask                   一律拒绝
/modes                           /mode 别名
/normal                          进入 Normal（普通确认）
/accept-edits                    进入 Accept Edits（自动接受编辑）
/plan                            进入 Plan（计划）
/bypass-permissions              进入 Bypass Permissions（全部放行，会二次确认）
/dont-ask                        进入 Dont Ask（一律拒绝）
```

快捷键：

```text
Shift+Tab             循环切换 Normal → Accept Edits → Plan
Ctrl+Alt+P            Normal / Plan 之间切换
```

> ⚠️ **Shift+Tab 需要先释放默认键位**：pi 默认把 `shift+tab` 绑定给 `app.thinking.cycle`（且属于扩展不可抢占的保留快捷键，冲突时扩展注册会被跳过）。
> 在 `~/.pi/agent/keybindings.json` 里把该动作挪到别的键后重启（或 `/reload`），Shift+Tab 即生效：
>
> ```json
> {
>   "app.thinking.cycle": "ctrl+shift+t"
> }
> ```

也支持启动参数（可用英文原名或驼峰别名）：

```bash
pi --cc-mode plan
pi --cc-mode accept-edits
pi --cc-mode bypassPermissions
pi --cc-mode dontAsk
```

模式状态会通过 session custom entry 持久化，并在恢复 session 或切换 session tree 时恢复。
Shift+Tab 切换同样会持久化模式并更新 footer 状态。通过 `/model` 交互选择的模型会写入 Pi 的默认 provider/model 设置，重启后继续使用。

## 安装

```bash
pi install /Users/jiayancheng/dsh-cc-loop-alignment/pi-claude-modes
```

不要同时安装多个会修改 `tool_call` 和 active tools 的权限模式插件，例如另一个 Plan/Permission
插件，否则可能出现重复确认或权限策略互相覆盖。

费用使用消息 usage 中的 USD 估算值，人民币按固定 7.1 汇率展示，仅供参考，不代表平台账单。

## 和 cc-loop-alignment 的关系

两个包职责不同：

- `pi-claude-modes`：权限、模式、Plan/Accept Edits/Bypass/Dont Ask、前端模式显示；
- `pi-cc-loop-alignment`：工具步数提醒、上下文 snip、token budget、`plan_agent`。

目前 `cc-loop-alignment` 默认使用 `toolBudgetMode: "warn"`，因此不会和这里的模式权限形成硬拦截冲突。

## 安全边界

- Plan 模式的 bash 必须匹配只读命令白名单；
- Normal 模式对文件修改和非只读 bash 逐次确认；
- Accept Edits 仍会确认危险命令；
- Dont Ask 不弹确认，需要确认的调用直接拒绝（fail-closed）；
- Bypass Permissions 关闭全部权限检查，交互式切换时会二次确认，请只在完全信任的任务中使用；
- 非交互模式没有确认 UI 时，需确认的调用会被拒绝；
- 这是进程内权限策略，不是 OS sandbox。需要真正隔离时仍应使用容器或 sandbox。
