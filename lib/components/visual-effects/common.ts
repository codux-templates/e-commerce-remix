/**
 * Unit vectors corresponding to four cardinal directions, in screen coordinates.
 */
export const cardinalDirectionVectors = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
} as const;

/**
 * Linearly interpolates between two numbers `a` and `b`, based on the
 * interpolation factor `t`.
 * - When `t = 0` returns `a`.
 * - When `t = 1` return `b`.
 * - When `t = 0.5` returns the midpoint of `a` and `b`.
 */
export const lerp = (a: number, b: number, t: number): number => (1 - t) * a + t * b;

/**
 * Restricts the value `x` to a range defined by `min` and `max`.
 */
export const clamp = (min: number, max: number, x: number): number => {
    if (x < min) return min;
    if (x > max) return max;
    return x;
};

/**
 * Remaps a number `x` from one range to another.
 *
 * @param inputStart - The start value of the input range.
 * @param inputEnd - The end value of the input range.
 * @param outputStart - The start value of the output range.
 * @param outputEnd - The end value of the output range.
 * @param x - The value to remap from the input range to the output range.
 */
export const remap = (
    inputStart: number,
    inputEnd: number,
    outputStart: number,
    outputEnd: number,
    x: number,
): number => ((x - inputStart) / (inputEnd - inputStart)) * (outputEnd - outputStart) + outputStart;
