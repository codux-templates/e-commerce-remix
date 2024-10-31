import { getClickableElementAttributes } from '~/lib/utils';
import { CloseIcon } from '../icons';

import styles from './applied-filter.module.scss';

interface AppliedFilterProps {
    children: React.ReactNode;
    onClick: () => void;
}

export const AppliedFilter = ({ children, onClick }: AppliedFilterProps) => {
    return (
        <div className={styles.root} {...getClickableElementAttributes(onClick)}>
            {children}
            <CloseIcon width={12} height={12} />
        </div>
    );
};
