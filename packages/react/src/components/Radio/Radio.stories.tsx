import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Radio, RadioGroup } from './Radio.js';

const meta = {
  title: 'Forms/Radio',
  component: Radio.Root,
  tags: ['autodocs'],
  args: { label: 'Option', value: 'option' },
} satisfies Meta<typeof Radio.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interaction stories that assert a RadioGroup callback own their args type, since
// `onValueChange` lives on RadioGroup (not on Radio.Root, the meta component).
type GroupStory = StoryObj<{ onValueChange: (value: unknown) => void }>;

// The Playground drives a whole RadioGroup, so it owns a wider arg set than the
// meta component (Radio.Root): group-level props plus the leading radio's props.
// A lone, ungrouped Radio.Root renders inert, so the Playground must wrap it.
type PlaygroundArgs = {
  // Group-level (RadioGroup)
  disabled?: boolean;
  onValueChange?: (value: unknown) => void;
  // Per-radio (first item)
  label?: string;
  value?: string;
  radioDisabled?: boolean;
};
type PlaygroundStory = StoryObj<PlaygroundArgs>;

const Col = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)' }}>
    {children}
  </div>
);

// ─── Playground ────────────────────────────────────────────────────────────────

/**
 * A live, grouped radio. The controls drive the wrapping `RadioGroup` (disabled /
 * readOnly / required) and the first radio (label / value / disabled); pick any
 * option to see selection move and `onValueChange` fire.
 */
export const Playground: PlaygroundStory = {
  args: {
    label: 'Email',
    value: 'email',
    disabled: false,
    radioDisabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: "The first radio's label." },
    value: { control: 'text', description: "The first radio's submitted value." },
    radioDisabled: {
      control: 'boolean',
      description: 'Whether the first radio individually ignores interaction.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the whole group ignores user interaction.',
    },
    // Dropped readOnly/required controls: neither changes the rendered radios
    // visibly (readOnly only blocks selection changes, required only gates form
    // submission). Dedicated stories cover read-only behaviour.
    onValueChange: {
      control: false,
      description: 'Callback fired with the newly selected value.',
    },
  },
  render: ({ label, value, radioDisabled, ...group }) => (
    <RadioGroup
      legend="Preferred contact"
      name="playground-contact"
      aria-label="Preferred contact"
      disabled={group.disabled}
      onValueChange={group.onValueChange}
    >
      <Radio.Root label={label} value={value ?? 'email'} disabled={radioDisabled} />
      <Radio.Root label="Phone" value="phone" />
      <Radio.Root label="Post" value="post" />
    </RadioGroup>
  ),
};

// ─── Behaviour (interaction coverage, no controls) ──────────────────────────────

/** Picking an option moves selection and fires onValueChange. */
export const Behaviour: GroupStory = {
  name: 'Radio behaviour',
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup
      legend="Preferred contact"
      name="behaviour-contact"
      aria-label="Preferred contact"
      disabled={false}
      readOnly={false}
      required={false}
      onValueChange={args.onValueChange}
    >
      <Radio.Root label="Email" value="email" disabled={false} />
      <Radio.Root label="Phone" value="phone" />
      <Radio.Root label="Post" value="post" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const phone = canvas.getByRole('radio', { name: /Phone/ });

    await step('selecting an option checks it and fires onValueChange', async () => {
      await expect(phone).not.toBeChecked();
      await userEvent.click(phone);
      await expect(phone).toBeChecked();
      await expect(args.onValueChange).toHaveBeenCalledWith('phone', expect.anything());
    });
  },
};

// ─── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <Col>
      <RadioGroup name="states-unchecked">
        <Radio.Root label="Unchecked" value="a" />
      </RadioGroup>
      <RadioGroup name="states-checked" defaultValue="b">
        <Radio.Root label="Checked" value="b" />
      </RadioGroup>
      <RadioGroup name="states-disabled" disabled>
        <Radio.Root label="Disabled unchecked" value="c" />
      </RadioGroup>
      <RadioGroup name="states-disabled-checked" defaultValue="d" disabled>
        <Radio.Root label="Disabled checked" value="d" />
      </RadioGroup>
      <RadioGroup name="states-readonly" defaultValue="e" readOnly>
        <Radio.Root label="Read-only" value="e" />
      </RadioGroup>
    </Col>
  ),
};

// ─── Without label ─────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <RadioGroup name="standalone" defaultValue="standalone" aria-label="Select this option">
      <Radio.Root value="standalone" aria-label="Select this option" />
    </RadioGroup>
  ),
};

// ─── Group: consulting engagement type ────────────────────────────────────────

export const Group: GroupStory = {
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup
      legend="Engagement type"
      name="engagement"
      defaultValue="advisory"
      aria-label="Engagement type"
      onValueChange={args.onValueChange}
    >
      <Radio.Root label="Strategy & Advisory" value="advisory" />
      <Radio.Root label="Experience Design" value="design" />
      <Radio.Root label="Technology Delivery" value="tech" />
      <Radio.Root label="Organisational Change" value="change" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const advisory = canvas.getByRole('radio', { name: /Strategy & Advisory/ });
    const design = canvas.getByRole('radio', { name: /Experience Design/ });

    await step('default value is checked on mount', async () => {
      await expect(advisory).toBeChecked();
      await expect(design).not.toBeChecked();
    });

    await step('clicking another option selects it and fires onValueChange', async () => {
      await userEvent.click(design);
      await expect(design).toBeChecked();
      await expect(advisory).not.toBeChecked();
      await expect(args.onValueChange).toHaveBeenCalledWith('design', expect.anything());
    });
  },
};

// ─── Group: Nordic office location ────────────────────────────────────────────

export const GroupOffices: Story = {
  name: 'Group — Nordic Offices',
  render: () => (
    <RadioGroup
      legend="Primary office"
      name="office"
      defaultValue="oslo"
      aria-label="Primary office"
    >
      <Radio.Root label="Oslo" value="oslo" />
      <Radio.Root label="Stockholm" value="stockholm" />
      <Radio.Root label="Copenhagen" value="copenhagen" />
      <Radio.Root label="Helsinki" value="helsinki" />
    </RadioGroup>
  ),
};

// ─── Group disabled ────────────────────────────────────────────────────────────

export const GroupDisabled: Story = {
  render: () => (
    <RadioGroup
      legend="Billing cycle"
      name="billing"
      defaultValue="annual"
      disabled
      aria-label="Billing cycle"
    >
      <Radio.Root label="Monthly" value="monthly" />
      <Radio.Root label="Annual (save 20%)" value="annual" />
      <Radio.Root label="Biennial (save 35%)" value="biennial" />
    </RadioGroup>
  ),
};

// ─── Group: horizontal layout ──────────────────────────────────────────────────

export const GroupHorizontal: Story = {
  render: () => (
    <RadioGroup
      name="priority"
      defaultValue="medium"
      aria-label="Priority"
      style={{ flexDirection: 'row', gap: 'var(--eidra-space-5)' }}
    >
      <Radio.Root label="Low" value="low" />
      <Radio.Root label="Medium" value="medium" />
      <Radio.Root label="High" value="high" />
      <Radio.Root label="Critical" value="critical" />
    </RadioGroup>
  ),
};

// ─── Keyboard navigation ─────────────────────────────────────────────────────────

/** Arrow keys move selection through the group (radiogroup roving tabindex). */
export const KeyboardNavigation: GroupStory = {
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup
      legend="Priority"
      name="kbd-priority"
      defaultValue="low"
      aria-label="Priority"
      onValueChange={args.onValueChange}
    >
      <Radio.Root label="Low" value="low" />
      <Radio.Root label="Medium" value="medium" />
      <Radio.Root label="High" value="high" />
      <Radio.Root label="Critical" value="critical" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const low = canvas.getByRole('radio', { name: /Low/ });
    const medium = canvas.getByRole('radio', { name: /Medium/ });
    const critical = canvas.getByRole('radio', { name: /Critical/ });

    await step('focusing the checked radio and pressing ArrowDown selects the next', async () => {
      low.focus();
      await expect(low).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(medium).toBeChecked();
      await expect(medium).toHaveFocus();
      await expect(args.onValueChange).toHaveBeenCalledWith('medium', expect.anything());
    });

    await step('ArrowUp moves selection back to the previous radio', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(low).toBeChecked();
      await expect(low).toHaveFocus();
    });

    await step('ArrowLeft wraps from the first radio to the last', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await expect(critical).toBeChecked();
      await expect(critical).toHaveFocus();
    });
  },
};

// ─── Disabled group blocks selection ─────────────────────────────────────────────

/** A disabled group ignores clicks: selection never moves off the default. */
export const DisabledBlocksSelection: GroupStory = {
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup
      legend="Billing cycle"
      name="disabled-billing"
      defaultValue="annual"
      disabled
      aria-label="Billing cycle"
      onValueChange={args.onValueChange}
    >
      <Radio.Root label="Monthly" value="monthly" />
      <Radio.Root label="Annual" value="annual" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const monthly = canvas.getByRole('radio', { name: /Monthly/ });
    const annual = canvas.getByRole('radio', { name: /Annual/ });

    await step('radios report disabled', async () => {
      await expect(annual).toHaveAttribute('aria-disabled', 'true');
      await expect(monthly).toHaveAttribute('aria-disabled', 'true');
      await expect(annual).toBeChecked();
    });

    await step('clicking a disabled radio does not change selection or fire callback', async () => {
      // The radio sets pointer-events: none while disabled; bypass the check so
      // we can assert the click is a no-op.
      await userEvent.click(monthly, { pointerEventsCheck: 0 });
      await expect(monthly).not.toBeChecked();
      await expect(annual).toBeChecked();
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });
  },
};

// ─── Read-only group blocks change ───────────────────────────────────────────────

/** A read-only group stays focusable but rejects selection changes. */
export const ReadOnlyBlocksChange: GroupStory = {
  parameters: { controls: { disable: true } },
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup
      legend="Plan"
      name="readonly-plan"
      defaultValue="pro"
      readOnly
      aria-label="Plan"
      onValueChange={args.onValueChange}
    >
      <Radio.Root label="Starter" value="starter" />
      <Radio.Root label="Pro" value="pro" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const starter = canvas.getByRole('radio', { name: /Starter/ });
    const pro = canvas.getByRole('radio', { name: /Pro/ });

    await step('clicking another radio does not change the read-only selection', async () => {
      await userEvent.click(starter);
      await expect(starter).not.toBeChecked();
      await expect(pro).toBeChecked();
      await expect(args.onValueChange).not.toHaveBeenCalled();
    });
  },
};

// ─── Controlled selection ────────────────────────────────────────────────────────

/**
 * Selection driven from the outside: the host owns `value`; the group only reports
 * changes via `onValueChange`. Until the host updates `value`, the selection holds.
 */
export const ControlledSelection: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState('email');
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Selected: <strong style={{ color: 'var(--eidra-fg)' }}>{value}</strong>
        </p>
        <RadioGroup
          legend="Preferred contact"
          name="controlled-contact"
          aria-label="Preferred contact"
          value={value}
          onValueChange={(next: string) => setValue(next)}
        >
          <Radio.Root label="Email" value="email" />
          <Radio.Root label="Phone" value="phone" />
          <Radio.Root label="Post" value="post" />
        </RadioGroup>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('radio', { name: /Email/ });
    const phone = canvas.getByRole('radio', { name: /Phone/ });

    await step('initial controlled value is reflected', async () => {
      await expect(email).toBeChecked();
    });

    await step('selecting another radio flows through host state', async () => {
      await userEvent.click(phone);
      await waitFor(() => expect(phone).toBeChecked());
      await expect(email).not.toBeChecked();
      await expect(canvas.getByText('phone')).toBeInTheDocument();
    });
  },
};
