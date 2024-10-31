import { useEffect, useRef, type FC, type HTMLAttributes } from 'react';
import { clamp, lerp, remap } from './common';

export interface BackgroundParallaxProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A number between 0 and 1 that defines the strength of the parallax
     * effect, default: 0.75.
     * - 0: No parallax effect, the background scrolls at the same rate as the
     *   content, similar to `background-attachment: scroll`.
     * - 1: Maximum parallax effect, the background remains fixed relative to
     *   the viewport, similar to `background-attachment: fixed`.
     */
    parallaxStrength?: number;
    backgroundImageUrl?: string;
}

/**
 * A visual effect where the container's background image (set via CSS or inline
 * styles) scrolls at a slower rate than the foreground content, creating a
 * parallax effect. The background image is guaranteed to fully cover the
 * visible area of the container at all times, with no gaps, regardless of the
 * container size, background image dimensions, or viewport size.
 */
export const BackgroundParallax: FC<BackgroundParallaxProps> = ({
    parallaxStrength = 0.75,
    backgroundImageUrl,
    style,
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleLayoutChange = () => {
            const elementRect = element.getBoundingClientRect();
            const backgroundPositionY = calculateBackgroundParallax({
                viewportHeight: window.innerHeight,
                elementTop: elementRect.top,
                elementHeight: elementRect.height,
                parallaxStrength,
            });
            element.style.backgroundPositionY = backgroundPositionY + 'px';
        };

        window.addEventListener('scroll', handleLayoutChange);
        window.addEventListener('resize', handleLayoutChange);
        const resizeObserver = new ResizeObserver(handleLayoutChange);
        resizeObserver.observe(element);

        return () => {
            window.removeEventListener('scroll', handleLayoutChange);
            window.removeEventListener('resize', handleLayoutChange);
            resizeObserver.disconnect();
        };
    }, [parallaxStrength]);

    return (
        <div
            ref={ref}
            style={{
                backgroundAttachment: 'fixed',
                // With `background-attachment: fixed`, the `cover` value for
                // background size is calculated relative to the viewport.
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: 'center',
                backgroundImage: backgroundImageUrl ? `url("${backgroundImageUrl}")` : undefined,
                ...style,
            }}
            {...props}
        />
    );
};

/**
 * Calculates the `background-position-y` of an element to create a parallax
 * effect as the page is scrolled. The function expects the background image to
 * have `background-attachment: fixed` and `background-size: cover`, which
 * ensures the background image has a minimum height of 100vh and is positioned
 * relative to the viewport rather than the element itself.
 *
 * @param viewportHeight - The height of the viewport in pixels.
 * @param elementHeight - The height of the element in pixels.
 * @param elementTop - The distance from the top of the viewport to the top of the element.
 * @param parallaxStrength - A value between 0 and 1, where 0 means no parallax,
 *                           and 1 means full parallax (background fixed to viewport).
 * @return The `y` position of the background in pixels to achieve the parallax effect.
 */
const calculateBackgroundParallax = ({
    viewportHeight,
    elementHeight,
    elementTop,
    parallaxStrength,
}: {
    viewportHeight: number;
    elementHeight: number;
    elementTop: number;
    parallaxStrength: number;
}) => {
    // scrollProgress = 0, when the element is fully below the bottom edge of the viewport.
    // scrollProgress = 1, when the element is fully above the top edge of the viewport.
    const scrollProgress = clamp(0, 1, remap(viewportHeight, -elementHeight, 0, 1, elementTop));

    // If the element's height exceeds the viewport height, the background
    // (which has minimum height of 100vh) cannot scroll along with the element
    // without creating gaps. In this case, we force `parallaxStrength = 1` to
    // keep the background fixed to the viewport.
    if (elementHeight > viewportHeight) parallaxStrength = 1;

    const maxBackgroundY = ((viewportHeight + elementHeight) / 2) * (1 - parallaxStrength);
    return lerp(maxBackgroundY, -maxBackgroundY, scrollProgress);
};
