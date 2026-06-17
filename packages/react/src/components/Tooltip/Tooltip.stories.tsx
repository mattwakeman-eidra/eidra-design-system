import type { ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info, Save, Trash2, Settings } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Button } from '../Button/Button.js';
import { Tooltip } from './Tooltip.js';

// Base UI's render prop requires ReactElement<Record<string, unknown>>.
// Cast helper to satisfy that constraint without widening call-site types.
function asRender(el: ReactElement): ReactElement<Record<string, unknown>> {
  return el as ReactElement<Record<string, unknown>>;
}

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip.Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tooltip that appears on hover or focus, built on Base UI Tooltip. ' +
          'Wrap multiple tooltips with `Tooltip.Provider` to share delay settings.',
      },
    },
  },
} satisfies Meta<typeof Tooltip.Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Convenience wrapper that renders a complete tooltip
function TooltipExample({
  label,
  side = 'top',
  children,
}: {
  label: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactElement;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={asRender(children)}></Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side={side}>
          <Tooltip.Popup>
            {label}
            <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export const Playground: Story = {
  render: () => (
    <TooltipExample label="Save your changes">
      <Button>Save</Button>
    </TooltipExample>
  ),
};

export const Sides: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--eidra-space-6)',
        placeItems: 'center',
        padding: 'var(--eidra-space-10)',
      }}
    >
      <TooltipExample label="Appears above" side="top">
        <Button variant="outline">Top</Button>
      </TooltipExample>
      <TooltipExample label="Appears below" side="bottom">
        <Button variant="outline">Bottom</Button>
      </TooltipExample>
      <TooltipExample label="Appears to the left" side="left">
        <Button variant="outline">Left</Button>
      </TooltipExample>
      <TooltipExample label="Appears to the right" side="right">
        <Button variant="outline">Right</Button>
      </TooltipExample>
    </div>
  ),
};

export const OnIconButton: Story = {
  name: 'On icon buttons',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--eidra-space-4)', alignItems: 'center' }}>
      <TooltipExample label="More information" side="top">
        <Button variant="ghost" tone="neutral" iconOnly aria-label="More information">
          <Icon icon={Info} />
        </Button>
      </TooltipExample>

      <TooltipExample label="Save changes" side="top">
        <Button variant="ghost" tone="accent" iconOnly aria-label="Save">
          <Icon icon={Save} />
        </Button>
      </TooltipExample>

      <TooltipExample label="Open settings" side="top">
        <Button variant="ghost" tone="neutral" iconOnly aria-label="Settings">
          <Icon icon={Settings} />
        </Button>
      </TooltipExample>

      <TooltipExample label="Delete permanently" side="top">
        <Button variant="ghost" tone="danger" iconOnly aria-label="Delete">
          <Icon icon={Trash2} />
        </Button>
      </TooltipExample>
    </div>
  ),
};

export const SharedDelay: Story = {
  name: 'Shared delay (Provider)',
  parameters: {
    docs: {
      description: {
        story:
          'Wrap multiple tooltips in `Tooltip.Provider` so that once one tooltip opens, ' +
          'adjacent ones open instantly (no delay) within the timeout window.',
      },
    },
  },
  render: () => (
    <Tooltip.Provider delay={600} closeDelay={0}>
      <div style={{ display: 'flex', gap: 'var(--eidra-space-4)' }}>
        {['Proposals', 'Clients', 'Projects', 'Reports'].map((item) => (
          <TooltipExample key={item} label={`Go to ${item}`} side="bottom">
            <Button variant="outline" size="sm">
              {item}
            </Button>
          </TooltipExample>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

export const LongLabel: Story = {
  name: 'Long label',
  render: () => (
    <TooltipExample
      label="This proposal is awaiting sign-off from the client before it can be activated."
      side="top"
    >
      <Button variant="subtle" tone="neutral">
        Pending sign-off
      </Button>
    </TooltipExample>
  ),
};

export const Disabled: Story = {
  name: 'Disabled trigger',
  parameters: {
    docs: {
      description: {
        story:
          'Set `disabled` on the `Tooltip.Root` to suppress the tooltip entirely. ' +
          'The trigger remains functional; only the tooltip is suppressed.',
      },
    },
  },
  render: () => (
    <Tooltip.Root disabled>
      <Tooltip.Trigger render={asRender(<Button disabled>Disabled</Button>)}></Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="top">
          <Tooltip.Popup>
            You will never see this
            <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
};

export const InlineTerm: Story = {
  name: 'Inline term (glossary)',
  parameters: {
    docs: {
      description: {
        story:
          'Reproduces an inline glossary term: a dashed-underlined word in running text that ' +
          'reveals a definition on hover or focus. The trigger renders as a `<span>` (with ' +
          '`tabIndex={0}` for keyboard focus) and `delay` matches the 200ms used in the source app. ' +
          'Collision handling flips the popup automatically when near a viewport edge. The glossary ' +
          'map stays in application code — render the Tooltip only when a definition exists, otherwise ' +
          'render the word as plain text.',
      },
    },
  },
  render: () => (
    <p style={{ maxWidth: 460, lineHeight: 1.8, color: 'var(--eidra-fg)' }}>
      This month&rsquo;s{' '}
      <Tooltip.Provider delay={200}>
        <Tooltip.Root>
          <Tooltip.Trigger
            render={asRender(
              <span
                tabIndex={0}
                style={{ borderBottom: '1px dashed var(--eidra-border-strong)', cursor: 'help' }}
              >
                WIP
              </span>,
            )}
          />
          <Tooltip.Portal>
            <Tooltip.Positioner side="bottom" sideOffset={6}>
              <Tooltip.Popup>
                Work In Progress — revenue earned but not yet invoiced to the client.
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>{' '}
      is up 12% on last quarter.
    </p>
  ),
};

const GLOSSARY: Record<string, string> = {
  WIP: 'Work In Progress — revenue earned but not yet invoiced to the client.',
  EBITDA:
    'Earnings Before Interest, Taxes, Depreciation & Amortization — a measure of operating profitability.',
  Interco:
    'Intercompany — transactions between group companies (e.g. one entity invoicing another).',
};

/**
 * Reusable glossary `Term`: a dashed-underlined word that reveals its definition on
 * hover or focus, built on the shipped `Tooltip`. The term-to-definition map lives in
 * application code; render the `Term` only when a definition exists, otherwise fall
 * back to plain text. The trigger is a `<span tabIndex={0}>` so it is keyboard-focusable.
 */
function Term({ children }: { children: string }) {
  const definition = GLOSSARY[children];
  if (!definition) return <>{children}</>;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={asRender(
          <span
            tabIndex={0}
            style={{ borderBottom: '1px dashed var(--eidra-border-strong)', cursor: 'help' }}
          >
            {children}
          </span>,
        )}
      />
      <Tooltip.Portal>
        <Tooltip.Positioner side="bottom" sideOffset={6}>
          <Tooltip.Popup>
            {definition}
            <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export const GlossaryTerm: Story = {
  name: 'Glossary term',
  parameters: {
    docs: {
      description: {
        story:
          'A reusable glossary `Term` recipe: a dashed-underlined word backed by a ' +
          'term-to-definition map kept in application code. Wrap several terms in a ' +
          'single `Tooltip.Provider` so adjacent definitions open without re-triggering ' +
          'the delay. Unknown terms render as plain text.',
      },
    },
  },
  render: () => (
    <Tooltip.Provider delay={200}>
      <p style={{ maxWidth: 460, lineHeight: 1.8, color: 'var(--eidra-fg)' }}>
        Closing the month means reconciling <Term>WIP</Term> against billed revenue,
        checking the <Term>Interco</Term> balances net to zero, and confirming the{' '}
        <Term>EBITDA</Term> figure matches the ledger before sign-off.
      </p>
    </Tooltip.Provider>
  ),
};
