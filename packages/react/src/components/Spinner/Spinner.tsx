import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'accent' | 'neutral' | 'coral' | 'danger' | 'success';

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Visual size of the spinner. Defaults to `md`. */
  size?: SpinnerSize;
  /** Colour tone. Defaults to `accent`. */
  tone?: SpinnerTone;
  /** Accessible label for assistive technology. Defaults to `'Loading…'`. */
  label?: string;
}

/**
 * A loading spinner rendered as an animated bordered circle.
 * Renders a native `<span>` styled from Eidra tokens.
 *
 * Always announces itself to assistive technology via `role="status"` and
 * `aria-label`. Set `label` to provide a context-specific message.
 *
 * @example
 * ```tsx
 * <Spinner size="md" tone="accent" label="Loading results…" />
 * ```
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  {
    size = 'md',
    tone = 'accent',
    label = 'Loading…',
    className,
    ...props
  },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(styles.root, className)}
      data-size={size}
      data-tone={tone}
      {...props}
    />
  );
});
