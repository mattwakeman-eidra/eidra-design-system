import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic } from './Statistic.js';

const meta = {
  title: 'Data Display/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  args: {
    label: 'Budget',
    value: '€ 1,200,000',
    tone: 'neutral',
    size: 'md',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'danger', 'warning', 'accent'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    progress: { control: { type: 'range', min: 0, max: 100 } },
    progressTone: { control: 'select', options: ['accent', 'success', 'warning', 'danger', 'info'] },
    accent: { control: 'boolean' },
    caption: { control: 'text' },
    delta: { control: 'text' },
  },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {};

/** Value with a progress bar and a caption. */
export const WithProgress: Story = {
  args: {
    label: 'Lifetime spent',
    value: '€ 864,000',
    progress: 72,
    progressTone: 'accent',
    caption: '72% of budget',
  },
};

/** A delta beside the value, toned to convey over/under. */
export const WithDelta: Story = {
  args: {
    label: 'Projected total',
    value: '€ 1,310,000',
    tone: 'danger',
    delta: '+€ 110,000 over budget',
    size: 'lg',
  },
};

/**
 * The `accent` prop draws a tone-coloured left border (with inset). It's the one
 * thing this atom adds over a plain metric — shown here off vs on, and across
 * tones. For a *row* of figures reach for `StatisticBar` (divider-separated) or
 * `StatusStrip` (RAG heat cells), not a grid of these.
 */
export const Accent: Story = {
  // Showcase story — renders a fixed layout and ignores args, so hide the (inapplicable) controls.
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-6)', maxWidth: 480 }}>
      {/* The prop's effect: same metric, border off vs on */}
      <div style={{ display: 'flex', gap: 'var(--eidra-space-6)' }}>
        <Statistic size="sm" label="Net revenue" value="€ 1.05M" tone="success" delta="+6%" />
        <Statistic accent size="sm" label="Net revenue" value="€ 1.05M" tone="success" delta="+6%" />
      </div>
      {/* The border picks up each metric's tone */}
      <div style={{ display: 'flex', gap: 'var(--eidra-space-6)', flexWrap: 'wrap' }}>
        <Statistic accent size="sm" label="Revenue" value="€ 1.21M" tone="accent" />
        <Statistic accent size="sm" label="WIP" value="€ 84k" tone="warning" />
        <Statistic accent size="sm" label="Margin" value="−2%" tone="danger" />
      </div>
    </div>
  ),
};
