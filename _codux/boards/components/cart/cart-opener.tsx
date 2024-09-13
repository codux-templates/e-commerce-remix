import { useCartOpen } from '~/components/cart/cart-open-context';
import commonStyles from '~/styles/common-styles.module.scss';

export const CartOpener = () => {
    const { setIsOpen } = useCartOpen();

    return (
        <button onClick={() => setIsOpen(true)} className={commonStyles.primaryButton}>
            Cart
        </button>
    );
};
