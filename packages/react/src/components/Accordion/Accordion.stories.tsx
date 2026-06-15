import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion.js';

const meta = {
  title: 'Layout/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AccordionItem({
  value,
  heading,
  children,
  disabled,
}: {
  value: string;
  heading: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Accordion.Item value={value} disabled={disabled}>
      <Accordion.Header>
        <Accordion.Trigger>{heading}</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>{children}</Accordion.Panel>
    </Accordion.Item>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root {...args}>
        <AccordionItem value="approach" heading="Our Approach">
          At Eidra we combine Nordic clarity with strategic depth — turning
          complex challenges into elegant, scalable solutions that endure.
        </AccordionItem>
        <AccordionItem value="services" heading="Services">
          From digital strategy and service design to software architecture and
          delivery, we partner with organisations across their full transformation journey.
        </AccordionItem>
        <AccordionItem value="locations" heading="Locations">
          Headquartered in Stockholm, with studios in Oslo, Helsinki, and
          Copenhagen — always close to where the work happens.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root defaultValue={['services']}>
        <AccordionItem value="approach" heading="Our Approach">
          Strategy rooted in real-world constraints and a bias toward action.
        </AccordionItem>
        <AccordionItem value="services" heading="Services">
          Strategy · Service Design · Software Engineering · Data & AI.
        </AccordionItem>
        <AccordionItem value="locations" heading="Locations">
          Stockholm · Oslo · Helsinki · Copenhagen.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
};

export const SingleOpen: Story = {
  name: 'Single item open (exclusive)',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root multiple={false}>
        <AccordionItem value="q1" heading="What is Eidra?">
          Eidra is a Nordic digital consultancy that helps organisations navigate
          transformation — from strategy through delivery.
        </AccordionItem>
        <AccordionItem value="q2" heading="Who do you work with?">
          We partner with ambitious organisations in financial services,
          healthcare, public sector, and consumer markets.
        </AccordionItem>
        <AccordionItem value="q3" heading="How do I get in touch?">
          Reach us at hello@eidra.com or through the contact form on our website.
          We typically respond within one business day.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root>
        <AccordionItem value="open" heading="Available now">
          This section is fully interactive and ready to explore.
        </AccordionItem>
        <AccordionItem value="disabled" heading="Coming soon" disabled>
          This capability is in development and will be available in a future release.
        </AccordionItem>
        <AccordionItem value="another" heading="Also available">
          Another section with content that can be expanded and collapsed.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
};

export const FAQ: Story = {
  name: 'FAQ pattern',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <h2
        style={{
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-xl)',
          fontWeight: 'var(--eidra-font-weight-semibold)',
          color: 'var(--eidra-fg)',
          marginBottom: 'var(--eidra-space-6)',
        }}
      >
        Frequently Asked Questions
      </h2>
      <Accordion.Root multiple={false}>
        <AccordionItem value="process" heading="What does an engagement look like?">
          We begin with a focused discovery phase to align on outcomes and
          constraints. From there we move into iterative design and delivery
          cycles — always working in the open with your team.
        </AccordionItem>
        <AccordionItem value="duration" heading="How long do engagements typically run?">
          Most projects run between three and twelve months. We size the team and
          timeline to your ambition and the complexity of the challenge, not the
          other way around.
        </AccordionItem>
        <AccordionItem value="remote" heading="Do you work remotely?">
          Yes — our teams are distributed across the Nordics and work effectively
          both remotely and on-site. We adapt to whatever rhythm suits your
          organisation.
        </AccordionItem>
        <AccordionItem value="pricing" heading="How is pricing structured?">
          We offer both time-and-materials and fixed-scope engagements depending
          on the nature of the work. We&apos;re transparent about costs and scope
          from day one.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
};
