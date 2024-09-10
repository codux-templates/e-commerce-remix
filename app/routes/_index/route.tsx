import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData, useNavigate } from '@remix-run/react';
import { getEcomApi } from '~/api/ecom-api';
import { HeroImage } from '~/components/hero-image/hero-image';
import { ProductCard } from '~/components/product-card/product-card';
import { ROUTES } from '~/router/config';
import { getUrlOriginWithPath } from '~/utils';
import styles from './index.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const products = await getEcomApi().getPromotedProducts();
    const canonicalUrl = getUrlOriginWithPath(request.url);

    return { products, canonicalUrl };
};

export default function HomePage() {
    const navigate = useNavigate();

    const { products } = useLoaderData<typeof loader>();

    return (
        <div className={styles.root}>
            <HeroImage
                title="Incredible Prices on All Your Favorite Items"
                topLabel="Best Prices"
                bottomLabel="Get more for less on selected brands"
                buttonLabel="Shop Now"
                topLabelClassName={styles.topLabelHighlighted}
                onButtonClick={() => navigate(ROUTES.category.to())}
            />
            <h1 className={styles.heroTitle}>Best Sellers</h1>
            <p className={styles.bestSeller}>Shop our best seller items</p>
            <div className={styles.cardsLayout}>
                {products?.map((product) =>
                    product.slug && product.name ? (
                        <Link to={ROUTES.product.to(product.slug)} key={product.slug}>
                            <ProductCard
                                imageUrl={product.media?.items?.at(0)?.image?.url}
                                name={product.name}
                                price={product.priceData ?? undefined}
                                className={styles.productCard}
                            />
                        </Link>
                    ) : null
                )}
            </div>
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const title = 'E-Commerce App';
    const description = 'Welcome to the E-Commerce App';
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
