/** Read-only invocation statistics. Token chunks and schema discovery never count as calls. */
import { z } from 'zod';
import type { SessionEvent } from '@deepseek-ai/dsh-session/types';
import type { ToolUsageState, ToolUsageView } from './types.ts';
/** Checkpoint schema for the private pairing index. */
export declare const toolUsageStateSchema: z.ZodObject<{
    lastSeq: z.ZodNumber;
    turn: z.ZodNullable<z.ZodNumber>;
    current: z.ZodRecord<z.ZodString, z.ZodObject<{
        total: z.ZodNumber;
        success: z.ZodNumber;
        error: z.ZodNumber;
        running: z.ZodNumber;
        interrupted: z.ZodNumber;
    }, z.core.$strip>>;
    session: z.ZodRecord<z.ZodString, z.ZodObject<{
        total: z.ZodNumber;
        success: z.ZodNumber;
        error: z.ZodNumber;
        running: z.ZodNumber;
        interrupted: z.ZodNumber;
    }, z.core.$strip>>;
    calls: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        step: z.ZodNumber;
        name: z.ZodString;
        kind: z.ZodEnum<{
            native: "native";
            nested: "nested";
        }>;
        status: z.ZodEnum<{
            error: "error";
            success: "success";
            running: "running";
            interrupted: "interrupted";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/** Only aggregate counters cross the Host/Client boundary. */
export declare const toolUsageViewSchema: z.ZodObject<{
    turn: z.ZodNullable<z.ZodNumber>;
    current: z.ZodObject<{
        total: z.ZodNumber;
        success: z.ZodNumber;
        error: z.ZodNumber;
        running: z.ZodNumber;
        interrupted: z.ZodNumber;
        tools: z.ZodArray<z.ZodObject<{
            total: z.ZodNumber;
            success: z.ZodNumber;
            error: z.ZodNumber;
            running: z.ZodNumber;
            interrupted: z.ZodNumber;
            name: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    session: z.ZodObject<{
        total: z.ZodNumber;
        success: z.ZodNumber;
        error: z.ZodNumber;
        running: z.ZodNumber;
        interrupted: z.ZodNumber;
        tools: z.ZodArray<z.ZodObject<{
            total: z.ZodNumber;
            success: z.ZodNumber;
            error: z.ZodNumber;
            running: z.ZodNumber;
            interrupted: z.ZodNumber;
            name: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Create an empty session-local counter. */
export declare function emptyToolUsage(): ToolUsageState;
/**
 * Fold recorded native calls/results and nested PTC dispatches. New call identities
 * count as new attempts; duplicate events/results and content replacements do not.
 * @param state - counter through the previous event.
 * @param event - committed event, in session order.
 * @returns immutable state; unrelated streaming events keep the same reference.
 */
export declare function foldToolUsage(state: ToolUsageState, event: SessionEvent): ToolUsageState;
/** Derive small display aggregates without exposing the replay identity index. */
export declare function toolUsageView(state: ToolUsageState): ToolUsageView;
