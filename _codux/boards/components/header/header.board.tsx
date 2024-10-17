import { createBoard } from '@wixc3/react-board';
import { ComponentWrapper } from '_codux/board-wrappers';
import { CartOpenContextProvider } from '~/components/cart';
import { Header } from '~/components/header';

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
