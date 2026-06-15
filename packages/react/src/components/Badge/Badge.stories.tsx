import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge.js';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge', tone: 'neutral', variant: 'subtle', size: 'md' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'coral', 'success', 'danger', 'warning', 'info'],
    },
    variant: { control: 'inline-radio', options: ['solid', 'subtle', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 'var(--eidra-space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)' }}>
    <span style={{ fontSize: 'var(--eidra-font-size-xs)', color: 'var(--eidra-fg-muted)', fontFamily: 'var(--eidra-font-family-sans)' }}>
      {label}
    </span>
    {children}
  </div>
);

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Row>
      <Badge {...args} tone="neutral">Neutral</Badge>
      <Badge {...args} tone="accent">Accent</Badge>
      <Badge {...args} tone="coral">Coral</Badge>
      <Badge {...args} tone="success">Success</Badge>
      <Badge {...args} tone="danger">Danger</Badge>
      <Badge {...args} tone="warning">Warning</Badge>
      <Badge {...args} tone="info">Info</Badge>
    </Row>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <Section label="Subtle">
        <Row>
          <Badge {...args} variant="subtle" tone="neutral">Neutral</Badge>
          <Badge {...args} variant="subtle" tone="accent">Accent</Badge>
          <Badge {...args} variant="subtle" tone="coral">Coral</Badge>
          <Badge {...args} variant="subtle" tone="success">Success</Badge>
          <Badge {...args} variant="subtle" tone="danger">Danger</Badge>
          <Badge {...args} variant="subtle" tone="warning">Warning</Badge>
          <Badge {...args} variant="subtle" tone="info">Info</Badge>
        </Row>
      </Section>
      <Section label="Solid">
        <Row>
          <Badge {...args} variant="solid" tone="neutral">Neutral</Badge>
          <Badge {...args} variant="solid" tone="accent">Accent</Badge>
          <Badge {...args} variant="solid" tone="coral">Coral</Badge>
          <Badge {...args} variant="solid" tone="success">Success</Badge>
          <Badge {...args} variant="solid" tone="danger">Danger</Badge>
          <Badge {...args} variant="solid" tone="warning">Warning</Badge>
          <Badge {...args} variant="solid" tone="info">Info</Badge>
        </Row>
      </Section>
      <Section label="Outline">
        <Row>
          <Badge {...args} variant="outline" tone="neutral">Neutral</Badge>
          <Badge {...args} variant="outline" tone="accent">Accent</Badge>
          <Badge {...args} variant="outline" tone="coral">Coral</Badge>
          <Badge {...args} variant="outline" tone="success">Success</Badge>
          <Badge {...args} variant="outline" tone="danger">Danger</Badge>
          <Badge {...args} variant="outline" tone="warning">Warning</Badge>
          <Badge {...args} variant="outline" tone="info">Info</Badge>
        </Row>
      </Section>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
    </Row>
  ),
};

/** Realistic usage in a Nordic consultancy context: project statuses, contract states, role tags. */
export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <Section label="Project status">
        <Row>
          <Badge tone="info" variant="subtle">In review</Badge>
          <Badge tone="accent" variant="subtle">Active</Badge>
          <Badge tone="success" variant="subtle">Delivered</Badge>
          <Badge tone="warning" variant="subtle">At risk</Badge>
          <Badge tone="danger" variant="subtle">Overdue</Badge>
          <Badge tone="neutral" variant="subtle">Archived</Badge>
        </Row>
      </Section>
      <Section label="Contract type">
        <Row>
          <Badge tone="accent" variant="solid">Fixed price</Badge>
          <Badge tone="coral" variant="solid">Time & materials</Badge>
          <Badge tone="neutral" variant="outline">Retainer</Badge>
        </Row>
      </Section>
      <Section label="Role labels">
        <Row>
          <Badge tone="info" variant="outline">Senior consultant</Badge>
          <Badge tone="neutral" variant="outline">Analyst</Badge>
          <Badge tone="accent" variant="outline">Lead</Badge>
        </Row>
      </Section>
    </div>
  ),
};
