import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { DEMO_STORE_META_SITE_ID, searchEndpoint } from '~/api/constants';
import type { SearchResponse } from './endpoint-types';
import styles from './search.module.scss';

const metaSiteId = import.meta.env.ms_id ?? DEMO_STORE_META_SITE_ID;

export const loader = async ({ request }: LoaderFunctionArgs) => {
    if (typeof metaSiteId !== 'string') {
        throw new Error('Missing metaSiteId');
    }
    const url = new URL(request.url);
    const text = url.searchParams.get('text') ?? '';
    const response = await fetch(`${searchEndpoint}?msId=${metaSiteId}&text=${encodeURIComponent(text)}`);
    if (!response.ok || response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const { results } = (await response.json()) as SearchResponse;

    return json({ text, results });
};

export default function SearchPage() {
    const { text, results } = useLoaderData<typeof loader>();

    return (
        <div className={styles.content}>
            Searching &quot;{text}&quot;:
            {!results.length && <p>No results found</p>}
            {!!results.length && (
                <ul className={styles.searchResults}>
                    {results.map(({ url, img, description, title, type }, index) => (
                        <li className={styles.searchItem} key={index}>
                            <a href={url}>
                                {img && (
                                    <img width={30} height={30} src={img} alt={title} className={styles.itemImage} />
                                )}
                                {type === 'site_pages' && 'Page: '}
                                <h2 style={{ display: 'inline-block' }}>{title}</h2>
                                {type !== 'site_pages' && <p>{description}</p>}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
