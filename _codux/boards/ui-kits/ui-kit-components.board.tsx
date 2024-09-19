import { createBoard, Variant } from '@wixc3/react-board';
import classNames from 'classnames';
import { ProductCard } from '~/components/product-card/product-card';
import styles from '~/styles/ui-kit-components.module.scss';

export default createBoard({
    name: 'UI Kit - Components',
    Board: () => (
        <div className={styles.container}>
            <div>
                <span className={styles.uikit}>UI Kit</span>
                <span className={styles.coreComponents}>{' | '}Core Components</span>
                <hr className={styles.hrSolid} />
                <h3 className={styles.sectionTitle}>Components</h3>
            </div>
            <h4 className={styles.sectionHeader}>CARDS</h4>
            <Variant name="Product Card">
                <ProductCard
                    name="Im a product"
                    price={{ formatted: { price: '$15.00' } }}
                    className={classNames(styles.productCard, styles.productCard)}
                    imageUrl="https://wixmp-b7f7090100b13623109851bc.wixmp.com/layouters-starters/img_02.jpg"
                />
            </Variant>
            <p className={styles.productCardInfo}>Product Card</p>
            <Variant name="Product Card Without Image">
                <ProductCard
                    name="Im a product"
                    price={{ formatted: { price: '$15.00' } }}
                    className={classNames(styles.productCard, styles.productCard)}
                />
            </Variant>
            <p className={styles.productCardInfo}>Product Card No Image</p>
        </div>
    ),
    isSnippet: true,
    environmentProps: {
        windowWidth: 320,
        windowHeight: 525,
    },
    tags: ['UI Kit'],
});
