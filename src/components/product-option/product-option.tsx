import { products } from '@wix/stores';
import { ColorSelect } from '~/components/color-select/color-select';
import { Select } from '~/components/select/select';
import styles from './product-option.module.scss';
import { getChoiceValue } from '~/utils';

export interface ProductOptionProps {
    option: products.ProductOption;
    selectedChoice: products.Choice | undefined;
    error: string | undefined;
    onChange: (value: products.Choice) => void;
}

export const ProductOption = ({ option, selectedChoice, error, onChange }: ProductOptionProps) => {
    const { name, optionType, choices } = option;

    if (name === undefined || choices === undefined) {
        return null;
    }

    const handleChange = (value: string) => {
        if (!optionType) {
            return;
        }

        const newSelectedChoice = choices.find((c) => getChoiceValue(optionType, c) === value);
        if (newSelectedChoice) {
            onChange(newSelectedChoice);
        }
    };

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
                        .filter((c) => c.value && c.description && c.visible)
                        .map((c) => ({
                            name: c.description!,
                            hexValue: c.value!,
                            inStock: !!c.inStock,
                        }))}
                    onChange={handleChange}
                    selectedName={selectedChoice?.description}
                />
            ) : (
                <Select
                    hasError={error !== undefined}
                    options={choices
                        .filter((c) => c.value && c.description && c.visible)
                        .map((c) => ({
                            name: c.inStock ? c.description! : `${c.description!} (Out of stock)`,
                            value: c.value!,
                        }))}
                    value={selectedChoice?.value}
                    placeholder={`Select ${name}`}
                    onChange={handleChange}
                />
            )}
            {error !== undefined && <div className={styles.error}>{error}</div>}
        </div>
    );
};
