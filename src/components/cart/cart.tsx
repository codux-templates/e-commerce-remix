import Classnames from 'classnames';
import { useCart, useCartTotals } from '~/api/api-hooks';
import { useEcomAPI } from '~/api/ecom-api-context-provider';
import { Drawer } from '~/components/drawer/drawer';
import commonStyles from '~/styles/common-styles.module.scss';
import { CartItem } from './cart-item/cart-item';
import { useCartOpen } from './cart-open-context';
import styles from './cart.module.scss';

export interface CartProps {
    className?: string;
}

export const Cart = ({ className }: CartProps) => {
    const { isOpen, setIsOpen } = useCartOpen();
    const { data: cart } = useCart();
    const { data: cartTotals } = useCartTotals();
    const isEmpty = !cart?.lineItems || cart.lineItems.length === 0;

    const ecomAPI = useEcomAPI();

    async function checkout() {
        const { success, url } = await ecomAPI.checkout();
        if (success && url) {
            window.location.href = url;
        } else if (!success) {
            alert('checkout is not configured');
        }
    }

    return (
        <div className={className}>
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
                            <button
                                className={Classnames(commonStyles.primaryButton, styles.checkout)}
                                onClick={checkout}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};
