import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './Freshness.module.css';

export type FreshnessTone = 'positive' | 'caution' | 'negative' | 'neutral' | 'info';

export interface FreshnessProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Leading label, e.g. "Data", "Actuals", or "Auto-save on". */
  label?: ReactNode;
  /** The instant the data refers to. Renders compact relative time ("12 min ago"). */
  since?: Date | number | string;
  /**
   * Staleness threshold in milliseconds. Drives automatic tone escalation when
   * `tone` is not set: fresh → `positive`, past `staleAfter` → `caution`, past
   * `4 × staleAfter` → `negative`.
   */
  staleAfter?: number;
  /** Explicit tone. Overrides the `staleAfter` escalation. */
  tone?: FreshnessTone;
  /** Pulse the dot — for a live / auto-save indicator. */
  pulse?: boolean;
  /** "Now" in ms, for deterministic rendering/tests. Defaults to `Date.now()`. */
  now?: number;
}

function formatRelative(deltaMs: number): string {
  const s = Math.max(0, Math.round(deltaMs / 1000));
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

/**
 * A freshness / status indicator: a coloured dot, an optional label, and an
 * optional relative timestamp (e.g. "● Data 12 min ago"). With `staleAfter` the
 * tone escalates as the data ages (positive → caution → negative); set `tone`
 * to drive it directly. `pulse` animates the dot for a live/auto-save signal.
 */
export const Freshness = forwardRef<HTMLSpanElement, FreshnessProps>(function Freshness(
  { label, since, staleAfter, tone, pulse = false, now, className, ...props },
  ref,
) {
  const sinceMs = since != null ? new Date(since).getTime() : undefined;
  const nowMs = now ?? Date.now();
  const age = sinceMs != null ? nowMs - sinceMs : undefined;

  const resolvedTone: FreshnessTone =
    tone ??
    (age != null && staleAfter != null
      ? age <= staleAfter
        ? 'positive'
        : age <= staleAfter * 4
          ? 'caution'
          : 'negative'
      : 'neutral');

  const relative = age != null ? formatRelative(age) : undefined;

  return (
    <span ref={ref} className={cn(styles.root, className)} data-tone={resolvedTone} {...props}>
      <span className={styles.dot} data-pulse={pulse || undefined} aria-hidden="true" />
      {label != null && <span className={styles.label}>{label}</span>}
      {relative != null && (
        <time className={styles.time} dateTime={sinceMs != null ? new Date(sinceMs).toISOString() : undefined}>
          {relative}
        </time>
      )}
    </span>
  );
});
