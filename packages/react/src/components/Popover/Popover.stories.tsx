import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Info, Settings, User, Bell } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Button } from '../Button/Button.js';
import { Popover } from './Popover.js';

const meta = {
  title: 'Overlays/Popover',
  component: Popover.Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover.Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Playground ----
export const Playground: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="outline" tone="neutral">Open popover</Button>} />
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={8}>
          <Popover.Popup>
            <Popover.Header>
              <Popover.Title>Project details</Popover.Title>
              <Popover.CloseButton />
            </Popover.Header>
            <Popover.Body>
              <Popover.Description>
                Review the scope and timeline before the discovery phase begins next week.
              </Popover.Description>
            </Popover.Body>
            <Popover.Arrow />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

// ---- Info tooltip-style ----
export const InfoPopover: Story = {
  name: 'Info popover',
  render: () => (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button variant="ghost" tone="neutral" iconOnly aria-label="More information">
            <Icon icon={Info} />
          </Button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner side="top" align="center" sideOffset={8}>
          <Popover.Popup>
            <Popover.Body>
              <Popover.Description>
                Eidra applies a Nordic minimalist design approach — focusing on clarity,
                whitespace, and purposeful interactions.
              </Popover.Description>
            </Popover.Body>
            <Popover.Arrow />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

// ---- User profile card ----
export const ProfileCard: Story = {
  name: 'Profile card',
  render: () => (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button variant="ghost" tone="neutral" startIcon={<Icon icon={User} />}>
            Astrid Lindqvist
          </Button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={8}>
          <Popover.Popup>
            <Popover.Header>
              <Popover.Title>Astrid Lindqvist</Popover.Title>
              <Popover.CloseButton />
            </Popover.Header>
            <Popover.Body>
              <Popover.Description>
                Senior UX Consultant · Oslo office
              </Popover.Description>
              <Popover.Description>
                astrid.lindqvist@eidra.com
              </Popover.Description>
            </Popover.Body>
            <Popover.Footer>
              <Popover.Close render={<Button size="sm" variant="outline" tone="neutral">View profile</Button>} />
            </Popover.Footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

// ---- Notification settings ----
export const NotificationSettings: Story = {
  name: 'Notification settings',
  render: () => (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button variant="ghost" tone="neutral" iconOnly aria-label="Notification settings">
            <Icon icon={Bell} />
          </Button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={8}>
          <Popover.Popup>
            <Popover.Header>
              <Popover.Title>Notifications</Popover.Title>
              <Popover.CloseButton />
            </Popover.Header>
            <Popover.Body>
              <Popover.Description>
                You have no unread notifications at this time.
              </Popover.Description>
            </Popover.Body>
            <Popover.Footer>
              <Popover.Close
                render={
                  <Button size="sm" variant="ghost" tone="neutral" startIcon={<Icon icon={Settings} />}>
                    Settings
                  </Button>
                }
              />
            </Popover.Footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

// ---- Positioning variants ----
export const Positioning: Story = {
  name: 'Positioning sides',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gap: 'var(--eidra-space-3)',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover.Root key={side}>
          <Popover.Trigger
            render={<Button variant="outline" tone="neutral">{side}</Button>}
          />
          <Popover.Portal>
            <Popover.Positioner side={side} align="center" sideOffset={8}>
              <Popover.Popup>
                <Popover.Body>
                  <Popover.Description>Popover on the {side}.</Popover.Description>
                </Popover.Body>
                <Popover.Arrow />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      ))}
    </div>
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
        <Popover.Root open={open} onOpenChange={(next) => setOpen(next)}>
          <Popover.Portal>
            <Popover.Positioner side="bottom" align="center" sideOffset={8}>
              <Popover.Popup>
                <Popover.Header>
                  <Popover.Title>Controlled popover</Popover.Title>
                  <Popover.CloseButton />
                </Popover.Header>
                <Popover.Body>
                  <Popover.Description>
                    Open state is driven externally. Click Dismiss or the X to close.
                  </Popover.Description>
                </Popover.Body>
                <Popover.Footer>
                  <Popover.Close
                    render={
                      <Button size="sm" variant="outline" tone="neutral">
                        Dismiss
                      </Button>
                    }
                  />
                </Popover.Footer>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </>
    );
  },
};
