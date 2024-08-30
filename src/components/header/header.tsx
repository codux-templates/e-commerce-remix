import { Link } from '@remix-run/react';
import classNames from 'classnames';
import { ROUTES } from '~/router/config';
import commonStyles from '~/styles/common-styles.module.scss';
import { useCartOpen } from '../cart/cart-open-context';
import styles from './header.module.scss';

export interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    const { setIsOpen: setCartOpen } = useCartOpen();

    return (
        <div className={classNames(styles.root, className)}>
            <Link to={ROUTES.home.to()} className={styles.logo}>
                LOGO
            </Link>
            <div className={styles.menu}>
                <Link
                    to={ROUTES.home.to()}
                    className={classNames(commonStyles.secondaryButton, styles.menuButton)}
                >
                    Home
                </Link>
                <Link
                    to={ROUTES.category.to()}
                    className={classNames(commonStyles.secondaryButton, styles.menuButton)}
                >
                    Products
                </Link>

                <Link
                    to={ROUTES.about.to()}
                    className={classNames(commonStyles.secondaryButton, styles.menuButton)}
                >
                    About
                </Link>

                <button onClick={() => setCartOpen(true)} className={commonStyles.secondaryButton}>
                    Cart
                </button>
            </div>
        </div>
    );
};
