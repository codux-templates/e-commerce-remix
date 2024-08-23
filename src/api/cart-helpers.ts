import { Cart } from '~/types';

export function findItemIdInCart(
    cart: Cart,
    catalogItemId: string,
    options?: Record<string, string>
) {
    return cart.lineItems.find((it) => {
        if (it.catalogReference?.catalogItemId !== catalogItemId) {
            return false;
        }
        const catalogOptions = it.catalogReference?.options?.options;
        const optionsLength = options ? Object.keys(options).length : 0;
        const catalogOptionsLength = catalogOptions ? Object.keys(catalogOptions).length : 0;
        if (optionsLength !== catalogOptionsLength) {
            return false;
        }
        if (!options || !catalogOptions) {
            return true;
        }
        Object.keys(options).forEach((key) => {
            if (options![key] !== catalogOptions[key]) {
                return false;
            }
        });
        return true;
    });
}
