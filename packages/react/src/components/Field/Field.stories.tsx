import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field.js';
import { Input } from '../Input/Input.js';

const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Email',
    children: <Input placeholder="you@example.com" />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Label + control. `Field` wires up the label/description/error ARIA for whatever control you nest. */
export const Default: Story = {};

/** A helper hint below the control (hidden once an error is shown). */
export const WithHint: Story = {
  args: {
    label: 'Email',
    hint: 'We’ll never share it.',
    children: <Input placeholder="you@example.com" />,
  },
};

/** `required` adds an asterisk to the label. */
export const Required: Story = {
  args: {
    label: 'Full name',
    required: true,
    children: <Input placeholder="Ada Lovelace" />,
  },
};

/** `error` renders the field invalid and shows the message in place of the hint. */
export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Enter a valid email address.',
    children: <Input defaultValue="not-an-email" />,
  },
};

/** A disabled field disables its control too. */
export const Disabled: Story = {
  args: {
    label: 'Email',
    disabled: true,
    hint: 'Contact support to change this.',
    children: <Input placeholder="you@example.com" />,
  },
};

/** Several fields stacked — the typical form column. */
export const FormColumn: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <Field label="Full name" required>
        <Input placeholder="Ada Lovelace" />
      </Field>
      <Field label="Email" hint="We’ll never share it.">
        <Input placeholder="you@example.com" />
      </Field>
      <Field label="Company">
        <Input placeholder="Eidra" />
      </Field>
    </div>
  ),
};
