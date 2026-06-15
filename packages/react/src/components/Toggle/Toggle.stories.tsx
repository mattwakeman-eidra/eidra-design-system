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
