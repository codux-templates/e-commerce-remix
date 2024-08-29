import classNames from 'classnames';
import styles from './color-select.module.scss';

export interface ColorSelectOption {
    colorName: string;
    color: string;
}

export interface ColorSelectProps {
    options: ColorSelectOption[];
    value?: string;
    hasError: boolean;
    onChange: (value: string) => void;
}

export const ColorSelect = ({ options, value, onChange, hasError }: ColorSelectProps) => {
    return (
        <div className={styles.root}>
            {options.map((o) => (
                <button
                    key={o.colorName}
                    className={classNames(styles.option, {
                        [styles.selected]: value === o.colorName,
                        [styles.hasError]: hasError,
                    })}
                    onClick={() => onChange(o.colorName!)}
                >
                    <div
                        className={styles.colorBox}
                        style={{
                            backgroundColor: o.color,
                        }}
                    ></div>
                </button>
            ))}
        </div>
    );
};
