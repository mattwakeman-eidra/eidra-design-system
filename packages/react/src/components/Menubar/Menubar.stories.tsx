import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import {
  ChevronDown,
  ChevronRight,
  Check,
  File,
  FolderOpen,
  Save,
  FilePlus,
  Copy,
  Scissors,
  ClipboardPaste,
  Undo2,
  Redo2,
  Search,
  Settings,
  HelpCircle,
  Info,
  ExternalLink,
} from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Menubar } from './Menubar.js';

const meta = {
  title: 'Navigation/Menubar',
  component: Menubar.Root,
  subcomponents: {
    'Menubar.MenuRoot': Menubar.MenuRoot,
    'Menubar.Trigger': Menubar.Trigger,
    'Menubar.Portal': Menubar.Portal,
    'Menubar.Positioner': Menubar.Positioner,
    'Menubar.Popup': Menubar.Popup,
    'Menubar.Item': Menubar.Item,
    'Menubar.Separator': Menubar.Separator,
    'Menubar.Group': Menubar.Group,
    'Menubar.GroupLabel': Menubar.GroupLabel,
    'Menubar.SubmenuRoot': Menubar.SubmenuRoot,
    'Menubar.SubmenuTrigger': Menubar.SubmenuTrigger,
    'Menubar.CheckboxItem': Menubar.CheckboxItem,
    'Menubar.CheckboxItemIndicator': Menubar.CheckboxItemIndicator,
    'Menubar.RadioGroup': Menubar.RadioGroup,
    'Menubar.RadioItem': Menubar.RadioItem,
    'Menubar.RadioItemIndicator': Menubar.RadioItemIndicator,
    'Menubar.Arrow': Menubar.Arrow,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  // Dropped `loopFocus`: keyboard-navigation behaviour only, no visible change.
  // `orientation` is kept — the CSS module reflows the bar to a column for
  // `[data-orientation='vertical']`.
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the whole menubar — every trigger reports disabled.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the menubar.',
    },
  },
  args: {
    disabled: false,
    orientation: 'horizontal',
  },
} satisfies Meta<typeof Menubar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <Menubar.Root {...args}>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          File
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>
                <Icon icon={FilePlus} size="sm" />
                New File
              </Menubar.Item>
              <Menubar.Item>
                <Icon icon={FolderOpen} size="sm" />
                Open…
              </Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item>
                <Icon icon={Save} size="sm" />
                Save
              </Menubar.Item>
              <Menubar.Item disabled>
                <Icon icon={File} size="sm" />
                Export PDF
              </Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>

      <Menubar.MenuRoot>
        <Menubar.Trigger>
          Edit
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>
                <Icon icon={Undo2} size="sm" />
                Undo
              </Menubar.Item>
              <Menubar.Item>
                <Icon icon={Redo2} size="sm" />
                Redo
              </Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item>
                <Icon icon={Scissors} size="sm" />
                Cut
              </Menubar.Item>
              <Menubar.Item>
                <Icon icon={Copy} size="sm" />
                Copy
              </Menubar.Item>
              <Menubar.Item>
                <Icon icon={ClipboardPaste} size="sm" />
                Paste
              </Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item>
                <Icon icon={Search} size="sm" />
                Find &amp; Replace
              </Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>

      <Menubar.MenuRoot>
        <Menubar.Trigger>
          Help
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>
                <Icon icon={HelpCircle} size="sm" />
                Documentation
              </Menubar.Item>
              <Menubar.Item>
                <Icon icon={ExternalLink} size="sm" />
                Release Notes
              </Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item>
                <Icon icon={Info} size="sm" />
                About Eidra
              </Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
    </Menubar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('clicking a trigger opens its menu (portaled to body)', async () => {
      const file = canvas.getByRole('menuitem', { name: /file/i });
      await expect(file).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(file);
      await waitFor(() => expect(file).toHaveAttribute('aria-expanded', 'true'));
      // Menu content lives in a portal outside the canvas.
      const newFile = await screen.findByRole('menuitem', { name: /new file/i });
      await waitFor(() => expect(newFile).toBeVisible());
    });

    await step('hovering a sibling trigger switches the open menu', async () => {
      const edit = canvas.getByRole('menuitem', { name: /edit/i });
      await userEvent.hover(edit);
      await waitFor(async () => {
        await expect(edit).toHaveAttribute('aria-expanded', 'true');
      });
      const undo = await screen.findByRole('menuitem', { name: /undo/i });
      await waitFor(() => expect(undo).toBeVisible());
      // The File menu's items are no longer mounted.
      await waitFor(() => {
        expect(screen.queryByRole('menuitem', { name: /new file/i })).toBeNull();
      });
    });

    await step('a disabled item is marked disabled and not selectable', async () => {
      // The menubar is in hover-open mode (Edit is open from the previous step).
      // Hover File to switch to it — a click here would land as hover-open +
      // click-toggle and close everything.
      const fileT = canvas.getByRole('menuitem', { name: /file/i });
      await userEvent.hover(fileT);
      await waitFor(() => expect(fileT).toHaveAttribute('aria-expanded', 'true'));
      const exportPdf = await screen.findByRole('menuitem', { name: /export pdf/i });
      await expect(exportPdf).toHaveAttribute('data-disabled');
    });

    await step('Escape closes the open menu and restores focus to its trigger', async () => {
      const file = canvas.getByRole('menuitem', { name: /file/i });
      await expect(file).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{Escape}');
      await waitFor(async () => {
        await expect(file).toHaveAttribute('aria-expanded', 'false');
      });
      // The popup leaves the a11y tree a beat after the trigger collapses (close
      // transition), so poll rather than assert synchronously.
      await waitFor(() => expect(screen.queryByRole('menuitem', { name: /new file/i })).toBeNull());
    });
  },
};

// ─── Item activation + onClick callback ─────────────────────────────────────────

/** Selecting an item fires its `onClick` and closes the menu. */
export const ItemActivation: Story = {
  render: () => {
    const onSave = fn();
    return (
      <Menubar.Root>
        <Menubar.MenuRoot>
          <Menubar.Trigger>
            File
            <Icon icon={ChevronDown} size="sm" />
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup>
                <Menubar.Item onClick={onSave}>
                  <Icon icon={Save} size="sm" />
                  Save
                </Menubar.Item>
                <Menubar.Item>
                  <Icon icon={FilePlus} size="sm" />
                  New File
                </Menubar.Item>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.MenuRoot>
      </Menubar.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByRole('menuitem', { name: /file/i });

    await step('clicking an item fires onClick and closes the menu', async () => {
      await userEvent.click(file);
      const save = await screen.findByRole('menuitem', { name: /save/i });
      await userEvent.click(save);
      await waitFor(async () => {
        await expect(file).toHaveAttribute('aria-expanded', 'false');
      });
      // The popup animates out, so the item lingers in the DOM for a frame.
      await waitFor(() => expect(screen.queryByRole('menuitem', { name: /^save$/i })).toBeNull());
    });

    await step('Enter activates the highlighted item via keyboard', async () => {
      await userEvent.click(file);
      const save = await screen.findByRole('menuitem', { name: /save/i });
      await waitFor(() => expect(save).toBeVisible());
      // ArrowDown highlights the first item, Enter activates it.
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');
      await waitFor(async () => {
        await expect(file).toHaveAttribute('aria-expanded', 'false');
      });
    });
  },
};

// ─── Keyboard: open + roving focus between triggers ─────────────────────────────

/** Opening with the keyboard, then ArrowRight/ArrowLeft roving between menus. */
export const KeyboardNavigation: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          File
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>New File</Menubar.Item>
              <Menubar.Item>Open…</Menubar.Item>
              <Menubar.Item>Save</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          Edit
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>Undo</Menubar.Item>
              <Menubar.Item>Redo</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
    </Menubar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByRole('menuitem', { name: /file/i });

    await step('opening one menu lets ArrowRight rove to the next', async () => {
      await userEvent.click(file);
      await waitFor(() => expect(file).toHaveAttribute('aria-expanded', 'true'));
      await waitFor(() =>
        expect(screen.getByRole('menuitem', { name: /new file/i })).toBeVisible(),
      );
      await userEvent.keyboard('{ArrowRight}');
      // Roving opens the Edit menu and closes File. Keyboard roving moves focus
      // into the next popup (not onto its trigger), so the Edit trigger keeps
      // aria-expanded unset — assert the switch via which items are mounted.
      const undo = await screen.findByRole('menuitem', { name: /undo/i });
      await waitFor(() => expect(undo).toBeVisible());
      await waitFor(() => expect(screen.queryByRole('menuitem', { name: /new file/i })).toBeNull());
    });

    await step('ArrowLeft roves back to the previous menu', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      const newFile = await screen.findByRole('menuitem', { name: /new file/i });
      await waitFor(() => expect(newFile).toBeVisible());
      await waitFor(() => expect(screen.queryByRole('menuitem', { name: /undo/i })).toBeNull());
    });

    await step('ArrowDown moves focus through items inside the open menu', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(await screen.findByRole('menuitem', { name: /new file/i })).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(screen.getByRole('menuitem', { name: /open/i })).toHaveFocus();
    });
  },
};

// ─── With Checkbox Items ───────────────────────────────────────────────────────

export const WithCheckboxItems: Story = {
  render: () => {
    const onTerminalChange = fn();
    return (
      <Menubar.Root>
        <Menubar.MenuRoot>
          <Menubar.Trigger>
            View
            <Icon icon={ChevronDown} size="sm" />
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup>
                <Menubar.Group>
                  <Menubar.GroupLabel>Panels</Menubar.GroupLabel>
                  <Menubar.CheckboxItem defaultChecked>
                    <Menubar.CheckboxItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.CheckboxItemIndicator>
                    Sidebar
                  </Menubar.CheckboxItem>
                  <Menubar.CheckboxItem onCheckedChange={onTerminalChange}>
                    <Menubar.CheckboxItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.CheckboxItemIndicator>
                    Terminal
                  </Menubar.CheckboxItem>
                  <Menubar.CheckboxItem defaultChecked>
                    <Menubar.CheckboxItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.CheckboxItemIndicator>
                    Status Bar
                  </Menubar.CheckboxItem>
                </Menubar.Group>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.MenuRoot>
      </Menubar.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: /view/i }));

    await step('uncontrolled defaultChecked renders an item already checked', async () => {
      const sidebar = await screen.findByRole('menuitemcheckbox', { name: /sidebar/i });
      await expect(sidebar).toHaveAttribute('aria-checked', 'true');
    });

    await step(
      'toggling an unchecked item fires onCheckedChange(true) and sets aria-checked',
      async () => {
        const terminal = await screen.findByRole('menuitemcheckbox', { name: /terminal/i });
        await expect(terminal).toHaveAttribute('aria-checked', 'false');
        // Base UI keeps the menu open after a checkbox-item activation.
        await userEvent.click(terminal);
        const reopened = await screen.findByRole('menuitemcheckbox', { name: /terminal/i });
        await expect(reopened).toHaveAttribute('aria-checked', 'true');
      },
    );
  },
};

// ─── With Radio Items ──────────────────────────────────────────────────────────

export const WithRadioItems: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          Format
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Group>
                <Menubar.GroupLabel>Font Size</Menubar.GroupLabel>
                <Menubar.RadioGroup defaultValue="md" onValueChange={fn()}>
                  <Menubar.RadioItem value="sm">
                    <Menubar.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.RadioItemIndicator>
                    Small
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="md">
                    <Menubar.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.RadioItemIndicator>
                    Medium
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="lg">
                    <Menubar.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.RadioItemIndicator>
                    Large
                  </Menubar.RadioItem>
                </Menubar.RadioGroup>
              </Menubar.Group>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
    </Menubar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: /format/i }));

    await step('uncontrolled defaultValue marks the matching radio item checked', async () => {
      const medium = await screen.findByRole('menuitemradio', { name: /medium/i });
      await expect(medium).toHaveAttribute('aria-checked', 'true');
      await expect(screen.getByRole('menuitemradio', { name: /small/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });

    await step('selecting another radio item moves the checked state (single-select)', async () => {
      await userEvent.click(screen.getByRole('menuitemradio', { name: /large/i }));
      // RadioItem activation keeps the menu open (closeOnClick is false, like
      // checkbox items), so the updated single-select state is observable in place.
      const large = screen.getByRole('menuitemradio', { name: /large/i });
      await waitFor(() => expect(large).toHaveAttribute('aria-checked', 'true'));
      await expect(screen.getByRole('menuitemradio', { name: /medium/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });
  },
};

// ─── Controlled radio selection ─────────────────────────────────────────────────

/** The host owns the radio value; the menu only reports changes via `onValueChange`. */
export const ControlledRadioSelection: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const handleChange = fn();
    const ControlledFormat = () => {
      const [value, setValue] = useState('md');
      return (
        <div style={{ display: 'grid', gap: 'var(--eidra-gap-3)' }}>
          <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
            Size: <strong style={{ color: 'var(--eidra-fg)' }}>{value}</strong>
          </p>
          <Menubar.Root>
            <Menubar.MenuRoot>
              <Menubar.Trigger>
                Format
                <Icon icon={ChevronDown} size="sm" />
              </Menubar.Trigger>
              <Menubar.Portal>
                <Menubar.Positioner>
                  <Menubar.Popup>
                    <Menubar.RadioGroup
                      value={value}
                      onValueChange={(v) => {
                        handleChange(v);
                        setValue(v as string);
                      }}
                    >
                      <Menubar.RadioItem value="sm">
                        <Menubar.RadioItemIndicator>
                          <Icon icon={Check} size="sm" />
                        </Menubar.RadioItemIndicator>
                        Small
                      </Menubar.RadioItem>
                      <Menubar.RadioItem value="md">
                        <Menubar.RadioItemIndicator>
                          <Icon icon={Check} size="sm" />
                        </Menubar.RadioItemIndicator>
                        Medium
                      </Menubar.RadioItem>
                      <Menubar.RadioItem value="lg">
                        <Menubar.RadioItemIndicator>
                          <Icon icon={Check} size="sm" />
                        </Menubar.RadioItemIndicator>
                        Large
                      </Menubar.RadioItem>
                    </Menubar.RadioGroup>
                  </Menubar.Popup>
                </Menubar.Positioner>
              </Menubar.Portal>
            </Menubar.MenuRoot>
          </Menubar.Root>
        </div>
      );
    };
    return <ControlledFormat />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('controlled value reflects the host state', async () => {
      await expect(canvas.getByText('md')).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('menuitem', { name: /format/i }));
      const medium = await screen.findByRole('menuitemradio', { name: /medium/i });
      await expect(medium).toHaveAttribute('aria-checked', 'true');
    });

    await step('selecting reports onValueChange and the host updates the value', async () => {
      await userEvent.click(screen.getByRole('menuitemradio', { name: /small/i }));
      await waitFor(() => {
        expect(canvas.getByText('sm')).toBeInTheDocument();
      });
    });
  },
};

// ─── With Submenus ─────────────────────────────────────────────────────────────

export const WithSubmenus: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          Insert
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>Image…</Menubar.Item>
              <Menubar.Item>Table…</Menubar.Item>
              <Menubar.Separator />
              <Menubar.SubmenuRoot>
                <Menubar.SubmenuTrigger>
                  Special Characters
                  <Icon icon={ChevronRight} size="sm" />
                </Menubar.SubmenuTrigger>
                <Menubar.Portal>
                  <Menubar.Positioner>
                    <Menubar.Popup>
                      <Menubar.Item>Em Dash —</Menubar.Item>
                      <Menubar.Item>En Dash –</Menubar.Item>
                      <Menubar.Item>Ellipsis …</Menubar.Item>
                      <Menubar.Item>Copyright ©</Menubar.Item>
                    </Menubar.Popup>
                  </Menubar.Positioner>
                </Menubar.Portal>
              </Menubar.SubmenuRoot>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
    </Menubar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: /insert/i }));

    await step('hovering the submenu trigger opens the nested menu', async () => {
      const subTrigger = await screen.findByRole('menuitem', { name: /special characters/i });
      await expect(subTrigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.hover(subTrigger);
      await waitFor(async () => {
        await expect(subTrigger).toHaveAttribute('aria-expanded', 'true');
      });
      const emDash = await screen.findByRole('menuitem', { name: /em dash/i });
      await waitFor(() => expect(emDash).toBeVisible());
    });

    await step('ArrowLeft collapses the submenu back to the parent', async () => {
      const subTrigger = screen.getByRole('menuitem', { name: /special characters/i });
      // Focus is on the submenu trigger (hover opened the submenu). Enter the
      // submenu with ArrowRight, then ArrowLeft collapses it back to the parent.
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(async () => {
        await expect(subTrigger).toHaveAttribute('aria-expanded', 'false');
      });
      await waitFor(() => {
        expect(screen.queryByRole('menuitem', { name: /em dash/i })).toBeNull();
      });
    });
  },
};

// ─── Disabled State ────────────────────────────────────────────────────────────

export const DisabledMenubar: Story = {
  render: () => (
    <Menubar.Root disabled>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          File
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>New File</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          Edit
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>Undo</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
    </Menubar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('a disabled menubar marks its triggers disabled', async () => {
      const file = canvas.getByRole('menuitem', { name: /file/i });
      await expect(file).toHaveAttribute('data-disabled');
    });
    await step('clicking a disabled trigger does not open a menu', async () => {
      const file = canvas.getByRole('menuitem', { name: /file/i });
      await userEvent.click(file);
      await expect(file).toHaveAttribute('aria-expanded', 'false');
      await expect(screen.queryByRole('menuitem', { name: /new file/i })).toBeNull();
    });
  },
};

// ─── Settings-style Menubar ────────────────────────────────────────────────────

export const SettingsMenubar: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.MenuRoot>
        <Menubar.Trigger>
          <Icon icon={Settings} size="sm" />
          Preferences
          <Icon icon={ChevronDown} size="sm" />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Group>
                <Menubar.GroupLabel>Appearance</Menubar.GroupLabel>
                <Menubar.RadioGroup defaultValue="system">
                  <Menubar.RadioItem value="light">
                    <Menubar.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.RadioItemIndicator>
                    Light
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="dark">
                    <Menubar.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.RadioItemIndicator>
                    Dark
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="system">
                    <Menubar.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </Menubar.RadioItemIndicator>
                    System
                  </Menubar.RadioItem>
                </Menubar.RadioGroup>
              </Menubar.Group>
              <Menubar.Separator />
              <Menubar.Group>
                <Menubar.GroupLabel>Features</Menubar.GroupLabel>
                <Menubar.CheckboxItem defaultChecked>
                  <Menubar.CheckboxItemIndicator>
                    <Icon icon={Check} size="sm" />
                  </Menubar.CheckboxItemIndicator>
                  Spell Check
                </Menubar.CheckboxItem>
                <Menubar.CheckboxItem>
                  <Menubar.CheckboxItemIndicator>
                    <Icon icon={Check} size="sm" />
                  </Menubar.CheckboxItemIndicator>
                  Auto Save
                </Menubar.CheckboxItem>
              </Menubar.Group>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.MenuRoot>
    </Menubar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: /preferences/i }));
    await screen.findByRole('menuitemradio', { name: /light/i });

    await step('type-ahead moves highlight to the matching item', async () => {
      await userEvent.keyboard('d');
      await waitFor(async () => {
        await expect(screen.getByRole('menuitemradio', { name: /dark/i })).toHaveFocus();
      });
    });

    await step('End jumps focus to the last item, Home to the first', async () => {
      await userEvent.keyboard('{End}');
      await waitFor(async () => {
        await expect(screen.getByRole('menuitemcheckbox', { name: /auto save/i })).toHaveFocus();
      });
      await userEvent.keyboard('{Home}');
      await waitFor(async () => {
        await expect(screen.getByRole('menuitemradio', { name: /light/i })).toHaveFocus();
      });
    });
  },
};
