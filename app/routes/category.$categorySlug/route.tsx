import classNames from 'classnames';
import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { getEcomApi } from '~/api/ecom-api';
import { getImageHttpUrl } from '~/api/wix-image';
import { ProductCard } from '~/components/product-card/product-card';
import { ROUTES } from '~/router/config';
import commonStyles from '~/styles/common-styles.module.scss';
import { getUrlOriginWithPath } from '~/utils';
import styles from './category.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const categorySlug = params.categorySlug;
    if (!categorySlug) {
        throw new Error('Missing category slug');
    }

    const api = getEcomApi();
    const currentCategory = await api.getCategoryBySlug(categorySlug);
    const allCategories = await api.getAllCategories();
    const categoryProducts = await api.getProductsByCategory(categorySlug);

    return {
        categoryProducts,
        currentCategory,
        allCategories,
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
                                        classNames(commonStyles.linkButton, {
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
                                        imageUrl={getImageHttpUrl(
                                            item.media?.items?.at(0)?.image?.url,
                                            240
                                        )}
                                        name={item.name}
                                        price={item.priceData ?? undefined}
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
