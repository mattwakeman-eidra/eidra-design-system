import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Switch } from './Switch.js';

const meta = {
  title: 'Forms/Switch',
  component: Switch.Root,
  tags: ['autodocs'],
  parameters: {
  },
  args: {
    label: 'Enable feature',
    name: 'feature',
    defaultChecked: false,
  },
  argTypes: {
    labelPosition: { control: 'inline-radio', options: ['start', 'end'] },
  },
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const Col = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)' }}>
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 'var(--eidra-space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ─── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: (args) => (
    <Col>
      <Switch.Root {...args} label="Unchecked" name="s1" />
      <Switch.Root {...args} label="Checked" name="s2" defaultChecked />
      <Switch.Root {...args} label="Disabled unchecked" name="s3" disabled />
      <Switch.Root {...args} label="Disabled checked" name="s4" defaultChecked disabled />
      <Switch.Root {...args} label="Read-only" name="s5" defaultChecked readOnly />
    </Col>
  ),
};

// ─── Label position ────────────────────────────────────────────────────────────

export const LabelPosition: Story = {
  render: (args) => (
    <Col>
      <Switch.Root {...args} label="Label at end (default)" name="lp1" labelPosition="end" />
      <Switch.Root {...args} label="Label at start" name="lp2" labelPosition="start" defaultChecked />
    </Col>
  ),
};

// ─── No label ──────────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <Row>
      <Switch.Root name="nl1" aria-label="Toggle dark mode" />
      <Switch.Root name="nl2" aria-label="Toggle notifications" defaultChecked />
    </Row>
  ),
};

// ─── Interaction: uncontrolled toggle via click ────────────────────────────────

/**
 * Uncontrolled: the switch owns its checked state (seeded by `defaultChecked`).
 * Clicking the track flips `aria-checked` and fires `onCheckedChange` with the
 * new value.
 */
export const ClickToggles: Story = {
  args: {
    label: 'Auto-sync',
    name: 'autosync',
    defaultChecked: false,
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /auto-sync/i });

    await step('starts unchecked', async () => {
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });

    await step('clicking checks it and reports the new value', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'true');
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    });

    await step('clicking again unchecks it', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'false');
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
    });
  },
};

// ─── Interaction: keyboard toggle (Space / Enter) ──────────────────────────────

/** The switch is keyboard-operable: focus it, then Space (and Enter) toggle it. */
export const KeyboardToggle: Story = {
  args: {
    label: 'Notifications',
    name: 'kbd',
    defaultChecked: false,
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /notifications/i });

    await step('focus the switch', async () => {
      sw.focus();
      await expect(sw).toHaveFocus();
    });

    await step('Space toggles on', async () => {
      await userEvent.keyboard(' ');
      await expect(sw).toHaveAttribute('aria-checked', 'true');
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    });

    await step('Enter toggles off', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(sw).toHaveAttribute('aria-checked', 'false');
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
    });
  },
};

// ─── Interaction: controlled ───────────────────────────────────────────────────

/**
 * Controlled: the host owns `checked` and updates it from `onCheckedChange`.
 * The switch only reflects the prop, so the UI advances only when the host
 * commits the new value.
 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  args: { label: 'Dark mode', name: 'darkmode', onCheckedChange: fn() },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Col>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          State: <strong style={{ color: 'var(--eidra-fg)' }}>{checked ? 'on' : 'off'}</strong>
        </p>
        <Switch.Root
          {...args}
          checked={checked}
          onCheckedChange={(value, event) => {
            args.onCheckedChange?.(value, event);
            setChecked(value);
          }}
        />
      </Col>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /dark mode/i });

    await step('host starts off', async () => {
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });

    await step('clicking drives the host state on', async () => {
      await userEvent.click(sw);
      await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });
  },
};

// ─── Interaction: disabled does not toggle ─────────────────────────────────────

/** A disabled switch ignores clicks and never fires `onCheckedChange`. */
export const DisabledIgnoresInteraction: Story = {
  args: {
    label: 'Beta features',
    name: 'beta',
    disabled: true,
    defaultChecked: false,
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /beta features/i });

    await step('exposes disabled state', async () => {
      await expect(sw).toHaveAttribute('aria-disabled', 'true');
    });

    await step('clicking does nothing', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'false');
      await expect(args.onCheckedChange).not.toHaveBeenCalled();
    });
  },
};

// ─── Interaction: read-only does not toggle ────────────────────────────────────

/** A read-only switch is focusable but its value can't be changed by the user. */
export const ReadOnlyIgnoresInteraction: Story = {
  args: {
    label: 'Plan tier',
    name: 'plan',
    readOnly: true,
    defaultChecked: true,
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /plan tier/i });

    await step('exposes read-only state', async () => {
      await expect(sw).toHaveAttribute('aria-readonly', 'true');
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });

    await step('clicking leaves the value unchanged', async () => {
      await userEvent.click(sw, { pointerEventsCheck: 0 });
      await expect(sw).toHaveAttribute('aria-checked', 'true');
      await expect(args.onCheckedChange).not.toHaveBeenCalled();
    });
  },
};

// ─── Interaction: clicking the label toggles the switch ────────────────────────

/** The label is wired to the track, so clicking the text toggles the switch. */
export const LabelClickToggles: Story = {
  args: {
    label: 'Enable feature',
    name: 'labelclick',
    defaultChecked: false,
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /enable feature/i });

    await step('clicking the label text toggles the switch', async () => {
      await userEvent.click(canvas.getByText('Enable feature'));
      await expect(sw).toHaveAttribute('aria-checked', 'true');
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    });
  },
};

// ─── Realistic: Workspace settings ────────────────────────────────────────────

export const WorkspaceSettings: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-0)',
        maxWidth: '28rem',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        overflow: 'hidden',
      }}
    >
      {[
        { label: 'Email notifications', name: 'email', defaultChecked: true },
        { label: 'Weekly digest', name: 'digest', defaultChecked: true },
        { label: 'Project updates', name: 'projects', defaultChecked: false },
        { label: 'Mention alerts', name: 'mentions', defaultChecked: true },
        { label: 'Beta features', name: 'beta', defaultChecked: false, disabled: true },
      ].map(({ label, name, defaultChecked, disabled }, i, arr) => (
        <div
          key={name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--eidra-space-4)',
            borderBottom: i < arr.length - 1 ? '1px solid var(--eidra-border-subtle)' : undefined,
            backgroundColor: 'var(--eidra-surface)',
          }}
        >
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-sm)', fontWeight: 'var(--eidra-font-weight-medium)', color: disabled ? 'var(--eidra-fg-disabled)' : 'var(--eidra-fg)' }}>
              {label}
            </p>
          </div>
          <Switch.Root
            name={name}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-label={label}
          />
        </div>
      ))}
    </div>
  ),
};
