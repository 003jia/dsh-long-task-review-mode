# pi-cc-loop-alignment

pi 扩展包：把 pi 的 agent loop 对齐 Claude Code 的 agent loop（原插件是 dsh 平台的
`@003jia/dsh-cc-loop-alignment`，本包是其 **pi 移植版**，可 `pi install` 分发）。

## 机制

| 机制 | 默认 | 说明 |
| --- | --- | --- |
| `maxToolTurns` | 20 | 每用户轮次工具调用步数上限；到上限后注入收尾指令（宽限步）。`toolBudgetMode: "warn"` 只提醒不拦截（最贴近 Claude Code）；`"block"` 则后续工具调用被拦截并关闭本轮 |
| snip pass（`snipAtRatio`） | 0.6 | 上下文压力达阈值时把较旧 toolResult 替换为一行占位符。支持按条数（`snipKeepToolResults`）或按 token 预算（`snipKeepTailTokens`）保留尾部 |
| `snip` 工具 | 启用 | 模型主动删除早期历史；可用 `keep_recent`（条数）或 `keep_recent_tokens`（近似 token 预算）裁剪，意图持久化可跨会话恢复 |
| `turnTokenBudget` | 0 | 轮次输出 token 预算，未达标时提示续写（含边际收益递减停止） |
| `maxTokensRecoveryLimit` | 0 | 默认交给 pi 原生的 recoverable-length/overflow compaction；显式开启后才使用插件续写 |
| `compactAtRatio` | 0 | 压力达阈值时在 agent 空闲后触发 `ctx.compact()` |
| `announceToAgent` | false | 系统提示词尾部追加机制说明段。默认关闭——它在每个请求都增加提示词字节，可能影响 prompt 缓存前缀 |
| `plan_agent` 工具 | 启用 | 只读软件架构师子代理；支持 `model` 参数指定更便宜/更快的模型，默认继承当前会话模型 |

压力阈值（`snipAtRatio` / `compactAtRatio`）按模型 context 窗口**归一化**：以 20 万
token 为参照，更大窗口自动等比放大触发所需压力（例：`snipAtRatio: 0.6` 在 1M 窗口
等价于 0.12，即 12% 满时触发），避免大窗口模型上阈值永远够不着。

## 安装

```sh
# 本地目录安装（改动即时生效，无需复制）
pi install /Users/jiayancheng/dsh-cc-loop-alignment/pi-cc-loop-alignment

# GitHub 仓库包含 DSH 根包和 Pi 子包；从 GitHub 使用时先克隆，再安装子目录：
git clone https://github.com/003jia/dsh-cc-loop-alignment.git
pi install ./dsh-cc-loop-alignment/pi-cc-loop-alignment
```

安装后保留在 `settings.json` 的 `packages`；**不要**同时把它放在
`~/.pi/agent/extensions/` 自动发现目录，否则扩展会被加载两次（工具重复注册、事件重复触发）。

## 配置

配置文件：`$PI_CODING_AGENT_DIR/cc-loop-alignment.json`（`PI_CC_LOOP_CONFIG` 可覆盖路径），
TUI 中用 `/cc-loop` 查看与修改：

```
/cc-loop                查看配置与会话计数器
/cc-loop edit           交互式修改
/cc-loop <key> <value>  直接设置并保存
/cc-loop reset          恢复默认
```

| 字段 | 默认 | 取值 |
| --- | --- | --- |
| `enabled` | true | 总开关 |
| `announceToAgent` | false | true/false |
| `maxToolTurns` | 20 | 0 关闭 |
| `toolBudgetMode` | warn | warn / block |
| `snipAtRatio` | 0.6 | 0 关闭，按窗口归一化 |
| `snipKeepToolResults` | 8 | 自动剪枝保留的 toolResult 条数 |
| `snipKeepTailTokens` | 0 | 自动剪枝按 token 保留尾部预算（0 用条数模式） |
| `compactAtRatio` | 0 | 0 关闭，按窗口归一化 |
| `turnTokenBudget` | 0 | 0 关闭 |
| `budgetCompletionRatio` | 0.9 | 达到预算占比后停止续推 |
| `budgetDiminishingDelta` | 500 | 连续 3 次增益低于该值则停止续推 |
| `maxTokensRecoveryLimit` | 0 | 0 关闭；pi 原生已处理 length/overflow recovery |

## 与 dsh 原版的行为差异

- **snip 裁剪粒度**：原版删任意 surface 节点；pi 侧不允许悬空 tool 调用，裁剪点取整到最近一条
  user 消息，`keep_recent` 是**保留尾部上限**而非精确条数，且压缩/分支摘要永不丢弃。
  新增 `keep_recent_tokens` / `snipKeepTailTokens` 的 **token 预算裁剪**更接近 Claude Code
  的按权重保留尾部。
- **拦截策略**：dsh 原版 `reject` 下一步是硬拦截；pi 版默认 `warn`（只注入收尾指令、永不阻塞），
  需要硬拦截时显式设 `toolBudgetMode: "block"`。
- **length recovery**：pi 核心已经处理 recoverable length 和 overflow retry，因此本包默认关闭
  `maxTokensRecoveryLimit`，避免两套恢复策略重复续写；只有明确需要 Claude Code 风格提示时才开启。
- **压力测量**：pi 用 `ctx.getContextUsage()` 估算，且阈值按窗口归一化（见上表说明）。
  已由 pi 内置压缩兜底的大会话可保持 `compactAtRatio: 0`。
- **设置入口**：dsh 是 Web 设置卡片；pi 无此概念，用 `/cc-loop` 命令。
- **plan_agent 开销**：pi 无进程内 subagent，每次以独立 `pi --mode json` 子进程运行（读-only
  白名单 + 禁扩展防递归），有独立上下文启动开销；`plan_agent` 会返回 `elapsedMs` 便于观察。
- **snip 估算**：token 模式现在会计入 tool call 参数、thinking block、图片/其他内容块的序列化开销，
  但仍是近似值，不等于 provider 的真实 tokenizer 结果。

## 目录结构

```
extensions/index.ts      入口：事件订阅、工具注册、/cc-loop 命令、enabled 开关
extensions/loop.ts       maxToolTurns(warn/block) / token 预算续写 / 截断续写 / 压力压缩
extensions/snip.ts       snip pass（条数+token 模式）、snip 工具（意图持久化）
extensions/plan-agent.ts plan_agent 只读子代理（可指定 model）
extensions/config.ts     配置加载/校验 + 会话计数器 + 压力比归一化
extensions/prompts.ts    提示词文案
```

`pi.extensions` 只声明 `index.ts` 一个入口；其余模块由其相对引用加载（避免无 default
export 的辅助文件被当作独立扩展加载报错）。

## 安全说明

`plan_agent` 以 `pi --mode json` 子进程运行，工具白名单 `read,grep,find,ls`，禁用扩展防止
递归。扩展本身与其他 pi 扩展一样拥有完整系统权限，安装前请审查源码。
