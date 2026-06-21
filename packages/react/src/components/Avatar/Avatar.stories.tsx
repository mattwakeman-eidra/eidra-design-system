import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Avatar } from './Avatar.js';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar.Root,
  subcomponents: {
    'Avatar.Image': Avatar.Image,
    'Avatar.Fallback': Avatar.Fallback,
  },
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: 'flex', gap: 'var(--eidra-gap-3)', alignItems: 'center', flexWrap: 'wrap' }}
  >
    {children}
  </div>
);

/** Interactive playground — tweak props in the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Image src="https://i.pravatar.cc/150?u=astrid" alt="Astrid Lindqvist" />
      <Avatar.Fallback>AL</Avatar.Fallback>
    </Avatar.Root>
  ),
};

/** Three sizes used throughout the Eidra UI. */
export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Avatar.Root {...args} size="sm">
        <Avatar.Image src="https://i.pravatar.cc/150?u=bjorn" alt="Björn Eriksson" />
        <Avatar.Fallback>BE</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root {...args} size="md">
        <Avatar.Image src="https://i.pravatar.cc/150?u=maja" alt="Maja Nilsson" />
        <Avatar.Fallback>MN</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root {...args} size="lg">
        <Avatar.Image src="https://i.pravatar.cc/150?u=leif" alt="Leif Johansson" />
        <Avatar.Fallback>LJ</Avatar.Fallback>
      </Avatar.Root>
    </Row>
  ),
};

/** Fallback rendered when the image URL is missing or fails to load. */
export const FallbackInitials: Story = {
  render: (args) => (
    <Row>
      <Avatar.Root {...args} size="sm">
        <Avatar.Fallback>KS</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root {...args} size="md">
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root {...args} size="lg">
        <Avatar.Fallback>EP</Avatar.Fallback>
      </Avatar.Root>
    </Row>
  ),
};

/** Icon fallback — useful when no name is available. */
export const FallbackIcon: Story = {
  render: (args) => (
    <Row>
      <Avatar.Root {...args} size="sm">
        <Avatar.Fallback>
          <Icon icon={User} size="sm" />
        </Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root {...args} size="md">
        <Avatar.Fallback>
          <Icon icon={User} size="md" />
        </Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root {...args} size="lg">
        <Avatar.Fallback>
          <Icon icon={User} size="lg" />
        </Avatar.Fallback>
      </Avatar.Root>
    </Row>
  ),
};

/** Broken image src — should fall back gracefully. */
export const BrokenImage: Story = {
  render: (args) => (
    <Row>
      <Avatar.Root {...args} size="md">
        <Avatar.Image src="https://example.invalid/no-photo.jpg" alt="Sigrid Berg" />
        <Avatar.Fallback>SB</Avatar.Fallback>
      </Avatar.Root>
    </Row>
  ),
};

/** A group of overlapping avatars — typical for team member lists. */
export const AvatarGroup: Story = {
  render: (args) => {
    const members = [
      { src: 'https://i.pravatar.cc/150?u=anna', initials: 'AK', name: 'Anna Karlsson' },
      { src: 'https://i.pravatar.cc/150?u=erik', initials: 'EL', name: 'Erik Larsson' },
      { src: 'https://i.pravatar.cc/150?u=sofia', initials: 'SH', name: 'Sofia Holm' },
      { src: 'https://i.pravatar.cc/150?u=david', initials: 'DN', name: 'David Norén' },
    ];
    return (
      <div
        style={
          {
            display: 'flex',
            // overlap avatars slightly
            '--overlap': '-8px',
          } as React.CSSProperties
        }
      >
        {members.map((m, i) => (
          <Avatar.Root
            key={m.initials}
            {...args}
            size="md"
            style={
              {
                marginLeft: i === 0 ? 0 : 'var(--overlap, -8px)',
                boxShadow: '0 0 0 2px var(--eidra-bg)',
              } as React.CSSProperties
            }
          >
            <Avatar.Image src={m.src} alt={m.name} />
            <Avatar.Fallback>{m.initials}</Avatar.Fallback>
          </Avatar.Root>
        ))}
        <Avatar.Root
          {...args}
          size="md"
          style={
            {
              marginLeft: 'var(--overlap, -8px)',
              boxShadow: '0 0 0 2px var(--eidra-bg)',
              backgroundColor: 'var(--eidra-bg-muted)',
              color: 'var(--eidra-fg-muted)',
            } as React.CSSProperties
          }
        >
          <Avatar.Fallback>+3</Avatar.Fallback>
        </Avatar.Root>
      </div>
    );
  },
};
