/** Claude-style chrome around native Pi input; never slice input control sequences. */
import { CustomEditor } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth, wrapTextWithAnsi } from "@earendil-works/pi-tui";

/** Keep native cursor markers, autocomplete and multiline input byte-for-byte. */
export class ClaudeCodeEditor extends CustomEditor {
    chromeColor?: (text: string) => string;

    render(width: number): string[] {
        if (this.chromeColor) this.borderColor = this.chromeColor;
        const lines = width <= 4
            ? super.render(width)
            : super.render(width - 2).map((line, index) => {
                if (index === 1) {
                    return `❯ ${line}`;
                }
                // Native borders begin with SGR color codes followed by a rule.
                const isBorder = line.replace(/\x1b\[[0-9;]*m/g, "").startsWith("─");
                return `${isBorder ? this.borderColor("──") : "  "}${line}`;
            });

        // The native editor can return an overlong content line when the input
        // contains a cursor marker or a long pasted value. Clamp the final
        // decorated lines by visible columns so TuiMainScreen never crashes.
        return lines.map((line) => truncateToWidth(line, width, ""));
    }
}

/** Keep mode and amount readable on narrow screens by wrapping whole status groups. */
export function renderStatus(mode: string, details: string, width: number): string[] {
    if (width <= 0) {
        return [];
    }
    const gap = width - visibleWidth(mode) - visibleWidth(details);
    if (gap >= 3) {
        return [`${mode}${" ".repeat(gap)}${details}`];
    }
    return [mode, details].flatMap((text) => wrapTextWithAnsi(text, width))
        .map((line) => truncateToWidth(line, width, ""));
}
