import { SerializeFrom } from '@remix-run/node';
import { products as wixStoresProducts } from '@wix/stores';
import deepEqual from 'fast-deep-equal';
import { Product } from '~/lib/ecom';

export function isOutOfStock(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {},
): boolean {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedChoices);
        if (selectedVariant !== undefined) {
            return selectedVariant?.stock?.inStock === false;
        }
    }

    return product.stock?.inventoryStatus === wixStoresProducts.InventoryStatus.OUT_OF_STOCK;
}

export function getPriceData(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {},
): Product['priceData'] {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedChoices);
        return selectedVariant?.variant?.priceData ?? product.priceData;
    }

    return product.priceData;
}

export function getSKU(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined>,
): Product['sku'] {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedChoices);
        return selectedVariant?.variant?.sku ?? product.sku;
    }

    return product.sku;
}

export function getSelectedVariant(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined>,
): wixStoresProducts.Variant | undefined {
    const selectedChoiceValues = selectedChoicesToVariantChoices(product, selectedChoices);
    return product.variants?.find((variant) => deepEqual(variant.choices, selectedChoiceValues));
}

function getMatchingVariants(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined>,
): wixStoresProducts.Variant[] {
    const selectedChoiceValues = selectedChoicesToVariantChoices(product, selectedChoices);

    for (const optionName of Object.keys(selectedChoiceValues)) {
        if (selectedChoiceValues[optionName] === undefined) {
            delete selectedChoiceValues[optionName];
        }
    }

    return (
        product.variants?.filter((variant) =>
            deepEqual(variant.choices, {
                ...variant.choices,
                ...selectedChoiceValues,
            }),
        ) ?? []
    );
}

export const getChoiceValue = (
    optionType: wixStoresProducts.OptionType,
    choice: wixStoresProducts.Choice,
): string | undefined => {
    // for color options, `description` field contains color name and `value` field contains hex color representation
    // e-commerce SDK for some actions (adding to cart for example) expects color name as selected color value
    return optionType === wixStoresProducts.OptionType.color ? choice.description : choice.value;
};

// selected choices is a map of option names to selected choice objects - {'Size': {value: 'Large', visible: true...}}
// variant choices is a map of option names to selected choice values - {'Size': 'Large'}
// the name 'variant choices' is used because the same data structure is used for the Variant['choices'] property provided by SDK
export const selectedChoicesToVariantChoices = (
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {},
): Record<string, string | undefined> => {
    const result: Record<string, string | undefined> = {};
    for (const [optionName, choice] of Object.entries(selectedChoices)) {
        if (!choice) {
            result[optionName] = undefined;
            continue;
        }

        const option = product.productOptions?.find((option) => option.name === optionName);
        if (!option?.optionType) continue;

        result[optionName] = getChoiceValue(option.optionType, choice);
    }

    return result;
};

export function getMedia(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {},
): wixStoresProducts.Media | undefined {
    const selectedChoiceWithMedia = Object.values(selectedChoices).find((c) => c?.media?.mainMedia !== undefined);
    return selectedChoiceWithMedia?.media ?? product.media;
}

/**
 * returns a copy of product options array with populated availability information (visible, inStock)
 * considering currently selected option choices and available product variants
 */
export function getProductOptions(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined>,
): wixStoresProducts.ProductOption[] | undefined {
    return product.productOptions?.map((option) => {
        return {
            ...option,
            choices: option.choices?.map((choice) => ({
                ...choice,
                ...getChoiceAvailabilityInfo(choice, option, selectedChoices, product),
            })),
        };
    });
}

function getChoiceAvailabilityInfo(
    choice: wixStoresProducts.Choice,
    option: wixStoresProducts.ProductOption,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined>,
    product: Product | SerializeFrom<Product>,
): Pick<wixStoresProducts.Choice, 'visible' | 'inStock'> {
    if (!product.manageVariants || !option.name || !option.optionType) {
        return {
            visible: choice.visible,
            inStock: choice.inStock,
        };
    }

    // Get variants matching all other selected choices and target choice
    const matchingVariants = getMatchingVariants(product, {
        ...selectedChoices,
        [option.name]: choice,
    });

    return {
        visible: matchingVariants.some((variant) => variant.variant?.visible),
        inStock: matchingVariants.some((variant) => variant.variant?.visible && variant.stock?.inStock),
    };
}

export function formatPrice(price: number, currency: string): string {
    const formatter = Intl.NumberFormat('en-US', {
        currency,
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 2,
    });

    return formatter.format(price);
}
