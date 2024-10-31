import { productSortByFromSearchParams, SORT_BY_SEARCH_PARAM, ProductSortBy } from '~/lib/ecom';
import { useSearchParamsOptimistic } from '~/lib/hooks';
import { Select } from '../select/select';
import styles from './product-sorting-select.module.scss';

const sortingOptions: { value: ProductSortBy; label: string }[] = [
    { value: ProductSortBy.newest, label: 'Newest' },
    { value: ProductSortBy.priceAsc, label: 'Price (low to high)' },
    { value: ProductSortBy.priceDesc, label: 'Price (high to low)' },
    { value: ProductSortBy.nameAsc, label: 'Name A-Z' },
    { value: ProductSortBy.nameDesc, label: 'Name Z-A' },
];

export const ProductSortingSelect = () => {
    const [searchParams, setSearchParams] = useSearchParamsOptimistic();

    const sortBy = productSortByFromSearchParams(searchParams);

    const handleChange = (sortBy: string) => {
        setSearchParams(
            (params) => {
                params.set(SORT_BY_SEARCH_PARAM, sortBy);
                return params;
            },
            { preventScrollReset: true },
        );
    };

    return (
        <div className={styles.root}>
            <span className={styles.title}>Sort By:</span>
            <Select
                className={styles.select}
                value={sortBy}
                onChange={handleChange}
                options={sortingOptions.map((option) => ({
                    name: option.label,
                    value: option.value,
                }))}
            />
        </div>
    );
};
