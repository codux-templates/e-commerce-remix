import { currentCart, orders } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { createClient, IOAuthStrategy, OAuthStrategy, Tokens, WixClient } from '@wix/sdk';
import { collections, products } from '@wix/stores';
import { getErrorMessage } from '~/lib/utils';
import { DEMO_STORE_WIX_CLIENT_ID } from '~/src/constants';
import { WIX_STORES_APP_ID } from './constants';
import { getFilteredProductsQuery } from './product-filters';
import { getSortedProductsQuery } from './product-sorting';
import {
    CollectionDetails,
    EcomAPI,
    EcomApiErrorCodes,
    EcomAPIFailureResponse,
    EcomAPISuccessResponse,
    isEcomSDKError,
} from './types';

type WixApiClient = WixClient<
    undefined,
    IOAuthStrategy,
    {
        products: typeof products;
        currentCart: typeof currentCart;
        redirects: typeof redirects;
        collections: typeof collections;
        orders: typeof orders;
    }
>;

export function getWixClientId() {
    /**
     * this file is used on both sides: client and server,
     * so we are trying to read WIX_CLIENT_ID from process.env on server side
     * or from window.ENV (created by the root loader) on client side.
     */
    const env =
        typeof window !== 'undefined' && window.ENV ? window.ENV : typeof process !== 'undefined' ? process.env : {};

    return env.WIX_CLIENT_ID ?? DEMO_STORE_WIX_CLIENT_ID;
}

export function createWixClient(tokens?: Tokens): WixApiClient {
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
            tokens,
        }),
    });
}

export function createApi(wixClient: WixApiClient): EcomAPI {
    return {
        async getProducts(limit = 100) {
            try {
                const response = await wixClient.products.queryProducts().limit(limit).find();
                return successResponse(response.items);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetProductsFailure, getErrorMessage(e));
            }
        },
        async getProductsByCategory(categorySlug, { skip = 0, limit = 100, filters, sortBy } = {}) {
            try {
                const category = (await wixClient.collections.getCollectionBySlug(categorySlug)).collection;
                if (!category) throw new Error('Category not found');

                let query = wixClient.products.queryProducts().hasSome('collectionIds', [category._id]);

                if (filters) {
                    query = getFilteredProductsQuery(query, filters);
                }

                if (sortBy) {
                    query = getSortedProductsQuery(query, sortBy);
                }

                const { items, totalCount = 0 } = await query.skip(skip).limit(limit).find();

                return successResponse({ items, totalCount });
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetProductsFailure, getErrorMessage(e));
            }
        },
        async getFeaturedProducts(categorySlug, count) {
            let category: CollectionDetails | undefined;
            const response = await this.getCategoryBySlug(categorySlug);
            if (response.status === 'success') {
                category = response.body;
            } else {
                const error = response.error;
                if (error.code === EcomApiErrorCodes.CategoryNotFound) {
                    const response = await this.getCategoryBySlug('all-products');
                    if (response.status === 'success') {
                        category = response.body;
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }

            const productsResponse = await this.getProductsByCategory(category.slug!, {
                limit: count,
            });
            if (productsResponse.status === 'failure') throw productsResponse.error;
            return successResponse({ category, items: productsResponse.body.items });
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
                    return failureResponse(EcomApiErrorCodes.ProductNotFound, 'Product not found');
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
                            quantity,
                        },
                    ],
                });

                if (!result.cart) {
                    throw new Error('Failed to add item to cart');
                }

                return successResponse(result.cart);
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.AddCartItemFailure, getErrorMessage(e));
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
                        thankYouPageUrl: `${window.location.origin}/thank-you`,
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
            } catch (e) {
                return failureResponse(EcomApiErrorCodes.GetAllCategoriesFailure, getErrorMessage(e));
            }
        },
        async getCategoryBySlug(slug) {
            try {
                const category = (await wixClient.collections.getCollectionBySlug(slug)).collection;
                if (!category) {
                    return failureResponse(EcomApiErrorCodes.CategoryNotFound, 'Category not found');
                }

                return successResponse(category);
            } catch (e) {
                if (isEcomSDKError(e) && e.details.applicationError.code === 404) {
                    return failureResponse(EcomApiErrorCodes.CategoryNotFound, 'Category not found');
                }

                return failureResponse(EcomApiErrorCodes.GetCategoryFailure, getErrorMessage(e));
            }
        },
        async getOrder(id) {
            try {
                const order = await wixClient.orders.getOrder(id);
                if (!order) {
                    return failureResponse(EcomApiErrorCodes.OrderNotFound, 'Order not found');
                }

                return successResponse(order);
            } catch (e) {
                if (isEcomSDKError(e) && e.details.applicationError.code === 404) {
                    return failureResponse(EcomApiErrorCodes.OrderNotFound, 'Order not found');
                }
                return failureResponse(EcomApiErrorCodes.GetOrderFailure, getErrorMessage(e));
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

function failureResponse(code: EcomApiErrorCodes, message: string): EcomAPIFailureResponse {
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
