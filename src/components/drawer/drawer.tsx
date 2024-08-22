import { ChevronRightIcon } from '@radix-ui/react-icons';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import styles from './drawer.module.scss';

export interface DrawerProps {
    className?: string;
    initialIsOpen?: boolean;
    onClose?: () => void;
    title: string;
    children?: React.ReactNode;
}

export const Drawer = ({
    className,
    onClose: onclose,
    title,
    children,
    initialIsOpen,
}: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen ?? false);

    useEffect(() => {
        setIsOpen(true);
        const scrollBarWidth = window.innerWidth - document.body.clientWidth;
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        document.body.style.overflow = 'hidden';
    }, []);

    function handleClose() {
        setIsOpen(false);
        setTimeout(() => {
            onclose && onclose();
            document.body.style.paddingRight = `0px`;
            document.body.style.overflow = 'auto';
        }, 300);
    }

    return (
        <div onClick={handleClose} className={styles.background}>
            <div
                className={cx(styles.drawer, className, { [styles.open]: isOpen })}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <ChevronRightIcon
                        className={styles.arrowIcon}
                        onClick={handleClose}
                        height={35}
                        width={35}
                    />
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
};
