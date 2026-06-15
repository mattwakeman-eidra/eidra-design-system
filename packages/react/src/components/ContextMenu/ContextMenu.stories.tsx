import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
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
import { ContextMenu } from './ContextMenu.js';

const meta = {
  title: 'Overlays/ContextMenu',
  component: ContextMenu.Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContextMenu.Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Playground: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TriggerArea>Right-click or long-press here</TriggerArea>
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
};

// ---------------------------------------------------------------------------
// With checkbox items
// ---------------------------------------------------------------------------

export const WithCheckboxItems: Story = {
  render: function WithCheckboxItemsStory() {
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
                checked={showGrid}
                onCheckedChange={(checked) => setShowGrid(checked)}
              >
                <ContextMenu.CheckboxItemIndicator>
                  <Icon icon={Check} size="sm" />
                </ContextMenu.CheckboxItemIndicator>
                Show grid
              </ContextMenu.CheckboxItem>
              <ContextMenu.CheckboxItem
                checked={showComments}
                onCheckedChange={(checked) => setShowComments(checked)}
              >
                <ContextMenu.CheckboxItemIndicator>
                  <Icon icon={Check} size="sm" />
                </ContextMenu.CheckboxItemIndicator>
                Show comments
              </ContextMenu.CheckboxItem>
              <ContextMenu.CheckboxItem
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
};

// ---------------------------------------------------------------------------
// With radio items
// ---------------------------------------------------------------------------

export const WithRadioItems: Story = {
  render: function WithRadioItemsStory() {
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
              <ContextMenu.RadioGroup value={layout} onValueChange={(v: string) => setLayout(v)}>
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
};

// ---------------------------------------------------------------------------
// File manager (realistic Nordic consultancy example)
// ---------------------------------------------------------------------------

export const FileManager: Story = {
  name: 'File manager (realistic)',
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
