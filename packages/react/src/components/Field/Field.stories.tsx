import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
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
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('clicking the label focuses the nested control', async () => {
      const control = canvas.getByPlaceholderText('you@example.com');
      await expect(control).not.toHaveFocus();
      await userEvent.click(canvas.getByText('Email'));
      await expect(control).toHaveFocus();
    });
    await step('the focused control accepts typed input', async () => {
      const control = canvas.getByPlaceholderText('you@example.com');
      await userEvent.type(control, 'ada@example.com');
      await expect(control).toHaveValue('ada@example.com');
    });
  },
};

/** A helper hint below the control (hidden once an error is shown). */
export const WithHint: Story = {
  args: {
    label: 'Email',
    hint: 'We’ll never share it.',
    children: <Input placeholder="you@example.com" />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('the hint is visible and associated with the control via aria-describedby', async () => {
      const hint = canvas.getByText('We’ll never share it.');
      await expect(hint).toBeVisible();
      const control = canvas.getByPlaceholderText('you@example.com');
      const describedBy = control.getAttribute('aria-describedby');
      await expect(describedBy).toBeTruthy();
      await expect(describedBy).toContain(hint.id);
    });
  },
};

/** `required` adds an asterisk to the label. */
export const Required: Story = {
  args: {
    label: 'Full name',
    required: true,
    children: <Input placeholder="Ada Lovelace" />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('the label carries the required asterisk', async () => {
      const label = canvas.getByText('Full name');
      await expect(label).toHaveTextContent('*');
    });
    await step('clicking the label still focuses the control', async () => {
      const control = canvas.getByPlaceholderText('Ada Lovelace');
      await userEvent.click(canvas.getByText('Full name'));
      await expect(control).toHaveFocus();
    });
  },
};

/** `error` renders the field invalid and shows the message in place of the hint. */
export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Enter a valid email address.',
    children: <Input defaultValue="not-an-email" />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByDisplayValue('not-an-email');
    await step('the control is marked invalid', async () => {
      await expect(control).toHaveAttribute('aria-invalid', 'true');
    });
    await step('the error message is shown and links to the control', async () => {
      const errorMsg = canvas.getByText('Enter a valid email address.');
      await expect(errorMsg).toBeVisible();
      const describedBy = control.getAttribute('aria-describedby');
      await expect(describedBy).toBeTruthy();
      await expect(describedBy).toContain(errorMsg.id);
    });
  },
};

/** When `error` is set the hint is replaced by the error message. */
export const ErrorReplacesHint: Story = {
  args: {
    label: 'Email',
    hint: 'We’ll never share it.',
    error: 'Enter a valid email address.',
    children: <Input defaultValue="not-an-email" />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('the hint is hidden while invalid', async () => {
      await expect(canvas.queryByText('We’ll never share it.')).toBeNull();
    });
    await step('the error message takes the hint’s place', async () => {
      await expect(canvas.getByText('Enter a valid email address.')).toBeVisible();
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByPlaceholderText('you@example.com');
    await step('the nested control is disabled', async () => {
      await expect(control).toBeDisabled();
    });
    await step('the disabled control cannot be focused or edited', async () => {
      await userEvent.click(control);
      await expect(control).not.toHaveFocus();
      await userEvent.type(control, 'hello');
      await expect(control).toHaveValue('');
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('each label focuses its own control (independent association)', async () => {
      await userEvent.click(canvas.getByText('Email'));
      await expect(canvas.getByPlaceholderText('you@example.com')).toHaveFocus();
      await userEvent.click(canvas.getByText('Company'));
      await expect(canvas.getByPlaceholderText('Eidra')).toHaveFocus();
      // Switching labels moves focus away from the previously-focused control.
      await expect(canvas.getByPlaceholderText('you@example.com')).not.toHaveFocus();
    });
  },
};
