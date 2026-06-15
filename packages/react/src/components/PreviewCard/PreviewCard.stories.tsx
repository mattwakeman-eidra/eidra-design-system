import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExternalLink, Building2, Users, Calendar } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { PreviewCard } from './PreviewCard.js';

const meta = {
  title: 'Overlays/PreviewCard',
  component: PreviewCard.Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PreviewCard.Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Playground ----
export const Playground: Story = {
  render: () => (
    <p style={{ fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-base)' }}>
      Hover over{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
          Nordic Identity Refresh
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="bottom" align="start" sideOffset={8}>
            <PreviewCard.Popup>
              <div
                style={{
                  height: 140,
                  background: 'var(--eidra-accent-subtle)',
                  borderRadius: 'var(--eidra-radius-lg) var(--eidra-radius-lg) 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--eidra-accent)',
                  fontSize: 'var(--eidra-font-size-4xl)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                🌿
              </div>
              <div style={{ padding: 'var(--eidra-space-4)' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'var(--eidra-font-size-base)',
                    fontWeight: 'var(--eidra-font-weight-semibold)',
                    color: 'var(--eidra-fg)',
                    lineHeight: 'var(--eidra-font-line-height-tight)',
                  }}
                >
                  Nordic Identity Refresh
                </h3>
                <p
                  style={{
                    margin: 'var(--eidra-space-1) 0 0',
                    fontSize: 'var(--eidra-font-size-xs)',
                    color: 'var(--eidra-fg-muted)',
                  }}
                >
                  Brand strategy &amp; visual identity for a leading Nordic financial services firm.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--eidra-space-3)',
                    marginTop: 'var(--eidra-space-3)',
                    fontSize: 'var(--eidra-font-size-xs)',
                    color: 'var(--eidra-fg-subtle)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-1)' }}>
                    <Icon icon={Building2} size="sm" aria-hidden />
                    Eidra Oslo
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-1)' }}>
                    <Icon icon={Calendar} size="sm" aria-hidden />
                    Q2 2026
                  </span>
                </div>
              </div>
            </PreviewCard.Popup>
            <PreviewCard.Arrow />
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
      {' '}to see the preview card.
    </p>
  ),
};

// ---- Person / contact card ----
export const PersonCard: Story = {
  name: 'Person card',
  render: () => (
    <p style={{ fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-base)' }}>
      Assigned to{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
          Ingrid Halvorsen
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="bottom" align="start" sideOffset={8}>
            <PreviewCard.Popup>
              <div style={{ padding: 'var(--eidra-space-4)', display: 'flex', gap: 'var(--eidra-space-3)', alignItems: 'center' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--eidra-radius-full)',
                    background: 'var(--eidra-coral-subtle)',
                    color: 'var(--eidra-coral-fg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--eidra-font-size-lg)',
                    fontWeight: 'var(--eidra-font-weight-semibold)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  IH
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 'var(--eidra-font-weight-semibold)',
                      fontSize: 'var(--eidra-font-size-base)',
                      color: 'var(--eidra-fg)',
                    }}
                  >
                    Ingrid Halvorsen
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--eidra-font-size-xs)',
                      color: 'var(--eidra-fg-muted)',
                      marginTop: 'var(--eidra-space-0-5)',
                    }}
                  >
                    Lead Designer · Eidra Stockholm
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--eidra-border-subtle)',
                  padding: 'var(--eidra-space-3) var(--eidra-space-4)',
                  display: 'flex',
                  gap: 'var(--eidra-space-3)',
                  fontSize: 'var(--eidra-font-size-xs)',
                  color: 'var(--eidra-fg-subtle)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-1)' }}>
                  <Icon icon={Users} size="sm" aria-hidden />
                  4 active projects
                </span>
              </div>
            </PreviewCard.Popup>
            <PreviewCard.Arrow />
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
      {' '}in this sprint.
    </p>
  ),
};

// ---- Simple link preview ----
export const SimpleLinkPreview: Story = {
  name: 'Simple link preview',
  render: () => (
    <p style={{ fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-base)' }}>
      Read more about our{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
          service methodology
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="top" align="center" sideOffset={8}>
            <PreviewCard.Popup>
              <div style={{ padding: 'var(--eidra-space-4)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--eidra-space-2)',
                    marginBottom: 'var(--eidra-space-2)',
                  }}
                >
                  <Icon icon={ExternalLink} size="sm" aria-hidden />
                  <span
                    style={{
                      fontSize: 'var(--eidra-font-size-xs)',
                      color: 'var(--eidra-fg-subtle)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--eidra-font-letter-spacing-wide)',
                    }}
                  >
                    eidra.com
                  </span>
                </div>
                <div
                  style={{
                    fontWeight: 'var(--eidra-font-weight-semibold)',
                    fontSize: 'var(--eidra-font-size-sm)',
                    color: 'var(--eidra-fg)',
                    lineHeight: 'var(--eidra-font-line-height-tight)',
                  }}
                >
                  Our Service Methodology
                </div>
                <p
                  style={{
                    margin: 'var(--eidra-space-1) 0 0',
                    fontSize: 'var(--eidra-font-size-xs)',
                    color: 'var(--eidra-fg-muted)',
                    lineHeight: 'var(--eidra-font-line-height-normal)',
                  }}
                >
                  Discover how Eidra blends strategic insight with craftsmanship to deliver
                  exceptional digital experiences across the Nordic market.
                </p>
              </div>
            </PreviewCard.Popup>
            <PreviewCard.Arrow />
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
      {' '}on our website.
    </p>
  ),
};

// ---- Controlled ----
export const Controlled: Story = {
  render: function ControlledStory() {
    return (
      <p style={{ fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-base)' }}>
        This is a{' '}
        <PreviewCard.Root defaultOpen>
          <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
            pre-opened preview card
          </PreviewCard.Trigger>
          <PreviewCard.Portal>
            <PreviewCard.Positioner side="bottom" align="center" sideOffset={8}>
              <PreviewCard.Popup>
                <div style={{ padding: 'var(--eidra-space-4)' }}>
                  <div
                    style={{
                      fontWeight: 'var(--eidra-font-weight-semibold)',
                      fontSize: 'var(--eidra-font-size-sm)',
                      color: 'var(--eidra-fg)',
                    }}
                  >
                    Default open
                  </div>
                  <p
                    style={{
                      margin: 'var(--eidra-space-1) 0 0',
                      fontSize: 'var(--eidra-font-size-xs)',
                      color: 'var(--eidra-fg-muted)',
                    }}
                  >
                    This preview card opens immediately via the <code>defaultOpen</code> prop.
                  </p>
                </div>
              </PreviewCard.Popup>
              <PreviewCard.Arrow />
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        </PreviewCard.Root>
        {' '}that starts open.
      </p>
    );
  },
};
