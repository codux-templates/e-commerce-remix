import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { isRouteErrorResponse, json, useLoaderData, useRouteError } from '@remix-run/react';
import classNames from 'classnames';
import { useRef } from 'react';
import { useAddToCart } from '~/api/api-hooks';
import { ecomApi } from '~/api/ecom-api';
import { useCartOpen } from '~/components/cart/cart-open-context';
import { Price } from '~/components/price/price';
import { ProductImages } from '~/components/product-images/product-images';
import { ProductInfo } from '~/components/product-info/product-info';
import { ProductNotFound } from '~/components/product-not-found/product-not-found';
import commonStyles from '~/styles/common-styles.module.scss';
import { getUrlOriginWithPath } from '~/utils';
import styles from './product-details.module.scss';

const OptionType = {
    color: 'color',
} as const;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    if (!params.productId) {
        throw new Error('Missing product id');
    }
    const product = await ecomApi.getProduct(params.productId);
    if (product === undefined) {
        throw json('Product Not Found', { status: 404 });
    }

    const canonicalUrl = getUrlOriginWithPath(request.url);

    return json({ product, canonicalUrl });
};

export default function ProductDetailsPage() {
    const { product } = useLoaderData<typeof loader>();
    const { setIsOpen } = useCartOpen();

    const { trigger: addToCart } = useAddToCart();
    const quantityInput = useRef<HTMLInputElement>(null);

    async function addToCartHandler() {
        if (!product?._id) {
            return;
        }
        const quantity = parseInt(quantityInput.current?.value || '1', 10);
        const options: Record<string, string> = {};
        //we are selecting here the first option for each product
        //most products in the default store do not have options.
        //but, for those who do, we need to specify the option value when we add to cart.
        product.productOptions?.forEach((option) => {
            if (option.name && option.choices?.length && option.choices[0].value) {
                options[option.name] =
                    option.optionType === OptionType.color
                        ? option.choices[0].description!
                        : option.choices[0].value;
            }
        });
        await addToCart({ id: product._id, quantity, options });
        setIsOpen(true);
    }

    return (
        <div className={styles.root}>
            <ProductImages
                mainImage={product.media?.mainMedia}
                images={product.media?.items}
                className={styles.left}
            />
            <div className={styles.right}>
                <div>{product.name}</div>
                {product.priceData?.formatted?.price && (
                    <Price
                        fullPrice={product.priceData?.formatted?.price}
                        discountedPrice={product.priceData?.formatted?.discountedPrice}
                    />
                )}
                <div className={styles.addToCart}>
                    <label>
                        Quantity: <br />
                        <input
                            ref={quantityInput}
                            className={classNames(commonStyles.numberInput, styles.quantity)}
                            type="number"
                            min={1}
                            placeholder="1"
                        />
                    </label>
                    <button
                        onClick={addToCartHandler}
                        className={classNames(commonStyles.primaryButton, styles.addToCartBtn)}
                    >
                        Add to Cart
                    </button>
                </div>
                <ProductInfo
                    className={styles.productInfo}
                    productInfo={product.additionalInfoSections}
                />
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                return <ProductNotFound />;
        }
    }

    throw error;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data) {
        return [];
    }

    const title = data.product.name ?? 'Product Details';
    const description = data.product.description ?? 'Product Description';
    const coverImage =
        data.product.media?.mainMedia?.image?.url ?? 'https://e-commerce.com/image.png';

    return [
        { title: title },
        {
            name: 'description',
            content: description,
        },
        {
            tagName: 'link',
            rel: 'canonical',
            href: data.canonicalUrl,
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
            content: coverImage,
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
            content: coverImage,
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
