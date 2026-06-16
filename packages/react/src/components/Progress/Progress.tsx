import { forwardRef } from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '../../utils/cn.js';
import styles from './Progress.module.css';

// ── Root ──────────────────────────────────────────────────────────────────────

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface ProgressRootProps extends BaseProgress.Root.Props {
  /** Visual size of the track. Defaults to `md`. */
  size?: ProgressSize;
  /** Colour tone. Defaults to `accent`. */
  tone?: ProgressTone;
}

const Root = forwardRef<HTMLDivElement, ProgressRootProps>(function Root(
  { size = 'md', tone = 'accent', className, children, ...props },
  ref,
) {
  return (
    <BaseProgress.Root
      ref={ref}
      className={cn(styles.root, className)}
      data-size={size}
      data-tone={tone}
      {...props}
    >
      {children}
    </BaseProgress.Root>
  );
});

// ── Label ─────────────────────────────────────────────────────────────────────

export interface ProgressLabelProps extends BaseProgress.Label.Props {}

const Label = forwardRef<HTMLSpanElement, ProgressLabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <BaseProgress.Label
      ref={ref}
      className={cn(styles.label, className)}
      {...props}
    />
  );
});

// ── Value ─────────────────────────────────────────────────────────────────────

export interface ProgressValueProps extends BaseProgress.Value.Props {}

const Value = forwardRef<HTMLSpanElement, ProgressValueProps>(function Value(
  { className, ...props },
  ref,
) {
  return (
    <BaseProgress.Value
      ref={ref}
      className={cn(styles.value, className)}
      {...props}
    />
  );
});

// ── Track ─────────────────────────────────────────────────────────────────────

export interface ProgressTrackProps extends BaseProgress.Track.Props {}

const Track = forwardRef<HTMLDivElement, ProgressTrackProps>(function Track(
  { className, ...props },
  ref,
) {
  return (
    <BaseProgress.Track
      ref={ref}
      className={cn(styles.track, className)}
      {...props}
    />
  );
});

// ── Indicator ────────────────────────────────────────────────────────────────

export interface ProgressIndicatorProps extends BaseProgress.Indicator.Props {}

const Indicator = forwardRef<HTMLDivElement, ProgressIndicatorProps>(function Indicator(
  { className, ...props },
  ref,
) {
  return (
    <BaseProgress.Indicator
      ref={ref}
      className={cn(styles.indicator, className)}
      {...props}
    />
  );
});

// ── Compound namespace export ─────────────────────────────────────────────────

/**
 * A progress bar built on Base UI `Progress`. Shows the completion status of a
 * task — either as a determinate value (0–100) or indeterminate while status is
 * unknown.
 *
 * @example
 * ```tsx
 * <Progress.Root value={60}>
 *   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 *     <Progress.Label>Uploading files</Progress.Label>
 *     <Progress.Value />
 *   </div>
 *   <Progress.Track>
 *     <Progress.Indicator />
 *   </Progress.Track>
 * </Progress.Root>
 * ```
 *
 * For indeterminate state, pass `value={null}`:
 * ```tsx
 * <Progress.Root value={null}>
 *   <Progress.Label>Loading…</Progress.Label>
 *   <Progress.Track>
 *     <Progress.Indicator />
 *   </Progress.Track>
 * </Progress.Root>
 * ```
 */
export const Progress = { Root, Label, Value, Track, Indicator };
