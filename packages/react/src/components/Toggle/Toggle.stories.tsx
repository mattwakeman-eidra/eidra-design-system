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

/**
 * Segmented link mode: segments delegate to anchors via each `Toggle`'s `render`
 * prop (here plain `<a>`; in an app, a router `Link`) — a view switcher that
 * preserves navigation. The active segment is marked `aria-current="page"`.
 */
export const SegmentedAsLinks: StoryObj = {
  render: () => {
    const active = 'graphs';
    return (
      <ToggleGroup.Root appearance="segmented" aria-label="View" value={[active]} onValueChange={() => {}}>
        {(['table', 'graphs', 'clients'] as const).map((v) => (
          <Toggle
            key={v}
            value={v}
            aria-current={v === active ? 'page' : undefined}
            render={<a href={`?view=${v}`} />}
          >
            {v[0]!.toUpperCase() + v.slice(1)}
          </Toggle>
        ))}
      </ToggleGroup.Root>
    );
  },
};
