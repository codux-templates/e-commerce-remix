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
    const [error, setError] = useState<string>();

    const someItemsOutOfStock = cart?.lineItems.some((item) => !isCartItemAvailable(item));

    const handleCheckout = async () => {
        setError(undefined);

        if (someItemsOutOfStock) {
            setError('Some items are out of stock');
        }

        const checkoutResponse = await ecomAPI.checkout();

        if (checkoutResponse.status === 'success') {
            window.location.href = checkoutResponse.body.checkoutUrl;
        } else {
            alert('checkout is not configured');
        }
    };

    return (
        <Drawer title="Cart" onClose={() => setIsOpen(false)} isOpen={isOpen}>
            <CartView
                cart={cart!}
                cartTotals={cartTotals}
                errorMessage={error}
                onCheckout={handleCheckout}
                onItemRemove={(id) => removeItem(id)}
                onItemQuantityChange={(id, quantity) => updateQuantity({ id, quantity })}
            />
        </Drawer>
    );
};
