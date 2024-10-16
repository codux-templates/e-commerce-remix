import { currentCart, orders } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { collections, products } from '@wix/stores';
import Cookies from 'js-cookie';
import { ROUTES } from '~/router/config';
import { getErrorMessage } from '~/utils';
import {
    DEMO_STORE_WIX_CLIENT_ID,
    WIX_CLIENT_ID_COOKIE_KEY,
    WIX_SESSION_TOKEN_COOKIE_KEY,
    WIX_STORES_APP_ID,
} from './constants';
import { getSortedProductsQuery } from './product-sorting';
import { EcomAPI, EcomApiErrorCodes, EcomAPIFailureResponse, EcomAPISuccessResponse, isEcomSDKError } from './types';

function getWixClientId() {
    /**
     * this file is used on both sides: client and server,
     * so we are trying to read WIX_CLIENT_ID from process.env on server side
     * or from window.ENV (created by the root loader) on client side.
     */
    const env =
        typeof window !== 'undefined' && window.ENV ? window.ENV : typeof process !== 'undefined' ? process.env : {};

    return env.WIX_CLIENT_ID ?? DEMO_STORE_WIX_CLIENT_ID;
}

function ensureSessionIntegrity() {
    const sessionWixClientId = Cookies.get(WIX_CLIENT_ID_COOKIE_KEY);
    const configuredWixClientId = getWixClientId();

    // Clear user session if headless site changed.
    // This will clear old cart if it exists.
    // We have to do this because old cart may contain products from old site.
    if (sessionWixClientId !== configuredWixClientId) {
        Cookies.remove(WIX_SESSION_TOKEN_COOKIE_KEY);
    }

    Cookies.set(WIX_CLIENT_ID_COOKIE_KEY, configuredWixClientId);
}

function getTokensClient() {
    ensureSessionIntegrity();

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

function createApi(): EcomAPI {
    const wixClient = getWixClient();

    return {
        async getProductsByCategory(categorySlug, { filters, sortBy } = {}) {
            try {
                const category = (await wixClient.collections.getCollectionBySlug(categorySlug)).collection;
                if (!category) {
                    throw new Error('Category not found');
                }

                let query = wixClient.products.queryProducts().hasSome('collectionIds', [category._id]);

                if (filters) {
                    if (filters.minPrice) {
                        query = query.ge('priceData.price', filters.minPrice);
                    }

                    if (filters.maxPrice) {
                        query = query.le('priceData.price', filters.maxPrice);
                    }
                }

                if (sortBy) {
                    query = getSortedProductsQuery(query, sortBy);
                }

                let productsResponse = await query.limit(100).find();
                const allProducts = productsResponse.items;

                // load all available products. if you have a lot of projects in your site
                // please implement proper implementation of pagination
                while (productsResponse.hasNext()) {
                    productsResponse = await productsResponse.next();
                    allProducts.push(...productsResponse.items);
                }

                return successResponse({ items: allProducts, totalCount: productsResponse.totalCount ?? 0 });
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetProductsFailure, getErrorMessage(e));
            }
        },

        async getPromotedProducts() {
            try {
                const products = (await wixClient.products.queryProducts().limit(4).find()).items;
                return successResponse(products);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetProductsFailure, getErrorMessage(e));
            }
        },
        async getProductBySlug(slug) {
            try {
                const product = (await wixClient.products.queryProducts().eq('slug', slug).limit(1).find()).items[0];
                if (product === undefined) {
                    return failureResponse(EcomApiErrorCodes.ProductNotFound);
                }
                return successResponse(product);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetProductFailure, getErrorMessage(e));
            }
        },
        async getCart() {
            try {
                const currentCart = await wixClient.currentCart.getCurrentCart();
                return successResponse(currentCart);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetCartFailure, getErrorMessage(e));
            }
        },
        async getCartTotals() {
            try {
                const cartTotals = await wixClient.currentCart.estimateCurrentCartTotals();
                return successResponse(cartTotals);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetCartTotalsFailure, getErrorMessage(e));
            }
        },
        async updateCartItemQuantity(id, quantity) {
            try {
                const result = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
                    {
                        _id: id || undefined,
                        quantity,
                    },
                ]);
                if (!result.cart) {
                    throw new Error('Failed to update cart item quantity');
                }
                return successResponse(result.cart);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.UpdateCartItemQuantityFailure, getErrorMessage(e));
            }
        },
        async removeItemFromCart(id) {
            try {
                const result = await wixClient.currentCart.removeLineItemsFromCurrentCart([id]);
                if (!result.cart) {
                    throw new Error('Failed to remove cart item');
                }
                return successResponse(result.cart);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.RemoveCartItemFailure, getErrorMessage(e));
            }
        },
        async addToCart(id, quantity, options) {
            try {
                const result = await wixClient.currentCart.addToCurrentCart({
                    lineItems: [
                        {
                            catalogReference: {
                                catalogItemId: id,
                                appId: WIX_STORES_APP_ID,
                                options,
                            },
                            quantity: quantity,
                        },
                    ],
                });

                if (!result.cart) {
                    throw new Error('Failed to add item to cart');
                }

                const tokens = wixClient.auth.getTokens();
                Cookies.set(WIX_SESSION_TOKEN_COOKIE_KEY, JSON.stringify(tokens));

                return successResponse(result.cart);
            } catch {
                return failureResponse(EcomApiErrorCodes.AddCartItemFailure);
            }
        },

        async checkout() {
            let checkoutId;
            try {
                const result = await wixClient.currentCart.createCheckoutFromCurrentCart({
                    channelType: currentCart.ChannelType.WEB,
                });
                checkoutId = result.checkoutId;
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.CreateCheckoutFailure, getErrorMessage(e));
            }

            try {
                const { redirectSession } = await wixClient.redirects.createRedirectSession({
                    ecomCheckout: { checkoutId },
                    callbacks: {
                        postFlowUrl: window.location.origin,
                        thankYouPageUrl: `${window.location.origin}${ROUTES.thankYou.path}`,
                    },
                });
                if (!redirectSession?.fullUrl) {
                    throw new Error('Missing redirect session url');
                }
                return successResponse({ checkoutUrl: redirectSession?.fullUrl });
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.CreateCheckoutRedirectSessionFailure, getErrorMessage(e));
            }
        },
        async getAllCategories() {
            try {
                const categories = (await wixClient.collections.queryCollections().find()).items;
                return successResponse(categories);
            } catch {
                return failureResponse(EcomApiErrorCodes.GetAllCategoriesFailure);
            }
        },
        async getCategoryBySlug(slug) {
            try {
                const category = (await wixClient.collections.getCollectionBySlug(slug)).collection;
                if (!category) {
                    return failureResponse(EcomApiErrorCodes.CategoryNotFound);
                }

                return successResponse(category);
            } catch (e) {
                if (isEcomSDKError(e) && e.details.applicationError.code === 404) {
                    return failureResponse(EcomApiErrorCodes.CategoryNotFound);
                }

                return failureResponse(EcomApiErrorCodes.GetCategoryFailure, getErrorMessage(e));
            }
        },
        async getOrder(id) {
            try {
                const order = await wixClient.orders.getOrder(id);
                if (!order) {
                    return failureResponse(EcomApiErrorCodes.OrderNotFound);
                }

                return successResponse(order);
            } catch (e) {
                if (isEcomSDKError(e) && e.details.applicationError.code === 404) {
                    return failureResponse(EcomApiErrorCodes.OrderNotFound);
                }
                return failureResponse(EcomApiErrorCodes.GetOrderFailure);
            }
        },
        async getProductPriceBounds(categorySlug: string) {
            try {
                const category = (await wixClient.collections.getCollectionBySlug(categorySlug)).collection;
                if (!category) throw new Error('Category not found');

                const query = wixClient.products.queryProducts().hasSome('collectionIds', [category._id]);

                const [ascendingPrice, descendingPrice] = await Promise.all([
                    query.ascending('price').limit(1).find(),
                    query.descending('price').limit(1).find(),
                ]);

                const lowest = ascendingPrice.items[0]?.priceData?.price ?? 0;
                const highest = descendingPrice.items[0]?.priceData?.price ?? 0;

                return successResponse({ lowest, highest });
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetProductsFailure, getErrorMessage(e));
            }
        },
    };
}

let api: EcomAPI | undefined;
export function getEcomApi() {
    if (api === undefined) {
        api = createApi();
    }

    return api;
}

function failureResponse(code: EcomApiErrorCodes, message?: string): EcomAPIFailureResponse {
    return {
        status: 'failure',
        error: { code, message },
    };
}

function successResponse<T>(body: T): EcomAPISuccessResponse<T> {
    return {
        status: 'success',
        body,
    };
}
