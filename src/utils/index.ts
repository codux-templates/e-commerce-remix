export function getUrlOriginWithPath(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}

export function toError(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }

    if (typeof value === 'undefined' || value === null) {
        return new Error();
    }

    if (typeof value === 'object') {
        if ('message' in value) {
            throw new Error(String(value.message));
        }

        if ('data' in value) {
            throw new Error(String(value.data));
        }
    }

    return new Error(String(value));
}
