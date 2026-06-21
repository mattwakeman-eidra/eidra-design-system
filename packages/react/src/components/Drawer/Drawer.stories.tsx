import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Menu as MenuIcon, SlidersHorizontal } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Button } from '../Button/Button.js';
import { Drawer } from './Drawer.js';

const meta = {
  title: 'Overlays/Drawer',
  // Point at Root: it carries the meaningful props (side/modal/open/defaultOpen).
  // Every other part is a subcomponent so each gets its own autodocs props table.
  component: Drawer.Root,
  subcomponents: {
    'Drawer.Trigger': Drawer.Trigger,
    'Drawer.Portal': Drawer.Portal,
    'Drawer.Backdrop': Drawer.Backdrop,
    'Drawer.Viewport': Drawer.Viewport,
    'Drawer.Popup': Drawer.Popup,
    'Drawer.Header': Drawer.Header,
    'Drawer.Body': Drawer.Body,
    'Drawer.Footer': Drawer.Footer,
    'Drawer.Title': Drawer.Title,
    'Drawer.Description': Drawer.Description,
    'Drawer.Close': Drawer.Close,
    'Drawer.CloseButton': Drawer.CloseButton,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A **drawer** (Base UI `Drawer`, `role="dialog"`): a panel that slides in from an edge ' +
          'of the screen, with swipe-to-dismiss gestures. Use it for navigation, filters, or detail ' +
          'content that should overlay the page.\n\n' +
          'Pick the edge with `side` on `Drawer.Root` (`right` default, `left`, `top`, `bottom`); the ' +
          'dismiss gesture follows the edge automatically. For centred content prefer **Dialog**.',
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    modal: { control: 'inline-radio', options: [true, false, 'trap-focus'] },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Playground ----
export const Playground: Story = {
  args: {
    side: 'right',
    modal: true,
    defaultOpen: false,
  },
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger
        render={
          <Button variant="solid" tone="accent">
            Open drawer
          </Button>
        }
      />
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Header>
              <Drawer.Title>Project settings</Drawer.Title>
              <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body>
              <Drawer.Description>
                Adjust the workspace defaults. Changes apply to everyone on the project.
              </Drawer.Description>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close
                render={
                  <Button variant="outline" tone="neutral">
                    Cancel
                  </Button>
                }
              />
              <Drawer.Close
                render={
                  <Button variant="solid" tone="accent">
                    Save changes
                  </Button>
                }
              />
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open drawer/i });

    await step('clicking the trigger opens the drawer (portaled to body)', async () => {
      await userEvent.click(trigger);
      const drawer = await screen.findByRole('dialog');
      await waitFor(() => expect(drawer).toBeVisible());
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await waitFor(() => expect(screen.getByText(/project settings/i)).toBeVisible());
    });

    await step('a Drawer.Close footer button closes it', async () => {
      await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Escape dismisses the open drawer', async () => {
      await userEvent.click(trigger);
      const drawer = await screen.findByRole('dialog');
      await waitFor(() => expect(drawer).toBeVisible());
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  },
};

// ---- Navigation drawer (left) ----
export const NavigationLeft: Story = {
  name: 'Navigation (left side)',
  render: () => (
    <Drawer.Root side="left">
      <Drawer.Trigger
        render={
          <Button variant="outline" tone="neutral" startIcon={<Icon icon={MenuIcon} />}>
            Menu
          </Button>
        }
      />
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Header>
              <Drawer.Title>Navigation</Drawer.Title>
              <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body>
              {['Dashboard', 'Projects', 'Reports', 'Team', 'Settings'].map((item) => (
                <Drawer.Close
                  key={item}
                  render={
                    <Button variant="ghost" tone="neutral" style={{ justifyContent: 'flex-start' }}>
                      {item}
                    </Button>
                  }
                />
              ))}
            </Drawer.Body>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /menu/i });

    await step('opening a left drawer surfaces the nav items', async () => {
      await userEvent.click(trigger);
      const drawer = await screen.findByRole('dialog');
      await waitFor(() => expect(drawer).toBeVisible());
      await expect(drawer).toHaveAttribute('data-eidra-side', 'left');
      await expect(screen.getByRole('button', { name: /dashboard/i })).toBeVisible();
    });

    await step('clicking a nav item closes the drawer', async () => {
      await userEvent.click(screen.getByRole('button', { name: /projects/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  },
};

// ---- Bottom sheet ----
export const BottomSheet: Story = {
  name: 'Bottom sheet',
  render: () => (
    <Drawer.Root side="bottom">
      <Drawer.Trigger
        render={
          <Button variant="outline" tone="neutral" startIcon={<Icon icon={SlidersHorizontal} />}>
            Filters
          </Button>
        }
      />
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Header>
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body>
              <Drawer.Description>
                Narrow the results. Swipe down or press Escape to dismiss.
              </Drawer.Description>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close
                render={
                  <Button variant="ghost" tone="neutral">
                    Reset
                  </Button>
                }
              />
              <Drawer.Close
                render={
                  <Button variant="solid" tone="accent">
                    Apply
                  </Button>
                }
              />
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /filters/i });

    await step('opening a bottom sheet anchors it to the bottom edge', async () => {
      await userEvent.click(trigger);
      const drawer = await screen.findByRole('dialog');
      await waitFor(() => expect(drawer).toBeVisible());
      await expect(drawer).toHaveAttribute('data-eidra-side', 'bottom');
    });

    await step('the Apply button dismisses the sheet', async () => {
      await userEvent.click(screen.getByRole('button', { name: /apply/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  },
};

// ---- Controlled ----
export const Controlled: Story = {
  args: {
    onOpenChange: fn(),
  },
  render: function ControlledStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="solid" tone="accent" onClick={() => setOpen(true)}>
          Open (controlled)
        </Button>
        <Drawer.Root
          open={open}
          side={args.side}
          onOpenChange={(next, details) => {
            setOpen(next);
            args.onOpenChange?.(next, details);
          }}
        >
          <Drawer.Portal>
            <Drawer.Backdrop />
            <Drawer.Viewport>
              <Drawer.Popup>
                <Drawer.Header>
                  <Drawer.Title>Controlled drawer</Drawer.Title>
                  <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body>
                  <Drawer.Description>
                    Open state is controlled externally. Click Done or the X to close.
                  </Drawer.Description>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button variant="solid" tone="accent" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                </Drawer.Footer>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const onOpenChange = args.onOpenChange as ReturnType<typeof fn>;
    onOpenChange.mockClear();
    const trigger = canvas.getByRole('button', { name: /open \(controlled\)/i });

    await step('host-driven trigger opens the controlled drawer', async () => {
      await userEvent.click(trigger);
      const drawer = await screen.findByRole('dialog');
      await waitFor(() => expect(drawer).toBeVisible());
    });

    await step('Escape drives onOpenChange(false, …)', async () => {
      onOpenChange.mockClear();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    });
  },
};
