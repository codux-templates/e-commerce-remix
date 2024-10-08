/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;
    export default ReactComponent;
}

interface ClientENV {
    readonly WIX_CLIENT_ID?: string;
    // more env variables...
}

declare interface Window {
    ENV: ClientENV;
}
