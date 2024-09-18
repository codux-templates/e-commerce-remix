import { createBoard } from '@wixc3/react-board';
import { ProductCard } from '~/components/product-card/product-card';

export default createBoard({
    name: 'Product Card',
    Board: () => (
        <ProductCard
            name='Shel 50" Class LED 4K UHD Smart TV'
            price={{ formatted: { price: '$85' } }}
            style={{ width: '300px' }}
            imageUrl="https://wixmp-b7f7090100b13623109851bc.wixmp.com/layouters-starters/img_02.jpg"
        />
    ),
    tags: ['Component'],
    isSnippet: true,
});
