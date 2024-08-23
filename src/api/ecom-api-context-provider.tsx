import React, { FC } from 'react';
import { SWRConfig } from 'swr';
import { getEcomApi } from './ecom-api';

export type EcomAPI = ReturnType<typeof getEcomApi>;
export type Cart = Awaited<ReturnType<EcomAPI['getCart']>>;

export const EcomAPIContext = React.createContext<EcomAPI | null>(null);

export const useEcomAPI = (): EcomAPI => {
    const context = React.useContext(EcomAPIContext);
    if (!context) {
        throw new Error('useEcomAPI must be used within a EcomAPIContextProvider');
    }
    return context;
};

export const EcomAPIContextProvider: FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <SWRConfig
            value={{
                revalidateIfStale: false,
                revalidateOnFocus: false,
                revalidateOnReconnect: true,
                refreshInterval: 5 * 60_000, // 5 minutes
                keepPreviousData: true,
            }}
        >
            <EcomAPIContext.Provider value={getEcomApi()}>{children}</EcomAPIContext.Provider>
        </SWRConfig>
    );
};
