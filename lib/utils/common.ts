import { isRouteErrorResponse, Location } from '@remix-run/react';
import { isEcomSDKError } from '~/lib/ecom';

/**
 * It's important to add an appropriate role and a keyboard support
 * for non-interactive HTML elements with click handlers, such as `<div onClick={handler}></div>`.
 * This function returns a basic set of attributes
 * to make the clickable element focusable and handle keyboard events.
 */
export function getClickableElementAttributes(handler: () => void) {
    return {
        role: 'button',
        tabIndex: 0,
        onClick: handler,
        onKeyUp: (event: React.KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                handler();
            }
        },
    };
}

export function removeQueryStringFromUrl(url: string) {
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

/**
 * Merges multiple URLSearchParams instances into one URLSearchParams.
 *
 * For entries with the same key, values from subsequent URLSearchParams
 * instances will overwrite the earlier ones. For example:
 * ```js
 * const a = new URLSearchParams([['foo', '1'], ['foo', '2']])
 * const b = new URLSearchParams([['foo', '3'], ['foo', '4']])
 * const c = mergeUrlSearchParams(a, b);
 * c.toString(); // 'foo=3&foo=4'
 * ```
 */
export function mergeUrlSearchParams(...paramsArr: URLSearchParams[]): URLSearchParams {
    const result = new URLSearchParams();

    for (const params of paramsArr) {
        const overriddenParams = new Set<string>();

        for (const [key, value] of params.entries()) {
            if (result.has(key) && !overriddenParams.has(key)) {
                result.delete(key);
                overriddenParams.add(key);
            }

            result.append(key, value);
        }
    }

    return result;
}
