import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Freshness,
  Input,
  Kbd,
  Progress,
  SegmentBar,
  Statistic,
  StatisticBar,
  StatusStrip,
  Switch,
  ThemeProvider,
  Toggle,
  ToggleGroup,
} from '../index.js';

const meta = {
  title: 'Foundations/Density',
  // Render our own ThemeProvider scopes (one per density) — opt out of the global
  // decorator so the toolbar density doesn't clash with the pinned columns.
  parameters: { layout: 'fullscreen', selfScoped: true },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * A representative slice of the library. Density is ambient: every component reads
 * the surrounding `data-density` scope — control sizes via the `--eidra-size-control-*`
 * tokens, data-display components via their own compact rules.
 */
function Panel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-4)' }}>
      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--eidra-gap-2)',
          alignItems: 'center',
        }}
      >
        <Button>Save</Button>
        <Button variant="outline" tone="neutral">
          Cancel
        </Button>
        <Input placeholder="Search…" style={{ maxWidth: 180 }} />
        <Kbd>⌘K</Kbd>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--eidra-gap-4)',
          alignItems: 'center',
        }}
      >
        <Checkbox.Root label="Email me" defaultChecked />
        <Switch.Root label="Auto-save" defaultChecked />
        <Badge tone="success" variant="subtle">
          Live
        </Badge>
        <Badge tone="accent">New</Badge>
        <Freshness label="Data" since={Date.now() - 12 * 60_000} tone="positive" />
      </div>

      <ToggleGroup.Root appearance="segmented" aria-label="View" defaultValue={['table']}>
        <Toggle value="table">Table</Toggle>
        <Toggle value="graphs">Graphs</Toggle>
        <Toggle value="clients">Clients</Toggle>
      </ToggleGroup.Root>

      {/* Metrics */}
      <StatisticBar
        aria-label="Summary"
        items={[
          { label: 'Clients', value: '128' },
          { label: 'Actuals YTD', value: '€11.5M' },
          { label: 'Sold', value: '€18.2M', tone: 'positive' },
          { label: 'Year-end', value: '€21.6M', tone: 'accent' },
        ]}
      />

      <div style={{ display: 'flex', gap: 'var(--eidra-gap-6)', flexWrap: 'wrap' }}>
        <Statistic label="Revenue" value="€21.6M" caption="projected" />
        <Statistic label="Pipeline" value="€3.4M" tone="success" caption="+8% vs LY" />
      </div>

      <StatusStrip aria-label="Momentum">
        <StatusStrip.Cell status="positive" label="Jan">
          +4%
        </StatusStrip.Cell>
        <StatusStrip.Cell status="positive" label="Feb">
          +2%
        </StatusStrip.Cell>
        <StatusStrip.Cell status="caution" label="Mar">
          0%
        </StatusStrip.Cell>
        <StatusStrip.Cell status="negative" label="Apr">
          −3%
        </StatusStrip.Cell>
        <StatusStrip.Cell status="positive" label="May">
          +6%
        </StatusStrip.Cell>
      </StatusStrip>

      <SegmentBar
        segments={[
          { value: 11.5, label: 'Actuals' },
          { value: 6.7, label: 'Sold' },
          { value: 3.4, label: 'Hi-prob' },
        ]}
        showLegend
      />

      <Progress.Root value={62} aria-label="Budget used">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>

      {/* Surfaces */}
      <Alert tone="info" title="Heads up">
        Forecast figures refresh every 15 minutes.
      </Alert>

      <Card>
        <Card.Header>Acme Corp</Card.Header>
        <Card.Body>Enterprise · Nordics · A. Lindqvist</Card.Body>
      </Card>
    </div>
  );
}

function Column({
  theme,
  density,
  label,
}: {
  theme: 'light' | 'dark';
  density: 'comfortable' | 'compact';
  label: ReactNode;
}) {
  return (
    <ThemeProvider
      theme={theme}
      density={density}
      style={{
        flex: 1,
        minWidth: 320,
        padding: 'var(--eidra-gap-5)',
      }}
    >
      <h3
        style={{
          margin: '0 0 var(--eidra-space-4)',
          font: '600 var(--eidra-font-size-sm)/1.2 var(--eidra-font-family-sans)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--eidra-fg-muted)',
        }}
      >
        {label}
      </h3>
      <Panel />
    </ThemeProvider>
  );
}

/**
 * The same components side by side under `data-density="comfortable"` (default) and
 * `data-density="compact"`. Each column is its own `ThemeProvider` scope, so the
 * comparison is fixed regardless of the toolbar (which still controls the rest of
 * Storybook). The Theme toolbar still applies — both columns follow it.
 */
export const ComfortableVsCompact: Story = {
  render: (_args, { globals }) => {
    const theme = (globals as { theme?: 'light' | 'dark' }).theme ?? 'light';
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'stretch' }}>
        <Column theme={theme} density="comfortable" label="Comfortable" />
        <div style={{ width: 1, background: 'var(--eidra-border)' }} aria-hidden />
        <Column theme={theme} density="compact" label="Compact" />
      </div>
    );
  },
};
