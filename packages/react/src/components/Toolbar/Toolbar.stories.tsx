import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Search,
  Strikethrough,
} from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
import { Toolbar } from './Toolbar.js';

const meta = {
  title: 'Navigation/Toolbar',
  component: Toolbar.Root,
  subcomponents: {
    'Toolbar.Button': Toolbar.Button,
    'Toolbar.Link': Toolbar.Link,
    'Toolbar.Input': Toolbar.Input,
    'Toolbar.Group': Toolbar.Group,
    'Toolbar.Separator': Toolbar.Separator,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  // Dropped invisible control: `loopFocus` (keyboard wrap-around only — no visible
  // change in the rendered toolbar). `orientation` stays: the CSS reflows the layout
  // (flex-direction row/column) so toggling it is visible.
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the toolbar — row vs. column layout.',
    },
  },
  args: {
    orientation: 'horizontal',
  },
} satisfies Meta<typeof Toolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <Toolbar.Root aria-label="Text formatting" {...args}>
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Link href="#">
        <Icon icon={Link2} size="sm" />
        Docs
      </Toolbar.Link>
    </Toolbar.Root>
  ),
  // Horizontal roving tabindex: a single Tab stop, arrow keys move focus between
  // items (looping at the ends). Separators are skipped. Base UI's Toolbar
  // composite does not bind Home/End.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: /bold/i });
    const italic = canvas.getByRole('button', { name: /italic/i });
    const docs = canvas.getByRole('link', { name: /docs/i });

    await step('Tab focuses the first item (single tab stop)', async () => {
      await userEvent.tab();
      await expect(bold).toHaveFocus();
      await expect(bold).toHaveAttribute('tabindex', '0');
      await expect(italic).toHaveAttribute('tabindex', '-1');
    });

    await step('ArrowRight moves focus to the next item', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await expect(italic).toHaveFocus();
    });

    await step('ArrowLeft moves focus back', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await expect(bold).toHaveFocus();
    });

    await step('ArrowLeft from the first item wraps to the last (a link)', async () => {
      // Base UI's Toolbar is a composite with arrow-key roving focus and
      // loopFocus enabled; Home/End are not bound. Wrapping past the first
      // item lands on the last focusable composite item — the Docs link.
      await expect(bold).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(() => expect(docs).toHaveFocus());
    });

    await step('ArrowRight from the last item wraps back to the first', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await waitFor(() => expect(bold).toHaveFocus());
    });

    await step('separators are not focus stops in the roving sequence', async () => {
      // Focus is back on Bold (the first item) from the previous step.
      await expect(bold).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
      // Bold → Italic → Underline → Align left (separator between Underline and
      // Align left is skipped, not counted as a stop).
      await waitFor(() =>
        expect(canvas.getByRole('button', { name: /align left/i })).toHaveFocus(),
      );
    });
  },
};

// ─── WithLabels ──────────────────────────────────────────────────────────────

const onBoldClick = fn();

export const WithLabels: Story = {
  render: () => (
    <Toolbar.Root aria-label="Document actions">
      <Toolbar.Button onClick={onBoldClick}>
        <Icon icon={Bold} size="sm" />
        Bold
      </Toolbar.Button>
      <Toolbar.Button>
        <Icon icon={Italic} size="sm" />
        Italic
      </Toolbar.Button>
      <Toolbar.Button>
        <Icon icon={Strikethrough} size="sm" />
        Strike
      </Toolbar.Button>
    </Toolbar.Root>
  ),
  // A toolbar button is a real <button>: it fires onClick on pointer click and on
  // keyboard Enter / Space activation.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onBoldClick.mockClear();
    const bold = canvas.getByRole('button', { name: /bold/i });

    await step('clicking the button fires onClick', async () => {
      await userEvent.click(bold);
      await expect(onBoldClick).toHaveBeenCalledTimes(1);
    });

    await step('Enter activates the focused button', async () => {
      bold.focus();
      await userEvent.keyboard('{Enter}');
      await expect(onBoldClick).toHaveBeenCalledTimes(2);
    });

    await step('Space activates the focused button', async () => {
      bold.focus();
      await userEvent.keyboard(' ');
      await expect(onBoldClick).toHaveBeenCalledTimes(3);
    });
  },
};

// ─── WithGroups ──────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => (
    <Toolbar.Root aria-label="Text editor toolbar">
      <Toolbar.Group aria-label="Text style">
        <Toolbar.Button aria-label="Bold">
          <Icon icon={Bold} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Italic">
          <Icon icon={Italic} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Underline">
          <Icon icon={Underline} size="sm" />
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group aria-label="Alignment">
        <Toolbar.Button aria-label="Align left">
          <Icon icon={AlignLeft} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Align center">
          <Icon icon={AlignCenter} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Align right">
          <Icon icon={AlignRight} size="sm" />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  ),
};

// ─── WithInput ───────────────────────────────────────────────────────────────

export const WithInput: Story = {
  render: () => (
    <Toolbar.Root aria-label="Search toolbar">
      <Toolbar.Button aria-label="Search">
        <Icon icon={Search} size="sm" />
      </Toolbar.Button>
      <Toolbar.Input placeholder="Search engagements…" style={{ width: 220 }} aria-label="Search" />
      <Toolbar.Separator />
      <Toolbar.Button>All</Toolbar.Button>
      <Toolbar.Button>Active</Toolbar.Button>
      <Toolbar.Button>Archived</Toolbar.Button>
    </Toolbar.Root>
  ),
  // A Toolbar.Input is a participating item but opts out of arrow-key roving so the
  // caret can move within the text; it still accepts typed input normally.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('textbox', { name: /search/i });

    await step('typing into the toolbar input updates its value', async () => {
      await userEvent.click(search);
      await expect(search).toHaveFocus();
      await userEvent.type(search, 'invoice');
      await expect(search).toHaveValue('invoice');
    });

    await step('ArrowLeft moves the caret inside the input, not focus', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await expect(search).toHaveFocus();
    });
  },
};

// ─── WithDisabled ────────────────────────────────────────────────────────────

const onItalicClick = fn();

export const WithDisabled: Story = {
  render: () => (
    <Toolbar.Root aria-label="Text formatting with disabled items">
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic" disabled onClick={onItalicClick}>
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Strikethrough" disabled>
        <Icon icon={Strikethrough} size="sm" />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
  // Base UI keeps disabled toolbar items in the roving sequence (so they stay
  // discoverable) but blocks activation.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onItalicClick.mockClear();
    const bold = canvas.getByRole('button', { name: /bold/i });
    const italic = canvas.getByRole('button', { name: /italic/i });

    await step('a disabled item exposes the disabled state', async () => {
      await expect(italic).toHaveAttribute('aria-disabled', 'true');
    });

    await step('arrow navigation still lands on the disabled item', async () => {
      await userEvent.tab();
      await expect(bold).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(italic).toHaveFocus();
    });

    await step('activating a disabled item does not fire onClick', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(onItalicClick).not.toHaveBeenCalled();
    });
  },
};

// ─── Vertical ────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <Toolbar.Root orientation="vertical" aria-label="Page actions" style={{ width: 48 }}>
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
  // A vertical toolbar advertises orientation and rovs with ArrowDown / ArrowUp.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: /bold/i });
    const italic = canvas.getByRole('button', { name: /italic/i });

    await step('the toolbar reports vertical orientation', async () => {
      await expect(canvas.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
    });

    await step('ArrowDown moves focus down, ArrowUp back', async () => {
      await userEvent.tab();
      await expect(bold).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(italic).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      await expect(bold).toHaveFocus();
    });
  },
};

// ─── DisabledAll ─────────────────────────────────────────────────────────────

const onDisabledRootClick = fn();

export const DisabledAll: Story = {
  render: () => (
    <Toolbar.Root disabled aria-label="Disabled toolbar">
      <Toolbar.Button aria-label="Bold" onClick={onDisabledRootClick}>
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
  // `disabled` on the Root cascades to every item: each reports disabled and none
  // activate.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onDisabledRootClick.mockClear();
    const bold = canvas.getByRole('button', { name: /bold/i });

    await step('every item is disabled when the root is disabled', async () => {
      await expect(bold).toHaveAttribute('aria-disabled', 'true');
      await expect(canvas.getByRole('button', { name: /italic/i })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      await expect(canvas.getByRole('button', { name: /underline/i })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    await step('clicking a disabled item does not fire onClick', async () => {
      // Disabled toolbar items set pointer-events: none; bypass the check to
      // assert the click is a no-op.
      await userEvent.click(bold, { pointerEventsCheck: 0 });
      await expect(onDisabledRootClick).not.toHaveBeenCalled();
    });
  },
};
