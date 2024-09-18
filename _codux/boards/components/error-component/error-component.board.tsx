import { createBoard } from '@wixc3/react-board';
import { ErrorComponent } from '~/components/error-component/error-component';

export default createBoard({
    name: 'ErrorComponent',
    Board: () => (
        <ErrorComponent
            title="Page Not Found"
            message="Looks like the page you're trying to visit doesn't exist"
            actionButtonText="Back to Home"
            onActionButtonClick={() => {}}
        />
    ),
    tags: ['Component'],
    isSnippet: true,
});
