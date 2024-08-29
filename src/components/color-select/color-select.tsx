import classNames from 'classnames';
import styles from './color-select.module.scss';

export interface ColorSelectOption {
    name: string;
    hexValue: string;
}

export interface ColorSelectProps {
    options: ColorSelectOption[];
    selectedName?: string;
    hasError: boolean;
    onChange: (name: string) => void;
}

export const ColorSelect = ({ options, selectedName, onChange, hasError }: ColorSelectProps) => {
    return (
        <div className={styles.root}>
            {options.map((o) => (
                <button
                    key={o.name}
                    className={classNames(styles.option, {
                        [styles.selected]: selectedName === o.name,
                        [styles.hasError]: hasError,
                    })}
                    onClick={() => onChange(o.name!)}
                >
                    <div
                        className={styles.colorBox}
                        style={{
                            backgroundColor: o.hexValue,
                        }}
                    ></div>
                </button>
            ))}
        </div>
    );
};
