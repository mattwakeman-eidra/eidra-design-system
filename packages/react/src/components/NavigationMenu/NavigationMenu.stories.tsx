import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Globe, Building2, Users, FileText, Lightbulb, Phone } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { NavigationMenu } from './NavigationMenu.js';

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu.Root,
  subcomponents: {
    'NavigationMenu.List': NavigationMenu.List,
    'NavigationMenu.Item': NavigationMenu.Item,
    'NavigationMenu.Trigger': NavigationMenu.Trigger,
    'NavigationMenu.Icon': NavigationMenu.Icon,
    'NavigationMenu.Portal': NavigationMenu.Portal,
    'NavigationMenu.Positioner': NavigationMenu.Positioner,
    'NavigationMenu.Viewport': NavigationMenu.Viewport,
    'NavigationMenu.Popup': NavigationMenu.Popup,
    'NavigationMenu.Content': NavigationMenu.Content,
    'NavigationMenu.Arrow': NavigationMenu.Arrow,
    'NavigationMenu.Backdrop': NavigationMenu.Backdrop,
    'NavigationMenu.Link': NavigationMenu.Link,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  // All controls dropped (none produce a visible change on the Playground):
  // `orientation` has no direction/layout rule in the CSS module (the Vertical
  // story sets layout via inline styles, not this prop); `delay`/`closeDelay`
  // are pure open/close timing.
} satisfies Meta<typeof NavigationMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--eidra-space-3) var(--eidra-space-6)',
        borderBottom: '1px solid var(--eidra-border)',
        background: 'var(--eidra-surface)',
        minHeight: '64px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-md)',
          fontWeight: 'var(--eidra-font-weight-bold)',
          color: 'var(--eidra-fg)',
        }}
      >
        Eidra
      </span>
      {children}
    </nav>
  );
}

interface ContentGridProps {
  items: Array<{ icon: React.ComponentType; label: string; description: string }>;
}

function ContentGrid({ items }: ContentGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--eidra-space-2)',
        minWidth: '420px',
        padding: 'var(--eidra-space-2)',
      }}
    >
      {items.map((item) => (
        <NavigationMenu.Link
          key={item.label}
          href="#"
          style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--eidra-space-1)' }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--eidra-space-2)',
              fontWeight: 'var(--eidra-font-weight-semibold)',
            }}
          >
            <Icon icon={item.icon} size={16} />
            {item.label}
          </span>
          <span
            style={{
              fontSize: 'var(--eidra-font-size-xs)',
              color: 'var(--eidra-fg-muted)',
              fontWeight: 'var(--eidra-font-weight-regular)',
            }}
          >
            {item.description}
          </span>
        </NavigationMenu.Link>
      ))}
    </div>
  );
}

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <NavWrapper>
      <NavigationMenu.Root {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>
              Services
              <NavigationMenu.Icon>
                <Icon icon={ChevronDown} size={14} />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8}>
                <NavigationMenu.Popup>
                  <NavigationMenu.Viewport>
                    <NavigationMenu.Content>
                      <ContentGrid
                        items={[
                          {
                            icon: Building2,
                            label: 'Strategy',
                            description: 'Transform your business model',
                          },
                          {
                            icon: Lightbulb,
                            label: 'Innovation',
                            description: 'Design for the future',
                          },
                          {
                            icon: Globe,
                            label: 'Digital',
                            description: 'Cloud & digital transformation',
                          },
                          {
                            icon: Users,
                            label: 'Talent',
                            description: 'Organisational development',
                          },
                        ]}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Viewport>
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>
              About
              <NavigationMenu.Icon>
                <Icon icon={ChevronDown} size={14} />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8}>
                <NavigationMenu.Popup>
                  <NavigationMenu.Viewport>
                    <NavigationMenu.Content>
                      <ContentGrid
                        items={[
                          {
                            icon: Building2,
                            label: 'Our Story',
                            description: 'Nordic roots, global reach',
                          },
                          {
                            icon: Users,
                            label: 'Team',
                            description: 'Meet the people behind Eidra',
                          },
                          {
                            icon: FileText,
                            label: 'Insights',
                            description: 'Research & thought leadership',
                          },
                          {
                            icon: Phone,
                            label: 'Contact',
                            description: 'Get in touch with us',
                          },
                        ]}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Viewport>
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" active>
              Case Studies
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Careers</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </NavWrapper>
  ),
  // Hovering a trigger opens its flyout (portaled to body); the trigger reflects
  // open state via aria-expanded, and Escape dismisses the popup.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const services = canvas.getByRole('button', { name: /services/i });

    await step('hovering a trigger opens its flyout panel', async () => {
      await expect(services).toHaveAttribute('aria-expanded', 'false');
      await userEvent.hover(services);
      // The flyout content is portaled outside canvasElement → query via screen.
      const strategy = await screen.findByRole('link', { name: /strategy/i });
      await waitFor(() => expect(strategy).toBeVisible());
      await waitFor(() => expect(services).toHaveAttribute('aria-expanded', 'true'));
    });

    await step('Escape closes the open flyout', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('link', { name: /strategy/i })).toBeNull(),
      );
      await expect(services).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

// ─── Single Item ──────────────────────────────────────────────────────────────

export const SingleDropdown: Story = {
  render: () => (
    <div style={{ padding: 'var(--eidra-space-4)' }}>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>
              Solutions
              <NavigationMenu.Icon>
                <Icon icon={ChevronDown} size={14} />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8}>
                <NavigationMenu.Popup>
                  <NavigationMenu.Viewport>
                    <NavigationMenu.Content>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--eidra-space-1)',
                          minWidth: '200px',
                          padding: 'var(--eidra-space-2)',
                        }}
                      >
                        <NavigationMenu.Link href="#">Nordic Consulting</NavigationMenu.Link>
                        <NavigationMenu.Link href="#" active>
                          Digital Transformation
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href="#">Organisational Design</NavigationMenu.Link>
                        <NavigationMenu.Link href="#">Sustainability</NavigationMenu.Link>
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Viewport>
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  ),
  // Clicking a trigger (not just hovering) toggles the flyout open and closed.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /solutions/i });

    await step('click opens the flyout', async () => {
      await userEvent.click(trigger);
      const link = await screen.findByRole('link', { name: /digital transformation/i });
      await waitFor(() => expect(link).toBeVisible());
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    });

    await step('clicking the trigger again closes it', async () => {
      await userEvent.click(trigger);
      await waitFor(() =>
        expect(screen.queryByRole('link', { name: /digital transformation/i })).toBeNull(),
      );
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

// ─── Controlled open item ───────────────────────────────────────────────────────

/**
 * **Controlled.** The host owns which item is open via `value` and is notified of
 * every change through `onValueChange`. Each `Item` carries an explicit `value` so
 * the controlled state is stable.
 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  args: {
    // Spied on so the play function can assert the callback fires with the item value.
    onValueChange: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)', padding: 'var(--eidra-space-4)' }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Open item:{' '}
          <strong style={{ color: 'var(--eidra-fg)' }}>{value ?? 'none'}</strong>
        </p>
        <NavWrapper>
          <NavigationMenu.Root
            value={value}
            onValueChange={(next, details) => {
              setValue(next as string | null);
              args.onValueChange?.(next, details);
            }}
          >
            <NavigationMenu.List>
              <NavigationMenu.Item value="services">
                <NavigationMenu.Trigger>
                  Services
                  <NavigationMenu.Icon>
                    <Icon icon={ChevronDown} size={14} />
                  </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
                <NavigationMenu.Portal>
                  <NavigationMenu.Positioner sideOffset={8}>
                    <NavigationMenu.Popup>
                      <NavigationMenu.Viewport>
                        <NavigationMenu.Content>
                          <div style={{ padding: 'var(--eidra-space-2)', minWidth: '200px' }}>
                            <NavigationMenu.Link href="#">Strategy</NavigationMenu.Link>
                          </div>
                        </NavigationMenu.Content>
                      </NavigationMenu.Viewport>
                    </NavigationMenu.Popup>
                  </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </NavWrapper>
      </div>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /services/i });

    await step('opening the trigger reports the item value via onValueChange', async () => {
      await userEvent.click(trigger);
      const strategy = await screen.findByRole('link', { name: /strategy/i });
      await waitFor(() => expect(strategy).toBeVisible());
      await waitFor(() => expect(args.onValueChange).toHaveBeenCalled());
      await expect(args.onValueChange).toHaveBeenLastCalledWith('services', expect.anything());
      // The host-owned state rendered the open value.
      await expect(canvas.getByText('services')).toBeInTheDocument();
    });

    await step('closing reports a null value', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('link', { name: /strategy/i })).toBeNull(),
      );
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
    });
  },
};

// ─── Uncontrolled (defaultValue) ────────────────────────────────────────────────

/**
 * **Uncontrolled with `defaultValue`.** The menu manages its own open state but
 * starts with the "Services" item open. Base UI keeps ownership after the initial
 * render — Escape closes it without any host wiring.
 */
export const DefaultOpen: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <NavWrapper>
      <NavigationMenu.Root defaultValue="services">
        <NavigationMenu.List>
          <NavigationMenu.Item value="services">
            <NavigationMenu.Trigger>
              Services
              <NavigationMenu.Icon>
                <Icon icon={ChevronDown} size={14} />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8}>
                <NavigationMenu.Popup>
                  <NavigationMenu.Viewport>
                    <NavigationMenu.Content>
                      <div style={{ padding: 'var(--eidra-space-2)', minWidth: '200px' }}>
                        <NavigationMenu.Link href="#">Strategy</NavigationMenu.Link>
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Viewport>
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </NavWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /services/i });

    await step('the defaultValue item is open on first render', async () => {
      const strategy = await screen.findByRole('link', { name: /strategy/i });
      await waitFor(() => expect(strategy).toBeVisible());
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    });

    await step('Escape closes the uncontrolled menu', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('link', { name: /strategy/i })).toBeNull(),
      );
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

// ─── With Active Link ─────────────────────────────────────────────────────────

export const WithActiveLink: Story = {
  args: {
    // Spied so the play function can assert the link's onClick fires.
    onClick: fn(),
  },
  render: (args) => (
    <NavWrapper>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" onClick={(e) => e.preventDefault()}>
              Home
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" active onClick={(e) => e.preventDefault()}>
              Services
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                args.onClick?.(e);
              }}
            >
              About
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" onClick={(e) => e.preventDefault()}>
              Careers
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </NavWrapper>
  ),
  // Plain links (no trigger) render in-canvas; the active link is marked with
  // data-active, and clicking a link fires its onClick handler.
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step('the active link carries the active data attribute', async () => {
      const services = canvas.getByRole('link', { name: /services/i });
      await expect(services).toHaveAttribute('data-active');
      const home = canvas.getByRole('link', { name: /home/i });
      await expect(home).not.toHaveAttribute('data-active');
    });

    await step('clicking a link fires its onClick handler', async () => {
      await userEvent.click(canvas.getByRole('link', { name: /about/i }));
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  },
};

// ─── Vertical Orientation ─────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div
      style={{
        width: '240px',
        padding: 'var(--eidra-space-4)',
        borderRight: '1px solid var(--eidra-border)',
        minHeight: '400px',
        background: 'var(--eidra-surface)',
      }}
    >
      <NavigationMenu.Root orientation="vertical">
        <NavigationMenu.List
          style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--eidra-space-1)' }}
        >
          <NavigationMenu.Item>
            <NavigationMenu.Trigger style={{ width: '100%', justifyContent: 'space-between' }}>
              Services
              <NavigationMenu.Icon>
                <Icon icon={ChevronDown} size={14} />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner side="right" sideOffset={8}>
                <NavigationMenu.Popup>
                  <NavigationMenu.Viewport>
                    <NavigationMenu.Content>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--eidra-space-1)',
                          minWidth: '180px',
                          padding: 'var(--eidra-space-2)',
                        }}
                      >
                        <NavigationMenu.Link href="#">Strategy</NavigationMenu.Link>
                        <NavigationMenu.Link href="#">Digital</NavigationMenu.Link>
                        <NavigationMenu.Link href="#">Innovation</NavigationMenu.Link>
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Viewport>
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" style={{ width: '100%' }} active>
              Dashboard
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" style={{ width: '100%' }}>
              Reports
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" style={{ width: '100%' }}>
              Settings
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  ),
  // A vertical menu opens to the side; keyboard activation (Enter) on a focused
  // trigger opens it, and Escape closes it.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /services/i });

    await step('Enter on a focused trigger opens the flyout', async () => {
      trigger.focus();
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      const strategy = await screen.findByRole('link', { name: /strategy/i });
      await waitFor(() => expect(strategy).toBeVisible());
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    });

    await step('Escape closes the flyout and restores trigger state', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('link', { name: /strategy/i })).toBeNull(),
      );
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};
