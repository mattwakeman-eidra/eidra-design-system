import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './Tooltip.module.css';

// ---- Re-export types from Base UI for external use ----
export type { TooltipProviderProps } from '@base-ui/react/tooltip';
export type { TooltipRootProps } from '@base-ui/react/tooltip';
export type { TooltipTriggerProps } from '@base-ui/react/tooltip';
export type { TooltipPortalProps } from '@base-ui/react/tooltip';
export type { TooltipPositionerProps } from '@base-ui/react/tooltip';
export type { TooltipPopupProps } from '@base-ui/react/tooltip';
export type { TooltipArrowProps } from '@base-ui/react/tooltip';

// ---- Provider (shared delay grouping — no DOM element) ----
const Provider = BaseTooltip.Provider;

// ---- Root (no DOM element, pass-through) ----
const Root = BaseTooltip.Root;

// ---- Trigger ----
const Trigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseTooltip.Trigger>>(
  function Trigger({ className, children, ...props }, ref) {
    return (
      <BaseTooltip.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
        {children}
      </BaseTooltip.Trigger>
    );
  },
);
Trigger.displayName = 'Tooltip.Trigger';

// ---- Portal ----
const Portal = BaseTooltip.Portal;

// ---- Positioner ----
const Positioner = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>
>(function Positioner({ className, ...props }, ref) {
  const scope = useScopeDataAttrs();
  return (
    <BaseTooltip.Positioner
      ref={ref}
      className={cn(styles.positioner, className)}
      {...scope}
      {...props}
    />
  );
});
Positioner.displayName = 'Tooltip.Positioner';

// ---- Popup ----
const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTooltip.Popup>>(
  function Popup({ className, children, ...props }, ref) {
    return (
      <BaseTooltip.Popup ref={ref} className={cn(styles.popup, className)} {...props}>
        {children}
      </BaseTooltip.Popup>
    );
  },
);
Popup.displayName = 'Tooltip.Popup';

// ---- Arrow ----
const Arrow = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTooltip.Arrow>>(
  function Arrow({ className, ...props }, ref) {
    return (
      <BaseTooltip.Arrow ref={ref} className={cn(styles.arrow, className)} {...props} />
    );
  },
);
Arrow.displayName = 'Tooltip.Arrow';

// ---- Compound export ----
/**
 * A tooltip built on Base UI `Tooltip`. Shows a short label anchored to its trigger on
 * hover or focus. For shared delays across multiple tooltips, wrap with `Tooltip.Provider`.
 *
 * Usage:
 * ```tsx
 * <Tooltip.Provider>
 *   <Tooltip.Root>
 *     <Tooltip.Trigger>Hover me</Tooltip.Trigger>
 *     <Tooltip.Portal>
 *       <Tooltip.Positioner side="top">
 *         <Tooltip.Popup>
 *           Save changes
 *           <Tooltip.Arrow />
 *         </Tooltip.Popup>
 *       </Tooltip.Positioner>
 *     </Tooltip.Portal>
 *   </Tooltip.Root>
 * </Tooltip.Provider>
 * ```
 */
export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
};
