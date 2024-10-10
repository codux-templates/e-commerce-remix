import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { isRouteErrorResponse, json, useLoaderData, useNavigate, useRouteError } from '@remix-run/react';
import type { products } from '@wix/stores';
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
import { ROUTES } from '~/router/config';
import {
    getErrorMessage,
    getPriceData,
    selectedChoicesToVariantChoices,
    getSelectedVariant,
    getSKU,
    getUrlOriginWithPath,
    isOutOfStock,
    getMedia,
    getChoiceValue,
} from '~/utils';
import { AddToCartOptions, EcomApiErrorCodes } from '~/api/types';
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

    const { trigger: addToCart } = useAddToCart();
    const quantityInput = useRef<HTMLInputElement>(null);

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

    /**
     * Returns the set of allowed values for the specified option
     * based on available product variants and other options choices.
     */
    function getAllowedOptionValues(
        option: products.ProductOption,
        currentChoices: Record<string, products.Choice | undefined>,
        variants: products.Variant[],
        allOptions: products.ProductOption[]
    ): Set<string> {
        const optionsChoices = Object.entries(currentChoices)
            .filter(([, madeChoice]) => madeChoice)
            .map(([optionName, madeChoice]) => ({ optionName, madeChoice: madeChoice! }));

        const visibleVariants = variants?.filter((v) => v.variant?.visible) ?? [];

        // filter variants that match the current choices for all options except the current one
        const allowedVariants = visibleVariants.filter((variant) =>
            optionsChoices.every(({ optionName, madeChoice }) => {
                if (optionName === option.name) {
                    return true;
                }

                const choiceOption = allOptions.find((o) => o.name === optionName);
                if (!choiceOption) {
                    return false;
                }

                const choiceValue = getChoiceValue(choiceOption.optionType!, madeChoice);
                const variantValue = variant.choices?.[optionName];

                return variantValue === choiceValue;
            })
        );

        // collect allowed values for the specified option
        const allowedOptionValues = allowedVariants.map((variant) => variant.choices![option.name!]);

        return new Set(allowedOptionValues);
    }

    async function addToCartHandler() {
        if (!product?._id || outOfStock) {
            return;
        }

        setAddToCartAttempted(true);
        if (Object.values(selectedChoices).includes(undefined)) {
            return;
        }

        const quantity = parseInt(quantityInput.current?.value ?? '1', 10);
        const selectedVariant = getSelectedVariant(product, selectedChoices);

        let options: AddToCartOptions = { options: selectedChoicesToVariantChoices(product, selectedChoices) };
        if (product.manageVariants && selectedVariant?._id) {
            options = { variantId: selectedVariant._id };
        }

        await addToCart({
            id: product._id,
            quantity,
            options,
        });
        setIsOpen(true);
    }

    return (
        <div className={styles.root}>
            <ProductImages mainImage={media?.mainMedia} images={media?.items} className={styles.media} />
            <div className={styles.productInfo}>
                <div>
                    <div className={styles.productName}>{product.name}</div>
                    {sku !== undefined && <div className={styles.sku}>SKU: {sku}</div>}
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

                {product.productOptions && product.productOptions.length > 0 && (
                    <div className={styles.productOptions}>
                        {product.productOptions?.map((option) => (
                            <ProductOption
                                key={option.name}
                                allowedValues={
                                    product.manageVariants
                                        ? getAllowedOptionValues(
                                              option,
                                              selectedChoices,
                                              product.variants!,
                                              product.productOptions!
                                          )
                                        : undefined
                                }
                                error={
                                    addToCartAttempted && selectedChoices[option.name!] === undefined
                                        ? `Select ${option.name}`
                                        : undefined
                                }
                                option={option}
                                selectedChoice={selectedChoices[option.name!]}
                                onChange={(newSelectedChoice) => {
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
                            ref={quantityInput}
                            defaultValue={1}
                            className={classNames('numberInput', styles.quantity)}
                            type="number"
                            min={1}
                            placeholder="1"
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
