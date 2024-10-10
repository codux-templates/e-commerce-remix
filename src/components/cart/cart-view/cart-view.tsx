import classnames from 'classnames';
import { Cart, CartTotals } from '~/api/types';
import { CartItem } from '../cart-item/cart-item';
import styles from './cart-view.module.scss';

export interface CartViewProps {
    cart: Cart;
    cartTotals?: CartTotals;
    errorMessage?: string;
    onCheckout: () => void;
    onItemQuantityChange: (itemId: string, newQuantity: number) => void;
    onItemRemove: (itemId: string) => void;
}

export const CartView = ({
    cart,
    cartTotals,
    errorMessage,
    onCheckout,
    onItemQuantityChange,
    onItemRemove,
}: CartViewProps) => {
    const isEmpty = !cart?.lineItems || cart.lineItems.length === 0;

    if (isEmpty) {
        return <div className={styles.emptyCart}>Cart is empty</div>;
    }

    return (
        <div className={styles.cart}>
            <div className={styles.items}>
                {cart?.lineItems?.map((item) => (
                    <CartItem
                        key={item._id}
                        cartItem={item}
                        onQuantityChange={(newQuantity: number) => onItemQuantityChange(item._id!, newQuantity)}
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
        </div>
    );
};
