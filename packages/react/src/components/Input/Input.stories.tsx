import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, expect, fn } from 'storybook/test';
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Email/ });
    await step('typing updates the (uncontrolled) value', async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
      await userEvent.type(input, 'jane@eidra.com');
      await expect(input).toHaveValue('jane@eidra.com');
    });
    await step('clearing removes the value', async () => {
      await userEvent.clear(input);
      await expect(input).toHaveValue('');
    });
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Locked/ });
    // A disabled input is non-editable and unfocusable; typing leaves it unchanged.
    await expect(input).toBeDisabled();
    await userEvent.type(input, 'should not type');
    await expect(input).toHaveValue('Read only');
    await expect(input).not.toHaveFocus();
  },
};

/**
 * **Controlled value.** The host owns `value` and updates it from `onChange`; the
 * input never holds its own state. `onChange` fires once per keystroke.
 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  args: { onChange: fn() },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Field label="Amount">
        <Input
          {...args}
          value={value}
          onChange={(e) => {
            args.onChange?.(e);
            setValue(e.target.value);
          }}
          placeholder="0.00"
        />
      </Field>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Amount/ });
    await step('each keystroke fires onChange and reflects in the controlled value', async () => {
      await userEvent.type(input, '420');
      await expect(input).toHaveValue('420');
      await expect(args.onChange).toHaveBeenCalled();
      await expect(args.onChange).toHaveBeenCalledTimes(3);
    });
  },
};

/**
 * **Grouped (slots) stays editable.** With a `startSlot`/`endSlot` the input renders
 * inside a group wrapper; typing and focus must still work as in the bare variant.
 */
export const SlotsEditable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Search">
      <Input
        placeholder="Search…"
        startSlot={<Icon icon={Search} size="sm" />}
        endSlot={<kbd>⌘K</kbd>}
      />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Search/ });
    await userEvent.type(input, 'invoices');
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('invoices');
  },
};
