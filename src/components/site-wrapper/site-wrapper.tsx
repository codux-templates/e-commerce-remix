import classNames from 'classnames';
import { Cart } from '~/src/components/cart/cart';
import { Header } from '~/src/components/header/header';
import { Footer } from '~/src/components/site-footer/site-footer';
import styles from './site-wrapper.module.scss';

export interface SiteWrapperProps {
    className?: string;
    children?: React.ReactNode;
}

export const SiteWrapper = ({ className, children }: SiteWrapperProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <Header />
            <div className={styles.content}>{children}</div>
            <Footer />

            <Cart />
        </div>
    );
};
