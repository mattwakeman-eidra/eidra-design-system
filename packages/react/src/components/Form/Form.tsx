import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Form as BaseForm } from '@base-ui-components/react/form';
import { cn } from '../../utils/cn.js';
import styles from './Form.module.css';

export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange';

export type FormErrors = Record<string, string | string[]>;

export interface FormProps<FormValues extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  /**
   * Determines when the form should be validated.
   * The `validationMode` on `<Field>` takes precedence over this.
   *
   * - `onSubmit` (default): validates on submit; afterwards re-validates on change.
   * - `onBlur`: validates a field when it loses focus.
   * - `onChange`: validates on every value change.
   *
   * @default 'onSubmit'
   */
  validationMode?: FormValidationMode;
  /**
   * Validation errors from an external source (e.g. server action).
   * Keys must match the `name` attribute on the corresponding `<Field>`.
   */
  errors?: FormErrors;
  /**
   * Called when the form is submitted. The native `submit` event is
   * `preventDefault()`-ed when this prop is set.
   */
  onFormSubmit?: (
    formValues: FormValues,
    eventDetails: { reason: string },
  ) => void;
}

/**
 * A native `<form>` element with consolidated Base UI validation.
 * Place `<Field>` components inside it; errors propagate automatically.
 *
 * @example
 * <Form onFormSubmit={(values) => console.log(values)}>
 *   <Field name="email" label="Email">
 *     <Input type="email" />
 *   </Field>
 *   <Button type="submit">Send</Button>
 * </Form>
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { validationMode = 'onSubmit', errors, onFormSubmit, className, children, ...props },
  ref,
) {
  return (
    <BaseForm
      ref={ref}
      validationMode={validationMode}
      errors={errors}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFormSubmit={onFormSubmit as any}
      className={cn(styles.root, className)}
      {...props}
    >
      {children}
    </BaseForm>
  );
});
