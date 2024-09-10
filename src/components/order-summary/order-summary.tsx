import { orders } from '@wix/ecom';
import cx from 'classnames';
import { LineItem } from './line-item/line-item';
import styles from './order-summary.module.scss';

export interface OrderSummaryProps {
    order: orders.Order & orders.OrderNonNullableFields;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
    const { lineItems, priceSummary, shippingInfo, billingInfo } = order;

    function addressToString(address: orders.Address) {
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

    function contactInfoToString(contact: orders.FullAddressContactDetails) {
        return `${contact.firstName ?? ''} ${contact.lastName ?? ''}`;
    }

    const deliveryAddress = shippingInfo?.logistics?.shippingDestination?.address;
    const deliveryContact = shippingInfo?.logistics?.shippingDestination?.contactDetails;

    const billingContact = billingInfo?.contactDetails;
    const billingAddress = billingInfo?.address;

    return (
        <div className={styles.root}>
            <div className={cx(styles.section, styles.lineItemsSection)}>
                <div className={styles.lineItems}>
                    {lineItems.map((lineItem) => (
                        <LineItem key={lineItem._id} item={lineItem} />
                    ))}
                </div>

                <div className={styles.divider} />

                <div className={styles.summaryWrapper}>
                    <div className={styles.noteWrapper}>
                        {order.buyerNote && (
                            <>
                                <div className={styles.noteTitle}>Note</div>
                                <div className={styles.noteValue}>{order.buyerNote}</div>
                            </>
                        )}
                    </div>

                    <div className={cx(styles.divider, styles.buyerNoteSeparator)} />

                    <div className={styles.priceDetails}>
                        <div className={styles.priceItems}>
                            <div>Subtotal</div>
                            <div className={styles.priceValue}>
                                {priceSummary?.subtotal?.formattedAmount}
                            </div>

                            <div>Delivery</div>
                            <div className={styles.priceValue}>
                                {Number(priceSummary?.shipping?.amount) === 0
                                    ? 'Free'
                                    : priceSummary?.shipping?.formattedAmount}
                            </div>

                            <div>Sales Tax</div>
                            <div className={styles.priceValue}>
                                {priceSummary?.tax?.formattedAmount}
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <div className={cx(styles.priceItems, styles.totalPrice)}>
                            <div>Total</div>
                            <div className={styles.priceValue}>
                                {priceSummary?.total?.formattedAmount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx(styles.section, styles.deliveryBilling)}>
                <div className={styles.delivery}>
                    <h6 className={styles.title}>Delivery address</h6>
                    <ul className={styles.addressLines}>
                        {deliveryContact && <li>{contactInfoToString(deliveryContact)}</li>}
                        {deliveryAddress && <li>{addressToString(deliveryAddress)}</li>}
                        {deliveryContact?.phone && <li>{deliveryContact?.phone}</li>}

                        {shippingInfo?.logistics?.deliveryTime && (
                            <li className={styles.deliveryTime}>
                                {shippingInfo?.logistics?.deliveryTime}
                            </li>
                        )}
                    </ul>
                </div>

                <div className={styles.billing}>
                    <h6 className={styles.title}>Billing address</h6>
                    <ul className={styles.addressLines}>
                        {billingContact && <li>{contactInfoToString(billingContact)}</li>}
                        {billingAddress && <li>{addressToString(billingAddress)}</li>}
                        <li>{billingInfo?.contactDetails?.phone}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
