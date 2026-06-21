import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { NumberField } from './NumberField.js';

const meta = {
  title: 'Forms/NumberField',
  component: NumberField.Root,
  subcomponents: {
    'NumberField.Group': NumberField.Group,
    'NumberField.Input': NumberField.Input,
    'NumberField.Increment': NumberField.Increment,
    'NumberField.Decrement': NumberField.Decrement,
    'NumberField.ScrubArea': NumberField.ScrubArea,
    'NumberField.ScrubAreaCursor': NumberField.ScrubAreaCursor,
  },
  tags: ['autodocs'],
  parameters: {},
  args: {
    defaultValue: 0,
    step: 1,
    min: 0,
    max: 100,
    size: 'md',
  },
  // Dropped `readOnly` control: its only style is `cursor: default`, no visible
  // resting change — the dedicated ReadOnly story demonstrates the behaviour.
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          gap: 'var(--eidra-space-4)',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberField.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultField = (props: ComponentPropsWithoutRef<typeof NumberField.Root>) => (
  <NumberField.Root defaultValue={0} step={1} {...props}>
    <NumberField.Group>
      <NumberField.Decrement />
      <NumberField.Input />
      <NumberField.Increment />
    </NumberField.Group>
  </NumberField.Root>
);

export const Playground: Story = {
  args: {
    onValueChange: fn(),
  },
  render: (args) => (
    <NumberField.Root {...args}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

/** Stepper buttons step the value and fire `onValueChange`. */
export const StepperButtons: Story = {
  name: 'Stepper buttons (increment / decrement)',
  parameters: { controls: { disable: true } },
  args: {
    defaultValue: 0,
    step: 1,
    min: 0,
    max: 100,
    size: 'md',
    onValueChange: fn(),
  },
  render: (args) => (
    <NumberField.Root {...args}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    const increment = canvas.getByRole('button', { name: /increment/i });
    const decrement = canvas.getByRole('button', { name: /decrement/i });

    await step('starts at the uncontrolled default value', async () => {
      await expect(input).toHaveValue('0');
    });

    await step('Increment button steps the value up and fires onValueChange', async () => {
      await userEvent.click(increment);
      await expect(input).toHaveValue('1');
      await expect(args.onValueChange).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ reason: 'increment-press' }),
      );
    });

    await step('Decrement button steps the value back down', async () => {
      await userEvent.click(decrement);
      await expect(input).toHaveValue('0');
      await expect(args.onValueChange).toHaveBeenLastCalledWith(
        0,
        expect.objectContaining({ reason: 'decrement-press' }),
      );
    });
  },
};

export const Sizes: Story = {
  render: () => (
    <>
      <DefaultField size="sm" defaultValue={5} />
      <DefaultField size="md" defaultValue={5} />
      <DefaultField size="lg" defaultValue={5} />
    </>
  ),
};

export const WithMinMax: Story = {
  name: 'With min/max constraints',
  render: () => <DefaultField min={0} max={10} defaultValue={9} step={1} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    const increment = canvas.getByRole('button', { name: /increment/i });

    await step('Incrementing clamps at max and disables the button', async () => {
      await userEvent.click(increment);
      await expect(input).toHaveValue('10');
      await userEvent.click(increment);
      // Held at max — does not exceed.
      await expect(input).toHaveValue('10');
      await expect(increment).toBeDisabled();
    });
  },
};

/** Arrow keys step the value; Shift uses `largeStep`, Home/End jump to min/max. */
export const KeyboardStepping: Story = {
  name: 'Keyboard stepping (arrows / shift / Home·End)',
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => (
    <NumberField.Root
      defaultValue={5}
      step={1}
      largeStep={10}
      min={0}
      max={100}
      onValueChange={args.onValueChange}
    >
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    await step('ArrowUp / ArrowDown step by `step`', async () => {
      input.focus();
      await expect(input).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      await expect(input).toHaveValue('6');
      await userEvent.keyboard('{ArrowDown}');
      await expect(input).toHaveValue('5');
      await expect(args.onValueChange).toHaveBeenCalledWith(
        6,
        expect.objectContaining({ reason: 'keyboard' }),
      );
    });

    await step('Shift+ArrowUp steps by `largeStep`', async () => {
      await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}');
      await expect(input).toHaveValue('15');
    });

    await step('Home / End jump to min / max', async () => {
      await userEvent.keyboard('{End}');
      await expect(input).toHaveValue('100');
      await userEvent.keyboard('{Home}');
      await expect(input).toHaveValue('0');
    });
  },
};

/** Typing a value into the input parses and commits it on blur. */
export const TypeAndCommit: Story = {
  name: 'Type a value, commit on blur',
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn(), onValueCommitted: fn() },
  render: (args) => (
    <NumberField.Root
      defaultValue={0}
      step={1}
      min={0}
      max={100}
      onValueChange={args.onValueChange}
      onValueCommitted={args.onValueCommitted}
    >
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    await step('typing a number updates the value', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '42');
      await expect(input).toHaveValue('42');
      await expect(args.onValueChange).toHaveBeenCalledWith(
        42,
        expect.objectContaining({ reason: 'input-change' }),
      );
    });

    await step('blur commits the value via onValueCommitted', async () => {
      await userEvent.tab();
      await waitFor(() =>
        expect(args.onValueCommitted).toHaveBeenCalledWith(42, expect.anything()),
      );
    });
  },
};

/**
 * Controlled value: the host owns `value` and updates it from `onValueChange`.
 * The field only reflects what the parent passes back.
 */
export const Controlled: Story = {
  name: 'Controlled value',
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState<number | null>(20);
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Value: <strong style={{ color: 'var(--eidra-fg)' }}>{String(value)}</strong>
        </p>
        <NumberField.Root value={value} onValueChange={setValue} step={5} min={0} max={100}>
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField.Root>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    const increment = canvas.getByRole('button', { name: /increment/i });

    await step('reflects the host-supplied value', async () => {
      await expect(input).toHaveValue('20');
    });

    await step('incrementing routes through the host and updates the display', async () => {
      await userEvent.click(increment);
      await expect(input).toHaveValue('25');
      // The host's live readout reflects the same value (value flows parent → field).
      await expect(canvas.getByText('25')).toBeInTheDocument();
    });
  },
};

export const WithDecimalStep: Story = {
  name: 'Decimal step (0.1)',
  render: () => (
    <DefaultField
      min={0}
      max={1}
      step={0.1}
      smallStep={0.01}
      defaultValue={0.5}
      format={{ minimumFractionDigits: 1, maximumFractionDigits: 2 }}
    />
  ),
};

export const CurrencyFormat: Story = {
  name: 'Currency formatting (NOK)',
  render: () => (
    <DefaultField
      min={0}
      max={1000000}
      step={1000}
      largeStep={10000}
      defaultValue={50000}
      format={{ style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }}
    />
  ),
};

export const PercentageFormat: Story = {
  name: 'Percentage format',
  render: () => (
    <DefaultField min={0} max={1} step={0.05} defaultValue={0.25} format={{ style: 'percent' }} />
  ),
};

export const Disabled: Story = {
  render: () => <DefaultField disabled defaultValue={42} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    const increment = canvas.getByRole('button', { name: /increment/i });
    // Disabled fields ignore interaction: input + steppers are disabled and value holds.
    await expect(input).toBeDisabled();
    await expect(increment).toBeDisabled();
    await userEvent.click(increment);
    await expect(input).toHaveValue('42');
  },
};

export const ReadOnly: Story = {
  render: () => <DefaultField readOnly defaultValue={99} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    // Read-only: focusable and not disabled, but keyboard stepping does not change it.
    await expect(input).toHaveAttribute('readonly');
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(input).toHaveValue('99');
  },
};

export const WithScrubArea: Story = {
  name: 'With scrub area',
  render: () => (
    <NumberField.Root defaultValue={50} step={1} min={0} max={100}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.ScrubArea>
          <NumberField.Input />
          <NumberField.ScrubAreaCursor />
        </NumberField.ScrubArea>
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const ConsultancyRateExample: Story = {
  name: 'Consultancy daily rate (realistic)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--eidra-space-1)',
            fontSize: 'var(--eidra-font-size-sm)',
            fontWeight: 'var(--eidra-font-weight-medium)',
            color: 'var(--eidra-fg)',
            fontFamily: 'var(--eidra-font-family-sans)',
          }}
        >
          Daily rate (NOK)
        </label>
        <DefaultField
          min={0}
          max={50000}
          step={500}
          largeStep={5000}
          defaultValue={12500}
          format={{ style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }}
          size="md"
        />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--eidra-space-1)',
            fontSize: 'var(--eidra-font-size-sm)',
            fontWeight: 'var(--eidra-font-weight-medium)',
            color: 'var(--eidra-fg)',
            fontFamily: 'var(--eidra-font-family-sans)',
          }}
        >
          Billable hours per week
        </label>
        <DefaultField
          min={0}
          max={40}
          step={0.5}
          smallStep={0.25}
          defaultValue={37.5}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          size="md"
        />
      </div>
    </div>
  ),
  decorators: [(Story) => <Story />],
};
