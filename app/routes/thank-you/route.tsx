import { MetaFunction } from '@remix-run/node';
import { isRouteErrorResponse, Link, useRouteError, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useEcomAPI, type OrderDetails } from '~/lib/ecom';
import { getErrorMessage } from '~/lib/utils';
import { ErrorComponent } from '~/src/components/error-component/error-component';
import { OrderSummary } from '~/src/components/order-summary/order-summary';

import styles from './thank-you.module.scss';

export default function ThankYouPage() {
    const [search] = useSearchParams();
    const orderId = search.get('orderId');

    const [order, setOrder] = useState<OrderDetails>();
    const [error, setError] = useState<string>();

    const api = useEcomAPI();

    useEffect(() => {
        if (orderId) {
            api.getOrder(orderId).then((response) => {
                if (response.status === 'success') {
                    setOrder(response.body);
                    setError(undefined);
                } else {
                    setError(response.error.message ?? 'Unknown error');
                }
            });
        }
    }, [api, orderId]);

    return (
        <div className={styles.root}>
            <div className={styles.text}>
                <h1 className={styles.title}>Thank You!</h1>
                <div className={styles.paragraph}>
                    <div>You will receive a confirmation email soon.</div>
                    {order && <div>Your order number: {order.number}</div>}
                </div>
            </div>

            {order && <OrderSummary order={order} />}
            {error && (
                <div className={styles.errorContainer}>
                    <h2>Could not load your order:</h2>
                    <div>{error}</div>
                </div>
            )}

            <Link to={'category/all-products'}>
                <button className="primaryButton" type="button">
                    Continue Shopping
                </button>
            </Link>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const title = isRouteErrorResponse(error) ? 'Failed to load order details' : 'Error';
    const message = getErrorMessage(error);
    return <ErrorComponent title={title} message={message} />;
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Thank You' },
        {
            name: 'description',
            content: 'Thank You for your order',
        },

        {
            property: 'robots',
            content: 'noindex, nofollow',
        },
    ];
};
