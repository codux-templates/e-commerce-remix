import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    json,
    useLoaderData,
    useNavigate,
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

    return (
        <ContentWrapper>
            <ErrorComponent
                title="Unknown error"
                message="Oops, something went wrong"
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
