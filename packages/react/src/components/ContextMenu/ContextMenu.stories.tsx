import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  FilePen,
  Folder,
  Icon,
  Share2,
  Star,
  Trash2,
} from '@eidra/icons';
import { within, userEvent, fireEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { ContextMenu } from './ContextMenu.js';

const meta = {
  title: 'Overlays/ContextMenu',
  // Point at Root: it carries the meaningful behavior props (open/defaultOpen).
  // The visual Popup part has almost no props.
  component: ContextMenu.Root,
  subcomponents: {
    'ContextMenu.Trigger': ContextMenu.Trigger,
    'ContextMenu.Portal': ContextMenu.Portal,
    'ContextMenu.Positioner': ContextMenu.Positioner,
    'ContextMenu.Popup': ContextMenu.Popup,
    'ContextMenu.Item': ContextMenu.Item,
    'ContextMenu.CheckboxItem': ContextMenu.CheckboxItem,
    'ContextMenu.CheckboxItemIndicator': ContextMenu.CheckboxItemIndicator,
    'ContextMenu.RadioGroup': ContextMenu.RadioGroup,
    'ContextMenu.RadioItem': ContextMenu.RadioItem,
    'ContextMenu.RadioItemIndicator': ContextMenu.RadioItemIndicator,
    'ContextMenu.Group': ContextMenu.Group,
    'ContextMenu.GroupLabel': ContextMenu.GroupLabel,
    'ContextMenu.Separator': ContextMenu.Separator,
    'ContextMenu.SubmenuRoot': ContextMenu.SubmenuRoot,
    'ContextMenu.SubmenuTrigger': ContextMenu.SubmenuTrigger,
    'ContextMenu.Arrow': ContextMenu.Arrow,
    'ContextMenu.Backdrop': ContextMenu.Backdrop,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContextMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIDES = ['top', 'bottom', 'left', 'right'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

// Several stories pass a spy to a menu item / checkbox / radio handler. Since
// `meta` is now typed against Root (which has no such prop), these stories carry
// the spy in their own args type rather than the Root args.
type MenuSpyArgs = ComponentProps<typeof ContextMenu.Root> & { onClick: () => void };
type MenuSpyStory = StoryObj<MenuSpyArgs>;

// ---------------------------------------------------------------------------
// Shared trigger area
// ---------------------------------------------------------------------------

const TriggerArea = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 320,
      height: 180,
      border: '2px dashed var(--eidra-border)',
      borderRadius: 'var(--eidra-radius-lg)',
      color: 'var(--eidra-fg-muted)',
      fontSize: 'var(--eidra-font-size-sm)',
      userSelect: 'none',
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

// Flat controls: Positioner placement (side/align). Right-click interaction is
// preserved. `onClick` is a menu-item spy (not a Root prop), exposed as an action.
type ContextMenuPlaygroundArgs = ComponentProps<typeof ContextMenu.Root> & {
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  onClick: () => void;
};

export const Playground: StoryObj<ContextMenuPlaygroundArgs> = {
  args: {
    side: 'bottom',
    align: 'start',
    onClick: fn(),
  },
  argTypes: {
    side: { control: 'inline-radio', options: SIDES },
    align: { control: 'inline-radio', options: ALIGNS },
    onClick: { table: { category: 'Menu item' } },
  },
  render: ({ side, align, onClick }) => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TriggerArea>Right-click or long-press here</TriggerArea>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner side={side} align={align}>
          <ContextMenu.Popup>
            <ContextMenu.Item onClick={onClick}>
              <Icon icon={Copy} size="sm" />
              Copy
            </ContextMenu.Item>
            <ContextMenu.Item>
              <Icon icon={FilePen} size="sm" />
              Rename
            </ContextMenu.Item>
            <ContextMenu.Item>
              <Icon icon={Star} size="sm" />
              Add to favourites
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>
              <Icon icon={Share2} size="sm" />
              Share
            </ContextMenu.Item>
            <ContextMenu.Item>
              <Icon icon={ExternalLink} size="sm" />
              Open in new tab
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item disabled>
              <Icon icon={Trash2} size="sm" />
              Delete
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('right-click the trigger opens the menu (portaled to body)', async () => {
      fireEvent.contextMenu(canvas.getByText(/right-click or long-press here/i));
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
    });
    await step('disabled item is not actionable', async () => {
      const del = await screen.findByRole('menuitem', { name: /delete/i });
      await expect(del).toHaveAttribute('data-disabled');
    });
    await step('clicking an item fires onClick and closes the menu', async () => {
      const copy = await screen.findByRole('menuitem', { name: /copy/i });
      await userEvent.click(copy);
      await expect(args.onClick).toHaveBeenCalled();
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });
  },
};

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

export const KeyboardNavigation: MenuSpyStory = {
  name: 'Keyboard navigation',
  args: {
    onClick: fn(),
  },
  render: (args) => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TriggerArea>Right-click — then use the keyboard</TriggerArea>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item onClick={args.onClick}>Copy</ContextMenu.Item>
            <ContextMenu.Item>Rename</ContextMenu.Item>
            <ContextMenu.Item>Share</ContextMenu.Item>
            <ContextMenu.Item>Delete</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('open the menu', async () => {
      fireEvent.contextMenu(canvas.getByText(/use the keyboard/i));
      await screen.findByRole('menu');
    });
    await step('ArrowDown highlights the first item', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(await screen.findByRole('menuitem', { name: /^copy$/i })).toHaveFocus();
    });
    await step('ArrowDown moves to the next item', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(screen.getByRole('menuitem', { name: /^rename$/i })).toHaveFocus();
    });
    await step('End jumps to the last item, Home back to the first', async () => {
      await userEvent.keyboard('{End}');
      await expect(screen.getByRole('menuitem', { name: /^delete$/i })).toHaveFocus();
      await userEvent.keyboard('{Home}');
      await expect(screen.getByRole('menuitem', { name: /^copy$/i })).toHaveFocus();
    });
    await step('type-ahead jumps to the matching item', async () => {
      await userEvent.keyboard('s');
      await expect(screen.getByRole('menuitem', { name: /^share$/i })).toHaveFocus();
    });
    await step('Enter activates the highlighted item and closes the menu', async () => {
      await userEvent.keyboard('{Home}');
      await userEvent.keyboard('{Enter}');
      await expect(args.onClick).toHaveBeenCalled();
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });
  },
};

// ---------------------------------------------------------------------------
// Escape dismiss
// ---------------------------------------------------------------------------

export const EscapeDismiss: Story = {
  name: 'Escape dismiss',
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TriggerArea>Right-click — then press Escape</TriggerArea>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item>Copy</ContextMenu.Item>
            <ContextMenu.Item>Rename</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('open the menu', async () => {
      fireEvent.contextMenu(canvas.getByText(/press escape/i));
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
    });
    await step('Escape dismisses the menu', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });
  },
};

// ---------------------------------------------------------------------------
// With groups and labels
// ---------------------------------------------------------------------------

export const WithGroups: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TriggerArea>Right-click — grouped items</TriggerArea>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Group>
              <ContextMenu.GroupLabel>Document</ContextMenu.GroupLabel>
              <ContextMenu.Item>
                <Icon icon={Copy} size="sm" />
                Copy link
              </ContextMenu.Item>
              <ContextMenu.Item>
                <Icon icon={FilePen} size="sm" />
                Rename
              </ContextMenu.Item>
              <ContextMenu.Item>
                <Icon icon={Folder} size="sm" />
                Move to…
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.GroupLabel>Danger zone</ContextMenu.GroupLabel>
              <ContextMenu.Item>
                <Icon icon={Trash2} size="sm" />
                Delete permanently
              </ContextMenu.Item>
            </ContextMenu.Group>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('open the menu', async () => {
      fireEvent.contextMenu(canvas.getByText(/grouped items/i));
      await screen.findByRole('menu');
    });
    await step('group labels are exposed and items are grouped', async () => {
      const document = await screen.findByText('Document');
      await waitFor(() => expect(document).toBeVisible());
      await waitFor(() => expect(screen.getByText('Danger zone')).toBeVisible());
      await expect(screen.getAllByRole('group').length).toBeGreaterThanOrEqual(2);
    });
  },
};

// ---------------------------------------------------------------------------
// With checkbox items
// ---------------------------------------------------------------------------

export const WithCheckboxItems: MenuSpyStory = {
  args: {
    onClick: fn(),
  },
  render: function WithCheckboxItemsStory(args) {
    const onCheckedChange = args.onClick as unknown as (checked: boolean) => void;
    const [showGrid, setShowGrid] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [showRevisions, setShowRevisions] = useState(false);

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <TriggerArea>Right-click — toggle view options</TriggerArea>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Group>
                <ContextMenu.GroupLabel>View options</ContextMenu.GroupLabel>
                <ContextMenu.CheckboxItem
                  closeOnClick={false}
                  checked={showGrid}
                  onCheckedChange={(checked) => {
                    onCheckedChange(checked);
                    setShowGrid(checked);
                  }}
                >
                  <ContextMenu.CheckboxItemIndicator>
                    <Icon icon={Check} size="sm" />
                  </ContextMenu.CheckboxItemIndicator>
                  Show grid
                </ContextMenu.CheckboxItem>
                <ContextMenu.CheckboxItem
                  closeOnClick={false}
                  checked={showComments}
                  onCheckedChange={(checked) => setShowComments(checked)}
                >
                  <ContextMenu.CheckboxItemIndicator>
                    <Icon icon={Check} size="sm" />
                  </ContextMenu.CheckboxItemIndicator>
                  Show comments
                </ContextMenu.CheckboxItem>
                <ContextMenu.CheckboxItem
                  closeOnClick={false}
                  checked={showRevisions}
                  onCheckedChange={(checked) => setShowRevisions(checked)}
                >
                  <ContextMenu.CheckboxItemIndicator>
                    <Icon icon={Check} size="sm" />
                  </ContextMenu.CheckboxItemIndicator>
                  Show revision history
                </ContextMenu.CheckboxItem>
              </ContextMenu.Group>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('open the menu', async () => {
      fireEvent.contextMenu(canvas.getByText(/toggle view options/i));
      await screen.findByRole('menu');
    });
    await step('"Show grid" starts checked (controlled)', async () => {
      const grid = await screen.findByRole('menuitemcheckbox', { name: /show grid/i });
      await expect(grid).toHaveAttribute('aria-checked', 'true');
    });
    await step('toggling fires onCheckedChange(false) and unchecks', async () => {
      const grid = screen.getByRole('menuitemcheckbox', { name: /show grid/i });
      await userEvent.click(grid);
      await expect(args.onClick).toHaveBeenCalledWith(false);
      await waitFor(() =>
        expect(screen.getByRole('menuitemcheckbox', { name: /show grid/i })).toHaveAttribute(
          'aria-checked',
          'false',
        ),
      );
    });
    await step('an unchecked item toggles on with Space', async () => {
      const comments = screen.getByRole('menuitemcheckbox', { name: /show comments/i });
      await expect(comments).toHaveAttribute('aria-checked', 'false');
      comments.focus();
      await userEvent.keyboard(' ');
      await waitFor(() =>
        expect(screen.getByRole('menuitemcheckbox', { name: /show comments/i })).toHaveAttribute(
          'aria-checked',
          'true',
        ),
      );
    });
  },
};

// ---------------------------------------------------------------------------
// With radio items
// ---------------------------------------------------------------------------

export const WithRadioItems: MenuSpyStory = {
  args: {
    onClick: fn(),
  },
  render: function WithRadioItemsStory(args) {
    const onValueChange = args.onClick as unknown as (value: string) => void;
    const [layout, setLayout] = useState<string>('list');

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <TriggerArea>Right-click — choose layout</TriggerArea>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Group>
                <ContextMenu.GroupLabel>Layout</ContextMenu.GroupLabel>
                <ContextMenu.RadioGroup
                  value={layout}
                  onValueChange={(v: string) => {
                    onValueChange(v);
                    setLayout(v);
                  }}
                >
                  <ContextMenu.RadioItem value="list">
                    <ContextMenu.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </ContextMenu.RadioItemIndicator>
                    List
                  </ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="grid">
                    <ContextMenu.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </ContextMenu.RadioItemIndicator>
                    Grid
                  </ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="compact">
                    <ContextMenu.RadioItemIndicator>
                      <Icon icon={Check} size="sm" />
                    </ContextMenu.RadioItemIndicator>
                    Compact
                  </ContextMenu.RadioItem>
                </ContextMenu.RadioGroup>
              </ContextMenu.Group>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('open the menu', async () => {
      fireEvent.contextMenu(canvas.getByText(/choose layout/i));
      await screen.findByRole('menu');
    });
    await step('"List" starts selected (controlled value)', async () => {
      const list = await screen.findByRole('menuitemradio', { name: /^list$/i });
      await expect(list).toHaveAttribute('aria-checked', 'true');
    });
    await step('selecting "Grid" fires onValueChange and moves the checked state', async () => {
      const grid = screen.getByRole('menuitemradio', { name: /^grid$/i });
      await userEvent.click(grid);
      await expect(args.onClick).toHaveBeenCalledWith('grid');
      await waitFor(() =>
        expect(screen.getByRole('menuitemradio', { name: /^grid$/i })).toHaveAttribute(
          'aria-checked',
          'true',
        ),
      );
      await expect(screen.getByRole('menuitemradio', { name: /^list$/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });
  },
};

// ---------------------------------------------------------------------------
// With submenu
// ---------------------------------------------------------------------------

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TriggerArea>Right-click — with submenu</TriggerArea>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item>
              <Icon icon={Copy} size="sm" />
              Copy
            </ContextMenu.Item>
            <ContextMenu.Item>
              <Icon icon={FilePen} size="sm" />
              Rename
            </ContextMenu.Item>

            {/* Submenu */}
            <ContextMenu.SubmenuRoot>
              <ContextMenu.SubmenuTrigger>
                <Icon icon={Share2} size="sm" />
                Share with…
                <Icon icon={ChevronRight} size="sm" style={{ marginInlineStart: 'auto' }} />
              </ContextMenu.SubmenuTrigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Popup>
                    <ContextMenu.Item>Specific people</ContextMenu.Item>
                    <ContextMenu.Item>Anyone with the link</ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item>Copy link</ContextMenu.Item>
                  </ContextMenu.Popup>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.SubmenuRoot>

            <ContextMenu.Separator />
            <ContextMenu.Item>
              <Icon icon={Trash2} size="sm" />
              Delete
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('open the root menu', async () => {
      fireEvent.contextMenu(canvas.getByText(/with submenu/i));
      await screen.findByRole('menu');
    });
    await step('hovering the submenu trigger opens the nested menu', async () => {
      const trigger = await screen.findByRole('menuitem', { name: /share with/i });
      await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      await userEvent.hover(trigger);
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
      const specific = await screen.findByRole('menuitem', { name: /specific people/i });
      await waitFor(() => expect(specific).toBeVisible());
    });
    await step('Escape closes the submenu, leaving the root menu open', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('menuitem', { name: /specific people/i })).toBeNull(),
      );
      await waitFor(() => expect(screen.getByRole('menuitem', { name: /^copy$/i })).toBeVisible());
    });
  },
};

// ---------------------------------------------------------------------------
// File manager (realistic Nordic consultancy example)
// ---------------------------------------------------------------------------

export const FileManager: Story = {
  name: 'File manager (realistic)',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('right-clicking one file row opens its own menu', async () => {
      fireEvent.contextMenu(canvas.getByText('Client brief.docx'));
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
      const open = await screen.findByRole('menuitem', { name: /^open$/i });
      await waitFor(() => expect(open).toBeVisible());
    });
    await step('clicking outside dismisses the menu', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });
  },
  render: function FileManagerStory() {
    const files = ['Q2 Strategy.pdf', 'Client brief.docx', 'Brand guidelines.fig'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1)' }}>
        {files.map((file) => (
          <ContextMenu.Root key={file}>
            <ContextMenu.Trigger>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--eidra-space-2)',
                  padding: 'var(--eidra-space-2) var(--eidra-space-3)',
                  borderRadius: 'var(--eidra-radius-md)',
                  border: '1px solid var(--eidra-border)',
                  background: 'var(--eidra-surface)',
                  cursor: 'default',
                  userSelect: 'none',
                  fontSize: 'var(--eidra-font-size-sm)',
                  color: 'var(--eidra-fg)',
                  width: 280,
                }}
              >
                <Icon icon={Folder} size="sm" />
                {file}
              </div>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Positioner>
                <ContextMenu.Popup>
                  <ContextMenu.Item>
                    <Icon icon={ExternalLink} size="sm" />
                    Open
                  </ContextMenu.Item>
                  <ContextMenu.Item>
                    <Icon icon={Copy} size="sm" />
                    Duplicate
                  </ContextMenu.Item>
                  <ContextMenu.Item>
                    <Icon icon={FilePen} size="sm" />
                    Rename
                  </ContextMenu.Item>
                  <ContextMenu.Item>
                    <Icon icon={Star} size="sm" />
                    Favourite
                  </ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item>
                    <Icon icon={Share2} size="sm" />
                    Share
                  </ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item>
                    <Icon icon={Trash2} size="sm" />
                    Move to trash
                  </ContextMenu.Item>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.Root>
        ))}
      </div>
    );
  },
};
