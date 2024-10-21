import { useEffect, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from './constants';
import { getEcomApi } from './ecom-api';
import { useAppliedProductFilters } from './product-filters';
import { useAppliedProductSorting } from './product-sorting';
import { Product } from './types';

export function useProductPagination(
    categorySlug: string,
    loadedProducts: Omit<Product, 'lastUpdated' | '_createdDate'>[],
    loadedTotalCount: number
) {
    const api = getEcomApi();
    const { appliedFilters } = useAppliedProductFilters();
    const { appliedSortBy } = useAppliedProductSorting();

    const [products, setProducts] = useState(loadedProducts);
    useEffect(() => {
        setProducts(loadedProducts);
    }, [loadedProducts]);

    const [totalProductsCount, setTotalProductsCount] = useState(loadedTotalCount);
    useEffect(() => {
        setTotalProductsCount(loadedTotalCount);
    }, [loadedTotalCount]);

    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const loadMoreProducts = () => {
        setIsLoadingProducts(true);

        api.getProductsByCategory(categorySlug, {
            filters: appliedFilters,
            sortBy: appliedSortBy,
            pagination: {
                limit: DEFAULT_PAGE_SIZE,
                offset: products.length,
            },
        })
            .then((data) => {
                if (data.status === 'success') {
                    setProducts((prev) => [...prev, ...data.body.items]);
                    setTotalProductsCount(data.body.totalCount);
                }
            })
            .finally(() => {
                setIsLoadingProducts(false);
            });
    };

    return {
        products,
        totalProductsCount,
        isLoadingProducts,
        loadMoreProducts,
        canLoadMoreProducts: products.length < totalProductsCount,
    };
}
