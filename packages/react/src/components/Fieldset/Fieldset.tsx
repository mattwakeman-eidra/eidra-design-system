import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cn } from '../../utils/cn.js';
import styles from './Fieldset.module.css';

// ---- Root ----

export interface FieldsetRootProps extends Omit<
  ComponentPropsWithoutRef<typeof BaseFieldset.Root>,
  'className'
> {
  className?: string;
}

const Root = forwardRef<HTMLElement, FieldsetRootProps>(function Root(
  { className, ...props },
  ref,
) {
  return <BaseFieldset.Root ref={ref} className={cn(styles.root, className)} {...props} />;
});

// ---- Legend ----

export interface FieldsetLegendProps extends Omit<
  ComponentPropsWithoutRef<typeof BaseFieldset.Legend>,
  'className'
> {
  className?: string;
}

const Legend = forwardRef<HTMLDivElement, FieldsetLegendProps>(function Legend(
  { className, ...props },
  ref,
) {
  return <BaseFieldset.Legend ref={ref} className={cn(styles.legend, className)} {...props} />;
});

/**
 * A semantic fieldset with an accessible legend. Built on Base UI `Fieldset`.
 *
 * Usage:
 * ```tsx
 * <Fieldset.Root>
 *   <Fieldset.Legend>Contact details</Fieldset.Legend>
 *   <Field label="Name"><Input /></Field>
 *   <Field label="Email"><Input type="email" /></Field>
 * </Fieldset.Root>
 * ```
 */
export const Fieldset = { Root, Legend };
