import { useCallback, useEffect, useState } from 'react';
import type { NavigateOptions } from 'react-router';
import { useNavigation, useSearchParams } from '@remix-run/react';

/**
 * Similar to `useSearchParams` from Remix, but allows to update search params optimistically.
 */
export function useSearchParamsOptimistic() {
    const navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [optimisticSearchParams, setOptimisticSearchParams] = useState(searchParams);

    const handleSearchParamsChange = useCallback(
        (params: URLSearchParams | ((prevParams: URLSearchParams) => URLSearchParams), options?: NavigateOptions) => {
            setOptimisticSearchParams(params);
            setSearchParams(params, options);
        },
        [setSearchParams],
    );

    // Synchronize search params on back/forward browser button clicks.
    useEffect(() => {
        if (navigation.state !== 'loading') {
            setOptimisticSearchParams(searchParams);
        }
    }, [navigation.state, searchParams]);

    return [optimisticSearchParams, handleSearchParamsChange] as const;
}
