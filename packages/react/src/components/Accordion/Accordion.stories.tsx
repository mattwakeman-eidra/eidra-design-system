import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Accordion } from './Accordion.js';
import type { AccordionValue } from './Accordion.js';

const meta = {
  title: 'Layout/Accordion',
  component: Accordion.Root,
  subcomponents: {
    'Accordion.Item': Accordion.Item,
    'Accordion.Header': Accordion.Header,
    'Accordion.Trigger': Accordion.Trigger,
    'Accordion.Panel': Accordion.Panel,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Ignore user interaction across the whole accordion (triggers grey out).',
    },
    // `disabled` is the only Root prop with an immediate visual effect. The others
    // (multiple, orientation, loopFocus, keepMounted, hiddenUntilFound) only change
    // interaction/keyboard/DOM behaviour with no static visual change, so they're
    // left off the controls panel rather than shown as knobs that do nothing.
    // `multiple` is demonstrated by the Multiple / "Single item open" stories below.
  },
  args: {
    disabled: false,
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

/**
 * Toggle **disabled** to grey out and lock the whole accordion. One panel is open
 * by default. (No auto-running interaction here — the assertion-driven behaviours,
 * including single-vs-multiple open, live in the dedicated stories below.)
 */
export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root defaultValue={['approach']} {...args}>
        <AccordionItem value="approach" heading="Our Approach">
          At Eidra we combine Nordic clarity with strategic depth — turning complex challenges into
          elegant, scalable solutions that endure.
        </AccordionItem>
        <AccordionItem value="services" heading="Services">
          From digital strategy and service design to software architecture and delivery, we partner
          with organisations across their full transformation journey.
        </AccordionItem>
        <AccordionItem value="locations" heading="Locations">
          Headquartered in Stockholm, with studios in Oslo, Helsinki, and Copenhagen — always close
          to where the work happens.
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
  // defaultValue seeds the uncontrolled open-state, then the host stops tracking it.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const services = canvas.getByRole('button', { name: /^services/i });
    const approach = canvas.getByRole('button', { name: /our approach/i });

    await step('the defaultValue item starts open, others closed', async () => {
      await expect(services).toHaveAttribute('aria-expanded', 'true');
      await expect(approach).toHaveAttribute('aria-expanded', 'false');
    });

    await step('the seeded item can be collapsed by the user', async () => {
      await userEvent.click(services);
      await expect(services).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

export const SingleOpen: Story = {
  name: 'Single item open (exclusive)',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root multiple={false}>
        <AccordionItem value="q1" heading="What is Eidra?">
          Eidra is a Nordic digital consultancy that helps organisations navigate transformation —
          from strategy through delivery.
        </AccordionItem>
        <AccordionItem value="q2" heading="Who do you work with?">
          We partner with ambitious organisations in financial services, healthcare, public sector,
          and consumer markets.
        </AccordionItem>
        <AccordionItem value="q3" heading="How do I get in touch?">
          Reach us at hello@eidra.com or through the contact form on our website. We typically
          respond within one business day.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
  // Keyboard: roving focus across triggers (arrows/Home/End) and toggle via Enter/Space.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const q1 = canvas.getByRole('button', { name: /what is eidra/i });
    const q2 = canvas.getByRole('button', { name: /who do you work with/i });
    const q3 = canvas.getByRole('button', { name: /how do i get in touch/i });

    await step('ArrowDown moves roving focus to the next trigger', async () => {
      q1.focus();
      await expect(q1).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(q2).toHaveFocus();
    });

    await step('ArrowUp moves focus back to the previous trigger', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(q1).toHaveFocus();
    });

    await step('End jumps focus to the last trigger, Home to the first', async () => {
      await userEvent.keyboard('{End}');
      await expect(q3).toHaveFocus();
      await userEvent.keyboard('{Home}');
      await expect(q1).toHaveFocus();
    });

    await step('Enter toggles the focused panel open', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(q1).toHaveAttribute('aria-expanded', 'true');
    });

    await step('Space on another trigger opens it and closes the first', async () => {
      q2.focus();
      await userEvent.keyboard(' ');
      await expect(q2).toHaveAttribute('aria-expanded', 'true');
      await expect(q1).toHaveAttribute('aria-expanded', 'false');
    });
  },
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
  // A disabled item carries data-disabled and ignores activation.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByRole('button', { name: /coming soon/i });

    await step('the disabled trigger is marked disabled', async () => {
      await expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await expect(disabled).toHaveAttribute('data-disabled');
    });

    await step('clicking the disabled trigger does not expand it', async () => {
      await userEvent.click(disabled);
      await expect(disabled).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

/**
 * **Multiple open.** With `multiple`, several panels can be expanded at once —
 * opening one no longer collapses the others.
 */
export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Accordion.Root multiple defaultValue={['approach']}>
        <AccordionItem value="approach" heading="Our Approach">
          Nordic clarity with strategic depth.
        </AccordionItem>
        <AccordionItem value="services" heading="Services">
          Strategy · Service Design · Engineering.
        </AccordionItem>
        <AccordionItem value="locations" heading="Locations">
          Stockholm · Oslo · Helsinki · Copenhagen.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const approach = canvas.getByRole('button', { name: /our approach/i });
    const services = canvas.getByRole('button', { name: /^services/i });

    await step('a seeded panel is open while a second is opened', async () => {
      await expect(approach).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(services);
      await expect(services).toHaveAttribute('aria-expanded', 'true');
      // The first stays open — multiple panels coexist.
      await expect(approach).toHaveAttribute('aria-expanded', 'true');
    });

    await step('panels close independently', async () => {
      await userEvent.click(approach);
      await expect(approach).toHaveAttribute('aria-expanded', 'false');
      await expect(services).toHaveAttribute('aria-expanded', 'true');
    });
  },
};

/**
 * **Controlled.** The host owns the open-state via `value`; the accordion only
 * reports changes through `onValueChange`.
 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  args: {
    onValueChange: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState<AccordionValue>(['services']);
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)', maxWidth: 640 }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Open: <strong style={{ color: 'var(--eidra-fg)' }}>{value.join(', ') || '—'}</strong>
        </p>
        <Accordion.Root
          value={value}
          onValueChange={(next, details) => {
            setValue(next);
            args.onValueChange?.(next, details);
          }}
        >
          <AccordionItem value="approach" heading="Our Approach">
            Nordic clarity with strategic depth.
          </AccordionItem>
          <AccordionItem value="services" heading="Services">
            Strategy · Service Design · Engineering.
          </AccordionItem>
          <AccordionItem value="locations" heading="Locations">
            Stockholm · Oslo · Helsinki · Copenhagen.
          </AccordionItem>
        </Accordion.Root>
      </div>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const approach = canvas.getByRole('button', { name: /our approach/i });
    const services = canvas.getByRole('button', { name: /^services/i });

    await step('the controlled value drives which panel is open', async () => {
      await expect(services).toHaveAttribute('aria-expanded', 'true');
      await expect(approach).toHaveAttribute('aria-expanded', 'false');
    });

    await step('clicking fires onValueChange with the new value', async () => {
      await userEvent.click(approach);
      await expect(args.onValueChange).toHaveBeenCalled();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(['approach'], expect.anything());
    });

    await step('the host applies the change and the panel opens', async () => {
      await expect(approach).toHaveAttribute('aria-expanded', 'true');
      await expect(services).toHaveAttribute('aria-expanded', 'false');
    });
  },
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
          We begin with a focused discovery phase to align on outcomes and constraints. From there
          we move into iterative design and delivery cycles — always working in the open with your
          team.
        </AccordionItem>
        <AccordionItem value="duration" heading="How long do engagements typically run?">
          Most projects run between three and twelve months. We size the team and timeline to your
          ambition and the complexity of the challenge, not the other way around.
        </AccordionItem>
        <AccordionItem value="remote" heading="Do you work remotely?">
          Yes — our teams are distributed across the Nordics and work effectively both remotely and
          on-site. We adapt to whatever rhythm suits your organisation.
        </AccordionItem>
        <AccordionItem value="pricing" heading="How is pricing structured?">
          We offer both time-and-materials and fixed-scope engagements depending on the nature of
          the work. We&apos;re transparent about costs and scope from day one.
        </AccordionItem>
      </Accordion.Root>
    </div>
  ),
};
