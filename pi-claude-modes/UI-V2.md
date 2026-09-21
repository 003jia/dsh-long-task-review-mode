# Claude-style UI v2

输入框使用 Pi 原生输入组件，在外侧增加 `❯` 和横线。不裁剪输入字符串，完整保留内部光标标记；最终装饰行按可见列宽截断，避免窄终端崩溃。

启动区显示模型、provider、目录与常用命令。`quietStartup: true` 隐藏冗长的自动发现清单，技能仍正常加载；`pi --verbose` 可查看诊断。

底部显示当前模式、thinking、上下文与 session-cost 广播的金额。窄窗口会按可见列宽换行并保留金额。美元是模型用量估算；费用扩展按固定 7.1 汇率换算人民币，非平台账单。

## 模式

- Shift+Tab：Default → Accept edits → Plan → Default，切换不刷屏。
- `/mode`：三种常用模式；Advanced 下保留 Bypass permissions 与 Dont ask。
- Default：修改文件、非只读 shell 调用逐次确认。
- Accept edits：文件编辑自动允许，非只读 shell 调用仍需确认。
- Plan：禁用 edit/write，shell 使用原有只读规则。
- Bypass 保留二次确认；Dont ask 保留自动拒绝行为。已有会话模式和命令别名兼容。

这是 Pi 进程内模式扩展，不具备 Claude Code 全部权限规则、Auto 分类器或 OS 隔离能力。

## 验证

`verify-native.ts` 通过本机 Pi 加载，使用真实 CustomEditor 验证 7 种列宽 × 3 种 padding × 5 种输入，共 105 组；另测光标标记、删除、粘贴、状态换行及权限切换。

本次验证入口只用于测试，会主动退出进程。不要加入自动加载列表。
