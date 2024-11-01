import { products } from '@wix/stores';
import classNames from 'classnames';
import { UnsafeRichText } from '~/src/components/rich-text/rich-text';
import styles from './product-additional-info.module.scss';

export interface ProductAdditionalInfoProps {
    className?: string;
    productInfo?: products.AdditionalInfoSection[];
}

export const ProductAdditionalInfo = ({ className, productInfo }: ProductAdditionalInfoProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            {productInfo?.map((info, index) => (
                <div key={info.title || index}>
                    <h6 className={styles.infoTitle}>{info.title}</h6>
                    {/** use unsafe component for info description, because it comes from e-commerce site back-office */}
                    <UnsafeRichText className={styles.infoDescription}>{info.description}</UnsafeRichText>
                </div>
            ))}
        </div>
    );
};
