import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import type { OverlayWidth } from '../../utils/overlayWidth.js';
import styles from './Autocomplete.module.css';

// ---- Public prop types ----
export type AutocompleteRootProps<ItemValue> = BaseAutocomplete.Root.Props<ItemValue>;
export type AutocompleteControlProps = HTMLAttributes<HTMLDivElement>;
export type AutocompleteTriggerProps = BaseAutocomplete.Trigger.Props;
export type AutocompleteInputProps = BaseAutocomplete.Input.Props;
export type AutocompleteIconProps = BaseAutocomplete.Icon.Props;
export type AutocompleteClearProps = BaseAutocomplete.Clear.Props;
export type AutocompletePositionerProps = BaseAutocomplete.Positioner.Props;
export interface AutocompletePopupProps extends BaseAutocomplete.Popup.Props {
  /**
   * How the popup decides its width. `anchor` (default) makes it at least as wide
   * as the trigger, then hugs content, capped at the viewport; `content` hugs
   * content with no trigger floor; `fill` matches the trigger width exactly. See
   * the overlay width policy in `base.css`.
   */
  width?: OverlayWidth;
}
export type AutocompleteListProps = BaseAutocomplete.List.Props;
export type AutocompleteItemProps = BaseAutocomplete.Item.Props;
export type AutocompleteGroupProps = BaseAutocomplete.Group.Props;
export type AutocompleteGroupLabelProps = BaseAutocomplete.GroupLabel.Props;
export type AutocompleteEmptyProps = BaseAutocomplete.Empty.Props;

// ---- Root ----
// AutocompleteRoot is an overloaded generic function; export it directly so both
// the flat-items and grouped-items overloads remain usable at call sites.
const Root = BaseAutocomplete.Root;

// ---- Control (styled input group container — not a Base UI part) ----
// Wraps the Input + Trigger into a single focused border container.
const Control = forwardRef<HTMLDivElement, AutocompleteControlProps>(
  function Control({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(styles.control, className)}
        {...props}
      />
    );
  },
);
Control.displayName = 'Autocomplete.Control';

// ---- Trigger ----
const Trigger = forwardRef<HTMLButtonElement, BaseAutocomplete.Trigger.Props>(
  function Trigger({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        {...props}
      />
    );
  },
);
Trigger.displayName = 'Autocomplete.Trigger';

// ---- Input ----
const Input = forwardRef<HTMLInputElement, BaseAutocomplete.Input.Props>(
  function Input({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Input
        ref={ref}
        className={cn(styles.input, className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Autocomplete.Input';

// ---- Icon ----
const Icon = forwardRef<HTMLDivElement, BaseAutocomplete.Icon.Props>(
  function Icon({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Icon
        ref={ref}
        className={cn(styles.icon, className)}
        {...props}
      />
    );
  },
);
Icon.displayName = 'Autocomplete.Icon';

// ---- Clear ----
const Clear = forwardRef<HTMLButtonElement, BaseAutocomplete.Clear.Props>(
  function Clear({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Clear
        ref={ref}
        className={cn(styles.clear, className)}
        {...props}
      />
    );
  },
);
Clear.displayName = 'Autocomplete.Clear';

// ---- Positioner ----
const Positioner = forwardRef<HTMLDivElement, BaseAutocomplete.Positioner.Props>(
  function Positioner({ className, ...props }, ref) {
    const scope = useScopeDataAttrs();
    return (
      <BaseAutocomplete.Positioner
        ref={ref}
        className={cn(styles.positioner, className)}
        {...scope}
        {...props}
      />
    );
  },
);
Positioner.displayName = 'Autocomplete.Positioner';

// ---- Popup ----
const Popup = forwardRef<HTMLDivElement, AutocompletePopupProps>(
  function Popup({ className, width = 'anchor', ...props }, ref) {
    return (
      <BaseAutocomplete.Popup
        ref={ref}
        className={cn(styles.popup, className)}
        data-eidra-width={width}
        {...props}
      />
    );
  },
);
Popup.displayName = 'Autocomplete.Popup';

// ---- List ----
const List = forwardRef<HTMLDivElement, BaseAutocomplete.List.Props>(
  function List({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.List
        ref={ref}
        className={cn(styles.list, className)}
        {...props}
      />
    );
  },
);
List.displayName = 'Autocomplete.List';

// ---- Item ----
const Item = forwardRef<HTMLDivElement, BaseAutocomplete.Item.Props>(
  function Item({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Item
        ref={ref}
        className={cn(styles.item, className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'Autocomplete.Item';

// ---- Group ----
const Group = forwardRef<HTMLDivElement, BaseAutocomplete.Group.Props>(
  function Group({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Group
        ref={ref}
        className={cn(styles.group, className)}
        {...props}
      />
    );
  },
);
Group.displayName = 'Autocomplete.Group';

// ---- GroupLabel ----
const GroupLabel = forwardRef<HTMLDivElement, BaseAutocomplete.GroupLabel.Props>(
  function GroupLabel({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.GroupLabel
        ref={ref}
        className={cn(styles.groupLabel, className)}
        {...props}
      />
    );
  },
);
GroupLabel.displayName = 'Autocomplete.GroupLabel';

// ---- Empty ----
const Empty = forwardRef<HTMLDivElement, BaseAutocomplete.Empty.Props>(
  function Empty({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Empty
        ref={ref}
        className={cn(styles.empty, className)}
        {...props}
      />
    );
  },
);
Empty.displayName = 'Autocomplete.Empty';

// ---- Portal (pass-through — no DOM element to style) ----
const Portal = BaseAutocomplete.Portal;

// ---- Compound namespace export ----
export const Autocomplete = {
  Root,
  Control,
  Trigger,
  Input,
  Icon,
  Clear,
  Portal,
  Positioner,
  Popup,
  List,
  Item,
  Group,
  GroupLabel,
  Empty,
};
