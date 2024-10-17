import { createBoard } from '@wixc3/react-board';
import { cartItem, cartItemOutOfStock, cartItemWithDiscount } from '_codux/mocks';
import { CartItem } from '~/components/cart';

const noop = () => {};

export default createBoard({
    name: 'Cart Item',
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
