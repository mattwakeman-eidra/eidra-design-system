import { useEffect, useRef, useState } from 'react';
import styles from './EditableNumberCell.module.css';

/** Semantic colour for an editable cell's value text + edit field. */
export type EditableNumberCellTone = 'neutral' | 'positive' | 'caution' | 'danger' | 'accent';

export interface EditableNumberCellProps {
  /** Current displayed value (already resolved — e.g. override ?? base). */
  value: number | null;
  /** Commit a new value. Receives `null` when the field is cleared. */
  onCommit: (next: number | null) => void;
  /** Format the value for display. Defaults to `String(value)`. */
  format?: (value: number | null) => string;
  /** Mark the cell as carrying an explicit override (accent left-border + ● marker). Wins over `aggregated`. */
  overridden?: boolean;
  /**
   * Show the "aggregated from descendants" resting affordance (dashed accent
   * border + ◆ marker). Independent of `disabled`: an aggregated cell is still
   * click-to-edit unless `disabled`, and `overridden` replaces the ◆ with ●.
   * Combine with `disabled` for a read-only rollup.
   */
  aggregated?: boolean;
  /** Disable editing entirely (read-only). */
  disabled?: boolean;
  /**
   * Semantic colour for the value text and edit field — theme-aware (e.g.
   * `positive` → success token). The override (●) and aggregated (◆) markers
   * keep their accent colour and compose with `tone`. Defaults to `neutral`.
   */
  tone?: EditableNumberCellTone;
  /** Tooltip shown on the resting cell. */
  title?: string;
}

const formatDefault = (v: number | null) => (v == null ? '—' : String(v));

/**
 * A click-to-edit numeric cell for use inside `DataGrid` cells. Manages its own
 * edit/commit/cancel lifecycle and reflects override / aggregated states via
 * Eidra accent tokens (so they follow the active theme — blue under the finance
 * theme, brand accent otherwise). `tone` colours the value semantically (e.g.
 * probability tiers). Pair with `SaveIndicator` for save feedback.
 */
export function EditableNumberCell({
  value,
  onCommit,
  format = formatDefault,
  overridden = false,
  aggregated = false,
  disabled = false,
  tone = 'neutral',
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
    if (disabled) return;
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

  const toneAttr = tone !== 'neutral' ? tone : undefined;

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        inputMode="decimal"
        className={styles.input}
        data-tone={toneAttr}
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

  // Resting affordance marker: an explicit override (●) wins over the
  // aggregated rollup (◆); both keep their accent colour regardless of `tone`.
  const marker = overridden ? '●' : aggregated ? '◆' : null;

  return (
    <button
      type="button"
      className={styles.cell}
      data-overridden={overridden ? '' : undefined}
      data-aggregated={aggregated && !overridden ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-tone={toneAttr}
      disabled={disabled}
      onClick={start}
      title={title}
    >
      {value != null ? (
        <span className={styles.value}>
          {format(value)}
          {marker && (
            <span aria-hidden className={styles.marker}>
              {marker}
            </span>
          )}
        </span>
      ) : (
        <span className={styles.empty}>—</span>
      )}
    </button>
  );
}
