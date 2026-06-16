import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { cn } from '../../utils/cn.js';
import styles from './AlertDialog.module.css';

// ── Root ──────────────────────────────────────────────────────────────────────

export type AlertDialogRootProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Root>;

/**
 * The headless root that controls open state. Renders no element.
 */
export const AlertDialogRoot = BaseAlertDialog.Root;

// ── Trigger ───────────────────────────────────────────────────────────────────

export interface AlertDialogTriggerProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Trigger> {
  className?: string;
}

/**
 * The button that opens the alert dialog.
 */
export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        {...props}
      />
    );
  },
);
AlertDialogTrigger.displayName = 'AlertDialog.Trigger';

// ── Backdrop ──────────────────────────────────────────────────────────────────

export interface AlertDialogBackdropProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Backdrop> {
  className?: string;
}

/**
 * The semi-transparent overlay rendered behind the popup.
 */
export const AlertDialogBackdrop = forwardRef<HTMLDivElement, AlertDialogBackdropProps>(
  function AlertDialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Backdrop
        ref={ref}
        className={cn(styles.backdrop, className)}
        {...props}
      />
    );
  },
);
AlertDialogBackdrop.displayName = 'AlertDialog.Backdrop';

// ── Popup ─────────────────────────────────────────────────────────────────────

export interface AlertDialogPopupProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> {
  className?: string;
}

/**
 * The dialog panel containing its content.
 */
export const AlertDialogPopup = forwardRef<HTMLDivElement, AlertDialogPopupProps>(
  function AlertDialogPopup({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Popup
        ref={ref}
        className={cn(styles.popup, className)}
        {...props}
      />
    );
  },
);
AlertDialogPopup.displayName = 'AlertDialog.Popup';

// ── Title ─────────────────────────────────────────────────────────────────────

export interface AlertDialogTitleProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Title> {
  className?: string;
}

/**
 * A heading that labels the dialog. Renders an `<h2>`.
 */
export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Title
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
      />
    );
  },
);
AlertDialogTitle.displayName = 'AlertDialog.Title';

// ── Description ───────────────────────────────────────────────────────────────

export interface AlertDialogDescriptionProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Description> {
  className?: string;
}

/**
 * Additional context shown inside the dialog.
 */
export const AlertDialogDescription = forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  function AlertDialogDescription({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Description
        ref={ref}
        className={cn(styles.description, className)}
        {...props}
      />
    );
  },
);
AlertDialogDescription.displayName = 'AlertDialog.Description';

// ── Close ─────────────────────────────────────────────────────────────────────

export interface AlertDialogCloseProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Close> {
  className?: string;
}

/**
 * A button that closes the alert dialog.
 */
export const AlertDialogClose = forwardRef<HTMLButtonElement, AlertDialogCloseProps>(
  function AlertDialogClose({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Close
        ref={ref}
        className={cn(styles.close, className)}
        {...props}
      />
    );
  },
);
AlertDialogClose.displayName = 'AlertDialog.Close';

// ── Portal ────────────────────────────────────────────────────────────────────

export type AlertDialogPortalProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Portal>;

/**
 * Teleports the popup to the document body (or a specified container).
 */
export const AlertDialogPortal = BaseAlertDialog.Portal;

// ── Compound namespace export ─────────────────────────────────────────────────

/**
 * Alert Dialog compound component.
 *
 * @example
 * ```tsx
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger>Delete account</AlertDialog.Trigger>
 *   <AlertDialog.Portal>
 *     <AlertDialog.Backdrop />
 *     <AlertDialog.Popup>
 *       <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
 *       <AlertDialog.Description>
 *         This action cannot be undone.
 *       </AlertDialog.Description>
 *       <AlertDialog.Close>Cancel</AlertDialog.Close>
 *       <AlertDialog.Close>Confirm</AlertDialog.Close>
 *     </AlertDialog.Popup>
 *   </AlertDialog.Portal>
 * </AlertDialog.Root>
 * ```
 */
export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Backdrop: AlertDialogBackdrop,
  Portal: AlertDialogPortal,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
};
