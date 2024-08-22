import styles from './price.module.scss';

export interface PriceProps {
    fullPrice: string | undefined;
    currentPrice: string | undefined;
}

export const Price = ({ currentPrice, fullPrice }: PriceProps) => {
    return currentPrice ? (
        <div className={styles.container}>
            {fullPrice !== currentPrice && <div className={styles.fullPrice}>{fullPrice}</div>}

            <div className={styles.currentPrice}>{currentPrice}</div>
        </div>
    ) : undefined;
};
