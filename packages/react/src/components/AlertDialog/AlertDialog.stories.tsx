import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Trash2, AlertTriangle, LogOut } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { AlertDialog } from './AlertDialog.js';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helper: action row ────────────────────────────────────────────────────────

const ActionRow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--eidra-space-2)',
      justifyContent: 'flex-end',
      marginTop: 'var(--eidra-space-2)',
    }}
  >
    {children}
  </div>
);

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Open alert dialog</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. Please confirm you want to proceed.
          </AlertDialog.Description>
          <ActionRow>
            <AlertDialog.Close>Cancel</AlertDialog.Close>
            <AlertDialog.Close>Confirm</AlertDialog.Close>
          </ActionRow>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

// ── Delete account ────────────────────────────────────────────────────────────

export const DeleteAccount: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger
        style={{
          background: 'var(--eidra-danger)',
          color: 'var(--eidra-color-white)',
          borderColor: 'var(--eidra-danger)',
        }}
      >
        <Icon icon={Trash2} size="sm" />
        Delete account
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete your account?</AlertDialog.Title>
          <AlertDialog.Description>
            All of your data — projects, invoices, and team memberships — will be permanently
            removed from Eidra. This action cannot be reversed.
          </AlertDialog.Description>
          <ActionRow>
            <AlertDialog.Close>Keep account</AlertDialog.Close>
            <AlertDialog.Close
              style={{
                background: 'var(--eidra-danger)',
                color: 'var(--eidra-color-white)',
                borderColor: 'var(--eidra-danger)',
              }}
            >
              Yes, delete account
            </AlertDialog.Close>
          </ActionRow>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

// ── Sign out ──────────────────────────────────────────────────────────────────

export const SignOut: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Icon icon={LogOut} size="sm" />
        Sign out
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>Sign out of Eidra?</AlertDialog.Title>
          <AlertDialog.Description>
            You will be redirected to the login page. Any unsaved changes will be lost.
          </AlertDialog.Description>
          <ActionRow>
            <AlertDialog.Close>Stay signed in</AlertDialog.Close>
            <AlertDialog.Close
              style={{
                background: 'var(--eidra-accent)',
                color: 'var(--eidra-accent-fg)',
                borderColor: 'var(--eidra-accent)',
              }}
            >
              Sign out
            </AlertDialog.Close>
          </ActionRow>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

// ── Destructive warning ───────────────────────────────────────────────────────

export const DestructiveWarning: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Archive project</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--eidra-space-3)',
              color: 'var(--eidra-warning-fg)',
            }}
          >
            <Icon icon={AlertTriangle} size="md" />
            <AlertDialog.Title style={{ color: 'inherit' }}>Archive "Fjord Portal"?</AlertDialog.Title>
          </div>
          <AlertDialog.Description>
            Archiving will hide this project from the active dashboard. Team members will lose
            access until the project is restored. Billing continues unchanged.
          </AlertDialog.Description>
          <ActionRow>
            <AlertDialog.Close>Cancel</AlertDialog.Close>
            <AlertDialog.Close
              style={{
                background: 'var(--eidra-warning-subtle)',
                color: 'var(--eidra-warning-fg)',
                borderColor: 'var(--eidra-warning-border)',
              }}
            >
              Archive project
            </AlertDialog.Close>
          </ActionRow>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

// ── Controlled ────────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--eidra-space-4)' }}>
        <p style={{ fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)' }}>
          Dialog is: <strong style={{ color: 'var(--eidra-fg)' }}>{open ? 'open' : 'closed'}</strong>
        </p>
        <AlertDialog.Root open={open} onOpenChange={(next) => setOpen(next)}>
          <AlertDialog.Trigger>Open controlled dialog</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Backdrop />
            <AlertDialog.Popup>
              <AlertDialog.Title>Controlled alert dialog</AlertDialog.Title>
              <AlertDialog.Description>
                This dialog is controlled externally via the{' '}
                <code style={{ fontFamily: 'var(--eidra-font-family-mono)', fontSize: 'var(--eidra-font-size-xs)' }}>open</code>{' '}
                and{' '}
                <code style={{ fontFamily: 'var(--eidra-font-family-mono)', fontSize: 'var(--eidra-font-size-xs)' }}>onOpenChange</code>{' '}
                props.
              </AlertDialog.Description>
              <ActionRow>
                <AlertDialog.Close>Dismiss</AlertDialog.Close>
              </ActionRow>
            </AlertDialog.Popup>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    );
  },
};
