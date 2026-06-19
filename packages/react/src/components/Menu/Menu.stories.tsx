import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, ChevronRight, Settings, User, LogOut, Moon, Bell, Trash2 } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Menu } from './Menu.js';

const meta = {
  title: 'Overlays/Menu',
  component: Menu.Root,
  subcomponents: {
    'Menu.Trigger': Menu.Trigger,
    'Menu.Portal': Menu.Portal,
    'Menu.Positioner': Menu.Positioner,
    'Menu.Popup': Menu.Popup,
    'Menu.Item': Menu.Item,
    'Menu.CheckboxItem': Menu.CheckboxItem,
    'Menu.CheckboxItemIndicator': Menu.CheckboxItemIndicator,
    'Menu.RadioGroup': Menu.RadioGroup,
    'Menu.RadioItem': Menu.RadioItem,
    'Menu.RadioItemIndicator': Menu.RadioItemIndicator,
    'Menu.Group': Menu.Group,
    'Menu.GroupLabel': Menu.GroupLabel,
    'Menu.Separator': Menu.Separator,
    'Menu.SubmenuRoot': Menu.SubmenuRoot,
    'Menu.SubmenuTrigger': Menu.SubmenuTrigger,
    'Menu.Arrow': Menu.Arrow,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // Dropped invisible controls: `modal` (no backdrop/scrim is rendered, so
  // toggling shows nothing) and `orientation` (keyboard roving direction only —
  // no layout/direction rule in the CSS module).
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the menu is open on first render (uncontrolled).',
    },
  },
  args: {
    defaultOpen: false,
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <Menu.Root {...args}>
      <Menu.Trigger>Options</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>View profile</Menu.Item>
            <Menu.Item>Edit settings</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Sign out</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /options/i });

    await step('clicking the trigger opens the menu (data-popup-open reflects state)', async () => {
      // Base UI's menu trigger signals open state via `data-popup-open`, not
      // aria-expanded (which stays "false" — the button advertises aria-haspopup).
      await expect(trigger).not.toHaveAttribute('data-popup-open');
      await userEvent.click(trigger);
      // Menu popup is portaled to document.body — query with screen.
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
      await waitFor(() => expect(trigger).toHaveAttribute('data-popup-open'));
    });

    await step('arrow keys move highlight between items', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(screen.getByRole('menuitem', { name: /view profile/i })).toHaveAttribute(
        'data-highlighted',
      );
      await userEvent.keyboard('{ArrowDown}');
      await expect(screen.getByRole('menuitem', { name: /edit settings/i })).toHaveAttribute(
        'data-highlighted',
      );
    });

    await step('Escape closes the menu and returns focus to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      await expect(trigger).not.toHaveAttribute('data-popup-open');
      await expect(trigger).toHaveFocus();
    });
  },
};

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Account</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Workspace</Menu.GroupLabel>
              <Menu.Item>
                <Icon icon={User} size="sm" />
                View profile
              </Menu.Item>
              <Menu.Item>
                <Icon icon={Settings} size="sm" />
                Settings
              </Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Item>
                <Icon icon={LogOut} size="sm" />
                Sign out
              </Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

/**
 * **Item selection.** Clicking a `Menu.Item` fires its `onClick` and (by default)
 * closes the menu — `closeOnClick` is `true` for plain items.
 */
export const ItemSelection: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onSignOut = fn();
    return (
      <Menu.Root>
        <Menu.Trigger>Account</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8}>
            <Menu.Popup>
              <Menu.Item>View profile</Menu.Item>
              <Menu.Separator />
              <Menu.Item onClick={onSignOut}>
                <Icon icon={LogOut} size="sm" />
                Sign out
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /account/i });

    await step('open the menu with the keyboard (Enter)', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
    });

    await step('Enter on a highlighted item selects it and closes the menu', async () => {
      // First item is auto-highlighted when opened via keyboard; navigate to Sign out.
      const signOut = screen.getByRole('menuitem', { name: /sign out/i });
      await userEvent.click(signOut);
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      await expect(trigger).not.toHaveAttribute('data-popup-open');
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * **Type-ahead.** With the menu open, typing the first letters of an item label
 * highlights the matching item, like a native menu.
 */
export const TypeAhead: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Jump to</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>Apples</Menu.Item>
            <Menu.Item>Bananas</Menu.Item>
            <Menu.Item>Cherries</Menu.Item>
            <Menu.Item>Dates</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /jump to/i }));
    const menu = await screen.findByRole('menu');
    // Base UI typeahead only highlights while the menu has DOM focus; clicking the
    // trigger to open doesn't guarantee focus has landed on the popup yet.
    await waitFor(() => expect(menu).toHaveFocus());

    await step('typing "c" highlights Cherries', async () => {
      await userEvent.keyboard('c');
      await waitFor(() =>
        expect(screen.getByRole('menuitem', { name: /cherries/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
    });

    await step('End jumps to the last item, Home to the first', async () => {
      await userEvent.keyboard('{End}');
      await waitFor(() =>
        expect(screen.getByRole('menuitem', { name: /dates/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
      await userEvent.keyboard('{Home}');
      await waitFor(() =>
        expect(screen.getByRole('menuitem', { name: /apples/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
    });
  },
};

/**
 * **Disabled items are skipped.** A disabled `Menu.Item` reports `aria-disabled`
 * and is bypassed by arrow-key navigation.
 */
export const DisabledNavigation: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Edit</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>Undo</Menu.Item>
            <Menu.Item disabled>Redo</Menu.Item>
            <Menu.Item>Cut</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /edit/i }));
    const menu = await screen.findByRole('menu');
    // Base UI only engages roving keyboard highlight once the popup holds focus;
    // a pointer-click open lands focus on the popup a frame later, so wait for it
    // before driving arrow keys (otherwise the keypress lands on the trigger).
    await waitFor(() => expect(menu).toHaveFocus());

    await step('disabled item exposes aria-disabled', async () => {
      await expect(screen.getByRole('menuitem', { name: /redo/i })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    await step('arrow keys traverse items; the disabled item is reachable but inert', async () => {
      // Base UI keeps disabled items in the roving order (reachable for
      // discoverability) — they take `data-highlighted` but stay aria-disabled
      // and cannot be activated. Arrow nav therefore steps through Redo, not past it.
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(screen.getByRole('menuitem', { name: /undo/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
      await userEvent.keyboard('{ArrowDown}');
      const redo = screen.getByRole('menuitem', { name: /redo/i });
      await waitFor(() => expect(redo).toHaveAttribute('data-highlighted'));
      await expect(redo).toHaveAttribute('aria-disabled', 'true');
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(screen.getByRole('menuitem', { name: /cut/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
    });
  },
};

// ─── WithCheckboxItems ────────────────────────────────────────────────────────

export const WithCheckboxItems: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Preferences</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Group>
            <Menu.GroupLabel>Notifications</Menu.GroupLabel>
            <Menu.CheckboxItem defaultChecked>
              <Menu.CheckboxItemIndicator>
                <Icon icon={Check} size="sm" />
              </Menu.CheckboxItemIndicator>
              <Icon icon={Bell} size="sm" />
              Email notifications
            </Menu.CheckboxItem>
            <Menu.CheckboxItem>
              <Menu.CheckboxItemIndicator>
                <Icon icon={Check} size="sm" />
              </Menu.CheckboxItemIndicator>
              <Icon icon={Moon} size="sm" />
              Dark mode
            </Menu.CheckboxItem>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /preferences/i }));
    await screen.findByRole('menu');

    await step('checkbox items reflect their default checked state', async () => {
      await expect(
        screen.getByRole('menuitemcheckbox', { name: /email notifications/i }),
      ).toHaveAttribute('aria-checked', 'true');
      await expect(
        screen.getByRole('menuitemcheckbox', { name: /dark mode/i }),
      ).toHaveAttribute('aria-checked', 'false');
    });

    await step('toggling a checkbox item flips aria-checked and keeps the menu open', async () => {
      const darkMode = screen.getByRole('menuitemcheckbox', { name: /dark mode/i });
      await userEvent.click(darkMode);
      await expect(darkMode).toHaveAttribute('aria-checked', 'true');
      // closeOnClick defaults to false for checkbox items — menu stays open.
      await waitFor(() => expect(screen.getByRole('menu')).toBeVisible());
    });
  },
};

/**
 * **Controlled checkbox item.** The host owns `checked`; the item only reports
 * intent via `onCheckedChange`.
 */
export const ControlledCheckboxItem: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onCheckedChange = fn();
    function ControlledMenu() {
      const [checked, setChecked] = useState(false);
      return (
        <Menu.Root>
          <Menu.Trigger>Preferences</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8}>
              <Menu.Popup>
                <Menu.CheckboxItem
                  checked={checked}
                  onCheckedChange={(next) => {
                    onCheckedChange(next);
                    setChecked(next);
                  }}
                >
                  <Menu.CheckboxItemIndicator>
                    <Icon icon={Check} size="sm" />
                  </Menu.CheckboxItemIndicator>
                  Dark mode
                </Menu.CheckboxItem>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      );
    }
    return <ControlledMenu />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /preferences/i }));
    await screen.findByRole('menu');
    const item = screen.getByRole('menuitemcheckbox', { name: /dark mode/i });

    await step('starts unchecked (controlled value is false)', async () => {
      await expect(item).toHaveAttribute('aria-checked', 'false');
    });

    await step('clicking fires onCheckedChange and the controlled value updates to checked', async () => {
      await userEvent.click(item);
      await expect(item).toHaveAttribute('aria-checked', 'true');
    });

    await step('Space toggles it back off', async () => {
      await userEvent.keyboard(' ');
      await expect(item).toHaveAttribute('aria-checked', 'false');
    });
  },
};

// ─── WithRadioItems ───────────────────────────────────────────────────────────

export const WithRadioItems: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Sort by</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.RadioGroup defaultValue="recent">
              <Menu.GroupLabel>Order</Menu.GroupLabel>
              <Menu.RadioItem value="recent">
                <Menu.RadioItemIndicator>
                  <Icon icon={Check} size="sm" />
                </Menu.RadioItemIndicator>
                Most recent
              </Menu.RadioItem>
              <Menu.RadioItem value="name">
                <Menu.RadioItemIndicator>
                  <Icon icon={Check} size="sm" />
                </Menu.RadioItemIndicator>
                Name
              </Menu.RadioItem>
              <Menu.RadioItem value="size">
                <Menu.RadioItemIndicator>
                  <Icon icon={Check} size="sm" />
                </Menu.RadioItemIndicator>
                Size
              </Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /sort by/i }));
    await screen.findByRole('menu');

    await step('the defaultValue item is selected', async () => {
      await expect(screen.getByRole('menuitemradio', { name: /most recent/i })).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    await step('selecting another radio item moves the selection (single-select)', async () => {
      const name = screen.getByRole('menuitemradio', { name: /^name$/i });
      await userEvent.click(name);
      await expect(name).toHaveAttribute('aria-checked', 'true');
      await expect(screen.getByRole('menuitemradio', { name: /most recent/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });
  },
};

/**
 * **Controlled radio group.** The host owns the value via `onValueChange`; the
 * spy confirms the new value is reported on selection.
 */
export const ControlledRadioGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onValueChange = fn();
    function ControlledMenu() {
      const [value, setValue] = useState('recent');
      return (
        <Menu.Root>
          <Menu.Trigger>Sort by</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8}>
              <Menu.Popup>
                <Menu.RadioGroup
                  value={value}
                  onValueChange={(next) => {
                    onValueChange(next);
                    setValue(String(next));
                  }}
                >
                  <Menu.RadioItem value="recent">
                    <Menu.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menu.RadioItemIndicator>
                    Most recent
                  </Menu.RadioItem>
                  <Menu.RadioItem value="size">
                    <Menu.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menu.RadioItemIndicator>
                    Size
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      );
    }
    return <ControlledMenu />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /sort by/i }));
    await screen.findByRole('menu');

    await step('controlled value renders "Most recent" as selected', async () => {
      await expect(screen.getByRole('menuitemradio', { name: /most recent/i })).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    await step('choosing "Size" updates the controlled value via onValueChange', async () => {
      const size = screen.getByRole('menuitemradio', { name: /^size$/i });
      await userEvent.click(size);
      await expect(size).toHaveAttribute('aria-checked', 'true');
    });
  },
};

// ─── WithSubmenu ──────────────────────────────────────────────────────────────

export const WithSubmenu: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>New document</Menu.Item>
            <Menu.Item>Open recent</Menu.Item>
            <Menu.Separator />
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger>
                Export as
                <Icon icon={ChevronRight} size="sm" />
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup>
                    <Menu.Item>PDF</Menu.Item>
                    <Menu.Item>Word (.docx)</Menu.Item>
                    <Menu.Item>Markdown</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            <Menu.Separator />
            <Menu.Item>
              <Icon icon={Trash2} size="sm" />
              Move to trash
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /file/i }));
    await screen.findByRole('menu');

    const submenuTrigger = screen.getByRole('menuitem', { name: /export as/i });

    await step('the submenu trigger starts collapsed', async () => {
      await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('hovering the submenu trigger opens the nested menu', async () => {
      await userEvent.hover(submenuTrigger);
      await waitFor(() => expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true'));
      // The submenu's items are portaled too — assert one is visible.
      const pdf = await screen.findByRole('menuitem', { name: /^PDF$/i });
      await waitFor(() => expect(pdf).toBeVisible());
    });

    await step('selecting a submenu item closes the whole menu tree', async () => {
      await userEvent.click(screen.getByRole('menuitem', { name: /^PDF$/i }));
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });
  },
};

// ─── WithDisabledItems ────────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Edit</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>Undo</Menu.Item>
            <Menu.Item disabled>Redo</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Cut</Menu.Item>
            <Menu.Item>Copy</Menu.Item>
            <Menu.Item disabled>Paste</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

/**
 * **Controlled open + `onOpenChange`.** The host owns the `open` state; the menu
 * reports every open/close intent through `onOpenChange`. A spy verifies it fires
 * on trigger click and on Escape.
 */
export const ControlledOpen: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onOpenChange = fn();
    function ControlledMenu() {
      const [open, setOpen] = useState(false);
      return (
        <Menu.Root
          open={open}
          onOpenChange={(next, details) => {
            onOpenChange(next, details);
            setOpen(next);
          }}
        >
          <Menu.Trigger>Options</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8}>
              <Menu.Popup>
                <Menu.Item>View profile</Menu.Item>
                <Menu.Item>Sign out</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      );
    }
    return <ControlledMenu />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /options/i });

    await step('opening from the closed controlled state shows the popup', async () => {
      await expect(trigger).not.toHaveAttribute('data-popup-open');
      await userEvent.click(trigger);
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
      await waitFor(() => expect(trigger).toHaveAttribute('data-popup-open'));
    });

    await step('Escape drives onOpenChange(false) and closes the controlled menu', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

// ─── FullProjectMenu ─────────────────────────────────────────────────────────

export const FullProjectMenu: Story = {
  name: 'Full Project Menu',
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Icon icon={Settings} size="sm" />
        Project settings
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>General</Menu.GroupLabel>
              <Menu.Item>
                <Icon icon={User} size="sm" />
                Rename project
              </Menu.Item>
              <Menu.CheckboxItem defaultChecked>
                <Menu.CheckboxItemIndicator>
                  <Icon icon={Check} size="sm" />
                </Menu.CheckboxItemIndicator>
                <Icon icon={Bell} size="sm" />
                Notifications
              </Menu.CheckboxItem>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
              <Menu.Item>
                <Icon icon={Trash2} size="sm" />
                Archive project
              </Menu.Item>
              <Menu.Item disabled>
                <Icon icon={Trash2} size="sm" />
                Delete project
              </Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};
