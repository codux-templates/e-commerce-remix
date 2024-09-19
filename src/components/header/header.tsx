import { NavLink } from '@remix-run/react';
import classNames from 'classnames';
import { useCartOpen } from '~/components/cart/cart-open-context';
import { ROUTES } from '~/router/config';
import styles from './header.module.scss';

export interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    const { setIsOpen: setCartOpen } = useCartOpen();

    return (
        <div className={classNames(styles.root, className)}>
            <NavLink to={ROUTES.home.to()} className={styles.logo}>
                LOGO
            </NavLink>
            <div className={styles.menu}>
                <NavLink
                    to={ROUTES.home.to()}
                    className={({ isActive }) => classNames(styles.menuButton, { [styles.activeMenuItem]: isActive })}
                >
                    Home
                </NavLink>
                <NavLink
                    to={ROUTES.category.to()}
                    className={({ isActive }) => classNames(styles.menuButton, { [styles.activeMenuItem]: isActive })}
                >
                    Products
                </NavLink>

                <NavLink
                    to={ROUTES.about.to()}
                    className={({ isActive }) => classNames(styles.menuButton, { [styles.activeMenuItem]: isActive })}
                >
                    About
                </NavLink>

                <button onClick={() => setCartOpen(true)} className={classNames(styles.menuButton, styles.cartButton)}>
                    Cart
                </button>
            </div>
        </div>
    );
};
