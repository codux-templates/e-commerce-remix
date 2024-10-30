import { createBoard } from '@wixc3/react-board';
import { CartView } from '~/src/components/cart/cart-view/cart-view';
import { cart, cartTotals } from '_codux/mocks/cart';

const noop = () => {};

export default createBoard({
    name: 'Cart',
    Board: () => (
        <CartView
            cart={cart}
            cartTotals={cartTotals}
            onCheckout={noop}
            onItemRemove={noop}
            onItemQuantityChange={noop}
            onClose={noop}
        />
    ),
    tags: ['Component', 'Cart'],
    environmentProps: {
        windowWidth: 471,
    },
});
