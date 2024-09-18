import { createBoard } from '@wixc3/react-board';
import { ProductCard } from '~/components/product-card/product-card';

export default createBoard({
    name: 'Product Card No Image',
    Board: () => (
        <ProductCard
            name='Shel 50" Class LED 4K UHD Smart TV'
            price={{ formatted: { price: '$85' } }}
        />
    ),
    tags: ['Component'],
    isSnippet: true,
});
