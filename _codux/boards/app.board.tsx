import { createRemixStub } from '@remix-run/testing';
import { createBoard } from '@wixc3/react-board';
import App, { ErrorBoundary as rootErrorBoundary, loader as rootLoader } from 'app/root';
import HomePage, { loader as homePageLoader } from 'app/routes/_index/route';
import AboutPage from 'app/routes/about/route';
import ProductsCategoryPage, {
    loader as productsCategoryPageLoader,
} from 'app/routes/category.$categorySlug/route';
import ProductDetailsPage, {
    ErrorBoundary as productDetailsErrorBoundary,
    loader as productDetailsPageLoader,
} from 'app/routes/products.$productSlug/route';
import { ROUTES } from '~/router/config';
import { sleep } from './utils';

const AppWrapper = createRemixStub([
    {
        Component: () => {
            return <App />;
        },
        loader: rootLoader,
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
                path: ROUTES.category.path,
                Component: ProductsCategoryPage,
                loader: productsCategoryPageLoader,
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
