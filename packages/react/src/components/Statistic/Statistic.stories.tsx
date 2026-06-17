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
 * `accent` draws a tone-coloured left border (with inset) — the accented KPI-card
 * row from the Project Economics accounting summary. Each metric's `tone` colours
 * both its value and its border.
 */
export const AccentedKpiRow: Story = {
  // Showcase story — renders a fixed grid and ignores args, so hide the (inapplicable) controls.
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'var(--eidra-space-4)',
        maxWidth: 760,
      }}
    >
      <Statistic accent size="sm" label="Revenue" value="€ 1.21M" tone="accent" />
      <Statistic accent size="sm" label="WIP" value="€ 84k" tone="warning" />
      <Statistic accent size="sm" label="Invoiced" value="€ 1.13M" />
      <Statistic accent size="sm" label="Net revenue" value="€ 1.05M" tone="success" delta="+6%" />
      <Statistic accent size="sm" label="Float cost" value="€ 0.74M" />
      <Statistic accent size="sm" label="Margin" value="−2%" tone="danger" />
    </div>
  ),
};
