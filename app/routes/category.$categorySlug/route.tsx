import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { isRouteErrorResponse, json, NavLink, useLoaderData, useNavigate, useRouteError } from '@remix-run/react';
import classNames from 'classnames';
import { getEcomApi } from '~/api/ecom-api';
import { productFiltersFromSearchParams, useAppliedProductFilters } from '~/api/product-filters';
import { useProductPagination } from '~/api/product-pagination';
import { productSortByFromSearchParams } from '~/api/product-sorting';
import { EcomApiErrorCodes } from '~/api/types';
import { getImageHttpUrl } from '~/api/wix-image';
import { AppliedProductFilters } from '~/components/applied-product-filters/applied-product-filters';
import { ErrorComponent } from '~/components/error-component/error-component';
import { ProductCard } from '~/components/product-card/product-card';
import { ProductFilters } from '~/components/product-filters/product-filters';
import { ProductSortingSelect } from '~/components/product-sorting-select/product-sorting-select';
import { ROUTES } from '~/router/config';
import { getErrorMessage, getUrlOriginWithPath, isOutOfStock } from '~/utils';

import styles from './category.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const categorySlug = params.categorySlug;
    if (!categorySlug) {
        throw new Error('Missing category slug');
    }

    const api = getEcomApi();
    const url = new URL(request.url);

    const [currentCategoryResponse, categoryProductsResponse, allCategoriesResponse, productPriceBoundsResponse] =
        await Promise.all([
            api.getCategoryBySlug(categorySlug),
            api.getProductsByCategory(categorySlug, {
                filters: productFiltersFromSearchParams(url.searchParams),
                sortBy: productSortByFromSearchParams(url.searchParams),
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

        canonicalUrl: getUrlOriginWithPath(request.url),
    };
};

export default function ProductsCategoryPage() {
    const { categoryProducts, category, allCategories, productPriceBounds } = useLoaderData<typeof loader>();

    const { appliedFilters, someFiltersApplied, clearFilters, clearAllFilters } = useAppliedProductFilters();

    const currency = categoryProducts.items[0]?.priceData?.currency ?? 'USD';

    const { products, totalProductsCount, isLoadingProducts, canLoadMoreProducts, loadMoreProducts } =
        useProductPagination(category.slug!, categoryProducts.items, categoryProducts.totalCount);

    return (
        <div className={styles.root}>
            <div className={styles.sidebar}>
                <nav className={styles.sidebarSection}>
                    <h2 className={styles.sidebarTitle}>Browse by</h2>

                    <ul>
                        {allCategories.map((category) =>
                            category.slug ? (
                                <NavLink
                                    key={category._id}
                                    to={ROUTES.category.to(category.slug)}
                                    className={({ isActive }) =>
                                        classNames('linkButton', {
                                            [styles.activeCategory]: isActive,
                                        })
                                    }
                                >
                                    {category.name}
                                </NavLink>
                            ) : null
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
                        {totalProductsCount} {totalProductsCount === 1 ? 'product' : 'products'}
                    </p>

                    <ProductSortingSelect />
                </div>

                <div className={styles.gallery}>
                    {products?.map(
                        (item) =>
                            item.slug &&
                            item.name && (
                                <NavLink to={ROUTES.product.to(item.slug)} key={item.slug}>
                                    <ProductCard
                                        imageUrl={getImageHttpUrl(item.media?.items?.at(0)?.image?.url, 240)}
                                        name={item.name}
                                        price={item.priceData ?? undefined}
                                        outOfStock={isOutOfStock(item)}
                                        className={styles.productCard}
                                    />
                                </NavLink>
                            )
                    )}
                </div>

                {canLoadMoreProducts && (
                    <div className={styles.loadMoreWrapper}>
                        <button className="primaryButton" onClick={loadMoreProducts} disabled={isLoadingProducts}>
                            {isLoadingProducts ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
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
            onActionButtonClick={() => navigate(ROUTES.category.to('all-products'))}
        />
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const title = 'E-Commerce App - Projects';
    const description = 'Welcome to the E-Commerce App - Projects Page';
    const imageUrl = 'https://e-commerce.com/image.png';

    return [
        { title },
        {
            name: 'description',
            content: description,
        },
        {
            tagName: 'link',
            rel: 'canonical',
            href: data?.canonicalUrl,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:image',
            content: imageUrl,
        },
        {
            name: 'twitter:card',
            content: 'summary_large_image',
        },
        {
            name: 'twitter:title',
            content: title,
        },
        {
            name: 'twitter:description',
            content: description,
        },
        {
            name: 'twitter:image',
            content: imageUrl,
        },
    ];
};

export const links: LinksFunction = () => {
    return [
        {
            rel: 'icon',
            href: '/favicon.ico',
            type: 'image/ico',
        },
    ];
};
