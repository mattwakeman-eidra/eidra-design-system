import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Minus, Plus, Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import styles from './NumberField.module.css';

export type NumberFieldSize = 'sm' | 'md' | 'lg';

// ── Root ────────────────────────────────────────────────────────────────────

export interface NumberFieldRootProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.Root> {
  /** Control size. Defaults to `md`. */
  size?: NumberFieldSize;
  className?: string;
}

const Root = forwardRef<HTMLDivElement, NumberFieldRootProps>(function Root(
  { size = 'md', className, ...props },
  ref,
) {
  return (
    <BaseNumberField.Root
      ref={ref}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    />
  );
});

// ── Group ────────────────────────────────────────────────────────────────────

export interface NumberFieldGroupProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.Group> {
  className?: string;
}

const Group = forwardRef<HTMLDivElement, NumberFieldGroupProps>(function Group(
  { className, ...props },
  ref,
) {
  return (
    <BaseNumberField.Group
      ref={ref}
      className={cn(styles.group, className)}
      {...props}
    />
  );
});

// ── Input ────────────────────────────────────────────────────────────────────

export interface NumberFieldInputProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.Input> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, NumberFieldInputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <BaseNumberField.Input
      ref={ref}
      className={cn(styles.input, className)}
      {...props}
    />
  );
});

// ── Increment ────────────────────────────────────────────────────────────────

export interface NumberFieldIncrementProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.Increment> {
  className?: string;
}

const Increment = forwardRef<HTMLButtonElement, NumberFieldIncrementProps>(function Increment(
  { className, children, ...props },
  ref,
) {
  return (
    <BaseNumberField.Increment
      ref={ref}
      className={cn(styles.stepper, className)}
      aria-label="Increment"
      {...props}
    >
      {children ?? <Icon icon={Plus} size="sm" />}
    </BaseNumberField.Increment>
  );
});

// ── Decrement ────────────────────────────────────────────────────────────────

export interface NumberFieldDecrementProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.Decrement> {
  className?: string;
}

const Decrement = forwardRef<HTMLButtonElement, NumberFieldDecrementProps>(function Decrement(
  { className, children, ...props },
  ref,
) {
  return (
    <BaseNumberField.Decrement
      ref={ref}
      className={cn(styles.stepper, className)}
      aria-label="Decrement"
      {...props}
    >
      {children ?? <Icon icon={Minus} size="sm" />}
    </BaseNumberField.Decrement>
  );
});

// ── ScrubArea ────────────────────────────────────────────────────────────────

export interface NumberFieldScrubAreaProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.ScrubArea> {
  className?: string;
}

const ScrubArea = forwardRef<HTMLSpanElement, NumberFieldScrubAreaProps>(function ScrubArea(
  { className, ...props },
  ref,
) {
  return (
    <BaseNumberField.ScrubArea
      ref={ref}
      className={cn(styles.scrubArea, className)}
      {...props}
    />
  );
});

// ── ScrubAreaCursor ──────────────────────────────────────────────────────────

export interface NumberFieldScrubAreaCursorProps
  extends ComponentPropsWithoutRef<typeof BaseNumberField.ScrubAreaCursor> {
  className?: string;
}

const ScrubAreaCursor = forwardRef<HTMLSpanElement, NumberFieldScrubAreaCursorProps>(
  function ScrubAreaCursor({ className, ...props }, ref) {
    return (
      <BaseNumberField.ScrubAreaCursor
        ref={ref}
        className={cn(styles.scrubAreaCursor, className)}
        {...props}
      />
    );
  },
);

// ── Compound export ──────────────────────────────────────────────────────────

export const NumberField = {
  Root,
  Group,
  Input,
  Increment,
  Decrement,
  ScrubArea,
  ScrubAreaCursor,
};
