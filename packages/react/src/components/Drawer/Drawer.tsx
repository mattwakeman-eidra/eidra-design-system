import { createContext, forwardRef, useContext } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { X } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './Drawer.module.css';

// ---- Re-export types from Base UI for external use ----
export type { DrawerRootProps } from '@base-ui/react/drawer';
export type { DrawerTriggerProps } from '@base-ui/react/drawer';
export type { DrawerPortalProps } from '@base-ui/react/drawer';
export type { DrawerBackdropProps } from '@base-ui/react/drawer';
export type { DrawerViewportProps } from '@base-ui/react/drawer';
export type { DrawerPopupProps } from '@base-ui/react/drawer';
export type { DrawerTitleProps } from '@base-ui/react/drawer';
export type { DrawerDescriptionProps } from '@base-ui/react/drawer';
export type { DrawerCloseProps } from '@base-ui/react/drawer';

/** Edge the drawer slides in from. */
export type DrawerSide = 'right' | 'left' | 'top' | 'bottom';

// Base UI's `swipeDirection` is the *dismiss* gesture; for an edge-anchored
// drawer it always points back toward that edge.
const SIDE_TO_SWIPE = { right: 'right', left: 'left', top: 'up', bottom: 'down' } as const;

// The chosen side flows from Root to the (portaled) Viewport + Popup so they can
// set `data-eidra-side` for positioning without the consumer repeating it.
const DrawerSideContext = createContext<DrawerSide>('right');

// ---- Root (no DOM element, pass-through) ----
export interface DrawerRootOwnProps extends Omit<
  ComponentPropsWithoutRef<typeof BaseDrawer.Root>,
  'swipeDirection'
> {
  /** Edge the drawer slides in from. Defaults to `right`. */
  side?: DrawerSide;
}

function Root({ side = 'right', children, ...props }: DrawerRootOwnProps) {
  return (
    <DrawerSideContext.Provider value={side}>
      <BaseDrawer.Root swipeDirection={SIDE_TO_SWIPE[side]} {...props}>
        {children}
      </BaseDrawer.Root>
    </DrawerSideContext.Provider>
  );
}
Root.displayName = 'Drawer.Root';

// ---- Trigger ----
const Trigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseDrawer.Trigger>>(
  function Trigger({ className, children, ...props }, ref) {
    return (
      <BaseDrawer.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
        {children}
      </BaseDrawer.Trigger>
    );
  },
);
Trigger.displayName = 'Drawer.Trigger';

// ---- Portal ----
const Portal = BaseDrawer.Portal;

// ---- Backdrop ----
const Backdrop = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDrawer.Backdrop>>(
  function Backdrop({ className, ...props }, ref) {
    return <BaseDrawer.Backdrop ref={ref} className={cn(styles.backdrop, className)} {...props} />;
  },
);
Backdrop.displayName = 'Drawer.Backdrop';

// ---- Viewport (positioning container; aligns the popup to its edge) ----
const Viewport = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDrawer.Viewport>>(
  function Viewport({ className, children, ...props }, ref) {
    const side = useContext(DrawerSideContext);
    return (
      <BaseDrawer.Viewport
        ref={ref}
        data-eidra-side={side}
        className={cn(styles.viewport, className)}
        {...props}
      >
        {children}
      </BaseDrawer.Viewport>
    );
  },
);
Viewport.displayName = 'Drawer.Viewport';

// ---- Popup ----
const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDrawer.Popup>>(
  function Popup({ className, children, ...props }, ref) {
    const side = useContext(DrawerSideContext);
    const scope = useScopeDataAttrs();
    return (
      <BaseDrawer.Popup
        ref={ref}
        data-eidra-side={side}
        className={cn(styles.popup, className)}
        {...scope}
        {...props}
      >
        {children}
      </BaseDrawer.Popup>
    );
  },
);
Popup.displayName = 'Drawer.Popup';

// ---- Title ----
const Title = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof BaseDrawer.Title>>(
  function Title({ className, children, ...props }, ref) {
    return (
      <BaseDrawer.Title ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </BaseDrawer.Title>
    );
  },
);
Title.displayName = 'Drawer.Title';

// ---- Description ----
const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseDrawer.Description>
>(function Description({ className, children, ...props }, ref) {
  return (
    <BaseDrawer.Description ref={ref} className={cn(styles.description, className)} {...props}>
      {children}
    </BaseDrawer.Description>
  );
});
Description.displayName = 'Drawer.Description';

// ---- Close (raw close, no icon) ----
const Close = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseDrawer.Close>>(
  function Close({ className, children, ...props }, ref) {
    return (
      <BaseDrawer.Close ref={ref} className={cn(styles.close, className)} {...props}>
        {children}
      </BaseDrawer.Close>
    );
  },
);
Close.displayName = 'Drawer.Close';

// ---- CloseButton (convenience: styled X icon button) ----
export interface DrawerCloseButtonProps extends ComponentPropsWithoutRef<typeof BaseDrawer.Close> {
  /** Accessible label. Defaults to "Close drawer". */
  label?: string;
}

const CloseButton = forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(function CloseButton(
  { className, label = 'Close drawer', ...props },
  ref,
) {
  return (
    <BaseDrawer.Close
      ref={ref}
      aria-label={label}
      className={cn(styles.closeButton, className)}
      {...props}
    >
      <Icon icon={X} size="sm" aria-hidden />
    </BaseDrawer.Close>
  );
});
CloseButton.displayName = 'Drawer.CloseButton';

// ---- Header (layout helper) ----
export interface DrawerHeaderProps extends ComponentPropsWithoutRef<'div'> {}

const Header = forwardRef<HTMLDivElement, DrawerHeaderProps>(function Header(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  );
});
Header.displayName = 'Drawer.Header';

// ---- Body (layout helper; scrolls when content overflows) ----
export interface DrawerBodyProps extends ComponentPropsWithoutRef<'div'> {}

const Body = forwardRef<HTMLDivElement, DrawerBodyProps>(function Body(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  );
});
Body.displayName = 'Drawer.Body';

// ---- Footer (layout helper) ----
export interface DrawerFooterProps extends ComponentPropsWithoutRef<'div'> {}

const Footer = forwardRef<HTMLDivElement, DrawerFooterProps>(function Footer(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  );
});
Footer.displayName = 'Drawer.Footer';

// ---- Compound export ----
/**
 * A panel that slides in from an edge of the screen (Base UI `Drawer`), with
 * swipe-to-dismiss gestures. Use it for navigation, filters, or detail content
 * that should overlay the page without the centred framing of a `Dialog`.
 *
 * Choose the edge with `side` on `Drawer.Root` (`'right'` default, `'left'`,
 * `'top'`, `'bottom'`); the dismiss gesture follows the edge automatically.
 *
 * Usage:
 * ```tsx
 * <Drawer.Root side="right">
 *   <Drawer.Trigger>Open</Drawer.Trigger>
 *   <Drawer.Portal>
 *     <Drawer.Backdrop />
 *     <Drawer.Viewport>
 *       <Drawer.Popup>
 *         <Drawer.Header>
 *           <Drawer.Title>Title</Drawer.Title>
 *           <Drawer.CloseButton />
 *         </Drawer.Header>
 *         <Drawer.Body>
 *           <Drawer.Description>Description</Drawer.Description>
 *         </Drawer.Body>
 *         <Drawer.Footer>…</Drawer.Footer>
 *       </Drawer.Popup>
 *     </Drawer.Viewport>
 *   </Drawer.Portal>
 * </Drawer.Root>
 * ```
 */
export const Drawer = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Viewport,
  Popup,
  Header,
  Body,
  Footer,
  Title,
  Description,
  Close,
  CloseButton,
};
