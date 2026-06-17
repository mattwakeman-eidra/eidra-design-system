import { forwardRef, Fragment, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlItem {
  /** Stable value for this segment; matched against the control's `value`. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Disable this segment. */
  disabled?: boolean;
  /**
   * Render a custom element instead of a `<button>` — e.g. a router `Link` that
   * preserves the query string. Receives the segment's `className`, `children`,
   * and active markers (`data-active`, `aria-current`). Keeps the design system
   * free of any router dependency (mirrors `Breadcrumbs`). When any item sets
   * `render`, the control is treated as navigation rather than a radio group.
   */
  render?: (props: {
    className: string;
    children: ReactNode;
    'data-active'?: string;
    'aria-current'?: 'page';
  }) => ReactNode;
}

export interface SegmentedControlProps {
  /** The segments, left to right. */
  items: SegmentedControlItem[];
  /** The active segment's value. */
  value: string;
  /** Selection-change callback (button mode). */
  onValueChange?: (value: string) => void;
  /** Control size. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name for the control. */
  'aria-label'?: string;
  className?: string;
}

/**
 * A segmented control: a contiguous track of mutually-exclusive options with the
 * active segment filled. In the default button mode it's a `radiogroup` with
 * arrow-key roving focus. Pass an item `render` to delegate segments to router
 * links (a view switcher) without coupling the design system to a router. For
 * multi-select or independent on/off buttons, use `ToggleGroup` instead.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { items, value, onValueChange, size = 'md', className, 'aria-label': ariaLabel },
    ref,
  ) {
    const isLinkMode = items.some((it) => it.render);
    const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const moveFocus = (fromIdx: number, dir: 1 | -1) => {
      const n = items.length;
      let i = fromIdx;
      for (let step = 0; step < n; step++) {
        i = (i + dir + n) % n;
        if (!items[i]?.disabled) break;
      }
      const btn = btnRefs.current[i];
      if (btn && items[i]) {
        btn.focus();
        onValueChange?.(items[i]!.value);
      }
    };

    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          moveFocus(idx, 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          moveFocus(idx, -1);
          break;
        case 'Home':
          e.preventDefault();
          moveFocus(-1, 1);
          break;
        case 'End':
          e.preventDefault();
          moveFocus(0, -1);
          break;
      }
    };

    return (
      <div
        ref={ref}
        role={isLinkMode ? 'group' : 'radiogroup'}
        aria-label={ariaLabel}
        className={cn(styles.root, className)}
        data-size={size}
      >
        {items.map((item, idx) => {
          const active = item.value === value;
          const content = (
            <>
              {item.icon != null && (
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className={styles.label}>{item.label}</span>
            </>
          );

          if (item.render) {
            return (
              <Fragment key={item.value}>
                {item.render({
                  className: cn(styles.segment),
                  'data-active': active ? '' : undefined,
                  'aria-current': active ? 'page' : undefined,
                  children: content,
                })}
              </Fragment>
            );
          }

          return (
            <button
              key={item.value}
              ref={(el) => {
                btnRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              className={styles.segment}
              data-active={active || undefined}
              disabled={item.disabled}
              tabIndex={active ? 0 : -1}
              onClick={() => onValueChange?.(item.value)}
              onKeyDown={(e) => onKeyDown(e, idx)}
            >
              {content}
            </button>
          );
        })}
      </div>
    );
  },
);
