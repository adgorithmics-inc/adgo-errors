import merge from 'lodash.merge';
import { isString, isObject, isArray, isError } from './types';

export type matcherKey = string | number | null;

export const findKeyInObject = (
    obj: unknown,
    matcher: (key: matcherKey, value: unknown) => boolean,
    blacklistKeys: matcherKey[],
) => {
    let result: unknown = null;

    const findValue = (key: matcherKey, value: unknown) => {
        if (result !== null) {
            return;
        }
        if (blacklistKeys.includes(key)) {
            return;
        }

        if (isObject(value)) {
            Object.keys(value).forEach(key => findValue(key, value[key]));
        }
        if (isError(value)) {
            ['message', ...Object.keys(value)].forEach(key =>
                findValue(key, value[key]),
            );
        }
        if (isArray(value)) {
            value.forEach((item: unknown, index: number) =>
                findValue(index, item),
            );
        }
        if (isString(value)) {
            let jsonParse;
            try {
                jsonParse = JSON.parse(value);
            } catch (error) {
                // fail silently
            }
            findValue(null, jsonParse);
        }
        if (matcher(key, value)) {
            result = value;
        }
    };

    findValue(null, obj);

    return result;
};

export class AdgoError extends Error {
    code: string;
    data: Record<string, unknown>;

    constructor(
        error: AdgoError | Error | string,
        data: Record<string, unknown> = {},
        code = 'adgo_error',
    ) {
        if (isString(error)) {
            super(error);
        } else if (error && error.message) {
            super(error.message);
        } else if (error && (error as AdgoError).code) {
            super((error as AdgoError).code);
        } else {
            super();
        }

        this.code = (error as AdgoError).code || (data.code as string) || code;
        this.name = (error as AdgoError).name || 'AdgoError';
        this.data = merge({}, (error as AdgoError).data, data);

        if ((error as AdgoError).stack) {
            this.stack = (error as AdgoError).stack;
        }
    }
}

export class LocalError extends AdgoError {
    constructor(
        error: AdgoError | Error | string,
        data: Record<string, unknown> = {},
    ) {
        super(error, data, 'local_error');
        this.name = 'LocalError';
    }
}

export const getErrorMessage = (
    error: unknown,
    fallbackMessage = 'Something went wrong.',
    errorMessageKeys: Array<string | number> = [
        'userMessage',
        'error_user_msg',
        'message',
        'error',
    ],
    blacklistKeys: matcherKey[] = [],
) => {
    if (isString(error)) {
        return error;
    }

    for (const key of errorMessageKeys) {
        const result = findKeyInObject(
            error,
            (k, v) => k === key && typeof v === 'string',
            blacklistKeys,
        );
        if (result) {
            return result as string;
        }
    }

    return fallbackMessage;
};
