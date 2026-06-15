import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Shape variant. Defaults to `rect`. */
  variant?: SkeletonVariant;
  /** Explicit width. Falls back to 100% for rect/text, fixed size for circle. */
  width?: string | number;
  /** Explicit height. Falls back to `1em` for text, `var(--eidra-size-control-md)` for rect, and the width for circle. */
  height?: string | number;
  /** Border-radius override. Uses a token name or CSS value. When `variant="circle"` this defaults to `var(--eidra-radius-full)`. */
  radius?: string;
}

function toCssValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * A loading placeholder that renders a pulsing shape while content is being fetched.
 * Respects `prefers-reduced-motion` by disabling the animation when the user
 * has opted out of motion.
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="60%" />
 * <Skeleton variant="circle" width={40} height={40} />
 * <Skeleton variant="rect" width="100%" height={120} />
 * ```
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    variant = 'rect',
    width,
    height,
    radius,
    className,
    style,
    ...props
  },
  ref,
) {
  const cssVars: Record<string, string> = {};
  if (width !== undefined) cssVars['--_width'] = toCssValue(width);
  if (height !== undefined) cssVars['--_height'] = toCssValue(height);
  if (radius !== undefined) cssVars['--_radius'] = radius;

  const inlineStyle = { ...style, ...cssVars } as CSSProperties;

  return (
    <span
      ref={ref}
      role="status"
      aria-label="Loading…"
      aria-busy="true"
      className={cn(styles.root, className)}
      data-variant={variant}
      style={inlineStyle}
      {...props}
    />
  );
});
