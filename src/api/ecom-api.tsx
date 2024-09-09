import { currentCart, orders } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { OAuthStrategy, createClient } from '@wix/sdk';
import { products, collections } from '@wix/stores';
import Cookies from 'js-cookie';
import { ROUTES } from '~/router/config';

// this is the static ID of the stores app
const WIX_STORES_APP_ID = '1380b703-ce81-ff05-f115-39571d94dfcd';
export const WIX_SESSION_TOKEN = 'wix_refreshToken';

function getWixClientId() {
    /**
     * this file is used on both sides: client and server,
     * so we are trying to read WIX_CLIENT_ID from process.env on server side
     * or from window.ENV on client side. for client, the root loader is populating window.ENV
     */
    const env =
        typeof window !== 'undefined' && typeof window.ENV !== 'undefined'
            ? window.ENV
            : process.env;

    /* fallback to the Wix demo store id (it's not a secret). */
    return env.WIX_CLIENT_ID ?? '0c9d1ef9-f496-4149-b246-75a2514b8c99';
}

function getTokensClient() {
    const tokens = Cookies.get(WIX_SESSION_TOKEN);
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
            Cookies.set(WIX_SESSION_TOKEN, JSON.stringify(tokens));

            return result.cart;
        },

        checkout: async () => {
            let checkoutId;
            try {
                const result = await wixClient.currentCart.createCheckoutFromCurrentCart({
                    channelType: currentCart.ChannelType.WEB,
                });
                checkoutId = result.checkoutId;
            } catch (e) {
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
