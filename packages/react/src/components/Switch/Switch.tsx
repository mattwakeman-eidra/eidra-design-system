import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn } from '../../utils/cn.js';
import styles from './Switch.module.css';

// ─── Switch.Root ──────────────────────────────────────────────────────────────

export interface SwitchRootProps extends Omit<BaseSwitch.Root.Props, 'className'> {
  className?: string;
  /** Label rendered alongside the switch. */
  label?: ReactNode;
  /** Position of the label relative to the switch track. Defaults to `end`. */
  labelPosition?: 'start' | 'end';
}

const SwitchRoot = forwardRef<HTMLElement, SwitchRootProps>(
  function SwitchRoot({ className, label, labelPosition = 'end', children, ...props }, ref) {
    const track = (
      <BaseSwitch.Root ref={ref} className={cn(styles.root, className)} {...props}>
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
    );

    if (label == null && children == null) {
      return track;
    }

    return (
      <label className={cn(styles.wrapper, props.disabled ? styles.wrapperDisabled : undefined)}>
        {labelPosition === 'start' && (
          <span className={styles.label}>{label ?? children}</span>
        )}
        {track}
        {labelPosition === 'end' && (
          <span className={styles.label}>{label ?? children}</span>
        )}
      </label>
    );
  },
);

// ─── Switch.Thumb ─────────────────────────────────────────────────────────────

export interface SwitchThumbProps extends Omit<BaseSwitch.Thumb.Props, 'className'> {
  className?: string;
}

const SwitchThumb = forwardRef<HTMLSpanElement, SwitchThumbProps>(
  function SwitchThumb({ className, ...props }, ref) {
    return (
      <BaseSwitch.Thumb
        ref={ref}
        className={cn(styles.thumb, className)}
        {...props}
      />
    );
  },
);

// ─── Compound namespace export ────────────────────────────────────────────────

/**
 * A toggle switch built on Base UI `Switch`.
 * Use `<Switch.Root>` for a composed switch with an optional label,
 * or compose `<Switch.Root>` + `<Switch.Thumb>` manually for advanced layouts.
 *
 * @example
 * <Switch.Root label="Enable notifications" name="notifications" />
 *
 * @example
 * // Controlled
 * <Switch.Root
 *   checked={enabled}
 *   onCheckedChange={(checked) => setEnabled(checked)}
 *   label="Auto-sync"
 * />
 *
 * @example
 * // Inside a Field for accessible label/hint/error
 * <Field label="Dark mode">
 *   <Switch.Root name="darkMode" />
 * </Field>
 */
export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
