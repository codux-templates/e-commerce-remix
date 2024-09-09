import { createBoard } from '@wixc3/react-board';
import { OrderSummary } from '../../../../src/components/order-summary/order-summary';

export default createBoard({
    name: 'OrderSummary',
    Board: () => <OrderSummary order={{}} />,
    isSnippet: true,
});
