import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'coral' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeVariant = 'solid' | 'subtle' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** Colour role. Defaults to `neutral`. */
  tone?: BadgeTone;
  /** Visual style. Defaults to `subtle`. */
  variant?: BadgeVariant;
  /** Badge size. Defaults to `md`. */
  size?: BadgeSize;
}

/**
 * Small status label. Renders a native `<span>` styled from Eidra tokens.
 * Use to convey status, category, or metadata at a glance.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'subtle', size = 'md', className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.root, className)}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </span>
  );
});
