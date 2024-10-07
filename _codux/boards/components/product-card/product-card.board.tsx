import { createBoard } from '@wixc3/react-board';
import { ProductCard } from '~/components/product-card/product-card';
import styles from './product-card.board.module.scss';

export default createBoard({
    name: 'Product Card',
    Board: () => (
        <div className={styles.root}>
            <ProductCard
                className={styles.card}
                name='Shel 50" Class LED 4K UHD Smart TV'
                price={{ formatted: { price: '$85' } }}
                style={{ width: '300px' }}
                imageUrl="https://wixmp-b7f7090100b13623109851bc.wixmp.com/layouters-starters/img_02.jpg"
            />

            <ProductCard
                className={styles.card}
                name='Shel 50" Class LED 4K UHD Smart TV'
                price={{ formatted: { price: '$85' } }}
            />

            <ProductCard
                className={styles.card}
                name='Shel 50" Class LED 4K UHD Smart TV'
                price={{ formatted: { price: '$85' } }}
                style={{ width: '300px' }}
                imageUrl="https://wixmp-b7f7090100b13623109851bc.wixmp.com/layouters-starters/img_02.jpg"
                outOfStock={true}
            />
        </div>
    ),
    tags: ['Component'],
});
