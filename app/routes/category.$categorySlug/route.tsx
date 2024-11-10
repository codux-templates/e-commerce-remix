import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, json, useRouteError, useNavigate, isRouteErrorResponse } from '@remix-run/react';
import { GetStaticRoutes } from '@wixc3/define-remix-app';
import classNames from 'classnames';
import {
    EcomApiErrorCodes,
    createApi,
    createWixClient,
    productFiltersFromSearchParams,
    productSortByFromSearchParams,
} from '~/lib/ecom';
import { useAppliedProductFilters } from '~/lib/hooks';
import { initializeEcomApi } from '~/lib/ecom/session';
import { getErrorMessage, isOutOfStock } from '~/lib/utils';
import { ProductCard } from '~/src/components/product-card/product-card';
import { ErrorComponent } from '~/src/components/error-component/error-component';
import { ProductFilters } from '~/src/components/product-filters/product-filters';
import { AppliedProductFilters } from '~/src/components/applied-product-filters/applied-product-filters';
import { ProductSortingSelect } from '~/src/components/product-sorting-select/product-sorting-select';

import styles from './category.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const categorySlug = params.categorySlug;
    if (!categorySlug) {
        throw new Error('Missing category slug');
    }

    const ecomApi = await initializeEcomApi(request);
    const url = new URL(request.url);

    const [currentCategoryResponse, categoryProductsResponse, allCategoriesResponse, productPriceBoundsResponse] =
        await Promise.all([
            ecomApi.getCategoryBySlug(categorySlug),
            ecomApi.getProductsByCategory(categorySlug, {
                filters: productFiltersFromSearchParams(url.searchParams),
                sortBy: productSortByFromSearchParams(url.searchParams),
            }),
            ecomApi.getAllCategories(),
            ecomApi.getProductPriceBounds(categorySlug),
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
};

export const getStaticRoutes: GetStaticRoutes = async () => {
    const api = createApi(createWixClient());
    const categories = await api.getAllCategories();

    if (categories.status === 'failure') {
        throw categories.error;
    }

    return categories.body.map((category) => `/category/${category.slug}`);
};

export default function ProductsCategoryPage() {
    const { categoryProducts, category, allCategories, productPriceBounds } = useLoaderData<typeof loader>();

    const { appliedFilters, someFiltersApplied, clearFilters, clearAllFilters } = useAppliedProductFilters();

    const currency = categoryProducts.items[0]?.priceData?.currency ?? 'USD';

    return (
        <div className={styles.root}>
            <div className={styles.sidebar}>
                <nav className={styles.sidebarSection}>
                    <h2 className={styles.sidebarTitle}>Browse by</h2>

                    <ul className={styles.categoryList}>
                        {allCategories.map((category) =>
                            category.slug ? (
                                <NavLink
                                    key={category._id}
                                    to={`/category/${category.slug}`}
                                    className={({ isActive }) =>
                                        classNames(styles.categoryItem, 'linkButton', {
                                            [styles.activeCategory]: isActive,
                                        })
                                    }
                                >
                                    {category.name}
                                </NavLink>
                            ) : null,
                        )}
                    </ul>
                </nav>

                {category.numberOfProducts !== 0 && (
                    <div className={styles.sidebarSection}>
                        <h2 className={styles.sidebarTitle}>Filters</h2>
                        <ProductFilters
                            lowestPrice={productPriceBounds.lowest}
                            highestPrice={productPriceBounds.highest}
                            currency={currency}
                        />
                    </div>
                )}
            </div>

            <div className={styles.products}>
                <h1 className={styles.title}>{category?.name}</h1>

                {someFiltersApplied && (
                    <AppliedProductFilters
                        className={styles.appliedFilters}
                        appliedFilters={appliedFilters}
                        onClearFilters={clearFilters}
                        onClearAllFilters={clearAllFilters}
                        currency={currency}
                        minPriceInCategory={productPriceBounds.lowest}
                        maxPriceInCategory={productPriceBounds.highest}
                    />
                )}

                <div className={styles.countAndSorting}>
                    <p className={styles.productsCount}>
                        {categoryProducts.totalCount} {categoryProducts.totalCount === 1 ? 'product' : 'products'}
                    </p>

                    <ProductSortingSelect />
                </div>

                <div className={styles.gallery}>
                    {categoryProducts.items.map(
                        (item) =>
                            item.slug &&
                            item.name && (
                                <NavLink to={`/products/${item.slug}`} key={item.slug}>
                                    <ProductCard
                                        imageUrl={item.media?.mainMedia?.image?.url}
                                        name={item.name}
                                        price={item.priceData ?? undefined}
                                        outOfStock={isOutOfStock(item)}
                                        className={styles.productCard}
                                    />
                                </NavLink>
                            ),
                    )}
                </div>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    let title = 'Error';
    let message = getErrorMessage(error);

    if (isRouteErrorResponse(error) && error.data.code === EcomApiErrorCodes.CategoryNotFound) {
        title = 'Category Not Found';
        message = "Unfortunately, the category page you're trying to open does not exist";
    }

    return (
        <ErrorComponent
            title={title}
            message={message}
            actionButtonText="Back to shopping"
            onActionButtonClick={() => navigate('/category/all-products')}
        />
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.category.name ?? 'Products' },
        {
            name: 'description',
            content: data?.category.description,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
    ];
};
