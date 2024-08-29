import { products } from '@wix/stores';
import styles from './product-option.module.scss';
import { Select } from '../select/select';
import { ColorSelect } from '../color-select/color-select';

export interface ProductOptionProps {
    option: products.ProductOption;
    selectedValue: string | undefined;
    error: string | undefined;
    onChange: (value: string) => void;
}

export const ProductOption = ({
    option: { name, optionType, choices },
    selectedValue,
    error,
    onChange,
}: ProductOptionProps) => {
    if (name === undefined || choices === undefined) {
        return null;
    }

    const selectedChoice = choices.find(
        (c) =>
            (optionType === products.OptionType.color ? c.description : c.value) === selectedValue
    );

    return (
        <div className={styles.root}>
            <div className={styles.title}>
                {name}
                {selectedChoice?.description ? `: ${selectedChoice.description}` : undefined}
            </div>

            {optionType === products.OptionType.color ? (
                <ColorSelect
                    hasError={error !== undefined}
                    options={choices
                        .filter((c) => c.value && c.description)
                        .map((c) => ({
                            colorName: c.description!,
                            color: c.value!,
                        }))}
                    onChange={onChange}
                    value={selectedValue}
                />
            ) : (
                <Select
                    hasError={error !== undefined}
                    options={choices
                        .filter((c) => c.value && c.description)
                        .map((c) => ({
                            name: c.description!,
                            value: c.value!,
                        }))}
                    value={selectedValue}
                    placeholder={`Select ${name}`}
                    onChange={onChange}
                />
            )}
            {error !== undefined && <div className={styles.error}>{error}</div>}
        </div>
    );
};
