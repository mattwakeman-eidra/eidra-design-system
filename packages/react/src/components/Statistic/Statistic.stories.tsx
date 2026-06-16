import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic } from './Statistic.js';
import { Separator } from '../Separator/Separator.js';
import { Card } from '../Card/Card.js';

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
 * Composing a KPI bar (the `KpiBar` shape) — a horizontal strip of statistics
 * divided by `Separator`. The atom is reusable; the row layout is composition.
 */
export const KpiBarComposition: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--eidra-space-4)',
        flexWrap: 'wrap',
        padding: 'var(--eidra-space-3) var(--eidra-space-4)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
      }}
    >
      <Statistic size="sm" label="Budget" value="€ 1,200,000" />
      <Separator orientation="vertical" />
      <Statistic size="sm" label="Spent" value="€ 864,000" progress={72} caption="72%" />
      <Separator orientation="vertical" />
      <Statistic size="sm" label="Remaining" value="€ 336,000" tone="success" />
      <Separator orientation="vertical" />
      <Statistic size="sm" label="This month" value="€ 96,000" />
    </div>
  ),
};

/**
 * Composing a stat-card grid (the `ProjectHealthCard` shape) — statistics inside
 * `Card`s laid out in a grid.
 */
export const StatCardGrid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 'var(--eidra-space-4)',
        maxWidth: 720,
      }}
    >
      <Card variant="outline" padding="md">
        <Statistic label="Budget" value="€ 1,200,000" />
      </Card>
      <Card variant="outline" padding="md">
        <Statistic label="Lifetime spent" value="€ 864,000" progress={72} caption="72% of budget" />
      </Card>
      <Card variant="outline" padding="md">
        <Statistic label="This month" value="€ 96,000" />
      </Card>
      <Card variant="outline" padding="md">
        <Statistic label="Projected total" value="€ 1,310,000" tone="danger" delta="+€ 110k" />
      </Card>
    </div>
  ),
};
