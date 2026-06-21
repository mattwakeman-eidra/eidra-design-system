import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionBar } from './ActionBar.js';
import { Button } from '../../index.js';

const meta = {
  title: 'Layout/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  args: {
    align: 'between',
    sticky: false,
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end', 'between'] },
    sticky: { control: 'inline-radio', options: [false, 'top', 'bottom'] },
    selectedCount: { control: { type: 'number', min: 0 } },
    // ReactNode (often JSX) — not editable as a control.
    children: { control: false },
    message: { control: false },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A bar with a few action buttons and no selection. */
export const Default: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" tone="neutral">
          Cancel
        </Button>
        <Button>Save changes</Button>
      </>
    ),
  },
};

/** With `selectedCount`, a leading selection summary appears as a Badge. */
export const WithSelection: Story = {
  args: {
    selectedCount: 3,
    children: (
      <>
        <Button variant="outline" tone="neutral">
          Approve
        </Button>
        <Button tone="danger" variant="ghost">
          Delete
        </Button>
      </>
    ),
  },
};

/** An optional status message sits beside the selection summary. */
export const WithMessage: Story = {
  args: {
    selectedCount: 3,
    message: 'Mixed statuses — only approved rows will be exported.',
    children: <Button>Export selected</Button>,
  },
};

/**
 * `sticky="bottom"` (or `sticky` / `sticky={true}`) pins the bar to the bottom
 * edge of its scroll container with a top border and raised shadow, layered at
 * `--eidra-z-sticky`. Scroll the panel to keep it in view.
 */
export const StickyBottom: Story = {
  parameters: { controls: { disable: true } },
  args: {
    sticky: 'bottom',
    selectedCount: 5,
    message: '5 rows ready to approve.',
    children: (
      <>
        <Button variant="outline" tone="neutral">
          Clear selection
        </Button>
        <Button>Approve all</Button>
      </>
    ),
  },
  render: (args) => (
    <div
      style={{
        height: 280,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-md)',
      }}
    >
      <div style={{ padding: 'var(--eidra-gap-4)', minHeight: 480 }}>
        <p style={{ color: 'var(--eidra-fg-muted)' }}>
          Scroll — the action bar stays pinned to the bottom.
        </p>
      </div>
      <ActionBar {...args} />
    </div>
  ),
};

/**
 * `sticky="top"` pins the bar to the top edge with a bottom border instead —
 * useful as a persistent header toolbar above a long scrolling region.
 */
export const StickyTop: Story = {
  parameters: { controls: { disable: true } },
  args: {
    sticky: 'top',
    selectedCount: 5,
    message: '5 rows ready to approve.',
    children: (
      <>
        <Button variant="outline" tone="neutral">
          Clear selection
        </Button>
        <Button>Approve all</Button>
      </>
    ),
  },
  render: (args) => (
    <div
      style={{
        height: 280,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-md)',
      }}
    >
      <ActionBar {...args} />
      <div style={{ padding: 'var(--eidra-gap-4)', minHeight: 480 }}>
        <p style={{ color: 'var(--eidra-fg-muted)' }}>
          Scroll — the action bar stays pinned to the top.
        </p>
      </div>
    </div>
  ),
};
