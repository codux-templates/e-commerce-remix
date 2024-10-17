import { createBoard } from '@wixc3/react-board';
import { cart, cartTotals } from '_codux/mocks';
import { CartView } from '~/components/cart';

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
