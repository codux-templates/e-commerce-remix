import styles from './product-not-found.module.scss';
import { Link } from '@remix-run/react';
import { ROUTES } from '~/router/config';
import commonStylesStyles from '../../styles/common-styles.module.scss';
import Classnames from 'classnames';
import { ReactComponent as ServerErrorSvg } from '../../assets/svg/servererror.svg';

export const ProductNotFound = () => {
    return (
        <div className={Classnames(styles.layout, commonStylesStyles.row)}>
            <div className={commonStylesStyles.dividedStrip}>
                <div className={commonStylesStyles.section}>
                    <div className={styles.div1}>
                        <h1 className={commonStylesStyles.p2}>Product not found.</h1>
                        <p className={Classnames(styles.p, styles.h4)}></p>
                        <Link to={ROUTES.products.to()}>
                            <button
                                className={Classnames(
                                    styles.secondaryButtonVar1,
                                    commonStylesStyles.linkButton
                                )}
                            >
                                Click here to see other products
                            </button>
                        </Link>
                    </div>
                    <div className={commonStylesStyles.imageSection}>
                        <ServerErrorSvg className={styles.servererrorSvg} />
                    </div>
                </div>
            </div>
        </div>
    );
};
