import { faker } from '@faker-js/faker';
import React, { FC, useMemo, useState } from 'react';
import { SWRConfig } from 'swr';
import type { EcomAPI } from '~/api/ecom-api';
import { EcomAPIContext } from '~/api/ecom-api-context-provider';
import {
    createCart,
    createOrder,
    createCategory,
    createProduct,
    createProducts,
    getCartTotals,
    FakeDataSettings as Settings,
} from './fakers';

export type FakeDataSettings = Settings;

function getEcomApi(settings?: Settings): EcomAPI {
    faker.seed(123);
    const products = createProducts(settings);

    const api: EcomAPI = {
        getProductsByCategory: async () => {
            return Promise.resolve(products);
        },
        getProduct: async (id: string | undefined) => {
            faker.seed(123);
            return Promise.resolve(createProduct(id, settings));
        },
        getPromotedProducts: async () => {
            return Promise.resolve(products.slice(0, 4));
        },
        getCart: () => {
            faker.seed(123);
            const productsInCart =
                settings?.numberOfCartItems === 0
                    ? []
                    : products.slice(0, settings?.numberOfCartItems || 2);
            return Promise.resolve(createCart(productsInCart));
        },
        getCartTotals: () => {
            faker.seed(123);
            return Promise.resolve(getCartTotals());
        },
        addToCart: (id: string, quantity: number) => {
            alert(`Add item ${id} to cart with quantity ${quantity}`);
            return api.getCart();
        },
        updateCartItemQuantity: (id: string | undefined | null, quantity: number) => {
            alert(`Update item ${id} to quantity ${quantity}`);
            return api.getCart();
        },
        removeItemFromCart: (id: string) => {
            alert(`Remove item ${id}`);
            return api.getCart();
        },
        checkout: () => {
            alert('Checkout');
            return Promise.resolve({ success: true, url: '' });
        },
        getAllCategories: () => {
            return Promise.resolve([createCategory(settings)]);
        },
        getCategoryBySlug: () => {
            return Promise.resolve(createCategory(settings));
        },
        getOrder: (id: string) => {
            return Promise.resolve(createOrder(id));
        },
    };

    return api;
}

export const MockEcomAPIContextProvider: FC<{
    children: React.ReactElement;
    settings?: Settings;
}> = ({ children, settings }) => {
    const [cache, setCache] = useState(new Map());
    const api = useMemo(() => {
        setCache(new Map());
        return getEcomApi(settings);
    }, [settings]);

    return (
        <SWRConfig value={{ provider: () => cache }}>
            <EcomAPIContext.Provider value={api}>{children}</EcomAPIContext.Provider>
        </SWRConfig>
    );
};
