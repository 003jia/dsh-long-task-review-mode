import { getAgentDir, SettingsManager, type ExtensionContext } from "@earendil-works/pi-coding-agent";

// ModelSelectEvent exists in Pi's internal extension types but is not re-exported
// by every released package entrypoint. Keep this small structural type here so
// the package remains compatible with those releases.
type ModelSelectEvent = {
	model: NonNullable<ExtensionContext["model"]>;
	source: "set" | "cycle" | "restore";
};

/** Persist interactive choices immediately, but do not promote restored session models. */
export async function rememberModel(event: ModelSelectEvent, ctx: ExtensionContext): Promise<void> {
    if (!ctx.hasUI || ctx.mode !== "tui" || event.source === "restore") return;
    try {
        const settings = SettingsManager.create(ctx.cwd, getAgentDir(), { projectTrusted: false });
        if (settings.drainErrors().length > 0) {
            ctx.ui.notify("模型已切换，但配置读取失败，未保存启动偏好。", "warning");
            return;
        }
        settings.setDefaultModelAndProvider(event.model.provider, event.model.id);
        await settings.flush();
        if (settings.drainErrors().length > 0) {
            ctx.ui.notify("模型已切换，但启动偏好保存失败，请检查 Pi 配置目录权限。", "warning");
        }
    } catch {
        ctx.ui.notify("模型已切换，但无法保存启动偏好。", "warning");
    }
}
