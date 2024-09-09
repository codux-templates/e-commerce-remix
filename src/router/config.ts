import { generatePath } from '@remix-run/react';

const HOME = '/';
const ABOUT = '/about';
const CATEGORY = '/category/:categorySlug';
const PRODUCT = `/products/:productSlug`;
const THANK_YOU = '/thank-you';
const ERROR = '/error';

export const ROUTES = {
    home: { path: HOME, to: () => HOME },
    about: { path: ABOUT, to: () => ABOUT },
    category: {
        path: CATEGORY,
        to: (slug?: string) => generatePath(CATEGORY, { categorySlug: slug ?? 'all-products' }),
    },
    thankYou: { path: THANK_YOU, to: () => THANK_YOU },
    product: {
        path: PRODUCT,
        to: (slug: string) => generatePath(PRODUCT, { productSlug: slug }),
    },
    error: {
        path: ERROR,
        to: (title: string, message?: string) => `${ERROR}?title=${title}&message=${message}`,
    },
};

export type ROUTE_KEYS = keyof typeof ROUTES;

export type RouteParams = {
    [PRODUCT]: { slug: string };
    [CATEGORY]: { name: string };
};
