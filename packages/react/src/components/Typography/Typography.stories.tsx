import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography.js';

const meta = {
  title: 'Foundations/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: { children: 'We help leaders create great change', variant: 'body' },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ProductScale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-4)' }}>
      <Typography variant="heading-1">Heading 1</Typography>
      <Typography variant="heading-2">Heading 2</Typography>
      <Typography variant="heading-3">Heading 3</Typography>
      <Typography variant="heading-4">Heading 4</Typography>
      <Typography variant="body-lg">Body large — the concentrated expertise leaders need.</Typography>
      <Typography variant="body">Body — plain-spoken, open and thoughtful.</Typography>
      <Typography variant="body-sm">Body small — supporting detail.</Typography>
      <Typography variant="label">Label</Typography>
      <Typography variant="caption">Caption</Typography>
    </div>
  ),
};

export const DisplayTier: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-5)' }}>
      <Typography variant="display-lg">Great change</Typography>
      <Typography variant="display-md">Great change</Typography>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-2)' }}>
      <Typography tone="default">Default</Typography>
      <Typography tone="muted">Muted</Typography>
      <Typography tone="subtle">Subtle</Typography>
      <Typography tone="accent">Accent</Typography>
      <Typography tone="danger">Danger</Typography>
    </div>
  ),
};
