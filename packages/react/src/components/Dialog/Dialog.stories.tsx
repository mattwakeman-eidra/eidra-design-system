import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Trash2 } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Button } from '../Button/Button.js';
import { Dialog } from './Dialog.js';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog.Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog.Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Playground ----
export const Playground: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" tone="accent">Open dialog</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>Project kickoff</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              Review the project brief and confirm the scope before we proceed to the discovery
              phase.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="outline" tone="neutral">Cancel</Button>} />
            <Dialog.Close render={<Button variant="solid" tone="accent">Confirm</Button>} />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open dialog/i });

    await step('clicking the trigger opens the dialog (portaled to body)', async () => {
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await waitFor(() => expect(screen.getByText(/project kickoff/i)).toBeVisible());
    });

    await step('a Dialog.Close footer button closes the dialog', async () => {
      await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Escape dismisses the open dialog', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  },
};

// ---- Confirmation dialog ----
export const Confirmation: Story = {
  name: 'Confirmation (destructive)',
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="outline" tone="danger" startIcon={<Icon icon={Trash2} />}>Delete project</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>Delete project?</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This will permanently delete <strong>Nordic Identity Refresh</strong> and all its
              assets. This action cannot be undone.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="ghost" tone="neutral">Cancel</Button>} />
            <Dialog.Close render={<Button variant="solid" tone="danger">Delete project</Button>} />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /delete project/i });

    await step('opening surfaces the title + description via aria', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await expect(dialog).toHaveAccessibleName(/delete project/i);
      await expect(dialog).toHaveAccessibleDescription(/cannot be undone/i);
    });

    await step('the CloseButton (X icon) closes the dialog', async () => {
      await userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  },
};

// ---- Non-modal dialog ----
export const NonModal: Story = {
  render: () => (
    <Dialog.Root modal={false}>
      <Dialog.Trigger render={<Button variant="outline" tone="neutral">Open non-modal</Button>} />
      <Dialog.Portal>
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>Quick note</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This dialog does not block interaction with the rest of the page.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="solid" tone="accent">Got it</Button>} />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open non-modal/i });

    await step('a non-modal dialog opens without a modal backdrop', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      // Non-modal: the dialog is not flagged aria-modal, so the page stays reachable.
      await expect(dialog).not.toHaveAttribute('aria-modal', 'true');
      // The trigger behind it is still in the document and not inert/hidden.
      await expect(trigger).toBeVisible();
    });

    await step('the footer Close button dismisses it', async () => {
      await userEvent.click(screen.getByRole('button', { name: /got it/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  },
};

// ---- Controlled ----
// Module-scoped spy: `meta` types args against Dialog.Popup, so onOpenChange
// can't live in `args`. The play function reads this directly.
const controlledOnOpenChange = fn();

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="solid" tone="accent" onClick={() => setOpen(true)}>
          Open (controlled)
        </Button>
        <Dialog.Root
          open={open}
          onOpenChange={(next, details) => {
            setOpen(next);
            controlledOnOpenChange(next, details);
          }}
        >
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Header>
                <Dialog.Title>Controlled dialog</Dialog.Title>
                <Dialog.CloseButton />
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>
                  Open state is controlled externally. Click Cancel or the X to close.
                </Dialog.Description>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant="outline" tone="neutral">Cancel</Button>} />
                <Button variant="solid" tone="accent" onClick={() => setOpen(false)}>
                  Save changes
                </Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    controlledOnOpenChange.mockClear();
    const trigger = canvas.getByRole('button', { name: /open \(controlled\)/i });

    await step('host-driven trigger opens the controlled dialog (no Dialog.Trigger)', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
    });

    await step('closing via the X fires onOpenChange(false, …)', async () => {
      await userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(controlledOnOpenChange).toHaveBeenCalled();
      // Base UI 1.x calls onOpenChange(open, eventDetails) — two args.
      await expect(controlledOnOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    });

    await step('reopening then Escape also drives onOpenChange to false', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      controlledOnOpenChange.mockClear();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(controlledOnOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    });
  },
};

// ---- Long content (scrollable) ----
export const LongContent: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="outline" tone="neutral">Terms &amp; conditions</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>Terms &amp; conditions</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>Please read and accept before continuing.</Dialog.Description>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} style={{ margin: 0, fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)', lineHeight: 'var(--eidra-font-line-height-relaxed)' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant
                morbi tristique senectus et netus et malesuada fames ac turpis egestas. Eidra
                helps Nordic companies shape digital experiences that matter.
              </p>
            ))}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="ghost" tone="neutral">Decline</Button>} />
            <Dialog.Close render={<Button variant="solid" tone="accent">Accept</Button>} />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /terms & conditions/i });

    await step('opening a modal dialog moves focus inside it', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      // A modal dialog traps focus: the active element lives within the popup.
      await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    });

    await step('closing restores focus to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveFocus();
    });
  },
};
