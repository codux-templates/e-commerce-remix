import { SerializeFrom } from '@remix-run/node';
import deepEqual from 'fast-deep-equal';
import { products as wixStoresProducts } from '@wix/stores';
import { Product } from '~/api/types';

export function isOutOfStock(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {}
): boolean {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedChoices);
        if (selectedVariant?.stock?.trackQuantity === true) {
            return selectedVariant?.stock?.quantity === 0;
        } else {
            return selectedVariant?.stock?.inStock === false;
        }
    }

    return product.stock?.inventoryStatus === wixStoresProducts.InventoryStatus.OUT_OF_STOCK;
}

export function getPriceData(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {}
): Product['priceData'] {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedChoices);
        return selectedVariant?.variant?.priceData ?? product.priceData;
    }

    return product.priceData;
}

export function getSKU(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {}
): Product['sku'] {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedChoices);
        return selectedVariant?.variant?.sku ?? product.sku;
    }

    return product.sku;
}

export function getSelectedVariant(
    product: Product | SerializeFrom<Product>,
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {}
): wixStoresProducts.Variant | undefined {
    const selectedChoiceValues = selectedChoicesToVariantChoices(product, selectedChoices);
    return product.variants?.find((variant) => deepEqual(variant.choices, selectedChoiceValues));
}

export const getChoiceValue = (
    optionType: wixStoresProducts.OptionType,
    choice: wixStoresProducts.Choice
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
    selectedChoices: Record<string, wixStoresProducts.Choice | undefined> = {}
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
