import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Icon, ChevronLeft, ChevronRight } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import styles from './PeriodNavigator.module.css';

export interface PeriodNavigatorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** The current label shown in the centre (e.g. a formatted period). */
  value: ReactNode;
  /** Step to the previous value. */
  onPrev: () => void;
  /** Step to the next value. */
  onNext: () => void;
  /** Disable the previous control (e.g. at the start of the range). */
  prevDisabled?: boolean;
  /** Disable the next control (e.g. at the end of the range). */
  nextDisabled?: boolean;
  /** Accessible label for the previous control. Defaults to `"Previous"`. */
  prevLabel?: string;
  /** Accessible label for the next control. Defaults to `"Next"`. */
  nextLabel?: string;
}

/**
 * A compact prev/next stepper for navigating a discrete value — `‹ [value] ›`.
 * Domain-agnostic: the caller owns the value and the label and decides what each
 * step means (a month, a quarter, a page of results …). The control only emits
 * `onPrev` / `onNext` and renders the current `value` between two chevron buttons.
 */
export const PeriodNavigator = forwardRef<HTMLDivElement, PeriodNavigatorProps>(
  function PeriodNavigator(
    {
      value,
      onPrev,
      onNext,
      prevDisabled = false,
      nextDisabled = false,
      prevLabel = 'Previous',
      nextLabel = 'Next',
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div ref={ref} className={cn(styles.root, className)} {...props}>
        <button
          type="button"
          className={styles.button}
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label={prevLabel}
        >
          <Icon icon={ChevronLeft} size="sm" />
        </button>
        <span className={styles.value}>{value}</span>
        <button
          type="button"
          className={styles.button}
          onClick={onNext}
          disabled={nextDisabled}
          aria-label={nextLabel}
        >
          <Icon icon={ChevronRight} size="sm" />
        </button>
      </div>
    );
  },
);
