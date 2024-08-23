import { isRouteErrorResponse, useNavigate, useRouteError } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import App, { loader as rootLoader } from 'app/root';
import { type PropsWithChildren } from 'react';
import { ROUTES } from '~/router/config';

// @remix-run/testing doesn't export this type
type StubRouteObject = Parameters<typeof createRemixStub>[0][0];
type RouteParams = Omit<StubRouteObject, 'Component' | 'children' | 'path'>;

interface PageWrapperProps extends PropsWithChildren {
    initialPath?: string;
    rootRouteParams?: RouteParams;
    pageRouteParams?: RouteParams;
}

export function PageWrapper(props: PageWrapperProps) {
    const { pageRouteParams = {}, rootRouteParams = {}, initialPath = '/', children } = props;

    const RemixStub = createRemixStub([
        {
            Component: () => <App />,
            id: 'root',
            loader: rootLoader,
            children: [
                ...Object.values(ROUTES).map(({ path }) => ({
                    path,
                    Component: () => children,
                    ...pageRouteParams,
                })),
            ],
            ErrorBoundary,
            ...rootRouteParams,
        },
    ]);

    return <RemixStub initialEntries={[initialPath]} />;
}

function ErrorBoundary() {
    const navigate = useNavigate();
    const error = useRouteError();

    const goBack = (
        <button
            style={{
                border: '1px solid dodgerblue',
                cursor: 'pointer',
                padding: '0 3px',
                borderRadius: '5px',
                color: 'dodgerblue',
            }}
            onClick={() => navigate(-1)}
        >
            Go Back
        </button>
    );

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
                {goBack}
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
                {goBack}
            </div>
        );
    } else {
        return <h1>Unknown Error {goBack}</h1>;
    }
}
