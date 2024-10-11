import { useState } from 'react';
import { useCart, useCartTotals, useRemoveItemFromCart, useUpdateCartItemQuantity } from '~/api/api-hooks';
import { useEcomAPI } from '~/api/ecom-api-context-provider';
import { Drawer } from '~/components/drawer/drawer';
import { isCartItemAvailable } from '~/utils';
import { useCartOpen } from './cart-open-context';
import { CartView } from './cart-view/cart-view';

export const Cart = () => {
    const ecomAPI = useEcomAPI();
    const { isOpen, setIsOpen } = useCartOpen();
    const { data: cart } = useCart();
    const { data: cartTotals } = useCartTotals();
    const { trigger: updateQuantity } = useUpdateCartItemQuantity();
    const { trigger: removeItem } = useRemoveItemFromCart();
    const [checkoutAttempted, setCheckoutAttempted] = useState(false);

    const someItemsOutOfStock = cart?.lineItems.some((item) => !isCartItemAvailable(item));

    const handleCheckout = async () => {
        setCheckoutAttempted(true);

        if (someItemsOutOfStock) {
            return;
        }

        const checkoutResponse = await ecomAPI.checkout();

        if (checkoutResponse.status === 'success') {
            window.location.href = checkoutResponse.body.checkoutUrl;
        } else {
            alert('checkout is not configured');
        }
    };

    const errorMessage = checkoutAttempted && someItemsOutOfStock ? 'Some items are out of stock' : undefined;

    return (
        <Drawer title="Cart" onClose={() => setIsOpen(false)} isOpen={isOpen}>
            {cart === undefined ? (
                <div>Loading...</div>
            ) : (
                <CartView
                    cart={cart}
                    cartTotals={cartTotals}
                    errorMessage={errorMessage}
                    onCheckout={handleCheckout}
                    onItemRemove={removeItem}
                    onItemQuantityChange={updateQuantity}
                />
            )}
        </Drawer>
    );
};
