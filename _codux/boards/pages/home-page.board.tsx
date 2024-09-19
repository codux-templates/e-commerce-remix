import { createBoard } from '@wixc3/react-board';
import { PageWrapper } from '_codux/board-wrappers/page-wrapper';
import { sleep } from '_codux/boards/utils';
import HomePage, { loader } from 'app/routes/_index/route';

export default createBoard({
    name: 'Page - Home',
    Board: () => (
        <PageWrapper pageRouteParams={{ loader }}>
            <HomePage />
        </PageWrapper>
    ),
    tags: ['Page'],
    readyToSnapshot: () => sleep(3000),
});
