import styles from './price.module.scss';

export interface PriceProps {
    currentPrice: string;
    previousPrice?: string;
}

export const Price = ({ currentPrice, previousPrice }: PriceProps) => {
    if (!currentPrice) {
        return undefined;
    }

    return (
        <div className={styles.container}>
            {previousPrice !== currentPrice && (
                <div className={styles.previousPrice}>{previousPrice}</div>
            )}

            <div className={styles.currentPrice}>{currentPrice}</div>
        </div>
    );
};
