import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './EmptyState.module.css';

export type EmptyStateSize = 'sm' | 'md';

export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Optional illustration or icon shown above the title. */
  icon?: ReactNode;
  /** Primary message — what's empty or why. */
  title: ReactNode;
  /** Optional supporting text suggesting a next step. */
  description?: ReactNode;
  /** Optional actions (e.g. a primary `Button`) shown below the text. */
  actions?: ReactNode;
  /** Vertical scale. Defaults to `md`. Use `sm` inside compact containers like a table body. */
  size?: EmptyStateSize;
}

/**
 * A centered placeholder for empty lists, tables, and search results: an
 * optional icon, a title, supporting description, and optional actions. Renders
 * a `<div>` styled from Eidra tokens — drop it into the empty slot of a list or
 * `DataGrid`.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, actions, size = 'md', className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.root, className)} data-size={size} {...props}>
      {icon != null && (
        <div className={styles.icon} aria-hidden>
          {icon}
        </div>
      )}
      <p className={styles.title}>{title}</p>
      {description != null && <p className={styles.description}>{description}</p>}
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
});
