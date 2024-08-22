import { createBoard } from '@wixc3/react-board';
import ComponentWrapper from '_codux/board-wrappers/component-wrapper';
import { MockEcomAPIContextProvider } from '_codux/mocks/mock-ecom-api-context-provider';
import { Cart } from '~/components/cart/cart';
import { CartOpenContextProvider } from '~/components/cart/cart-open-context';

export default createBoard({
    name: 'Cart',
    Board: () => (
        <ComponentWrapper>
            <MockEcomAPIContextProvider>
                <CartOpenContextProvider>
                    <Cart initialIsOpen />
                </CartOpenContextProvider>
            </MockEcomAPIContextProvider>
        </ComponentWrapper>
    ),
    tags: ['Component', 'Cart'],
    isSnippet: true,
    environmentProps: {
        windowWidth: 350,
    },
});
