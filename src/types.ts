export const isObject = (value: unknown): value is Record<string, unknown> => {
    return Object.prototype.toString.call(value) === '[object Object]';
};

export const isArray = Array.isArray;

export const isString = (value: unknown): value is string => {
    return Object.prototype.toString.call(value) === '[object String]';
};

export const isError = (value: unknown): value is Error => {
    return Object.prototype.toString.call(value) === '[object Error]';
};
