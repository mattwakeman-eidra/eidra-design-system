import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'subtle';
export type ButtonTone = 'accent' | 'neutral' | 'coral' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual style. Defaults to `solid`. */
  variant?: ButtonVariant;
  /** Colour role. Defaults to `accent` (brand orange). */
  tone?: ButtonTone;
  /** Control size. Defaults to `md`. */
  size?: ButtonSize;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Content before the label (e.g. an `<Icon>`). */
  startIcon?: ReactNode;
  /** Content after the label. */
  endIcon?: ReactNode;
  /** Render as a square icon-only button. Provide an `aria-label`. */
  iconOnly?: boolean;
  /** Stretch to the full width of the container. */
  fullWidth?: boolean;
}

/**
 * The primary action control. Renders a native `<button>` styled from Eidra tokens.
 * For links styled as buttons, apply these class names to an `<a>` or compose with your
 * router's link.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'accent',
    size = 'md',
    loading = false,
    startIcon,
    endIcon,
    iconOnly = false,
    fullWidth = false,
    disabled,
    type = 'button',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.root, className)}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      data-full-width={fullWidth || undefined}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {startIcon && !loading ? <span className={styles.icon}>{startIcon}</span> : null}
      {children != null && <span className={styles.label}>{children}</span>}
      {endIcon ? <span className={styles.icon}>{endIcon}</span> : null}
    </button>
  );
});
