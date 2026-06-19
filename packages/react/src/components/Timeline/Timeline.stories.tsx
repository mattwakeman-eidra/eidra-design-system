import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, AlertTriangle, CheckCircle, FileText, MessageSquare, XCircle } from '@eidra/icons';
import { Timeline } from './Timeline.js';

const meta = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description:
        'Layout direction — `vertical` stacks the feed; `horizontal` runs items along a rail.',
    },
    // Array of objects holding JSX icons — not editable as a control.
    items: { control: false },
  },
  args: {
    orientation: 'vertical',
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A plain activity feed: a title and a muted timestamp per item. */
export const Default: Story = {
  args: {
    items: [
      { id: 1, title: 'Invoice exported to accounting', timestamp: '2 min ago' },
      { id: 2, title: 'Approved by Finance', timestamp: '1h ago' },
      { id: 3, title: 'Submitted for review', timestamp: 'Yesterday 16:04' },
      { id: 4, title: 'Draft created', timestamp: '12 Jun 2026' },
    ],
  },
};

/** Tone-coloured markers and optional icons convey the nature of each event. */
export const WithIconsAndTones: Story = {
  args: {
    items: [
      {
        id: 1,
        title: 'Invoice approved',
        timestamp: '2 min ago',
        tone: 'success',
        icon: <Icon icon={CheckCircle} size="sm" />,
        description: 'Finance OK — ready for export.',
      },
      {
        id: 2,
        title: 'Comment added',
        timestamp: '40 min ago',
        tone: 'accent',
        icon: <Icon icon={MessageSquare} size="sm" />,
        description: 'Please double-check the float cost line.',
      },
      {
        id: 3,
        title: 'Approval expiring soon',
        timestamp: '2h ago',
        tone: 'warning',
        icon: <Icon icon={AlertTriangle} size="sm" />,
        description: 'Sign off before end of day to avoid re-review.',
      },
      {
        id: 4,
        title: 'Rejected',
        timestamp: '3h ago',
        tone: 'danger',
        icon: <Icon icon={XCircle} size="sm" />,
        description: 'Missing PO number.',
      },
      {
        id: 5,
        title: 'Draft created',
        timestamp: '12 Jun 2026',
        tone: 'default',
        icon: <Icon icon={FileText} size="sm" />,
      },
    ],
    orientation: 'vertical',
  },
};

/**
 * Under a `compact` density scope the rail and stacking tighten. Wrap the feed
 * in `[data-density='compact']` (normally set on `eidra-root`) to see it.
 */
export const Dense: Story = {
  parameters: { controls: { disable: true } },
  args: {
    items: [
      { id: 1, title: 'Status changed to Approved', timestamp: '2m', tone: 'success' },
      { id: 2, title: 'Status changed to Ready for Review', timestamp: '1h', tone: 'accent' },
      { id: 3, title: 'Line items edited', timestamp: '3h' },
      { id: 4, title: 'Created', timestamp: '1d' },
    ],
  },
  render: (args) => (
    <div data-density="compact">
      <Timeline {...args} />
    </div>
  ),
};

/**
 * `orientation="horizontal"` lays the items left-to-right along a horizontal
 * rail — a step/progress reading for a small number of stages where width is
 * plentiful (e.g. an approval flow across the top of a page). Markers sit above
 * each step with the title and timestamp beneath.
 */
export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  args: {
    orientation: 'horizontal',
    items: [
      { id: 1, title: 'Draft created', timestamp: '12 Jun', tone: 'default' },
      {
        id: 2,
        title: 'Submitted',
        timestamp: '13 Jun',
        tone: 'accent',
        icon: <Icon icon={FileText} size="sm" />,
      },
      {
        id: 3,
        title: 'Approved',
        timestamp: '14 Jun',
        tone: 'success',
        icon: <Icon icon={CheckCircle} size="sm" />,
      },
      { id: 4, title: 'Exported to accounting', timestamp: '15 Jun', tone: 'success' },
    ],
  },
};
