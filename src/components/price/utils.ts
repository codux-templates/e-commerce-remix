import { cart } from '@wix/ecom';
import { products } from '@wix/stores';
import { PriceInfo } from './price';

export function getCartItemPriceInfo(cartItem: cart.LineItem | undefined): PriceInfo {
    return {
        fullPrice: cartItem?.fullPrice?.formattedConvertedAmount,
        price: cartItem?.price?.formattedConvertedAmount,
    };
}

export function getProductPriceInfo(priceData: products.PriceData | undefined): PriceInfo {
    return {
        fullPrice: priceData?.formatted?.price,
        price: priceData?.formatted?.discountedPrice,
    };
}
