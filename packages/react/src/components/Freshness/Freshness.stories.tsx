import type { Meta, StoryObj } from '@storybook/react-vite';
import { Freshness } from './Freshness.js';

// Fixed "now" so the relative times render deterministically in the docs.
const NOW = 1_700_000_000_000;
const minsAgo = (m: number) => NOW - m * 60_000;
const hoursAgo = (h: number) => NOW - h * 3_600_000;

const meta = {
  title: 'Feedback/Freshness',
  component: Freshness,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['positive', 'caution', 'negative', 'neutral', 'info'],
    },
    pulse: { control: 'boolean' },
    label: { control: 'text' },
    since: { control: 'number' },
    staleAfter: { control: 'number' },
    now: { control: 'number' },
  },
  args: {
    label: 'Data',
    tone: 'positive',
    pulse: false,
    since: minsAgo(12),
    now: NOW,
  },
} satisfies Meta<typeof Freshness>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak tone, label, pulse and timing live. */
export const Playground: Story = {};

/** Data age, escalating tone with `staleAfter` (here: 15 min). */
export const DataAge: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)', alignItems: 'flex-start' }}>
      <Freshness label="Data" since={minsAgo(2)} staleAfter={15 * 60_000} now={NOW} />
      <Freshness label="Data" since={minsAgo(28)} staleAfter={15 * 60_000} now={NOW} />
      <Freshness label="Actuals" since={hoursAgo(10)} staleAfter={15 * 60_000} now={NOW} />
    </div>
  ),
};

/** Explicit tones (no `staleAfter`). */
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)', alignItems: 'flex-start' }}>
      <Freshness label="Synced" since={minsAgo(1)} tone="positive" now={NOW} />
      <Freshness label="Syncing" since={minsAgo(5)} tone="caution" now={NOW} />
      <Freshness label="Failed" since={minsAgo(40)} tone="negative" now={NOW} />
      <Freshness label="Last seen" since={hoursAgo(3)} tone="neutral" now={NOW} />
    </div>
  ),
};

/** A live / auto-save signal: pulsing dot, no timestamp. */
export const AutoSave: Story = {
  render: () => <Freshness label="Auto-save on" tone="info" pulse />,
};

/** Label only — a static status dot with no relative time. */
export const LabelOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--eidra-space-4)' }}>
      <Freshness label="Live" tone="positive" pulse />
      <Freshness label="Offline" tone="negative" />
      <Freshness label="Draft" tone="neutral" />
    </div>
  ),
};

/** Relative-time buckets. */
export const RelativeTime: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)', alignItems: 'flex-start' }}>
      <Freshness label="Updated" since={NOW - 10_000} now={NOW} tone="positive" />
      <Freshness label="Updated" since={minsAgo(12)} now={NOW} tone="positive" />
      <Freshness label="Updated" since={hoursAgo(10)} now={NOW} tone="caution" />
      <Freshness label="Updated" since={hoursAgo(50)} now={NOW} tone="negative" />
    </div>
  ),
};
