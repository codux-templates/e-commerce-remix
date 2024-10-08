import { cart } from '@wix/ecom';
import { ChangeEvent } from 'react';
import { useRemoveItemFromCart, useUpdateCartItemQuantity } from '~/api/api-hooks';
import { CartItemView } from './cart-item-view';

export interface CartItemProps {
    className?: string;
    isLast?: boolean;
    cartItem: cart.LineItem;
}

export const CartItem = ({ cartItem, className, isLast }: CartItemProps) => {
    const { trigger: updateQuantity } = useUpdateCartItemQuantity();
    const { trigger: removeItem } = useRemoveItemFromCart();

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!cartItem._id) {
            return;
        }
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
            updateQuantity({ id: cartItem._id, quantity: newQuantity });
        }
    };

    const handleRemoveItem = () => {
        return removeItem(cartItem._id!);
    };

    return (
        <CartItemView
            className={className}
            cartItem={cartItem}
            onQuantityChange={handleQuantityChange}
            onRemoveButtonClick={handleRemoveItem}
            isLast={isLast}
        />
    );
};
