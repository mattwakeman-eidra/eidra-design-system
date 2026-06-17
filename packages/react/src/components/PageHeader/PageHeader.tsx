import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './PageHeader.module.css';

export interface PageHeaderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** The page heading. Rendered as the prominent title (an `<h1>`). */
  title: ReactNode;
  /** Optional muted supporting line below the title. */
  subtitle?: ReactNode;
  /** Right-aligned action cluster (e.g. one or more `Button`s). */
  actions?: ReactNode;
  /** Optional slot rendered above the title (e.g. `Breadcrumbs`). */
  breadcrumbs?: ReactNode;
}

/**
 * A generic page title bar: an optional breadcrumb row, a prominent `<h1>` with
 * an optional muted subtitle on the left, and a right-aligned action cluster.
 * Domain-agnostic — callers supply the title, subtitle, and action content.
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { title, subtitle, actions, breadcrumbs, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.root, className)} {...props}>
      {breadcrumbs != null && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
      <div className={styles.bar}>
        <div className={styles.headings}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle != null && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions != null && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
});
