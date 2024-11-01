import { json } from '@remix-run/react';
import { EcomAPI, productFiltersFromSearchParams, productSortByFromSearchParams } from '~/lib/ecom';

export async function getProductsRouteData(api: EcomAPI, categorySlug: string | undefined, url: string) {
    if (!categorySlug) throw new Error('Missing category slug');

    const searchParams = new URL(url).searchParams;

    const [currentCategoryResponse, categoryProductsResponse, allCategoriesResponse, productPriceBoundsResponse] =
        await Promise.all([
            api.getCategoryBySlug(categorySlug),
            api.getProductsByCategory(categorySlug, {
                filters: productFiltersFromSearchParams(searchParams),
                sortBy: productSortByFromSearchParams(searchParams),
            }),
            api.getAllCategories(),
            api.getProductPriceBounds(categorySlug),
        ]);

    if (currentCategoryResponse.status === 'failure') {
        throw json(currentCategoryResponse.error);
    }
    if (allCategoriesResponse.status === 'failure') {
        throw json(allCategoriesResponse.error);
    }
    if (categoryProductsResponse.status === 'failure') {
        throw json(categoryProductsResponse.error);
    }
    if (productPriceBoundsResponse.status === 'failure') {
        throw json(productPriceBoundsResponse.error);
    }

    return {
        category: currentCategoryResponse.body,
        categoryProducts: categoryProductsResponse.body,
        allCategories: allCategoriesResponse.body,
        productPriceBounds: productPriceBoundsResponse.body,
    };
}
