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
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Tokens } from '@wix/sdk';
import { useEffect } from 'react';
import { CartOpenContextProvider } from '~/lib/cart-open-context';
import { EcomAPIContextProvider } from '~/lib/ecom';
import { initializeEcomSession, commitSession } from '~/lib/ecom/session';
import { getErrorMessage, routeLocationToUrl } from '~/lib/utils';
import { ErrorComponent } from '~/src/components/error-component/error-component';
import { SiteWrapper } from '~/src/components/site-wrapper/site-wrapper';

import '~/src/styles/index.scss';

export async function loader({ request }: LoaderFunctionArgs) {
    const { wixEcomTokens, session, shouldUpdateSessionCookie } = await initializeEcomSession(request);

    return json(
        {
            ENV: {
                WIX_CLIENT_ID: process?.env?.WIX_CLIENT_ID,
            },
            wixEcomTokens,
        },
        shouldUpdateSessionCookie
            ? {
                  headers: {
                      'Set-Cookie': await commitSession(session),
                  },
              }
            : undefined,
    );
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

interface ContentWrapperProps extends React.PropsWithChildren {
    tokens?: Tokens;
}

function ContentWrapper({ children, tokens }: ContentWrapperProps) {
    return (
        <EcomAPIContextProvider tokens={tokens}>
            <CartOpenContextProvider>
                <SiteWrapper>{children}</SiteWrapper>
            </CartOpenContextProvider>
        </EcomAPIContextProvider>
    );
}

export default function App() {
    const { ENV, wixEcomTokens } = useLoaderData<typeof loader>();

    if (typeof window !== 'undefined' && typeof window.ENV === 'undefined') {
        window.ENV = ENV;
    }

    return (
        <ContentWrapper tokens={wixEcomTokens}>
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
                onActionButtonClick={() => navigate('/category/all-products')}
            />
        </ContentWrapper>
    );
}

export const meta: MetaFunction = () => {
    const title = 'E-Commerce Starter';
    const description = 'Create your own e-commerce store';

    return [
        { title },
        {
            name: 'description',
            content: description,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:image',
            content: '/social-media-image.jpg',
        },
    ];
};
