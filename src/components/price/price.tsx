import styles from './price.module.scss';

export interface PriceProps {
    fullPrice: string | undefined;
    price: string | undefined;
}

export const Price = ({ price, fullPrice }: PriceProps) => {
    return price ? (
        <div className={styles.container}>
            {fullPrice !== price && <div className={styles.fullPrice}>{fullPrice}</div>}

            <div className={styles.currentPrice}>{price}</div>
        </div>
    ) : undefined;
};
