import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, ChevronRight, Settings, User, LogOut, Moon, Bell, Trash2 } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Menu } from './Menu.js';

const meta = {
  title: 'Overlays/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: () => (
    <Menu.Root>
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
