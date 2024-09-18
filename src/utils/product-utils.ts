import { SerializeFrom } from '@remix-run/node';
import deepEqual from 'fast-deep-equal';
import { products as wixStoresProducts } from '@wix/stores';
import { Product } from '~/api/types';

export function isOutOfStock(
    product: Product | SerializeFrom<Product>,
    selectedOptions: Record<string, string | undefined> = {}
) {
    if (product.stock?.inventoryStatus === wixStoresProducts.InventoryStatus.OUT_OF_STOCK) {
        return true;
    }

    const selectedVariant = product.variants?.find((variant) => deepEqual(variant.choices, selectedOptions));

    if (selectedVariant) {
        return !selectedVariant.stock?.inStock;
    }

    return false;
}
