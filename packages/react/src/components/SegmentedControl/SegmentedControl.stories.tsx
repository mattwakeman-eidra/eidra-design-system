import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl, type SegmentedControlItem } from './SegmentedControl.js';

const meta = {
  title: 'Forms/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  args: { items: [], value: '' },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const VIEWS: SegmentedControlItem[] = [
  { value: 'table', label: 'Table' },
  { value: 'graphs', label: 'Graphs' },
  { value: 'clients', label: 'Clients' },
];

/** The Sold & Forecast view switcher (button mode, arrow-key navigable). */
export const ViewSwitcher: Story = {
  render: () => {
    const [value, setValue] = useState('table');
    return <SegmentedControl aria-label="View" items={VIEWS} value={value} onValueChange={setValue} />;
  },
};

/** Three sizes. Heights derive from the control-size tokens, so they also shrink under compact density. */
export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('graphs');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)', alignItems: 'flex-start' }}>
        <SegmentedControl size="sm" aria-label="View" items={VIEWS} value={value} onValueChange={setValue} />
        <SegmentedControl size="md" aria-label="View" items={VIEWS} value={value} onValueChange={setValue} />
        <SegmentedControl size="lg" aria-label="View" items={VIEWS} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

/** Two segments — a binary switch. */
export const TwoSegments: Story = {
  render: () => {
    const [value, setValue] = useState('monthly');
    return (
      <SegmentedControl
        aria-label="Granularity"
        items={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
        ]}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

/** A disabled segment is skipped by keyboard navigation. */
export const WithDisabled: Story = {
  render: () => {
    const [value, setValue] = useState('table');
    return (
      <SegmentedControl
        aria-label="View"
        items={[
          { value: 'table', label: 'Table' },
          { value: 'graphs', label: 'Graphs' },
          { value: 'clients', label: 'Clients', disabled: true },
        ]}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

/**
 * Link mode: segments render as anchors (here plain `<a>`; in an app, a router
 * `Link`) preserving navigation. The active segment gets `aria-current="page"`.
 */
export const AsLinks: Story = {
  render: () => {
    const active = 'graphs';
    return (
      <SegmentedControl
        aria-label="View"
        value={active}
        items={VIEWS.map((v) => ({
          ...v,
          render: ({ className, children, ...rest }) => (
            <a className={className} href={`?view=${v.value}`} {...rest}>
              {children}
            </a>
          ),
        }))}
      />
    );
  },
};
