import { createBoard } from '@wixc3/react-board';
import ComponentWrapper from '_codux/board-wrappers/component-wrapper';
import { mockCartItem } from '_codux/mocks/cart-item';
import { CartItem } from '~/components/cart/cart-item/cart-item';

export default createBoard({
    name: 'Cart Item',
    Board: () => {
        return (
            <ComponentWrapper>
                <CartItem cartItem={mockCartItem} />
            </ComponentWrapper>
        );
    },
    tags: ['Component', 'Cart'],
    isSnippet: false,
    environmentProps: {
        windowWidth: 500,
        windowHeight: 150,
    },
});
