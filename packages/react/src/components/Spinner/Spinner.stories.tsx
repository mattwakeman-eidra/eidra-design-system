import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner.js';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  // `label` only sets aria-label (no visible text) — dropped as a control (invisible).
  args: { size: 'md', tone: 'accent', label: 'Loading…' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'coral', 'danger', 'success'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: 'flex', gap: 'var(--eidra-space-4)', alignItems: 'center', flexWrap: 'wrap' }}
  >
    {children}
  </div>
);

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Spinner {...args} size="sm" label="Loading small" />
      <Spinner {...args} size="md" label="Loading medium" />
      <Spinner {...args} size="lg" label="Loading large" />
    </Row>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Row>
      <Spinner {...args} tone="accent" label="Loading" />
      <Spinner {...args} tone="neutral" label="Loading" />
      <Spinner {...args} tone="coral" label="Loading" />
      <Spinner {...args} tone="danger" label="Loading" />
      <Spinner {...args} tone="success" label="Loading" />
    </Row>
  ),
};

export const InlineWithText: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--eidra-space-2)',
          color: 'var(--eidra-fg-muted)',
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-sm)',
        }}
      >
        <Spinner {...args} size="sm" label="Fetching data" />
        Fetching consultant availability…
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--eidra-space-3)',
          color: 'var(--eidra-fg)',
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-base)',
        }}
      >
        <Spinner {...args} size="md" label="Uploading report" />
        Uploading engagement report…
      </div>
    </div>
  ),
};

export const FullPageOverlay: Story = {
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 240,
        background: 'var(--eidra-bg-subtle)',
        borderRadius: 'var(--eidra-radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 'var(--eidra-space-3)',
      }}
    >
      <Spinner {...args} size="lg" label="Loading dashboard" />
      <span
        style={{
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-sm)',
          color: 'var(--eidra-fg-muted)',
        }}
      >
        Loading your dashboard…
      </span>
    </div>
  ),
};
