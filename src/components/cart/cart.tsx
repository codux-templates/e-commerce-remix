import classnames from 'classnames';
import { useState } from 'react';
import { useCart, useCartTotals } from '~/api/api-hooks';
import { useEcomAPI } from '~/api/ecom-api-context-provider';
import { Drawer } from '~/components/drawer/drawer';
import { isCartItemAvailable } from '~/utils';
import { CartItem } from './cart-item/cart-item';
import { useCartOpen } from './cart-open-context';
import styles from './cart.module.scss';

export const Cart = () => {
    const { isOpen, setIsOpen } = useCartOpen();
    const { data: cart } = useCart();
    const { data: cartTotals } = useCartTotals();
    const [error, setError] = useState<string>();
    const ecomAPI = useEcomAPI();

    const isEmpty = !cart?.lineItems || cart.lineItems.length === 0;

    async function checkout() {
        setError(undefined);

        const someItemsOutOfStock = cart?.lineItems.some((item) => !isCartItemAvailable(item));

        if (someItemsOutOfStock) {
            return setError('Some of the items are out of stock.');
        }

        const checkoutResponse = await ecomAPI.checkout();

        if (checkoutResponse.status === 'success') {
            window.location.href = checkoutResponse.body.checkoutUrl;
        } else {
            alert('checkout is not configured');
        }
    }

    return (
        <Drawer title="Cart" onClose={() => setIsOpen(false)} isOpen={isOpen}>
            {isEmpty ? (
                <div className={styles.emptyCart}>Cart is empty</div>
            ) : (
                <div className={styles.cart}>
                    <div className={styles.items}>
                        {cart?.lineItems?.map((item) => (
                            <CartItem key={item._id} cartItem={item} />
                        ))}
                    </div>
                    <div className={styles.subtotalCheckout}>
                        <label className={styles.subtotalLabel}>
                            <span>Subtotal:</span>
                            {cartTotals?.priceSummary?.subtotal?.formattedConvertedAmount}
                        </label>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <button className={classnames('primaryButton', styles.checkoutButton)} onClick={checkout}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </Drawer>
    );
};
