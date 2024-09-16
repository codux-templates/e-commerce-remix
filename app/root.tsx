import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    json,
    useLoaderData,
    useNavigate,
    useRouteError,
} from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { EcomAPIContextProvider } from '~/api/ecom-api-context-provider';
import { CartOpenContextProvider } from '~/components/cart/cart-open-context';
import { ErrorComponent } from '~/components/error-component/error-component';
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
        <ContentWrapper>
            <Outlet />
        </ContentWrapper>
    );
}

export function ErrorBoundary() {
    const locationRef = useRef<string | undefined>(
        typeof window !== 'undefined' ? window.location.href : undefined
    );

    const error = useRouteError();

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.location.href !== locationRef.current) {
                locationRef.current = window.location.href;
                clearInterval(interval);
                // force full page reload after navigating from error boundary
                // to fix remix issue with style tags disappearing
                window.location.reload();
            }
        }, 100);
    }, []);

    const navigate = useNavigate();

    const isPageNotFoundError = isRouteErrorResponse(error) && error.status === 404;

    return (
        <ContentWrapper>
            <ErrorComponent
                title={isPageNotFoundError ? 'Page Not Found' : 'Oops, something went wrong'}
                message={isPageNotFoundError ? undefined : toError(error).message}
                actionButtonText="Back to shopping"
                onActionButtonClick={() => navigate(ROUTES.category.to())}
            />
        </ContentWrapper>
    );
}

function ContentWrapper({ children }: React.PropsWithChildren) {
    return (
        <EcomAPIContextProvider>
            <CartOpenContextProvider>
                <SiteWrapper>{children}</SiteWrapper>
            </CartOpenContextProvider>
        </EcomAPIContextProvider>
    );
}

function toError(value: unknown): Error {
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
