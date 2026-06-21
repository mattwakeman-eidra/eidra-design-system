import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { cn } from '../../utils/cn.js';
import styles from './Checkbox.module.css';

// ─── Checkbox.Root ────────────────────────────────────────────────────────────

export interface CheckboxRootProps extends Omit<BaseCheckbox.Root.Props, 'className'> {
  className?: string;
  /** Label rendered alongside the checkbox. */
  label?: ReactNode;
}

const CheckboxRoot = forwardRef<HTMLElement, CheckboxRootProps>(function CheckboxRoot(
  { className, label, children, ...props },
  ref,
) {
  return (
    <label className={cn(styles.wrapper, className)}>
      <BaseCheckbox.Root ref={ref} className={styles.root} {...props}>
        <BaseCheckbox.Indicator className={styles.indicator} keepMounted>
          {/* Checkmark icon rendered with SVG to avoid icon dependency */}
          <svg className={styles.check} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Indeterminate icon */}
          <svg className={styles.indeterminate} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label != null && <span className={styles.label}>{label}</span>}
      {children}
    </label>
  );
});

// ─── Checkbox.Indicator ───────────────────────────────────────────────────────

export interface CheckboxIndicatorProps extends Omit<BaseCheckbox.Indicator.Props, 'className'> {
  className?: string;
}

const CheckboxIndicator = forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
  function CheckboxIndicator({ className, ...props }, ref) {
    return (
      <BaseCheckbox.Indicator ref={ref} className={cn(styles.indicator, className)} {...props} />
    );
  },
);

// ─── CheckboxGroup ────────────────────────────────────────────────────────────

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className'> {
  className?: string;
  /** Legend text for the group. */
  legend?: ReactNode;
}

const CheckboxGroupRoot = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroupRoot(
  { className, legend, children, ...props },
  ref,
) {
  return (
    <BaseCheckboxGroup ref={ref} className={cn(styles.group, className)} {...props}>
      {legend != null && <span className={styles.groupLegend}>{legend}</span>}
      {children}
    </BaseCheckboxGroup>
  );
});

// ─── Compound namespace exports ───────────────────────────────────────────────

/**
 * A checkbox control built on Base UI `Checkbox`.
 * Use `<Checkbox.Root>` for a composed checkbox with optional label,
 * or compose `<Checkbox.Root>` + `<Checkbox.Indicator>` manually.
 *
 * @example
 * <Checkbox.Root label="I agree to the terms" name="terms" />
 *
 * @example
 * // Inside a CheckboxGroup
 * <CheckboxGroup legend="Select services">
 *   <Checkbox.Root label="Strategy" value="strategy" />
 *   <Checkbox.Root label="Design" value="design" />
 * </CheckboxGroup>
 */
export const Checkbox = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};

export const CheckboxGroup = CheckboxGroupRoot;
