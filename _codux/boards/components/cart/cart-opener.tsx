import { useCartOpen } from '~/components/cart/cart-open-context';

export const CartOpener = () => {
    const { setIsOpen } = useCartOpen();

    return (
        <button onClick={() => setIsOpen(true)} className="primaryButton">
            Cart
        </button>
    );
};
