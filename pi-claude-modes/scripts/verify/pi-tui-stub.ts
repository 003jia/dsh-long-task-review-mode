export const Key = {
    ctrl: (key: string) => `ctrl+${key}`,
    ctrlAlt: (key: string) => `ctrl+alt+${key}`,
    shift: (key: string) => `shift+${key}`,
};

export type TUI = {
    requestRender: () => void;
};

export function visibleWidth(text: string): number {
    return text.replace(/\x1b\[[0-9;]*m/g, "").length;
}

export function truncateToWidth(text: string, width: number, ellipsis = "…"): string {
    const plainText = text.replace(/\x1b\[[0-9;]*m/g, "");
    if (plainText.length <= width) {
        return text;
    }
    return plainText.slice(0, Math.max(0, width - ellipsis.length)) + ellipsis;
}

/**
 * Column-based slice used by the editor to strip the base editor's padding.
 * The stub measures on the ANSI-stripped text (good enough for the harness).
 */
export function sliceByColumn(line: string, startCol: number, length: number): string {
    const plainText = line.replace(/\x1b\[[0-9;]*m/g, "");
    return plainText.slice(Math.max(0, startCol), Math.max(0, startCol) + Math.max(0, length));
}

export function wrapTextWithAnsi(text: string, width: number): string[] {
    if (width <= 0) return [];
    const plainText = text.replace(/\x1b\[[0-9;]*m/g, "");
    const lines: string[] = [];
    for (let offset = 0; offset < plainText.length; offset += width) {
        lines.push(plainText.slice(offset, offset + width));
    }
    return lines.length > 0 ? lines : [""];
}
