import { SerializeFrom } from '@remix-run/node';
import deepEqual from 'fast-deep-equal';
import { products as wixStoresProducts } from '@wix/stores';
import { Product } from '~/api/types';

export function isOutOfStock(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
): boolean {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedOptions);
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
    selectedOptions: Record<string, string | undefined> = {}
): Product['priceData'] {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedOptions);
        return selectedVariant?.variant?.priceData ?? product.priceData;
    }

    return product.priceData;
}

export function getSKU(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
): Product['sku'] {
    if (product.manageVariants) {
        const selectedVariant = getSelectedVariant(product, selectedOptions);
        return selectedVariant?.variant?.sku ?? product.sku;
    }

    return product.sku;
}

export function getSelectedVariant(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
): wixStoresProducts.Variant | undefined {
    return product.variants?.find((variant) => deepEqual(variant.choices, selectedOptions));
}
