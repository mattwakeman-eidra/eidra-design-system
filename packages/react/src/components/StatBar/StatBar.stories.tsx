import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatBar, type StatBarItem } from './StatBar.js';

const meta = {
  title: 'Data Display/StatBar',
  component: StatBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { items: [] },
} satisfies Meta<typeof StatBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Sold & Forecast headline strip, with a trailing "Override edits" metric. */
export const ForecastHeadline: Story = {
  args: {
    'aria-label': 'Forecast summary',
    items: [
      { label: 'Clients', value: '128' },
      { label: 'Actuals YTD', value: '€11.5M' },
      { label: 'Sold forecast', value: '€18.2M', tone: 'positive' },
      { label: 'Hi-prob', value: '€3.4M' },
      { label: 'Year-end', value: '€21.6M', tone: 'accent' },
      { label: 'Override edits', value: '12', caption: 'this week', align: 'end' },
    ],
  },
};

/** Tones map to finance + accent tokens. */
export const Tones: Story = {
  args: {
    items: [
      { label: 'Neutral', value: '€2.10M' },
      { label: 'Positive', value: '+€340K', tone: 'positive' },
      { label: 'Caution', value: '€0', tone: 'caution' },
      { label: 'Negative', value: '−€120K', tone: 'negative' },
      { label: 'Accent', value: '€21.6M', tone: 'accent' },
    ],
  },
};

const SIZED: StatBarItem[] = [
  { label: 'Actuals YTD', value: '€11.5M' },
  { label: 'Sold forecast', value: '€18.2M', tone: 'positive' },
  { label: 'Year-end', value: '€21.6M', tone: 'accent' },
];

/** Three value sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-6)' }}>
      <StatBar size="sm" items={SIZED} />
      <StatBar size="md" items={SIZED} />
      <StatBar size="lg" items={SIZED} />
    </div>
  ),
};

/** A caption line under selected values. */
export const WithCaptions: Story = {
  args: {
    items: [
      { label: 'Actuals YTD', value: '€11.5M', caption: '53% of budget' },
      { label: 'Sold forecast', value: '€18.2M', tone: 'positive', caption: '+8% vs LY' },
      { label: 'Year-end', value: '€21.6M', tone: 'accent', caption: 'projected' },
    ],
  },
};

/** Inside a card surface, as used at the top of the Table view. */
export const InCard: Story = {
  render: () => (
    <div
      style={{
        padding: 'var(--eidra-space-4) var(--eidra-space-5)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        backgroundColor: 'var(--eidra-surface)',
      }}
    >
      <StatBar
        aria-label="Forecast summary"
        items={[
          { label: 'Clients', value: '128' },
          { label: 'Actuals YTD', value: '€11.5M' },
          { label: 'Sold forecast', value: '€18.2M', tone: 'positive' },
          { label: 'Year-end', value: '€21.6M', tone: 'accent' },
          { label: 'Override edits', value: '12', align: 'end' },
        ]}
      />
    </div>
  ),
};
