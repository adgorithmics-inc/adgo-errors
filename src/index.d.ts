export declare type matcherKey = string | number | null;
export declare const findKeyInObject: (obj: unknown, matcher: (key: matcherKey, value: unknown) => boolean, blacklistKeys: matcherKey[]) => unknown;
export declare class AdgoError extends Error {
    readonly __isAdgoError: boolean;
    code: string;
    data: Record<string, unknown>;
    constructor(error: AdgoError | Error | string, data?: Record<string, unknown>, code?: string);
}
export declare class LocalError extends AdgoError {
    constructor(error: AdgoError | Error | string, data?: Record<string, unknown>);
}
export declare const getErrorMessage: (error: unknown, fallbackMessage?: string, errorMessageKeys?: (string | number)[], blacklistKeys?: matcherKey[]) => string;
