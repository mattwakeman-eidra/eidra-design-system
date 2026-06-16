import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '../../utils/cn.js';
import styles from './Field.module.css';

export interface FieldProps {
  /** Field label. Associated automatically with the control. */
  label?: ReactNode;
  /** Helper text shown below the control when there is no error. */
  hint?: ReactNode;
  /** Error message. When set, the field renders as invalid and shows this text. */
  error?: ReactNode;
  /** Mark the field as required (adds an asterisk to the label). */
  required?: boolean;
  /** Disable the field and its control. */
  disabled?: boolean;
  /** Field name, forwarded to the control for form submission. */
  name?: string;
  className?: string;
  /** The form control — typically an `<Input>`, `<Select>`, etc. */
  children: ReactNode;
}

/**
 * A labelled form field built on Base UI `Field`. Wires up label, description, and
 * error association/ARIA for whatever control you place inside it.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, hint, error, required, disabled, name, className, children },
  ref,
) {
  const invalid = error != null && error !== false;
  return (
    <BaseField.Root
      ref={ref}
      name={name}
      disabled={disabled}
      invalid={invalid || undefined}
      className={cn(styles.root, className)}
    >
      {label != null && (
        <BaseField.Label className={styles.label}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          ) : null}
        </BaseField.Label>
      )}
      {children}
      {hint != null && !invalid ? (
        <BaseField.Description className={styles.hint}>{hint}</BaseField.Description>
      ) : null}
      {invalid ? (
        <BaseField.Error match className={styles.error}>
          {error}
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
});

// Re-export the Base UI parts for advanced composition.
export const FieldPrimitive = BaseField;
