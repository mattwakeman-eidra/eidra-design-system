import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Globe, Building2, Users, FileText, Lightbulb, Phone } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { NavigationMenu } from './NavigationMenu.js';

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
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
  render: () => (
    <NavWrapper>
      <NavigationMenu.Root>
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
};

// ─── With Active Link ─────────────────────────────────────────────────────────

export const WithActiveLink: Story = {
  render: () => (
    <NavWrapper>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#" active>
              Services
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">About</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Careers</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </NavWrapper>
  ),
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
};
