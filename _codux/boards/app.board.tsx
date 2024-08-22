import { createRemixStub } from '@remix-run/testing';
import { createBoard } from '@wixc3/react-board';
import App, { ErrorBoundary as rootErrorBoundary } from 'app/root';
import HomePage, { loader as homePageLoader } from 'app/routes/_index/route';
import AboutPage from 'app/routes/about/route';
import ProductsPage, { loader as productsPageLoader } from 'app/routes/products/route';
import ProductDetailsPage, {
    ErrorBoundary as productDetailsErrorBoundary,
    loader as productDetailsPageLoader,
} from 'app/routes/products_.$productId/route';
import { ROUTES } from '~/router/config';
import { sleep } from './utils';

const AppWrapper = createRemixStub([
    {
        Component: () => {
            return <App />;
        },
        ErrorBoundary: rootErrorBoundary,
        children: [
            {
                path: ROUTES.home.path,
                Component: HomePage,
                loader: homePageLoader,
            },
            {
                path: ROUTES.about.path,
                Component: AboutPage,
            },
            {
                path: ROUTES.products.path,
                Component: ProductsPage,
                loader: productsPageLoader,
            },
            {
                path: ROUTES.product.path,
                Component: ProductDetailsPage,
                loader: productDetailsPageLoader,
                ErrorBoundary: productDetailsErrorBoundary,
            },
        ],
    },
]);

export default createBoard({
    name: 'App',
    Board: () => <AppWrapper />,
    readyToSnapshot: () => sleep(3000),
});
