import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader.js';
import { Button, Breadcrumbs } from '../../index.js';

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    title: 'Projects',
  },
  argTypes: {
    // ReactNode (JSX) — not editable as controls.
    actions: { control: false },
    breadcrumbs: { control: false },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Just a title. */
export const Default: Story = {};

/** A title with a muted supporting line below it. */
export const WithSubtitle: Story = {
  args: {
    title: 'Project economics',
    subtitle: 'Showing 42 active projects across 6 markets.',
  },
};

/** A right-aligned action cluster, vertically centred against the headings. */
export const WithActions: Story = {
  args: {
    title: 'Clients',
    subtitle: 'All accounts you have access to.',
    actions: (
      <>
        <Button variant="outline" tone="neutral">
          Export
        </Button>
        <Button>New client</Button>
      </>
    ),
  },
};

/** A breadcrumb trail sits above the title. */
export const WithBreadcrumbs: Story = {
  args: {
    title: 'Acme Corporation',
    subtitle: 'Account overview',
    breadcrumbs: (
      <Breadcrumbs
        items={[
          { label: 'Home', href: '#' },
          { label: 'Clients', href: '#' },
          { label: 'Acme Corporation' },
        ]}
      />
    ),
    actions: <Button>Edit account</Button>,
  },
};
