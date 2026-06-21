import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Field } from '../Field/Field.js';
import { OTPField } from './OTPField.js';

const LENGTH = 6;

// Render one slot per `length`, labelling each for assistive tech. The first slot
// borrows the field label; the rest announce their position.
function Slots({ length = LENGTH }: { length?: number }) {
  return (
    <>
      {Array.from({ length }, (_, i) => (
        <OTPField.Input key={i} aria-label={`Character ${i + 1} of ${length}`} />
      ))}
    </>
  );
}

const meta = {
  title: 'Forms/OTP Field',
  // Point at Root: it carries the meaningful props (length/validationType/mask/size).
  // Input is declared as a subcomponent so it gets its own autodocs props table.
  component: OTPField.Root,
  subcomponents: {
    'OTPField.Input': OTPField.Input,
    'OTPField.Separator': OTPField.Separator,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A **one-time-code / PIN input** (Base UI `OTPField`): a row of single-character ' +
          'slots for verification, MFA, or recovery codes. It auto-advances on input, accepts a ' +
          'pasted code across all slots, and exposes the combined value as a hidden form field.\n\n' +
          'Set `length` on `OTPField.Root` and render one `OTPField.Input` per slot. Use ' +
          '`validationType="alphanumeric"` for mixed codes and `mask` to obscure entry. Place it ' +
          'inside a `<Field>` to wire up label, hint, and validation.',
      },
    },
  },
  // `length` is required on Root, so provide a default here for every story.
  args: {
    length: LENGTH,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    validationType: { control: 'inline-radio', options: ['numeric', 'alphanumeric', 'alpha'] },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof OTPField.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Playground ----
export const Playground: Story = {
  args: {
    length: LENGTH,
    size: 'md',
    validationType: 'numeric',
    onValueComplete: fn(),
  },
  render: (args) => (
    <OTPField.Root {...args} aria-label="Verification code">
      <Slots length={args.length} />
    </OTPField.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const onValueComplete = args.onValueComplete as ReturnType<typeof fn>;
    onValueComplete.mockClear();
    // The visible slots are text inputs (role `textbox`); the hidden validation
    // input is `aria-hidden`, so it's excluded.
    const slots = canvas.getAllByRole('textbox');

    await step('there is one input per slot', async () => {
      await expect(slots).toHaveLength(LENGTH);
    });

    await step('typing a code fills the slots and fires onValueComplete', async () => {
      slots[0]!.focus();
      await userEvent.keyboard('123456');
      await waitFor(() => expect((slots[0]! as HTMLInputElement).value).toBe('1'));
      await waitFor(() => expect((slots[LENGTH - 1]! as HTMLInputElement).value).toBe('6'));
      await expect(onValueComplete).toHaveBeenLastCalledWith('123456', expect.anything());
    });

    await step('non-numeric characters are rejected under numeric validation', async () => {
      slots[0]!.focus();
      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('a');
      await expect((slots[0]! as HTMLInputElement).value).not.toBe('a');
    });
  },
};

// ---- Masked (PIN entry) ----
export const Masked: Story = {
  name: 'Masked (PIN)',
  args: {
    length: 4,
    mask: true,
    validationType: 'numeric',
  },
  render: (args) => (
    <OTPField.Root {...args} aria-label="PIN">
      <Slots length={args.length} />
    </OTPField.Root>
  ),
  play: async ({ canvasElement, step }) => {
    // Masked slots are password inputs (no `textbox` role), so query by type.
    const slots = Array.from(
      canvasElement.querySelectorAll<HTMLInputElement>('input[type="password"]'),
    );

    await step('masked slots render as password inputs', async () => {
      await expect(slots).toHaveLength(4);
      await expect(slots[0]!).toHaveAttribute('type', 'password');
    });
  },
};

// ---- Alphanumeric recovery code ----
export const Alphanumeric: Story = {
  name: 'Alphanumeric (recovery code)',
  args: {
    length: LENGTH,
    validationType: 'alphanumeric',
  },
  render: (args) => (
    <OTPField.Root {...args} aria-label="Recovery code">
      <Slots length={args.length} />
    </OTPField.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getAllByRole('textbox');

    await step('letters are accepted under alphanumeric validation', async () => {
      slots[0]!.focus();
      await userEvent.keyboard('a7c9xz');
      await waitFor(() => expect((slots[0]! as HTMLInputElement).value.toLowerCase()).toBe('a'));
    });
  },
};

// ---- Inside a Field (label + hint) ----
export const WithinField: Story = {
  name: 'In a Field (label + hint)',
  render: () => (
    <Field
      label="Verification code"
      hint="Enter the 6-character code we sent to your device."
      name="verificationCode"
    >
      <OTPField.Root length={LENGTH}>
        <Slots />
      </OTPField.Root>
    </Field>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('the field label and hint render alongside the slots', async () => {
      await expect(canvas.getByText('Verification code')).toBeVisible();
      await expect(canvas.getByText(/code we sent/i)).toBeVisible();
      await expect(canvas.getAllByRole('textbox')).toHaveLength(LENGTH);
    });
  },
};
