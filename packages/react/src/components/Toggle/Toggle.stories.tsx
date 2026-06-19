import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
import { Toggle, ToggleGroup } from './Toggle.js';

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    size: 'md',
    children: 'Toggle',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'solid', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--eidra-space-3)',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    {children}
  </div>
);

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ─── Interaction: uncontrolled press toggles aria-pressed + fires callback ─────

/**
 * Clicking an uncontrolled `Toggle` flips its `aria-pressed` state and fires
 * `onPressedChange` with the new boolean. A second click returns it to off.
 */
export const PressToggle: Story = {
  args: { children: 'Bold', 'aria-label': 'Bold', onPressedChange: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /bold/i });

    await step('starts unpressed', async () => {
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    await step('click presses it and reports true', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(args.onPressedChange).toHaveBeenLastCalledWith(true, expect.anything());
    });

    await step('clicking again unpresses it and reports false', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await expect(args.onPressedChange).toHaveBeenLastCalledWith(false, expect.anything());
    });
  },
};

// ─── Interaction: keyboard (Space / Enter) toggles ────────────────────────────

/** A focused `Toggle` responds to both Space and Enter, flipping `aria-pressed`. */
export const KeyboardToggle: Story = {
  args: { children: 'Italic', 'aria-label': 'Italic', onPressedChange: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /italic/i });

    await step('Tab moves focus to the toggle', async () => {
      await userEvent.tab();
      await expect(toggle).toHaveFocus();
    });

    await step('Space presses it', async () => {
      await userEvent.keyboard(' ');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });

    await step('Enter unpresses it', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await expect(args.onPressedChange).toHaveBeenCalledTimes(2);
    });
  },
};

// ─── Interaction: controlled press stays put until host updates ────────────────

/**
 * A controlled `Toggle` (host owns `pressed`). Clicking still fires
 * `onPressedChange`, and because the host echoes the value back, the state flips.
 */
export const ControlledPress: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [pressed, setPressed] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Pressed: <strong style={{ color: 'var(--eidra-fg)' }}>{String(pressed)}</strong>
        </p>
        <Toggle pressed={pressed} onPressedChange={setPressed} aria-label="Underline">
          Underline
        </Toggle>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /underline/i });

    await step('controlled toggle starts off', async () => {
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    await step('click flows through host and presses it', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

// ─── Interaction: disabled toggle ignores clicks ──────────────────────────────

/** A `disabled` Toggle does not fire `onPressedChange` and stays unpressed. */
export const DisabledNoOp: Story = {
  args: {
    children: 'Disabled',
    'aria-label': 'Disabled toggle',
    disabled: true,
    onPressedChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /disabled toggle/i });
    await expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    await expect(args.onPressedChange).not.toHaveBeenCalled();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: (args) => (
    <Row>
      <Toggle {...args} variant="outline">
        Outline
      </Toggle>
      <Toggle {...args} variant="solid">
        Solid
      </Toggle>
      <Toggle {...args} variant="ghost">
        Ghost
      </Toggle>
    </Row>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Toggle {...args} size="sm">
        Small
      </Toggle>
      <Toggle {...args} size="md">
        Medium
      </Toggle>
      <Toggle {...args} size="lg">
        Large
      </Toggle>
    </Row>
  ),
};

// ─── Pressed state ────────────────────────────────────────────────────────────

export const Pressed: Story = {
  render: (args) => (
    <Row>
      <Toggle {...args} defaultPressed>
        Pressed
      </Toggle>
      <Toggle {...args}>Unpressed</Toggle>
    </Row>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => (
    <Row>
      <Toggle {...args} disabled>
        Disabled
      </Toggle>
      <Toggle {...args} disabled defaultPressed>
        Disabled + Pressed
      </Toggle>
    </Row>
  ),
};

// ─── Icon toggles ─────────────────────────────────────────────────────────────

export const IconToggles: Story = {
  render: (args) => (
    <Row>
      <Toggle {...args} aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toggle>
      <Toggle {...args} aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toggle>
      <Toggle {...args} aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toggle>
      <Toggle {...args} aria-label="Strikethrough">
        <Icon icon={Strikethrough} size="sm" />
      </Toggle>
    </Row>
  ),
};

// ─── ToggleGroup — text alignment (single-select) ─────────────────────────────

export const AlignmentGroup: StoryObj = {
  render: () => (
    <ToggleGroup.Root defaultValue={['left']} aria-label="Text alignment">
      <Toggle value="left" aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toggle>
    </ToggleGroup.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: /align left/i });
    const center = canvas.getByRole('button', { name: /align center/i });

    await step('uncontrolled defaultValue presses the left item', async () => {
      await expect(left).toHaveAttribute('aria-pressed', 'true');
      await expect(center).toHaveAttribute('aria-pressed', 'false');
    });

    await step('selecting another item moves the single selection', async () => {
      await userEvent.click(center);
      await expect(center).toHaveAttribute('aria-pressed', 'true');
      await expect(left).toHaveAttribute('aria-pressed', 'false');
    });

    await step('clicking the active item clears the selection (single-select empties)', async () => {
      await userEvent.click(center);
      await expect(center).toHaveAttribute('aria-pressed', 'false');
      await expect(left).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

// ─── ToggleGroup — onValueChange + roving-focus keyboard nav ──────────────────

/**
 * Single-select group wired to `onValueChange`. Verifies the callback payload
 * (an array of the active values) and that arrow keys rove focus across items,
 * with Home/End jumping to the ends.
 */
export const GroupKeyboardNav: StoryObj = {
  parameters: { controls: { disable: true } },
  render: (args: { onValueChange?: (value: string[]) => void }) => (
    <ToggleGroup.Root defaultValue={['left']} aria-label="Text alignment" onValueChange={args.onValueChange}>
      <Toggle value="left" aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toggle>
    </ToggleGroup.Root>
  ),
  args: { onValueChange: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: /align left/i });
    const center = canvas.getByRole('button', { name: /align center/i });
    const right = canvas.getByRole('button', { name: /align right/i });
    const onValueChange = (args as { onValueChange: ReturnType<typeof fn> }).onValueChange;

    await step('focus enters the group on the first item', async () => {
      await userEvent.tab();
      await expect(left).toHaveFocus();
    });

    await step('ArrowRight roves focus to the next item', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await expect(center).toHaveFocus();
    });

    await step('Enter selects the focused item and reports the new value', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(center).toHaveAttribute('aria-pressed', 'true');
      await expect(onValueChange).toHaveBeenLastCalledWith(['center'], expect.anything());
    });

    await step('End jumps focus to the last item', async () => {
      await userEvent.keyboard('{End}');
      await expect(right).toHaveFocus();
    });

    await step('Home jumps focus back to the first item', async () => {
      await userEvent.keyboard('{Home}');
      await expect(left).toHaveFocus();
    });
  },
};

// ─── ToggleGroup — loopFocus (arrow-key wrap) ─────────────────────────────────

/**
 * `loopFocus` (default `true`) wraps roving focus at the ends. Setting it to
 * `false` clamps: ArrowRight on the last item stays put instead of wrapping to
 * the first. Two groups side by side demonstrate both modes.
 */
export const LoopFocus: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--eidra-space-6)' }}>
      <ToggleGroup.Root defaultValue={['l-left']} aria-label="Looping group">
        <Toggle value="l-left">Left</Toggle>
        <Toggle value="l-mid">Middle</Toggle>
        <Toggle value="l-right">Right</Toggle>
      </ToggleGroup.Root>
      <ToggleGroup.Root loopFocus={false} defaultValue={['c-left']} aria-label="Clamping group">
        <Toggle value="c-left">First</Toggle>
        <Toggle value="c-mid">Second</Toggle>
        <Toggle value="c-right">Last</Toggle>
      </ToggleGroup.Root>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('default loopFocus wraps from the last item back to the first', async () => {
      const right = canvas.getByRole('button', { name: /^right$/i });
      const left = canvas.getByRole('button', { name: /^left$/i });
      right.focus();
      await expect(right).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(left).toHaveFocus();
    });

    await step('loopFocus={false} clamps at the last item (no wrap)', async () => {
      const last = canvas.getByRole('button', { name: /^last$/i });
      last.focus();
      await expect(last).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      // Focus stays on the last item rather than wrapping to "First".
      await expect(last).toHaveFocus();
    });
  },
};

// ─── ToggleGroup — controlled value ───────────────────────────────────────────

/**
 * A fully controlled group: the host owns `value`. Clicking fires
 * `onValueChange`; the host echoes the array back so the pressed state flips,
 * and the live readout reflects the current value.
 */
export const ControlledGroup: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState<string[]>(['left']);
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Value: <strong style={{ color: 'var(--eidra-fg)' }}>{value.join(', ') || '—'}</strong>
        </p>
        <ToggleGroup.Root value={value} onValueChange={setValue} aria-label="Text alignment">
          <Toggle value="left" aria-label="Align left">
            <Icon icon={AlignLeft} size="sm" />
          </Toggle>
          <Toggle value="center" aria-label="Align center">
            <Icon icon={AlignCenter} size="sm" />
          </Toggle>
          <Toggle value="right" aria-label="Align right">
            <Icon icon={AlignRight} size="sm" />
          </Toggle>
        </ToggleGroup.Root>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: /align left/i });
    const right = canvas.getByRole('button', { name: /align right/i });

    await step('controlled group reflects the host value on mount', async () => {
      await expect(left).toHaveAttribute('aria-pressed', 'true');
      await expect(canvas.getByText('left')).toBeInTheDocument();
    });

    await step('clicking flows through the host and updates the readout', async () => {
      await userEvent.click(right);
      await expect(right).toHaveAttribute('aria-pressed', 'true');
      await expect(left).toHaveAttribute('aria-pressed', 'false');
      await waitFor(() => expect(canvas.getByText('right')).toBeInTheDocument());
    });
  },
};

// ─── ToggleGroup — formatting (multi-select) ──────────────────────────────────

export const FormattingGroup: StoryObj = {
  render: () => (
    <ToggleGroup.Root multiple defaultValue={['bold']} aria-label="Text formatting">
      <Toggle value="bold" aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toggle>
      <Toggle value="italic" aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toggle>
      <Toggle value="underline" aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toggle>
      <Toggle value="strikethrough" aria-label="Strikethrough">
        <Icon icon={Strikethrough} size="sm" />
      </Toggle>
    </ToggleGroup.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: /bold/i });
    const italic = canvas.getByRole('button', { name: /italic/i });

    await step('multi-select keeps existing selections when adding a new one', async () => {
      await expect(bold).toHaveAttribute('aria-pressed', 'true');
      await userEvent.click(italic);
      await expect(italic).toHaveAttribute('aria-pressed', 'true');
      // bold stays pressed — multiple allows more than one active value
      await expect(bold).toHaveAttribute('aria-pressed', 'true');
    });

    await step('clicking an active item deselects just that one', async () => {
      await userEvent.click(bold);
      await expect(bold).toHaveAttribute('aria-pressed', 'false');
      await expect(italic).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

// ─── ToggleGroup — vertical orientation ──────────────────────────────────────

export const VerticalGroup: StoryObj = {
  render: () => (
    <ToggleGroup.Root orientation="vertical" defaultValue={['left']} aria-label="Text alignment">
      <Toggle value="left" aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toggle>
    </ToggleGroup.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: /align left/i });
    const center = canvas.getByRole('button', { name: /align center/i });

    await step('focus enters the vertical group on the first item', async () => {
      await userEvent.tab();
      await expect(left).toHaveFocus();
    });

    await step('ArrowDown roves focus down a vertical group', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(center).toHaveFocus();
    });

    await step('ArrowUp roves focus back up', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(left).toHaveFocus();
    });
  },
};

// ─── ToggleGroup — disabled ───────────────────────────────────────────────────

export const DisabledGroup: StoryObj = {
  render: () => (
    <ToggleGroup.Root disabled defaultValue={['center']} aria-label="Text alignment (disabled)">
      <Toggle value="left" aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toggle>
    </ToggleGroup.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: /align left/i });
    const center = canvas.getByRole('button', { name: /align center/i });
    // A disabled group disables its items; clicking does not move the selection.
    await expect(left).toBeDisabled();
    // Disabled toggles set pointer-events: none; bypass the check to assert the
    // click is a no-op.
    await userEvent.click(left, { pointerEventsCheck: 0 });
    await expect(left).toHaveAttribute('aria-pressed', 'false');
    await expect(center).toHaveAttribute('aria-pressed', 'true');
  },
};

// ─── ToggleGroup — text labels ────────────────────────────────────────────────

export const TextGroup: StoryObj = {
  render: () => (
    <ToggleGroup.Root defaultValue={['monthly']} aria-label="Billing period">
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="quarterly">Quarterly</Toggle>
      <Toggle value="annual">Annual</Toggle>
    </ToggleGroup.Root>
  ),
};

/**
 * Pill-shaped standalone chips (`shape="pill"`) — the quick-filter pattern: a row
 * of independently-toggled, fully-rounded chips. Use `solid` for a filled active state.
 */
export const QuickFilterChips: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--eidra-space-2)' }}>
      <Toggle shape="pill" size="sm" variant="solid" defaultPressed>
        Growing
      </Toggle>
      <Toggle shape="pill" size="sm" variant="solid">
        Declining
      </Toggle>
      <Toggle shape="pill" size="sm" variant="solid">
        At risk
      </Toggle>
      <Toggle shape="pill" size="sm" variant="solid">
        New this year
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const growing = canvas.getByRole('button', { name: /growing/i });
    const declining = canvas.getByRole('button', { name: /declining/i });

    await step('chips toggle independently of one another', async () => {
      await expect(growing).toHaveAttribute('aria-pressed', 'true');
      await userEvent.click(declining);
      await expect(declining).toHaveAttribute('aria-pressed', 'true');
      // The pre-pressed chip is unaffected — these are standalone toggles, not a group.
      await expect(growing).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

// ─── ToggleGroup — segmented appearance (formerly SegmentedControl) ────────────

/**
 * `appearance="segmented"` renders a contiguous filled-track control — the look
 * previously shipped as the standalone `SegmentedControl`. A single-select view
 * switcher built from plain `Toggle` segments and the Base UI group.
 */
export const Segmented: StoryObj = {
  render: () => {
    const [view, setView] = useState('table');
    return (
      <ToggleGroup.Root
        appearance="segmented"
        aria-label="View"
        value={[view]}
        onValueChange={(v) => v[0] && setView(v[0])}
      >
        <Toggle value="table">Table</Toggle>
        <Toggle value="graphs">Graphs</Toggle>
        <Toggle value="clients">Clients</Toggle>
      </ToggleGroup.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('button', { name: /^table$/i });
    const graphs = canvas.getByRole('button', { name: /^graphs$/i });

    await step('controlled segmented starts on the host default', async () => {
      await expect(table).toHaveAttribute('aria-pressed', 'true');
    });

    await step('clicking a segment switches the active value', async () => {
      await userEvent.click(graphs);
      await expect(graphs).toHaveAttribute('aria-pressed', 'true');
      await expect(table).toHaveAttribute('aria-pressed', 'false');
    });

    await step('the host guard keeps one segment always active on re-click', async () => {
      // onValueChange ignores the empty array (v[0] && setView), so re-clicking
      // the active segment leaves it selected — a segmented control never empties.
      await userEvent.click(graphs);
      await expect(graphs).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

/** Segmented sizes — heights derive from the control-size tokens, so they also shrink under compact density. */
export const SegmentedSizes: StoryObj = {
  render: () => {
    const [view, setView] = useState('graphs');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)', alignItems: 'flex-start' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <ToggleGroup.Root
            key={size}
            appearance="segmented"
            size={size}
            aria-label="View"
            value={[view]}
            onValueChange={(v) => v[0] && setView(v[0])}
          >
            <Toggle value="table">Table</Toggle>
            <Toggle value="graphs">Graphs</Toggle>
            <Toggle value="clients">Clients</Toggle>
          </ToggleGroup.Root>
        ))}
      </div>
    );
  },
};
