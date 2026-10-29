# Changelog / 更新记录

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
