import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Building2, Calendar, Users } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Button } from '../Button/Button.js';
import { Card } from './Card.js';

const meta = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  args: { variant: 'elevated' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['elevated', 'outline', 'subtle'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const Col = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)', maxWidth: 380 }}>
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 'var(--eidra-space-4)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
    {children}
  </div>
);

/** Interactive playground — use the controls panel to explore props. */
export const Playground: Story = {
  args: { padding: 'md' },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 380 }}>
      <p style={{ margin: 0, color: 'var(--eidra-fg)' }}>Card content renders here.</p>
    </Card>
  ),
};

/** All three visual variants side by side. */
export const Variants: Story = {
  render: (args) => (
    <Row>
      <Card {...args} variant="elevated" style={{ width: 240 }}>
        <Card.Header>Elevated</Card.Header>
        <Card.Body>Raised surface with a subtle shadow — the default card style.</Card.Body>
      </Card>
      <Card {...args} variant="outline" style={{ width: 240 }}>
        <Card.Header>Outline</Card.Header>
        <Card.Body>Defined by a 1 px border with no shadow — works well on tinted backgrounds.</Card.Body>
      </Card>
      <Card {...args} variant="subtle" style={{ width: 240 }}>
        <Card.Header>Subtle</Card.Header>
        <Card.Body>Muted fill with a faint border — ideal for secondary content areas.</Card.Body>
      </Card>
    </Row>
  ),
};

/** Header, Body, and Footer subcomponents. */
export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 400 }}>
      <Card.Header>Project Alpha</Card.Header>
      <Card.Body>
        Full-stack modernisation for a Nordic enterprise client. Migrating legacy services to a
        cloud-native architecture.
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm" endIcon={<Icon icon={ArrowRight} />}>
          View details
        </Button>
      </Card.Footer>
    </Card>
  ),
};

/** A realistic consultancy project summary card. */
export const ProjectCard: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 420 }}>
      <Card.Header>
        <Icon icon={Building2} />
        Eidra Platform Redesign
      </Card.Header>
      <Card.Body>
        <p style={{ margin: '0 0 var(--eidra-space-3)' }}>
          Redesigning the client-facing portal to align with the new brand and improve task
          completion rates across onboarding flows.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--eidra-space-4)',
            fontSize: 'var(--eidra-font-size-xs)',
            color: 'var(--eidra-fg-subtle)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-1)' }}>
            <Icon icon={Calendar} />
            Q3 2026
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-1)' }}>
            <Icon icon={Users} />
            4 consultants
          </span>
        </div>
      </Card.Body>
      <Card.Footer style={{ justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm">Edit</Button>
        <Button size="sm" endIcon={<Icon icon={ArrowRight} />}>Open project</Button>
      </Card.Footer>
    </Card>
  ),
};

/** Cards with uniform padding applied to the root (no subcomponents). */
export const FlatPadding: Story = {
  render: (args) => (
    <Row>
      {(['sm', 'md', 'lg'] as const).map((p) => (
        <Card key={p} {...args} padding={p} style={{ width: 200 }}>
          <p style={{ margin: 0, fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg)' }}>
            padding="{p}"
          </p>
        </Card>
      ))}
    </Row>
  ),
};

/** Cards in a responsive grid layout — a common usage pattern. */
export const CardGrid: Story = {
  render: (args) => {
    const projects = [
      { title: 'Data Platform', desc: 'Real-time analytics pipeline for a retail client.' },
      { title: 'UX Audit', desc: 'Accessibility and usability review across 12 key journeys.' },
      { title: 'API Gateway', desc: 'Centralised gateway reducing integration complexity by 40 %.' },
    ];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--eidra-space-4)',
        }}
      >
        {projects.map((p) => (
          <Card key={p.title} {...args}>
            <Card.Header>{p.title}</Card.Header>
            <Card.Body>{p.desc}</Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm" endIcon={<Icon icon={ArrowRight} />}>
                Read more
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    );
  },
};

/** Header and body only — no footer divider. */
export const NoFooter: Story = {
  render: (args) => (
    <Col>
      <Card {...args} variant="outline" style={{ maxWidth: 360 }}>
        <Card.Header>Team Update</Card.Header>
        <Card.Body>
          Three new consultants joined the Oslo office this week. Onboarding sessions scheduled for
          Monday.
        </Card.Body>
      </Card>
    </Col>
  ),
};
