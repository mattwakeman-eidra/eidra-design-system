import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './StatBar.module.css';

/** Colour role for a metric's value. Maps to semantic + finance tokens. */
export type StatBarTone = 'neutral' | 'positive' | 'negative' | 'caution' | 'accent';

export interface StatBarItem {
  /** Short label shown above the value (rendered uppercase). */
  label: ReactNode;
  /** The value — already formatted by the caller (e.g. a currency string). */
  value: ReactNode;
  /** Value colour. Defaults to `neutral`. */
  tone?: StatBarTone;
  /** Secondary caption shown below the value. */
  caption?: ReactNode;
  /**
   * Align this metric (and any after it) to the trailing edge — for a summary
   * metric pushed to the right of the strip.
   */
  align?: 'start' | 'end';
}

export interface StatBarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The metrics, laid out inline left-to-right with dividers between them. */
  items: StatBarItem[];
  /** Value text size. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name for the group. */
  'aria-label'?: string;
}

/**
 * An inline strip of labelled metrics separated by thin dividers — a compact KPI
 * header (e.g. Clients · Actuals YTD · Sold forecast · Year-end). Each metric is a
 * small uppercase label over a mono/tabular value; an item can set `align="end"`
 * to push it and the following metrics to the trailing edge. Values use the
 * monospace numeral face so columns of figures line up. For a single rich metric
 * (delta, progress bar, tone) use `Statistic`; for a row of figures, use this.
 */
export const StatBar = forwardRef<HTMLDivElement, StatBarProps>(function StatBar(
  { items, size = 'md', className, ...props },
  ref,
) {
  return (
    <div ref={ref} role="group" className={cn(styles.root, className)} data-size={size} {...props}>
      {items.map((item, i) => (
        <div
          key={i}
          className={styles.item}
          data-tone={item.tone ?? 'neutral'}
          data-align={item.align ?? undefined}
        >
          <span className={styles.label}>{item.label}</span>
          <span className={styles.value}>{item.value}</span>
          {item.caption != null && <span className={styles.caption}>{item.caption}</span>}
        </div>
      ))}
    </div>
  );
});
