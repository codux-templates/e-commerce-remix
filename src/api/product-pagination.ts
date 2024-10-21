import { IProductPagination } from './types';

export const DEFAULT_PAGE_SIZE = 50;

export const OFFSET_SEARCH_PARAM = 'offset';
export const LIMIT_SEARCH_PARAM = 'limit';

export function productPaginationFromSearchParams(searchParams: URLSearchParams): IProductPagination {
    const offset = searchParams.get(OFFSET_SEARCH_PARAM);
    const limit = searchParams.get(LIMIT_SEARCH_PARAM);
    const offsetNumber = Number(offset);
    const limitNumber = Number(limit);

    return {
        offset: offset && !Number.isNaN(offsetNumber) ? offsetNumber : undefined,
        limit: limit && !Number.isNaN(limitNumber) ? limitNumber : undefined,
    };
}

export function searchParamsFromProductPagination({ offset, limit }: IProductPagination): URLSearchParams {
    const params = new URLSearchParams();
    if (offset !== undefined) params.set(OFFSET_SEARCH_PARAM, offset.toString());
    if (limit !== undefined) params.set(LIMIT_SEARCH_PARAM, limit.toString());
    return params;
}
