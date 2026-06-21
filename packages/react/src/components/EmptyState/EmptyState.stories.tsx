import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, SearchX, Inbox, FolderPlus } from '@eidra/icons';
import { EmptyState } from './EmptyState.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    // ReactNode (JSX) — not editable as controls.
    icon: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => <EmptyState {...args} icon={<Icon icon={Inbox} size="lg" />} />,
};

/** No-results state for a search or filtered list. */
export const NoResults: Story = {
  args: {
    icon: <Icon icon={SearchX} size="lg" />,
    title: 'No clients match your filters',
    description: 'Try adjusting your search or removing some filters.',
  },
};

/** Empty state with a primary action. */
export const WithAction: Story = {
  args: {
    icon: <Icon icon={FolderPlus} size="lg" />,
    title: 'No projects yet',
    description: 'Create your first project to start tracking sold and forecast revenue.',
    actions: <Button tone="accent">New project</Button>,
  },
};

/** Compact size for use inside a table body or small card. */
export const Compact: Story = {
  args: {
    size: 'sm',
    icon: <Icon icon={Inbox} size="md" />,
    title: 'Nothing here',
    description: 'This list is empty.',
  },
};
