import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress.js';

const meta = {
  title: 'Feedback/Progress',
  component: Progress.Root,
  subcomponents: {
    'Progress.Label': Progress.Label,
    'Progress.Value': Progress.Value,
    'Progress.Track': Progress.Track,
    'Progress.Indicator': Progress.Indicator,
  },
  tags: ['autodocs'],
  args: {
    value: 65,
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
} satisfies Meta<typeof Progress.Root>;

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

const Header = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--eidra-space-1-5)',
    }}
  >
    {children}
  </div>
);

// ── Stories ─────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480, width: '100%' }}>
      <Progress.Root {...args}>
        <Header>
          <Progress.Label>Uploading report</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { value: null },
  render: (args) => (
    <div style={{ maxWidth: 480, width: '100%' }}>
      <Progress.Root {...args}>
        <Header>
          <Progress.Label>Analysing data…</Progress.Label>
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Progress.Root {...args} size="sm">
        <Header>
          <Progress.Label>Small</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root {...args} size="md">
        <Header>
          <Progress.Label>Medium</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root {...args} size="lg">
        <Header>
          <Progress.Label>Large</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Row>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Stack>
      <Progress.Root {...args} tone="accent">
        <Header>
          <Progress.Label>Accent — Proposal review</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root {...args} value={40} tone="success">
        <Header>
          <Progress.Label>Success — Deliverables accepted</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root {...args} value={68} tone="warning">
        <Header>
          <Progress.Label>Warning — Hours remaining</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root {...args} value={91} tone="danger">
        <Header>
          <Progress.Label>Danger — Storage nearing limit</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root {...args} value={55} tone="info">
        <Header>
          <Progress.Label>Info — Data transfer</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  ),
};

export const Complete: Story = {
  args: { value: 100 },
  render: (args) => (
    <div style={{ maxWidth: 480, width: '100%' }}>
      <Progress.Root {...args} tone="success">
        <Header>
          <Progress.Label>Contract signed</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </div>
  ),
};

export const ProjectOnboarding: Story = {
  name: 'Project onboarding (realistic example)',
  render: () => (
    <Stack>
      <Progress.Root value={100} min={0} max={100} tone="success">
        <Header>
          <Progress.Label>Client brief received</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root value={75} min={0} max={100} tone="accent">
        <Header>
          <Progress.Label>Stakeholder interviews</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root value={30} min={0} max={100} tone="warning">
        <Header>
          <Progress.Label>Workshop sessions</Progress.Label>
          <Progress.Value />
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root value={null} min={0} max={100} tone="info">
        <Header>
          <Progress.Label>Synthesis in progress…</Progress.Label>
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  ),
};

export const WithCustomFormat: Story = {
  args: {
    value: 7,
    min: 0,
    max: 10,
    format: { style: 'decimal', maximumFractionDigits: 0 },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Progress.Root {...args} tone="accent">
        <Header>
          <Progress.Label>Interview stages completed</Progress.Label>
          <Progress.Value>{(formattedValue, value) => `${value ?? 0} of 10`}</Progress.Value>
        </Header>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </div>
  ),
};
