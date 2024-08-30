import { createBoard } from '@wixc3/react-board';
import { PageWrapper } from '_codux/board-wrappers/page-wrapper';
import CategoryProductsPage, { loader } from 'app/routes/category.$categorySlug/route';
import { sleep } from '../utils';

export default createBoard({
    name: 'Page - Category Products',
    Board: () => (
        <PageWrapper pageRouteParams={{ loader }}>
            <CategoryProductsPage />
        </PageWrapper>
    ),
    tags: ['Page'],
    readyToSnapshot: () => sleep(3000),
});
