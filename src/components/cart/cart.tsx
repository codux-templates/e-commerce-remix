import { useState } from 'react';
import { Drawer } from '~/components/drawer/drawer';
import { isCartItemAvailable } from '~/utils';
import { useCart } from '~/hooks/use-cart';
import { useCartOpen } from './cart-open-context';
import { CartView } from './cart-view/cart-view';

export const Cart = () => {
    const { isOpen, setIsOpen } = useCartOpen();
    const { cartData, cartTotals, checkout, removeItem, updateItemQuantity } = useCart();
    const [checkoutAttempted, setCheckoutAttempted] = useState(false);

    const someItemsOutOfStock = cartData?.lineItems.some((item) => !isCartItemAvailable(item));

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
