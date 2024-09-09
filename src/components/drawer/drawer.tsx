import { ChevronRightIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { useEffect } from 'react';
import styles from './drawer.module.scss';

export interface DrawerProps {
    className?: string;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    isOpen: boolean;
}

export const Drawer = ({ className, onClose, title, isOpen, children }: DrawerProps) => {
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.body.clientWidth;
            if (scrollBarWidth > 0) {
                document.body.style.paddingRight = `${scrollBarWidth}px`;
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.paddingRight = `0px`;
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    return (
        <div
            onClick={onClose}
            onKeyDown={onClose}
            role="button"
            tabIndex={0}
            className={classnames(styles.background, { [styles.open]: isOpen })}
        >
            <div
                className={classnames(styles.drawer, className, { [styles.open]: isOpen })}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="button"
                tabIndex={-1}
            >
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <ChevronRightIcon
                        className={styles.arrowIcon}
                        onClick={onClose}
                        height={35}
                        width={35}
                    />
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
};
