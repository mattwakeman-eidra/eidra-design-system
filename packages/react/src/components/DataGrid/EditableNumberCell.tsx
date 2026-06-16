import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './EditableNumberCell.module.css';

export interface EditableNumberCellProps {
  /** Current displayed value (already resolved — e.g. override ?? base). */
  value: number | null;
  /** Commit a new value. Receives `null` when the field is cleared. */
  onCommit: (next: number | null) => void;
  /** Format the value for display. Defaults to `String(value)`. */
  format?: (value: number | null) => string;
  /** Mark the cell as carrying an explicit override (accent left-border + dot marker). */
  overridden?: boolean;
  /** Read-only, value is aggregated from descendants (dashed accent border + ◆ marker). */
  aggregated?: boolean;
  /** Disable editing entirely. */
  disabled?: boolean;
  /** Tooltip shown on the resting cell. */
  title?: string;
}

const formatDefault = (v: number | null) => (v == null ? '—' : String(v));

/**
 * A click-to-edit numeric cell for use inside `DataGrid` cells. Manages its own
 * edit/commit/cancel lifecycle and reflects override / aggregated states via
 * Eidra accent tokens (so they follow the active theme — blue under the finance
 * theme, brand accent otherwise). Pair with `SaveIndicator` for save feedback.
 */
export function EditableNumberCell({
  value,
  onCommit,
  format = formatDefault,
  overridden = false,
  aggregated = false,
  disabled = false,
  title,
}: EditableNumberCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function start() {
    if (disabled || aggregated) return;
    setDraft(value == null ? '' : String(value));
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    const next = trimmed === '' ? null : Number(trimmed);
    if (next != null && Number.isNaN(next)) return; // ignore garbage
    if (next !== value) onCommit(next);
  }

  function cancel() {
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        inputMode="decimal"
        className={styles.input}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
      />
    );
  }

  if (aggregated) {
    return (
      <span className={styles.cell} data-aggregated="" title={title}>
        {value != null ? (
          <span className={styles.aggregatedValue}>
            {format(value)}
            <span aria-hidden className={styles.marker}>
              ◆
            </span>
          </span>
        ) : (
          <span className={styles.empty}>—</span>
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
          {format(value)}
          {overridden && (
            <span aria-hidden className={styles.marker}>
              ●
            </span>
          )}
        </span>
      ) : (
        <span className={styles.empty}>—</span>
      )}
    </button>
  );
}
