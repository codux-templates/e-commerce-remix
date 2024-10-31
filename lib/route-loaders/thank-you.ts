import { json } from '@remix-run/react';
import { EcomAPI, OrderDetails } from '~/lib/ecom';

export async function getThankYouRouteData(api: EcomAPI, url: string): Promise<{ order?: OrderDetails }> {
    const orderId = new URL(url).searchParams.get('orderId');
    // Show "Thank you" page even without order details.
    if (!orderId) return { order: undefined };

    const orderResponse = await api.getOrder(orderId);
    if (orderResponse.status === 'failure') throw json(orderResponse.error);

    return { order: orderResponse.body };
}
