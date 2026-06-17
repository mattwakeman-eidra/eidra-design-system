import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './DescriptionList.module.css';

export type DescriptionListOrientation = 'horizontal' | 'vertical';

export interface DescriptionListEntry {
  /** The metadata label (e.g. "Revenue"). Rendered as a `<dt>`. */
  label: ReactNode;
  /** The metadata value (e.g. "€50K"). Rendered as a `<dd>`. */
  value: ReactNode;
}

export interface DescriptionListProps extends Omit<ComponentPropsWithoutRef<'dl'>, 'children'> {
  /**
   * The label/value pairs. Each renders a `<dt>`/`<dd>`. For non-uniform rows
   * (custom markup, grouped terms) omit `items` and pass `DescriptionList.Term`
   * / `DescriptionList.Details` children instead.
   */
  items?: DescriptionListEntry[];
  /** `horizontal` (default) sets the label beside the value; `vertical` stacks the label above. */
  orientation?: DescriptionListOrientation;
  /** Number of columns to flow the pairs across. Defaults to `1`. Responsive — collapses on narrow widths. */
  columns?: number;
  /** Escape hatch: `DescriptionList.Term` / `DescriptionList.Details` children when `items` is not enough. */
  children?: ReactNode;
}

export interface DescriptionTermProps extends ComponentPropsWithoutRef<'dt'> {}
export interface DescriptionDetailsProps extends ComponentPropsWithoutRef<'dd'> {}

/**
 * A semantic metadata list — real `<dl>`/`<dt>`/`<dd>`. Labels are small,
 * uppercase, and muted; values use the foreground colour. Pass `items` for the
 * common case, or `DescriptionList.Term` / `DescriptionList.Details` children
 * for full control.
 *
 * @example
 * ```tsx
 * <DescriptionList
 *   columns={2}
 *   items={[
 *     { label: 'Revenue', value: '€50K' },
 *     { label: 'Lead', value: 'Sofia Lind' },
 *   ]}
 * />
 * ```
 */
const DescriptionListRoot = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { items, orientation = 'horizontal', columns = 1, className, style, children, ...props },
  ref,
) {
  return (
    <dl
      ref={ref}
      className={cn(styles.root, className)}
      data-orientation={orientation}
      style={{ '--_columns': columns, ...style } as CSSProperties}
      {...props}
    >
      {items?.map((entry, i) => (
        <div key={i} className={styles.row}>
          <DescriptionTerm>{entry.label}</DescriptionTerm>
          <DescriptionDetails>{entry.value}</DescriptionDetails>
        </div>
      ))}
      {children}
    </dl>
  );
});

const DescriptionTerm = forwardRef<HTMLElement, DescriptionTermProps>(function DescriptionTerm(
  { className, ...props },
  ref,
) {
  return <dt ref={ref} className={cn(styles.term, className)} {...props} />;
});

const DescriptionDetails = forwardRef<HTMLElement, DescriptionDetailsProps>(function DescriptionDetails(
  { className, ...props },
  ref,
) {
  return <dd ref={ref} className={cn(styles.details, className)} {...props} />;
});

/**
 * Compound DescriptionList. Use the `items` prop for the common case, or compose
 * `DescriptionList.Term` and `DescriptionList.Details` directly for custom rows.
 */
export const DescriptionList = Object.assign(DescriptionListRoot, {
  Term: DescriptionTerm,
  Details: DescriptionDetails,
});
