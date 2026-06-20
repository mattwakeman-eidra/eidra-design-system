import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { ChevronsUpDown, Check } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import type { OverlayWidth } from '../../utils/overlayWidth.js';
import styles from './Select.module.css';

// ─── Root ──────────────────────────────────────────────────────────────────────

export type SelectRootProps = BaseSelect.Root.Props<unknown, false | undefined>;

function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: BaseSelect.Root.Props<Value, Multiple>,
) {
  return <BaseSelect.Root {...props} />;
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface SelectTriggerProps extends ComponentPropsWithoutRef<typeof BaseSelect.Trigger> {
  /** Control size. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
  { size = 'md', className, children, ...props },
  ref,
) {
  return (
    <BaseSelect.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      data-size={size}
      {...props}
    >
      <BaseSelect.Value className={styles.value} />
      <span className={styles.icon} aria-hidden="true">
        <Icon icon={ChevronsUpDown} size="sm" />
      </span>
    </BaseSelect.Trigger>
  );
});

// ─── Value ─────────────────────────────────────────────────────────────────────

export interface SelectValueProps extends ComponentPropsWithoutRef<typeof BaseSelect.Value> {
  className?: string;
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue(
  { className, ...props },
  ref,
) {
  return <BaseSelect.Value ref={ref} className={cn(styles.value, className)} {...props} />;
});

// ─── Portal ────────────────────────────────────────────────────────────────────

export type SelectPortalProps = BaseSelect.Portal.Props;

function SelectPortal(props: SelectPortalProps) {
  return <BaseSelect.Portal {...props} />;
}

// ─── Backdrop ──────────────────────────────────────────────────────────────────

export interface SelectBackdropProps extends ComponentPropsWithoutRef<typeof BaseSelect.Backdrop> {
  className?: string;
}

const SelectBackdrop = forwardRef<HTMLDivElement, SelectBackdropProps>(function SelectBackdrop(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.Backdrop
      ref={ref}
      className={cn(styles.backdrop, className)}
      {...props}
    />
  );
});

// ─── Positioner ────────────────────────────────────────────────────────────────

export interface SelectPositionerProps
  extends ComponentPropsWithoutRef<typeof BaseSelect.Positioner> {
  className?: string;
}

const SelectPositioner = forwardRef<HTMLDivElement, SelectPositionerProps>(
  function SelectPositioner({ className, ...props }, ref) {
    const scope = useScopeDataAttrs();
    return (
      <BaseSelect.Positioner
        ref={ref}
        className={cn(styles.positioner, className)}
        {...scope}
        {...props}
      />
    );
  },
);

// ─── Popup ─────────────────────────────────────────────────────────────────────

export interface SelectPopupProps extends ComponentPropsWithoutRef<typeof BaseSelect.Popup> {
  className?: string;
  /**
   * How the popup decides its width. `anchor` (default) makes it at least as wide
   * as the trigger, then hugs content, capped at the viewport; `content` hugs
   * content with no trigger floor; `fill` matches the trigger width exactly. See
   * the overlay width policy in `base.css`.
   */
  width?: OverlayWidth;
}

const SelectPopup = forwardRef<Element, SelectPopupProps>(function SelectPopup(
  { className, width = 'anchor', ...props },
  ref,
) {
  return (
    <BaseSelect.Popup
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(styles.popup, className)}
      data-eidra-width={width}
      {...props}
    />
  );
});

// ─── List ──────────────────────────────────────────────────────────────────────

export interface SelectListProps extends ComponentPropsWithoutRef<typeof BaseSelect.List> {
  className?: string;
}

const SelectList = forwardRef<HTMLDivElement, SelectListProps>(function SelectList(
  { className, ...props },
  ref,
) {
  return <BaseSelect.List ref={ref} className={cn(styles.list, className)} {...props} />;
});

// ─── Item ──────────────────────────────────────────────────────────────────────

export interface SelectItemProps extends ComponentPropsWithoutRef<typeof BaseSelect.Item> {
  className?: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <BaseSelect.Item
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(styles.item, className)}
      {...props}
    >
      <BaseSelect.ItemIndicator className={styles.itemIndicator}>
        <Icon icon={Check} size="sm" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className={styles.itemText}>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
});

// ─── ItemIndicator ─────────────────────────────────────────────────────────────

export interface SelectItemIndicatorProps
  extends ComponentPropsWithoutRef<typeof BaseSelect.ItemIndicator> {
  className?: string;
}

const SelectItemIndicator = forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(
  function SelectItemIndicator({ className, ...props }, ref) {
    return (
      <BaseSelect.ItemIndicator
        ref={ref}
        className={cn(styles.itemIndicator, className)}
        {...props}
      />
    );
  },
);

// ─── ItemText ──────────────────────────────────────────────────────────────────

export interface SelectItemTextProps
  extends ComponentPropsWithoutRef<typeof BaseSelect.ItemText> {
  className?: string;
}

const SelectItemText = forwardRef<HTMLDivElement, SelectItemTextProps>(function SelectItemText(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.ItemText
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(styles.itemText, className)}
      {...props}
    />
  );
});

// ─── Group ─────────────────────────────────────────────────────────────────────

export interface SelectGroupProps extends ComponentPropsWithoutRef<typeof BaseSelect.Group> {
  className?: string;
}

const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { className, ...props },
  ref,
) {
  return <BaseSelect.Group ref={ref} className={cn(styles.group, className)} {...props} />;
});

// ─── GroupLabel ────────────────────────────────────────────────────────────────

export interface SelectGroupLabelProps
  extends ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel> {
  className?: string;
}

const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>(
  function SelectGroupLabel({ className, ...props }, ref) {
    return (
      <BaseSelect.GroupLabel ref={ref} className={cn(styles.groupLabel, className)} {...props} />
    );
  },
);

// ─── Compound namespace export ─────────────────────────────────────────────────

/**
 * A select control built on Base UI `Select`. Compose the parts to build
 * single or grouped option lists. Use inside `<Field>` for label / error wiring.
 *
 * @example
 * ```tsx
 * <Select.Root>
 *   <Select.Trigger />
 *   <Select.Portal>
 *     <Select.Positioner sideOffset={8}>
 *       <Select.Popup>
 *         <Select.List>
 *           <Select.Item value="oslo">Oslo</Select.Item>
 *           <Select.Item value="bergen">Bergen</Select.Item>
 *         </Select.List>
 *       </Select.Popup>
 *     </Select.Positioner>
 *   </Select.Portal>
 * </Select.Root>
 * ```
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
};
