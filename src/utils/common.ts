import { isRouteErrorResponse } from '@remix-run/react';
import { isEcomSDKError } from '~/api/types';

export function getUrlOriginWithPath(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}

/**
 * Try to find some error message in unknown value.
 *
 * Handles remix ErrorResponse and wix ecom platform EcomSDKError error types.
 */
export function getErrorMessage(value: unknown): string | undefined {
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

    return undefined;
}
