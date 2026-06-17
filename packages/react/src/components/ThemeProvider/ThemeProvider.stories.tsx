import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from './ThemeProvider.js';
import { Button, Badge, Statistic, Input } from '../../index.js';

/**
 * `ThemeProvider` establishes the Eidra scope: it applies `eidra-root`, `data-theme`,
 * and `data-density` so tokens resolve and brand type/colour are inherited — and it
 * publishes the scope to portaled components (menus, dialogs, tooltips) so they pick
 * up the same theme/density even though they render in a portal. You can also apply
 * `class="eidra-root" data-theme data-density` to your own root element instead.
 */
const meta = {
  title: 'Foundations/Theming',
  component: ThemeProvider,
  // These stories render their own ThemeProvider scopes, so opt out of the global
  // toolbar-driven provider in .storybook/preview to avoid double-wrapping.
  parameters: { layout: 'padded', selfScoped: true },
  argTypes: {
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// A small sample panel exercising type, colour, control size, and a metric.
function Panel({ label }: { label: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)', padding: 'var(--eidra-space-4)' }}>
      <div style={{ font: '600 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--eidra-fg-muted)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 'var(--eidra-space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button tone="accent">Save</Button>
        <Button variant="outline">Cancel</Button>
        <Badge tone="success">Active</Badge>
      </div>
      <Input placeholder="Search…" />
      <Statistic label="Budget" value="€ 1.2M" tone="accent" delta="+6%" />
    </div>
  );
}

/** Drive `theme` and `density` from the controls to see the whole scope respond. */
export const Playground: Story = {
  args: { theme: 'light', density: 'comfortable' },
  render: (args) => (
    <ThemeProvider
      theme={args.theme}
      density={args.density}
      style={{ maxWidth: 360, border: '1px solid var(--eidra-border)', borderRadius: 'var(--eidra-radius-lg)' }}
    >
      <Panel label={`${args.theme} · ${args.density}`} />
    </ThemeProvider>
  ),
};

/** The four scopes side by side — theme (light/dark) × density (comfortable/compact). */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: 'var(--eidra-space-4)', maxWidth: 760 }}>
      {(['light', 'dark'] as const).map((theme) =>
        (['comfortable', 'compact'] as const).map((density) => (
          <ThemeProvider
            key={`${theme}-${density}`}
            theme={theme}
            density={density}
            style={{ border: '1px solid var(--eidra-border)', borderRadius: 'var(--eidra-radius-lg)' }}
          >
            <Panel label={`${theme} · ${density}`} />
          </ThemeProvider>
        )),
      )}
    </div>
  ),
};
