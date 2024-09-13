import { useNavigate, useSearchParams } from '@remix-run/react';
import { ErrorComponent } from '~/components/error-component/error-component';
import { ROUTES } from '~/router/config';

export default function ErrorPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const title = searchParams.get('title') ?? 'Ooops, something went wrong';
    const message = searchParams.get('message') ?? undefined;

    return (
        <ErrorComponent
            title={title}
            message={message}
            actionButtonText="Back to Home Page"
            onActionButtonClick={() => navigate(ROUTES.home.to())}
        />
    );
}
