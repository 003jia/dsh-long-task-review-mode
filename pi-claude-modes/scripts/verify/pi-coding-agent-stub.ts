/**
 * Minimal stand-in for `@earendil-works/pi-coding-agent` used by the offline
 * verify harness. It mimics the real editor's shape (a padded, ANSI-carrying
 * content line between two horizontal borders) closely enough that the width
 * math in `ClaudeCodeEditor` is actually exercised.
 */
export class CustomEditor {
    private text = "";

    protected borderColor(text: string): string {
        return text;
    }

    constructor(
        _tui: unknown,
        _theme: unknown,
        _keybindings: unknown,
        private readonly options: { paddingX?: number } = {},
    ) {}

    setText(text: string): void {
        this.text = text;
    }

    getText(): string {
        return this.text;
    }

    render(width: number): string[] {
        const paddingX = Math.min(
            this.options.paddingX ?? 0,
            Math.max(0, Math.floor((width - 1) / 2)),
        );
        const contentWidth = Math.max(1, width - paddingX * 2);
        const left = " ".repeat(paddingX);
        const text = this.text.replace(/\n/g, "⏎");
        // The cursor highlight deliberately lets the content overflow
        // `contentWidth` for long input, forcing ClaudeCodeEditor to clamp it.
        const content = `${text}\x1b[7m \x1b[0m`;
        const used = content.replace(/\x1b\[[0-9;]*m/g, "").length;
        const fill = " ".repeat(Math.max(0, contentWidth - used));
        return ["─".repeat(width), `${left}${content}${fill}${left}`, "─".repeat(width)];
    }
}

export function getAgentDir(): string {
    return "/tmp/pi-claude-modes-verify-agent";
}

export const SettingsManager = {
    create() {
        return {
            drainErrors: () => [],
            setDefaultModelAndProvider: () => {},
            flush: async () => {},
        };
    },
};
