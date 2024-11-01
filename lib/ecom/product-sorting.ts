import { products } from '@wix/stores';
import { ProductSortBy } from './types';

export const SORT_BY_SEARCH_PARAM = 'sortBy';

export const DEFAULT_SORT_BY = ProductSortBy.newest;

export function productSortByFromSearchParams(searchParams: URLSearchParams): ProductSortBy {
    const value = searchParams.get(SORT_BY_SEARCH_PARAM);
    return value && Object.values(ProductSortBy).includes(value as ProductSortBy)
        ? (value as ProductSortBy)
        : DEFAULT_SORT_BY;
}

export function getSortedProductsQuery(
    query: products.ProductsQueryBuilder,
    sortBy: ProductSortBy,
): products.ProductsQueryBuilder {
    switch (sortBy) {
        case ProductSortBy.newest:
            // numericId is incremented when creating new products,
            // so we can use it to sort products by creation date - from the newest to the oldest.
            return query.descending('numericId');
        case ProductSortBy.priceAsc:
            return query.ascending('price');
        case ProductSortBy.priceDesc:
            return query.descending('price');
        case ProductSortBy.nameAsc:
            return query.ascending('name');
        case ProductSortBy.nameDesc:
            return query.descending('name');
    }
}
