import { SerializeFrom } from '@remix-run/node';
import deepEqual from 'fast-deep-equal';
import { products as wixStoresProducts } from '@wix/stores';
import { Product } from '~/api/types';

export function isOutOfStock(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
) {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedOptions);
        if (selectedVariant?.stock?.inStock !== undefined) {
            return !selectedVariant?.stock?.inStock;
        }
    }

    return product.stock?.inventoryStatus === wixStoresProducts.InventoryStatus.OUT_OF_STOCK;
}

export function getPriceData(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
) {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedOptions);
        return selectedVariant?.variant?.priceData ?? product.priceData;
    }

    return product.priceData;
}

export function getSelectedVariant(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
) {
    return product.variants?.find((variant) => deepEqual(variant.choices, selectedOptions));
}
