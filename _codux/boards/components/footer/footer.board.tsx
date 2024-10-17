import { createBoard } from '@wixc3/react-board';
import { Footer } from '~/components/site-footer';

export default createBoard({
    name: 'Footer',
    Board: () => <Footer />,
    tags: ['Component'],
    environmentProps: {
        windowHeight: 220,
    },
});
