import type { Agent } from '@deepseek-ai/dsh-agent';
import type { FileRecord } from './wire.ts';
export declare const hash: (value: unknown) => string;
export declare function capture(agent: Agent, paths: readonly string[], signal: AbortSignal): Promise<FileRecord[]>;
export declare function differences(before: FileRecord[], after: FileRecord[]): string[];
