import { forwardRef } from 'react';
import { NavigationMenu as BaseNavigationMenu } from '@base-ui-components/react/navigation-menu';
import { cn } from '../../utils/cn.js';
import styles from './NavigationMenu.module.css';

// ─── Root ────────────────────────────────────────────────────────────────────

export type NavigationMenuRootProps = BaseNavigationMenu.Root.Props & {
  className?: string;
};

const Root = forwardRef<HTMLElement, NavigationMenuRootProps>(function Root(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Root ref={ref} className={cn(styles.root, className)} {...props} />
  );
});

// ─── List ────────────────────────────────────────────────────────────────────

export type NavigationMenuListProps = BaseNavigationMenu.List.Props & {
  className?: string;
};

const List = forwardRef<HTMLDivElement, NavigationMenuListProps>(function List(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.List ref={ref} className={cn(styles.list, className)} {...props} />
  );
});

// ─── Item ────────────────────────────────────────────────────────────────────

export type NavigationMenuItemProps = BaseNavigationMenu.Item.Props & {
  className?: string;
};

const Item = forwardRef<HTMLDivElement, NavigationMenuItemProps>(function Item(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Item ref={ref} className={cn(styles.item, className)} {...props} />
  );
});

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type NavigationMenuTriggerProps = BaseNavigationMenu.Trigger.Props & {
  className?: string;
};

const Trigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(function Trigger(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      {...props}
    />
  );
});

// ─── Icon ────────────────────────────────────────────────────────────────────

export type NavigationMenuIconProps = BaseNavigationMenu.Icon.Props & {
  className?: string;
};

const NavigationMenuIconPart = forwardRef<HTMLDivElement, NavigationMenuIconProps>(
  function NavigationMenuIconPart({ className, ...props }, ref) {
    return (
      <BaseNavigationMenu.Icon
        ref={ref}
        className={cn(styles.triggerIcon, className)}
        {...props}
      />
    );
  },
);

// ─── Portal ───────────────────────────────────────────────────────────────────

export type NavigationMenuPortalProps = BaseNavigationMenu.Portal.Props;

const Portal = function Portal(props: NavigationMenuPortalProps) {
  return <BaseNavigationMenu.Portal {...props} />;
};

// ─── Positioner ──────────────────────────────────────────────────────────────

export type NavigationMenuPositionerProps = BaseNavigationMenu.Positioner.Props & {
  className?: string;
};

const Positioner = forwardRef<HTMLDivElement, NavigationMenuPositionerProps>(
  function Positioner({ className, ...props }, ref) {
    return (
      <BaseNavigationMenu.Positioner
        ref={ref}
        className={cn(styles.positioner, className)}
        {...props}
      />
    );
  },
);

// ─── Viewport ────────────────────────────────────────────────────────────────

export type NavigationMenuViewportProps = BaseNavigationMenu.Viewport.Props & {
  className?: string;
};

const Viewport = forwardRef<HTMLDivElement, NavigationMenuViewportProps>(function Viewport(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Viewport
      ref={ref}
      className={cn(styles.viewport, className)}
      {...props}
    />
  );
});

// ─── Popup ───────────────────────────────────────────────────────────────────

export type NavigationMenuPopupProps = BaseNavigationMenu.Popup.Props & {
  className?: string;
};

const Popup = forwardRef<HTMLElement, NavigationMenuPopupProps>(function Popup(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Popup ref={ref} className={cn(styles.popup, className)} {...props} />
  );
});

// ─── Content ─────────────────────────────────────────────────────────────────

export type NavigationMenuContentProps = BaseNavigationMenu.Content.Props & {
  className?: string;
};

const Content = forwardRef<HTMLDivElement, NavigationMenuContentProps>(function Content(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Content
      ref={ref}
      className={cn(styles.content, className)}
      {...props}
    />
  );
});

// ─── Arrow ────────────────────────────────────────────────────────────────────

export type NavigationMenuArrowProps = BaseNavigationMenu.Arrow.Props & {
  className?: string;
};

const Arrow = forwardRef<HTMLDivElement, NavigationMenuArrowProps>(function Arrow(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Arrow ref={ref} className={cn(styles.arrow, className)} {...props} />
  );
});

// ─── Backdrop ────────────────────────────────────────────────────────────────

export type NavigationMenuBackdropProps = BaseNavigationMenu.Backdrop.Props & {
  className?: string;
};

const Backdrop = forwardRef<HTMLDivElement, NavigationMenuBackdropProps>(function Backdrop(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Backdrop
      ref={ref}
      className={cn(styles.backdrop, className)}
      {...props}
    />
  );
});

// ─── Link ────────────────────────────────────────────────────────────────────

export type NavigationMenuLinkProps = BaseNavigationMenu.Link.Props & {
  className?: string;
};

const Link = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(function Link(
  { className, ...props },
  ref,
) {
  return (
    <BaseNavigationMenu.Link ref={ref} className={cn(styles.link, className)} {...props} />
  );
});

// ─── Compound export ──────────────────────────────────────────────────────────

/**
 * NavigationMenu — a compound component wrapping Base UI NavigationMenu.
 * Use the nested parts to compose a full navigation bar with flyout panels.
 *
 * @example
 * <NavigationMenu.Root>
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item>
 *       <NavigationMenu.Trigger>Services <NavigationMenu.Icon /></NavigationMenu.Trigger>
 *       <NavigationMenu.Portal>
 *         <NavigationMenu.Positioner>
 *           <NavigationMenu.Popup>
 *             <NavigationMenu.Viewport>
 *               <NavigationMenu.Content>…</NavigationMenu.Content>
 *             </NavigationMenu.Viewport>
 *           </NavigationMenu.Popup>
 *         </NavigationMenu.Positioner>
 *       </NavigationMenu.Portal>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 * </NavigationMenu.Root>
 */
export const NavigationMenu = {
  Root,
  List,
  Item,
  Trigger,
  Icon: NavigationMenuIconPart,
  Portal,
  Positioner,
  Viewport,
  Popup,
  Content,
  Arrow,
  Backdrop,
  Link,
};
