import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentBar } from './SegmentBar.js';

const meta = {
  title: 'Data Display/SegmentBar',
  component: SegmentBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { segments: [] },
} satisfies Meta<typeof SegmentBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const REVENUE = [
  { value: 11.5, label: 'Actuals' },
  { value: 6.7, label: 'Sold' },
  { value: 3.4, label: 'Hi-prob' },
];

/** The Graphs hero KPI: revenue composition with inline labels and a legend. */
export const RevenueComposition: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <SegmentBar segments={REVENUE} showLabels showLegend size="lg" />
    </div>
  ),
};

/** Just the bar — no labels or legend. */
export const BarOnly: Story = {
  args: { segments: REVENUE, 'aria-label': 'Revenue composition' },
};

/** Inline labels above each segment. */
export const WithLabels: Story = {
  args: { segments: REVENUE, showLabels: true },
};

/** A legend below the bar. */
export const WithLegend: Story = {
  args: { segments: REVENUE, showLegend: true },
};

/** Three thicknesses. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-6)', maxWidth: 480 }}>
      <SegmentBar segments={REVENUE} size="sm" showLegend />
      <SegmentBar segments={REVENUE} size="md" showLegend />
      <SegmentBar segments={REVENUE} size="lg" showLegend />
    </div>
  ),
};

/** Custom per-segment colours (here, semantic RAG tokens). */
export const CustomColors: Story = {
  args: {
    showLegend: true,
    segments: [
      { value: 62, label: 'On track', color: 'var(--eidra-finance-positive)' },
      { value: 26, label: 'At risk', color: 'var(--eidra-finance-caution)' },
      { value: 12, label: 'Slipping', color: 'var(--eidra-finance-negative)' },
    ],
  },
};

/** A single value degrades to one full-width segment. */
export const SingleSegment: Story = {
  args: { segments: [{ value: 100, label: 'Actuals' }], showLegend: true },
};
