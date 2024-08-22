import Classnames from 'classnames';
import { useEffect } from 'react';
import { useCart, useCartTotals } from '~/api/api-hooks';
import { useEcomAPI } from '~/api/ecom-api-context-provider';
import { Drawer } from '~/components/drawer/drawer';
import CommonStyles_module from '~/styles/common-styles.module.scss';
import { CartItem } from './cart-item/cart-item';
import { useCartOpen } from './cart-open-context';
import styles from './cart.module.scss';

export interface CartProps {
    className?: string;
    initialIsOpen?: boolean;
}

export const Cart = ({ className, initialIsOpen }: CartProps) => {
    const { isOpen, setIsOpen } = useCartOpen();
    const { data: cart } = useCart();
    const { data: cartTotals } = useCartTotals();
    const isEmpty = !cart?.lineItems || cart.lineItems.length === 0;

    useEffect(() => {
        if (initialIsOpen !== undefined) {
            setIsOpen(initialIsOpen);
        }
    }, [setIsOpen]);

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
            <button onClick={() => setIsOpen(true)} className={CommonStyles_module.secondaryButton}>
                Cart
            </button>
            {isOpen ? (
                <Drawer title="Cart" onClose={() => setIsOpen(false)} initialIsOpen={initialIsOpen}>
                    {isEmpty ? (
                        <div className={styles.emptyCart}>Cart is empty</div>
                    ) : (
                        <div className={styles.cart}>
                            <div className={styles.items}>
                                {cart?.lineItems?.map((item) => (
                                    <CartItem key={item._id} cartItem={item} />
                                ))}
                            </div>
                            <div className={styles['subtotal-checkout']}>
                                <label className={styles['subtotal-label']}>
                                    <span>Subtotal:</span>
                                    {cartTotals?.priceSummary?.subtotal?.formattedConvertedAmount}
                                </label>
                                <button
                                    className={Classnames(
                                        CommonStyles_module.primaryButton,
                                        styles.checkout
                                    )}
                                    onClick={checkout}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </Drawer>
            ) : null}
        </div>
    );
};
