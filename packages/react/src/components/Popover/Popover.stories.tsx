import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useRef, useState } from 'react';
import { Info, Settings, User, Bell } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Button } from '../Button/Button.js';
import { Popover } from './Popover.js';

const meta = {
  title: 'Overlays/Popover',
  // Point at Root: it carries the meaningful behavior props (open/defaultOpen/
  // modal). The visual Popup part has almost no props.
  component: Popover.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIDES = ['top', 'bottom', 'left', 'right'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

// ---- Playground ----
// Flat controls: Root behavior (defaultOpen/open) plus Positioner placement
// (side/align/sideOffset).
type PopoverPlaygroundArgs = ComponentProps<typeof Popover.Root> & {
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  sideOffset: number;
};

export const Playground: StoryObj<PopoverPlaygroundArgs> = {
  args: {
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
    defaultOpen: false,
  },
  argTypes: {
    side: { control: 'inline-radio', options: SIDES },
    align: { control: 'inline-radio', options: ALIGNS },
    sideOffset: { control: 'number' },
    // Dropped `modal`: this story renders no Popover.Backdrop, so toggling modal
    // (focus-trap/interaction-blocking only) produces no visible change.
    defaultOpen: { control: 'boolean' },
    open: { control: 'boolean' },
  },
  render: ({ side, align, sideOffset, ...rootProps }) => (
    <Popover.Root {...rootProps}>
      <Popover.Trigger render={<Button variant="outline" tone="neutral">Open popover</Button>} />
      <Popover.Portal>
        <Popover.Positioner side={side} align={align} sideOffset={sideOffset}>
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open popover/i });

    await step('trigger is collapsed initially', async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(screen.queryByRole('dialog')).toBeNull();
    });

    await step('clicking the trigger opens the popup (portaled to body)', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const details = await screen.findByText(/project details/i);
      await waitFor(() => expect(details).toBeVisible());
    });

    await step('the CloseButton dismisses the popup', async () => {
      await userEvent.click(await screen.findByRole('button', { name: /close popover/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Escape dismisses an open popup', async () => {
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /astrid lindqvist/i });

    await step('opening reveals the profile card', async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible());
    });

    await step('a Popover.Close rendered as a Button closes the popup', async () => {
      await userEvent.click(await screen.findByRole('button', { name: /view profile/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
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
const onOpenChangeSpy = fn();

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
      <>
        <Button ref={anchorRef} variant="solid" tone="accent" onClick={() => setOpen(true)}>
          Open (controlled)
        </Button>
        <Popover.Root
          open={open}
          onOpenChange={(next, eventDetails) => {
            onOpenChangeSpy(next, eventDetails);
            setOpen(next);
          }}
        >
          <Popover.Portal>
            {/* No Popover.Trigger here — the popup is driven externally, so anchor
                the positioner to the controlling button explicitly. */}
            <Popover.Positioner anchor={anchorRef} side="bottom" align="center" sideOffset={8}>
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
  play: async ({ canvasElement, step }) => {
    onOpenChangeSpy.mockClear();
    const canvas = within(canvasElement);

    await step('the external button drives the controlled open state', async () => {
      // The popup has no trigger of its own; the host button flips `open`.
      await expect(screen.queryByRole('dialog')).toBeNull();
      await userEvent.click(canvas.getByRole('button', { name: /open \(controlled\)/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible());
      const controlled = await screen.findByText(/controlled popover/i);
      await waitFor(() => expect(controlled).toBeVisible());
    });

    await step('dismissing fires onOpenChange(false) and closes', async () => {
      await userEvent.click(await screen.findByRole('button', { name: /dismiss/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(onOpenChangeSpy).toHaveBeenCalled();
      await expect(onOpenChangeSpy).toHaveBeenLastCalledWith(false, expect.anything());
    });

    await step('Escape on a re-opened popup also fires onOpenChange(false)', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open \(controlled\)/i }));
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      onOpenChangeSpy.mockClear();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(onOpenChangeSpy).toHaveBeenLastCalledWith(false, expect.anything());
    });
  },
};

// ---- Uncontrolled (defaultOpen + Root onOpenChange) ----
const uncontrolledOnOpenChange = fn();

/**
 * Uncontrolled: the popover owns its own open state via `defaultOpen`, only
 * reporting transitions through `onOpenChange`. Covers the trigger toggle path
 * and outside-click (light dismiss).
 */
export const Uncontrolled: Story = {
  name: 'Uncontrolled (defaultOpen)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
      <Popover.Root defaultOpen onOpenChange={(next) => uncontrolledOnOpenChange(next)}>
        <Popover.Trigger render={<Button variant="outline" tone="neutral">Toggle popover</Button>} />
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={8}>
            <Popover.Popup>
              <Popover.Body>
                <Popover.Description>
                  Opens by default. Click the trigger to toggle, or click outside to dismiss.
                </Popover.Description>
              </Popover.Body>
              <Popover.Arrow />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <span data-testid="outside">Outside region</span>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    uncontrolledOnOpenChange.mockClear();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /toggle popover/i });

    await step('defaultOpen renders the popup open without interaction', async () => {
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeVisible());
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    await step('clicking the trigger toggles it closed and fires onOpenChange(false)', async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(uncontrolledOnOpenChange).toHaveBeenLastCalledWith(false);
    });

    await step('clicking the trigger again reopens it and fires onOpenChange(true)', async () => {
      uncontrolledOnOpenChange.mockClear();
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      await expect(uncontrolledOnOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step('clicking outside light-dismisses the popup', async () => {
      await userEvent.click(canvas.getByTestId('outside'));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};
