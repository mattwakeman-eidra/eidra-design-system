import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart, formatCompactCurrency } from '../index.js';
import { Flag } from '@eidra/icons';

/**
 * **Top Clients — recipe.** This story is *documentation*, not a shipped component:
 * it reproduces the deck's "Top Eidra Clients" pages by composing existing
 * primitives — a small-multiples grid of stacked `Chart.BarChart` minis (one per
 * client, monthly net revenue stacked by operating company) plus a ranked client
 * list with country `Flag`s. The design system stays domain-agnostic; the
 * client/OpCo semantics live here in the recipe.
 *
 * The OpCo stack segments cycle through the categorical chart palette
 * (`--eidra-chart-1` … `--eidra-chart-16`) so every OpCo keeps one stable colour
 * across all client minis and the shared legend.
 */
const meta = {
  title: 'Patterns/Top Clients',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

// ── Money formatting ─────────────────────────────────────────────────────────
// Sample revenue figures are in €k; multiply back up for the compact formatter.
const fmt = (v: number | string | undefined) => formatCompactCurrency(Number(v) * 1000);

// ── Operating companies (the stack segments) ─────────────────────────────────
// Each OpCo is assigned a fixed slot in the 16-colour categorical chart palette,
// so it reads as the same colour in every mini and in the shared legend.
interface OpCo {
  /** Stable data key — also the ChartConfig key, so `var(--color-<key>)` resolves. */
  key: string;
  label: string;
  // Index signature so `Chart.categoricalConfig` (which takes `Record<string, unknown>`
  // rows) accepts `OpCo[]` directly.
  [field: string]: string;
}

const OPCOS: OpCo[] = [
  { key: 'fabrique', label: 'Fabrique' },
  { key: 'mediaMonks', label: 'Media.Monks' },
  { key: 'umain', label: 'Umain' },
  { key: 'tigerton', label: 'Tigerton' },
  { key: 'northell', label: 'Northell' },
  { key: 'brightStep', label: 'BrightStep' },
];

// One ChartConfig shared by every mini: keys the OpCo data keys to their colour,
// so each `Chart.Bar fill="var(--color-<opco.key>)"` picks up the right token and
// the tooltip shows the OpCo label. `Chart.categoricalConfig` assigns the
// `--eidra-chart-*` ramp to each OpCo in order (wrapping after 16), the same
// cycle the shared legend reads back from this config.
const opcoConfig = Chart.categoricalConfig(OPCOS, 'key', { labelField: 'label' });

// ── Sample data ──────────────────────────────────────────────────────────────
interface MonthDatum {
  month: string;
  // One numeric net-revenue value (€k) per OpCo key. Index signature lets the
  // chart read arbitrary OpCo keys off the row.
  [opco: string]: number | string;
}

interface Client {
  name: string;
  /** ISO 3166-1 alpha-2 country code for the Flag. */
  country: string;
  countryName: string;
  /** Which OpCos serve this client (a subset of OPCOS). */
  opcos: string[];
  /** Per-month, per-OpCo net revenue in €k. */
  months: MonthDatum[];
}

const MONTHS_12 = [
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
];

// Deterministic pseudo-random generator so the sample data is stable across
// renders (no hydration / snapshot churn) but still looks realistic.
function makeMonths(months: string[], opcos: string[], seed: number): MonthDatum[] {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return months.map((month) => {
    const row: MonthDatum = { month };
    for (const key of opcos) {
      // 8–60 (€k) per OpCo per month, with a gentle upward drift.
      row[key] = Math.round(8 + rand() * 52);
    }
    return row;
  });
}

const CLIENTS: Client[] = [
  {
    name: 'Volvo Cars',
    country: 'SE',
    countryName: 'Sweden',
    opcos: ['fabrique', 'umain', 'tigerton'],
  },
  { name: 'Equinor', country: 'NO', countryName: 'Norway', opcos: ['mediaMonks', 'umain'] },
  {
    name: 'Philips',
    country: 'NL',
    countryName: 'Netherlands',
    opcos: ['fabrique', 'northell', 'brightStep'],
  },
  {
    name: 'Siemens',
    country: 'DE',
    countryName: 'Germany',
    opcos: ['mediaMonks', 'tigerton', 'brightStep'],
  },
  { name: 'Nike', country: 'US', countryName: 'United States', opcos: ['mediaMonks', 'fabrique'] },
  { name: 'Barclays', country: 'GB', countryName: 'United Kingdom', opcos: ['umain', 'northell'] },
  { name: 'Maersk', country: 'DK', countryName: 'Denmark', opcos: ['tigerton', 'fabrique'] },
  {
    name: 'Nokia',
    country: 'FI',
    countryName: 'Finland',
    opcos: ['northell', 'brightStep', 'umain'],
  },
  {
    name: 'IKEA',
    country: 'SE',
    countryName: 'Sweden',
    opcos: ['fabrique', 'mediaMonks', 'umain', 'tigerton'],
  },
  { name: 'DNB', country: 'NO', countryName: 'Norway', opcos: ['umain', 'brightStep'] },
  {
    name: 'Heineken',
    country: 'NL',
    countryName: 'Netherlands',
    opcos: ['mediaMonks', 'northell'],
  },
  { name: 'BMW', country: 'DE', countryName: 'Germany', opcos: ['fabrique', 'tigerton'] },
  {
    name: 'Spotify',
    country: 'SE',
    countryName: 'Sweden',
    opcos: ['mediaMonks', 'umain', 'northell'],
  },
  { name: 'Tesla', country: 'US', countryName: 'United States', opcos: ['tigerton', 'brightStep'] },
  {
    name: 'HSBC',
    country: 'GB',
    countryName: 'United Kingdom',
    opcos: ['umain', 'fabrique', 'northell'],
  },
  { name: 'Carlsberg', country: 'DK', countryName: 'Denmark', opcos: ['mediaMonks', 'tigerton'] },
].map((c, i) => ({ ...c, months: makeMonths(MONTHS_12, c.opcos, (i + 1) * 7919) }));

const clientTotal = (c: Client, monthCount: number) =>
  c.months
    .slice(-monthCount)
    .reduce((sum, row) => sum + c.opcos.reduce((s, key) => s + Number(row[key] ?? 0), 0), 0);

// ── Pieces ───────────────────────────────────────────────────────────────────
const kicker = (text: ReactNode) => (
  <div
    style={{
      font: '700 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--eidra-fg-muted)',
    }}
  >
    {text}
  </div>
);

/** Shared OpCo legend — one swatch per stack segment, in palette order. */
function OpCoLegend() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--eidra-space-3)',
        font: 'var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
        color: 'var(--eidra-fg-muted)',
      }}
    >
      {OPCOS.map((o) => (
        <span
          key={o.key}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-1-5)' }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 'var(--eidra-radius-sm)',
              background: opcoConfig[o.key]?.color,
            }}
          />
          {o.label}
        </span>
      ))}
    </div>
  );
}

/** A single client cell: name + total, then a clean stacked mini bar chart. */
function ClientCell({ client, monthCount }: { client: Client; monthCount: number }) {
  const data = client.months.slice(-monthCount);
  const total = clientTotal(client, monthCount);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-2)',
        padding: 'var(--eidra-space-3)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'var(--eidra-space-2)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--eidra-space-1-5)',
            font: '600 var(--eidra-font-size-sm)/1.2 var(--eidra-font-family-sans)',
            color: 'var(--eidra-fg)',
          }}
        >
          <Flag code={client.country} size="xs" label={client.countryName} />
          {client.name}
        </span>
        <span
          style={{
            font: '700 var(--eidra-font-size-sm)/1.2 var(--eidra-font-family-sans)',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--eidra-fg)',
          }}
        >
          {fmt(total)}
        </span>
      </div>
      <Chart.Container
        config={opcoConfig}
        size="sm"
        style={{ height: 120 }}
        aria-label={`${client.name} — net revenue by operating company over ${monthCount} months`}
      >
        <Chart.BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          {/* Axes & grid disabled — keep the minis clean like the deck. */}
          <Chart.XAxis dataKey="month" hide />
          <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={fmt} />} />
          {client.opcos.map((key, i) => (
            <Chart.Bar
              {...Chart.seriesDefaults}
              key={key}
              dataKey={key}
              stackId="net"
              fill={opcoConfig[key]?.color}
              activeBar={false}
              // Round only the top of the topmost segment in each stack.
              radius={i === client.opcos.length - 1 ? [2, 2, 0, 0] : undefined}
            />
          ))}
        </Chart.BarChart>
      </Chart.Container>
    </div>
  );
}

// Clients ranked by net revenue over the trailing window, limited to the top N.
function rankedClients(monthCount: number, topN: number) {
  return [...CLIENTS]
    .map((c) => ({ client: c, total: clientTotal(c, monthCount) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, topN);
}

/** Ranked "Top clients" panel: flag + name + revenue, sorted descending. */
function TopClientsList({ monthCount, topN }: { monthCount: number; topN: number }) {
  const ranked = rankedClients(monthCount, topN);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-3)',
        padding: 'var(--eidra-space-4)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
        minWidth: 280,
      }}
    >
      {kicker('Top clients')}
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--eidra-space-1)',
        }}
      >
        {ranked.map(({ client, total }, i) => (
          <li
            key={client.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--eidra-space-2)',
              padding: 'var(--eidra-space-1-5) 0',
              borderBottom: i < ranked.length - 1 ? '1px solid var(--eidra-border-subtle)' : 'none',
              font: 'var(--eidra-font-size-sm)/1.2 var(--eidra-font-family-sans)',
              color: 'var(--eidra-fg)',
            }}
          >
            <span
              style={{
                width: 20,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--eidra-fg-muted)',
              }}
            >
              {i + 1}
            </span>
            <Flag code={client.country} size="sm" label={client.countryName} />
            <span style={{ flex: 1 }}>{client.name}</span>
            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(total)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The full page: legend, small-multiples grid, and ranked list side by side. */
function TopClientsPage({
  monthCount,
  topN,
  showRankedList,
}: {
  monthCount: number;
  topN: number;
  showRankedList: boolean;
}) {
  // Show the top-N clients for the window in both the mini grid and the list.
  const shown = rankedClients(monthCount, topN).map((r) => r.client);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <OpCoLegend />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showRankedList ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
          gap: 'var(--eidra-space-4)',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 'var(--eidra-space-4)',
          }}
        >
          {shown.map((c) => (
            <ClientCell key={c.name} client={c} monthCount={monthCount} />
          ))}
        </div>
        {showRankedList && <TopClientsList monthCount={monthCount} topN={topN} />}
      </div>
    </div>
  );
}

/**
 * Shared controls for both windows: `months` slices the trailing window (the only
 * default that differs between the two stories — 12 vs 3), `topN` limits how many
 * clients render in both the mini grid and the ranked list, and `showRankedList`
 * toggles the side panel.
 */
interface TopClientsArgs {
  months: number;
  topN: number;
  showRankedList: boolean;
}

const topClientsArgTypes = {
  months: { control: { type: 'range', min: 1, max: 12, step: 1 } },
  topN: { control: { type: 'range', min: 1, max: 16, step: 1 } },
  showRankedList: { control: 'boolean' },
} as const;

/**
 * **Last 12 months** — twelve monthly stacked bars per client. The wide view from
 * the deck: every client's full-year net-revenue shape, stacked by OpCo. Use the
 * controls to change the trailing window (`months`), limit the client count
 * (`topN`), and toggle the ranked list.
 */
export const LastTwelveMonths: StoryObj<TopClientsArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: topClientsArgTypes,
  args: { months: 12, topN: 16, showRankedList: true },
  render: ({ months, topN, showRankedList }) => (
    <TopClientsPage monthCount={months} topN={topN} showRankedList={showRankedList} />
  ),
};

/**
 * **Last 3 months** — the same grid trimmed to the trailing quarter (three bars per
 * mini), for a recent-activity snapshot. Totals and the ranked list recompute for
 * the shorter window. Use the controls to widen the window (`months`), limit the
 * client count (`topN`), and toggle the ranked list.
 */
export const LastThreeMonths: StoryObj<TopClientsArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: topClientsArgTypes,
  args: { months: 3, topN: 16, showRankedList: true },
  render: ({ months, topN, showRankedList }) => (
    <TopClientsPage monthCount={months} topN={topN} showRankedList={showRankedList} />
  ),
};
