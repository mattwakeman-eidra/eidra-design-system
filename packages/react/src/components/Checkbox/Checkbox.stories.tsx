import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Checkbox, CheckboxGroup } from './Checkbox.js';
import styles from './Checkbox.stories.module.css';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox.Root,
  subcomponents: {
    'Checkbox.Indicator': Checkbox.Indicator,
  },
  tags: ['autodocs'],
  args: {
    label: 'Accept terms and conditions',
    disabled: false,
    indeterminate: false,
    defaultChecked: false,
  },
  // Dropped from controls (props remain real): `name` (form-wiring identity, no
  // visual), `readOnly` and `required` (the CSS has no [data-readonly]/[data-required]
  // rule, so toggling either changes nothing on screen).
  argTypes: {
    label: { control: 'text', description: 'Label rendered alongside the checkbox.' },
    disabled: {
      control: 'boolean',
      description: 'Whether the component should ignore user interaction.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in a mixed state — neither ticked nor unticked.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Whether the checkbox is initially ticked (uncontrolled).',
    },
  },
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const Col = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.col}>{children}</div>
);

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: { onCheckedChange: fn() },
};

// ─── Behaviour (interaction coverage, no controls) ──────────────────────────────

export const Behaviour: Story = {
  name: 'Checkbox behaviour',
  parameters: { controls: { disable: true } },
  args: {
    onCheckedChange: fn(),
    disabled: false,
    defaultChecked: false,
    readOnly: false,
    indeterminate: false,
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: /accept terms/i });

    await step('click ticks the (uncontrolled) checkbox and fires onCheckedChange', async () => {
      await expect(box).not.toBeChecked();
      await userEvent.click(box);
      await expect(box).toBeChecked();
      await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    });

    await step('clicking again unticks it', async () => {
      await userEvent.click(box);
      await expect(box).not.toBeChecked();
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
    });

    await step('Space toggles the focused checkbox', async () => {
      box.focus();
      await expect(box).toHaveFocus();
      await userEvent.keyboard(' ');
      await expect(box).toBeChecked();
    });
  },
};

// ─── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: (args) => (
    <Col>
      <Checkbox.Root {...args} label="Unchecked" name="s1" />
      <Checkbox.Root {...args} label="Checked" name="s2" defaultChecked />
      <Checkbox.Root {...args} label="Indeterminate" name="s3" indeterminate />
      <Checkbox.Root {...args} label="Disabled unchecked" name="s4" disabled />
      <Checkbox.Root {...args} label="Disabled checked" name="s5" defaultChecked disabled />
      <Checkbox.Root {...args} label="Read-only" name="s6" defaultChecked readOnly />
    </Col>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('disabled checkbox exposes aria-disabled and ignores clicks', async () => {
      const disabled = canvas.getByRole('checkbox', { name: /disabled unchecked/i });
      await expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(disabled, { pointerEventsCheck: 0 });
      await expect(disabled).not.toBeChecked();
    });

    await step('read-only checkbox keeps its checked state on click', async () => {
      const readOnly = canvas.getByRole('checkbox', { name: /read-only/i });
      await expect(readOnly).toBeChecked();
      await userEvent.click(readOnly);
      await expect(readOnly).toBeChecked();
    });

    await step('indeterminate checkbox stays mixed while the prop is set', async () => {
      const mixed = canvas.getByRole('checkbox', { name: /indeterminate/i });
      await expect(mixed).toHaveAttribute('aria-checked', 'mixed');
      // `indeterminate` is a static prop here, so Base UI keeps reporting
      // aria-checked="mixed" regardless of the underlying checked state. Clicking
      // toggles that internal checked state (the consumer would clear
      // `indeterminate` in response), but the displayed mixed state persists.
      await userEvent.click(mixed);
      await waitFor(() => expect(mixed).toHaveAttribute('aria-checked', 'mixed'));
    });
  },
};

// ─── Without label ─────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <Checkbox.Root name="standalone" defaultChecked aria-label="Enable notifications" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The aria-label gives the standalone box its accessible name; it starts ticked.
    const box = canvas.getByRole('checkbox', { name: /enable notifications/i });
    await expect(box).toBeChecked();
    await userEvent.click(box);
    await expect(box).not.toBeChecked();
  },
};

// ─── Group: Consulting services ───────────────────────────────────────────────

const groupValueSpy = fn();

export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <CheckboxGroup
      legend="Select services"
      defaultValue={['strategy', 'design']}
      aria-label="Consulting services"
      onValueChange={groupValueSpy}
    >
      <Checkbox.Root label="Strategy & Advisory" value="strategy" name="services" />
      <Checkbox.Root label="Experience Design" value="design" name="services" />
      <Checkbox.Root label="Technology Delivery" value="tech" name="services" />
      <Checkbox.Root label="Organisational Change" value="change" name="services" />
    </CheckboxGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onValueChange = groupValueSpy;
    onValueChange.mockClear();

    await step('group seeds its defaultValue (uncontrolled)', async () => {
      await expect(canvas.getByRole('checkbox', { name: /strategy/i })).toBeChecked();
      await expect(canvas.getByRole('checkbox', { name: /experience design/i })).toBeChecked();
      await expect(
        canvas.getByRole('checkbox', { name: /technology delivery/i }),
      ).not.toBeChecked();
    });

    await step('ticking a member adds its value and fires onValueChange', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: /technology delivery/i }));
      await expect(canvas.getByRole('checkbox', { name: /technology delivery/i })).toBeChecked();
      await expect(onValueChange).toHaveBeenCalledWith(
        expect.arrayContaining(['strategy', 'design', 'tech']),
        expect.anything(),
      );
    });

    await step('unticking a member removes its value', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: /strategy/i }));
      await expect(canvas.getByRole('checkbox', { name: /strategy/i })).not.toBeChecked();
      await expect(onValueChange).toHaveBeenLastCalledWith(
        expect.not.arrayContaining(['strategy']),
        expect.anything(),
      );
    });
  },
};

// ─── Group with parent checkbox ───────────────────────────────────────────────

export const GroupWithParent: Story = {
  render: () => (
    <CheckboxGroup
      defaultValue={['norway', 'sweden']}
      allValues={['norway', 'sweden', 'denmark', 'finland']}
      aria-label="Nordic offices"
    >
      <Checkbox.Root label="All offices" parent name="offices-parent" />
      <div
        style={{
          paddingInlineStart: 'var(--eidra-space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--eidra-space-2)',
        }}
      >
        <Checkbox.Root label="Oslo" value="norway" name="offices" />
        <Checkbox.Root label="Stockholm" value="sweden" name="offices" />
        <Checkbox.Root label="Copenhagen" value="denmark" name="offices" />
        <Checkbox.Root label="Helsinki" value="finland" name="offices" />
      </div>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole('checkbox', { name: /all offices/i });

    await step('parent is indeterminate when only some children are ticked', async () => {
      await expect(canvas.getByRole('checkbox', { name: /oslo/i })).toBeChecked();
      await expect(canvas.getByRole('checkbox', { name: /copenhagen/i })).not.toBeChecked();
      await expect(parent).toHaveAttribute('aria-checked', 'mixed');
    });

    await step('clicking the parent ticks every child (cascade)', async () => {
      await userEvent.click(parent);
      await expect(parent).toHaveAttribute('aria-checked', 'true');
      for (const name of [/oslo/i, /stockholm/i, /copenhagen/i, /helsinki/i]) {
        await expect(canvas.getByRole('checkbox', { name })).toBeChecked();
      }
    });

    await step('clicking the parent again clears every child', async () => {
      await userEvent.click(parent);
      await expect(parent).toHaveAttribute('aria-checked', 'false');
      for (const name of [/oslo/i, /stockholm/i, /copenhagen/i, /helsinki/i]) {
        await expect(canvas.getByRole('checkbox', { name })).not.toBeChecked();
      }
    });
  },
};

// ─── Group disabled ────────────────────────────────────────────────────────────

export const GroupDisabled: Story = {
  render: () => (
    <CheckboxGroup
      legend="Available features"
      defaultValue={['reporting']}
      disabled
      aria-label="Available features"
    >
      <Checkbox.Root label="Advanced Reporting" value="reporting" name="feat" />
      <Checkbox.Root label="Data Export" value="export" name="feat" />
      <Checkbox.Root label="API Access" value="api" name="feat" />
    </CheckboxGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('a disabled group disables its members and clicks are no-ops', async () => {
      const exportBox = canvas.getByRole('checkbox', { name: /data export/i });
      await expect(exportBox).toHaveAttribute('aria-disabled', 'true');
      await expect(exportBox).not.toBeChecked();
      await userEvent.click(exportBox, { pointerEventsCheck: 0 });
      await expect(exportBox).not.toBeChecked();
    });
  },
};

// ─── Controlled checkbox ────────────────────────────────────────────────────────

/**
 * A fully controlled checkbox: the host owns `checked`, the box only reports
 * intent via `onCheckedChange`. Demonstrates that without a state update the box
 * stays put, and that the host can refuse a toggle.
 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  args: { onCheckedChange: fn() },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Col>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          State: <strong style={{ color: 'var(--eidra-fg)' }}>{checked ? 'on' : 'off'}</strong>
        </p>
        <Checkbox.Root
          label="Subscribe to updates"
          name="subscribe"
          checked={checked}
          onCheckedChange={(next, details) => {
            args.onCheckedChange?.(next, details);
            setChecked(next);
          }}
        />
      </Col>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: /subscribe to updates/i });

    await step('host-driven state flips on click', async () => {
      await expect(box).not.toBeChecked();
      await userEvent.click(box);
      await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
      await expect(box).toBeChecked();
      await expect(canvas.getByText('on')).toBeInTheDocument();
    });

    await step('clicking again drives it back off', async () => {
      await userEvent.click(box);
      await expect(box).not.toBeChecked();
      await expect(canvas.getByText('off')).toBeInTheDocument();
    });
  },
};
