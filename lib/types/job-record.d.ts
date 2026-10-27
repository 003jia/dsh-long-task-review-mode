import { z } from 'zod';
import { type SessionEvent } from '@deepseek-ai/dsh-session';
import type { JobState } from './wire.ts';
export declare const jobSchema: z.ZodType<JobState>;
export declare function readJobRecord(event: SessionEvent): JobState | undefined;
