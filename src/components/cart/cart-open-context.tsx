import { createContext, useContext, useMemo, useState } from 'react';

const CartOpenContext = createContext<{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const useCartOpen = () => {
    const context = useContext(CartOpenContext);
    if (!context) {
        throw new Error('useCartOpen must be used within a CartOpenContextProvider');
    }
    return context;
};

interface CartOpenContextProviderProps extends React.PropsWithChildren {
    initialIsOpen?: boolean;
}

export function CartOpenContextProvider({
    children,
    initialIsOpen = false,
}: CartOpenContextProviderProps) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    const providerValue = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

    return <CartOpenContext.Provider value={providerValue}>{children}</CartOpenContext.Provider>;
}
