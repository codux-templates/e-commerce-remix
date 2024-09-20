import { isRouteErrorResponse } from '@remix-run/react';
import { isEcomSDKError } from '~/api/types';

export function getUrlOriginWithPath(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}

/**
 * Try to find some error message in unknown value
 *
 * Handles cases when value is `ErrorResponse`, `EcomSDKError`, `String` or `Object`.
 *
 * Falls back to 'Unknown error' message.
 */
export function getErrorMessage(value: unknown): string {
    if (isRouteErrorResponse(value)) {
        return String(value.data);
    }

    if (value instanceof Error || isEcomSDKError(value)) {
        return value.message;
    }

    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }

    if (typeof value === 'string') {
        return value;
    }

    return 'Unknown error';
}
