import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Icon,
  Folder,
  FileText,
  FileCode,
  Image,
  Settings,
  Copy,
  FilePen,
  Trash2,
} from '@eidra/icons';
import { within, userEvent, fireEvent, screen, expect, waitFor } from 'storybook/test';
import { TreeView } from './TreeView.js';
import type { TreeNode } from './TreeView.js';
import { ContextMenu } from '../ContextMenu/ContextMenu.js';
import { Checkbox } from '../Checkbox/Checkbox.js';

const meta = {
  title: 'Data Display/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: {},
  args: {
    'aria-label': 'Tree',
  },
  argTypes: {
    // Tree of objects holding JSX icons (and menu render fns) — not editable as a control.
    items: { control: false },
    defaultExpandedIds: { control: false },
    expandedIds: { control: false },
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Shared fixtures ───────────────────────────────────────────────────────────

const fileTree: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <Icon icon={Folder} size="sm" />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <Icon icon={Folder} size="sm" />,
        children: [
          { id: 'button', label: 'Button.tsx', icon: <Icon icon={FileCode} size="sm" /> },
          { id: 'input', label: 'Input.tsx', icon: <Icon icon={FileCode} size="sm" /> },
        ],
      },
      { id: 'index', label: 'index.ts', icon: <Icon icon={FileCode} size="sm" /> },
      { id: 'logo', label: 'logo.svg', icon: <Icon icon={Image} size="sm" /> },
    ],
  },
  { id: 'readme', label: 'README.md', icon: <Icon icon={FileText} size="sm" /> },
  { id: 'config', label: 'tsconfig.json', icon: <Icon icon={Settings} size="sm" /> },
];

const categoryTree: TreeNode[] = [
  {
    id: 'finance',
    label: 'Finance',
    children: [
      {
        id: 'invoicing',
        label: 'Invoicing',
        children: [
          { id: 'drafts', label: 'Drafts' },
          { id: 'sent', label: 'Sent' },
          { id: 'archived', label: 'Archived', disabled: true },
        ],
      },
      { id: 'reports', label: 'Reports' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    children: [
      { id: 'team', label: 'Team' },
      { id: 'clients', label: 'Clients' },
    ],
  },
  { id: 'settings', label: 'Settings' },
];

// ─── Stories ────────────────────────────────────────────────────────────────────

/** A file-explorer tree with per-node icons and a chevron affordance on branches. */
export const FileExplorer: Story = {
  args: {
    'aria-label': 'Project files',
    items: fileTree,
    defaultExpandedIds: ['src', 'components'],
    defaultSelectedId: 'index',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('ArrowDown moves focus to the next visible row', async () => {
      const readme = canvas.getByRole('treeitem', { name: /README\.md/ });
      readme.focus();
      await expect(readme).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(canvas.getByRole('treeitem', { name: /tsconfig\.json/ })).toHaveFocus();
    });
    await step('clicking a row selects it', async () => {
      const readme = canvas.getByRole('treeitem', { name: /README\.md/ });
      await userEvent.click(readme);
      await expect(readme).toHaveAttribute('aria-selected', 'true');
    });
  },
};

/** Nested categories with a disabled leaf, no per-node icons. */
export const NestedCategories: Story = {
  args: {
    'aria-label': 'Categories',
    items: categoryTree,
    defaultExpandedIds: ['finance', 'invoicing'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const finance = canvas.getByRole('treeitem', { name: /Finance/ });
    await expect(finance).toHaveAttribute('aria-expanded', 'true');
    // Collapsing a branch hides its descendants.
    await userEvent.click(finance);
    await expect(finance).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('treeitem', { name: /Invoicing/ })).toBeNull();
  },
};

/**
 * Selection driven from the outside. The host owns `selectedId`; the tree only
 * reports changes via `onSelectedChange`.
 */
export const ControlledSelection: Story = {
  parameters: { controls: { disable: true } },
  args: { 'aria-label': 'Categories', items: categoryTree },
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string>('reports');
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-gap-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Selected: <strong style={{ color: 'var(--eidra-fg)' }}>{selectedId}</strong>
        </p>
        <TreeView
          {...args}
          items={categoryTree}
          defaultExpandedIds={['finance', 'invoicing', 'people']}
          selectedId={selectedId}
          onSelectedChange={setSelectedId}
        />
      </div>
    );
  },
};

/** Under a `compact` density scope the rows tighten. */
export const Dense: Story = {
  parameters: { controls: { disable: true } },
  args: {
    'aria-label': 'Project files (compact)',
    items: fileTree,
    defaultExpandedIds: ['src', 'components'],
  },
  render: (args) => (
    <div data-density="compact">
      <TreeView {...args} />
    </div>
  ),
};

// ─── Right-click context menu (per node) ──────────────────────────────────────

const labelText = (n: TreeNode) => (typeof n.label === 'string' ? n.label : n.id);

function NodeMenu({
  name,
  onAction,
  children,
}: {
  name: string;
  onAction: (action: string) => void;
  children: ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-gap-1-5)' }}
      >
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item onClick={() => onAction(`Rename “${name}”`)}>
              <Icon icon={FilePen} size="sm" />
              Rename
            </ContextMenu.Item>
            <ContextMenu.Item onClick={() => onAction(`Duplicate “${name}”`)}>
              <Icon icon={Copy} size="sm" />
              Duplicate
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item onClick={() => onAction(`Delete “${name}”`)}>
              <Icon icon={Trash2} size="sm" />
              Delete
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

// Wrap each node's label (icon + text) in a per-node context menu, so right-click
// (or long-press) anywhere on the row's label opens it. The chevron + indentation
// stay owned by TreeView.
function withMenus(nodes: TreeNode[], onAction: (action: string) => void): TreeNode[] {
  return nodes.map((n) => ({
    id: n.id,
    disabled: n.disabled,
    label: (
      <NodeMenu name={labelText(n)} onAction={onAction}>
        {n.icon}
        <span>{n.label}</span>
      </NodeMenu>
    ),
    children: n.children ? withMenus(n.children, onAction) : undefined,
  }));
}

/**
 * **Right-click menu.** Each node's label is wrapped in a `ContextMenu`, so
 * right-clicking (or long-pressing) a row opens per-node actions. Selection and
 * keyboard nav stay on the tree; the menu only listens for the context event.
 */
export const RightClickMenu: Story = {
  // These nodes embed ContextMenu/Checkbox elements as data; Storybook's dynamic
  // "Show code" serializer (react-element-to-jsx-string) blows past the max string
  // length on the rendered Base UI overlay internals ("RangeError: Invalid string
  // length"), which throws during render and freezes the page. An explicit
  // `source.code` makes the React renderer skip dynamic serialization entirely
  // (an args story ignores `source.type: 'code'` — only an explicit `code` skips).
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: [
          "// Each node's label is wrapped in a <ContextMenu> via withMenus().",
          'const items = withMenus(fileTree, setLastAction);',
          "<TreeView aria-label=\"Project files\" items={items} defaultExpandedIds={['src', 'components']} />",
        ].join('\n'),
      },
    },
  },
  args: { 'aria-label': 'Project files', items: fileTree },
  render: (args) => {
    const [lastAction, setLastAction] = useState('—');
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-gap-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Right-click a node — last action:{' '}
          <strong style={{ color: 'var(--eidra-fg)' }}>{lastAction}</strong>
        </p>
        <TreeView
          {...args}
          items={withMenus(fileTree, setLastAction)}
          defaultExpandedIds={['src', 'components']}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Right-click a node's label → the per-node ContextMenu opens (portaled to body).
    fireEvent.contextMenu(canvas.getByText('README.md'));
    const rename = await screen.findByRole('menuitem', { name: /Rename/ });
    await waitFor(() => expect(rename).toBeVisible());
  },
};

// ─── Checkboxes (multi-select with parent tri-state) ──────────────────────────

const leafIds = (n: TreeNode): string[] =>
  n.children?.length ? n.children.flatMap(leafIds) : [n.id];

function withCheckboxes(
  nodes: TreeNode[],
  checked: Set<string>,
  toggle: (node: TreeNode) => void,
): TreeNode[] {
  return nodes.map((n) => {
    const leaves = leafIds(n);
    const all = leaves.every((id) => checked.has(id));
    const some = leaves.some((id) => checked.has(id));
    return {
      id: n.id,
      disabled: n.disabled,
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-gap-2)' }}>
          {/* Isolate the checkbox so its click doesn't also toggle the row's expand/select. */}
          <span
            style={{ display: 'inline-flex' }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Checkbox.Root
              checked={all}
              indeterminate={!all && some}
              onCheckedChange={() => toggle(n)}
              aria-label={labelText(n)}
            />
          </span>
          {n.icon}
          <span>{n.label}</span>
        </span>
      ),
      children: n.children ? withCheckboxes(n.children, checked, toggle) : undefined,
    };
  });
}

/**
 * **Checkboxes.** A multi-select tree: each row carries a checkbox, and a branch
 * reflects its descendants — checked when all are, indeterminate when only some.
 * Toggling a branch cascades to its leaves. (Checked-state is host-managed here;
 * a checkbox nested in a focusable `treeitem` trips axe's `nested-interactive`
 * rule, disabled for this story — a production multi-select tree would instead
 * fold the checked-state onto the treeitem via `aria-checked`.)
 */
export const Checkboxes: Story = {
  parameters: {
    controls: { disable: true },
    // See RightClickMenu: an explicit source.code skips the dynamic serializer that
    // otherwise throws "RangeError: Invalid string length" on the embedded checkboxes.
    docs: {
      source: {
        code: [
          '// Each node label renders a <Checkbox.Root>; withCheckboxes() wires checked/indeterminate.',
          'const items = withCheckboxes(fileTree, checked, toggle);',
          "<TreeView aria-label=\"Select files\" items={items} defaultExpandedIds={['src', 'components']} />",
        ].join('\n'),
      },
    },
    a11y: { config: { rules: [{ id: 'nested-interactive', enabled: false }] } },
  },
  args: { 'aria-label': 'Select files', items: fileTree },
  render: (args) => {
    const [checked, setChecked] = useState<Set<string>>(new Set(['button']));
    const toggle = (node: TreeNode) => {
      const leaves = leafIds(node);
      setChecked((prev) => {
        const all = leaves.every((id) => prev.has(id));
        const next = new Set(prev);
        leaves.forEach((id) => (all ? next.delete(id) : next.add(id)));
        return next;
      });
    };
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-gap-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Selected: <strong style={{ color: 'var(--eidra-fg)' }}>{checked.size}</strong> file(s)
        </p>
        <TreeView
          {...args}
          items={withCheckboxes(fileTree, checked, toggle)}
          defaultExpandedIds={['src', 'components']}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Checking a branch cascades to its descendant leaves.
    const srcBox = canvas.getByRole('checkbox', { name: /^src$/ });
    await userEvent.click(srcBox);
    await expect(srcBox).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: /index\.ts/ })).toBeChecked();
  },
};
