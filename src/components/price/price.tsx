import classNames from 'classnames';
import styles from './price.module.scss';

export interface PriceProps {
    fullPrice: string | undefined;
    price: string | undefined;
}

export const Price = ({ price, fullPrice }: PriceProps) => {
    return price ? (
        <div className={styles.container}>
            {fullPrice !== price && (
                <div className={classNames(styles.price, styles.fullPrice)}>{fullPrice}</div>
            )}

            <div className={classNames(styles.price, styles.currentPrice)}>{price}</div>
        </div>
    ) : undefined;
};
