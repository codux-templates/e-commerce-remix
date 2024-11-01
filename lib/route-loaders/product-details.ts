import { json } from '@remix-run/react';
import { EcomAPI } from '../ecom';

export async function getProductDetailsRouteData(api: EcomAPI, productSlug: string | undefined) {
    if (!productSlug) throw new Error('Missing product slug');

    const productResponse = await api.getProductBySlug(productSlug);
    if (productResponse.status === 'failure') throw json(productResponse.error);

    return {
        product: productResponse.body,
    };
}
