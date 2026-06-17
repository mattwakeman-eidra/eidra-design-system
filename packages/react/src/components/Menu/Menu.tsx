import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './Menu.module.css';

// ─── Root ──────────────────────────────────────────────────────────────────

export type MenuRootProps = BaseMenu.Root.Props;

function MenuRoot(props: MenuRootProps) {
  return <BaseMenu.Root {...props} />;
}

// ─── Trigger ───────────────────────────────────────────────────────────────

export interface MenuTriggerProps extends BaseMenu.Trigger.Props {
  className?: string;
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      {...props}
    />
  );
});

// ─── Portal ────────────────────────────────────────────────────────────────

export type MenuPortalProps = BaseMenu.Portal.Props;

function MenuPortal(props: MenuPortalProps) {
  return <BaseMenu.Portal {...props} />;
}

// ─── Positioner ────────────────────────────────────────────────────────────

export interface MenuPositionerProps extends BaseMenu.Positioner.Props {
  className?: string;
}

const MenuPositioner = forwardRef<HTMLDivElement, MenuPositionerProps>(function MenuPositioner(
  { className, ...props },
  ref,
) {
  const scope = useScopeDataAttrs();
  return <BaseMenu.Positioner ref={ref} className={cn(styles.positioner, className)} {...scope} {...props} />;
});

// ─── Popup ─────────────────────────────────────────────────────────────────

export interface MenuPopupProps extends ComponentPropsWithoutRef<typeof BaseMenu.Popup> {
  className?: string;
}

const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(function MenuPopup(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Popup
      ref={ref as Ref<HTMLDivElement>}
      className={cn(styles.popup, className)}
      {...props}
    />
  );
});

// ─── Item ──────────────────────────────────────────────────────────────────

export interface MenuItemProps extends ComponentPropsWithoutRef<typeof BaseMenu.Item> {
  className?: string;
}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Item
      ref={ref as Ref<HTMLElement>}
      className={cn(styles.item, className)}
      {...props}
    />
  );
});

// ─── CheckboxItem ──────────────────────────────────────────────────────────

export interface MenuCheckboxItemProps extends ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem> {
  className?: string;
}

const MenuCheckboxItem = forwardRef<HTMLDivElement, MenuCheckboxItemProps>(function MenuCheckboxItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.CheckboxItem
      ref={ref as Ref<HTMLElement>}
      className={cn(styles.item, styles.checkboxItem, className)}
      {...props}
    />
  );
});

// ─── CheckboxItemIndicator ─────────────────────────────────────────────────

export interface MenuCheckboxItemIndicatorProps
  extends ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItemIndicator> {
  className?: string;
}

const MenuCheckboxItemIndicator = forwardRef<HTMLSpanElement, MenuCheckboxItemIndicatorProps>(
  function MenuCheckboxItemIndicator({ className, ...props }, ref) {
    return (
      <BaseMenu.CheckboxItemIndicator
        ref={ref}
        className={cn(styles.checkboxItemIndicator, className)}
        {...props}
      />
    );
  },
);

// ─── Group ─────────────────────────────────────────────────────────────────

export interface MenuGroupProps extends ComponentPropsWithoutRef<typeof BaseMenu.Group> {
  className?: string;
}

const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(function MenuGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Group
      ref={ref as Ref<HTMLDivElement>}
      className={cn(styles.group, className)}
      {...props}
    />
  );
});

// ─── GroupLabel ────────────────────────────────────────────────────────────

export interface MenuGroupLabelProps extends ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel> {
  className?: string;
}

const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>(function MenuGroupLabel(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.GroupLabel ref={ref} className={cn(styles.groupLabel, className)} {...props} />
  );
});

// ─── Separator ─────────────────────────────────────────────────────────────

export interface MenuSeparatorProps extends ComponentPropsWithoutRef<typeof BaseMenu.Separator> {
  className?: string;
}

const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(function MenuSeparator(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Separator
      ref={ref}
      className={cn(styles.separator, className)}
      {...props}
    />
  );
});

// ─── SubmenuRoot ───────────────────────────────────────────────────────────

export type MenuSubmenuRootProps = BaseMenu.SubmenuRoot.Props;

function MenuSubmenuRoot(props: MenuSubmenuRootProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

// ─── SubmenuTrigger ────────────────────────────────────────────────────────

export interface MenuSubmenuTriggerProps
  extends ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> {
  className?: string;
}

const MenuSubmenuTrigger = forwardRef<HTMLElement, MenuSubmenuTriggerProps>(
  function MenuSubmenuTrigger({ className, ...props }, ref) {
    return (
      <BaseMenu.SubmenuTrigger
        ref={ref}
        className={cn(styles.item, styles.submenuTrigger, className)}
        {...props}
      />
    );
  },
);

// ─── Arrow ─────────────────────────────────────────────────────────────────

export interface MenuArrowProps extends ComponentPropsWithoutRef<typeof BaseMenu.Arrow> {
  className?: string;
}

const MenuArrow = forwardRef<HTMLDivElement, MenuArrowProps>(function MenuArrow(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Arrow
      ref={ref}
      className={cn(styles.arrow, className)}
      {...props}
    />
  );
});

// ─── Compound namespace export ─────────────────────────────────────────────

/**
 * A dropdown menu built on Base UI `Menu`. Compose the parts to build menus,
 * checkbox menus, and nested submenus.
 *
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger>Options</Menu.Trigger>
 *   <Menu.Portal>
 *     <Menu.Positioner>
 *       <Menu.Popup>
 *         <Menu.Item>Edit</Menu.Item>
 *         <Menu.Item>Delete</Menu.Item>
 *       </Menu.Popup>
 *     </Menu.Positioner>
 *   </Menu.Portal>
 * </Menu.Root>
 * ```
 */
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  Arrow: MenuArrow,
};
