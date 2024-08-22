import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useSearchParams } from '@remix-run/react';
import { ROUTES } from '~/router/config';
import CommonStyles_module from '~/styles/common-styles.module.scss';
import { getUrlOriginWithPath } from '~/utils';
import styles from './thank-you.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return { canonicalUrl: getUrlOriginWithPath(request.url) };
};

export default function ThankYouPage() {
    const [search] = useSearchParams();
    const orderId = search.get('orderId');

    return (
        <div className={styles.root}>
            <div className={styles.text}>
                <h1 className={styles.title}>Thank You!</h1>
                <p className={styles.paragraph}>
                    You will receive a confirmation email soon. Your order number: {orderId}
                </p>
            </div>
            <Link to={ROUTES.products.to()}>
                <button className={CommonStyles_module.primaryButton} type="button">
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
