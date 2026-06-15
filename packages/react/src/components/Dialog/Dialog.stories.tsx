import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Trash2 } from '@eidra/icons';
import { Icon } from '@eidra/icons';
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
};

// ---- Controlled ----
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="solid" tone="accent" onClick={() => setOpen(true)}>
          Open (controlled)
        </Button>
        <Dialog.Root open={open} onOpenChange={(next) => setOpen(next)}>
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
};
