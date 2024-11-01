import { Tokens } from '@wix/sdk';
import React, { FC, useMemo } from 'react';
import { SWRConfig } from 'swr';
import { createApi, createWixClient } from './api';
import { EcomAPI } from './types';

export const EcomAPIContext = React.createContext<EcomAPI | null>(null);

export const useEcomAPI = (): EcomAPI => {
    const context = React.useContext(EcomAPIContext);
    if (!context) {
        throw new Error('useEcomAPI must be used within a EcomAPIContextProvider');
    }
    return context;
};

export interface EcomAPIContextProviderProps extends React.PropsWithChildren {
    tokens?: Tokens;
}

export const EcomAPIContextProvider: FC<EcomAPIContextProviderProps> = ({ tokens, children }) => {
    const api = useMemo(() => {
        const client = createWixClient(tokens);
        return createApi(client);
    }, [tokens]);

    return (
        <SWRConfig
            value={{
                revalidateIfStale: false,
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
                refreshInterval: 5 * 60_000, // 5 minutes
                keepPreviousData: true,
            }}
        >
            <EcomAPIContext.Provider value={api}>{children}</EcomAPIContext.Provider>
        </SWRConfig>
    );
};
