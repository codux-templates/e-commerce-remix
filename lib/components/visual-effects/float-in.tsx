import { HTMLMotionProps, motion } from 'framer-motion';
import { FC } from 'react';
import { cardinalDirectionVectors } from './common';

export interface FloatInProps extends HTMLMotionProps<'div'> {
    /** Animation direction, default: "up". */
    direction?: 'up' | 'right' | 'down' | 'left';
    /** Animation duration in seconds, default: 1.2 */
    duration?: number;
    /** The distance the element will travel during animation, default: 120px */
    distance?: number;
}

/**
 * A visual effect where the content drifts into place from the specified
 * direction, while transitioning from transparent to fully opaque.
 */
export const FloatIn: FC<FloatInProps> = ({ direction = 'up', duration = 1.2, distance = 120, ...props }) => (
    <motion.div
        transition={{ duration, ease: 'easeInOut' }}
        initial={{
            opacity: 0,
            x: -cardinalDirectionVectors[direction].x * distance,
            y: -cardinalDirectionVectors[direction].y * distance,
        }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        {...props}
    />
);
