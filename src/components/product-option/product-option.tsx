import { products } from '@wix/stores';
import { ColorSelect } from '~/components/color-select/color-select';
import { Select } from '~/components/select/select';
import { getChoiceValue } from './product-option-utils';
import styles from './product-option.module.scss';

export interface ProductOptionProps {
    option: products.ProductOption;
    selectedValue: string | undefined;
    error: string | undefined;
    onChange: (value: string) => void;
}

export const ProductOption = ({ option, selectedValue, error, onChange }: ProductOptionProps) => {
    const { name, optionType, choices } = option;

    if (name === undefined || choices === undefined) {
        return null;
    }

    const selectedChoice = choices.find((c) => getChoiceValue(option, c) === selectedValue);

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
                            name: c.description!,
                            hexValue: c.value!,
                        }))}
                    onChange={onChange}
                    selectedName={selectedValue}
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
