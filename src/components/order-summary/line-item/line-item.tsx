import { orders } from '@wix/ecom';
import styles from './line-item.module.scss';
import { getImageUrl } from './utils';

export interface LineItemProps {
    item: orders.OrderLineItem;
}

export const LineItem = ({ item }: LineItemProps) => {
    const lineItemImageUrl = item.image
        ? getImageUrl(item.image, {
              fitHeight: 200,
              fitWidth: 200,
          })
        : null;

    const productName = item.productName?.translated ?? item.productName?.original ?? '';

    return (
        <div className={styles.root}>
            <div className={styles.productInfo}>
                {lineItemImageUrl && (
                    <img width={200} height={200} src={lineItemImageUrl} alt={productName} />
                )}

                <div className={styles.productDetails}>
                    <div className={styles.productName}>{productName}</div>
                    <div>{item.price?.formattedAmount}</div>
                    {item.descriptionLines?.map(({ name, colorInfo, plainText }, index) => {
                        const displayName = name?.translated ?? name?.original;
                        const colorName = colorInfo?.translated ?? colorInfo?.original;
                        const value = plainText?.translated ?? plainText?.original;

                        return (
                            <div key={displayName ?? index}>
                                {displayName}: {colorName ?? value}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.orderDetails}>
                <div className={styles.quantity}>QTy: {item.quantity}</div>
                <div className={styles.subtotal}>{item.totalPriceBeforeTax?.formattedAmount}</div>
            </div>
        </div>
    );
};
