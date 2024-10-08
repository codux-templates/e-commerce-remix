import { createBoard } from '@wixc3/react-board';
import ComponentWrapper from '_codux/board-wrappers/component-wrapper';
import { mockCartItem, mockOutOfStockCartItem } from '_codux/mocks/cart-item';
import { CartItemView } from '~/components/cart/cart-item/cart-item-view';

const noop = () => {};

export default createBoard({
    name: 'Cart Item View',
    Board: () => {
        return (
            <ComponentWrapper>
                <CartItemView cartItem={mockCartItem} onQuantityChange={noop} onRemoveButtonClick={noop} />
                <CartItemView cartItem={mockOutOfStockCartItem} onQuantityChange={noop} onRemoveButtonClick={noop} />
            </ComponentWrapper>
        );
    },
    tags: ['Component', 'Cart'],
    isSnippet: false,
    environmentProps: {
        windowWidth: 500,
        windowHeight: 300,
    },
});
