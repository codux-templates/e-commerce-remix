import { createBoard } from '@wixc3/react-board';
import { PageWrapper } from '_codux/board-wrappers/page-wrapper';
import ProductsCategoryPage, { loader } from 'app/routes/category.$categorySlug/route';
import { sleep } from '../utils';

export default createBoard({
    name: 'Page - Products Category',
    Board: () => (
        <PageWrapper pageRouteParams={{ loader }} initialPath="/category/all-products">
            <ProductsCategoryPage />
        </PageWrapper>
    ),
    tags: ['Page'],
    readyToSnapshot: () => sleep(3000),
});
