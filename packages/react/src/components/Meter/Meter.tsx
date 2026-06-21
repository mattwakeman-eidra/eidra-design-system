import { forwardRef } from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cn } from '../../utils/cn.js';
import styles from './Meter.module.css';

// ── Root ─────────────────────────────────────────────────────────────────────

export type MeterSize = 'sm' | 'md' | 'lg';
export type MeterTone = 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface MeterRootProps extends BaseMeter.Root.Props {
  /** Visual size of the track. Defaults to `md`. */
  size?: MeterSize;
  /** Colour tone. Defaults to `accent`. */
  tone?: MeterTone;
}

const Root = forwardRef<HTMLDivElement, MeterRootProps>(function Root(
  { size = 'md', tone = 'accent', className, children, ...props },
  ref,
) {
  return (
    <BaseMeter.Root
      ref={ref}
      className={cn(styles.root, className)}
      data-size={size}
      data-tone={tone}
      {...props}
    >
      {children}
    </BaseMeter.Root>
  );
});

// ── Label ─────────────────────────────────────────────────────────────────────

export interface MeterLabelProps extends BaseMeter.Label.Props {}

const Label = forwardRef<HTMLSpanElement, MeterLabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <BaseMeter.Label ref={ref} className={cn(styles.label, className)} {...props} />;
});

// ── Value ─────────────────────────────────────────────────────────────────────

export interface MeterValueProps extends BaseMeter.Value.Props {}

const Value = forwardRef<HTMLSpanElement, MeterValueProps>(function Value(
  { className, ...props },
  ref,
) {
  return <BaseMeter.Value ref={ref} className={cn(styles.value, className)} {...props} />;
});

// ── Track ─────────────────────────────────────────────────────────────────────

export interface MeterTrackProps extends BaseMeter.Track.Props {}

const Track = forwardRef<HTMLDivElement, MeterTrackProps>(function Track(
  { className, ...props },
  ref,
) {
  return <BaseMeter.Track ref={ref} className={cn(styles.track, className)} {...props} />;
});

// ── Indicator ────────────────────────────────────────────────────────────────

export interface MeterIndicatorProps extends BaseMeter.Indicator.Props {}

const Indicator = forwardRef<HTMLDivElement, MeterIndicatorProps>(function Indicator(
  { className, ...props },
  ref,
) {
  return <BaseMeter.Indicator ref={ref} className={cn(styles.indicator, className)} {...props} />;
});

// ── Compound namespace export ─────────────────────────────────────────────────

/**
 * A meter component built on Base UI `Meter`. Displays a scalar measurement
 * within a known range — e.g. storage usage, budget consumption, or a KPI.
 *
 * @example
 * ```tsx
 * <Meter.Root value={72}>
 *   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 *     <Meter.Label>Storage used</Meter.Label>
 *     <Meter.Value />
 *   </div>
 *   <Meter.Track>
 *     <Meter.Indicator />
 *   </Meter.Track>
 * </Meter.Root>
 * ```
 */
export const Meter = { Root, Label, Value, Track, Indicator };
