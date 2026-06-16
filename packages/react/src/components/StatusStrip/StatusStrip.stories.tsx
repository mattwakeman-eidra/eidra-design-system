import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusStrip, type StatusTone } from './StatusStrip.js';

const meta = {
  title: 'Data Display/StatusStrip',
  component: StatusStrip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { children: null },
} satisfies Meta<typeof StatusStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const MONTHS: { m: string; status: StatusTone; v: string }[] = [
  { m: 'Jan', status: 'positive', v: '+8%' },
  { m: 'Feb', status: 'positive', v: '+5%' },
  { m: 'Mar', status: 'caution', v: '−1%' },
  { m: 'Apr', status: 'negative', v: '−6%' },
  { m: 'May', status: 'caution', v: '0%' },
  { m: 'Jun', status: 'positive', v: '+4%' },
  { m: 'Jul', status: 'positive', v: '+7%' },
  { m: 'Aug', status: 'neutral', v: '—' },
  { m: 'Sep', status: 'neutral', v: '—' },
  { m: 'Oct', status: 'neutral', v: '—' },
  { m: 'Nov', status: 'neutral', v: '—' },
  { m: 'Dec', status: 'neutral', v: '—' },
];

/** Monthly momentum: 12 RAG-coded cells. */
export const MonthlyMomentum: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <StatusStrip aria-label="Monthly momentum">
        {MONTHS.map((c) => (
          <StatusStrip.Cell key={c.m} status={c.status} label={c.m} title={`${c.m}: ${c.v}`}>
            {c.v}
          </StatusStrip.Cell>
        ))}
      </StatusStrip>
    </div>
  ),
};

/** The four tones. */
export const Tones: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <StatusStrip>
        <StatusStrip.Cell status="positive" label="Positive">+12%</StatusStrip.Cell>
        <StatusStrip.Cell status="caution" label="Caution">0%</StatusStrip.Cell>
        <StatusStrip.Cell status="negative" label="Negative">−9%</StatusStrip.Cell>
        <StatusStrip.Cell status="neutral" label="Neutral">—</StatusStrip.Cell>
      </StatusStrip>
    </div>
  ),
};
