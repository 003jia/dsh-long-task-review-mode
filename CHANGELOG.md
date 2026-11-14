# Changelog / 更新记录

## 0.3.5 — 2026-11-14

### 中文

- **构建类型迁移到 DSH 0.2.2-alpha.2**：装配接口改用 projection handle，新增 `plan-guard` 只读规划预设，删除旧的展示层过滤与强制类型转换。
- **状态增量记录**：任务状态日志改为“快照 + 差量”，每 20 次或大变更写完整快照；旧记录继续按快照读取。
- **设置页整合**：模型验收、预算、Claude Loop 依次排列，底部一个“保存全部设置”；新增“执行前确认计划”开关。
- **计划确认**：开启后，导入计划即暂停执行并禁止工具，回合结束后保持暂停，用户继续后才放行。
- **补充需求**：任务菜单可直接追加要求，追加内容进入验收需求。
- **报告与通知**：任务菜单可导出 Markdown 验收报告；后台时暂停/受阻/验收完成会发系统通知。
- **Loop 侧栏按钮**只在存在长任务时显示。

### English

- **Build types moved to DSH 0.2.2-alpha.2**: projection handles, a read-only `plan-guard` planning preset, and removal of the old presentation-only filtering and type casts.
- **Incremental job records**: the state journal now writes snapshots plus deltas, with a full snapshot every 20 writes or on large changes; legacy records still read as snapshots.
- **Settings consolidated**: reviewer, budgets, then Claude Loop in that order, with one “Save all settings” button and a new “Confirm the plan before execution” switch.
- **Plan confirmation**: when enabled, importing a plan pauses execution and blocks tools; the job stays paused after the turn until the user continues.
- **Requirement additions**: the task menu appends a requirement directly, and the addition joins the acceptance requirement.
- **Reports and notifications**: export a Markdown acceptance report from the task menu; background pauses, blocks and completions raise a system notification.
- **The Loop sidebar button** appears only while a long-task job exists.


## 0.3.4 — 2026-11-14

### 中文

- **计划检查走审批与沙箱**：`checks` 改由部署的 shell 执行器运行；首次执行前按审批策略询问，确认后同一任务内复用；环境只保留 PATH/HOME/TMPDIR/LANG/LC_ALL，不再继承云密钥；`never` 策略下失败关闭。Jev 未开启代码外发时，只发送检查命令与退出码，不发送输出。
- **验收质量观测**：每次评分记录输入字节、证据总数/保留/丢弃/截断与后端耗时；证据按“检查输出 > 代码差异 > 引用回执 > 补充回执”排序，回执压缩后再送入评审。新增 `tests/calib-reviewer.mjs`，用真实 Laya 对做对/做错样本重复评分。
- **状态恢复**：结束任务后新请求重开任务；暂停时接受“请继续”等常见说法；暂停期间返回的工具结果自动结算，不再要求人工确认；暂停状态会给出明确提示。
- **结构与测试**：任务状态纯函数拆到 `task-state.ts`，新增无需桌面应用的单元测试；删除 `classifyTask`、`invariant.ts`、`dirtyItems`；测试报告目录可用 `DSH_LONG_TASK_REPORT_DIR` 指定；修正 `invalidateTaskIds` 与依赖重开不一致的说明。
- **性能与预算**：已验收交付物每回合只校验一次，评分前强制复核；费用说明改为只统计非缓存输入与输出。
- **体验**：追加预算支持工具、时长、Token、费用、评分五项；MCP 按需加载说明明确对所有会话生效；独立验收开启但 Laya 未启用时在设置页提示。
- **标定结果（本地 Laya，10 个样本 ×3）**：做对样本 3/5 通过（79.7 / 65.8 / 48.0 / 71.9 / 87.5），做错样本 0/5 误通过（最高 64.4）。阈值 70 目前没有误通过，但会误杀部分合格交付；样本量小，暂不调整默认阈值。

### English

- **Plan checks use approval and sandboxing**: `checks` now run through the deployment shell executor; the first use asks under the approval policy and is reused within the job; the environment keeps only PATH/HOME/TMPDIR/LANG/LC_ALL; the `never` policy fails closed. With Jev and code evidence disabled, only commands and exit codes are sent, not output.
- **Acceptance instrumentation**: every score records input bytes, evidence total/included/dropped/excerpted, backend and elapsed time; evidence is ordered checks > diff > cited receipts > added receipts, with receipts compressed. New `tests/calib-reviewer.mjs` scores known-good and known-bad fixtures with real Laya.
- **State recovery**: a new request after ending a job starts a new job; common resume phrasing such as 请继续 works; results that arrive while paused settle the pending call; paused jobs explain the state.
- **Structure and tests**: pure task-state helpers moved to `task-state.ts` with unit tests that need no desktop app; removed `classifyTask`, `invariant.ts`, `dirtyItems`; report directory configurable via `DSH_LONG_TASK_REPORT_DIR`; corrected the dependency-reopen description.
- **Performance and budget**: accepted deliverables are checked once per turn and rechecked before scoring; cost copy now states that only non-cached input and output are counted.
- **Experience**: budget extension covers tools, minutes, tokens, cost and assessments; the MCP on-demand note states that it applies to all sessions; settings warn when independent acceptance is on but Laya is disabled.
- **Calibration (local Laya, 10 fixtures ×3)**: 3/5 good fixtures passed (79.7 / 65.8 / 48.0 / 71.9 / 87.5) and 0/5 bad fixtures mis-passed (max 64.4). Threshold 70 produces no false passes but rejects some valid deliveries; the sample is small, so the default stays unchanged.


## 0.3.3 — 2026-11-14

### 中文

- 修复任务结束后的状态死角：用户结束长任务后，在同一会话发送新请求现在会创建新任务并重新进入长任务流程，不再被当成普通回合。
- 独立验收的代码任务采用“实现优先”计划提示：每个执行项必须产生代码/文件变更或运行真实验证；分析写入任务结果或标为 opinion，避免纯诊断项连续不通过、在修改代码前暂停。
- 修正非法 plan.md 的错误提示：改为读取 `loop_tasks` 返回的计划模板，不再引用不存在的 `docs/plan-template.md`。
- 建立插件独立 git 基线（0.3.2），并对齐 README 版本与 MCP 按需加载说明。

### English

- Fix the ended-job dead zone: after the user ends a long task, a new request in the same session now creates a new job and re-enters the long-task flow instead of running as ordinary work.
- Coding jobs with independent acceptance now use implementation-first plan guidance: every execution item must change code or files, or run a real verification; analysis belongs in the item result or an opinion item, avoiding diagnosis-only items that fail repeatedly and pause before any code change.
- Fix the invalid plan.md message to read the plan template returned by `loop_tasks` instead of the missing `docs/plan-template.md`.
- Add an independent git baseline (0.3.2) and align README version and MCP on-demand loading notes.


## 0.3.2 — 2026-11-13

### 中文

- 修正程序执行模式（PTC）的判定：改为在首个请求前读取一次真实装配结果，检测请求是否只呈现 `run_code`。旧检查读取注册表，永远看不到由执行器呈现的 `run_code`，会让 PTC 会话错误地隐藏 MCP 工具。无法解析装配时按失败开放处理，保留全部 MCP 工具。
- 其余行为与 0.3.1 相同。

### English

- Fix program-transport (PTC) detection: read the actual assembly once before the first request and check whether the request presents only `run_code`. The old check read the registry, which never contains the executor-presented `run_code`, so PTC sessions would incorrectly hide MCP tools. An unresolvable assembly fails open and keeps every MCP tool.
- Otherwise identical to 0.3.1.


## 0.3.1 — 2026-11-13

### 中文

- MCP 工具改为按需加载：未选择的 MCP 工具不再进入每次模型请求，主模型通过 `tool_catalog` 搜索或按名称开启，选择在上下文压缩、会话恢复和插件重载后保留。实现改用 DSH 0.2.2 的代理作用域 `tools.restrict()`，替换在 presentation-only 装配接口上无效的提示过滤。
- 每步请求前重新核对已选集合；新连接或断开的 MCP 服务器、`run_code` 程序模式、子智能体与 PTC 的原有工具契约保持不变。未加载工具的执行会被门控拒绝并提示先加载。
- 设置页的 MCP 延迟开关恢复可用，说明改为实际行为；默认开启。

### English

- MCP tools now load on demand: unselected MCP tools stay out of every model request, and the primary model enables them through `tool_catalog` by search or exact name. Selections survive context compaction, session resume, and plugin reload. The implementation uses the DSH 0.2.2 agent-scoped `tools.restrict()` instead of prompt filtering, which cannot work on the presentation-only assembly API.
- Every step re-checks the selected set before assembly; newly connected or disconnected MCP servers, `run_code` program mode, subagents, and PTC keep their existing tool contracts. Calling an unloaded tool is denied with an instruction to load it first.
- The settings switch is active again, its hint describes the real behavior, and it defaults to on.


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
