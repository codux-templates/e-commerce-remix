import { createBoard } from '@wixc3/react-board';
import { PageWrapper } from '_codux/board-wrappers';
import { sleep } from '_codux/boards/utils';
import { MockEcomAPIContextProvider } from '_codux/mocks';
import ProductDetailsPage, { loader } from 'app/routes/products.$productSlug/route';

export default createBoard({
    name: 'Page - ProductDetails',
    Board: () => (
        <PageWrapper pageRouteParams={{ loader }} initialPath="/products/i-m-a-product-5">
            <MockEcomAPIContextProvider>
                <ProductDetailsPage />
            </MockEcomAPIContextProvider>
        </PageWrapper>
    ),
    tags: ['Page'],
    readyToSnapshot: () => sleep(3000),
});
