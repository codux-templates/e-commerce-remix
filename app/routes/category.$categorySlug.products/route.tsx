import { json, LoaderFunctionArgs } from '@remix-run/node';
import { getEcomApi } from '~/api/ecom-api';
import { getProducts } from '~/api/get-products';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const categorySlug = params.categorySlug;
    if (!categorySlug) {
        throw new Error('Missing category slug');
    }

    const api = getEcomApi();
    const url = new URL(request.url);

    const categoryProductsResponse = await getProducts(api, categorySlug, url.searchParams);

    if (categoryProductsResponse.status === 'failure') {
        throw json(categoryProductsResponse.error);
    }

    return {
        ...categoryProductsResponse.body,
    };
};
