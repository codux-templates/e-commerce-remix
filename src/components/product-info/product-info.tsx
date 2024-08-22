import { products } from '@wix/stores';
import classNames from 'classnames';
import styles from './product-info.module.scss';

export interface ProductInfoProps {
    className?: string;
    productInfo?: products.AdditionalInfoSection[];
}

export const ProductInfo = ({ className, productInfo }: ProductInfoProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            {productInfo?.map((info, index) => (
                <div key={info.title || index}>
                    <div className={styles.infoTitle}>{info.title}</div>
                    <div className={styles.infoDescription}>{info.description}</div>
                </div>
            ))}
        </div>
    );
};
