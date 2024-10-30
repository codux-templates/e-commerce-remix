import { products } from '@wix/stores';
import cx from 'classnames';
import styles from './product-images.module.scss';

export function ProductImages(props: {
    mainImage?: products.MediaItem;
    images?: products.MediaItem[];
    className?: string;
}) {
    const restImages = props.images?.filter((img) => img._id !== props.mainImage?._id);
    return (
        <div className={cx(styles.root, props.className)}>
            <img src={props.mainImage?.image?.url} alt={props.mainImage?.title} data-testid="product-img" />
            <div className={styles.imageGrid}>
                {restImages?.map((item, index) => {
                    return <img key={index} src={item.image?.url} alt={item.title} />;
                })}
            </div>
        </div>
    );
}
