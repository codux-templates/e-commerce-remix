import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useSearchParams } from '@remix-run/react';
import { orders } from '@wix/ecom';
import { useEffect, useState } from 'react';
import { getEcomApi } from '~/api/ecom-api';
import { ROUTES } from '~/router/config';
import commonStyles from '~/styles/common-styles.module.scss';
import { getUrlOriginWithPath } from '~/utils';
import { OrderSummary } from '../../../src/components/order-summary/order-summary';
import styles from './thank-you.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return { canonicalUrl: getUrlOriginWithPath(request.url) };
};

export default function ThankYouPage() {
    const [search] = useSearchParams();
    const orderId = search.get('orderId');

    const [order, setOrder] = useState<orders.Order & orders.OrderNonNullableFields>();

    const api = getEcomApi();

    useEffect(() => {
        if (orderId) {
            api.getOrder(orderId).then((order) => setOrder(order));
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

            <Link to={ROUTES.category.to()}>
                <button className={commonStyles.primaryButton} type="button">
                    Continue Shopping
                </button>
            </Link>
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const title = 'E-Commerce App - Thank You';
    const description = 'Thank You for your purchase';
    const imageUrl = 'https://e-commerce.com/image.png';

    return [
        { title: title },
        {
            name: 'description',
            content: description,
        },
        {
            tagName: 'link',
            rel: 'canonical',
            href: data?.canonicalUrl,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:image',
            content: imageUrl,
        },
        {
            name: 'twitter:card',
            content: 'summary_large_image',
        },
        {
            name: 'twitter:title',
            content: title,
        },
        {
            name: 'twitter:description',
            content: description,
        },
        {
            name: 'twitter:image',
            content: imageUrl,
        },
    ];
};

export const links: LinksFunction = () => {
    return [
        {
            rel: 'icon',
            href: '/favicon.ico',
            type: 'image/ico',
        },
    ];
};
