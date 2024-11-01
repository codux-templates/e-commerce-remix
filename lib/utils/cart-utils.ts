import ecom from '@wix/ecom';
import deepEqual from 'fast-deep-equal';
import { AddToCartOptions, Cart, CartItem, CartTotals } from '~/lib/ecom';

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

export function calculateCartItemsCount(cart: ecom.cart.Cart): number {
    return cart.lineItems?.reduce((total, item) => total + item.quantity!, 0) ?? 0;
}

export const findLineItemPriceBreakdown = (item: CartItem, cartTotals: CartTotals | undefined) => {
    return cartTotals?.calculatedLineItems.find((calculatedItem) => calculatedItem.lineItemId === item._id)
        ?.pricesBreakdown;
};
