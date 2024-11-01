import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ClientOnly } from 'remix-utils/client-only';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { RemoveScroll } from 'react-remove-scroll';
import styles from './drawer.module.scss';

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    drawerClassName?: string;
}

export const Drawer = ({ open, onClose, children, drawerClassName }: DrawerProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (open) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    return (
        <ClientOnly>
            {() =>
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <>
                                <motion.div
                                    className={styles.backdrop}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    onClick={onClose}
                                />

                                {/* RemoveScroll disables scroll outside the drawer. */}
                                <RemoveScroll>
                                    <motion.div
                                        className={classNames(styles.drawer, drawerClassName)}
                                        initial={{ clipPath: 'inset(0 0 0 100%)' }}
                                        animate={{ clipPath: 'none' }}
                                        exit={{ clipPath: 'inset(0 0 0 100%)' }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    >
                                        {children}
                                    </motion.div>
                                </RemoveScroll>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body,
                )
            }
        </ClientOnly>
    );
};
