import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './StatusStrip.module.css';

export type StatusTone = 'positive' | 'caution' | 'negative' | 'neutral';

export interface StatusStripProps extends ComponentPropsWithoutRef<'div'> {
  /** Compose `StatusStrip.Cell`s (e.g. one per month). */
  children: ReactNode;
}

export interface StatusStripCellProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** RAG tone — tints the cell from the finance palette. Defaults to `neutral`. */
  status?: StatusTone;
  /** Small caption above the value (e.g. a month abbreviation). */
  label?: ReactNode;
  /** Native tooltip text. */
  title?: string;
}

/**
 * A horizontal strip of equal-width status cells — a "heat row" for at-a-glance
 * trends (e.g. monthly momentum). Compose `StatusStrip.Cell`s; each is tinted by
 * its RAG `status` using the finance palette. Atomic and layout-agnostic.
 */
const StatusStripRoot = forwardRef<HTMLDivElement, StatusStripProps>(function StatusStrip(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.root, className)} role="list" {...props}>
      {children}
    </div>
  );
});

const StatusStripCell = forwardRef<HTMLDivElement, StatusStripCellProps>(function StatusStripCell(
  { status = 'neutral', label, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.cell, className)} data-status={status} role="listitem" {...props}>
      {label != null && <span className={styles.label}>{label}</span>}
      {children != null && <span className={styles.value}>{children}</span>}
    </div>
  );
});

/**
 * Status strip / heat-row. Use `StatusStrip` with `StatusStrip.Cell` children.
 */
export const StatusStrip = Object.assign(StatusStripRoot, {
  Cell: StatusStripCell,
});
