import { useCallback, useMemo } from 'react';
import { useSearchParams } from '@remix-run/react';
import { ProductFilter, productFiltersFromSearchParams } from '~/lib/ecom';

export function useAppliedProductFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const appliedFilters = useMemo(() => productFiltersFromSearchParams(searchParams), [searchParams]);

    const someFiltersApplied =
        Object.values(appliedFilters).length > 0 && Object.values(appliedFilters).some((value) => value !== undefined);

    const clearFilters = useCallback(
        (filters: ProductFilter[]) => {
            setSearchParams(
                (params) => {
                    filters.forEach((filter) => params.delete(filter));
                    return params;
                },
                { preventScrollReset: true },
            );
        },
        [setSearchParams],
    );

    const clearAllFilters = useCallback(() => {
        clearFilters(Object.values(ProductFilter));
    }, [clearFilters]);

    return {
        appliedFilters,
        someFiltersApplied,
        clearFilters,
        clearAllFilters,
    };
}
