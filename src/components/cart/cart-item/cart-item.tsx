import { Cross2Icon } from '@radix-ui/react-icons';
import { cart } from '@wix/ecom';
import { media } from '@wix/sdk';
import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { Price } from '~/src/components/price/price';
import styles from './cart-item.module.scss';

export interface CartItemProps {
    className?: string;
    isLast?: boolean;
    cartItem: cart.LineItem;
    onRemove: () => void;
    onQuantityChange: (newQuantity: number) => void;
}

export const CartItem = ({ cartItem, className, isLast, onRemove, onQuantityChange }: CartItemProps) => {
    const name = cartItem.productName?.translated ?? '';
    const image = cartItem.image ? media.getImageUrl(cartItem.image) : undefined;
    const isUnavailable = cartItem.availability?.status === cart.ItemAvailabilityStatus.NOT_AVAILABLE;
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
                { [styles.divider]: !isLast, [styles.outOfStock]: isUnavailable },
                className,
            )}
        >
            <img src={image?.url} alt={name} className={styles.image} />
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

                {isUnavailable ? (
                    <div>Out of stock</div>
                ) : (
                    <div className={styles.actionsContainer}>
                        <input
                            type="number"
                            value={cartItem.quantity}
                            onChange={handleQuantityChange}
                            min={0}
                            className="numberInput"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
