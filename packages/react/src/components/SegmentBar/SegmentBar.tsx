import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './SegmentBar.module.css';

export interface BarSegment {
  /** The segment's magnitude. Width is this as a proportion of the total. */
  value: number;
  /** Visible label (legend + inline label). */
  label?: ReactNode;
  /**
   * Segment colour — any CSS colour or token reference, e.g.
   * `'var(--eidra-finance-revenue-sold)'`. Defaults cycle the finance revenue palette.
   */
  color?: string;
}

export interface SegmentBarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The segments, rendered left-to-right in order. */
  segments: BarSegment[];
  /** Total to compute proportions against. Defaults to the sum of segment values. */
  total?: number;
  /** Show inline labels (label + %) above the bar. */
  showLabels?: boolean;
  /** Show a legend (swatch + label + %) below the bar. */
  showLegend?: boolean;
  /** Bar thickness. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name. Defaults to a generated summary of the segments. */
  'aria-label'?: string;
}

// Default palette: the finance revenue series, in pipeline order.
const PALETTE = [
  'var(--eidra-finance-revenue-actuals)',
  'var(--eidra-finance-revenue-sold)',
  'var(--eidra-finance-revenue-hi-prob)',
  'var(--eidra-finance-revenue-additional)',
  'var(--eidra-finance-comparison)',
];

const labelText = (seg: BarSegment): string =>
  typeof seg.label === 'string' ? seg.label : '';

/**
 * A thin horizontal bar split into proportional, tinted segments — for showing a
 * composition (e.g. Actuals / Sold / Hi-prob making up a revenue total). Segments
 * size by `value`; colours default to the finance revenue palette. Optional inline
 * labels above and a legend below. Degrades to a single full-width segment. For a
 * single scalar measurement use `Meter` / `Progress` instead.
 */
export const SegmentBar = forwardRef<HTMLDivElement, SegmentBarProps>(function SegmentBar(
  { segments, total, showLabels = false, showLegend = false, size = 'md', className, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const sum = total ?? segments.reduce((acc, s) => acc + s.value, 0);
  const pct = (v: number) => (sum > 0 ? (v / sum) * 100 : 0);
  const fmtPct = (v: number) => `${Math.round(pct(v))}%`;
  const colorOf = (seg: BarSegment, i: number) => seg.color ?? PALETTE[i % PALETTE.length];

  const summary =
    ariaLabel ??
    segments.map((s) => `${labelText(s) || 'Segment'} ${fmtPct(s.value)}`).join(', ');

  return (
    <div ref={ref} className={cn(styles.root, className)} data-size={size} {...props}>
      {showLabels && (
        <div className={styles.labels} aria-hidden="true">
          {segments.map((seg, i) => (
            <div key={i} className={styles.labelCell} style={{ flexGrow: seg.value }}>
              <span className={styles.labelText}>{seg.label}</span>
              <span className={styles.labelPct}>{fmtPct(seg.value)}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.track} role="img" aria-label={summary}>
        {segments.map((seg, i) => (
          <div
            key={i}
            className={styles.segment}
            style={{ flexGrow: seg.value, backgroundColor: colorOf(seg, i) }}
          />
        ))}
      </div>

      {showLegend && (
        <ul className={styles.legend}>
          {segments.map((seg, i) => (
            <li key={i} className={styles.legendItem}>
              <span className={styles.swatch} style={{ backgroundColor: colorOf(seg, i) }} aria-hidden="true" />
              <span className={styles.legendLabel}>{seg.label}</span>
              <span className={styles.legendPct}>{fmtPct(seg.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
