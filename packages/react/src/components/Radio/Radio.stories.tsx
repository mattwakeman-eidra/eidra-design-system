import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio.js';

const meta = {
  title: 'Forms/Radio',
  component: Radio.Root,
  tags: ['autodocs'],
  args: { label: 'Option', value: 'option' },
} satisfies Meta<typeof Radio.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const Col = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)' }}>
    {children}
  </div>
);

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ─── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <Col>
      <RadioGroup name="states-unchecked">
        <Radio.Root label="Unchecked" value="a" />
      </RadioGroup>
      <RadioGroup name="states-checked" defaultValue="b">
        <Radio.Root label="Checked" value="b" />
      </RadioGroup>
      <RadioGroup name="states-disabled" disabled>
        <Radio.Root label="Disabled unchecked" value="c" />
      </RadioGroup>
      <RadioGroup name="states-disabled-checked" defaultValue="d" disabled>
        <Radio.Root label="Disabled checked" value="d" />
      </RadioGroup>
      <RadioGroup name="states-readonly" defaultValue="e" readOnly>
        <Radio.Root label="Read-only" value="e" />
      </RadioGroup>
    </Col>
  ),
};

// ─── Without label ─────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <RadioGroup name="standalone" defaultValue="standalone" aria-label="Select this option">
      <Radio.Root value="standalone" aria-label="Select this option" />
    </RadioGroup>
  ),
};

// ─── Group: consulting engagement type ────────────────────────────────────────

export const Group: Story = {
  render: () => (
    <RadioGroup
      legend="Engagement type"
      name="engagement"
      defaultValue="advisory"
      aria-label="Engagement type"
    >
      <Radio.Root label="Strategy & Advisory" value="advisory" />
      <Radio.Root label="Experience Design" value="design" />
      <Radio.Root label="Technology Delivery" value="tech" />
      <Radio.Root label="Organisational Change" value="change" />
    </RadioGroup>
  ),
};

// ─── Group: Nordic office location ────────────────────────────────────────────

export const GroupOffices: Story = {
  name: 'Group — Nordic Offices',
  render: () => (
    <RadioGroup
      legend="Primary office"
      name="office"
      defaultValue="oslo"
      aria-label="Primary office"
    >
      <Radio.Root label="Oslo" value="oslo" />
      <Radio.Root label="Stockholm" value="stockholm" />
      <Radio.Root label="Copenhagen" value="copenhagen" />
      <Radio.Root label="Helsinki" value="helsinki" />
    </RadioGroup>
  ),
};

// ─── Group disabled ────────────────────────────────────────────────────────────

export const GroupDisabled: Story = {
  render: () => (
    <RadioGroup
      legend="Billing cycle"
      name="billing"
      defaultValue="annual"
      disabled
      aria-label="Billing cycle"
    >
      <Radio.Root label="Monthly" value="monthly" />
      <Radio.Root label="Annual (save 20%)" value="annual" />
      <Radio.Root label="Biennial (save 35%)" value="biennial" />
    </RadioGroup>
  ),
};

// ─── Group: horizontal layout ──────────────────────────────────────────────────

export const GroupHorizontal: Story = {
  render: () => (
    <RadioGroup
      name="priority"
      defaultValue="medium"
      aria-label="Priority"
      style={{ flexDirection: 'row', gap: 'var(--eidra-space-5)' }}
    >
      <Radio.Root label="Low" value="low" />
      <Radio.Root label="Medium" value="medium" />
      <Radio.Root label="High" value="high" />
      <Radio.Root label="Critical" value="critical" />
    </RadioGroup>
  ),
};
