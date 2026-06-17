import { forwardRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Toggle, ToggleGroup, type ToggleSize } from '../Toggle/Toggle.js';

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
   * and active markers (`data-active`, `aria-current`).
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
  size?: ToggleSize;
  /** Accessible name for the control. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Deprecated — use `ToggleGroup` with `appearance="segmented"`. A contiguous track
 * of mutually-exclusive options with the active segment filled; now a thin wrapper
 * over `ToggleGroup`, kept for backwards compatibility.
 *
 * @deprecated Use `ToggleGroup` with `appearance="segmented"` instead. Migrate to:
 * `<ToggleGroup.Root appearance="segmented" value={[v]} onValueChange={(v) => v[0] && setV(v[0])}>`
 * with `<Toggle value="…">` segments (use a `Toggle`'s `render` prop for link mode).
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { items, value, onValueChange, size = 'md', className, 'aria-label': ariaLabel },
    ref,
  ) {
    const isLinkMode = items.some((it) => it.render);

    return (
      <ToggleGroup.Root
        ref={ref}
        appearance="segmented"
        size={size}
        className={className}
        aria-label={ariaLabel}
        value={[value]}
        // Link mode navigates via the rendered anchors; don't also toggle state.
        onValueChange={
          isLinkMode
            ? () => {}
            : (v) => {
                const next = v[0];
                if (next) onValueChange?.(next);
              }
        }
      >
        {items.map((item) => {
          const active = item.value === value;
          const content = (
            <>
              {item.icon != null && (
                <span aria-hidden="true" style={{ display: 'inline-flex', flex: 'none', alignItems: 'center' }}>
                  {item.icon}
                </span>
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>{item.label}</span>
            </>
          );

          if (item.render) {
            const renderItem = item.render;
            return (
              <Toggle
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                render={(props) =>
                  renderItem({
                    className: (props.className as string) ?? '',
                    children: content,
                    'data-active': active ? '' : undefined,
                    'aria-current': active ? 'page' : undefined,
                  }) as ReactElement
                }
              />
            );
          }

          return (
            <Toggle key={item.value} value={item.value} disabled={item.disabled}>
              {content}
            </Toggle>
          );
        })}
      </ToggleGroup.Root>
    );
  },
);
