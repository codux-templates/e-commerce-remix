import classNames from 'classnames';
import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, json, useRouteError, useNavigate, isRouteErrorResponse } from '@remix-run/react';
import { getEcomApi } from '~/api/ecom-api';
import { EcomApiErrorCodes } from '~/api/types';
import { getImageHttpUrl } from '~/api/wix-image';
import { ProductCard } from '~/components/product-card/product-card';
import { ROUTES } from '~/router/config';
import { getUrlOriginWithPath, isOutOfStock } from '~/utils';
import { ErrorComponent } from '~/components/error-component/error-component';
import styles from './category.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const categorySlug = params.categorySlug;
    if (!categorySlug) {
        throw new Error('Missing category slug');
    }

    const api = getEcomApi();
    const currentCategoryResponse = await api.getCategoryBySlug(categorySlug);
    if (currentCategoryResponse.status === 'failure') {
        throw json(currentCategoryResponse.error);
    }
    const allCategoriesResponse = await api.getAllCategories();
    if (allCategoriesResponse.status === 'failure') {
        throw json(allCategoriesResponse.error);
    }

    const categoryProductsResponse = await api.getProductsByCategory(categorySlug);
    if (categoryProductsResponse.status === 'failure') {
        throw json(categoryProductsResponse.error);
    }

    return {
        categoryProducts: categoryProductsResponse.body,
        currentCategory: currentCategoryResponse.body,
        allCategories: allCategoriesResponse.body,
        canonicalUrl: getUrlOriginWithPath(request.url),
    };
};

export default function ProductsCategoryPage() {
    const { categoryProducts, currentCategory, allCategories } = useLoaderData<typeof loader>();

    return (
        <div className={styles.root}>
            <div className={styles.filters}>
                <div className={styles.filterSection}>
                    <div className={styles.filterSectionName}>Browse by</div>

                    <div>
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
                    </div>
                </div>
            </div>

            <div className={styles.products}>
                <h1 className={styles.title}>{currentCategory?.name}</h1>
                <div className={styles.gallery}>
                    {categoryProducts?.map(
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
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    if (isRouteErrorResponse(error)) {
        let title: string;
        let message: string | undefined;
        if (error.data.code === EcomApiErrorCodes.CategoryNotFound) {
            title = 'Category Not Found';
            message = "Unfortunately category you trying to open doesn't exist";
        } else {
            title = 'Failed to load category products';
            message = error.data.message;
        }

        return (
            <ErrorComponent
                title={title}
                message={message}
                actionButtonText="Back to shopping"
                onActionButtonClick={() => navigate(ROUTES.category.to())}
            />
        );
    }

    throw error;
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
