import { createBoard } from '@wixc3/react-board';
import { cartItem, cartItemOutOfStock, cartItemWithDiscount } from '_codux/mocks/cart';
import { CartItem } from '~/src/components/cart/cart-item/cart-item';

const noop = () => {};

export default createBoard({
    name: 'Cart Item View',
    Board: () => {
        return (
            <div>
                <CartItem cartItem={cartItem} onQuantityChange={noop} onRemove={noop} />
                <CartItem cartItem={cartItemOutOfStock} onQuantityChange={noop} onRemove={noop} />
                <CartItem cartItem={cartItemWithDiscount} onQuantityChange={noop} onRemove={noop} />
            </div>
        );
    },
    tags: ['Component', 'Cart'],
    isSnippet: false,
    environmentProps: {
        windowWidth: 500,
        windowHeight: 300,
    },
});
