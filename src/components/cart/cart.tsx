import { useState } from 'react';
import { cart } from '@wix/ecom';
import { useCartOpen } from '~/lib/cart-open-context';
import { useCart } from '~/lib/ecom';
import { Drawer } from '~/src/components/drawer/drawer';
import { CartView } from './cart-view/cart-view';

export const Cart = () => {
    const { isOpen, setIsOpen } = useCartOpen();
    const { cartData, cartTotals, checkout, removeItem, updateItemQuantity } = useCart();
    const [checkoutAttempted, setCheckoutAttempted] = useState(false);

    const someItemsOutOfStock = cartData?.lineItems.some(
        (item) => item.availability?.status === cart.ItemAvailabilityStatus.NOT_AVAILABLE,
    );

    const handleCheckout = async () => {
        setCheckoutAttempted(true);

        if (someItemsOutOfStock) {
            return;
        }

        checkout();
    };

    const errorMessage = checkoutAttempted && someItemsOutOfStock ? 'Some items are out of stock' : undefined;

    return (
        <Drawer onClose={() => setIsOpen(false)} open={isOpen}>
            <CartView
                cart={cartData}
                cartTotals={cartTotals}
                errorMessage={errorMessage}
                onCheckout={handleCheckout}
                onItemRemove={removeItem}
                onItemQuantityChange={updateItemQuantity}
                onClose={() => setIsOpen(false)}
            />
        </Drawer>
    );
};
