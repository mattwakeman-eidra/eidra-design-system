import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Slider } from './Slider.js';

const meta = {
  title: 'Forms/Slider',
  component: Slider.Root,
  subcomponents: {
    'Slider.Control': Slider.Control,
    'Slider.Track': Slider.Track,
    'Slider.Indicator': Slider.Indicator,
    'Slider.Thumb': Slider.Thumb,
    'Slider.Value': Slider.Value,
  },
  tags: ['autodocs'],
  parameters: {
  },
  args: {
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
  },
  argTypes: {
    defaultValue: { control: { type: 'number', min: 0, max: 100 } },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number', min: 1 } },
    disabled: { control: 'boolean' },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--eidra-space-6)', maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Column = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--eidra-space-6)',
    }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--eidra-space-8)',
      alignItems: 'flex-start',
    }}
  >
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'block',
      fontFamily: 'var(--eidra-font-family-sans)',
      fontSize: 'var(--eidra-font-size-sm)',
      fontWeight: 'var(--eidra-font-weight-medium)',
      color: 'var(--eidra-fg-muted)',
      marginBottom: 'var(--eidra-space-2)',
    }}
  >
    {children}
  </span>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Playground: a single-thumb slider you can configure via the controls panel.
 */
export const Playground: Story = {
  args: {
    'aria-label': 'Value',
    onValueChange: fn(),
  },
  render: (args) => (
    <Slider.Root {...args}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaLabel={() => 'Value'} />
      </Slider.Control>
    </Slider.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');

    await step('thumb exposes its current value and bounds', async () => {
      // Base UI renders the role="slider" element as a native <input type="range">,
      // which carries aria-valuenow plus the native min/max attributes (not
      // aria-valuemin/aria-valuemax — those are implicit from min/max on the input).
      await expect(thumb).toHaveAttribute('aria-valuenow', '40');
      await expect(thumb).toHaveAttribute('min', '0');
      await expect(thumb).toHaveAttribute('max', '100');
    });

    await step('ArrowRight increments by one step and fires onValueChange', async () => {
      thumb.focus();
      await expect(thumb).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(thumb).toHaveAttribute('aria-valuenow', '41');
      await expect(args.onValueChange).toHaveBeenCalledWith(41, expect.anything());
    });

    await step('ArrowLeft decrements by one step', async () => {
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
      await expect(thumb).toHaveAttribute('aria-valuenow', '39');
    });
  },
};

/**
 * Sizes: `sm`, `md` (default), and `lg` track+thumb sizes.
 */
export const Sizes: Story = {
  render: () => (
    <Column>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <Label>{size}</Label>
          <Slider.Root defaultValue={60} size={size}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb getAriaLabel={() => `${size} slider`} />
            </Slider.Control>
          </Slider.Root>
        </div>
      ))}
    </Column>
  ),
};

/**
 * WithValue: renders the current value as an `<output>` element above the control.
 */
export const WithValue: Story = {
  render: () => (
    <Slider.Root defaultValue={30} min={0} max={100}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaLabel={() => 'Value'} />
      </Slider.Control>
    </Slider.Root>
  ),
};

/**
 * FormattedValue: display the value with a custom formatter — e.g. a budget in NOK.
 */
export const FormattedValue: Story = {
  render: () => (
    <Slider.Root
      defaultValue={25000}
      min={0}
      max={100000}
      step={1000}
      format={{ style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }}
      locale="nb-NO"
    >
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaLabel={() => 'Budget'} />
      </Slider.Control>
    </Slider.Root>
  ),
};

/**
 * RangeSlider: two thumbs define a lower and upper bound — e.g. a price range filter.
 */
export const RangeSlider: Story = {
  args: { onValueChange: fn() },
  render: (args) => (
    <Slider.Root defaultValue={[20, 75]} min={0} max={100} onValueChange={args.onValueChange}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb index={0} getAriaLabel={() => 'Lower bound'} />
        <Slider.Thumb index={1} getAriaLabel={() => 'Upper bound'} />
      </Slider.Control>
    </Slider.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const lower = canvas.getByRole('slider', { name: /lower bound/i });
    const upper = canvas.getByRole('slider', { name: /upper bound/i });

    await step('both thumbs report their own value', async () => {
      await expect(lower).toHaveAttribute('aria-valuenow', '20');
      await expect(upper).toHaveAttribute('aria-valuenow', '75');
    });

    await step('moving the lower thumb only changes the lower bound', async () => {
      lower.focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(lower).toHaveAttribute('aria-valuenow', '21');
      await expect(upper).toHaveAttribute('aria-valuenow', '75');
      await expect(args.onValueChange).toHaveBeenCalledWith([21, 75], expect.anything());
    });

    await step('moving the upper thumb only changes the upper bound', async () => {
      upper.focus();
      await userEvent.keyboard('{ArrowLeft}');
      await expect(upper).toHaveAttribute('aria-valuenow', '74');
      await expect(lower).toHaveAttribute('aria-valuenow', '21');
    });
  },
};

/**
 * Vertical: orientation="vertical" for cases like an audio mixer or level control.
 */
export const Vertical: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--eidra-space-6)', height: 280 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Row>
      {[20, 55, 80].map((val, i) => (
        <Slider.Root key={i} defaultValue={val} orientation="vertical">
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb getAriaLabel={() => `Channel ${i + 1}`} />
          </Slider.Control>
        </Slider.Root>
      ))}
    </Row>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const channel1 = canvas.getByRole('slider', { name: /channel 1/i });

    await step('a vertical slider reports its orientation', async () => {
      await expect(channel1).toHaveAttribute('aria-orientation', 'vertical');
      await expect(channel1).toHaveAttribute('aria-valuenow', '20');
    });

    await step('ArrowUp raises the value on a vertical slider', async () => {
      channel1.focus();
      await userEvent.keyboard('{ArrowUp}');
      await expect(channel1).toHaveAttribute('aria-valuenow', '21');
    });
  },
};

/**
 * Stepped: demonstrates discrete increments — useful for selecting a number of team members.
 */
export const Stepped: Story = {
  render: () => (
    <Slider.Root defaultValue={3} min={1} max={10} step={2}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaLabel={() => 'Team members'} />
      </Slider.Control>
    </Slider.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: /team members/i });

    await step('Home jumps to min', async () => {
      thumb.focus();
      await userEvent.keyboard('{Home}');
      await expect(thumb).toHaveAttribute('aria-valuenow', '1');
    });

    await step('End jumps to max', async () => {
      await userEvent.keyboard('{End}');
      await expect(thumb).toHaveAttribute('aria-valuenow', '10');
    });

    await step('ArrowDown steps down and snaps to the step grid', async () => {
      // From the clamped max (10) ArrowDown subtracts the step (→ 8) but Base UI
      // snaps to the nearest valid stop on the min-anchored grid (1, 3, 5, 7, 9):
      // 1 + round((8 - 1) / 2) * 2 = 9. (10 itself is off-grid, being the max.)
      await userEvent.keyboard('{ArrowDown}');
      await expect(thumb).toHaveAttribute('aria-valuenow', '9');
    });
  },
};

/**
 * Disabled: the full slider is non-interactive and visually dimmed.
 */
export const Disabled: Story = {
  args: { onValueChange: fn() },
  render: (args) => (
    <Slider.Root defaultValue={50} disabled onValueChange={args.onValueChange}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaLabel={() => 'Disabled value' } />
      </Slider.Control>
    </Slider.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: /disabled value/i });

    await step('a disabled slider ignores keyboard input', async () => {
      await expect(thumb).toBeDisabled();
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}{Home}{End}');
      await expect(thumb).toHaveAttribute('aria-valuenow', '50');
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });
  },
};

/**
 * Controlled: the host owns `value` and updates it from `onValueChange`. The
 * thumb only reflects the value the parent passes back in.
 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => {
    const [value, setValue] = useState(60);
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Value: <strong style={{ color: 'var(--eidra-fg)' }}>{value}</strong>
        </p>
        <Slider.Root
          value={value}
          min={0}
          max={100}
          onValueChange={(next, details) => {
            setValue(next as number);
            args.onValueChange?.(next, details);
          }}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb getAriaLabel={() => 'Volume'} />
          </Slider.Control>
        </Slider.Root>
      </div>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: /volume/i });

    await step('starts at the host-owned value', async () => {
      await expect(thumb).toHaveAttribute('aria-valuenow', '60');
    });

    await step('keyboard change flows through the host and back to the thumb', async () => {
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(args.onValueChange).toHaveBeenCalledWith(61, expect.anything());
      await expect(thumb).toHaveAttribute('aria-valuenow', '61');
      await expect(canvas.getByText('61')).toBeInTheDocument();
    });
  },
};
