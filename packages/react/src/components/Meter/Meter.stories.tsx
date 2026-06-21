import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter } from './Meter.js';

const meta = {
  title: 'Feedback/Meter',
  component: Meter.Root,
  subcomponents: {
    'Meter.Label': Meter.Label,
    'Meter.Value': Meter.Value,
    'Meter.Track': Meter.Track,
    'Meter.Indicator': Meter.Indicator,
  },
  tags: ['autodocs'],
  args: {
    value: 72,
    min: 0,
    max: 100,
    size: 'md',
    tone: 'accent',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'inline-radio',
      options: ['accent', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Meter.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helpers ────────────────────────────────────────────────────────────────

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-6)', maxWidth: 480 }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-3)', maxWidth: 480 }}
  >
    {children}
  </div>
);

// ── Stories ─────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480, width: '100%' }}>
      <Meter.Root {...args}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Meter.Root {...args} size="sm">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Small</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root {...args} size="md">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Medium</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root {...args} size="lg">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Large</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </Row>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Stack>
      <Meter.Root {...args} tone="accent">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Accent — Budget consumption</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root {...args} value={40} tone="success">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Success — Deliverables completed</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root {...args} value={68} tone="warning">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Warning — Hours logged</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root {...args} value={91} tone="danger">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Danger — Storage capacity</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root {...args} value={55} tone="info">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Info — Data transfer</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </Stack>
  ),
};

export const WithCustomFormat: Story = {
  args: {
    value: 3.8,
    min: 0,
    max: 5,
    format: { style: 'decimal', maximumFractionDigits: 1 },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Meter.Root {...args} tone="success">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Client satisfaction score</Meter.Label>
          <Meter.Value>{(formattedValue) => `${formattedValue} / 5`}</Meter.Value>
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const ProjectKPIs: Story = {
  name: 'Project KPIs (realistic example)',
  render: () => (
    <Stack>
      <Meter.Root value={84} min={0} max={100} tone="success">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Milestones delivered</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root
        value={62000}
        min={0}
        max={80000}
        tone="accent"
        format={{ style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Budget spent</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root value={78} min={0} max={100} tone="warning">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--eidra-space-1-5)',
          }}
        >
          <Meter.Label>Team capacity utilisation</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </Stack>
  ),
};
