import { CloseIcon } from '~/components/icons';
import { getClickableElementAttributes } from '~/utils';

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
