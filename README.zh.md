# dsh-cc-loop-alignment

[English](README.md) | 中文

在现有扩展点上把 dsh agent loop 与 Claude Code 的 agent loop 对齐（不改 dsh 源码）。由动态插件 `claude-loop-alignment` 移植而来。

## 机制

- **maxToolTurns** — 每个用户轮次的工具使用预算（对应 CC `max_turns`）。达到上限后先注入一条停止指令执行一次宽限步；模型仍继续调用工具则下一步直接 reject，轮次结束。
- **snip 剪枝通道** — 上下文压力达到 `snipAtRatio` 时剪枝工具结果节点（需 `toolResultPruner`）。
- **压力压缩** — 可选在 `compactAtRatio` 时调用 `ctx.compaction.compactIfNeeded`；`dsh-compaction-basic` 以 `auto: true` 运行时保持 0。
- **token 预算** — 每用户轮次的输出 token 预算，未达完成比例时注入续写提示（`Stopped at N% of token target... Keep working`），并带收益递减停止（对应 CC `query/tokenBudget.ts`）。
- **输出截断恢复** — 步骤触顶后注入 CC 版「Resume directly」断点续写指令。
- **`snip` 工具** — 模型主动剪除历史：删除保留尾部之前的最旧 surface 消息并替换为一条占位（shadow-price 协议，无 LLM 调用）。
- **`plan_agent` 工具** — 只读架构师子代理（对应 CC PLAN_AGENT）：只读工具白名单、`maxDepth: 1`、CC 风格架构师提示词并输出 Critical Files 段。

## 安装

```sh
# 从 GitHub 安装；正式部署建议固定 commit。
dsh plugin --profile web add github:003jia/dsh-cc-loop-alignment
```

本地开发可使用 `dsh plugin --profile web add link:<本仓库绝对路径>`。如果 profile 里已经安装旧的
`@linxin666/dsh-cc-loop-alignment`，先移除它，再安装本包，避免两个 bundle 行同时组合。

从 GitHub 安装时会运行 `prepare` 构建宿主和浏览器产物。pnpm 10+ 可能要求在 profile 的
`pnpm-workspace.yaml` 显式允许构建：

```yaml
allowBuilds:
  '@003jia/dsh-cc-loop-alignment': true
```

重启 dsh 宿主进程。设置-插件出现本插件卡片；`snip` 与 `plan_agent` 对所有 agent 可用。

## 配置

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| `enabled` | true | 总开关 |
| `announceToAgent` | true | 系统提示公告段 |
| `maxToolTurns` | 20 | 每用户轮次工具步数上限（0 关闭） |
| `snipAtRatio` | 0.6 | 剪枝触发压力占比（0 关闭） |
| `compactAtRatio` | 0 | 摘要压缩触发占比（0 关闭） |
| `turnTokenBudget` | 0 | 输出 token 预算（0 关闭） |
| `budgetCompletionRatio` | 0.9 | 达到该预算占比后停止续写 |
| `budgetDiminishingDelta` | 500 | 收益递减阈值 |
| `maxTokensRecoveryLimit` | 3 | 输出截断恢复次数（0 关闭） |

宿主半区对部署内全部 agent 生效（全局作用域）；浏览器半区渲染设置卡片。可选 DSH 设置服务存在时，宿主会在该服务可用后注册 `dsh-cc-loop`，并持续把已提交设置同步到循环机制。
