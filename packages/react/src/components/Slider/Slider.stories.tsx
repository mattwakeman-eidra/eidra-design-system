import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider.js';

const meta = {
  title: 'Forms/Slider',
  component: Slider.Root,
  tags: ['autodocs'],
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
  render: (args) => (
    <Slider.Root {...args}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
  ),
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
              <Slider.Thumb />
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
        <Slider.Thumb />
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
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
  ),
};

/**
 * RangeSlider: two thumbs define a lower and upper bound — e.g. a price range filter.
 */
export const RangeSlider: Story = {
  render: () => (
    <Slider.Root defaultValue={[20, 75]} min={0} max={100}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb index={0} />
        <Slider.Thumb index={1} />
      </Slider.Control>
    </Slider.Root>
  ),
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
            <Slider.Thumb />
          </Slider.Control>
        </Slider.Root>
      ))}
    </Row>
  ),
};

/**
 * Stepped: demonstrates discrete increments — useful for selecting a number of team members.
 */
export const Stepped: Story = {
  render: () => (
    <Slider.Root defaultValue={3} min={1} max={10} step={1}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaLabel={() => 'Team members'} />
      </Slider.Control>
    </Slider.Root>
  ),
};

/**
 * Disabled: the full slider is non-interactive and visually dimmed.
 */
export const Disabled: Story = {
  render: () => (
    <Slider.Root defaultValue={50} disabled>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
  ),
};
