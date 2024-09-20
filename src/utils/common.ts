import { isRouteErrorResponse } from '@remix-run/react';
import { isEcomSDKError } from '~/api/types';

export function getUrlOriginWithPath(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}

/*
 * Retrieves the message from a thrown error.
 * - Handles Remix ErrorResponse (non-Error instances).
 * - Handles Wix eCom SDK errors (non-Error instances).
 * - Defaults to converting the value to a string if no specific error type is matched.
 */
export function getErrorMessage(value: unknown): string {
    if (value instanceof Error) {
        return value.message;
    }

    if (isRouteErrorResponse(value)) {
        return value.data;
    }

    if (isEcomSDKError(value)) {
        return value.message;
    }

    if (typeof value == 'object' && value !== null) {
        return JSON.stringify(value);
    }

    return String(value);
}
