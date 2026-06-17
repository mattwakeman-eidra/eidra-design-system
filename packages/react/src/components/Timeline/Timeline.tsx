import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Timeline.module.css';

export type TimelineTone = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export interface TimelineItem {
  /** Stable key for the row. */
  id: string | number;
  /** Primary line — what happened. */
  title: ReactNode;
  /** Optional muted timestamp (already formatted by the caller, e.g. "12 min ago"). Rendered in the mono font. */
  timestamp?: ReactNode;
  /** Optional secondary content shown under the title. */
  description?: ReactNode;
  /** Optional marker content (e.g. an `<Icon>`). Replaces the default dot. */
  icon?: ReactNode;
  /** Marker colour. Defaults to `default`. Callers map domain meaning (e.g. rejected → `danger`). */
  tone?: TimelineTone;
}

export interface TimelineProps extends Omit<ComponentPropsWithoutRef<'ol'>, 'children'> {
  /** The activity items, newest-first or oldest-first — `Timeline` renders them in array order. */
  items: TimelineItem[];
}

/**
 * A vertical activity feed: a connecting rail with a tone-coloured marker per
 * item, a title, an optional muted timestamp, and optional description. The
 * domain-agnostic form of an audit trail — humanising/threshold logic is the
 * caller's; `Timeline` only renders the `tone` and content it is given.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { id: 1, title: 'Invoice approved', timestamp: '2 min ago', tone: 'success' },
 *     { id: 2, title: 'Submitted for review', timestamp: '1h ago', description: 'by Sofia Lind' },
 *   ]}
 * />
 * ```
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, className, ...props },
  ref,
) {
  return (
    <ol ref={ref} className={cn(styles.root, className)} {...props}>
      {items.map((item) => (
        <li key={item.id} className={styles.item} data-tone={item.tone ?? 'default'}>
          <span className={styles.marker} aria-hidden="true">
            {item.icon ?? <span className={styles.dot} />}
          </span>
          <div className={styles.content}>
            <div className={styles.heading}>
              <span className={styles.title}>{item.title}</span>
              {item.timestamp != null && <span className={styles.timestamp}>{item.timestamp}</span>}
            </div>
            {item.description != null && <div className={styles.description}>{item.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
});
