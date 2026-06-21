import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic, Separator, Card } from '../index.js';

/**
 * **KPI layouts** — recipes that compose the `Statistic` atom with `Separator` and
 * `Card` into the common dashboard shapes. These live under `Patterns` (not on the
 * `Statistic` page) because they combine several components; `Statistic`'s own page
 * documents the atom and its props.
 */
const meta = {
  title: 'Patterns/KPIs',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * KPI bar — a horizontal strip of statistics divided by `Separator`. The atom is
 * reusable; the row layout is the composition.
 */
export const KpiBar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--eidra-gap-4)',
        flexWrap: 'wrap',
        padding: 'var(--eidra-gap-3) var(--eidra-gap-4)',
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

/** Stat-card grid — statistics inside `Card`s laid out in a responsive grid. */
export const StatCardGrid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 'var(--eidra-gap-4)',
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
