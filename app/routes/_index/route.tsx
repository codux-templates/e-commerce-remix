import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData, useNavigate, json } from '@remix-run/react';
import { initializeEcomApi } from '~/lib/ecom/session';
import { isOutOfStock } from '~/lib/utils';
import { HeroImage } from '~/src/components/hero-image/hero-image';
import { ProductCard } from '~/src/components/product-card/product-card';
import styles from './index.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const ecomApi = await initializeEcomApi(request);
    const productsResponse = await ecomApi.getPromotedProducts();
    if (productsResponse.status === 'failure') {
        throw json(productsResponse.error);
    }

    return { products: productsResponse.body };
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
                onButtonClick={() => navigate('/category/all-products')}
            />
            <h1 className={styles.heroTitle}>Best Sellers</h1>
            <p className={styles.hpParagraph}>Shop our best seller items</p>
            <div className={styles.cardsLayout}>
                {products?.map((product) =>
                    product.slug && product.name ? (
                        <Link to={`/products/${product.slug}`} key={product.slug}>
                            <ProductCard
                                imageUrl={product.media?.items?.at(0)?.image?.url}
                                name={product.name}
                                price={product.priceData ?? undefined}
                                className={styles.productCard}
                                outOfStock={isOutOfStock(product)}
                            />
                        </Link>
                    ) : null,
                )}
            </div>
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = () => {
    const title = 'E-Commerce Starter';
    const description = 'Create your own e-commerce store';

    return [
        { title },
        {
            name: 'description',
            content: description,
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
            content: '/social-media-image.jpg',
        },
    ];
};
