import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus, Trash2 } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Button } from './Button.js';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', variant: 'solid', tone: 'accent', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'subtle'] },
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'coral', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 'var(--eidra-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="subtle">Subtle</Button>
    </Row>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Row>
      <Button {...args} tone="accent">Accent</Button>
      <Button {...args} tone="neutral">Neutral</Button>
      <Button {...args} tone="coral">Coral</Button>
      <Button {...args} tone="danger">Danger</Button>
    </Row>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Row>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Row>
      <Button {...args} startIcon={<Icon icon={Plus} />}>Create</Button>
      <Button {...args} endIcon={<Icon icon={ArrowRight} />}>Continue</Button>
      <Button {...args} variant="ghost" tone="danger" startIcon={<Icon icon={Trash2} />}>Delete</Button>
      <Button {...args} iconOnly aria-label="Add"><Icon icon={Plus} /></Button>
    </Row>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
