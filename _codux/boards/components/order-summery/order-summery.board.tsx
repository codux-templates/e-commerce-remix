import { createBoard } from '@wixc3/react-board';
import { OrderSummery } from '../../../../src/components/order-summery/order-summery';

export default createBoard({
    name: 'OrderSummery',
    Board: () => <OrderSummery />,
    isSnippet: true,
});
