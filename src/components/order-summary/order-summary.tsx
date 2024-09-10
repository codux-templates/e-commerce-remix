import { orders } from '@wix/ecom';
import cx from 'classnames';
import { LineItem } from './line-item/line-item';
import styles from './order-summary.module.scss';

export interface OrderSummaryProps {
    order: orders.Order;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const OrderSummary = ({ order }: OrderSummaryProps) => {
    return (
        <div className={styles.root}>
            <div className={cx(styles.section, styles.lineItemsSection)}>
                <div className={styles.lineItems}>
                    {order.lineItems?.map((i) => (
                        <LineItem key={i._id} item={i} />
                    ))}
                </div>

                <hr className={styles.divider} />

                <div className={styles.priceDetailsWrapper}>
                    <div className={styles.priceDetails}>
                        <div className={styles.priceItems}>
                            <div>Subtotal</div>
                            <div className={styles.priceValue}>
                                {order.priceSummary?.subtotal?.formattedAmount}
                            </div>

                            <div>Delivery</div>
                            <div className={styles.priceValue}>
                                {Number(order.priceSummary?.shipping?.amount) === 0
                                    ? 'Free'
                                    : order.priceSummary?.shipping?.formattedAmount}
                            </div>

                            <div>Sales Tax</div>
                            <div className={styles.priceValue}>
                                {order.priceSummary?.tax?.formattedAmount}
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <div className={cx(styles.priceItems, styles.totalPrice)}>
                            <div>Total</div>
                            <div className={styles.priceValue}>
                                {order.priceSummary?.total?.formattedAmount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx(styles.section, styles.deliveryBilling)}>
                <div className={styles.delivery}>
                    <h6 className={styles.title}>Delivery address</h6>
                    <ul className={styles.addressLines}>
                        <li>
                            {`${order?.shippingInfo?.logistics?.shippingDestination?.contactDetails?.firstName} ${order?.shippingInfo?.logistics?.shippingDestination?.contactDetails?.lastName}`}
                        </li>
                        {renderAddress(
                            order?.shippingInfo?.logistics?.shippingDestination?.address
                        )}
                        <li>
                            {
                                order?.shippingInfo?.logistics?.shippingDestination?.contactDetails
                                    ?.phone
                            }
                        </li>

                        {order?.shippingInfo?.logistics?.deliveryTime ? (
                            <li className={styles.deliveryTime}>
                                {order?.shippingInfo?.logistics?.deliveryTime}
                            </li>
                        ) : null}
                    </ul>
                </div>

                <div className={styles.billing}>
                    <h6 className={styles.title}>Billing address</h6>
                    <ul className={styles.addressLines}>
                        <li>
                            {`${order?.billingInfo?.contactDetails?.firstName} ${order?.shippingInfo?.logistics?.shippingDestination?.contactDetails?.lastName}`}
                        </li>
                        {renderAddress(order?.billingInfo?.address)}
                        <li>{order?.billingInfo?.contactDetails?.phone}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

function renderAddress(address: orders.Address | undefined) {
    return [
        address?.addressLine1,
        address?.addressLine2,
        address?.city,
        address?.postalCode,
        address?.country,
    ]
        .filter((line) => !!line)
        .join(', ');
}
