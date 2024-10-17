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
    useNavigation,
    useRouteError,
} from '@remix-run/react';
import { useEffect } from 'react';
import { EcomAPIContextProvider } from '~/api/ecom-api-context-provider';
import { CartOpenContextProvider } from '~/components/cart';
import { ErrorComponent } from '~/components/error-component';
import { SiteWrapper } from '~/components/site-wrapper';
import { ROUTES } from '~/router/config';
import { getErrorMessage, routeLocationToUrl } from '~/utils';

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
    const error = useRouteError();
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === 'loading') {
            const url = routeLocationToUrl(navigation.location, window.location.origin);
            // force full page reload after navigating from error boundary
            // to fix remix issue with style tags disappearing
            window.location.assign(url);
        }
    }, [navigation]);

    const navigate = useNavigate();

    const isPageNotFoundError = isRouteErrorResponse(error) && error.status === 404;

    return (
        <ContentWrapper>
            <ErrorComponent
                title={isPageNotFoundError ? 'Page Not Found' : 'Oops, something went wrong'}
                message={isPageNotFoundError ? undefined : getErrorMessage(error)}
                actionButtonText="Back to shopping"
                onActionButtonClick={() => navigate(ROUTES.category.to('all-products'))}
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
