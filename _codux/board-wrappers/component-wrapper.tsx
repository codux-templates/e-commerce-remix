import { createRemixStub } from '@remix-run/testing';
import { PropsWithChildren } from 'react';
import { EcomAPIContextProvider } from '~/lib/ecom';

export interface ComponentWrapperProps extends PropsWithChildren {
    loaderData?: Record<string, unknown>;
}

export default function ComponentWrapper({ children, loaderData }: ComponentWrapperProps) {
    const RemixStub = createRemixStub([
        {
            Component: () => children,
            ErrorBoundary: () => children,
        },
    ]);

    return (
        <EcomAPIContextProvider>
            <RemixStub hydrationData={{ loaderData }} />
        </EcomAPIContextProvider>
    );
}
