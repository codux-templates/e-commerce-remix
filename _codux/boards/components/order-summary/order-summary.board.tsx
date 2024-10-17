import { createBoard } from '@wixc3/react-board';
import { mockOrder } from '_codux/mocks';
import { OrderSummary } from '~/components/order-summary';

export default createBoard({
    name: 'OrderSummary',
    Board: () => <OrderSummary order={mockOrder} />,
    environmentProps: {
        windowWidth: 1024,
        windowHeight: 943,
    },
});
