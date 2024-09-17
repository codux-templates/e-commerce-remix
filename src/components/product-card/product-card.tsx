import { products } from '@wix/stores';
import classNames from 'classnames';
import noImage from '~/assets/img/noImage/[160_200]_noImage.svg';
import { Price } from '../price/price';
import styles from './product-card.module.scss';

export type GalleryCardProps = {
    name: string;
    imageUrl?: string;
    className?: string;
    inStock?: boolean;
    price?: products.PriceData;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProductCard = ({ name, imageUrl, className, price, inStock, ...divProps }: GalleryCardProps) => {
    return (
        <div className={classNames(styles.root, className, { [styles.outOfStock]: !inStock })} {...divProps}>
            {imageUrl ? (
                <img src={imageUrl} alt={name} className={styles.image} data-testid="product-img" />
            ) : (
                <img src={noImage} alt={name} className={styles.image} data-testid="product-img" />
            )}
            <div className={styles.cardContent}>
                <p className={styles.description}>{name}</p>
                {price?.formatted?.price && (
                    <Price fullPrice={price?.formatted?.price} discountedPrice={price?.formatted?.discountedPrice} />
                )}
                {!inStock && <div className={styles.outOfStockMessage}>Out of stock</div>}
            </div>
        </div>
    );
};
