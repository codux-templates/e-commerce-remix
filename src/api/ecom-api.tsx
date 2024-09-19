import { currentCart, orders } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { OAuthStrategy, createClient } from '@wix/sdk';
import { products, collections } from '@wix/stores';
import Cookies from 'js-cookie';
import { ROUTES } from '~/router/config';
import {
    DEMO_STORE_WIX_CLIENT_ID,
    WIX_SESSION_TOKEN_COOKIE_KEY,
    WIX_STORES_APP_ID,
} from './constants';

function getWixClientId() {
    /**
     * this file is used on both sides: client and server,
     * so we are trying to read WIX_CLIENT_ID from process.env on server side
     * or from window.ENV (created by the root loader) on client side.
     */
    const env =
        typeof window !== 'undefined' && window.ENV
            ? window.ENV
            : typeof process !== 'undefined'
            ? process.env
            : {};

    return env.WIX_CLIENT_ID ?? DEMO_STORE_WIX_CLIENT_ID;
}

function getTokensClient() {
    const tokens = Cookies.get(WIX_SESSION_TOKEN_COOKIE_KEY);
    return tokens ? JSON.parse(tokens) : undefined;
}

function getWixClient() {
    return createClient({
        modules: {
            products,
            currentCart,
            redirects,
            collections,
            orders,
        },
        auth: OAuthStrategy({
            clientId: getWixClientId(),
            tokens: getTokensClient(),
        }),
    });
}

function createApi() {
    const wixClient = getWixClient();

    return {
        getProductsByCategory: async (categorySlug: string) => {
            const getCategoryResult = await wixClient.collections.getCollectionBySlug(categorySlug);

            return (
                await wixClient.products
                    .queryProducts()
                    .hasSome('collectionIds', [getCategoryResult.collection?._id])
                    .find()
            ).items;
        },
        getPromotedProducts: async () => {
            return (await wixClient.products.queryProducts().limit(4).find()).items;
        },
        getProduct: async (slug: string | undefined) => {
            return slug
                ? (await wixClient.products.queryProducts().eq('slug', slug).limit(1).find())
                      .items[0]
                : undefined;
        },
        getCart: () => {
            return wixClient.currentCart.getCurrentCart();
        },
        getCartTotals: () => {
            return wixClient.currentCart.estimateCurrentCartTotals();
        },
        updateCartItemQuantity: async (id: string | undefined | null, quantity: number) => {
            const result = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
                {
                    _id: id || undefined,
                    quantity,
                },
            ]);
            return result.cart;
        },
        removeItemFromCart: async (id: string) => {
            const result = await wixClient.currentCart.removeLineItemsFromCurrentCart([id]);
            return result.cart;
        },
        addToCart: async (id: string, quantity: number, options?: Record<string, string>) => {
            const result = await wixClient.currentCart.addToCurrentCart({
                lineItems: [
                    {
                        catalogReference: {
                            catalogItemId: id,
                            appId: WIX_STORES_APP_ID,
                            options: { options: options },
                        },
                        quantity: quantity,
                    },
                ],
            });
            const tokens = wixClient.auth.getTokens();
            Cookies.set(WIX_SESSION_TOKEN_COOKIE_KEY, JSON.stringify(tokens));

            return result.cart;
        },

        checkout: async () => {
            let checkoutId;
            try {
                const result = await wixClient.currentCart.createCheckoutFromCurrentCart({
                    channelType: currentCart.ChannelType.WEB,
                });
                checkoutId = result.checkoutId;
            } catch {
                return { success: false, url: '' };
            }
            const { redirectSession } = await wixClient.redirects.createRedirectSession({
                ecomCheckout: { checkoutId },
                callbacks: {
                    postFlowUrl: window.location.origin,
                    thankYouPageUrl: `${window.location.origin}${ROUTES.thankYou.path}`,
                },
            });
            return { success: true, url: redirectSession?.fullUrl };
        },
        getAllCategories: async () => {
            return (await wixClient.collections.queryCollections().find()).items;
        },
        getCategoryBySlug: async (slug: string) => {
            return (await wixClient.collections.getCollectionBySlug(slug)).collection;
        },
        getOrder: async (id: string) => {
            return await wixClient.orders.getOrder(id);
        },
    };
}

export type EcomAPI = ReturnType<typeof createApi>;

let api: EcomAPI | undefined;
export function getEcomApi() {
    if (api === undefined) {
        api = createApi();
    }

    return api;
}
