import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { cn } from '../../utils/cn.js';
import styles from './OTPField.module.css';

// ---- Re-export types from Base UI for external use ----
export type { OTPFieldRootProps } from '@base-ui/react/otp-field';
export type { OTPFieldInputProps } from '@base-ui/react/otp-field';

/** Slot size. Defaults to `md`. */
export type OTPFieldSize = 'sm' | 'md' | 'lg';

// ---- Root ----
export interface OTPFieldRootOwnProps extends Omit<
  ComponentPropsWithoutRef<typeof BaseOTPField.Root>,
  'className'
> {
  /** Slot size. Defaults to `md`. */
  size?: OTPFieldSize;
  className?: string;
}

const Root = forwardRef<HTMLDivElement, OTPFieldRootOwnProps>(function Root(
  { size = 'md', className, children, ...props },
  ref,
) {
  return (
    <BaseOTPField.Root ref={ref} data-size={size} className={cn(styles.root, className)} {...props}>
      {children}
    </BaseOTPField.Root>
  );
});
Root.displayName = 'OTPField.Root';

// ---- Input (one character slot) ----
const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof BaseOTPField.Input>>(
  function Input({ className, ...props }, ref) {
    return <BaseOTPField.Input ref={ref} className={cn(styles.input, className)} {...props} />;
  },
);
Input.displayName = 'OTPField.Input';

// ---- Separator (visual divider between slot groups) ----
const Separator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseOTPField.Separator>
>(function Separator({ className, children, ...props }, ref) {
  return (
    <BaseOTPField.Separator
      ref={ref}
      aria-hidden
      className={cn(styles.separator, className)}
      {...props}
    >
      {children}
    </BaseOTPField.Separator>
  );
});
Separator.displayName = 'OTPField.Separator';

// ---- Compound export ----
/**
 * A one-time-code / PIN input (Base UI `OTPField`): a row of single-character
 * slots for verification, MFA, or recovery codes. Auto-advances on input, accepts
 * pasted codes, and exposes the combined value as a hidden form field.
 *
 * Set `length` on `OTPField.Root` and render one `OTPField.Input` per slot. Use
 * `validationType="alphanumeric"` for codes that mix letters and numbers, `mask`
 * to obscure entered characters, and place it inside a `<Field.Root>` for label
 * and validation wiring.
 *
 * Usage:
 * ```tsx
 * <OTPField.Root length={6}>
 *   {Array.from({ length: 6 }, (_, i) => (
 *     <OTPField.Input key={i} aria-label={`Character ${i + 1} of 6`} />
 *   ))}
 * </OTPField.Root>
 * ```
 */
export const OTPField = {
  Root,
  Input,
  Separator,
};
