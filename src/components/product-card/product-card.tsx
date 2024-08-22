import classNames from 'classnames';
import styles from './product-card.module.scss';
import { products } from '@wix/stores';
import noImage from '~/assets/img/noImage/[160_200]_noImage.svg';
import { Price } from '../price/price';
import { getProductPriceInfo } from '../price/utils';

export type GalleryCardProps = {
    name: string;
    imageUrl?: string;
    className?: string;
    price?: products.PriceData;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProductCard = ({
    name,
    imageUrl,
    className,
    price,
    ...divProps
}: GalleryCardProps) => {
    return (
        <div className={classNames(styles.root, className)} {...divProps}>
            {imageUrl ? (
                <img src={imageUrl} alt={name} className={styles.image} data-testid="product-img" />
            ) : (
                <img src={noImage} alt={name} className={styles.image} data-testid="product-img" />
            )}
            <div className={styles.cardContent}>
                <p className={styles.description}>{name}</p>
                <Price priceInfo={getProductPriceInfo(price)} />
            </div>
        </div>
    );
};
