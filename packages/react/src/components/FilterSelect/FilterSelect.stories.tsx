import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterSelect, type FilterSelectOption } from './FilterSelect.js';

const meta = {
  title: 'Forms/FilterSelect',
  component: FilterSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  // Placeholder required props; every story supplies real state via `render`.
  args: { options: [], value: [], onValueChange: () => {} },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const REGIONS: FilterSelectOption[] = [
  { value: 'nordics', label: 'Nordics' },
  { value: 'benelux', label: 'Benelux' },
  { value: 'dach', label: 'DACH' },
  { value: 'uki', label: 'UK & Ireland' },
];

const OWNERS: FilterSelectOption[] = [
  { value: 'al', label: 'A. Lindqvist' },
  { value: 'mp', label: 'M. Persson' },
  { value: 'jdv', label: 'J. de Vries' },
  { value: 'ks', label: 'K. Sørensen' },
  { value: 'rt', label: 'R. Thoresen' },
  { value: 'eh', label: 'E. Hansen' },
  { value: 'nb', label: 'N. Bakker' },
  { value: 'cv', label: 'C. Visser' },
  { value: 'lm', label: 'L. Møller' },
  { value: 'sf', label: 'S. Fischer' },
];

/** Basic single filter — selecting keeps the popup open and updates the count. */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <FilterSelect
        aria-label="Region"
        placeholder="Region"
        noun="region"
        options={REGIONS}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

/** A long list auto-shows the search box (default threshold: 8 options). */
export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['al', 'mp']);
    return (
      <FilterSelect
        aria-label="Account owner"
        placeholder="Owner"
        noun="owner"
        options={OWNERS}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

/** Pre-selected values: 1 selected shows the value, ≥2 shows "{n} {noun}s". */
export const Preselected: Story = {
  render: () => {
    const [one, setOne] = useState<string[]>(['nordics']);
    const [many, setMany] = useState<string[]>(['nordics', 'dach', 'uki']);
    return (
      <div style={{ display: 'flex', gap: 'var(--eidra-space-3)' }}>
        <FilterSelect aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={one} onValueChange={setOne} />
        <FilterSelect aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={many} onValueChange={setMany} />
      </div>
    );
  },
};

/** A custom `summary` renderer — here, listing the chosen labels inline. */
export const CustomSummary: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['nordics', 'benelux']);
    return (
      <FilterSelect
        aria-label="Region"
        placeholder="All regions"
        options={REGIONS}
        value={value}
        onValueChange={setValue}
        summary={(selected, options) =>
          selected.length === 0
            ? 'All regions'
            : options
                .filter((o) => selected.includes(o.value))
                .map((o) => o.label)
                .join(', ')
        }
      />
    );
  },
};

/** Compact `size="sm"` pill for dense toolbars. */
export const Small: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['dach']);
    return (
      <FilterSelect size="sm" aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={value} onValueChange={setValue} />
    );
  },
};

/** Disabled options inside the list, and a fully disabled control. */
export const DisabledStates: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['nordics']);
    const opts: FilterSelectOption[] = [
      { value: 'nordics', label: 'Nordics' },
      { value: 'benelux', label: 'Benelux (no access)', disabled: true },
      { value: 'dach', label: 'DACH' },
    ];
    return (
      <div style={{ display: 'flex', gap: 'var(--eidra-space-3)' }}>
        <FilterSelect aria-label="Region" placeholder="Region" noun="region" options={opts} value={value} onValueChange={setValue} />
        <FilterSelect aria-label="Region" placeholder="Region (disabled)" options={REGIONS} value={[]} onValueChange={() => {}} disabled />
      </div>
    );
  },
};

/** The invoicing toolbar: six filter pills side by side. */
export const FilterToolbar: Story = {
  render: () => {
    const [region, setRegion] = useState<string[]>([]);
    const [opco, setOpco] = useState<string[]>(['fabrique']);
    const [client, setClient] = useState<string[]>([]);
    const [owner, setOwner] = useState<string[]>(['al', 'mp', 'jdv']);
    const [size, setSize] = useState<string[]>([]);
    const [industry, setIndustry] = useState<string[]>([]);
    const opcos: FilterSelectOption[] = [
      { value: 'fabrique', label: 'Fabrique' },
      { value: 'q42', label: 'Q42' },
      { value: 'gpnl', label: 'GP NL' },
    ];
    const clients: FilterSelectOption[] = [
      { value: 'acme', label: 'Acme Corp' },
      { value: 'globex', label: 'Globex' },
      { value: 'initech', label: 'Initech' },
    ];
    const sizes: FilterSelectOption[] = [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Mid-market' },
      { value: 'lg', label: 'Enterprise' },
    ];
    const industries: FilterSelectOption[] = [
      { value: 'fin', label: 'Financial services' },
      { value: 'retail', label: 'Retail' },
      { value: 'public', label: 'Public sector' },
      { value: 'tech', label: 'Technology' },
    ];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--eidra-space-2)' }}>
        <FilterSelect size="sm" aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={region} onValueChange={setRegion} />
        <FilterSelect size="sm" aria-label="Opco" placeholder="Opco" noun="opco" options={opcos} value={opco} onValueChange={setOpco} />
        <FilterSelect size="sm" aria-label="Client" placeholder="Client" noun="client" options={clients} value={client} onValueChange={setClient} />
        <FilterSelect size="sm" aria-label="Owner" placeholder="Owner" noun="owner" options={OWNERS} value={owner} onValueChange={setOwner} />
        <FilterSelect size="sm" aria-label="Size" placeholder="Size" noun="size" options={sizes} value={size} onValueChange={setSize} />
        <FilterSelect size="sm" aria-label="Industry" placeholder="Industry" noun="industry" options={industries} value={industry} onValueChange={setIndustry} />
      </div>
    );
  },
};
