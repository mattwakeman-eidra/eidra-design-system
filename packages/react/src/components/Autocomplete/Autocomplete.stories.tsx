import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, X, Search, MapPin, Briefcase, Users } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Autocomplete } from './Autocomplete.js';

// ---- Demo data ----

const NORDIC_CITIES = [
  'Copenhagen',
  'Stockholm',
  'Oslo',
  'Helsinki',
  'Reykjavik',
  'Gothenburg',
  'Malmö',
  'Bergen',
  'Tampere',
  'Aarhus',
  'Turku',
  'Tromsø',
];

const CONSULTING_SERVICES = [
  'Digital Transformation',
  'Cloud Architecture',
  'Product Strategy',
  'UX Research',
  'Data Engineering',
  'DevOps & Platform',
  'Organisational Design',
  'Sustainability Advisory',
];

type ServiceOption = { value: string; label: string; region: string };

const GROUPED_OPTIONS: ServiceOption[] = [
  { value: 'tech-cloud', label: 'Cloud Architecture', region: 'Technology' },
  { value: 'tech-data', label: 'Data Engineering', region: 'Technology' },
  { value: 'tech-devops', label: 'DevOps & Platform', region: 'Technology' },
  { value: 'strategy-product', label: 'Product Strategy', region: 'Strategy' },
  { value: 'strategy-digital', label: 'Digital Transformation', region: 'Strategy' },
  { value: 'strategy-org', label: 'Organisational Design', region: 'Strategy' },
  { value: 'design-ux', label: 'UX Research', region: 'Design' },
  { value: 'design-systems', label: 'Design Systems', region: 'Design' },
];

// ---- Reusable layout helpers ----

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)', maxWidth: 360 }}>
    {children}
  </div>
);

// ---- Meta ----

const meta = {
  title: 'Forms/Autocomplete',
  component: Autocomplete.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Autocomplete.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Playground ----

export const Playground: Story = {
  render: () => (
    <Autocomplete.Root items={NORDIC_CITIES}>
      <Autocomplete.Control>
        <Autocomplete.Input placeholder="Search cities…" />
        <Autocomplete.Trigger aria-label="Open city list">
          <Autocomplete.Icon>
            <Icon icon={ChevronDown} size="sm" />
          </Autocomplete.Icon>
        </Autocomplete.Trigger>
      </Autocomplete.Control>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {(city: string) => (
                <Autocomplete.Item key={city} value={city}>
                  {city}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty>No cities found</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search cities…');

    await step('typing filters the list (portaled options match the query)', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'oslo');
      const option = await screen.findByRole('option', { name: /^Oslo$/ });
      await waitFor(() => expect(option).toBeVisible());
      // Non-matching cities are filtered out.
      await waitFor(() => expect(screen.queryByRole('option', { name: /^Helsinki$/ })).toBeNull());
    });

    await step('a query with no matches shows the Empty state', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'zzz');
      await waitFor(async () => expect(await screen.findByText('No cities found')).toBeVisible());
    });

    await step('clearing the query restores all options', async () => {
      await userEvent.clear(input);
      const helsinki = await screen.findByRole('option', { name: /^Helsinki$/ });
      await waitFor(() => expect(helsinki).toBeVisible());
    });
  },
};

// ---- Open via trigger / keyboard selection ----

export const TriggerAndKeyboard: Story = {
  name: 'Trigger + Keyboard',
  render: () => (
    <Autocomplete.Root items={NORDIC_CITIES}>
      <Autocomplete.Control>
        <Autocomplete.Input placeholder="Search cities…" />
        <Autocomplete.Trigger aria-label="Open city list">
          <Autocomplete.Icon>
            <Icon icon={ChevronDown} size="sm" />
          </Autocomplete.Icon>
        </Autocomplete.Trigger>
      </Autocomplete.Control>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {(city: string) => (
                <Autocomplete.Item key={city} value={city}>
                  {city}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty>No cities found</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search cities…');
    const trigger = canvas.getByRole('button', { name: /open city list/i });

    await step('the trigger opens the popup (aria-expanded flips true)', async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(trigger);
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
      const copenhagen = await screen.findByRole('option', { name: /^Copenhagen$/ });
      await waitFor(() => expect(copenhagen).toBeVisible());
    });

    await step('ArrowDown highlights an option, Enter selects it into the input', async () => {
      await userEvent.keyboard('{ArrowDown}');
      const first = await screen.findByRole('option', { name: /^Copenhagen$/ });
      await waitFor(() => expect(first).toHaveAttribute('data-highlighted'));
      await userEvent.keyboard('{Enter}');
      await expect(input).toHaveValue('Copenhagen');
    });

    await step('the popup closes after selection', async () => {
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    });

    await step('Escape closes a reopened popup', async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
      await waitFor(() => expect(screen.queryByRole('option')).toBeNull());
    });
  },
};

// ---- onOpenChange callback ----

export const OpenChangeCallback: Story = {
  name: 'onOpenChange (callback)',
  parameters: { controls: { disable: true } },
  args: { onOpenChange: fn() },
  render: (args) => (
    <Autocomplete.Root items={NORDIC_CITIES} onOpenChange={args.onOpenChange}>
      <Autocomplete.Control>
        <Autocomplete.Input placeholder="Search cities…" />
        <Autocomplete.Trigger aria-label="Open city list">
          <Autocomplete.Icon>
            <Icon icon={ChevronDown} size="sm" />
          </Autocomplete.Icon>
        </Autocomplete.Trigger>
      </Autocomplete.Control>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {(city: string) => (
                <Autocomplete.Item key={city} value={city}>
                  {city}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty>No cities found</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open city list/i });

    await step('opening via the trigger fires onOpenChange(true)', async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(true, expect.anything()));
    });

    await step('Escape fires onOpenChange(false)', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false, expect.anything()));
    });
  },
};

// ---- onValueChange callback (uncontrolled input text) ----

export const ValueChangeCallback: Story = {
  name: 'onValueChange (callback)',
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => (
    <Autocomplete.Root items={NORDIC_CITIES} onValueChange={args.onValueChange}>
      <Autocomplete.Control>
        <Autocomplete.Input placeholder="Search cities…" />
        <Autocomplete.Trigger aria-label="Open city list">
          <Autocomplete.Icon>
            <Icon icon={ChevronDown} size="sm" />
          </Autocomplete.Icon>
        </Autocomplete.Trigger>
      </Autocomplete.Control>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {(city: string) => (
                <Autocomplete.Item key={city} value={city}>
                  {city}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty>No cities found</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search cities…');

    await step('typing fires onValueChange with the typed text', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'Bergen');
      await waitFor(() => expect(args.onValueChange).toHaveBeenCalledWith('Bergen', expect.anything()));
    });

    await step('selecting an option fires onValueChange with the option value', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'Tro');
      const option = await screen.findByRole('option', { name: /^Tromsø$/ });
      await userEvent.click(option);
      await waitFor(() => expect(args.onValueChange).toHaveBeenCalledWith('Tromsø', expect.anything()));
    });
  },
};

// ---- Controlled input value ----

export const ControlledValue: Story = {
  name: 'Controlled Value',
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Stack>
        <p style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)', margin: 0 }}>
          Input value: <strong style={{ color: 'var(--eidra-fg)' }}>{value || '—'}</strong>
        </p>
        <Autocomplete.Root items={NORDIC_CITIES} value={value} onValueChange={setValue}>
          <Autocomplete.Control>
            <Autocomplete.Input placeholder="Search cities…" />
            <Autocomplete.Trigger aria-label="Open city list">
              <Autocomplete.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Autocomplete.Icon>
            </Autocomplete.Trigger>
          </Autocomplete.Control>
          <Autocomplete.Portal>
            <Autocomplete.Positioner sideOffset={4}>
              <Autocomplete.Popup>
                <Autocomplete.List>
                  {(city: string) => (
                    <Autocomplete.Item key={city} value={city}>
                      {city}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
                <Autocomplete.Empty>No cities found</Autocomplete.Empty>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search cities…');

    await step('the host-owned value drives the input and the readout', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'Malmö');
      await expect(input).toHaveValue('Malmö');
      await expect(canvas.getByText('Malmö', { selector: 'strong' })).toBeInTheDocument();
    });

    await step('selecting an option updates the controlled value', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'Aar');
      const option = await screen.findByRole('option', { name: /^Aarhus$/ });
      await userEvent.click(option);
      await waitFor(() => expect(input).toHaveValue('Aarhus'));
    });
  },
};

// ---- With clear button ----

export const WithClearButton: Story = {
  name: 'With Clear Button',
  render: () => (
    <Autocomplete.Root items={CONSULTING_SERVICES}>
      <Autocomplete.Control>
        <Autocomplete.Input placeholder="Search services…" />
        <Autocomplete.Clear aria-label="Clear selection">
          <Icon icon={X} size="sm" />
        </Autocomplete.Clear>
        <Autocomplete.Trigger aria-label="Open services list">
          <Autocomplete.Icon>
            <Icon icon={ChevronDown} size="sm" />
          </Autocomplete.Icon>
        </Autocomplete.Trigger>
      </Autocomplete.Control>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {(service: string) => (
                <Autocomplete.Item key={service} value={service}>
                  {service}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty>No services found</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search services…');

    await step('the Clear button empties the input', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'Cloud');
      await expect(input).toHaveValue('Cloud');
      // Autocomplete.Clear mounts (through a transition) once the input has a
      // value, but Base UI renders it aria-hidden/tabindex=-1 — out of the
      // accessibility tree — so it can't be queried by role. Grab the real button.
      const clear = await waitFor(() => {
        const b = document.querySelector<HTMLButtonElement>('button[aria-label="Clear selection"]');
        if (!b) throw new Error('clear button not mounted yet');
        return b;
      });
      await userEvent.click(clear, { pointerEventsCheck: 0 });
      await waitFor(() => expect(input).toHaveValue(''));
    });

    await step('after clearing, typing surfaces options again', async () => {
      await userEvent.type(input, 'Strategy');
      const productStrategy = await screen.findByRole('option', { name: /Product Strategy/ });
      await waitFor(() => expect(productStrategy).toBeVisible());
    });
  },
};

// ---- With search icon ----

export const WithSearchIcon: Story = {
  name: 'With Search Icon',
  render: () => (
    <Autocomplete.Root items={NORDIC_CITIES}>
      <Autocomplete.Control>
        <span style={{ color: 'var(--eidra-fg-subtle)', display: 'inline-flex', flex: 'none' }}>
          <Icon icon={Search} size="sm" />
        </span>
        <Autocomplete.Input placeholder="Find an office location…" />
        <Autocomplete.Trigger aria-label="Open location list">
          <Autocomplete.Icon>
            <Icon icon={ChevronDown} size="sm" />
          </Autocomplete.Icon>
        </Autocomplete.Trigger>
      </Autocomplete.Control>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {(city: string) => (
                <Autocomplete.Item key={city} value={city}>
                  <span style={{ display: 'inline-flex', color: 'var(--eidra-fg-subtle)' }}>
                    <Icon icon={MapPin} size="sm" />
                  </span>
                  {city}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            <Autocomplete.Empty>No locations found</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
};

// ---- Grouped options ----

export const GroupedOptions: Story = {
  name: 'Grouped Options',
  render: () => {
    // Base UI only filters (and unmounts) grouped options when it owns the data:
    // pass *grouped* items to Root, then render via the function-child Collection
    // pattern so non-matching items leave the DOM as the query narrows.
    const groupIcons: Record<string, typeof Briefcase> = {
      Technology: Briefcase,
      Strategy: Users,
      Design: Search,
    };
    const groupedItems = ['Technology', 'Strategy', 'Design'].map((region) => ({
      value: region,
      items: GROUPED_OPTIONS.filter((o) => o.region === region),
    }));

    return (
      <Autocomplete.Root items={groupedItems} itemToStringValue={(item) => item.label}>
        <Autocomplete.Control>
          <Autocomplete.Input placeholder="Search services…" />
          <Autocomplete.Trigger aria-label="Open services list">
            <Autocomplete.Icon>
              <Icon icon={ChevronDown} size="sm" />
            </Autocomplete.Icon>
          </Autocomplete.Trigger>
        </Autocomplete.Control>
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={4}>
            <Autocomplete.Popup>
              <Autocomplete.List>
                {(group: { value: string; items: ServiceOption[] }) => {
                  const LucideIcon = groupIcons[group.value] ?? Briefcase;
                  // Root owns the grouped filtering, so each surviving group's
                  // `items` is already the matched subset — non-matching options
                  // are absent here, not merely hidden.
                  return (
                    <Autocomplete.Group key={group.value} items={group.items}>
                      <Autocomplete.GroupLabel>
                        <span style={{ display: 'inline-flex', gap: 'var(--eidra-space-1)', alignItems: 'center' }}>
                          <Icon icon={LucideIcon} size="sm" />
                          {group.value}
                        </span>
                      </Autocomplete.GroupLabel>
                      {group.items.map((item) => (
                        <Autocomplete.Item key={item.value} value={item}>
                          {item.label}
                        </Autocomplete.Item>
                      ))}
                    </Autocomplete.Group>
                  );
                }}
              </Autocomplete.List>
              <Autocomplete.Empty>No services match your search</Autocomplete.Empty>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search services…');

    await step('typing surfaces matching grouped options (object items via itemToStringValue)', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'a');
      const cloud = await screen.findByRole('option', { name: /Cloud Architecture/ });
      await waitFor(() => expect(cloud).toBeVisible());
    });

    await step('a more specific query narrows results across groups', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'Design');
      const designSystems = await screen.findByRole('option', { name: /Design Systems/ });
      await waitFor(() => expect(designSystems).toBeVisible());
      await waitFor(() =>
        expect(screen.queryByRole('option', { name: /Cloud Architecture/ })).toBeNull(),
      );
    });

    await step('selecting an object option fills its label into the input', async () => {
      await userEvent.click(await screen.findByRole('option', { name: /Design Systems/ }));
      await waitFor(() => expect(input).toHaveValue('Design Systems'));
    });
  },
};

// ---- Auto-highlight mode ----

export const AutoHighlight: Story = {
  name: 'Auto Highlight',
  render: () => (
    <Stack>
      <p style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)', margin: 0 }}>
        The first matching city is highlighted automatically as you type.
      </p>
      <Autocomplete.Root items={NORDIC_CITIES} autoHighlight>
        <Autocomplete.Control>
          <Autocomplete.Input placeholder="Start typing…" />
          <Autocomplete.Trigger aria-label="Open city list">
            <Autocomplete.Icon>
              <Icon icon={ChevronDown} size="sm" />
            </Autocomplete.Icon>
          </Autocomplete.Trigger>
        </Autocomplete.Control>
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={4}>
            <Autocomplete.Popup>
              <Autocomplete.List>
                {(city: string) => (
                  <Autocomplete.Item key={city} value={city}>
                    {city}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
              <Autocomplete.Empty>No cities found</Autocomplete.Empty>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Start typing…');

    await step('the first match is auto-highlighted as you type', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'sto');
      const stockholm = await screen.findByRole('option', { name: /^Stockholm$/ });
      await waitFor(() => expect(stockholm).toHaveAttribute('data-highlighted'));
    });

    await step('Enter selects the auto-highlighted match', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(input).toHaveValue('Stockholm');
    });
  },
};

// ---- Inline completion mode ----

export const InlineCompletion: Story = {
  name: 'Inline Completion (both)',
  render: () => (
    <Stack>
      <p style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)', margin: 0 }}>
        <code>mode="both"</code> — filters the list and fills in the input as you navigate.
      </p>
      <Autocomplete.Root items={NORDIC_CITIES} mode="both">
        <Autocomplete.Control>
          <Autocomplete.Input placeholder="Start typing…" />
          <Autocomplete.Trigger aria-label="Open city list">
            <Autocomplete.Icon>
              <Icon icon={ChevronDown} size="sm" />
            </Autocomplete.Icon>
          </Autocomplete.Trigger>
        </Autocomplete.Control>
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={4}>
            <Autocomplete.Popup>
              <Autocomplete.List>
                {(city: string) => (
                  <Autocomplete.Item key={city} value={city}>
                    {city}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
              <Autocomplete.Empty>No cities found</Autocomplete.Empty>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Start typing…');

    await step('typing filters the list (mode="both")', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'Rey');
      const reykjavik = await screen.findByRole('option', { name: /^Reykjavik$/ });
      await waitFor(() => expect(reykjavik).toBeVisible());
      await waitFor(() => expect(screen.queryByRole('option', { name: /^Oslo$/ })).toBeNull());
    });

    await step('ArrowDown then Enter completes the input', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');
      await expect(input).toHaveValue('Reykjavik');
    });
  },
};
