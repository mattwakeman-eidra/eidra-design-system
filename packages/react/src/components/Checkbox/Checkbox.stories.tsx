import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, CheckboxGroup } from './Checkbox.js';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox.Root,
  tags: ['autodocs'],
  args: { label: 'Accept terms and conditions', name: 'terms' },
} satisfies Meta<typeof Checkbox.Root>;

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
  render: (args) => (
    <Col>
      <Checkbox.Root {...args} label="Unchecked" name="s1" />
      <Checkbox.Root {...args} label="Checked" name="s2" defaultChecked />
      <Checkbox.Root {...args} label="Indeterminate" name="s3" indeterminate />
      <Checkbox.Root {...args} label="Disabled unchecked" name="s4" disabled />
      <Checkbox.Root {...args} label="Disabled checked" name="s5" defaultChecked disabled />
      <Checkbox.Root {...args} label="Read-only" name="s6" defaultChecked readOnly />
    </Col>
  ),
};

// ─── Without label ─────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <Checkbox.Root name="standalone" defaultChecked aria-label="Enable notifications" />
  ),
};

// ─── Group: Consulting services ───────────────────────────────────────────────

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      legend="Select services"
      defaultValue={['strategy', 'design']}
      aria-label="Consulting services"
    >
      <Checkbox.Root label="Strategy & Advisory" value="strategy" name="services" />
      <Checkbox.Root label="Experience Design" value="design" name="services" />
      <Checkbox.Root label="Technology Delivery" value="tech" name="services" />
      <Checkbox.Root label="Organisational Change" value="change" name="services" />
    </CheckboxGroup>
  ),
};

// ─── Group with parent checkbox ───────────────────────────────────────────────

export const GroupWithParent: Story = {
  render: () => (
    <CheckboxGroup
      defaultValue={['norway', 'sweden']}
      allValues={['norway', 'sweden', 'denmark', 'finland']}
      aria-label="Nordic offices"
    >
      <Checkbox.Root label="All offices" parent name="offices-parent" />
      <div style={{ paddingInlineStart: 'var(--eidra-space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)' }}>
        <Checkbox.Root label="Oslo" value="norway" name="offices" />
        <Checkbox.Root label="Stockholm" value="sweden" name="offices" />
        <Checkbox.Root label="Copenhagen" value="denmark" name="offices" />
        <Checkbox.Root label="Helsinki" value="finland" name="offices" />
      </div>
    </CheckboxGroup>
  ),
};

// ─── Group disabled ────────────────────────────────────────────────────────────

export const GroupDisabled: Story = {
  render: () => (
    <CheckboxGroup
      legend="Available features"
      defaultValue={['reporting']}
      disabled
      aria-label="Available features"
    >
      <Checkbox.Root label="Advanced Reporting" value="reporting" name="feat" />
      <Checkbox.Root label="Data Export" value="export" name="feat" />
      <Checkbox.Root label="API Access" value="api" name="feat" />
    </CheckboxGroup>
  ),
};
