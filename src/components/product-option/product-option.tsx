import { products } from '@wix/stores';
import classNames from 'classnames';
import styles from './product-option.module.scss';
import { Select } from '../select/select';

export interface ProductOptionProps {
    option: products.ProductOption;
    selectedValue: string | undefined;
    onChange: (value: string) => void;
}

export const ProductOption = ({
    option: { name, optionType, choices },
    selectedValue,
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
                <div className={styles.colorChoicesContainer}>
                    {choices.map((c) =>
                        c.value && c.description ? (
                            <button
                                key={c.value}
                                className={classNames(styles.colorChoice, {
                                    [styles.selected]: selectedValue === c.description,
                                })}
                                onClick={() => onChange(c.description!)}
                            >
                                <div
                                    className={styles.value}
                                    style={{
                                        backgroundColor: c.value,
                                    }}
                                ></div>
                            </button>
                        ) : undefined
                    )}
                </div>
            ) : (
                <Select
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
        </div>
    );
};
