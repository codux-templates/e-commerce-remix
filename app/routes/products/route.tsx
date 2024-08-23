import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getEcomApi } from '~/api/ecom-api';
import { getImageHttpUrl } from '~/api/wix-image';
import { ProductCard } from '~/components/product-card/product-card';
import { ROUTES } from '~/router/config';
import { getUrlOriginWithPath } from '~/utils';
import styles from './products.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const products = await getEcomApi().getAllProducts();

    return { products, canonicalUrl: getUrlOriginWithPath(request.url) };
};

export default function ProductsPage() {
    const { products: myProducts } = useLoaderData<typeof loader>();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>All Products</h1>
            <div className={styles.gallery}>
                {myProducts?.map(
                    (item) =>
                        item.slug &&
                        item.name && (
                            <Link to={ROUTES.product.to(item.slug)} key={item.slug}>
                                <ProductCard
                                    imageUrl={getImageHttpUrl(
                                        item.media?.items?.at(0)?.image?.url,
                                        240
                                    )}
                                    name={item.name}
                                    price={item.priceData ?? undefined}
                                    className={styles.productCard}
                                />
                            </Link>
                        )
                )}
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
