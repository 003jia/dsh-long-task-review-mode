/** Shared acceptance rubric for local Laya and the TypeSafe Jev API. */
import type { LayaCompletionRequest } from './laya/types.ts';
export declare function completionQuestions(request: LayaCompletionRequest): {
    completion: {
        type: string;
        instructions: string;
        criteria: string[];
    };
    coverage: {
        type: string;
        instructions: string;
        criteria: string[];
    };
    constraints: {
        type: string;
        instructions: string;
        criteria: string[];
    };
    evidence: {
        type: string;
        instructions: string;
        criteria: string[];
    };
    critical: {
        type: string;
        instructions: string;
        criteria: {
            unsupported: string;
            satisfied: string;
        };
    };
    gap: {
        type: string;
        instructions: string;
        criteria: {
            missing: string;
            partial: string;
            evidence: string;
            constraints: string;
            defect: string;
            none: string;
        };
    };
};
