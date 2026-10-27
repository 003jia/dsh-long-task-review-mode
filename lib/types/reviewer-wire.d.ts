/** Non-secret reviewer settings. Secrets are accepted only on the write boundary. */
import { z } from 'zod';
export declare const endpointSchema: z.ZodString;
export declare const reviewerSettingsSchema: z.ZodObject<{
    backend: z.ZodEnum<{
        laya: "laya";
        jev: "jev";
    }>;
    endpoint: z.ZodString;
    model: z.ZodString;
    timeoutMs: z.ZodNumber;
}, z.core.$strict>;
export type ReviewerSettings = z.infer<typeof reviewerSettingsSchema>;
export declare const reviewerSelectionSchema: z.ZodObject<{
    backend: z.ZodEnum<{
        laya: "laya";
        jev: "jev";
    }>;
    endpoint: z.ZodString;
    model: z.ZodString;
    timeoutMs: z.ZodNumber;
    credentialRef: z.ZodString;
    revision: z.ZodString;
}, z.core.$strict>;
export type ReviewerSelection = z.infer<typeof reviewerSelectionSchema>;
export interface ReviewerView {
    settings: ReviewerSettings;
    credentialConfigured: boolean;
    phase: 'unconfigured' | 'configured' | 'checking' | 'ready' | 'failed';
    error: string | null;
    test: {
        backend: 'laya' | 'jev';
        model: string | null;
        rate: number;
        elapsedMs: number;
        at: number;
    } | null;
}
