export function getUrlOriginWithPath(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}

export function toError(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }

    if (typeof value === 'undefined') {
        return new Error();
    }

    let errorMessage = String(value);
    if (typeof value === 'object' && value !== null) {
        if ('message' in value) {
            errorMessage = String(value.message);
        }

        if ('data' in value) {
            errorMessage = String(value.data);
        }
    }

    return new Error(errorMessage);
}
