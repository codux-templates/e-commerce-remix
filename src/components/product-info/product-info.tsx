import classNames from 'classnames';
import styles from './product-info.module.scss';
import { products } from '@wix/stores';
import { RichText } from '../rich-text/rich-text';

export interface ProductInfoProps {
    className?: string;
    productInfo?: products.AdditionalInfoSection[];
}

export const ProductInfo = ({ className, productInfo }: ProductInfoProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            {productInfo?.map((info, index) => (
                <div key={info.title || index}>
                    <div className={styles['info-title']}>{info.title}</div>
                    <RichText className={styles['info-prgrp']}>{info.description}</RichText>
                </div>
            ))}
        </div>
    );
};
