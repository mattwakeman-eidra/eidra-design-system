import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../../utils/cn.js';
import styles from './Tabs.module.css';

// ─── Root ──────────────────────────────────────────────────────────────────

export type TabsRootProps = BaseTabsRootProps & {
  className?: string;
};

type BaseTabsRootProps = ComponentPropsWithoutRef<typeof BaseTabs.Root>;

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { className, ...props },
  ref,
) {
  return <BaseTabs.Root ref={ref} className={cn(styles.root, className)} {...props} />;
});

// ─── List ──────────────────────────────────────────────────────────────────

export interface TabsListProps extends ComponentPropsWithoutRef<typeof BaseTabs.List> {
  className?: string;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, ...props },
  ref,
) {
  return <BaseTabs.List ref={ref} className={cn(styles.list, className)} {...props} />;
});

// ─── Tab ───────────────────────────────────────────────────────────────────

export interface TabsTabProps extends ComponentPropsWithoutRef<typeof BaseTabs.Tab> {
  className?: string;
}

const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  { className, ...props },
  ref,
) {
  return (
    <BaseTabs.Tab ref={ref as Ref<HTMLElement>} className={cn(styles.tab, className)} {...props} />
  );
});

// ─── Indicator ─────────────────────────────────────────────────────────────

export interface TabsIndicatorProps extends ComponentPropsWithoutRef<typeof BaseTabs.Indicator> {
  className?: string;
}

const TabsIndicator = forwardRef<HTMLSpanElement, TabsIndicatorProps>(function TabsIndicator(
  { className, ...props },
  ref,
) {
  return <BaseTabs.Indicator ref={ref} className={cn(styles.indicator, className)} {...props} />;
});

// ─── Panel ─────────────────────────────────────────────────────────────────

export interface TabsPanelProps extends ComponentPropsWithoutRef<typeof BaseTabs.Panel> {
  className?: string;
}

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { className, ...props },
  ref,
) {
  return <BaseTabs.Panel ref={ref} className={cn(styles.panel, className)} {...props} />;
});

// ─── Compound namespace export ─────────────────────────────────────────────

/**
 * A tabbed navigation component built on Base UI `Tabs`. Use the compound parts to
 * build horizontal or vertical tab layouts with accessible keyboard navigation and
 * animated indicators.
 *
 * @example
 * ```tsx
 * <Tabs.Root defaultValue={0}>
 *   <Tabs.List>
 *     <Tabs.Tab value={0}>Overview</Tabs.Tab>
 *     <Tabs.Tab value={1}>Details</Tabs.Tab>
 *     <Tabs.Indicator />
 *   </Tabs.List>
 *   <Tabs.Panel value={0}>Overview content</Tabs.Panel>
 *   <Tabs.Panel value={1}>Details content</Tabs.Panel>
 * </Tabs.Root>
 * ```
 */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
};
