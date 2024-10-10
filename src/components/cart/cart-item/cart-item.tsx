import { Cross2Icon } from '@radix-ui/react-icons';
import type { cart } from '@wix/ecom';
import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { getImageHttpUrl } from '~/api/wix-image';
import { Price } from '~/components/price/price';
import { isCartItemAvailable } from '~/utils';
import styles from './cart-item.module.scss';

const IMAGE_SIZE = 120;
export interface CartItemProps {
    className?: string;
    isLast?: boolean;
    cartItem: cart.LineItem;
    onRemove: () => void;
    onQuantityChange: (newQuantity: number) => void;
}

export const CartItem = ({ cartItem, className, isLast, onRemove, onQuantityChange }: CartItemProps) => {
    const name = cartItem.productName?.translated ?? '';
    const imageUrl = getImageHttpUrl(cartItem.image, IMAGE_SIZE, IMAGE_SIZE);
    const isAvailable = isCartItemAvailable(cartItem);

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!cartItem._id) {
            return;
        }
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
            onQuantityChange(newQuantity);
        }
    };

    return (
        <div
            className={classNames(
                styles.root,
                { [styles.divider]: !isLast, [styles.outOfStock]: !isAvailable },
                className
            )}
        >
            <img src={imageUrl} alt={name} className={styles.image} />
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
                    <button onClick={onRemove} aria-label="Remove item" className={styles.removeButton}>
                        <Cross2Icon height={20} width={18} />
                    </button>
                </div>

                {isAvailable ? (
                    <div className={styles.actionsContainer}>
                        <input
                            type="number"
                            value={cartItem.quantity}
                            onChange={handleQuantityChange}
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
