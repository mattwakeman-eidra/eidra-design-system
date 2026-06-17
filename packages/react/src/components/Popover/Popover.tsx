import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  FC,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { X } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './Popover.module.css';
import type {
  PopoverTriggerProps,
  PopoverPositionerProps,
  PopoverPopupProps,
  PopoverArrowProps,
  PopoverBackdropProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverCloseProps,
  PopoverRootProps,
  PopoverPortalProps,
} from '@base-ui/react/popover';

// ---- Re-export types from Base UI for external use ----
export type { PopoverRootProps } from '@base-ui/react/popover';
export type { PopoverTriggerProps } from '@base-ui/react/popover';
export type { PopoverPortalProps } from '@base-ui/react/popover';
export type { PopoverPositionerProps } from '@base-ui/react/popover';
export type { PopoverPopupProps } from '@base-ui/react/popover';
export type { PopoverArrowProps } from '@base-ui/react/popover';
export type { PopoverBackdropProps } from '@base-ui/react/popover';
export type { PopoverTitleProps } from '@base-ui/react/popover';
export type { PopoverDescriptionProps } from '@base-ui/react/popover';
export type { PopoverCloseProps } from '@base-ui/react/popover';

// ---- Root (no DOM element, pass-through) ----
function Root(props: PopoverRootProps) {
  return <BasePopover.Root {...props} />;
}

// ---- Trigger ----
const Trigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function Trigger({ className, children, ...props }, ref) {
    return (
      <BasePopover.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
        {children}
      </BasePopover.Trigger>
    );
  },
);
Trigger.displayName = 'Popover.Trigger';

// ---- Portal ----
function Portal(props: PopoverPortalProps) {
  return <BasePopover.Portal {...props} />;
}

// ---- Positioner ----
const Positioner = forwardRef<
  HTMLDivElement,
  PopoverPositionerProps
>(function Positioner({ className, children, ...props }, ref) {
  const scope = useScopeDataAttrs();
  return (
    <BasePopover.Positioner
      ref={ref}
      className={cn(styles.positioner, className)}
      {...scope}
      {...props}
    >
      {children}
    </BasePopover.Positioner>
  );
});
Positioner.displayName = 'Popover.Positioner';

// ---- Popup ----
const Popup = forwardRef<HTMLDivElement, PopoverPopupProps>(
  function Popup({ className, children, ...props }, ref) {
    return (
      <BasePopover.Popup ref={ref} className={cn(styles.popup, className)} {...props}>
        {children}
      </BasePopover.Popup>
    );
  },
);
Popup.displayName = 'Popover.Popup';

// ---- Arrow ----
const Arrow = forwardRef<HTMLDivElement, PopoverArrowProps>(
  function Arrow({ className, ...props }, ref) {
    return (
      <BasePopover.Arrow ref={ref} className={cn(styles.arrow, className)} {...props} />
    );
  },
);
Arrow.displayName = 'Popover.Arrow';

// ---- Backdrop ----
const Backdrop = forwardRef<HTMLDivElement, PopoverBackdropProps>(
  function Backdrop({ className, ...props }, ref) {
    return (
      <BasePopover.Backdrop ref={ref} className={cn(styles.backdrop, className)} {...props} />
    );
  },
);
Backdrop.displayName = 'Popover.Backdrop';

// ---- Title ----
const Title = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  function Title({ className, children, ...props }, ref) {
    return (
      <BasePopover.Title ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </BasePopover.Title>
    );
  },
);
Title.displayName = 'Popover.Title';

// ---- Description ----
const Description = forwardRef<
  HTMLParagraphElement,
  PopoverDescriptionProps
>(function Description({ className, children, ...props }, ref) {
  return (
    <BasePopover.Description ref={ref} className={cn(styles.description, className)} {...props}>
      {children}
    </BasePopover.Description>
  );
});
Description.displayName = 'Popover.Description';

// ---- Close ----
const Close = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function Close({ className, children, ...props }, ref) {
    return (
      <BasePopover.Close ref={ref} className={cn(styles.close, className)} {...props}>
        {children}
      </BasePopover.Close>
    );
  },
);
Close.displayName = 'Popover.Close';

// ---- CloseButton (convenience: styled X icon button) ----
export interface PopoverCloseButtonProps
  extends PopoverCloseProps {
  /** Accessible label. Defaults to "Close popover". */
  label?: string;
}

const CloseButton = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(function CloseButton(
  { className, label = 'Close popover', ...props },
  ref,
) {
  return (
    <BasePopover.Close
      ref={ref}
      aria-label={label}
      className={cn(styles.closeButton, className)}
      {...props}
    >
      <Icon icon={X} size="sm" aria-hidden />
    </BasePopover.Close>
  );
});
CloseButton.displayName = 'Popover.CloseButton';

// ---- Header (layout helper) ----
export interface PopoverHeaderProps extends ComponentPropsWithoutRef<'div'> {}

const Header = forwardRef<HTMLDivElement, PopoverHeaderProps>(function Header(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  );
});
Header.displayName = 'Popover.Header';

// ---- Body (layout helper) ----
export interface PopoverBodyProps extends ComponentPropsWithoutRef<'div'> {}

const Body = forwardRef<HTMLDivElement, PopoverBodyProps>(function Body(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  );
});
Body.displayName = 'Popover.Body';

// ---- Footer (layout helper) ----
export interface PopoverFooterProps extends ComponentPropsWithoutRef<'div'> {}

const Footer = forwardRef<HTMLDivElement, PopoverFooterProps>(function Footer(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  );
});
Footer.displayName = 'Popover.Footer';

// ---- Compound export ----
/**
 * A non-modal popover built on Base UI `Popover`. Anchor-positioned relative to its trigger.
 *
 * Usage:
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Open</Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Positioner side="bottom" align="start">
 *       <Popover.Popup>
 *         <Popover.Header>
 *           <Popover.Title>Title</Popover.Title>
 *           <Popover.CloseButton />
 *         </Popover.Header>
 *         <Popover.Body>
 *           <Popover.Description>Details here.</Popover.Description>
 *         </Popover.Body>
 *         <Popover.Arrow />
 *       </Popover.Popup>
 *     </Popover.Positioner>
 *   </Popover.Portal>
 * </Popover.Root>
 * ```
 */
type FRef<P, E> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<E>>;

export const Popover: {
  Root: FC<PopoverRootProps>;
  Trigger: FRef<PopoverTriggerProps, HTMLButtonElement>;
  Portal: FC<PopoverPortalProps>;
  Positioner: FRef<PopoverPositionerProps, HTMLDivElement>;
  Popup: FRef<PopoverPopupProps, HTMLDivElement>;
  Arrow: FRef<PopoverArrowProps, HTMLDivElement>;
  Backdrop: FRef<PopoverBackdropProps, HTMLDivElement>;
  Title: FRef<PopoverTitleProps, HTMLHeadingElement>;
  Description: FRef<PopoverDescriptionProps, HTMLParagraphElement>;
  Close: FRef<PopoverCloseProps, HTMLButtonElement>;
  CloseButton: FRef<PopoverCloseButtonProps, HTMLButtonElement>;
  Header: FRef<PopoverHeaderProps, HTMLDivElement>;
  Body: FRef<PopoverBodyProps, HTMLDivElement>;
  Footer: FRef<PopoverFooterProps, HTMLDivElement>;
} = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Backdrop,
  Title,
  Description,
  Close,
  CloseButton,
  Header,
  Body,
  Footer,
};
