import { Link } from '@remix-run/react';
import classNames from 'classnames';
import { ROUTES } from '~/router/config';
import commonStyles from '~/styles/common-styles.module.scss';
import styles from './product-not-found.module.scss';

export const ProductNotFound = () => {
    return (
        <div className={styles.root}>
            <div className={styles.message}>Product not found</div>
            <Link
                to={ROUTES.products.to()}
                className={classNames(commonStyles.primaryButton, styles.overlayButton)}
            >
                Back to shopping
            </Link>
        </div>
    );
};
