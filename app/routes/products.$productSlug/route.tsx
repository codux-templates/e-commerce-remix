import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
    isRouteErrorResponse,
    json,
    useLoaderData,
    useNavigate,
    useRouteError,
} from '@remix-run/react';
import { products } from '@wix/stores';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useAddToCart } from '~/api/api-hooks';
import { getEcomApi } from '~/api/ecom-api';
import { useCartOpen } from '~/components/cart/cart-open-context';
import { ErrorComponent } from '~/components/error-component/error-component';
import { Price } from '~/components/price/price';
import { ProductAdditionalInfo } from '~/components/product-additional-info/product-additional-info';
import { ProductImages } from '~/components/product-images/product-images';
import { ProductOption } from '~/components/product-option/product-option';
import { UnsafeRichText } from '~/components/rich-text/rich-text';
import { getChoiceValue } from '~/components/product-option/product-option-utils';
import commonStyles from '~/styles/common-styles.module.scss';
import { ROUTES } from '~/router/config';
import { getUrlOriginWithPath } from '~/utils';
import styles from './product-details.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const productSlug = params.productSlug;
    if (!productSlug) {
        throw new Error('Missing product slug');
    }
    const product = await getEcomApi().getProduct(productSlug);
    if (product === undefined) {
        throw json('Product Not Found', { status: 404 });
    }

    const canonicalUrl = getUrlOriginWithPath(request.url);

    return json({ product, canonicalUrl });
};

export default function ProductDetailsPage() {
    const { product } = useLoaderData<typeof loader>();
    const { setIsOpen } = useCartOpen();
    const [addToCartAttempted, setAddToCartAttempted] = useState(false);

    const { trigger: addToCart } = useAddToCart();
    const quantityInput = useRef<HTMLInputElement>(null);

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string | undefined>>(
        getInitialSelectedOptions(product.productOptions)
    );

    async function addToCartHandler() {
        if (!product?._id) {
            return;
        }

        setAddToCartAttempted(true);
        if (Object.values(selectedOptions).includes(undefined)) {
            return;
        }

        const quantity = parseInt(quantityInput.current?.value ?? '1', 10);
        await addToCart({
            id: product._id,
            quantity,
            options: selectedOptions as Record<string, string>,
        });
        setIsOpen(true);
    }

    return (
        <div className={styles.root}>
            <ProductImages
                mainImage={product.media?.mainMedia}
                images={product.media?.items}
                className={styles.media}
            />
            <div className={styles.productInfo}>
                <div>
                    <div className={styles.productName}>{product.name}</div>
                    {product.sku !== undefined && (
                        <div className={styles.sku}>SKU: {product.sku}</div>
                    )}
                    {product.priceData?.formatted?.price && (
                        <Price
                            fullPrice={product.priceData?.formatted?.price}
                            discountedPrice={product.priceData?.formatted?.discountedPrice}
                        />
                    )}
                </div>

                {product.description && (
                    /** use unsafe component for description, because it comes from e-commerce site back-office */
                    <UnsafeRichText className={styles.description}>
                        {product.description}
                    </UnsafeRichText>
                )}

                {product.productOptions?.map((option) => (
                    <ProductOption
                        key={option.name}
                        error={
                            addToCartAttempted && selectedOptions[option.name!] === undefined
                                ? `Select ${option.name}`
                                : undefined
                        }
                        option={option}
                        selectedValue={selectedOptions[option.name!]}
                        onChange={(value) =>
                            setSelectedOptions((prev) => ({
                                ...prev,
                                [option.name!]: value,
                            }))
                        }
                    />
                ))}

                <div className={styles.quantity}>
                    <label>
                        <div>Quantity:</div>
                        <input
                            ref={quantityInput}
                            defaultValue={1}
                            className={classNames(commonStyles.numberInput, styles.quantity)}
                            type="number"
                            min={1}
                            placeholder="1"
                        />
                    </label>
                </div>

                <div>
                    <button
                        onClick={addToCartHandler}
                        className={classNames(commonStyles.primaryButton, styles.addToCartBtn)}
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

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                return (
                    <ErrorComponent
                        title="Product Not Found"
                        message="Unfortunately product you trying to open doesn't exist"
                        actionButtonText="Back to shopping"
                        onActionButtonClick={() => navigate(ROUTES.category.to())}
                    />
                );
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

function getInitialSelectedOptions(productOptions: products.ProductOption[] | undefined) {
    const result: Record<string, string | undefined> = {};
    for (const option of productOptions ?? []) {
        if (option.name) {
            const initialChoice = option?.choices?.length === 1 ? option.choices[0] : undefined;
            result[option.name] = getChoiceValue(option, initialChoice);
        }
    }

    return result;
}
