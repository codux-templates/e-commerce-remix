import { createBoard } from '@wixc3/react-board';
import { PageWrapper } from '_codux/board-wrappers/page-wrapper';
import { ProductNotFound } from '~/components/product-not-found/product-not-found';

export default createBoard({
    name: 'Page - Product Not Found',
    Board: () => (
        <PageWrapper>
            <ProductNotFound />
        </PageWrapper>
    ),
    tags: ['Page', 'Error'],
});
