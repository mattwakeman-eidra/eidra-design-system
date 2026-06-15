import { forwardRef } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
import { cn } from '../../utils/cn.js';
import styles from './Collapsible.module.css';

// ─── Root ────────────────────────────────────────────────────────────────────

export type CollapsibleRootProps = BaseCollapsible.Root.Props & {
  className?: string;
};

const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleRootProps>(
  function CollapsibleRoot({ className, ...props }, ref) {
    return (
      <BaseCollapsible.Root
        ref={ref}
        className={cn(styles.root, className)}
        {...props}
      />
    );
  },
);

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type CollapsibleTriggerProps = BaseCollapsible.Trigger.Props & {
  className?: string;
};

const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, children, ...props }, ref) {
    return (
      <BaseCollapsible.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        {...props}
      >
        {children}
        <span className={styles.triggerIcon} aria-hidden="true" />
      </BaseCollapsible.Trigger>
    );
  },
);

// ─── Panel ────────────────────────────────────────────────────────────────────

export type CollapsiblePanelProps = BaseCollapsible.Panel.Props & {
  className?: string;
};

const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  function CollapsiblePanel({ className, ...props }, ref) {
    return (
      <BaseCollapsible.Panel
        ref={ref}
        className={cn(styles.panel, className)}
        {...props}
      />
    );
  },
);

// ─── Namespace export ─────────────────────────────────────────────────────────

/**
 * A vertically collapsible content region built on Base UI Collapsible.
 * Compose with `Collapsible.Root`, `Collapsible.Trigger`, and `Collapsible.Panel`.
 *
 * @example
 * ```tsx
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Team members</Collapsible.Trigger>
 *   <Collapsible.Panel>
 *     <p>Panel content here…</p>
 *   </Collapsible.Panel>
 * </Collapsible.Root>
 * ```
 */
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
