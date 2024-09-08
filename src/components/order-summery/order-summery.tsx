import styles from './order-summery.module.scss';
import cx from 'classnames';
import { ProductCard } from '~/components/product-card/product-card';

export interface OrderSummeryProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const OrderSummery = ({ className }: OrderSummeryProps) => {
    return (
        <div>
            <div className={cx(className, styles.itemInformationContainer)}>
                <div className={styles.div2}>
                    <ProductCard
                        name='Shel 50" Class LED 4K UHD Smart TV'
                        price={{ formatted: { price: '$85' } }}
                        style={{ width: '100%', display: 'flex' }}
                        imageUrl="https://wixmp-b7f7090100b13623109851bc.wixmp.com/layouters-starters/img_02.jpg"
                    />
                    <div className={styles.paymentContainer}>
                        <div className={styles.spacing}>
                            <span className={styles.span1}>QTy:1</span>
                            <span className={styles.span2}>$85.00</span>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider} />
                <div className={styles.div1}>
                    <div className={styles.emptyDiv} />
                    <div className={styles.paymentContainer}>
                        <div className={styles.div5}>
                            <div className={styles.spacing}>
                                <span>{'Sabtotal'}</span>
                                <span>$85.00</span>
                            </div>
                            <div className={styles.spacing}>
                                <span>{'Delivery'}</span>
                                <span>Free</span>
                            </div>
                            <div className={styles.spacing}>
                                <span>{'Sales T'}</span>
                                <span>$00.00</span>
                            </div>
                        </div>
                        <hr className={styles.divider} />
                        <div className={styles.spacing}>
                            <span className={styles.span1}>Total</span>
                            <span className={styles.span2}>$85.00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.informationContainer}>
                <div className={styles.delivery}>
                    <h6 className={styles.header1}>Delivery address</h6>
                    <ul className={styles.ul1}>
                        <li>John Doe</li>
                        <li>6970 Hawthorne Rd, United States</li>
                        <li>+1 (801) 5948739</li>
                    </ul>
                </div>
                <div className={styles.billing}>
                    <h6 className={styles.header2}>Billing address</h6>
                    <ul className={styles.ul2}>
                        <li>John Doe</li>
                        <li>6970 Hawthorne Rd, United States</li>
                        <li>+1 (801) 5948739</li>
                    </ul>
                </div>
                <div className={styles.payment}>
                    <h6 className={styles.header3}>Payment method</h6>
                    <ul className={styles.ul3}>
                        <li>Coffee</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
