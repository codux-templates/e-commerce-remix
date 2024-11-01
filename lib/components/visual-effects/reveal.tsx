import { HTMLMotionProps, motion } from 'framer-motion';
import { FC } from 'react';

export interface RevealProps extends HTMLMotionProps<'div'> {
    /** Animation direction, default: "down". */
    direction?: 'up' | 'right' | 'down' | 'left';
    /** Animation duration in seconds, default: 1.4 */
    duration?: number;
}

/**
 * A visual effect that gradually reveals content from a specified direction.
 * This effect does not impact the layout of the content.
 */
export const Reveal: FC<RevealProps> = ({ direction = 'down', duration = 1.4, ...props }) => (
    <motion.div
        transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
        initial={{
            clipPath: {
                up: 'inset(100% 0 0 0)',
                right: 'inset(0 100% 0 0)',
                down: 'inset(0 0 100% 0)',
                left: 'inset(0 0 0 100%)',
            }[direction],
        }}
        whileInView={{
            clipPath: 'inset(0 0 0 0)',
            // Prevent clipping outline and box-shadow after transition.
            transitionEnd: { clipPath: '' },
        }}
        viewport={{ once: true }}
        {...props}
    />
);
