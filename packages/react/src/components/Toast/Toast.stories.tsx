import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, AlertCircle, Info as InfoIcon, AlertTriangle } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Button } from '../Button/Button.js';
import { Toast, useToastManager } from './Toast.js';

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Toast.Provider>
        <Story />
        <Toast.Viewport />
      </Toast.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Helper: ToastList renders individual toasts from the manager ----
function ToastList() {
  const { toasts } = useToastManager();

  return (
    <>
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Content>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title != null && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description != null && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
              {toast.actionProps != null && (
                <Toast.Action {...toast.actionProps} />
              )}
            </div>
            <Toast.CloseButton />
          </Toast.Content>
        </Toast.Root>
      ))}
    </>
  );
}

// ---- Playground ----
export const Playground: Story = {
  render: function PlaygroundStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="solid"
          tone="accent"
          onClick={() =>
            toast.add({
              title: 'Changes saved',
              description: 'Your project settings have been updated.',
            })
          }
        >
          Show toast
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Success ----
export const Success: Story = {
  render: function SuccessStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="solid"
          tone="accent"
          startIcon={<Icon icon={CheckCircle2} />}
          onClick={() =>
            toast.add({
              type: 'success',
              title: 'Project published',
              description: 'Nordic Identity Refresh is now live.',
            })
          }
        >
          Publish project
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Error ----
export const ErrorToast: Story = {
  render: function ErrorStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="outline"
          tone="danger"
          startIcon={<Icon icon={AlertCircle} />}
          onClick={() =>
            toast.add({
              type: 'error',
              title: 'Upload failed',
              description: 'The file exceeds the 10 MB limit. Please try a smaller file.',
              priority: 'high',
            })
          }
        >
          Trigger error
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Warning ----
export const Warning: Story = {
  render: function WarningStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="outline"
          tone="neutral"
          startIcon={<Icon icon={AlertTriangle} />}
          onClick={() =>
            toast.add({
              type: 'warning',
              title: 'Session expiring',
              description: 'You will be signed out in 5 minutes due to inactivity.',
            })
          }
        >
          Trigger warning
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Info ----
export const InfoToast: Story = {
  render: function InfoStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="ghost"
          tone="neutral"
          startIcon={<Icon icon={InfoIcon} />}
          onClick={() =>
            toast.add({
              type: 'info',
              title: 'Maintenance window',
              description: 'Scheduled downtime on Sunday 22:00–02:00 CET.',
            })
          }
        >
          Show info
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- With action ----
export const WithAction: Story = {
  render: function WithActionStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="outline"
          tone="neutral"
          onClick={() =>
            toast.add({
              title: 'Deliverable deleted',
              description: 'The file has been moved to the trash.',
              actionProps: { children: 'Undo', onClick: () => console.log('Undo!') },
            })
          }
        >
          Delete deliverable
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Multiple toasts (stacked) ----
export const Stacked: Story = {
  render: function StackedStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="solid"
          tone="accent"
          onClick={() => {
            toast.add({ title: 'Sprint planned', description: 'Sprint 24 has been configured.' });
            toast.add({ type: 'success', title: 'Team notified', description: 'All members received an invite.' });
            toast.add({ type: 'info', title: 'Calendar synced', description: 'Sprint dates appear in your calendar.' });
          }}
        >
          Trigger 3 toasts
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Persistent (no timeout) ----
export const Persistent: Story = {
  render: function PersistentStory() {
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="outline"
          tone="neutral"
          onClick={() =>
            toast.add({
              title: 'Action required',
              description: 'Please review the updated contract before proceeding.',
              timeout: 0,
              priority: 'high',
              actionProps: { children: 'Review now', onClick: () => console.log('Review') },
            })
          }
        >
          Show persistent toast
        </Button>
        <ToastList />
      </>
    );
  },
};

// ---- Promise-based ----
export const PromiseBased: Story = {
  render: function PromiseStory() {
    const toast = useToastManager();

    function simulateSave() {
      const promise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve();
          } else {
            reject(new Error('Network error'));
          }
        }, 2000);
      });

      toast.promise(promise, {
        loading: 'Saving proposal…',
        success: 'Proposal saved successfully.',
        error: 'Failed to save. Please try again.',
      });
    }

    return (
      <>
        <Button variant="solid" tone="accent" onClick={simulateSave}>
          Save proposal
        </Button>
        <ToastList />
      </>
    );
  },
};
