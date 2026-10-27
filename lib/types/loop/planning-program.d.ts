/**
 * Admit one direct planning tool call through run_code, without admitting Node API effects.
 * @param code - untrusted transport source.
 * @param maxCharacters - configured complete program limit.
 * @returns whether the program only awaits one planning call and optionally returns/logs its result.
 */
export declare function isPlanningProgram(code: string, maxCharacters: number): boolean;
