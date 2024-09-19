import { createBoard } from '@wixc3/react-board';
import { PageWrapper } from '_codux/board-wrappers/page-wrapper';
import { sleep } from '_codux/boards/utils';
import ProductsCategoryPage, { loader } from 'app/routes/category.$categorySlug/route';

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
