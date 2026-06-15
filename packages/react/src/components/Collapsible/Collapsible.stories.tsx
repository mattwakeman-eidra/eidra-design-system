import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Users, FileText, Settings } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Collapsible } from './Collapsible.js';

const meta = {
  title: 'Layout/Collapsible',
  component: Collapsible.Root,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
    disabled: false,
  },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Collapsible.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Collapsible.Root {...args}>
        <Collapsible.Trigger>Team overview</Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)', lineHeight: 'var(--eidra-font-line-height-normal)' }}>
              Eidra is a Nordic consultancy helping organisations navigate complexity through
              strategic design and engineering expertise.
            </p>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

// ─── Default closed ────────────────────────────────────────────────────────────

export const DefaultClosed: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Collapsible.Root>
        <Collapsible.Trigger>Project details</Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)' }}>
              This section expands to reveal additional project information when toggled.
            </p>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

// ─── Default open ──────────────────────────────────────────────────────────────

export const DefaultOpen: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Engagement scope</Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)' }}>
              Discovery and research, service design, digital product development, and
              organisational capability building across eight practice areas.
            </p>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Collapsible.Root disabled>
        <Collapsible.Trigger>Restricted section</Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <p style={{ margin: 0 }}>This content is not accessible.</p>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

// ─── Stacked FAQ ──────────────────────────────────────────────────────────────

const faqs = [
  {
    id: 'faq-1',
    question: 'What services does Eidra offer?',
    answer:
      'Eidra provides strategic consulting, digital product design, systems thinking, and engineering services for public and private sector organisations across the Nordics.',
  },
  {
    id: 'faq-2',
    question: 'How do engagements typically begin?',
    answer:
      'We start with a scoping workshop to align on goals, constraints, and success metrics. Most engagements move into a discovery phase within two weeks of the kickoff.',
  },
  {
    id: 'faq-3',
    question: 'Can Eidra embed within existing teams?',
    answer:
      'Yes. We offer both fully embedded and advisory models. Our consultants are experienced working inside client organisations and adapting to existing ways of working.',
  },
];

export const FAQ: Story = {
  render: () => (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)' }}>
      {faqs.map((item) => (
        <Collapsible.Root key={item.id}>
          <Collapsible.Trigger>{item.question}</Collapsible.Trigger>
          <Collapsible.Panel>
            <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
              <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)', lineHeight: 'var(--eidra-font-line-height-relaxed)' }}>
                {item.answer}
              </p>
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      ))}
    </div>
  ),
};

// ─── With icon in trigger ──────────────────────────────────────────────────────

export const WithIconInTrigger: Story = {
  render: () => (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)' }}>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
            <Icon icon={Users} size="sm" />
            Team members
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1-5)' }}>
              {['Astrid Lindqvist', 'Erik Holmberg', 'Maja Sundström'].map((name) => (
                <li key={name} style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)' }}>{name}</li>
              ))}
            </ul>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>

      <Collapsible.Root>
        <Collapsible.Trigger>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
            <Icon icon={FileText} size="sm" />
            Documents
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)' }}>
              No documents attached yet.
            </p>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>

      <Collapsible.Root disabled>
        <Collapsible.Trigger>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
            <Icon icon={Settings} size="sm" />
            Advanced settings
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
            <p style={{ margin: 0 }}>Advanced settings are locked.</p>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: function ControlledCollapsible() {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
        <p style={{ margin: 0, fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)' }}>
          Panel is: <strong style={{ color: 'var(--eidra-fg)' }}>{open ? 'open' : 'closed'}</strong>
        </p>
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger>Controlled collapsible</Collapsible.Trigger>
          <Collapsible.Panel>
            <div style={{ padding: 'var(--eidra-space-4) var(--eidra-space-5)', paddingTop: 0 }}>
              <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)' }}>
                The open state is managed externally by the parent component.
              </p>
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      </div>
    );
  },
};
