import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './PreviewCard.module.css';

// ---- Re-export types from Base UI for external use ----
export type { PreviewCardRootProps } from '@base-ui/react/preview-card';
export type { PreviewCardTriggerProps } from '@base-ui/react/preview-card';
export type { PreviewCardPortalProps } from '@base-ui/react/preview-card';
export type { PreviewCardPositionerProps } from '@base-ui/react/preview-card';
export type { PreviewCardPopupProps } from '@base-ui/react/preview-card';
export type { PreviewCardArrowProps } from '@base-ui/react/preview-card';
export type { PreviewCardBackdropProps } from '@base-ui/react/preview-card';

// ---- Root (no DOM element, pass-through) ----
const Root = BasePreviewCard.Root;

// ---- Trigger ----
const Trigger = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof BasePreviewCard.Trigger>
>(function Trigger({ className, children, ...props }, ref) {
  return (
    <BasePreviewCard.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
      {children}
    </BasePreviewCard.Trigger>
  );
});
Trigger.displayName = 'PreviewCard.Trigger';

// ---- Portal (no DOM element, pass-through) ----
const Portal = BasePreviewCard.Portal;

// ---- Positioner ----
const Positioner = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>
>(function Positioner({ className, children, ...props }, ref) {
  const scope = useScopeDataAttrs();
  return (
    <BasePreviewCard.Positioner
      ref={ref}
      className={cn(styles.positioner, className)}
      {...scope}
      {...props}
    >
      {children}
    </BasePreviewCard.Positioner>
  );
});
Positioner.displayName = 'PreviewCard.Positioner';

// ---- Popup ----
const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>>(
  function Popup({ className, children, ...props }, ref) {
    return (
      <BasePreviewCard.Popup ref={ref} className={cn(styles.popup, className)} {...props}>
        {children}
      </BasePreviewCard.Popup>
    );
  },
);
Popup.displayName = 'PreviewCard.Popup';

// ---- Arrow ----
const Arrow = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BasePreviewCard.Arrow>>(
  function Arrow({ className, ...props }, ref) {
    return <BasePreviewCard.Arrow ref={ref} className={cn(styles.arrow, className)} {...props} />;
  },
);
Arrow.displayName = 'PreviewCard.Arrow';

// ---- Backdrop ----
const Backdrop = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BasePreviewCard.Backdrop>
>(function Backdrop({ className, ...props }, ref) {
  return (
    <BasePreviewCard.Backdrop ref={ref} className={cn(styles.backdrop, className)} {...props} />
  );
});
Backdrop.displayName = 'PreviewCard.Backdrop';

// ---- Compound export ----
/**
 * A hover-triggered popup that shows a rich preview of a linked resource,
 * built on Base UI `PreviewCard`.
 *
 * Usage:
 * ```tsx
 * <PreviewCard.Root>
 *   <PreviewCard.Trigger href="/projects/nordic-refresh">
 *     Nordic Identity Refresh
 *   </PreviewCard.Trigger>
 *   <PreviewCard.Portal>
 *     <PreviewCard.Positioner side="bottom" align="start">
 *       <PreviewCard.Popup>
 *         <img src="…" alt="Project thumbnail" />
 *         <h3>Nordic Identity Refresh</h3>
 *         <p>Brand redesign for a Nordic consultancy.</p>
 *       </PreviewCard.Popup>
 *       <PreviewCard.Arrow />
 *     </PreviewCard.Positioner>
 *   </PreviewCard.Portal>
 * </PreviewCard.Root>
 * ```
 */
export const PreviewCard = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Backdrop,
};
