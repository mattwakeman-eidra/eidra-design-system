import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd.js';

const meta = {
  title: 'Data Display/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { children: '⌘K', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: 'flex', gap: 'var(--eidra-space-3)', alignItems: 'center', flexWrap: 'wrap' }}
  >
    {children}
  </div>
);

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Kbd {...args} size="sm">
        ⌘K
      </Kbd>
      <Kbd {...args} size="md">
        ⌘K
      </Kbd>
      <Kbd {...args} size="lg">
        ⌘K
      </Kbd>
    </Row>
  ),
};

export const CommonKeys: Story = {
  render: (args) => (
    <Row>
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>⌥</Kbd>
      <Kbd {...args}>⇧</Kbd>
      <Kbd {...args}>⌃</Kbd>
      <Kbd {...args}>⏎</Kbd>
      <Kbd {...args}>⌫</Kbd>
      <Kbd {...args}>Esc</Kbd>
      <Kbd {...args}>Tab</Kbd>
    </Row>
  ),
};

export const KeyCombination: Story = {
  render: (args) => (
    <Row>
      <Kbd {...args}>⌘</Kbd>
      <span
        style={{
          color: 'var(--eidra-fg-subtle)',
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-sm)',
        }}
      >
        +
      </span>
      <Kbd {...args}>K</Kbd>
    </Row>
  ),
};

export const InContext: Story = {
  render: (args) => (
    <p
      style={{
        fontFamily: 'var(--eidra-font-family-sans)',
        fontSize: 'var(--eidra-font-size-sm)',
        color: 'var(--eidra-fg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--eidra-space-1-5)',
      }}
    >
      Press <Kbd {...args}>⌘</Kbd> <Kbd {...args}>K</Kbd> to open the command palette
    </p>
  ),
};

export const SaveShortcut: Story = {
  render: (args) => (
    <p
      style={{
        fontFamily: 'var(--eidra-font-family-sans)',
        fontSize: 'var(--eidra-font-size-sm)',
        color: 'var(--eidra-fg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--eidra-space-1-5)',
      }}
    >
      Save changes with <Kbd {...args}>⌘</Kbd> <Kbd {...args}>S</Kbd>
    </p>
  ),
  args: { size: 'sm' },
};
