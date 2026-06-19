import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, AlertCircle, Info as InfoIcon, AlertTriangle } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
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
        {/* Toasts render into the fixed Viewport (bottom-right), never the story
            flow — so adding a toast can't shift the trigger button. */}
        <Toast.Viewport>
          </Toast.Viewport>
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
              {toast.actionProps != null && <Toast.Action />}
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
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('clicking the trigger adds a toast that becomes visible', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /show toast/i }));
      // Toast content renders asynchronously after the manager updates.
      const title = await screen.findByText('Changes saved');
      await waitFor(() => expect(title).toBeVisible());
      const desc = await screen.findByText('Your project settings have been updated.');
      await waitFor(() => expect(desc).toBeVisible());
    });
    await step('the dismiss button removes the toast', async () => {
      // Base UI keeps the toast's Close button out of the accessibility tree
      // (aria-hidden — dismissal is surfaced via the live region), so it can't be
      // queried by role. Grab the real button and click it.
      const dismiss = document.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]');
      await expect(dismiss).not.toBeNull();
      await userEvent.click(dismiss!);
      await waitFor(() => expect(screen.queryByText('Changes saved')).toBeNull());
    });
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
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('a success-type toast surfaces title + description', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /publish project/i }));
      const title = await screen.findByText('Project published');
      await waitFor(() => expect(title).toBeVisible());
      const desc = await screen.findByText('Nordic Identity Refresh is now live.');
      await waitFor(() => expect(desc).toBeVisible());
    });
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
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('a high-priority error toast is announced assertively (role=alert)', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /trigger error/i }));
      // priority: 'high' toasts render an assertive live region exposed as role="alert".
      const alert = await screen.findByRole('alert');
      await expect(alert).toHaveTextContent(/Upload failed/);
    });
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
      </>
    );
  },
};

// ---- With action ----
export const WithAction: Story = {
  args: {
    // Mock the action handler so the play can assert it fired.
    onUndo: fn(),
  } as { onUndo: () => void },
  render: function WithActionStory(args) {
    const { onUndo } = args as { onUndo: () => void };
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
              actionProps: { children: 'Undo', onClick: onUndo },
            })
          }
        >
          Delete deliverable
        </Button>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const onUndo = (args as { onUndo: ReturnType<typeof fn> }).onUndo;
    await step('triggering shows a toast carrying an Action button', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /delete deliverable/i }));
      const deleted = await screen.findByText('Deliverable deleted');
      await waitFor(() => expect(deleted).toBeVisible());
    });
    await step('clicking the toast Action fires actionProps.onClick', async () => {
      await userEvent.click(await screen.findByRole('button', { name: /^undo$/i }));
      await expect(onUndo).toHaveBeenCalledTimes(1);
    });
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
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('one click queues three independent toasts', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /trigger 3 toasts/i }));
      // All three are queued and mounted; Base UI stacks them with the newest in
      // front (fully visible) and the older two collapsed behind it.
      const third = await screen.findByText('Calendar synced');
      await waitFor(() => expect(third).toBeVisible());
      await expect(await screen.findByText('Sprint planned')).toBeInTheDocument();
      await expect(await screen.findByText('Team notified')).toBeInTheDocument();
    });
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
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('a timeout:0 toast stays put (no auto-dismiss)', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /show persistent toast/i }));
      // Toast.Title is not a heading; the text appears twice (visible title + an
      // aria-live mirror <div>), so target the first match via findAllByText.
      await waitFor(async () =>
        expect((await screen.findAllByText('Action required'))[0]).toBeVisible(),
      );
      // Default toasts auto-dismiss at 5000ms; wait past a tick and confirm it remains.
      await new Promise((r) => setTimeout(r, 200));
      await expect((await screen.findAllByText('Action required'))[0]).toBeVisible();
    });
    await step('Escape dismisses the focused toast', async () => {
      // Move keyboard focus into the toast, then press Escape to dismiss it.
      // The action button is aria-hidden (out of the a11y tree), so locate it by
      // its text rather than its role.
      const action = screen.getByText('Review now').closest('button') as HTMLElement;
      action.focus();
      await expect(action).toHaveFocus();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByText('Action required')).toBeNull());
    });
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
      </>
    );
  },
};

// ---- Promise lifecycle (deterministic, interaction-tested) ----
/**
 * A deterministic `toast.promise` flow: the loading message appears immediately,
 * then swaps in place to the success message once the promise resolves.
 */
export const PromiseLifecycle: Story = {
  render: function PromiseLifecycleStory() {
    const toast = useToastManager();
    function run() {
      // Resolves on the next macrotask so the loading state is observable first.
      const promise = new Promise<string>((resolve) => setTimeout(() => resolve('ok'), 50));
      toast.promise(promise, {
        loading: 'Uploading deliverable…',
        success: 'Deliverable uploaded.',
        error: 'Upload failed.',
      });
    }
    return (
      <>
        <Button variant="solid" tone="accent" onClick={run}>
          Upload deliverable
        </Button>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('the loading toast appears immediately', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /upload deliverable/i }));
      const loading = await screen.findByText('Uploading deliverable…');
      await waitFor(() => expect(loading).toBeVisible());
    });
    await step('it transitions to the success toast in place', async () => {
      const uploaded = await screen.findByText('Deliverable uploaded.');
      await waitFor(() => expect(uploaded).toBeVisible());
      await waitFor(() => expect(screen.queryByText('Uploading deliverable…')).toBeNull());
    });
  },
};

// ---- onClose callback ----
/**
 * The per-toast `onClose` callback fires when the toast is dismissed (here via the
 * close button). Uncontrolled manager state: adding and removing is owned by the
 * `useToastManager` store, not host React state.
 */
export const OnCloseCallback: Story = {
  args: {
    onClose: fn(),
  } as { onClose: () => void },
  render: function OnCloseStory(args) {
    const { onClose } = args as { onClose: () => void };
    const toast = useToastManager();
    return (
      <>
        <Button
          variant="outline"
          tone="neutral"
          onClick={() =>
            toast.add({
              title: 'Draft autosaved',
              description: 'Dismiss to fire onClose.',
              onClose,
            })
          }
        >
          Autosave draft
        </Button>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const onClose = (args as { onClose: ReturnType<typeof fn> }).onClose;
    await step('dismissing the toast invokes its onClose callback', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /autosave draft/i }));
      const autosaved = await screen.findByText('Draft autosaved');
      await waitFor(() => expect(autosaved).toBeVisible());
      // The close button is aria-hidden (kept out of the a11y tree), so it can't be
      // queried by role — grab the real button and click it.
      const dismiss = document.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]');
      await expect(dismiss).not.toBeNull();
      await userEvent.click(dismiss!);
      await waitFor(() => expect(screen.queryByText('Draft autosaved')).toBeNull());
      await expect(onClose).toHaveBeenCalled();
    });
  },
};
