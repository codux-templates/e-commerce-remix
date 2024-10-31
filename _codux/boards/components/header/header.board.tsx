import { createBoard } from '@wixc3/react-board';
import ComponentWrapper from '_codux/board-wrappers/component-wrapper';
import { CartOpenContextProvider } from '~/lib/cart-open-context';
import { Header } from '~/src/components/header/header';

export default createBoard({
    name: 'Header',
    Board: () => (
        <ComponentWrapper>
            <CartOpenContextProvider>
                <Header />
            </CartOpenContextProvider>
        </ComponentWrapper>
    ),
    tags: ['Component'],
});
