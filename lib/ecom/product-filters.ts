import { products } from '@wix/stores';
import { IProductFilters, ProductFilter } from './types';

export function productFiltersFromSearchParams(params: URLSearchParams): IProductFilters {
    const minPrice = params.get(ProductFilter.minPrice);
    const maxPrice = params.get(ProductFilter.maxPrice);
    const minPriceNumber = Number(minPrice);
    const maxPriceNumber = Number(maxPrice);
    return {
        minPrice: minPrice && !Number.isNaN(minPriceNumber) ? minPriceNumber : undefined,
        maxPrice: maxPrice && !Number.isNaN(maxPriceNumber) ? maxPriceNumber : undefined,
    };
}

export function searchParamsFromProductFilters({ minPrice, maxPrice }: IProductFilters): URLSearchParams {
    const params = new URLSearchParams();
    if (minPrice !== undefined) params.set(ProductFilter.minPrice, minPrice.toString());
    if (maxPrice !== undefined) params.set(ProductFilter.maxPrice, maxPrice.toString());
    return params;
}

export function getFilteredProductsQuery(query: products.ProductsQueryBuilder, filters: IProductFilters) {
    if (filters.minPrice) {
        query = query.ge('priceData.price', filters.minPrice);
    }

    if (filters.maxPrice) {
        query = query.le('priceData.price', filters.maxPrice);
    }

    return query;
}
