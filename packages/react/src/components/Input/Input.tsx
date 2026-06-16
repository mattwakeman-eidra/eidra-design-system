import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { cn } from '../../utils/cn.js';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size' | 'className'> {
  /** Control size. Defaults to `md`. */
  size?: InputSize;
  /** Content rendered inside the field, before the input (e.g. an icon). */
  startSlot?: ReactNode;
  /** Content rendered inside the field, after the input. */
  endSlot?: ReactNode;
  className?: string;
}

/**
 * A text input built on Base UI `Input`. Use inside `<Field>` for labels, hints, and
 * validation. Reflects `data-invalid` / `data-disabled` state from the field.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', startSlot, endSlot, className, ...props },
  ref,
) {
  if (startSlot == null && endSlot == null) {
    return (
      <BaseInput ref={ref} className={cn(styles.input, className)} data-size={size} {...props} />
    );
  }
  return (
    <span className={cn(styles.group, className)} data-size={size}>
      {startSlot ? <span className={styles.slot}>{startSlot}</span> : null}
      <BaseInput ref={ref} className={styles.input} data-size={size} data-grouped="" {...props} />
      {endSlot ? <span className={styles.slot}>{endSlot}</span> : null}
    </span>
  );
});
