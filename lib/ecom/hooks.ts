import { useEffect, useState } from 'react';
import useSwr, { Key } from 'swr';
import useSWRMutation from 'swr/mutation';
import { findItemIdInCart } from '~/lib/utils';
import { useEcomAPI } from './api-context';
import { AddToCartOptions } from './types';

export const useCartData = () => {
    const ecomApi = useEcomAPI();
    return useSwr('cart', async () => {
        const response = await ecomApi.getCart();
        if (response.status === 'failure') {
            throw response.error;
        }

        return response.body;
    });
};

export const useCartTotals = () => {
    const ecomApi = useEcomAPI();
    const { data } = useCartData();

    const cartTotals = useSwr('cart-totals', async () => {
        const response = await ecomApi.getCartTotals();
        if (response.status === 'failure') {
            throw response.error;
        }

        return response.body;
    });

    useEffect(() => {
        cartTotals.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return cartTotals;
};

interface AddToCartArgs {
    id: string;
    quantity: number;
    options?: AddToCartOptions;
}

export const useAddToCart = () => {
    const ecomApi = useEcomAPI();
    const { data: cart } = useCartData();
    return useSWRMutation(
        'cart',
        async (_key: Key, { arg }: { arg: AddToCartArgs }) => {
            const itemInCart = cart ? findItemIdInCart(cart, arg.id, arg.options) : undefined;

            if (itemInCart) {
                const updateCartItemQuantityResponse = await ecomApi.updateCartItemQuantity(
                    itemInCart._id,
                    (itemInCart.quantity ?? 0) + arg.quantity,
                );
                if (updateCartItemQuantityResponse.status === 'failure') {
                    throw updateCartItemQuantityResponse.error;
                }
                return updateCartItemQuantityResponse.body;
            }

            const addToCartResponse = await ecomApi.addToCart(arg.id, arg.quantity, arg.options);
            if (addToCartResponse.status === 'failure') {
                throw addToCartResponse.error;
            }
            return addToCartResponse.body;
        },
        {
            revalidate: false,
            populateCache: true,
        },
    );
};

interface UpdateCartItemQuantityArgs {
    id: string;
    quantity: number;
}

export const useUpdateCartItemQuantity = () => {
    const ecomApi = useEcomAPI();
    return useSWRMutation(
        'cart',
        async (_key: Key, { arg }: { arg: UpdateCartItemQuantityArgs }) => {
            const response = await ecomApi.updateCartItemQuantity(arg.id, arg.quantity);
            if (response.status === 'failure') {
                throw response.error;
            }
            return response.body;
        },
        {
            revalidate: false,
            populateCache: true,
        },
    );
};

export const useRemoveItemFromCart = () => {
    const ecomApi = useEcomAPI();
    return useSWRMutation(
        'cart',
        async (_key: Key, { arg }: { arg: string }) => {
            const response = await ecomApi.removeItemFromCart(arg);
            if (response.status === 'failure') {
                throw response.error;
            }
            return response.body;
        },
        {
            revalidate: false,
            populateCache: true,
        },
    );
};

export const useCart = () => {
    const ecomAPI = useEcomAPI();
    const [updatingCartItemIds, setUpdatingCartItems] = useState<string[]>([]);

    const { data: cartData } = useCartData();
    const { data: cartTotals, isValidating: isCartTotalsValidating } = useCartTotals();

    const { trigger: triggerUpdateItemQuantity } = useUpdateCartItemQuantity();
    const { trigger: triggerRemoveItem } = useRemoveItemFromCart();
    const { trigger: triggerAddToCart, isMutating: isAddingToCart } = useAddToCart();

    const updateItemQuantity = ({ id, quantity }: { id: string; quantity: number }) => {
        setUpdatingCartItems((prev) => [...prev, id]);
        triggerUpdateItemQuantity({ id, quantity }).finally(() => {
            setUpdatingCartItems((prev) => prev.filter((itemId) => itemId !== id));
        });
    };

    const removeItem = (id: string) => {
        setUpdatingCartItems((prev) => [...prev, id]);
        triggerRemoveItem(id).finally(() => {
            setUpdatingCartItems((prev) => prev.filter((itemId) => itemId !== id));
        });
    };

    const addToCart = (productId: string, quantity: number, options?: AddToCartOptions) =>
        triggerAddToCart({ id: productId, quantity, options });

    const checkout = async () => {
        const checkoutResponse = await ecomAPI.checkout();

        if (checkoutResponse.status === 'success') {
            window.location.href = checkoutResponse.body.checkoutUrl;
        } else {
            alert('checkout is not configured');
        }
    };

    return {
        cartData,
        cartTotals,
        updatingCartItemIds,

        isAddingToCart,
        isCartTotalsUpdating: updatingCartItemIds.length > 0 || isCartTotalsValidating,

        updateItemQuantity,
        removeItem,
        addToCart,
        checkout,
    };
};
