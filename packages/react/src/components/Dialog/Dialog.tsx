import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import styles from './Dialog.module.css';

// ---- Re-export types from Base UI for external use ----
export type { DialogRootProps } from '@base-ui/react/dialog';
export type { DialogTriggerProps } from '@base-ui/react/dialog';
export type { DialogPortalProps } from '@base-ui/react/dialog';
export type { DialogBackdropProps } from '@base-ui/react/dialog';
export type { DialogPopupProps } from '@base-ui/react/dialog';
export type { DialogTitleProps } from '@base-ui/react/dialog';
export type { DialogDescriptionProps } from '@base-ui/react/dialog';
export type { DialogCloseProps } from '@base-ui/react/dialog';

// ---- Root (no DOM element, pass-through) ----
// Generic function type; displayName is set via the compound object name instead.
const Root = BaseDialog.Root;

// ---- Trigger ----
const Trigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseDialog.Trigger>>(
  function Trigger({ className, children, ...props }, ref) {
    return (
      <BaseDialog.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
        {children}
      </BaseDialog.Trigger>
    );
  },
);
Trigger.displayName = 'Dialog.Trigger';

// ---- Portal ----
const Portal = BaseDialog.Portal;

// ---- Backdrop ----
const Backdrop = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>>(
  function Backdrop({ className, ...props }, ref) {
    return (
      <BaseDialog.Backdrop ref={ref} className={cn(styles.backdrop, className)} {...props} />
    );
  },
);
Backdrop.displayName = 'Dialog.Backdrop';

// ---- Popup ----
const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDialog.Popup>>(
  function Popup({ className, children, ...props }, ref) {
    return (
      <BaseDialog.Popup ref={ref} className={cn(styles.popup, className)} {...props}>
        {children}
      </BaseDialog.Popup>
    );
  },
);
Popup.displayName = 'Dialog.Popup';

// ---- Title ----
const Title = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<typeof BaseDialog.Title>>(
  function Title({ className, children, ...props }, ref) {
    return (
      <BaseDialog.Title ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </BaseDialog.Title>
    );
  },
);
Title.displayName = 'Dialog.Title';

// ---- Description ----
const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(function Description({ className, children, ...props }, ref) {
  return (
    <BaseDialog.Description ref={ref} className={cn(styles.description, className)} {...props}>
      {children}
    </BaseDialog.Description>
  );
});
Description.displayName = 'Dialog.Description';

// ---- Close ----
const Close = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseDialog.Close>>(
  function Close({ className, children, ...props }, ref) {
    return (
      <BaseDialog.Close ref={ref} className={cn(styles.close, className)} {...props}>
        {children}
      </BaseDialog.Close>
    );
  },
);
Close.displayName = 'Dialog.Close';

// ---- CloseButton (convenience: styled X icon button) ----
export interface DialogCloseButtonProps
  extends ComponentPropsWithoutRef<typeof BaseDialog.Close> {
  /** Accessible label. Defaults to "Close dialog". */
  label?: string;
}

const CloseButton = forwardRef<HTMLButtonElement, DialogCloseButtonProps>(function CloseButton(
  { className, label = 'Close dialog', ...props },
  ref,
) {
  return (
    <BaseDialog.Close
      ref={ref}
      aria-label={label}
      className={cn(styles.closeButton, className)}
      {...props}
    >
      <Icon icon={X} size="sm" aria-hidden />
    </BaseDialog.Close>
  );
});
CloseButton.displayName = 'Dialog.CloseButton';

// ---- Header (layout helper) ----
export interface DialogHeaderProps extends ComponentPropsWithoutRef<'div'> {}

const Header = forwardRef<HTMLDivElement, DialogHeaderProps>(function Header(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  );
});
Header.displayName = 'Dialog.Header';

// ---- Body (layout helper) ----
export interface DialogBodyProps extends ComponentPropsWithoutRef<'div'> {}

const Body = forwardRef<HTMLDivElement, DialogBodyProps>(function Body(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  );
});
Body.displayName = 'Dialog.Body';

// ---- Footer (layout helper) ----
export interface DialogFooterProps extends ComponentPropsWithoutRef<'div'> {}

const Footer = forwardRef<HTMLDivElement, DialogFooterProps>(function Footer(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  );
});
Footer.displayName = 'Dialog.Footer';

// ---- Compound export ----
/**
 * A modal/non-modal dialog built on Base UI `Dialog`.
 *
 * Usage:
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open</Dialog.Trigger>
 *   <Dialog.Portal>
 *     <Dialog.Backdrop />
 *     <Dialog.Popup>
 *       <Dialog.Header>
 *         <Dialog.Title>Title</Dialog.Title>
 *         <Dialog.CloseButton />
 *       </Dialog.Header>
 *       <Dialog.Body>
 *         <Dialog.Description>Description</Dialog.Description>
 *       </Dialog.Body>
 *       <Dialog.Footer>…</Dialog.Footer>
 *     </Dialog.Popup>
 *   </Dialog.Portal>
 * </Dialog.Root>
 * ```
 */
export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Header,
  Body,
  Footer,
  Title,
  Description,
  Close,
  CloseButton,
};
