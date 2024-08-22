import classNames from 'classnames';
import styles from './price.module.scss';

export interface PriceInfo {
    fullPrice: string | undefined;
    price: string | undefined;
}

export interface PriceProps {
    priceInfo: PriceInfo;
}

export const Price = ({ priceInfo: { price, fullPrice } }: PriceProps) => {
    return price ? (
        <div className={styles.container}>
            {fullPrice !== price && (
                <div className={classNames(styles.price, styles.fullPrice)}>{fullPrice}</div>
            )}

            <div className={classNames(styles.price, styles.currentPrice)}>{price}</div>
        </div>
    ) : undefined;
};
