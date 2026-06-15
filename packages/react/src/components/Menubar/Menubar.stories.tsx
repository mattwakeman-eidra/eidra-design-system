import type { Meta, StoryObj } from '@storybook/react-vite';
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
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Menubar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
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
};

// ─── With Checkbox Items ───────────────────────────────────────────────────────

export const WithCheckboxItems: Story = {
  render: () => (
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
                <Menubar.CheckboxItem>
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
  ),
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
                <Menubar.RadioGroup defaultValue="md">
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
};
