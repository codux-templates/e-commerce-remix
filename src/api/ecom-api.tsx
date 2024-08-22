import { currentCart } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { OAuthStrategy, createClient } from '@wix/sdk';
import { products } from '@wix/stores';
import Cookies from 'js-cookie';
import { ROUTES } from '~/router/config';

// this is the static ID of the stores app
const WIX_STORES_APP_ID = '1380b703-ce81-ff05-f115-39571d94dfcd';
const CLIENT_ID =
    globalThis?.process?.env?.WIX_CLIENT_ID ||
    globalThis?.window?.ENV?.WIX_CLIENT_ID ||
    /* this is the Wix demo store id (it's not a secret). */
    '0c9d1ef9-f496-4149-b246-75a2514b8c99';
export const WIX_SESSION_TOKEN = 'wix_refreshToken';

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
        },
        auth: OAuthStrategy({
            clientId: CLIENT_ID,
            tokens: getTokensClient(),
        }),
    });
}

function getEcomApi(wixClient: ReturnType<typeof getWixClient>) {
    return {
        getAllProducts: async () => {
            return (await wixClient.products.queryProducts().find()).items;
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
    };
}

export const ecomApi = getEcomApi(getWixClient());
