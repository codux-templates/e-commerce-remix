import classNames from 'classnames';
import styles from './select.module.scss';

export interface SelectOption {
    name: string;
    value: string;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    placeholder: string;
    hasError: boolean;
    onChange: (value: string) => void;
}

export const Select = ({ options, value, onChange, placeholder, hasError }: SelectProps) => {
    return (
        <div className={classNames(styles.root, { [styles.error]: hasError })}>
            <select
                className={classNames({ [styles.placeholder]: value === undefined })}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            >
                {value === undefined ? (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                ) : null}

                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
