import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExternalLink, Building2, Users, Calendar } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Button } from '../Button/Button.js';
import { PreviewCard } from './PreviewCard.js';

const meta = {
  title: 'Overlays/PreviewCard',
  // Point at Root: it carries the meaningful behavior props (open/defaultOpen).
  // The visual Popup part has almost no props. Every other part is declared as a
  // subcomponent so each one gets its own props table in the autodocs page.
  component: PreviewCard.Root,
  subcomponents: {
    'PreviewCard.Trigger': PreviewCard.Trigger,
    'PreviewCard.Portal': PreviewCard.Portal,
    'PreviewCard.Positioner': PreviewCard.Positioner,
    'PreviewCard.Popup': PreviewCard.Popup,
    'PreviewCard.Arrow': PreviewCard.Arrow,
    'PreviewCard.Backdrop': PreviewCard.Backdrop,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PreviewCard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIDES = ['top', 'bottom', 'left', 'right'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

// ---- Playground ----
// Flat controls: Root behavior (defaultOpen) plus Positioner placement
// (side/align/sideOffset).
type PreviewCardPlaygroundArgs = ComponentProps<typeof PreviewCard.Root> & {
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  sideOffset: number;
};

export const Playground: StoryObj<PreviewCardPlaygroundArgs> = {
  args: {
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
    defaultOpen: false,
  },
  argTypes: {
    side: { control: 'inline-radio', options: SIDES },
    align: { control: 'inline-radio', options: ALIGNS },
    sideOffset: { control: 'number' },
    defaultOpen: { control: 'boolean' },
    open: { control: 'boolean' },
  },
  render: ({ side, align, sideOffset, ...rootProps }) => (
    <p
      style={{
        fontFamily: 'var(--eidra-font-family-sans)',
        fontSize: 'var(--eidra-font-size-base)',
      }}
    >
      Hover over{' '}
      <PreviewCard.Root {...rootProps}>
        <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
          Nordic Identity Refresh
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side={side} align={align} sideOffset={sideOffset}>
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
              <div style={{ padding: 'var(--eidra-gap-4)' }}>
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
                    gap: 'var(--eidra-gap-3)',
                    marginTop: 'var(--eidra-space-3)',
                    fontSize: 'var(--eidra-font-size-xs)',
                    color: 'var(--eidra-fg-subtle)',
                  }}
                >
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-gap-1)' }}
                  >
                    <Icon icon={Building2} size="sm" aria-hidden />
                    Eidra Oslo
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-gap-1)' }}
                  >
                    <Icon icon={Calendar} size="sm" aria-hidden />
                    Q2 2026
                  </span>
                </div>
              </div>
            </PreviewCard.Popup>
            <PreviewCard.Arrow />
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>{' '}
      to see the preview card.
    </p>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('link', { name: /Nordic Identity Refresh/i });

    await step('hovering the trigger opens the preview popup (portaled to body)', async () => {
      await userEvent.hover(trigger);
      const heading = await screen.findByRole('heading', { name: /Nordic Identity Refresh/i });
      await waitFor(() => expect(heading).toBeVisible());
    });

    await step('Escape dismisses the popup', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('heading', { name: /Nordic Identity Refresh/i })).toBeNull(),
      );
    });
  },
};

// ---- Person / contact card ----
export const PersonCard: Story = {
  name: 'Person card',
  render: () => (
    <p
      style={{
        fontFamily: 'var(--eidra-font-family-sans)',
        fontSize: 'var(--eidra-font-size-base)',
      }}
    >
      Assigned to{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
          Ingrid Halvorsen
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="bottom" align="start" sideOffset={8}>
            <PreviewCard.Popup>
              <div
                style={{
                  padding: 'var(--eidra-gap-4)',
                  display: 'flex',
                  gap: 'var(--eidra-gap-3)',
                  alignItems: 'center',
                }}
              >
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
                  padding: 'var(--eidra-gap-3) var(--eidra-gap-4)',
                  display: 'flex',
                  gap: 'var(--eidra-gap-3)',
                  fontSize: 'var(--eidra-font-size-xs)',
                  color: 'var(--eidra-fg-subtle)',
                }}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-gap-1)' }}
                >
                  <Icon icon={Users} size="sm" aria-hidden />4 active projects
                </span>
              </div>
            </PreviewCard.Popup>
            <PreviewCard.Arrow />
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>{' '}
      in this sprint.
    </p>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('link', { name: /Ingrid Halvorsen/i });

    await step('focusing the trigger via keyboard opens the preview', async () => {
      trigger.focus();
      await expect(trigger).toHaveFocus();
      const name = await screen.findByText(/Lead Designer/i);
      await waitFor(() => expect(name).toBeVisible());
    });

    await step('Escape closes the focus-opened preview', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByText(/Lead Designer/i)).toBeNull());
    });
  },
};

// ---- Simple link preview ----
export const SimpleLinkPreview: Story = {
  name: 'Simple link preview',
  render: () => (
    <p
      style={{
        fontFamily: 'var(--eidra-font-family-sans)',
        fontSize: 'var(--eidra-font-size-base)',
      }}
    >
      Read more about our{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
          service methodology
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="top" align="center" sideOffset={8}>
            <PreviewCard.Popup>
              <div style={{ padding: 'var(--eidra-gap-4)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--eidra-gap-2)',
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
      </PreviewCard.Root>{' '}
      on our website.
    </p>
  ),
};

// ---- Controlled ----
export const Controlled: Story = {
  render: function ControlledStory() {
    return (
      <p
        style={{
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-base)',
        }}
      >
        This is a{' '}
        <PreviewCard.Root defaultOpen>
          <PreviewCard.Trigger href="#" onClick={(e) => e.preventDefault()}>
            pre-opened preview card
          </PreviewCard.Trigger>
          <PreviewCard.Portal>
            <PreviewCard.Positioner side="bottom" align="center" sideOffset={8}>
              <PreviewCard.Popup>
                <div style={{ padding: 'var(--eidra-gap-4)' }}>
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
        </PreviewCard.Root>{' '}
        that starts open.
      </p>
    );
  },
  play: async ({ step }) => {
    await step('defaultOpen renders the popup open on mount', async () => {
      const heading = await screen.findByText(/Default open/i);
      await waitFor(() => expect(heading).toBeVisible());
    });
  },
};

// ---- onOpenChange callback ----
/**
 * Hover/focus open and close both fire `onOpenChange(open, eventDetails)`. The
 * host passes a spy to observe each transition.
 */
const onOpenChangeSpy = fn();

export const OpenChangeCallback: Story = {
  name: 'onOpenChange callback',
  parameters: { controls: { disable: true } },
  render: function OpenChangeStory() {
    return (
      <p
        style={{
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-base)',
        }}
      >
        Hover{' '}
        <PreviewCard.Root onOpenChange={onOpenChangeSpy}>
          <PreviewCard.Trigger
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-label="Open change demo"
          >
            Eidra Copenhagen
          </PreviewCard.Trigger>
          <PreviewCard.Portal>
            <PreviewCard.Positioner side="bottom" align="start" sideOffset={8}>
              <PreviewCard.Popup>
                <div style={{ padding: 'var(--eidra-gap-4)' }}>
                  <div
                    style={{
                      fontWeight: 'var(--eidra-font-weight-semibold)',
                      fontSize: 'var(--eidra-font-size-sm)',
                      color: 'var(--eidra-fg)',
                    }}
                  >
                    Eidra Copenhagen
                  </div>
                  <p
                    style={{
                      margin: 'var(--eidra-space-1) 0 0',
                      fontSize: 'var(--eidra-font-size-xs)',
                      color: 'var(--eidra-fg-muted)',
                    }}
                  >
                    Strategy &amp; design studio.
                  </p>
                </div>
              </PreviewCard.Popup>
              <PreviewCard.Arrow />
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        </PreviewCard.Root>{' '}
        to fire the callback.
      </p>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('link', { name: /Open change demo/i });
    onOpenChangeSpy.mockClear();

    await step('hover fires onOpenChange(true)', async () => {
      await userEvent.hover(trigger);
      await screen.findByText(/Strategy & design studio/i);
      await waitFor(() => expect(onOpenChangeSpy).toHaveBeenCalledWith(true, expect.anything()));
    });

    await step('Escape fires onOpenChange(false) and removes the popup', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByText(/Strategy & design studio/i)).toBeNull());
      await expect(onOpenChangeSpy).toHaveBeenCalledWith(false, expect.anything());
    });
  },
};

// ---- Fully controlled open state ----
/**
 * The host owns `open` and only flips it from `onOpenChange`. A reset button
 * drives state from outside the trigger to prove the popup tracks the prop.
 */
export const ControlledOpen: Story = {
  name: 'Controlled open',
  parameters: { controls: { disable: true } },
  render: function ControlledOpenStory() {
    const [open, setOpen] = useState(false);
    return (
      <div
        style={{
          display: 'grid',
          gap: 'var(--eidra-gap-3)',
          fontFamily: 'var(--eidra-font-family-sans)',
        }}
      >
        <p style={{ margin: 0, fontSize: 'var(--eidra-font-size-base)' }}>
          Open: <strong>{String(open)}</strong>
        </p>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Open from outside
        </Button>
        <p style={{ margin: 0, fontSize: 'var(--eidra-font-size-base)' }}>
          Hover{' '}
          <PreviewCard.Root open={open} onOpenChange={setOpen}>
            <PreviewCard.Trigger
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Controlled trigger"
            >
              Eidra Helsinki
            </PreviewCard.Trigger>
            <PreviewCard.Portal>
              <PreviewCard.Positioner side="bottom" align="start" sideOffset={8}>
                <PreviewCard.Popup>
                  <div style={{ padding: 'var(--eidra-gap-4)' }}>
                    <div
                      style={{
                        fontWeight: 'var(--eidra-font-weight-semibold)',
                        fontSize: 'var(--eidra-font-size-sm)',
                        color: 'var(--eidra-fg)',
                      }}
                    >
                      Controlled card
                    </div>
                  </div>
                </PreviewCard.Popup>
                <PreviewCard.Arrow />
              </PreviewCard.Positioner>
            </PreviewCard.Portal>
          </PreviewCard.Root>{' '}
          or use the button.
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('host button opens the controlled popup via the open prop', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Open from outside/i }));
      const card = await screen.findByText(/Controlled card/i);
      await waitFor(() => expect(card).toBeVisible());
      await expect(canvas.getByText(/Open:/).querySelector('strong')).toHaveTextContent('true');
    });

    await step('Escape drives onOpenChange(false), host closes the popup', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByText(/Controlled card/i)).toBeNull());
      await expect(canvas.getByText(/Open:/).querySelector('strong')).toHaveTextContent('false');
    });
  },
};
