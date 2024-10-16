import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { isRouteErrorResponse, json, useLoaderData, useNavigate, useRouteError } from '@remix-run/react';
import type { products } from '@wix/stores';
import classNames from 'classnames';
import { useState } from 'react';
import { getEcomApi } from '~/api/ecom-api';
import { AddToCartOptions, EcomApiErrorCodes } from '~/api/types';
import { useCartOpen } from '~/components/cart/cart-open-context';
import { ErrorComponent } from '~/components/error-component/error-component';
import { Price } from '~/components/price/price';
import { ProductAdditionalInfo } from '~/components/product-additional-info/product-additional-info';
import { ProductImages } from '~/components/product-images/product-images';
import { ProductOption } from '~/components/product-option/product-option';
import { UnsafeRichText } from '~/components/rich-text/rich-text';
import { useCart } from '~/hooks/use-cart';
import { ROUTES } from '~/router/config';
import {
    getErrorMessage,
    getMedia,
    getPriceData,
    getProductOptions,
    getSelectedVariant,
    getSKU,
    getUrlOriginWithPath,
    isOutOfStock,
    selectedChoicesToVariantChoices,
} from '~/utils';
import styles from './product-details.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const productSlug = params.productSlug;
    if (!productSlug) {
        throw new Error('Missing product slug');
    }
    const productResponse = await getEcomApi().getProductBySlug(productSlug);
    if (productResponse.status === 'failure') {
        throw json(productResponse.error);
    }

    return json({ product: productResponse.body, canonicalUrl: getUrlOriginWithPath(request.url) });
};

export default function ProductDetailsPage() {
    const { product } = useLoaderData<typeof loader>();
    const { setIsOpen } = useCartOpen();
    const [addToCartAttempted, setAddToCartAttempted] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const cart = useCart();

    const getInitialSelectedChoices = () => {
        const result: Record<string, products.Choice | undefined> = {};
        for (const option of product.productOptions ?? []) {
            if (option.name) {
                result[option.name] = option?.choices?.length === 1 ? option.choices[0] : undefined;
            }
        }

        return result;
    };

    const [selectedChoices, setSelectedChoices] = useState<Record<string, products.Choice | undefined>>(
        getInitialSelectedChoices()
    );

    const outOfStock = isOutOfStock(product, selectedChoices);
    const priceData = getPriceData(product, selectedChoices);
    const sku = getSKU(product, selectedChoices);
    const media = getMedia(product, selectedChoices);

    async function addToCartHandler() {
        if (!product?._id || outOfStock) {
            return;
        }

        setAddToCartAttempted(true);
        if (Object.values(selectedChoices).includes(undefined)) {
            return;
        }

        const selectedVariant = getSelectedVariant(product, selectedChoices);

        let options: AddToCartOptions = { options: selectedChoicesToVariantChoices(product, selectedChoices) };
        if (product.manageVariants && selectedVariant?._id) {
            options = { variantId: selectedVariant._id };
        }

        await cart.addItem({
            id: product._id,
            quantity,
            options,
        });
        setIsOpen(true);
    }

    const productOptions = getProductOptions(product, selectedChoices);

    return (
        <div className={styles.root}>
            <ProductImages mainImage={media?.mainMedia} images={media?.items} className={styles.media} />
            <div className={styles.productInfo}>
                <div>
                    <div className={styles.productName}>{product.name}</div>
                    {sku && <div className={styles.sku}>SKU: {sku}</div>}
                    {priceData?.formatted?.price && (
                        <Price
                            fullPrice={priceData?.formatted?.price}
                            discountedPrice={priceData?.formatted?.discountedPrice}
                        />
                    )}
                </div>

                {product.description && (
                    /** use unsafe component for description, because it comes from e-commerce site back-office */
                    <UnsafeRichText className={styles.description}>{product.description}</UnsafeRichText>
                )}

                {productOptions && productOptions.length > 0 && (
                    <div className={styles.productOptions}>
                        {productOptions.map((option) => (
                            <ProductOption
                                key={option.name}
                                error={
                                    addToCartAttempted && selectedChoices[option.name!] === undefined
                                        ? `Select ${option.name}`
                                        : undefined
                                }
                                option={option}
                                selectedChoice={selectedChoices[option.name!]}
                                onChange={(newSelectedChoice) => {
                                    setQuantity(1);
                                    setSelectedChoices((prev) => ({
                                        ...prev,
                                        [option.name!]: newSelectedChoice,
                                    }));
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className={styles.quantity}>
                    <label>
                        <div>Quantity:</div>
                        <input
                            className={classNames('numberInput', styles.quantity)}
                            type="number"
                            value={quantity}
                            min={1}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        />
                    </label>
                </div>

                <div>
                    {outOfStock && <div className={styles.outOfStockMessage}>Item is out of stock</div>}
                    <button
                        onClick={addToCartHandler}
                        className={classNames('primaryButton', styles.addToCartBtn)}
                        disabled={outOfStock}
                    >
                        Add to Cart
                    </button>
                </div>

                <ProductAdditionalInfo productInfo={product.additionalInfoSections} />
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    let title = 'Error';
    let message = getErrorMessage(error);

    if (isRouteErrorResponse(error) && error.data.code === EcomApiErrorCodes.ProductNotFound) {
        title = 'Product Not Found';
        message = "Unfortunately a product page you trying to open doesn't exist";
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
    if (!data) {
        return [];
    }

    const title = data.product.name ?? 'Product Details';
    const description = data.product.description ?? 'Product Description';
    const coverImage = data.product.media?.mainMedia?.image?.url ?? 'https://e-commerce.com/image.png';

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
