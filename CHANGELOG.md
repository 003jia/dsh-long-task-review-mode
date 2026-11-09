# Changelog / 更新记录

## 0.3.0 — 2026-11-09

### 中文

- 预算按任务固定：新任务在创建时记录工具调用、时长、模型 Token、费用与评分上限的快照；之后修改全局设置只影响新任务。任务菜单可对运行中的任务追加额度，预算用到 80% 时提醒一次；没有快照的旧任务继续沿用实时设置。
- `plan.md` 任务可声明 `checks`：评分前由宿主执行的确定性命令，失败直接判该项未通过且不调用评分模型；评分请求自动补充最近一次写入交付路径的回执与其后的失败回执。
- 非代码任务新增三种处理：直接回答（默认，行为同 0.2.x）、计划加主模型自检、计划加独立验收（opinion 类型，不要求执行回执）。模式在任务创建时固定，已有任务不受影响。
- Claude Loop 新增 `loop.scope`：默认仅长任务模式生效，「所有会话」恢复旧行为。默认范围下普通会话不再看到 `snip`／`plan_agent`／`loop_tasks`／`laya_tasks`，上下文压力与每轮步数预算也只在长任务内生效；alpha.2 上无效的 MCP 延迟开关在设置页标注说明。
- 设置页新增循环作用范围与非代码模式选项；保存失败保留草稿。

### English

- Per-job budgets: new jobs snapshot tool-call, elapsed-time, token, cost, and assessment ceilings at creation; later global changes affect only new jobs. Running jobs can be extended from the task menu, an 80% warning latches once, and legacy jobs without snapshots keep following live settings.
- `plan.md` tasks may declare `checks`: deterministic commands the host runs before scoring. A failure marks the item unpassed without a reviewer call, and review requests automatically include the latest write receipt for deliverable paths plus any later failures.
- Three non-code modes: direct answer (default, same behavior as 0.2.x), plan plus primary self-review, and plan plus independent opinion review (no execution receipts required). The mode is fixed when the job is created; existing jobs are unaffected.
- `loop.scope` selects whether Claude Loop mechanisms apply to all sessions or long-task mode only (default). Under the default, ordinary sessions no longer see `snip` / `plan_agent` / `loop_tasks` / `laya_tasks`, and context-pressure plus per-turn step budgets run only inside long tasks. The ineffective MCP-deferral switch on alpha.2 is labeled as such.
- Settings gain loop-scope and non-code mode controls; drafts survive save failures.

## 0.2.4 — 2026-11-09

### 中文

- 修复达到工具预算后被明确拒绝的调用仍残留在待确认列表、阻止继续恢复的问题；预算拒绝结算后可从当前项继续。
- 新增 `toolBudget()` Host 接口，工具纪律等配套插件可读取同一累计计数与实时上限。

### English

- Fix explicitly rejected calls remaining in the pending list after the tool budget is exhausted, which blocked resuming; settled budget refusals no longer stall continuation.
- Add the `toolBudget()` Host API so companion plugins such as tool-discipline read the same cumulative count and live ceiling.

## 0.2.3 — 2026-10-29

### 中文

- 修复 DSH 0.2.2-alpha.2 提示词接口变化引发的 `undefined.some`，恢复新旧会话。
- 自有长任务工具使用步骤激活条件；普通模式不暴露任务工具。保留 rc.3 兼容路径。
- alpha.2 的 MCP 声明遵循官方 provider 可见性和权限；旧的提示词延迟过滤暂不生效，`tool_catalog` 保留。
- 保留已有任务、验收策略、通过记录与会话历史。
- 新增中英双语说明、两张流程图、工作流参考与发布验证范围。
- 发布回归覆盖真实 Loader 的分流、历史保护、压缩、冷恢复和工具可见性；正式 alpha.2 三种真实对话已在兼容修复时验证。未重新执行完整真实代码任务和 Jev 云端质量验收。

### English

- Fix the `undefined.some` failure caused by the DSH 0.2.2-alpha.2 prompt API change, restoring existing and new conversations.
- Activate owned task tools per step, keeping them out of ordinary mode; retain the rc.3 compatibility path.
- Follow official MCP provider visibility/permissions on alpha.2. The older deferred prompt-filtering optimization is inactive; `tool_catalog` remains.
- Preserve existing jobs, review policy, accepted records, and conversation history.
- Add complete Chinese/English guides, two workflow illustrations, technical references, and explicit validation scope.
- Release regressions cover actual Loader routing, history protection, compaction, cold recovery, and tool visibility. Three formal alpha.2 real-conversation checks passed during the compatibility repair. Full real coding-task and live Jev-quality acceptance were not rerun.

## 0.2.2 — 2026-10-28

- 中文：按是否涉及代码与独立验收开关恢复三路分流；固定新任务策略快照，保护已有任务与通过记录。
- English: Introduce the three routes based on code involvement and review policy; snapshot new-job settings and preserve active tasks and approvals.

## 0.2.1 — 2026-10-27

- 中文：接入原生会话模式菜单，整合长任务入口、任务操作和设置。
- English: Integrate the native conversation-mode menu, task actions, and settings.

[Earlier releases / 更早发布](https://github.com/003jia/dsh-long-task-review-mode/releases)
