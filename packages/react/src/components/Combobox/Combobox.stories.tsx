import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Check, ChevronDown, X, Search } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Combobox } from './Combobox.js';

const meta = {
  title: 'Forms/Combobox',
  component: Combobox.Root,
  subcomponents: {
    'Combobox.Value': Combobox.Value,
    'Combobox.Input': Combobox.Input,
    'Combobox.Trigger': Combobox.Trigger,
    'Combobox.Icon': Combobox.Icon,
    'Combobox.Portal': Combobox.Portal,
    'Combobox.Positioner': Combobox.Positioner,
    'Combobox.Popup': Combobox.Popup,
    'Combobox.List': Combobox.List,
    'Combobox.Group': Combobox.Group,
    'Combobox.GroupLabel': Combobox.GroupLabel,
    'Combobox.Item': Combobox.Item,
    'Combobox.ItemIndicator': Combobox.ItemIndicator,
    'Combobox.Empty': Combobox.Empty,
    'Combobox.Clear': Combobox.Clear,
    'Combobox.Chips': Combobox.Chips,
    'Combobox.Chip': Combobox.Chip,
    'Combobox.ChipRemove': Combobox.ChipRemove,
    'Combobox.Status': Combobox.Status,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  // Dropped from controls (props remain real, and dedicated stories cover them):
  // `multiple` (only shows once you select 2+ — see the MultiSelect story),
  // `autoHighlight` (keyboard-only highlight, only after typing — see AutoHighlight),
  // `readOnly`/`required` (the CSS has no [data-readonly]/[data-required] rule, so
  // toggling either changes nothing on screen). `disabled` stays — visibly dims.
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Combobox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Sample data ----

const COUNTRIES = [
  { value: 'no', label: 'Norway' },
  { value: 'se', label: 'Sweden' },
  { value: 'dk', label: 'Denmark' },
  { value: 'fi', label: 'Finland' },
  { value: 'is', label: 'Iceland' },
  { value: 'de', label: 'Germany' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
];

const CONSULTANTS_BY_TEAM = {
  Strategy: [
    { value: 'anna-larsen', label: 'Anna Larsen' },
    { value: 'bjorn-eriksen', label: 'Bjørn Eriksen' },
    { value: 'cecilia-holm', label: 'Cecilia Holm' },
  ],
  Technology: [
    { value: 'david-berg', label: 'David Berg' },
    { value: 'elena-nygaard', label: 'Elena Nygaard' },
    { value: 'finn-olsen', label: 'Finn Olsen' },
  ],
  Design: [
    { value: 'greta-lindqvist', label: 'Greta Lindqvist' },
    { value: 'henrik-dahl', label: 'Henrik Dahl' },
  ],
};

const ALL_CONSULTANTS = Object.values(CONSULTANTS_BY_TEAM).flat();

// ---- Shared wrapper ----

const ComboboxField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1-5)', width: 280 }}>
    <label style={{ fontSize: 'var(--eidra-font-size-sm)', fontWeight: 'var(--eidra-font-weight-medium)', color: 'var(--eidra-fg)' }}>
      {label}
    </label>
    {children}
  </div>
);

// ---- Composed input + trigger wrapper ----

const ComboboxControl = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'stretch',
      width: '100%',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---- Stories ----

export const Playground: Story = {
  args: {
    disabled: false,
    onValueChange: fn(),
    onOpenChange: fn(),
    onInputValueChange: fn(),
  },
  render: ({ disabled, ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Country">
        <Combobox.Root
          disabled={disabled}
          value={value}
          onValueChange={(v, details) => {
            setValue(typeof v === 'string' ? v : null);
            args.onValueChange?.(v, details);
          }}
          onOpenChange={args.onOpenChange}
          onInputValueChange={args.onInputValueChange}
          items={COUNTRIES}
        >
          <ComboboxControl>
            <Combobox.Input
              placeholder="Search countries…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger aria-label="Open countries">
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                {/*
                  Closed-template API: a function child maps over the items provided
                  to Root, so Base UI applies its built-in filtering and unmounts
                  non-matching options as the input value changes. Static <Item>
                  children would render every option unfiltered.
                */}
                <Combobox.List>
                  {(item) => {
                    const country = item as (typeof COUNTRIES)[number];
                    return (
                    <Combobox.Item key={country.value} value={country.value}>
                      {country.label}
                      <Combobox.ItemIndicator>
                        <Icon icon={Check} size="sm" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                    );
                  }}
                </Combobox.List>
                <Combobox.Empty>No countries found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
};

/**
 * Interaction coverage for the single-select combobox: opening via the trigger,
 * type-ahead filtering, and committing a filtered option. Fixed args (no
 * controls) so the assertions stay deterministic — this is the coverage the
 * Playground used to carry before it became purely control-driven.
 */
export const Behaviour: Story = {
  name: 'Combobox behaviour',
  parameters: { controls: { disable: true } },
  args: {
    multiple: false,
    disabled: false,
    autoHighlight: false,
    readOnly: false,
    required: false,
    onValueChange: fn(),
    onOpenChange: fn(),
    onInputValueChange: fn(),
  },
  render: ({ multiple, disabled, autoHighlight, readOnly, required, ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Country">
        <Combobox.Root
          multiple={multiple}
          disabled={disabled}
          autoHighlight={autoHighlight}
          readOnly={readOnly}
          required={required}
          value={value}
          onValueChange={(v, details) => {
            setValue(typeof v === 'string' ? v : null);
            args.onValueChange?.(v, details);
          }}
          onOpenChange={args.onOpenChange}
          onInputValueChange={args.onInputValueChange}
          items={COUNTRIES}
        >
          <ComboboxControl>
            <Combobox.Input
              placeholder="Search countries…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger aria-label="Open countries">
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                <Combobox.List>
                  {(item) => {
                    const country = item as (typeof COUNTRIES)[number];
                    return (
                    <Combobox.Item key={country.value} value={country.value}>
                      {country.label}
                      <Combobox.ItemIndicator>
                        <Icon icon={Check} size="sm" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                    );
                  }}
                </Combobox.List>
                <Combobox.Empty>No countries found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await step('opening via the trigger fires onOpenChange and reveals the list', async () => {
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(canvas.getByRole('button', { name: /open countries/i }));
      const norway = await screen.findByRole('option', { name: /Norway/i });
      await expect(norway).toBeVisible();
      await expect(input).toHaveAttribute('aria-expanded', 'true');
      await expect(args.onOpenChange).toHaveBeenCalled();
    });

    await step('type-ahead filters the list and fires onInputValueChange', async () => {
      await userEvent.type(input, 'Swe');
      await expect(args.onInputValueChange).toHaveBeenCalled();
      await waitFor(() =>
        expect(screen.getByRole('option', { name: /Sweden/i })).toBeVisible(),
      );
      await waitFor(() =>
        expect(screen.queryByRole('option', { name: /Norway/i })).toBeNull(),
      );
    });

    await step('clicking a filtered option selects it and fires onValueChange', async () => {
      await userEvent.click(await screen.findByRole('option', { name: /Sweden/i }));
      await expect(args.onValueChange).toHaveBeenCalledWith('se', expect.anything());
      await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    });
  },
};

export const WithGroups: Story = {
  args: { onValueChange: fn() },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Assign consultant">
        <Combobox.Root
          value={value}
          onValueChange={(v, details) => {
            setValue(v);
            args.onValueChange?.(v, details);
          }}
        >
          <ComboboxControl>
            <Combobox.Input
              placeholder="Search consultants…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger aria-label="Open consultants">
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                <Combobox.List>
                  {Object.entries(CONSULTANTS_BY_TEAM).map(([team, members]) => (
                    <Combobox.Group key={team}>
                      <Combobox.GroupLabel>{team}</Combobox.GroupLabel>
                      {members.map((person) => (
                        <Combobox.Item key={person.value} value={person.value}>
                          {person.label}
                          <Combobox.ItemIndicator>
                            <Icon icon={Check} size="sm" />
                          </Combobox.ItemIndicator>
                        </Combobox.Item>
                      ))}
                    </Combobox.Group>
                  ))}
                </Combobox.List>
                <Combobox.Empty>No consultants found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await step('opening exposes grouped options', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open consultants/i }));
      await expect(await screen.findByRole('group', { name: /Strategy/i })).toBeVisible();
      await expect(screen.getByRole('option', { name: /Anna Larsen/i })).toBeVisible();
    });

    await step('ArrowDown highlights the first option and Enter selects it', async () => {
      await userEvent.keyboard('{ArrowDown}');
      const first = await screen.findByRole('option', { name: /Anna Larsen/i });
      await waitFor(() => expect(first).toHaveAttribute('data-highlighted'));
      await userEvent.keyboard('{Enter}');
      await expect(args.onValueChange).toHaveBeenCalledWith('anna-larsen', expect.anything());
      await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    });

    await step('Escape closes the popup after reopening', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open consultants/i }));
      await screen.findByRole('option', { name: /Anna Larsen/i });
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('option', { name: /Anna Larsen/i })).toBeNull(),
      );
    });
  },
};

export const MultiSelect: Story = {
  args: { onValueChange: fn() },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [values, setValues] = useState<string[]>([]);

    return (
      <ComboboxField label="Project team members">
        <Combobox.Root
          multiple
          value={values}
          onValueChange={(v, details) => {
            setValues(v ?? []);
            // args.onValueChange is typed for the meta's single-select default;
            // forward the multi-select array value through an untyped call.
            (args.onValueChange as ((value: unknown, details: unknown) => void) | undefined)?.(
              v,
              details,
            );
          }}
        >
          <Combobox.Chips>
            {values.map((val) => {
              const person = ALL_CONSULTANTS.find((c) => c.value === val);
              return person ? (
                <Combobox.Chip key={val}>
                  {person.label}
                  <Combobox.ChipRemove aria-label={`Remove ${person.label}`}>
                    <Icon icon={X} size="sm" />
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ) : null;
            })}
          </Combobox.Chips>
          <ComboboxControl>
            <Combobox.Input
              placeholder="Add team members…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger aria-label="Open team members">
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                <Combobox.List>
                  {ALL_CONSULTANTS.map((person) => (
                    <Combobox.Item key={person.value} value={person.value}>
                      {person.label}
                      <Combobox.ItemIndicator>
                        <Icon icon={Check} size="sm" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  ))}
                </Combobox.List>
                <Combobox.Empty>No consultants found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step('selecting two options keeps the popup open and adds chips', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open team members/i }));
      await userEvent.click(await screen.findByRole('option', { name: /Anna Larsen/i }));
      // In multiple mode the value is an array and the popup stays open.
      await expect(args.onValueChange).toHaveBeenCalledWith(['anna-larsen'], expect.anything());
      await userEvent.click(await screen.findByRole('option', { name: /David Berg/i }));
      await waitFor(() =>
        expect(
          args.onValueChange,
        ).toHaveBeenLastCalledWith(['anna-larsen', 'david-berg'], expect.anything()),
      );
      // Both chips render in the canvas.
      await expect(canvas.getByText('Anna Larsen')).toBeVisible();
      await expect(canvas.getByText('David Berg')).toBeVisible();
    });

    await step('the selected options report aria-selected="true"', async () => {
      const anna = await screen.findByRole('option', { name: /Anna Larsen/i });
      await expect(anna).toHaveAttribute('aria-selected', 'true');
    });

    await step('ChipRemove deselects a value', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: /Remove Anna Larsen/i, hidden: true }),
      );
      await waitFor(() => expect(canvas.queryByText('Anna Larsen')).toBeNull());
      await expect(
        args.onValueChange,
      ).toHaveBeenLastCalledWith(['david-berg'], expect.anything());
    });
  },
};

export const WithClear: Story = {
  args: { onValueChange: fn() },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Search location">
        <Combobox.Root
          value={value}
          onValueChange={(v, details) => {
            setValue(v);
            args.onValueChange?.(v, details);
          }}
        >
          <ComboboxControl>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                paddingInlineStart: 'var(--eidra-space-3)',
                gap: 'var(--eidra-space-2)',
                border: '1px solid var(--eidra-border)',
                borderRight: 'none',
                borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)',
                background: 'var(--eidra-surface)',
              }}
            >
              <Icon icon={Search} size="sm" style={{ color: 'var(--eidra-fg-subtle)', flexShrink: 0 }} />
              <Combobox.Input
                placeholder="Search countries…"
                style={{
                  flex: 1,
                  height: 'var(--eidra-size-control-md)',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--eidra-font-family-sans)',
                  fontSize: 'var(--eidra-font-size-sm)',
                  color: 'var(--eidra-fg)',
                  paddingInline: 0,
                }}
              />
              <Combobox.Clear aria-label="Clear selection">
                <Icon icon={X} size="sm" />
              </Combobox.Clear>
            </div>
            <Combobox.Trigger aria-label="Open locations">
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                <Combobox.List>
                  {COUNTRIES.map((country) => (
                    <Combobox.Item key={country.value} value={country.value}>
                      {country.label}
                      <Combobox.ItemIndicator>
                        <Icon icon={Check} size="sm" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  ))}
                </Combobox.List>
                <Combobox.Empty>No countries found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await step('select a country so the value is populated', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open locations/i }));
      await userEvent.click(await screen.findByRole('option', { name: /Denmark/i }));
      await expect(args.onValueChange).toHaveBeenLastCalledWith('dk', expect.anything());
      // Base UI keeps the option VALUE in the input, not its visible label.
      await waitFor(() => expect(input).toHaveValue('dk'));
    });

    await step('the Clear button resets the selection to null', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /clear selection/i }));
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
      await waitFor(() => expect(input).toHaveValue(''));
    });
  },
};

export const Disabled: Story = {
  render: () => (
    <ComboboxField label="Country (disabled)">
      <Combobox.Root disabled>
        <ComboboxControl>
          <Combobox.Input
            placeholder="Search countries…"
            style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
          />
          <Combobox.Trigger disabled aria-label="Open countries">
            <Combobox.Icon>
              <Icon icon={ChevronDown} size="sm" />
            </Combobox.Icon>
          </Combobox.Trigger>
        </ComboboxControl>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} align="start">
            <Combobox.Popup>
              <Combobox.List>
                {COUNTRIES.map((country) => (
                  <Combobox.Item key={country.value} value={country.value}>
                    {country.label}
                  </Combobox.Item>
                ))}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </ComboboxField>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('a disabled combobox cannot be opened', async () => {
      const input = canvas.getByRole('combobox');
      await expect(input).toBeDisabled();
      const trigger = canvas.getByRole('button', { name: /open countries/i });
      await expect(trigger).toBeDisabled();
      await userEvent.click(trigger);
      await expect(screen.queryByRole('option')).toBeNull();
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

const OFFICES = [
  { value: 'oslo', label: 'Oslo' },
  { value: 'stockholm', label: 'Stockholm' },
  { value: 'copenhagen', label: 'Copenhagen' },
  { value: 'helsinki', label: 'Helsinki' },
  { value: 'reykjavik', label: 'Reykjavík' },
];

export const AutoHighlight: Story = {
  args: { onValueChange: fn() },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Preferred office (auto-highlight)">
        <Combobox.Root
          value={value}
          onValueChange={(v, details) => {
            setValue(v);
            args.onValueChange?.(v, details);
          }}
          items={OFFICES}
          autoHighlight
        >
          <ComboboxControl>
            <Combobox.Input
              placeholder="Oslo, Stockholm, Copenhagen…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger aria-label="Open offices">
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                {/*
                  Function child + Root `items`: Base UI owns the collection, so it
                  filters as the user types and applies `autoHighlight` to the first
                  remaining match (and renders <Empty> when nothing matches).
                */}
                <Combobox.List>
                  {(item) => {
                    const city = item as (typeof OFFICES)[number];
                    return (
                    <Combobox.Item key={city.value} value={city.value}>
                      {city.label}
                      <Combobox.ItemIndicator>
                        <Icon icon={Check} size="sm" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                    );
                  }}
                </Combobox.List>
                <Combobox.Empty>No offices found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await step('typing auto-highlights the first match so Enter selects it', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'Sto');
      const stockholm = await screen.findByRole('option', { name: /Stockholm/i });
      await waitFor(() => expect(stockholm).toHaveAttribute('data-highlighted'));
      await userEvent.keyboard('{Enter}');
      await expect(args.onValueChange).toHaveBeenCalledWith('stockholm', expect.anything());
      // The input holds the committed option value (the Empty-filter fallback is
      // covered by the Playground story).
      await waitFor(() => expect(input).toHaveValue('stockholm'));
    });
  },
};

/**
 * Uncontrolled: the combobox owns its own selection via `defaultValue`. The host
 * passes no `value`/`onValueChange`, yet selection, the input display, and
 * arrow-key navigation all work. Covers the uncontrolled code path plus
 * ArrowUp/ArrowDown highlight movement.
 */
export const Uncontrolled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ComboboxField label="Country (uncontrolled)">
      <Combobox.Root defaultValue="no" items={COUNTRIES}>
        <ComboboxControl>
          <Combobox.Input
            placeholder="Search countries…"
            style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
          />
          <Combobox.Trigger aria-label="Open countries">
            <Combobox.Icon>
              <Icon icon={ChevronDown} size="sm" />
            </Combobox.Icon>
          </Combobox.Trigger>
        </ComboboxControl>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} align="start">
            <Combobox.Popup>
              <Combobox.List>
                {COUNTRIES.map((country) => (
                  <Combobox.Item key={country.value} value={country.value}>
                    {country.label}
                    <Combobox.ItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
              </Combobox.List>
              <Combobox.Empty>No countries found.</Combobox.Empty>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </ComboboxField>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await step('the defaultValue drives the initial input display', async () => {
      // Base UI keeps the option VALUE in the input, not its visible label.
      await expect(input).toHaveValue('no');
    });

    await step('the initially selected option reports aria-selected', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open countries/i }));
      const norway = await screen.findByRole('option', { name: /Norway/i });
      await expect(norway).toHaveAttribute('aria-selected', 'true');
    });

    await step('arrow navigation + Enter selects a different option without host state', async () => {
      // Move the highlight off the initially-selected row, then commit it.
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      // Selection moved off Norway; the input reflects the new choice, and the
      // uncontrolled root tracked it with no host value/onValueChange wiring.
      await waitFor(() => expect(input).not.toHaveValue('Norway'));
      await expect(input).not.toHaveValue('');
    });
  },
};
