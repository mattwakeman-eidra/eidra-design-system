import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentBar } from './SegmentBar.js';

const REVENUE = [
  { value: 11.5, label: 'Actuals' },
  { value: 6.7, label: 'Sold' },
  { value: 3.4, label: 'Hi-prob' },
];

const meta = {
  title: 'Data Display/SegmentBar',
  component: SegmentBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    segments: REVENUE,
    size: 'md',
    showLabels: false,
    showLegend: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    // Arrays of objects — driven by fixtures, not editable as controls.
    segments: { control: false },
    markers: { control: false },
  },
} satisfies Meta<typeof SegmentBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-editable control. Tweak `size`, `showLabels`, and `showLegend` from the controls. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <SegmentBar {...args} />
    </div>
  ),
};

/** The Graphs hero KPI: revenue composition with inline labels and a legend. */
export const RevenueComposition: Story = {
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
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

/**
 * A threshold marker (the "budget line"). Markers are positioned on the same
 * scale as `total`, so the line lands at `value / total` along the bar.
 */
export const WithMarker: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <SegmentBar
        segments={[
          { value: 120, label: 'Spent', color: 'var(--eidra-finance-revenue-actuals)' },
          { value: 40, label: 'Planned', color: 'var(--eidra-finance-revenue-sold)' },
        ]}
        total={200}
        markers={[{ value: 180, label: 'Budget', tone: 'warning' }]}
        showLegend
        size="lg"
      />
    </div>
  ),
};

/**
 * Stacking bars with a **shared `total`** and the **same marker `value`** aligns
 * the budget line across every bar — the budget-burn pattern from Project Economics.
 */
export const SharedBudgetLine: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const total = 200;
    const budget = [{ value: 180, label: 'Budget', tone: 'warning' as const }];
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-4)', maxWidth: 560 }}>
        <div>
          <div
            style={{
              font: '700 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--eidra-fg-muted)',
              marginBottom: 'var(--eidra-space-1)',
            }}
          >
            Billable
          </div>
          <SegmentBar
            segments={[
              { value: 90, label: 'Before', color: 'var(--eidra-color-grey-900)' },
              { value: 45, label: 'This month', color: 'var(--eidra-color-grey-700)' },
              { value: 30, label: 'Planned', color: 'var(--eidra-color-grey-300)' },
            ]}
            total={total}
            markers={budget}
            size="lg"
          />
        </div>
        <div>
          <div
            style={{
              font: '700 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--eidra-fg-muted)',
              marginBottom: 'var(--eidra-space-1)',
            }}
          >
            Revenue
          </div>
          <SegmentBar
            segments={[
              { value: 130, label: 'Booked', color: 'var(--eidra-finance-positive)' },
              { value: 25, label: 'Pending', color: 'var(--eidra-finance-revenue-hi-prob)' },
            ]}
            total={total}
            markers={budget}
            size="lg"
          />
        </div>
      </div>
    );
  },
};
