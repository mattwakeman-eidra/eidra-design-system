import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { Badge } from '../Badge/Badge.js';
import styles from './ActionBar.module.css';

export type ActionBarAlign = 'start' | 'end' | 'between';
export type ActionBarSticky = boolean | 'top' | 'bottom';

export interface ActionBarProps extends ComponentPropsWithoutRef<'div'> {
  /** When greater than 0, shows a leading "{n} selected" summary. */
  selectedCount?: number;
  /** Optional status message slot (e.g. a validation or info line). */
  message?: ReactNode;
  /** The action buttons. Callers pass their own `Button`s. */
  children: ReactNode;
  /**
   * Pin the bar to an edge of its scroll container with a divider border and
   * raised shadow, layered at `--eidra-z-sticky`. `'bottom'` (or `true`) pins to
   * the bottom with a top border; `'top'` pins to the top with a bottom border.
   * `false` (default) leaves it inline.
   */
  sticky?: ActionBarSticky;
  /** How to distribute the summary/message vs the actions. Defaults to `between`. */
  align?: ActionBarAlign;
}

/**
 * A selection-aware action bar. Shows an optional selection summary and status
 * message on the left and a caller-supplied cluster of action buttons. Can pin
 * to the bottom of the viewport (`sticky`) as a persistent action bar for
 * bulk-selection workflows. Domain logic (what's selectable, which actions
 * apply) lives in the caller; this only lays out and styles.
 */
export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  { selectedCount, message, children, sticky = false, align = 'between', className, ...props },
  ref,
) {
  const hasSelection = selectedCount != null && selectedCount > 0;
  const hasLead = hasSelection || message != null;
  const stickyEdge = sticky === true ? 'bottom' : sticky || undefined;

  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      data-sticky={stickyEdge}
      data-align={align}
      {...props}
    >
      {hasLead && (
        <div className={styles.lead}>
          {hasSelection && (
            <Badge tone="accent" variant="solid">
              {selectedCount} selected
            </Badge>
          )}
          {message != null && <span className={styles.message}>{message}</span>}
        </div>
      )}
      <div className={styles.actions}>{children}</div>
    </div>
  );
});
