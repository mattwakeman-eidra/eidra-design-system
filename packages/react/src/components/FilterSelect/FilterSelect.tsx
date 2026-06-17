import { forwardRef, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { ChevronDown, Search, Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Button } from '../Button/Button.js';
import styles from './FilterSelect.module.css';

export interface FilterSelectOption {
  /** Stable value committed to `value` when selected. */
  value: string;
  /** Visible label. Accepts a node so callers can include an icon or swatch. */
  label: ReactNode;
  /** Plain text used for search matching when `label` is not a string. */
  searchText?: string;
  /** Disable selection of this option. */
  disabled?: boolean;
}

export interface FilterSelectProps {
  /** The selectable options. */
  options: FilterSelectOption[];
  /** Controlled set of selected values. */
  value: string[];
  /** Selection-change callback. */
  onValueChange: (value: string[]) => void;
  /** Trigger text when nothing is selected. */
  placeholder?: string;
  /**
   * Override the trigger summary. Receives the selected values and the full
   * option list. Default: 0 → placeholder, 1 → that option's label, ≥2 →
   * `"{n} {noun}s"` when `noun` is set, otherwise `"{n} selected"`.
   */
  summary?: (selected: string[], options: FilterSelectOption[]) => ReactNode;
  /** Noun for the default ≥2 summary, e.g. `"client"` → `"3 clients"`. */
  noun?: string;
  /**
   * Show the search box. `true`/`false` to force; a number auto-shows it once
   * `options.length` reaches that threshold. Defaults to `8`.
   */
  searchable?: boolean | number;
  /** Placeholder for the search box. */
  searchPlaceholder?: string;
  /** Trigger size. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Disable the whole control. */
  disabled?: boolean;
  /** Accessible name for the trigger (e.g. the filter's field name). */
  'aria-label'?: string;
  className?: string;
}

function optionText(opt: FilterSelectOption): string {
  if (opt.searchText != null) return opt.searchText;
  if (typeof opt.label === 'string') return opt.label;
  return opt.value;
}

/**
 * A compact multi-select filter pill: a trigger that summarises the selection,
 * opening a popover with a searchable checkbox list, a selection count, and a
 * clear-all. Built on Base UI `Popover` and the design system's `Checkbox` (one
 * checkbox per row — no duplicate indicator) and `Button`. Selection is
 * controlled via `value` / `onValueChange`; the popup stays open while toggling.
 */
export const FilterSelect = forwardRef<HTMLButtonElement, FilterSelectProps>(function FilterSelect(
  {
    options,
    value,
    onValueChange,
    placeholder = 'Any',
    summary,
    noun,
    searchable = 8,
    searchPlaceholder = 'Search…',
    size = 'md',
    disabled,
    'aria-label': ariaLabel,
    className,
  },
  ref,
) {
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(() => new Set(value), [value]);
  const optionByValue = useMemo(() => {
    const map = new Map<string, FilterSelectOption>();
    for (const o of options) map.set(o.value, o);
    return map;
  }, [options]);

  const showSearch = typeof searchable === 'number' ? options.length >= searchable : searchable;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => optionText(o).toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (val: string) => {
    onValueChange(selectedSet.has(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  const triggerLabel: ReactNode = (() => {
    if (summary) return summary(value, options);
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const only = value[0]!;
      return optionByValue.get(only)?.label ?? only;
    }
    return noun ? `${value.length} ${noun}s` : `${value.length} selected`;
  })();

  return (
    <BasePopover.Root onOpenChange={(open) => !open && setQuery('')}>
      <BasePopover.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        data-size={size}
        data-active={value.length > 0 || undefined}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <span className={styles.label} data-placeholder={value.length === 0 || undefined}>
          {triggerLabel}
        </span>
        {value.length > 0 && <span className={styles.count}>{value.length}</span>}
        <span className={styles.chevron} aria-hidden="true">
          <Icon icon={ChevronDown} size="sm" />
        </span>
      </BasePopover.Trigger>

      <BasePopover.Portal>
        <BasePopover.Positioner className={styles.positioner} sideOffset={6} align="start">
          <BasePopover.Popup className={styles.popup}>
            {showSearch && (
              <div className={styles.search}>
                <span className={styles.searchIcon} aria-hidden="true">
                  <Icon icon={Search} size="sm" />
                </span>
                <input
                  className={styles.searchInput}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                />
              </div>
            )}

            <div className={styles.list} role="group" aria-label={ariaLabel}>
              {filtered.length === 0 ? (
                <p className={styles.empty}>No matches</p>
              ) : (
                filtered.map((opt) => (
                  <Checkbox.Root
                    key={opt.value}
                    className={styles.option}
                    label={opt.label}
                    checked={selectedSet.has(opt.value)}
                    onCheckedChange={() => toggle(opt.value)}
                    disabled={opt.disabled}
                  />
                ))
              )}
            </div>

            <div className={styles.footer}>
              <span className={styles.footerCount}>{value.length} selected</span>
              <Button
                variant="ghost"
                tone="neutral"
                size="sm"
                disabled={value.length === 0}
                onClick={() => onValueChange([])}
              >
                Clear
              </Button>
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
});
