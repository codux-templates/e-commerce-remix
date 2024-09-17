import { useEffect } from 'react';
import useSwr, { Key } from 'swr';
import useSWRMutation from 'swr/mutation';
import { findItemIdInCart } from './cart-helpers';
import { useEcomAPI } from './ecom-api-context-provider';

export const useCart = () => {
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
    const { data } = useCart();

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

type Args = { id: string; quantity: number };

export const useAddToCart = () => {
    const ecomApi = useEcomAPI();
    const { data: cart } = useCart();
    return useSWRMutation(
        'cart',
        async (_key: Key, { arg }: { arg: Args & { options?: Record<string, string> } }) => {
            const itemInCart = cart ? findItemIdInCart(cart, arg.id, arg.options) : undefined;

            if (itemInCart) {
                const updateCartItemQuantityResponse = await ecomApi.updateCartItemQuantity(
                    itemInCart._id,
                    (itemInCart.quantity ?? 0) + arg.quantity
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
        }
    );
};

export const useUpdateCartItemQuantity = () => {
    const ecomApi = useEcomAPI();
    return useSWRMutation(
        'cart',
        async (_key: Key, { arg }: { arg: Args }) => {
            const response = await ecomApi.updateCartItemQuantity(arg.id, arg.quantity);
            if (response.status === 'failure') {
                throw response.error;
            }
            return response.body;
        },
        {
            revalidate: false,
            populateCache: true,
        }
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
        }
    );
};
