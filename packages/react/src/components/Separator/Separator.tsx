import { forwardRef } from 'react';
import { Separator as BaseSeparator } from '@base-ui-components/react/separator';
import { cn } from '../../utils/cn.js';
import styles from './Separator.module.css';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps {
  /** The orientation of the separator. @default 'horizontal' */
  orientation?: SeparatorOrientation;
  /**
   * Optional label rendered inside the separator line.
   * When provided the separator renders as a decorative divider with centred text.
   */
  label?: React.ReactNode;
  className?: string;
}

/**
 * A visual and accessible separator. Wraps Base UI `Separator` which supplies
 * `role="separator"` and `aria-orientation` automatically.
 *
 * Supports horizontal (full-width rule) and vertical (inline rule) orientations,
 * plus an optional centred text label for horizontal dividers.
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', label, className, ...props },
  ref,
) {
  if (label != null && orientation === 'horizontal') {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(styles.labelled, className)}
        {...props}
      >
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.labelText}>{label}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    );
  }

  return (
    <BaseSeparator
      ref={ref}
      orientation={orientation}
      className={cn(styles.root, className)}
      data-orientation={orientation}
      {...props}
    />
  );
});
