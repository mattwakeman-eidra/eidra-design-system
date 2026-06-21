import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * **Welcome to the Eidra Design System** — the shared design language and React
 * component library Eidra uses to build web apps: internal tools, client-facing
 * SaaS, marketing sites, and pitch demos. Built on Base UI (headless, accessible
 * primitives) with Eidra's brand layered on through design tokens.
 */
const meta = {
  title: 'Introduction',
  parameters: { layout: 'padded', controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const sans = 'var(--eidra-font-family-sans)';
const mono = 'var(--eidra-font-family-mono)';

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        font: `600 var(--eidra-font-size-lg)/1.2 ${sans}`,
        color: 'var(--eidra-fg)',
        margin: 'var(--eidra-space-8) 0 var(--eidra-space-3)',
      }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        font: `400 var(--eidra-font-size-base)/1.5 ${sans}`,
        color: 'var(--eidra-fg-muted)',
        margin: '0 0 var(--eidra-space-3)',
        maxWidth: '64ch',
      }}
    >
      {children}
    </p>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        font: `var(--eidra-font-size-sm)/1 ${mono}`,
        background: 'var(--eidra-surface)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-sm)',
        padding: '0.1em 0.35em',
        color: 'var(--eidra-fg)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </code>
  );
}

function Pre({ children }: { children: string }) {
  return (
    <pre
      style={{
        font: `var(--eidra-font-size-sm)/1.5 ${mono}`,
        background: 'var(--eidra-surface)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-md)',
        padding: 'var(--eidra-gap-4)',
        color: 'var(--eidra-fg)',
        overflowX: 'auto',
        maxWidth: '64ch',
        margin: '0 0 var(--eidra-space-3)',
      }}
    >
      {children}
    </pre>
  );
}

interface Tier {
  name: string;
  rule: ReactNode;
  examples: string;
}

const TIERS: Tier[] = [
  {
    name: 'Foundations',
    rule: 'System-level rules with no single component — design tokens and cross-cutting guidance.',
    examples: 'Colors, Typography, Theming, Density, Choosing Components',
  },
  {
    name: '‹Function›/‹Component›',
    rule: 'One page per component, grouped by what the component is for. Its stories are that component’s own variants, states, and props.',
    examples: 'Actions, Forms, Navigation, Overlays, Layout, Data Display, Feedback',
  },
  {
    name: 'Patterns',
    rule: 'Recipes that combine two or more components into a reusable layout.',
    examples: 'KPIs, Report Page, Project Economics, Top Clients',
  },
];

const LINKS: { label: string; href: string; note: string }[] = [
  {
    label: 'GitHub repository',
    href: 'https://github.com/mattwakeman-eidra/eidra-design-system',
    note: 'Source, ADRs, and the release runbook.',
  },
  {
    label: 'Component catalog',
    href: 'https://github.com/mattwakeman-eidra/eidra-design-system/blob/main/docs/COMPONENTS.md',
    note: 'The generated index of every component and its import.',
  },
  {
    label: 'Consuming guide',
    href: 'https://github.com/mattwakeman-eidra/eidra-design-system/blob/main/docs/CONSUMING.md',
    note: 'How an app adopts the design system (fonts, theming, Tailwind).',
  },
];

/**
 * A first-time tour: what Eidra is, how the sidebar is organised, and the snippet
 * to drop it into an app.
 */
export const Welcome: Story = {
  render: () => (
    <div style={{ maxWidth: 860, color: 'var(--eidra-fg)' }}>
      <p
        style={{
          font: `500 var(--eidra-font-size-sm)/1 ${mono}`,
          color: 'var(--eidra-accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 var(--eidra-space-2)',
        }}
      >
        Eidra Design System
      </p>
      <h1
        style={{
          font: `700 var(--eidra-font-size-2xl)/1.1 ${sans}`,
          color: 'var(--eidra-fg)',
          margin: '0 0 var(--eidra-space-3)',
        }}
      >
        A branded, accessible component library
      </h1>
      <Lead>
        Eidra components wrap <strong>Base UI</strong> headless primitives — so behaviour and
        accessibility come for free — and dress them in Eidra&rsquo;s brand through design tokens.
        Everything you see here is themeable: try the <strong>Theme</strong> and{' '}
        <strong>Density</strong> toggles in the toolbar above to recolour and resize every story
        live.
      </Lead>

      <H2>Navigating the sidebar</H2>
      <Lead>The catalog is organised into three tiers. Read it top to bottom.</Lead>
      <div style={{ display: 'grid', gap: 'var(--eidra-gap-3)', maxWidth: 720 }}>
        {TIERS.map((tier) => (
          <section
            key={tier.name}
            style={{
              border: '1px solid var(--eidra-border)',
              borderRadius: 'var(--eidra-radius-md)',
              padding: 'var(--eidra-gap-4)',
              background: 'var(--eidra-bg)',
            }}
          >
            <h3
              style={{
                font: `600 var(--eidra-font-size-md)/1.2 ${mono}`,
                color: 'var(--eidra-fg)',
                margin: '0 0 var(--eidra-space-1)',
              }}
            >
              {tier.name}
            </h3>
            <p
              style={{
                font: `400 var(--eidra-font-size-sm)/1.4 ${sans}`,
                color: 'var(--eidra-fg)',
                margin: '0 0 var(--eidra-space-2)',
              }}
            >
              {tier.rule}
            </p>
            <p
              style={{
                font: `400 var(--eidra-font-size-sm)/1.4 ${sans}`,
                color: 'var(--eidra-fg-muted)',
                margin: 0,
              }}
            >
              e.g. {tier.examples}
            </p>
          </section>
        ))}
      </div>

      <H2>Install &amp; use</H2>
      <Lead>
        Load the fonts and the compiled styles once at your app root, then wrap your tree in a{' '}
        <Code>ThemeProvider</Code>.
      </Lead>
      <Pre>{`import '@eidra/tokens/fonts.css';
import '@eidra/react/styles.css';

import { ThemeProvider, Button, Field, Input } from '@eidra/react';

export function App() {
  return (
    <ThemeProvider theme="light" density="comfortable">
      <Field label="Email">
        <Input type="email" placeholder="you@eidra.com" />
      </Field>
      <Button tone="accent">Save</Button>
    </ThemeProvider>
  );
}`}</Pre>
      <Lead>
        <Code>ThemeProvider</Code> applies the <Code>eidra-root</Code> scope plus{' '}
        <Code>data-theme</Code> and <Code>data-density</Code>. You can instead set{' '}
        <Code>class=&quot;eidra-root&quot; data-theme=&quot;dark&quot;</Code> on your own root
        element.
      </Lead>

      <H2>Learn more</H2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 'var(--eidra-gap-2)',
          maxWidth: 720,
        }}
      >
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              style={{
                font: `600 var(--eidra-font-size-sm)/1.4 ${sans}`,
                color: 'var(--eidra-accent)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
            <span
              style={{
                font: `400 var(--eidra-font-size-sm)/1.4 ${sans}`,
                color: 'var(--eidra-fg-muted)',
              }}
            >
              {' '}
              — {link.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
};
