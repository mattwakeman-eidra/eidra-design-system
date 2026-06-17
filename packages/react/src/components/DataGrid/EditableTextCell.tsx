import { useEffect, useRef, useState } from 'react';
import styles from './EditableTextCell.module.css';

export interface EditableTextCellProps {
  /** Current displayed value (already resolved — e.g. override ?? base). */
  value: string | null;
  /** Commit a new value. Receives `''` when the field is cleared. */
  onCommit: (next: string) => void;
  /** Format the resting value for display. Defaults to the raw string. */
  format?: (value: string | null) => string;
  /**
   * Debounce interval in ms for committing while typing. `0` (default) commits
   * only on blur/Enter; a positive value (e.g. `800`, as the invoicing comment
   * cell uses) also commits after the user pauses typing. Either way Enter/blur
   * flush immediately and Escape reverts to the last committed value.
   */
  debounceMs?: number;
  /** Placeholder shown in the editing input. */
  placeholder?: string;
  /** Mark the cell as carrying an explicit override (accent left-border + dot marker). */
  overridden?: boolean;
  /** Read-only, value is aggregated from descendants (dashed accent border + ◆ marker). */
  aggregated?: boolean;
  /** Disable editing entirely. */
  disabled?: boolean;
  /** Tooltip shown on the resting cell. */
  title?: string;
}

const EM_DASH = '—';
const formatDefault = (v: string | null) => v ?? '';

/**
 * A click-to-edit free-text cell for use inside `DataGrid` cells — the text
 * sibling of `EditableNumberCell`. Manages its own edit/commit/cancel lifecycle
 * and reflects override / aggregated states via Eidra accent tokens (so they
 * follow the active theme).
 *
 * With `debounceMs > 0` it commits while typing (debounced) as well as on
 * blur/Enter — the shape the invoicing comment cell uses (~800ms). With the
 * default `0` it commits only on blur/Enter. Escape always reverts the draft.
 */
export function EditableTextCell({
  value,
  onCommit,
  format = formatDefault,
  debounceMs = 0,
  placeholder,
  overridden = false,
  aggregated = false,
  disabled = false,
  title,
}: EditableTextCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Clear any pending debounced commit on unmount.
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  function clearTimer() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }

  function start() {
    if (disabled || aggregated) return;
    setDraft(value ?? '');
    setEditing(true);
  }

  function emit(next: string) {
    if (next !== (value ?? '')) onCommit(next);
  }

  function change(next: string) {
    setDraft(next);
    if (debounceMs > 0) {
      clearTimer();
      debounceRef.current = setTimeout(() => {
        clearTimer();
        emit(next);
      }, debounceMs);
    }
  }

  function commit() {
    clearTimer();
    setEditing(false);
    emit(draft);
  }

  function cancel() {
    clearTimer();
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => change(e.target.value)}
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
        {value ? (
          <span className={styles.aggregatedValue}>
            {format(value)}
            <span aria-hidden className={styles.marker}>
              ◆
            </span>
          </span>
        ) : (
          <span className={styles.empty}>{EM_DASH}</span>
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
      {value ? (
        <span className={styles.value}>
          {format(value)}
          {overridden && (
            <span aria-hidden className={styles.marker}>
              ●
            </span>
          )}
        </span>
      ) : (
        <span className={styles.empty}>{placeholder ?? EM_DASH}</span>
      )}
    </button>
  );
}
