import { forwardRef } from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { cn } from '../../utils/cn.js';
import { useScopeDataAttrs } from '../../utils/scope.js';
import styles from './Combobox.module.css';

// ---- Root ----

export type ComboboxRootProps<
  Value = string,
  Multiple extends boolean | undefined = false,
> = React.ComponentPropsWithoutRef<typeof BaseCombobox.Root<Value, Multiple>>;

function ComboboxRoot<Value = string, Multiple extends boolean | undefined = false>(
  props: ComboboxRootProps<Value, Multiple>,
) {
  return <BaseCombobox.Root {...props} />;
}
ComboboxRoot.displayName = 'Combobox.Root';

// ---- Value ----

export interface ComboboxValueProps {
  children?: React.ReactNode | ((selectedValue: unknown) => React.ReactNode);
}

function ComboboxValue(props: ComboboxValueProps) {
  return <BaseCombobox.Value {...props} />;
}
ComboboxValue.displayName = 'Combobox.Value';

// ---- Input ----

export interface ComboboxInputProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Input> {
  className?: string;
}

const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput({ className, ...props }, ref) {
    return (
      <BaseCombobox.Input
        ref={ref}
        className={cn(styles.input, className)}
        {...props}
      />
    );
  },
);

// ---- Trigger ----

export interface ComboboxTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Trigger> {
  className?: string;
}

const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  function ComboboxTrigger({ className, ...props }, ref) {
    return (
      <BaseCombobox.Trigger
        ref={ref}
        className={cn(styles.trigger, className)}
        {...props}
      />
    );
  },
);

// ---- Icon (chevron inside trigger) ----

export interface ComboboxIconProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Icon> {
  className?: string;
}

const ComboboxIcon = forwardRef<HTMLDivElement, ComboboxIconProps>(
  function ComboboxIcon({ className, children, ...props }, ref) {
    return (
      <BaseCombobox.Icon
        ref={ref}
        className={cn(styles.icon, className)}
        {...props}
      >
        {children ?? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </BaseCombobox.Icon>
    );
  },
);

// ---- Portal ----

export type ComboboxPortalProps = React.ComponentPropsWithoutRef<
  typeof BaseCombobox.Portal
>;

function ComboboxPortal(props: ComboboxPortalProps) {
  return <BaseCombobox.Portal {...props} />;
}
ComboboxPortal.displayName = 'Combobox.Portal';

// ---- Positioner ----

export interface ComboboxPositionerProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner> {
  className?: string;
}

const ComboboxPositioner = forwardRef<HTMLDivElement, ComboboxPositionerProps>(
  function ComboboxPositioner({ className, ...props }, ref) {
    const scope = useScopeDataAttrs();
    return (
      <BaseCombobox.Positioner
        ref={ref}
        className={cn(styles.positioner, className)}
        {...scope}
        {...props}
      />
    );
  },
);

// ---- Popup ----

export interface ComboboxPopupProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup> {
  className?: string;
}

const ComboboxPopup = forwardRef<HTMLDivElement, ComboboxPopupProps>(
  function ComboboxPopup({ className, ...props }, ref) {
    return (
      <BaseCombobox.Popup
        ref={ref}
        className={cn(styles.popup, className)}
        {...props}
      />
    );
  },
);

// ---- List ----

export interface ComboboxListProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseCombobox.List>,
    'children'
  > {
  className?: string;
  children?: React.ReactNode | ((item: unknown, index: number) => React.ReactNode);
}

const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(
  function ComboboxList({ className, ...props }, ref) {
    return (
      <BaseCombobox.List
        ref={ref}
        className={cn(styles.list, className)}
        {...props}
      />
    );
  },
);

// ---- Group ----

export interface ComboboxGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Group> {
  className?: string;
}

const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  function ComboboxGroup({ className, ...props }, ref) {
    return (
      <BaseCombobox.Group
        ref={ref}
        className={cn(styles.group, className)}
        {...props}
      />
    );
  },
);

// ---- GroupLabel ----

export interface ComboboxGroupLabelProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel> {
  className?: string;
}

const ComboboxGroupLabel = forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  function ComboboxGroupLabel({ className, ...props }, ref) {
    return (
      <BaseCombobox.GroupLabel
        ref={ref}
        className={cn(styles.groupLabel, className)}
        {...props}
      />
    );
  },
);

// ---- Item ----

export interface ComboboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Item> {
  className?: string;
}

const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  function ComboboxItem({ className, ...props }, ref) {
    return (
      <BaseCombobox.Item
        ref={ref}
        className={cn(styles.item, className)}
        {...props}
      />
    );
  },
);

// ---- ItemIndicator ----

export interface ComboboxItemIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.ItemIndicator> {
  className?: string;
}

const ComboboxItemIndicator = forwardRef<
  HTMLSpanElement,
  ComboboxItemIndicatorProps
>(function ComboboxItemIndicator({ className, children, ...props }, ref) {
  return (
    <BaseCombobox.ItemIndicator
      ref={ref}
      className={cn(styles.itemIndicator, className)}
      {...props}
    >
      {children ?? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6l3 3 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </BaseCombobox.ItemIndicator>
  );
});

// ---- Empty ----

export interface ComboboxEmptyProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty> {
  className?: string;
}

const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  function ComboboxEmpty({ className, ...props }, ref) {
    return (
      <BaseCombobox.Empty
        ref={ref}
        className={cn(styles.empty, className)}
        {...props}
      />
    );
  },
);

// ---- Clear ----

export interface ComboboxClearProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Clear> {
  className?: string;
}

const ComboboxClear = forwardRef<HTMLButtonElement, ComboboxClearProps>(
  function ComboboxClear({ className, ...props }, ref) {
    return (
      <BaseCombobox.Clear
        ref={ref}
        className={cn(styles.clear, className)}
        {...props}
      />
    );
  },
);

// ---- Chips ----

export interface ComboboxChipsProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips> {
  className?: string;
}

const ComboboxChips = forwardRef<HTMLDivElement, ComboboxChipsProps>(
  function ComboboxChips({ className, ...props }, ref) {
    return (
      <BaseCombobox.Chips
        ref={ref}
        className={cn(styles.chips, className)}
        {...props}
      />
    );
  },
);

// ---- Chip ----

export interface ComboboxChipProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Chip> {
  className?: string;
}

const ComboboxChip = forwardRef<HTMLDivElement, ComboboxChipProps>(
  function ComboboxChip({ className, ...props }, ref) {
    return (
      <BaseCombobox.Chip
        ref={ref}
        className={cn(styles.chip, className)}
        {...props}
      />
    );
  },
);

// ---- ChipRemove ----

export interface ComboboxChipRemoveProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.ChipRemove> {
  className?: string;
}

const ComboboxChipRemove = forwardRef<HTMLButtonElement, ComboboxChipRemoveProps>(
  function ComboboxChipRemove({ className, ...props }, ref) {
    return (
      <BaseCombobox.ChipRemove
        ref={ref}
        className={cn(styles.chipRemove, className)}
        {...props}
      />
    );
  },
);

// ---- Status ----

export interface ComboboxStatusProps
  extends React.ComponentPropsWithoutRef<typeof BaseCombobox.Status> {
  className?: string;
}

const ComboboxStatus = forwardRef<HTMLDivElement, ComboboxStatusProps>(
  function ComboboxStatus({ className, ...props }, ref) {
    return (
      <BaseCombobox.Status
        ref={ref}
        className={cn(styles.status, className)}
        {...props}
      />
    );
  },
);

// ---- Compound namespace export ----

/**
 * A searchable select built on Base UI Combobox. Compose the parts to build
 * single-select or multi-select comboboxes with full keyboard navigation and ARIA.
 *
 * @example
 * ```tsx
 * <Combobox.Root>
 *   <Combobox.Input placeholder="Search…" />
 *   <Combobox.Trigger>
 *     <Combobox.Icon />
 *   </Combobox.Trigger>
 *   <Combobox.Portal>
 *     <Combobox.Positioner sideOffset={4}>
 *       <Combobox.Popup>
 *         <Combobox.List>
 *           <Combobox.Item value="option-1">Option 1</Combobox.Item>
 *         </Combobox.List>
 *         <Combobox.Empty>No results found.</Combobox.Empty>
 *       </Combobox.Popup>
 *     </Combobox.Positioner>
 *   </Combobox.Portal>
 * </Combobox.Root>
 * ```
 */
export const Combobox = {
  Root: ComboboxRoot,
  Value: ComboboxValue,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Icon: ComboboxIcon,
  Portal: ComboboxPortal,
  Positioner: ComboboxPositioner,
  Popup: ComboboxPopup,
  List: ComboboxList,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Empty: ComboboxEmpty,
  Clear: ComboboxClear,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  Status: ComboboxStatus,
} as const;
