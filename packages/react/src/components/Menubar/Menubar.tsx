import { forwardRef } from 'react';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { Menu } from '@base-ui/react/menu';
import { cn } from '../../utils/cn.js';
import styles from './Menubar.module.css';

// ─── Re-export Base UI types ─────────────────────────────────────────────────

export type { MenubarProps, MenubarState } from '@base-ui/react/menubar';

// ─── Root ─────────────────────────────────────────────────────────────────────

const Root = forwardRef<HTMLDivElement, BaseMenubar.Props>(function Root(
  { className, ...props },
  ref,
) {
  return <BaseMenubar ref={ref} className={cn(styles.root, className)} {...props} />;
});

// ─── Menu (Root; groups trigger + popup; no DOM element) ──────────────────────

const MenuRoot = Menu.Root;

// ─── Trigger ─────────────────────────────────────────────────────────────────

const Trigger = forwardRef<HTMLButtonElement, Menu.Trigger.Props>(function Trigger(
  { className, ...props },
  ref,
) {
  return <Menu.Trigger ref={ref} className={cn(styles.trigger, className)} {...props} />;
});

// ─── Portal ───────────────────────────────────────────────────────────────────

const Portal = Menu.Portal;

// ─── Positioner ───────────────────────────────────────────────────────────────

const Positioner = forwardRef<HTMLDivElement, Menu.Positioner.Props>(function Positioner(
  { className, ...props },
  ref,
) {
  return <Menu.Positioner ref={ref} className={cn(styles.positioner, className)} {...props} />;
});

// ─── Popup ────────────────────────────────────────────────────────────────────

const Popup = forwardRef<HTMLDivElement, Menu.Popup.Props>(function Popup(
  { className, ...props },
  ref,
) {
  return <Menu.Popup ref={ref} className={cn(styles.popup, className)} {...props} />;
});

// ─── Item ─────────────────────────────────────────────────────────────────────

const Item = forwardRef<HTMLElement, Menu.Item.Props>(function Item(
  { className, ...props },
  ref,
) {
  return <Menu.Item ref={ref} className={cn(styles.item, className)} {...props} />;
});

// ─── Separator ────────────────────────────────────────────────────────────────

const Separator = forwardRef<HTMLDivElement, Menu.Separator.Props>(function Separator(
  { className, ...props },
  ref,
) {
  return <Menu.Separator ref={ref} className={cn(styles.separator, className)} {...props} />;
});

// ─── Group ────────────────────────────────────────────────────────────────────

const Group = forwardRef<HTMLDivElement, Menu.Group.Props>(function Group(
  { className, ...props },
  ref,
) {
  return <Menu.Group ref={ref} className={cn(styles.group, className)} {...props} />;
});

// ─── GroupLabel ───────────────────────────────────────────────────────────────

const GroupLabel = forwardRef<HTMLDivElement, Menu.GroupLabel.Props>(function GroupLabel(
  { className, ...props },
  ref,
) {
  return <Menu.GroupLabel ref={ref} className={cn(styles.groupLabel, className)} {...props} />;
});

// ─── SubmenuRoot ──────────────────────────────────────────────────────────────

const SubmenuRoot = Menu.SubmenuRoot;

// ─── SubmenuTrigger ───────────────────────────────────────────────────────────

const SubmenuTrigger = forwardRef<HTMLElement, Menu.SubmenuTrigger.Props>(
  function SubmenuTrigger({ className, ...props }, ref) {
    return (
      <Menu.SubmenuTrigger
        ref={ref}
        className={cn(styles.submenuTrigger, className)}
        {...props}
      />
    );
  },
);

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

const CheckboxItem = forwardRef<HTMLElement, Menu.CheckboxItem.Props>(
  function CheckboxItem({ className, ...props }, ref) {
    return (
      <Menu.CheckboxItem ref={ref} className={cn(styles.checkboxItem, className)} {...props} />
    );
  },
);

// ─── CheckboxItemIndicator ────────────────────────────────────────────────────

const CheckboxItemIndicator = forwardRef<HTMLSpanElement, Menu.CheckboxItemIndicator.Props>(
  function CheckboxItemIndicator({ className, ...props }, ref) {
    return (
      <Menu.CheckboxItemIndicator
        ref={ref}
        className={cn(styles.itemIndicator, className)}
        {...props}
      />
    );
  },
);

// ─── RadioGroup ───────────────────────────────────────────────────────────────

const RadioGroup = Menu.RadioGroup;

// ─── RadioItem ────────────────────────────────────────────────────────────────

const RadioItem = forwardRef<HTMLElement, Menu.RadioItem.Props>(function RadioItem(
  { className, ...props },
  ref,
) {
  return <Menu.RadioItem ref={ref} className={cn(styles.radioItem, className)} {...props} />;
});

// ─── RadioItemIndicator ───────────────────────────────────────────────────────

const RadioItemIndicator = forwardRef<HTMLSpanElement, Menu.RadioItemIndicator.Props>(
  function RadioItemIndicator({ className, ...props }, ref) {
    return (
      <Menu.RadioItemIndicator
        ref={ref}
        className={cn(styles.itemIndicator, className)}
        {...props}
      />
    );
  },
);

// ─── Arrow ────────────────────────────────────────────────────────────────────

const Arrow = forwardRef<HTMLDivElement, Menu.Arrow.Props>(function Arrow(
  { className, ...props },
  ref,
) {
  return <Menu.Arrow ref={ref} className={cn(styles.arrow, className)} {...props} />;
});

// ─── Compound namespace export ────────────────────────────────────────────────

/**
 * A menubar that groups a set of drop-down menus, built on Base UI Menubar + Menu primitives.
 *
 * Usage:
 * ```tsx
 * <Menubar.Root>
 *   <Menubar.MenuRoot>
 *     <Menubar.Trigger>File</Menubar.Trigger>
 *     <Menubar.Portal>
 *       <Menubar.Positioner>
 *         <Menubar.Popup>
 *           <Menubar.Item>New File</Menubar.Item>
 *           <Menubar.Item>Open…</Menubar.Item>
 *           <Menubar.Separator />
 *           <Menubar.Item>Save</Menubar.Item>
 *         </Menubar.Popup>
 *       </Menubar.Positioner>
 *     </Menubar.Portal>
 *   </Menubar.MenuRoot>
 * </Menubar.Root>
 * ```
 */
export const Menubar = {
  Root,
  MenuRoot,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Item,
  Separator,
  Group,
  GroupLabel,
  SubmenuRoot,
  SubmenuTrigger,
  CheckboxItem,
  CheckboxItemIndicator,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
  Arrow,
} as const;

// Individual named exports for tree-shaking / direct import
export {
  Root as MenubarRoot,
  MenuRoot as MenubarMenuRoot,
  Trigger as MenubarTrigger,
  Portal as MenubarPortal,
  Positioner as MenubarPositioner,
  Popup as MenubarPopup,
  Item as MenubarItem,
  Separator as MenubarSeparator,
  Group as MenubarGroup,
  GroupLabel as MenubarGroupLabel,
  SubmenuRoot as MenubarSubmenuRoot,
  SubmenuTrigger as MenubarSubmenuTrigger,
  CheckboxItem as MenubarCheckboxItem,
  CheckboxItemIndicator as MenubarCheckboxItemIndicator,
  RadioGroup as MenubarRadioGroup,
  RadioItem as MenubarRadioItem,
  RadioItemIndicator as MenubarRadioItemIndicator,
  Arrow as MenubarArrow,
};
