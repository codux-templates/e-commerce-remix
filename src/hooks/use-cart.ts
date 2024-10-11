import { useCartTotals, useCartData, useUpdateCartItemQuantity, useRemoveItemFromCart } from '~/api/api-hooks';
import { useEcomAPI } from '~/api/ecom-api-context-provider';

export const useCart = () => {
    const ecomAPI = useEcomAPI();
    const { data: cartData } = useCartData();
    const { data: cartTotals } = useCartTotals();
    const { trigger: updateItemQuantity } = useUpdateCartItemQuantity();
    const { trigger: removeItem } = useRemoveItemFromCart();

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
        updateItemQuantity,
        removeItem,
        checkout,
    };
};
