import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { X } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './Toast.module.css';

// ---- Re-export types from Base UI for external use ----
export type { ToastProviderProps } from '@base-ui/react/toast';
export type { ToastRootProps } from '@base-ui/react/toast';
export type { ToastContentProps } from '@base-ui/react/toast';
export type { ToastTitleProps } from '@base-ui/react/toast';
export type { ToastDescriptionProps } from '@base-ui/react/toast';
export type { ToastCloseProps } from '@base-ui/react/toast';
export type { ToastActionProps } from '@base-ui/react/toast';
export type {
  ToastObject,
  UseToastManagerReturnValue,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastManagerPromiseOptions,
} from '@base-ui/react/toast';

// ---- useToastManager and createToastManager ----
// These live on the `Toast` namespace from @base-ui/react/toast.
// We re-export them as named functions for ergonomic usage.
export const useToastManager: typeof BaseToast.useToastManager = BaseToast.useToastManager;
export const createToastManager: typeof BaseToast.createToastManager = BaseToast.createToastManager;

// ---- Provider (no DOM element — pass-through) ----
const Provider = BaseToast.Provider;

// ---- Viewport ----
/** Where toasts appear on screen. */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastViewportProps extends ComponentPropsWithoutRef<typeof BaseToast.Viewport> {
  /** Corner/edge the toast stack is anchored to. Defaults to `bottom-right`. */
  position?: ToastPosition;
}

const Viewport = forwardRef<HTMLDivElement, ToastViewportProps>(function Viewport(
  { className, position = 'bottom-right', ...props },
  ref,
) {
  const scope = useScopeDataAttrs();
  return (
    <BaseToast.Viewport
      ref={ref}
      data-position={position}
      className={cn(styles.viewport, className)}
      {...scope}
      {...props}
    />
  );
});
Viewport.displayName = 'Toast.Viewport';

// ---- Root ----
const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToast.Root>>(
  function Root({ className, ...props }, ref) {
    return <BaseToast.Root ref={ref} className={cn(styles.root, className)} {...props} />;
  },
);
Root.displayName = 'Toast.Root';

// ---- Content ----
const Content = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToast.Content>>(
  function Content({ className, ...props }, ref) {
    return <BaseToast.Content ref={ref} className={cn(styles.content, className)} {...props} />;
  },
);
Content.displayName = 'Toast.Content';

// ---- Title ----
const Title = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof BaseToast.Title>>(
  function Title({ className, ...props }, ref) {
    return <BaseToast.Title ref={ref} className={cn(styles.title, className)} {...props} />;
  },
);
Title.displayName = 'Toast.Title';

// ---- Description ----
const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseToast.Description>
>(function Description({ className, ...props }, ref) {
  return (
    <BaseToast.Description ref={ref} className={cn(styles.description, className)} {...props} />
  );
});
Description.displayName = 'Toast.Description';

// ---- Close (raw close, no icon) ----
const Close = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseToast.Close>>(
  function Close({ className, children, ...props }, ref) {
    return (
      <BaseToast.Close ref={ref} className={cn(styles.close, className)} {...props}>
        {children}
      </BaseToast.Close>
    );
  },
);
Close.displayName = 'Toast.Close';

// ---- CloseButton (convenience: styled X icon button) ----
export interface ToastCloseButtonProps extends ComponentPropsWithoutRef<typeof BaseToast.Close> {
  /** Accessible label. Defaults to "Dismiss". */
  label?: string;
}

const CloseButton = forwardRef<HTMLButtonElement, ToastCloseButtonProps>(function CloseButton(
  { className, label = 'Dismiss', ...props },
  ref,
) {
  return (
    <BaseToast.Close
      ref={ref}
      aria-label={label}
      className={cn(styles.closeButton, className)}
      {...props}
    >
      <Icon icon={X} size="sm" aria-hidden />
    </BaseToast.Close>
  );
});
CloseButton.displayName = 'Toast.CloseButton';

// ---- Action ----
const Action = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseToast.Action>>(
  function Action({ className, children, ...props }, ref) {
    return (
      <BaseToast.Action ref={ref} className={cn(styles.action, className)} {...props}>
        {children}
      </BaseToast.Action>
    );
  },
);
Action.displayName = 'Toast.Action';

// ---- Compound export ----
/**
 * A toast notification system built on Base UI `Toast`.
 *
 * Wrap your application in `<Toast.Provider>` then render `<Toast.Viewport>` once
 * (typically near the root). Trigger toasts via the `useToastManager` hook.
 *
 * Usage:
 * ```tsx
 * // In your app root:
 * <Toast.Provider>
 *   <App />
 *   <Toast.Viewport />
 * </Toast.Provider>
 *
 * // In any component:
 * const toast = useToastManager();
 * toast.add({ title: 'Saved', description: 'Your changes have been saved.' });
 * ```
 */
export const Toast: {
  Provider: typeof Provider;
  Viewport: typeof Viewport;
  Root: typeof Root;
  Content: typeof Content;
  Title: typeof Title;
  Description: typeof Description;
  Close: typeof Close;
  CloseButton: typeof CloseButton;
  Action: typeof Action;
} = {
  Provider,
  Viewport,
  Root,
  Content,
  Title,
  Description,
  Close,
  CloseButton,
  Action,
};
