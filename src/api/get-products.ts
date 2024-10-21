import { productFiltersFromSearchParams } from '~/api/product-filters';
import { productSortByFromSearchParams } from '~/api/product-sorting';
import { EcomAPI } from '~/api/types';
import { productPaginationFromSearchParams } from './product-pagination';

export const getProducts = (api: EcomAPI, categorySlug: string, searchParams: URLSearchParams) => {
    return api.getProductsByCategory(categorySlug, {
        filters: productFiltersFromSearchParams(searchParams),
        sortBy: productSortByFromSearchParams(searchParams),
        pagination: productPaginationFromSearchParams(searchParams),
    });
};
