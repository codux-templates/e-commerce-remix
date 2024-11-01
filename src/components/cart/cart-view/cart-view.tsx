import classnames from 'classnames';
import { Cart, CartTotals } from '~/lib/ecom';
import { CartItem } from '../cart-item/cart-item';
import styles from './cart-view.module.scss';
import { ChevronRightIcon } from '@radix-ui/react-icons';

export interface CartViewProps {
    cart?: Cart;
    cartTotals?: CartTotals;
    errorMessage?: string;
    onCheckout: () => void;
    onItemQuantityChange: (args: { id: string; quantity: number }) => void;
    onItemRemove: (id: string) => void;
    onClose: () => void;
}

export const CartView = ({
    cart,
    cartTotals,
    errorMessage,
    onCheckout,
    onItemQuantityChange,
    onItemRemove,
    onClose,
}: CartViewProps) => {
    return (
        <div className={styles.cart}>
            <div className={styles.header}>
                <div className={styles.title}>Cart</div>
                <ChevronRightIcon className={styles.arrowIcon} onClick={onClose} height={35} width={35} />
            </div>
            <div className={styles.content}>
                {!cart || cart.lineItems.length === 0 ? (
                    <div className={styles.emptyCart}>Cart is empty</div>
                ) : (
                    <>
                        <div className={styles.items}>
                            {cart.lineItems?.map((item) => (
                                <CartItem
                                    key={item._id}
                                    cartItem={item}
                                    onQuantityChange={(quantity: number) =>
                                        onItemQuantityChange({ id: item._id!, quantity })
                                    }
                                    onRemove={() => onItemRemove(item._id!)}
                                />
                            ))}
                        </div>
                        <div className={styles.subtotalCheckout}>
                            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                            {cartTotals?.priceSummary?.subtotal?.formattedConvertedAmount && (
                                <label className={styles.subtotalLabel}>
                                    <span>Subtotal:</span>
                                    {cartTotals?.priceSummary?.subtotal?.formattedConvertedAmount}
                                </label>
                            )}
                            <button className={classnames('primaryButton', styles.checkoutButton)} onClick={onCheckout}>
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
