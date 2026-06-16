import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cn } from '../../utils/cn.js';
import styles from './Radio.module.css';

// ─── Radio.Root ───────────────────────────────────────────────────────────────

export interface RadioRootProps
  extends Omit<BaseRadio.Root.Props, 'className'> {
  className?: string;
  /** Label rendered alongside the radio button. */
  label?: ReactNode;
}

const RadioRoot = forwardRef<HTMLElement, RadioRootProps>(
  function RadioRoot({ className, label, children, ...props }, ref) {
    return (
      <label className={cn(styles.wrapper, className)}>
        <BaseRadio.Root ref={ref} className={styles.root} {...props}>
          <BaseRadio.Indicator className={styles.indicator} keepMounted>
            {/* Filled circle rendered with inline SVG */}
            <svg
              className={styles.dot}
              viewBox="0 0 8 8"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
          </BaseRadio.Indicator>
        </BaseRadio.Root>
        {label != null && <span className={styles.label}>{label}</span>}
        {children}
      </label>
    );
  },
);

// ─── Radio.Indicator ──────────────────────────────────────────────────────────

export interface RadioIndicatorProps
  extends Omit<BaseRadio.Indicator.Props, 'className'> {
  className?: string;
}

const RadioIndicator = forwardRef<HTMLSpanElement, RadioIndicatorProps>(
  function RadioIndicator({ className, ...props }, ref) {
    return (
      <BaseRadio.Indicator
        ref={ref}
        className={cn(styles.indicator, className)}
        {...props}
      />
    );
  },
);

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioGroupProps
  extends Omit<BaseRadioGroup.Props, 'className'> {
  className?: string;
  /** Legend text for the group. */
  legend?: ReactNode;
}

const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroupRoot({ className, legend, children, ...props }, ref) {
    return (
      <BaseRadioGroup
        ref={ref}
        className={cn(styles.group, className)}
        {...props}
      >
        {legend != null && (
          <span className={styles.groupLegend}>{legend}</span>
        )}
        {children}
      </BaseRadioGroup>
    );
  },
);

// ─── Compound namespace exports ───────────────────────────────────────────────

/**
 * A radio button control built on Base UI `Radio`.
 * Use `<Radio.Root>` for a composed radio with optional label.
 * Wrap multiple `<Radio.Root>` items in `<RadioGroup>` to link them.
 *
 * @example
 * <RadioGroup legend="Preferred contact" name="contact" defaultValue="email">
 *   <Radio.Root label="Email" value="email" />
 *   <Radio.Root label="Phone" value="phone" />
 *   <Radio.Root label="Post" value="post" />
 * </RadioGroup>
 */
export const Radio = {
  Root: RadioRoot,
  Indicator: RadioIndicator,
};

export const RadioGroup = RadioGroupRoot;
