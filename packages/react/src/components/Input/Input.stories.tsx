import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Field } from '../Field/Field.js';
import { Input } from './Input.js';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Field label="Email" hint="We’ll never share it.">
      <Input type="email" placeholder="you@eidra.com" />
    </Field>
  ),
};

export const Required: Story = {
  render: () => (
    <Field label="Full name" required>
      <Input placeholder="Jane Doe" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Email" error="Enter a valid email address.">
      <Input type="email" defaultValue="not-an-email" />
    </Field>
  ),
};

export const WithAdornment: Story = {
  render: () => (
    <Field label="Search">
      <Input placeholder="Search…" startSlot={<Icon icon={Search} size="sm" />} />
    </Field>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Locked" disabled>
      <Input defaultValue="Read only" />
    </Field>
  ),
};
