import classNames from 'classnames';
import { Cart } from '~/components/cart/cart';
import { Header } from '~/components/header/header';
import { Footer } from '~/components/site-footer/site-footer';
import styles from './site-wrapper.module.scss';

export interface SiteWrapperProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SiteWrapper = ({ className, children }: SiteWrapperProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <Header />
            <Cart />
            <div className={styles.content}>{children}</div>
            <Footer />
        </div>
    );
};
