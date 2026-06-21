import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton.js';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { variant: 'rect' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
    radius: { control: 'text' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--eidra-gap-3)',
      width: '320px',
    }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: 'flex', gap: 'var(--eidra-gap-3)', alignItems: 'center', flexWrap: 'wrap' }}
  >
    {children}
  </div>
);

export const Playground: Story = {
  args: { width: '280px', height: '48px' },
};

export const TextLines: Story = {
  name: 'Text — multiple lines',
  render: () => (
    <Stack>
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="75%" />
      <Skeleton variant="text" width="60%" />
    </Stack>
  ),
};

export const Rect: Story = {
  name: 'Rect — card placeholder',
  render: () => (
    <Stack>
      <Skeleton variant="rect" height="160px" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" />
    </Stack>
  ),
};

export const Circle: Story = {
  name: 'Circle — avatar placeholder',
  render: () => (
    <Row>
      <Skeleton variant="circle" width="32px" height="32px" />
      <Skeleton variant="circle" width="40px" height="40px" />
      <Skeleton variant="circle" width="56px" height="56px" />
      <Skeleton variant="circle" width="80px" height="80px" />
    </Row>
  ),
};

export const ProfileCard: Story = {
  name: 'Composed — profile card',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--eidra-gap-4)',
        alignItems: 'flex-start',
        padding: 'var(--eidra-gap-5)',
        background: 'var(--eidra-surface)',
        borderRadius: 'var(--eidra-radius-lg)',
        border: '1px solid var(--eidra-border)',
        width: '360px',
      }}
    >
      <Skeleton variant="circle" width="48px" height="48px" />
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-2)' }}
      >
        <Skeleton variant="text" width="55%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  ),
};

export const ArticleCard: Story = {
  name: 'Composed — article card',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-gap-3)',
        padding: 'var(--eidra-gap-5)',
        background: 'var(--eidra-surface)',
        borderRadius: 'var(--eidra-radius-lg)',
        border: '1px solid var(--eidra-border)',
        width: '360px',
      }}
    >
      <Skeleton variant="rect" height="180px" radius="var(--eidra-radius-md)" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="65%" />
      <Skeleton variant="text" width="50%" />
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Rect — size range',
  render: () => (
    <Stack>
      <Skeleton variant="rect" height="var(--eidra-size-control-sm)" />
      <Skeleton variant="rect" height="var(--eidra-size-control-md)" />
      <Skeleton variant="rect" height="var(--eidra-size-control-lg)" />
    </Stack>
  ),
};

export const CustomRadius: Story = {
  name: 'Rect — custom radius',
  render: () => (
    <Stack>
      <Skeleton variant="rect" height="64px" radius="var(--eidra-radius-none)" />
      <Skeleton variant="rect" height="64px" radius="var(--eidra-radius-sm)" />
      <Skeleton variant="rect" height="64px" radius="var(--eidra-radius-xl)" />
      <Skeleton variant="rect" height="64px" radius="var(--eidra-radius-full)" />
    </Stack>
  ),
};
