import { orders } from '@wix/ecom';
import styles from './line-item.module.scss';

export interface LineItemProps {
    item: orders.OrderLineItem;
}

export const LineItem = ({ item }: LineItemProps) => {
    const lineItemImage = item.image
        ? getImageUrl(item.image, {
              fitHeight: 200,
              fitWidth: 200,
          })
        : null;

    return (
        <div className={styles.root}>
            <div className={styles.productInfo}>
                <div>
                    {lineItemImage ? (
                        <img src={lineItemImage} alt={item.productName?.translated ?? ''} />
                    ) : null}
                </div>

                <div className={styles.productDetails}>
                    <div className={styles.productName}>{item.productName?.translated}</div>
                    <div>{item.price?.formattedAmount}</div>
                    {item.descriptionLines?.map((l) => (
                        <div key={l.name?.translated ?? ''}>
                            {l.name?.translated}:{' '}
                            {l.colorInfo?.translated ?? l.plainText?.translated}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.orderDetails}>
                <div>QTy: {item.quantity}</div>
                <div>{item.totalPriceBeforeTax?.formattedAmount}</div>
            </div>
        </div>
    );
};

const WIX_IMAGE_URL_PREFIX = 'wix:image://v1/';
const WIX_MEDIA_API_URL = 'https://static.wixstatic.com/media/';

export interface ImageUrlOptions {
    fitWidth: number;
    fitHeight: number;
    quality?: number;
}

const DEFAULT_IMAGE_QUALITY = 90;

export function getImageUrl(imageUrl: string, options?: ImageUrlOptions) {
    if (imageUrl.startsWith(WIX_IMAGE_URL_PREFIX)) {
        const resultUrl = new URL(imageUrl.replace(WIX_IMAGE_URL_PREFIX, ''), WIX_MEDIA_API_URL);

        if (options) {
            const optionsQuery = `w_${options.fitWidth},h_${options.fitHeight},q_${
                options.quality ?? DEFAULT_IMAGE_QUALITY
            }`;

            resultUrl.hash = '';
            const imageWithOptionsUrl = new URL(`v1/fit/${optionsQuery}/file.jpg`, `${resultUrl}/`);
            return imageWithOptionsUrl.toString();
        }

        return resultUrl.toString();
    }

    return imageUrl;
}
