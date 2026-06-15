import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui-components/react/context-menu';
import { cn } from '../../utils/cn.js';
import styles from './ContextMenu.module.css';

// ---- Root ----
// ContextMenuRoot accepts no className – it renders no element.

const Root = BaseContextMenu.Root;

// ---- Trigger ----

export interface ContextMenuTriggerProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger> {
  className?: string;
}

const Trigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(function Trigger(
  { className, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      {...props}
    />
  );
});

// ---- Portal ----

const Portal = BaseContextMenu.Portal;

// ---- Positioner ----

export interface ContextMenuPositionerProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Positioner> {
  className?: string;
}

const Positioner = forwardRef<HTMLDivElement, ContextMenuPositionerProps>(
  function Positioner({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Positioner
        ref={ref}
        className={cn(styles.positioner, className)}
        {...props}
      />
    );
  },
);

// ---- Popup ----

export interface ContextMenuPopupProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Popup> {
  className?: string;
}

const Popup = forwardRef<Element, ContextMenuPopupProps>(function Popup(
  { className, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Popup
      ref={ref as Ref<Element>}
      className={cn(styles.popup, className)}
      {...props}
    />
  );
});

// ---- Item ----

export interface ContextMenuItemProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Item> {
  className?: string;
}

const Item = forwardRef<Element, ContextMenuItemProps>(function Item(
  { className, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Item
      ref={ref as Ref<Element>}
      className={cn(styles.item, className)}
      {...props}
    />
  );
});

// ---- CheckboxItem ----

export interface ContextMenuCheckboxItemProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.CheckboxItem> {
  className?: string;
}

const CheckboxItem = forwardRef<Element, ContextMenuCheckboxItemProps>(
  function CheckboxItem({ className, ...props }, ref) {
    return (
      <BaseContextMenu.CheckboxItem
        ref={ref as Ref<Element>}
        className={cn(styles.item, styles.checkboxItem, className)}
        {...props}
      />
    );
  },
);

// ---- CheckboxItemIndicator ----

export interface ContextMenuCheckboxItemIndicatorProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.CheckboxItemIndicator> {
  className?: string;
}

const CheckboxItemIndicator = forwardRef<HTMLSpanElement, ContextMenuCheckboxItemIndicatorProps>(
  function CheckboxItemIndicator({ className, ...props }, ref) {
    return (
      <BaseContextMenu.CheckboxItemIndicator
        ref={ref}
        className={cn(styles.itemIndicator, className)}
        {...props}
      />
    );
  },
);

// ---- RadioGroup ----

export interface ContextMenuRadioGroupProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.RadioGroup> {
  className?: string;
}

const RadioGroup = forwardRef<Element, ContextMenuRadioGroupProps>(
  function RadioGroup({ className, ...props }, ref) {
    return (
      <BaseContextMenu.RadioGroup
        ref={ref as Ref<Element>}
        className={cn(styles.radioGroup, className)}
        {...props}
      />
    );
  },
);

// ---- RadioItem ----

export interface ContextMenuRadioItemProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.RadioItem> {
  className?: string;
}

const RadioItem = forwardRef<Element, ContextMenuRadioItemProps>(
  function RadioItem({ className, ...props }, ref) {
    return (
      <BaseContextMenu.RadioItem
        ref={ref as Ref<Element>}
        className={cn(styles.item, styles.radioItem, className)}
        {...props}
      />
    );
  },
);

// ---- RadioItemIndicator ----

export interface ContextMenuRadioItemIndicatorProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.RadioItemIndicator> {
  className?: string;
}

const RadioItemIndicator = forwardRef<HTMLSpanElement, ContextMenuRadioItemIndicatorProps>(
  function RadioItemIndicator({ className, ...props }, ref) {
    return (
      <BaseContextMenu.RadioItemIndicator
        ref={ref}
        className={cn(styles.itemIndicator, className)}
        {...props}
      />
    );
  },
);

// ---- Group ----

export interface ContextMenuGroupProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Group> {
  className?: string;
}

const Group = forwardRef<Element, ContextMenuGroupProps>(function Group(
  { className, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Group
      ref={ref as Ref<Element>}
      className={cn(styles.group, className)}
      {...props}
    />
  );
});

// ---- GroupLabel ----

export interface ContextMenuGroupLabelProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.GroupLabel> {
  className?: string;
}

const GroupLabel = forwardRef<HTMLDivElement, ContextMenuGroupLabelProps>(
  function GroupLabel({ className, ...props }, ref) {
    return (
      <BaseContextMenu.GroupLabel
        ref={ref}
        className={cn(styles.groupLabel, className)}
        {...props}
      />
    );
  },
);

// ---- Separator ----

export interface ContextMenuSeparatorProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Separator> {
  className?: string;
}

const Separator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function Separator({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Separator
        ref={ref}
        className={cn(styles.separator, className)}
        {...props}
      />
    );
  },
);

// ---- SubmenuRoot ----

const SubmenuRoot = BaseContextMenu.SubmenuRoot;

// ---- SubmenuTrigger ----

export interface ContextMenuSubmenuTriggerProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.SubmenuTrigger> {
  className?: string;
}

const SubmenuTrigger = forwardRef<HTMLElement, ContextMenuSubmenuTriggerProps>(
  function SubmenuTrigger({ className, ...props }, ref) {
    return (
      <BaseContextMenu.SubmenuTrigger
        ref={ref}
        className={cn(styles.item, styles.submenuTrigger, className)}
        {...props}
      />
    );
  },
);

// ---- Arrow ----

export interface ContextMenuArrowProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Arrow> {
  className?: string;
}

const Arrow = forwardRef<HTMLDivElement, ContextMenuArrowProps>(function Arrow(
  { className, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Arrow
      ref={ref}
      className={cn(styles.arrow, className)}
      {...props}
    />
  );
});

// ---- Backdrop ----

export interface ContextMenuBackdropProps
  extends ComponentPropsWithoutRef<typeof BaseContextMenu.Backdrop> {
  className?: string;
}

const Backdrop = forwardRef<HTMLDivElement, ContextMenuBackdropProps>(function Backdrop(
  { className, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Backdrop
      ref={ref}
      className={cn(styles.backdrop, className)}
      {...props}
    />
  );
});

/**
 * A context menu activated by right-clicking or long pressing on the trigger area.
 * Built on Base UI ContextMenu with Eidra design tokens.
 *
 * @example
 * ```tsx
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>Right-click me</ContextMenu.Trigger>
 *   <ContextMenu.Portal>
 *     <ContextMenu.Positioner>
 *       <ContextMenu.Popup>
 *         <ContextMenu.Item>Copy</ContextMenu.Item>
 *         <ContextMenu.Separator />
 *         <ContextMenu.Item>Delete</ContextMenu.Item>
 *       </ContextMenu.Popup>
 *     </ContextMenu.Positioner>
 *   </ContextMenu.Portal>
 * </ContextMenu.Root>
 * ```
 */
export const ContextMenu = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Item,
  CheckboxItem,
  CheckboxItemIndicator,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
  Group,
  GroupLabel,
  Separator,
  SubmenuRoot,
  SubmenuTrigger,
  Arrow,
  Backdrop,
} as const;
