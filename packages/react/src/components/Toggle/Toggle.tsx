import { forwardRef } from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { cn } from '../../utils/cn.js';
import styles from './Toggle.module.css';

// ─── Toggle (single two-state button) ────────────────────────────────────────

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'solid' | 'outline' | 'ghost';

export interface ToggleProps extends Omit<BaseToggle.Props, 'className'> {
  className?: string;
  /** Visual style. Defaults to `outline`. */
  variant?: ToggleVariant;
  /** Control size. Defaults to `md`. */
  size?: ToggleSize;
}

/**
 * A two-state button (pressed / unpressed) built on Base UI `Toggle`.
 * Use standalone or nest inside `<ToggleGroup.Root>` for mutually-exclusive groups.
 *
 * @example
 * <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
 *   <Icon icon={Bold} />
 * </Toggle>
 *
 * @example
 * // Inside a ToggleGroup for single-select behaviour
 * <ToggleGroup.Root value={[align]} onValueChange={(v) => setAlign(v[0])}>
 *   <Toggle value="left" aria-label="Align left"><Icon icon={AlignLeft} /></Toggle>
 *   <Toggle value="center" aria-label="Align center"><Icon icon={AlignCenter} /></Toggle>
 *   <Toggle value="right" aria-label="Align right"><Icon icon={AlignRight} /></Toggle>
 * </ToggleGroup.Root>
 */
const ToggleRoot = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { variant = 'outline', size = 'md', className, ...props },
  ref,
) {
  return (
    <BaseToggle
      ref={ref}
      className={cn(styles.toggle, className)}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  );
});

// ─── ToggleGroup ──────────────────────────────────────────────────────────────

export interface ToggleGroupRootProps extends Omit<BaseToggleGroup.Props, 'className'> {
  className?: string;
}

/**
 * A container that manages pressed state for a group of `<Toggle>` buttons.
 * Handles keyboard navigation and single- vs. multi-select behaviour.
 *
 * @example
 * // Single-select (default)
 * <ToggleGroup.Root defaultValue={['left']}>
 *   <Toggle value="left" aria-label="Left">L</Toggle>
 *   <Toggle value="center" aria-label="Center">C</Toggle>
 *   <Toggle value="right" aria-label="Right">R</Toggle>
 * </ToggleGroup.Root>
 *
 * @example
 * // Multi-select
 * <ToggleGroup.Root multiple defaultValue={['bold']}>
 *   <Toggle value="bold" aria-label="Bold">B</Toggle>
 *   <Toggle value="italic" aria-label="Italic">I</Toggle>
 * </ToggleGroup.Root>
 */
const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupRootProps>(function ToggleGroupRoot(
  { className, ...props },
  ref,
) {
  return (
    <BaseToggleGroup
      ref={ref}
      className={cn(styles.group, className)}
      {...props}
    />
  );
});

// ─── Compound namespace exports ───────────────────────────────────────────────

/**
 * A two-state button (pressed / unpressed).
 * Use standalone or nest inside `<ToggleGroup.Root>`.
 */
export const Toggle = ToggleRoot;

/**
 * Wraps a set of `<Toggle>` buttons, managing their shared pressed state
 * and keyboard navigation.
 */
export const ToggleGroup = {
  Root: ToggleGroupRoot,
};
