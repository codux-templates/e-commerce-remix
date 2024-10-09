import { isRouteErrorResponse, Location } from '@remix-run/react';
import { isEcomSDKError } from '~/api/types';

export function getUrlOriginWithPath(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}

/*
 * Retrieves the message from a thrown error.
 * - Handles Remix ErrorResponse (non-Error instance).
 * - Handles Wix eCom SDK errors (non-Error instance).
 * - Handles plain objects structured like an Error.
 * - Converts plain objects with unknown structure into
 *   a JSON string to help in debugging their source.
 * - Falls back to converting the value to a string.
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (isEcomSDKError(error)) {
        return error.message;
    }

    // Remix ErrorResponse thrown from an action or loader:
    // - throw new Response('oops');
    // - throw json('oops')
    // - throw json({message: 'oops'})
    if (isRouteErrorResponse(error)) {
        error = error.data;
    }

    if (typeof error == 'object' && error !== null) {
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }

        try {
            return JSON.stringify(error);
        } catch {
            // Fall through.
        }
    }

    return String(error);
}

/**
 * Converts Remix Location object into a standard URL object.
 */
export function routeLocationToUrl(location: Location, origin: string): URL {
    const url = new URL(location.pathname, origin);
    url.search = location.search;
    url.hash = location.hash;
    return url;
}
