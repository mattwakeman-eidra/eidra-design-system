import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList } from './DescriptionList.js';

const meta = {
  title: 'Data Display/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Revenue', value: '€ 50,000' },
      { label: 'Lead', value: 'Sofia Lind' },
      { label: 'Stage', value: 'Negotiation' },
      { label: 'Close date', value: '30 Jun 2026' },
    ],
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    columns: { control: { type: 'number', min: 1, max: 4 } },
    // Array of objects — not editable as a control.
    items: { control: false },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Label beside value — the default, for compact metadata panels. */
export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

/** Label stacked above value — reads well in narrow columns and cards. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

/** Flow the pairs across a responsive two-column grid (collapses on narrow widths). */
export const TwoColumn: Story = {
  args: {
    orientation: 'vertical',
    columns: 2,
    items: [
      { label: 'Revenue', value: '€ 50,000' },
      { label: 'Net revenue', value: '€ 42,500' },
      { label: 'Lead', value: 'Sofia Lind' },
      { label: 'Owner', value: 'Marcus Bergström' },
      { label: 'Stage', value: 'Negotiation' },
      { label: 'Probability', value: '70%' },
    ],
  },
};
