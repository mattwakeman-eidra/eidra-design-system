import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, X, Search, MapPin, Briefcase, Users } from '@eidra/icons';
import { Icon } from '@eidra/icons';
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
    const techItems = GROUPED_OPTIONS.filter((o) => o.region === 'Technology');
    const strategyItems = GROUPED_OPTIONS.filter((o) => o.region === 'Strategy');
    const designItems = GROUPED_OPTIONS.filter((o) => o.region === 'Design');

    const groups = [
      { label: 'Technology', icon: Briefcase, items: techItems },
      { label: 'Strategy', icon: Users, items: strategyItems },
      { label: 'Design', icon: Search, items: designItems },
    ];

    return (
      <Autocomplete.Root items={GROUPED_OPTIONS} itemToStringValue={(item) => item.label}>
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
                {groups.map(({ label, icon: LucideIcon, items }) => (
                  <Autocomplete.Group key={label} items={items}>
                    <Autocomplete.GroupLabel>
                      <span style={{ display: 'inline-flex', gap: 'var(--eidra-space-1)', alignItems: 'center' }}>
                        <Icon icon={LucideIcon} size="sm" />
                        {label}
                      </span>
                    </Autocomplete.GroupLabel>
                    {items.map((item) => (
                      <Autocomplete.Item key={item.value} value={item}>
                        {item.label}
                      </Autocomplete.Item>
                    ))}
                  </Autocomplete.Group>
                ))}
              </Autocomplete.List>
              <Autocomplete.Empty>No services match your search</Autocomplete.Empty>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    );
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
};
