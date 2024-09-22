import { Cross2Icon } from '@radix-ui/react-icons';
import { cart } from '@wix/ecom';
import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { useRemoveItemFromCart, useUpdateCartItemQuantity } from '~/api/api-hooks';
import { getImageHttpUrl } from '~/api/wix-image';
import { Price } from '~/components/price/price';
import styles from './cart-item.module.scss';

export interface CartItemProps {
    className?: string;
    isLast?: boolean;
    cartItem: cart.LineItem;
}

export const CartItem = ({ cartItem, className, isLast }: CartItemProps) => {
    const name = cartItem.productName?.translated || '';
    const imageUrl = getImageHttpUrl(cartItem.image, 120, 120);

    const { trigger: updateQuantity } = useUpdateCartItemQuantity();
    const { trigger: removeItem } = useRemoveItemFromCart();

    function updateQuantityHandler(e: ChangeEvent<HTMLInputElement>) {
        if (!cartItem._id) {
            return;
        }
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
            updateQuantity({ id: cartItem._id, quantity: newQuantity });
        }
    }

    const isAvailable =
        cartItem.availability?.status === cart.ItemAvailabilityStatus.AVAILABLE ||
        cartItem.availability?.status === cart.ItemAvailabilityStatus.PARTIALLY_AVAILABLE;

    return (
        <div
            className={classNames(
                styles.root,
                { [styles.divider]: !isLast, [styles.isOutOfStock]: !isAvailable },
                className
            )}
        >
            <img src={imageUrl} alt={name || ''} className={styles.image} />
            <div className={styles.infoContainer}>
                <div className={styles.itemLine}>
                    <div>
                        <h4 className={styles.description}>{name}</h4>
                        {cartItem.fullPrice?.formattedConvertedAmount && (
                            <Price
                                fullPrice={cartItem.fullPrice?.formattedConvertedAmount}
                                discountedPrice={cartItem.price?.formattedConvertedAmount}
                            />
                        )}
                    </div>
                    <button
                        onClick={() => removeItem(cartItem._id!)}
                        aria-label="Remove item"
                        className={styles.removeButton}
                    >
                        <Cross2Icon height={20} width={18} />
                    </button>
                </div>

                {isAvailable ? (
                    <div className={styles.actionsContainer}>
                        <input
                            type="number"
                            value={cartItem.quantity}
                            onChange={updateQuantityHandler}
                            min={0}
                            className="numberInput"
                        />
                    </div>
                ) : (
                    <div>Out of stock</div>
                )}
            </div>
        </div>
    );
};
