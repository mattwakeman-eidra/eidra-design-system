import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion';
import type {
  AccordionValue,
  AccordionRootChangeEventDetails,
  AccordionRootChangeEventReason,
} from '@base-ui-components/react/accordion';
import { cn } from '../../utils/cn.js';
import styles from './Accordion.module.css';

export type { AccordionValue, AccordionRootChangeEventDetails, AccordionRootChangeEventReason };

// ─── Root ────────────────────────────────────────────────────────────────────

export type AccordionRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Root>,
  'className'
> & {
  className?: string;
};

const Root = forwardRef<HTMLDivElement, AccordionRootProps>(function Root(
  { className, ...props },
  ref,
) {
  return (
    <BaseAccordion.Root ref={ref} className={cn(styles.root, className)} {...props} />
  );
});

// ─── Item ─────────────────────────────────────────────────────────────────────

export type AccordionItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>,
  'className'
> & {
  className?: string;
};

const Item = forwardRef<HTMLDivElement, AccordionItemProps>(function Item(
  { className, ...props },
  ref,
) {
  return (
    <BaseAccordion.Item ref={ref} className={cn(styles.item, className)} {...props} />
  );
});

// ─── Header ──────────────────────────────────────────────────────────────────

export type AccordionHeaderProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Header>,
  'className'
> & {
  className?: string;
};

const Header = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(function Header(
  { className, ...props },
  ref,
) {
  return (
    <BaseAccordion.Header ref={ref} className={cn(styles.header, className)} {...props} />
  );
});

// ─── Trigger ─────────────────────────────────────────────────────────────────

export interface AccordionTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>, 'className'> {
  /** Icon rendered at the trailing edge that rotates when open. Defaults to a chevron SVG. */
  indicator?: ReactNode;
  className?: string;
}

const DefaultIndicator = () => (
  <svg
    className={styles.indicator}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Trigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function Trigger(
  { className, children, indicator, ...props },
  ref,
) {
  return (
    <BaseAccordion.Trigger
      ref={ref as React.Ref<Element>}
      className={cn(styles.trigger, className)}
      {...props}
    >
      <span className={styles.triggerLabel}>{children}</span>
      {indicator !== undefined ? indicator : <DefaultIndicator />}
    </BaseAccordion.Trigger>
  );
});

// ─── Panel ────────────────────────────────────────────────────────────────────

export type AccordionPanelProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>,
  'className'
> & {
  className?: string;
};

const Panel = forwardRef<HTMLDivElement, AccordionPanelProps>(function Panel(
  { className, ...props },
  ref,
) {
  return (
    <BaseAccordion.Panel ref={ref} className={cn(styles.panel, className)} {...props} />
  );
});

// ─── Compound export ──────────────────────────────────────────────────────────

/**
 * A disclosure component for toggling sections of content. Built on Base UI Accordion.
 *
 * @example
 * ```tsx
 * <Accordion.Root>
 *   <Accordion.Item value="services">
 *     <Accordion.Header>
 *       <Accordion.Trigger>Our Services</Accordion.Trigger>
 *     </Accordion.Header>
 *     <Accordion.Panel>
 *       <p>Strategy, design, and delivery.</p>
 *     </Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const Accordion = { Root, Item, Header, Trigger, Panel };
