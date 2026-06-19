import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatisticBar, type StatisticBarItem } from './StatisticBar.js';

const PLAYGROUND_ITEMS: StatisticBarItem[] = [
  { label: 'Clients', value: '128' },
  { label: 'Actuals YTD', value: '€11.5M' },
  { label: 'Sold forecast', value: '€18.2M', tone: 'positive' },
  { label: 'Year-end', value: '€21.6M', tone: 'accent' },
];

const meta = {
  title: 'Data Display/StatisticBar',
  component: StatisticBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    items: PLAYGROUND_ITEMS,
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    // Array of objects — driven by fixtures, not editable as a control.
    items: { control: false },
  },
} satisfies Meta<typeof StatisticBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-editable control. Tweak `size` from the controls. */
export const Playground: Story = {};

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

const SIZED: StatisticBarItem[] = [
  { label: 'Actuals YTD', value: '€11.5M' },
  { label: 'Sold forecast', value: '€18.2M', tone: 'positive' },
  { label: 'Year-end', value: '€21.6M', tone: 'accent' },
];

/** Three value sizes. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-6)' }}>
      <StatisticBar size="sm" items={SIZED} />
      <StatisticBar size="md" items={SIZED} />
      <StatisticBar size="lg" items={SIZED} />
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
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        padding: 'var(--eidra-space-4) var(--eidra-space-5)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        backgroundColor: 'var(--eidra-surface)',
      }}
    >
      <StatisticBar
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
