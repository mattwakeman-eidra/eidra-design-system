import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Alert } from './Alert.js';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    tone: 'info',
    children: 'Your session will expire in 15 minutes. Save your work to avoid losing changes.',
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger', 'neutral'],
    },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
    // ReactNode (JSX in some stories) — not editable as a control.
    icon: { control: false },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)' }}>
    {children}
  </div>
);

export const Playground: Story = {};

export const AllTones: Story = {
  render: (args) => (
    <Stack>
      <Alert {...args} tone="info" title="Information">
        The quarterly review meeting has been rescheduled to Friday 14:00 CET.
      </Alert>
      <Alert {...args} tone="success" title="Report submitted">
        Your engagement report for Eidra Nordic AS has been delivered successfully.
      </Alert>
      <Alert {...args} tone="warning" title="Action required">
        Two deliverables are approaching their deadline. Review the project timeline.
      </Alert>
      <Alert {...args} tone="danger" title="Submission failed">
        We could not save your changes. Please check your connection and try again.
      </Alert>
      <Alert {...args} tone="neutral" title="Notice">
        This environment is read-only. Contact your administrator to make changes.
      </Alert>
    </Stack>
  ),
};

export const WithoutTitle: Story = {
  render: (args) => (
    <Stack>
      <Alert {...args} tone="info">
        The quarterly review has been rescheduled to Friday 14:00 CET.
      </Alert>
      <Alert {...args} tone="success">
        Your report has been submitted successfully.
      </Alert>
      <Alert {...args} tone="warning">
        Two deliverables are approaching their deadline.
      </Alert>
      <Alert {...args} tone="danger">
        We could not save your changes. Please try again.
      </Alert>
    </Stack>
  ),
};

export const Dismissible: Story = {
  render: (args) => (
    <Stack>
      <Alert {...args} tone="info" title="Cookie settings updated" dismissible>
        Your preferences have been saved. You can update them at any time from Settings.
      </Alert>
      <Alert {...args} tone="success" title="Invoice sent" dismissible>
        Invoice #INV-2024-0042 has been dispatched to the client.
      </Alert>
      <Alert {...args} tone="warning" dismissible>
        Your API token expires in 3 days. Renew it to avoid service interruptions.
      </Alert>
    </Stack>
  ),
};

export const CustomIcon: Story = {
  args: {
    tone: 'success',
    title: 'All checks passed',
    icon: <Icon icon={CheckCircle} size="md" />,
    children: 'The pull request is ready to merge into main.',
  },
};

export const NoIcon: Story = {
  args: {
    tone: 'neutral',
    title: 'Maintenance window',
    icon: null,
    children: 'Scheduled maintenance is planned for Sunday 02:00–04:00 CET. Services may be briefly unavailable.',
  },
};
