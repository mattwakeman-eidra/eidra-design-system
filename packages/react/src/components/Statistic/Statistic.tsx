import { forwardRef, useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { Progress, type ProgressTone } from '../Progress/Progress.js';
import styles from './Statistic.module.css';

export type StatisticTone = 'neutral' | 'success' | 'danger' | 'warning' | 'accent';
export type StatisticSize = 'sm' | 'md' | 'lg';

export interface StatisticProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'> {
  /** Short label shown above the value (rendered uppercase). */
  label: ReactNode;
  /** The primary value — already formatted by the caller (e.g. a currency string). */
  value: ReactNode;
  /** Tone of the value and delta. Defaults to `neutral`. Callers map domain meaning (e.g. over-budget → `danger`). */
  tone?: StatisticTone;
  /** Value text size. Defaults to `md`. */
  size?: StatisticSize;
  /** Secondary caption shown below the value (e.g. "72% of budget"). */
  caption?: ReactNode;
  /** Trailing delta/status shown beside the value; inherits `tone`. */
  delta?: ReactNode;
  /** Render a progress bar under the value. A percentage, 0–100. Omit for no bar. */
  progress?: number;
  /** Tone of the progress bar. Defaults to `accent`. Independent of `tone` (e.g. neutral value, danger bar). */
  progressTone?: ProgressTone;
}

/**
 * A single labelled metric: an uppercase label, a prominent value, and optional
 * trailing delta, caption, and progress bar. The building block for KPI bars and
 * stat-card grids — compose several with `Separator` (a row) or `Card` (a grid).
 * Threshold logic (e.g. "over 90% → danger") is the caller's; `Statistic` only
 * renders the `tone` it is given.
 */
export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  { label, value, tone = 'neutral', size = 'md', caption, delta, progress, progressTone = 'accent', className, ...props },
  ref,
) {
  const labelId = useId();
  return (
    <div ref={ref} className={cn(styles.root, className)} data-tone={tone} data-size={size} {...props}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {delta != null && <span className={styles.delta}>{delta}</span>}
      </div>
      {progress != null && (
        <Progress.Root
          className={styles.progress}
          value={progress}
          size="sm"
          tone={progressTone}
          aria-labelledby={labelId}
        >
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      )}
      {caption != null && <span className={styles.caption}>{caption}</span>}
    </div>
  );
});
