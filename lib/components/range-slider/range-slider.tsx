import classNames from 'classnames';
import styles from './range-slider.module.scss';

interface RangeSlider {
    startValue: number;
    endValue: number;
    onStartValueChange: (value: number) => void;
    onEndValueChange: (value: number) => void;
    /**
     * The lowest permitted value.
     */
    minValue: number;
    /**
     * The highest permitted value.
     */
    maxValue: number;
    /**
     * The granularity that the values must adhere to. @default 1
     */
    step?: number | 'any';
    /**
     * Allows to format the displayed start and end values. For example, add a currency symbol,
     * format with the specified number of decimal places, etc.
     */
    formatValue?: (value: number) => string;
    startInputName?: string;
    endInputName?: string;
    className?: string;
}

/**
 * A slider component for selecting a numeric range.
 */
export const RangeSlider = ({
    startValue,
    endValue,
    onStartValueChange,
    onEndValueChange,
    minValue,
    maxValue,
    step,
    formatValue = (value) => value.toString(),
    startInputName,
    endInputName,
    className,
}: RangeSlider) => {
    const handleStartValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStartValue = Number(event.target.value);
        onStartValueChange(Math.min(newStartValue, endValue));
    };

    const handleEndValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEndValue = Number(event.target.value);
        onEndValueChange(Math.max(newEndValue, startValue));
    };

    const handleChangeByClickingOnTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        // Change the start or end value
        // depending on which one is closer to the clicked value on the track.
        const distToStart = Math.abs(value - startValue);
        const distToEnd = Math.abs(value - endValue);
        if (distToStart < distToEnd || (startValue === endValue && value < startValue)) {
            onStartValueChange(value);
        } else {
            onEndValueChange(value);
        }
    };

    const getValuePositionOnTrack = (value: number) => {
        return `${((value - minValue) / (maxValue - minValue)) * 100}%`;
    };

    return (
        <div className={classNames(styles.root, className)}>
            {/* The slider is implemented using three native <input type="range" />
                elements stacked on top of each other.
            */}
            <div className={styles.slidersContainer}>
                {/* Displays the track with the highlighted selected range. The thumb is hidden.
                    Handles a change when a user clicks somewhere on the track.
                */}
                <input
                    type="range"
                    tabIndex={-1}
                    className={classNames(styles.input, styles.trackInput)}
                    style={
                        {
                            '--start': getValuePositionOnTrack(startValue),
                            '--end': getValuePositionOnTrack(endValue),
                        } as React.CSSProperties
                    }
                    step={step}
                    min={minValue}
                    max={maxValue}
                    value={startValue}
                    onChange={handleChangeByClickingOnTrack}
                />

                {/* Displays the slider thumb that controls the start value. The track is hidden */}
                <input
                    type="range"
                    name={startInputName}
                    className={classNames(styles.input, styles.thumbInput)}
                    step={step}
                    min={minValue}
                    max={maxValue}
                    value={startValue}
                    onChange={handleStartValueChange}
                />

                {/* Displays the slider thumb that controls the end value. The track is hidden */}
                <input
                    type="range"
                    name={endInputName}
                    className={classNames(styles.input, styles.thumbInput)}
                    step={step}
                    min={minValue}
                    max={maxValue}
                    value={endValue}
                    onChange={handleEndValueChange}
                />
            </div>

            <div className={styles.values}>
                <span>{formatValue(startValue)}</span>
                <span>{formatValue(endValue)}</span>
            </div>
        </div>
    );
};
