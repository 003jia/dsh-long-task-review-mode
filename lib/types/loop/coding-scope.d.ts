/**
 * Extract source paths from a recorded filesystem mutation or patch.
 * Shell commands and read operations do not establish a source write; execution success is checked by the caller.
 * @param name - recorded tool name.
 * @param argumentsJson - recorded JSON arguments.
 * @returns source paths mentioned by a supported mutation.
 */
export declare function writtenSourcePaths(name: string, argumentsJson: string): string[];
