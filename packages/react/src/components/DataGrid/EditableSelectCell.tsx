import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './EditableSelectCell.module.css';

export interface EditableSelectOption {
  value: string;
  label: ReactNode;
}

export interface EditableSelectCellProps {
  /** Current selected value (already resolved — e.g. override ?? base). `null` for unset. */
  value: string | null;
  /** Options for the dropdown. */
  options: EditableSelectOption[];
  /** Commit a new value. Receives `null` when an empty-valued option is chosen. */
  onCommit: (next: string | null) => void;
  /** Format the resting value for display. Defaults to the matching option's label, else the raw value. */
  format?: (value: string | null) => ReactNode;
  /** Mark the cell as carrying an explicit override (accent left-border + dot marker). */
  overridden?: boolean;
  /** Read-only, value is aggregated from descendants (dashed accent border + ◆ marker). */
  aggregated?: boolean;
  /** Disable editing entirely. */
  disabled?: boolean;
  /** Tooltip shown on the resting cell. */
  title?: string;
  /** Placeholder text shown when the value is unset. Defaults to an em dash. */
  placeholder?: ReactNode;
}

const EM_DASH = '—';

/**
 * A click-to-edit select cell for use inside `DataGrid` cells — the categorical
 * sibling of `EditableNumberCell`. Manages its own edit/commit/cancel lifecycle
 * and reflects override / aggregated states via Eidra accent tokens (so they
 * follow the active theme — blue under the finance theme, brand accent otherwise).
 *
 * Uses a native `<select>` rather than the Base UI `Select` primitive: the
 * primitive portals a popup positioner sized for standalone form controls, which
 * is heavier than the tight inline-cell ergonomics here (commit-on-change, no
 * resting trigger chrome) — exactly the trade-off `EditableNumberCell` makes with
 * its bare `<input>`. The native control is styled with tokens to match.
 */
export function EditableSelectCell({
  value,
  options,
  onCommit,
  format,
  overridden = false,
  aggregated = false,
  disabled = false,
  title,
  placeholder = EM_DASH,
}: EditableSelectCellProps) {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [editing]);

  function start() {
    if (disabled || aggregated) return;
    setEditing(true);
  }

  function commit(raw: string) {
    setEditing(false);
    const next = raw === '' ? null : raw;
    if (next !== value) onCommit(next);
  }

  function cancel() {
    setEditing(false);
  }

  const display = (() => {
    if (format) return format(value);
    const match = options.find((o) => o.value === (value ?? ''));
    return match ? match.label : value;
  })();

  if (editing) {
    return (
      <select
        ref={selectRef}
        className={styles.select}
        value={value ?? ''}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel();
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {typeof o.label === 'string' ? o.label : o.value}
          </option>
        ))}
      </select>
    );
  }

  if (aggregated) {
    return (
      <span className={styles.cell} data-aggregated="" title={title}>
        {value != null ? (
          <span className={styles.aggregatedValue}>
            {display}
            <span aria-hidden className={styles.marker}>
              ◆
            </span>
          </span>
        ) : (
          <span className={styles.empty}>{placeholder}</span>
        )}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={styles.cell}
      data-overridden={overridden ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      onClick={start}
      title={title}
    >
      {value != null ? (
        <span className={styles.value}>
          {display}
          {overridden && (
            <span aria-hidden className={styles.marker}>
              ●
            </span>
          )}
        </span>
      ) : (
        <span className={styles.empty}>{placeholder}</span>
      )}
    </button>
  );
}
