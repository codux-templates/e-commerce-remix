import { createBoard } from '@wixc3/react-board';
import { ReactComponent as ServererrorSvg } from '../../../../src/assets/svg/servererror.svg';
import styles from './server-error.board.module.scss';
import commonStylesStyles from '../../../../src/styles/common-styles.module.scss';
import Classnames from 'classnames';

export default createBoard({
    name: 'Server Error',
    Board: () => (
        <div className={styles.layout}>
            <ServererrorSvg className={styles.servererrorSvg} />
            <div className={styles.div1}>
                <h1 className={styles.h4}>Something went wrong.</h1>
                <p className={styles.p}>Try reloading the page.</p>
            </div>
            <button
                className={Classnames(
                    styles.secondaryButtonVar1,
                    commonStylesStyles.secondaryButton
                )}
            >
                Reload Page
            </button>
        </div>
    ),
    isSnippet: true,
    environmentProps: {
        windowWidth: 1024,
    },
});
