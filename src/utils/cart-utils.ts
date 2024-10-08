import { CartItem } from '~/api/types';
import { cart } from '@wix/ecom';

export function isCartItemAvailable(item: CartItem) {
    return (
        item.availability?.status === cart.ItemAvailabilityStatus.AVAILABLE ||
        item.availability?.status === cart.ItemAvailabilityStatus.PARTIALLY_AVAILABLE
    );
}
