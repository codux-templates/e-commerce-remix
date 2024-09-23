import classnames from 'classnames';
import { useCart, useCartTotals } from '~/api/api-hooks';
import { useEcomAPI } from '~/api/ecom-api-context-provider';
import { Drawer } from '~/components/drawer/drawer';
import { CartItem } from './cart-item/cart-item';
import { useCartOpen } from './cart-open-context';
import styles from './cart.module.scss';

export const Cart = () => {
    const { isOpen, setIsOpen } = useCartOpen();
    const { data: cart } = useCart();
    const { data: cartTotals } = useCartTotals();
    const ecomAPI = useEcomAPI();

    const isEmpty = !cart?.lineItems || cart.lineItems.length === 0;

    async function checkout() {
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
                        <button className={classnames('primaryButton', styles.checkout)} onClick={checkout}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </Drawer>
    );
};
