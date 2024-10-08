import deepEqual from 'fast-deep-equal';
import { AddToCartOptions, Cart } from './types';

export function findItemIdInCart({ lineItems }: Cart, catalogItemId: string, options?: AddToCartOptions) {
    return lineItems.find((it) => {
        if (it.catalogReference?.catalogItemId !== catalogItemId) {
            return false;
        }

        if (options && 'variantId' in options) {
            return it.catalogReference?.options?.variantId === options.variantId;
        }

        const lineItemOptions = it.catalogReference?.options?.options;
        return deepEqual(lineItemOptions, options?.options);
    });
}
