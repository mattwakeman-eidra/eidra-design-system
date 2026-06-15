import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Check, ChevronDown, X, Search } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Combobox } from './Combobox.js';

const meta = {
  title: 'Forms/Combobox',
  component: Combobox.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);
    const filter = Combobox.Root as unknown as { useFilter?: () => unknown };
    void filter;

    return (
      <ComboboxField label="Country">
        <Combobox.Root
          value={value}
          onValueChange={(v) => setValue(v)}
          items={COUNTRIES}
        >
          <ComboboxControl>
            <Combobox.Input
              placeholder="Search countries…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger>
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
};

export const WithGroups: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Assign consultant">
        <Combobox.Root value={value} onValueChange={(v) => setValue(v)}>
          <ComboboxControl>
            <Combobox.Input
              placeholder="Search consultants…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger>
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
};

export const MultiSelect: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [values, setValues] = useState<string[]>([]);

    return (
      <ComboboxField label="Project team members">
        <Combobox.Root multiple value={values} onValueChange={(v) => setValues(v ?? [])}>
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
            <Combobox.Trigger>
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
};

export const WithClear: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Search location">
        <Combobox.Root value={value} onValueChange={(v) => setValue(v)}>
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
            <Combobox.Trigger>
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
          <Combobox.Trigger disabled>
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
};

export const AutoHighlight: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | null>(null);

    return (
      <ComboboxField label="Preferred office (auto-highlight)">
        <Combobox.Root
          value={value}
          onValueChange={(v) => setValue(v)}
          autoHighlight
        >
          <ComboboxControl>
            <Combobox.Input
              placeholder="Oslo, Stockholm, Copenhagen…"
              style={{ borderRadius: 'var(--eidra-radius-md) 0 0 var(--eidra-radius-md)' }}
            />
            <Combobox.Trigger>
              <Combobox.Icon>
                <Icon icon={ChevronDown} size="sm" />
              </Combobox.Icon>
            </Combobox.Trigger>
          </ComboboxControl>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start">
              <Combobox.Popup>
                <Combobox.List>
                  {[
                    { value: 'oslo', label: 'Oslo' },
                    { value: 'stockholm', label: 'Stockholm' },
                    { value: 'copenhagen', label: 'Copenhagen' },
                    { value: 'helsinki', label: 'Helsinki' },
                    { value: 'reykjavik', label: 'Reykjavík' },
                  ].map((city) => (
                    <Combobox.Item key={city.value} value={city.value}>
                      {city.label}
                      <Combobox.ItemIndicator>
                        <Icon icon={Check} size="sm" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  ))}
                </Combobox.List>
                <Combobox.Empty>No offices found.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </ComboboxField>
    );
  },
};
