import { collections, products } from '@wix/stores';
import { cart, currentCart, orders } from '@wix/ecom';

export type Product = products.Product;
export type Collection = collections.Collection;
export type CollectionDetails = collections.Collection & collections.CollectionNonNullableFields;
export type Cart = currentCart.Cart & currentCart.CartNonNullableFields;
export type CartItem = cart.LineItem;
export type CartItemDetails = cart.LineItem & cart.CartNonNullableFields['lineItems'][0];
export type CartTotals = currentCart.EstimateTotalsResponse & currentCart.EstimateTotalsResponseNonNullableFields;
export type OrderDetails = orders.Order & orders.OrderNonNullableFields;

export enum EcomApiErrorCodes {
    ProductNotFound = 'ProductNotFound',
    GetProductFailure = 'GetProductFailure',
    GetProductsFailure = 'GetProductsFailure',
    CategoryNotFound = 'CategoryNotFound',
    GetCategoryFailure = 'GetCategoryFailure',
    GetAllCategoriesFailure = 'GetAllCategoriesFailure',
    GetCartFailure = 'GetCartFailure',
    GetCartTotalsFailure = 'GetCartTotalsFailure',
    UpdateCartItemQuantityFailure = 'UpdateCartItemQuantityFailure',
    RemoveCartItemFailure = 'RemoveCartItemFailure',
    AddCartItemFailure = 'AddCartItemFailure',
    CreateCheckoutFailure = 'CreateCheckoutFailure',
    CreateCheckoutRedirectSessionFailure = 'CreateCheckoutRedirectSessionFailure',
    OrderNotFound = 'OrderNotFound',
    GetOrderFailure = 'GetOrderFailure',
}

export type EcomAPIError = { code: EcomApiErrorCodes; message: string };
export type EcomAPISuccessResponse<T> = { status: 'success'; body: T };
export type EcomAPIFailureResponse = { status: 'failure'; error: EcomAPIError };
export type EcomAPIResponse<T> = EcomAPISuccessResponse<T> | EcomAPIFailureResponse;

export type EcomSDKError = {
    message: string;
    details: {
        applicationError: {
            description: string;
            code: number;
        };
    };
};

export function isEcomSDKError(error: unknown): error is EcomSDKError {
    return (
        error instanceof Object &&
        'message' in error &&
        'details' in error &&
        error.details instanceof Object &&
        'applicationError' in error.details &&
        error.details.applicationError instanceof Object
    );
}

export enum ProductFilter {
    minPrice = 'minPrice',
    maxPrice = 'maxPrice',
}

export interface IProductFilters {
    /**
     * Only products with a price greater than or equal to this value will be included.
     */
    [ProductFilter.minPrice]?: number;
    /**
     * Only products with a price less than or equal to this value will be included.
     */
    [ProductFilter.maxPrice]?: number;
}

export enum ProductSortBy {
    newest = 'newest',
    priceAsc = 'priceAsc',
    priceDesc = 'priceDesc',
    nameAsc = 'nameAsc',
    nameDesc = 'nameDesc',
}

interface GetProductsByCategoryOptions {
    skip?: number;
    limit?: number;
    filters?: IProductFilters;
    sortBy?: ProductSortBy;
}

export type AddToCartOptions = { variantId: string } | { options: Record<string, string | undefined> };

export type EcomAPI = {
    getProducts: (limit?: number) => Promise<EcomAPIResponse<Product[]>>;
    getProductsByCategory: (
        categorySlug: string,
        options?: GetProductsByCategoryOptions,
    ) => Promise<EcomAPIResponse<{ items: Product[]; totalCount: number }>>;
    getFeaturedProducts: (
        categorySlug: string,
        count: number,
    ) => Promise<EcomAPIResponse<{ category: Collection; items: Product[] }>>;
    getPromotedProducts: () => Promise<EcomAPIResponse<Product[]>>;
    getProductBySlug: (slug: string) => Promise<EcomAPIResponse<Product>>;
    getCart: () => Promise<EcomAPIResponse<Cart>>;
    getCartTotals: () => Promise<EcomAPIResponse<CartTotals>>;
    updateCartItemQuantity: (id: string | undefined | null, quantity: number) => Promise<EcomAPIResponse<Cart>>;
    removeItemFromCart: (id: string) => Promise<EcomAPIResponse<Cart>>;
    addToCart: (id: string, quantity: number, options?: AddToCartOptions) => Promise<EcomAPIResponse<Cart>>;
    checkout: () => Promise<EcomAPIResponse<{ checkoutUrl: string }>>;
    getAllCategories: () => Promise<EcomAPIResponse<Collection[]>>;
    getCategoryBySlug: (slug: string) => Promise<EcomAPIResponse<CollectionDetails>>;
    getOrder: (id: string) => Promise<EcomAPIResponse<OrderDetails>>;
    /**
     * Returns the lowest and the highest product price in the category.
     */
    getProductPriceBounds: (categorySlug: string) => Promise<EcomAPIResponse<{ lowest: number; highest: number }>>;
};
