import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './SaveIndicator.module.css';

export interface SaveIndicatorProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Set `true` when a save just completed; the indicator appears, then fades out. */
  saved: boolean;
  /** Milliseconds the indicator stays visible before fading. Defaults to `2000`. */
  duration?: number;
  /** Visible text beside the checkmark. Omit for an icon-only indicator (still announced as "Saved"). */
  label?: ReactNode;
}

/**
 * A transient inline confirmation that fades in after a successful save and out
 * again — standardised across inline-edit interactions (pairs with `DataGrid`
 * cell editing). Renders an `aria-live` status region so the save is announced
 * to assistive tech. Drive it with `useSaveIndicator`.
 */
export const SaveIndicator = forwardRef<HTMLSpanElement, SaveIndicatorProps>(function SaveIndicator(
  { saved, duration = 2000, label, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!saved) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [saved, duration]);

  return (
    <span
      ref={ref}
      className={cn(styles.root, className)}
      role="status"
      aria-live="polite"
      data-visible={visible ? '' : undefined}
      {...props}
    >
      {visible && (
        <>
          <svg
            className={styles.check}
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          {label != null ? (
            <span className={styles.label}>{label}</span>
          ) : (
            <span className={styles.srOnly}>Saved</span>
          )}
        </>
      )}
    </span>
  );
});

/**
 * Manages `SaveIndicator` state. Returns `[saved, markSaved]`; call `markSaved()`
 * after a successful save. Re-triggers the indicator even on consecutive saves.
 *
 * @example
 * const [saved, markSaved] = useSaveIndicator();
 * await save(); markSaved();
 * <SaveIndicator saved={saved} />
 */
export function useSaveIndicator(): [boolean, () => void] {
  const [saved, setSaved] = useState(false);

  const markSaved = useCallback(() => {
    setSaved(false);
    // Re-arm on the next frame so back-to-back saves replay the indicator.
    requestAnimationFrame(() => setSaved(true));
  }, []);

  return [saved, markSaved];
}
