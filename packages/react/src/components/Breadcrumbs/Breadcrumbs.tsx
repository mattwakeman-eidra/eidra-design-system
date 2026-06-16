import { forwardRef, Fragment } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  /** Visible label. Accepts a node so callers can include an icon. */
  label: ReactNode;
  /** Link target. Renders an `<a>`; omit for a non-link crumb. Ignored for the current page. */
  href?: string;
  /**
   * Render a custom link element instead of a plain `<a>` — e.g. a router
   * `Link`. Receives the breadcrumb's `className` and `children`; the caller
   * wires the navigation target. Keeps the design system free of any router
   * dependency. Ignored for the current page.
   */
  render?: (props: { className: string; children: ReactNode }) => ReactNode;
  /** Force this crumb to be the current page. Defaults to the last item. */
  current?: boolean;
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  /** Ordered trail, root first. The last item is the current page unless one sets `current`. */
  items: BreadcrumbItem[];
  /** Separator rendered between crumbs. Defaults to `/`. */
  separator?: ReactNode;
}

/**
 * A breadcrumb trail showing the path to the current page. Renders semantic
 * `<nav aria-label="Breadcrumb">` → `<ol>`; the current page is marked with
 * `aria-current="page"`. Links are plain `<a>` by default; pass an item
 * `render` to use a router link without coupling the design system to a router.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, separator = '/', className, ...props },
  ref,
) {
  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn(styles.root, className)} {...props}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isCurrent = item.current ?? i === items.length - 1;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <li aria-hidden className={styles.separator}>
                  {separator}
                </li>
              )}
              <li className={styles.item}>{renderCrumb(item, isCurrent)}</li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
});

function renderCrumb(item: BreadcrumbItem, isCurrent: boolean): ReactNode {
  if (isCurrent) {
    return (
      <span className={styles.current} aria-current="page">
        {item.label}
      </span>
    );
  }
  if (item.render) {
    return item.render({ className: cn(styles.link), children: item.label });
  }
  if (item.href) {
    return (
      <a className={styles.link} href={item.href}>
        {item.label}
      </a>
    );
  }
  return <span className={styles.crumb}>{item.label}</span>;
}
