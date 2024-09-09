import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    json,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import { useEffect } from 'react';
import { EcomAPIContextProvider } from '~/api/ecom-api-context-provider';
import { CartOpenContextProvider } from '~/components/cart/cart-open-context';
import { SiteWrapper } from '~/components/site-wrapper/site-wrapper';
import { ROUTES } from '~/router/config';
import '~/styles/index.scss';

export async function loader() {
    return json({
        ENV: {
            WIX_CLIENT_ID: process?.env?.WIX_CLIENT_ID,
        },
    });
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const data = useLoaderData<typeof loader>();

    if (typeof window !== 'undefined' && typeof window.ENV === 'undefined') {
        window.ENV = data.ENV;
    }

    return (
        <EcomAPIContextProvider>
            <CartOpenContextProvider>
                <SiteWrapper>
                    <Outlet />
                </SiteWrapper>
            </CartOpenContextProvider>
        </EcomAPIContextProvider>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    const isRouteError = isRouteErrorResponse(error);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { title, message } = getErrorDetails(error);

        // hack to handle https://github.com/remix-run/remix/issues/1136
        window.location.href = ROUTES.error.to(title, message);
    }, [isRouteError, error]);

    // we are navigating to the error page in the effect above
    return null;
}

function getErrorDetails(error: unknown) {
    let title: string;
    let message: string | undefined;

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = 'Page Not Found';
            message = "Looks like the page you're trying to visit doesn't exist";
        } else {
            title = `${error.status} - ${error.statusText}`;
            message = error.data?.message ?? '';
        }
    } else {
        title = 'Unknown error ocurred';
    }

    return { title, message };
}
