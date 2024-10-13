import React from 'react';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    return { params };
};

export const getStaticRoutes = async () => {
    // another example of a really simple use of this function
    const products = [0, 1, 2, 3, 4];
    return products.map((product) => `/another/${product}`);
};

const Anotherexampleparam = () => {
    const { params } = useLoaderData<typeof loader>();
    return (
        <div>
            <div>param: {params['param']}</div>
        </div>
    );
};

export default Anotherexampleparam;
