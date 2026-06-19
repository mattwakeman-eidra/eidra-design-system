import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flag } from '@eidra/icons';
import {
  Badge,
  Card,
  Chart,
  DataGrid,
  type ChartConfig,
  type DataGridAccent,
  type DataGridColumnDef,
} from '../index.js';

/**
 * **By Region — recipes.** Documentation, not shipped components: these assemble the
 * monthly financial deck's regional views entirely from design-system primitives
 * (`DataGrid` + `Flag` for the summary table; `Card` + `Chart` + `Flag` + `Badge` for
 * the overview cards). The DS stays domain-agnostic — the finance semantics live here
 * in the recipe; the reusable parts ship in the library.
 */
const meta = {
  title: 'Patterns/By Region',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

// Swedish-style figures: comma decimal, space thousands — matches the deck.
const num = (n: number, dp = 1) =>
  new Intl.NumberFormat('sv-SE', { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(n);
const pct = (n: number) => `${num(n, 1)} %`;

// ── Recipe 1: "By Region" summary table (deck page 4) ────────────────────────

interface RegionRow {
  code: string;
  name: string;
  monthNr: number;
  monthMg: number;
  ytdNr: number;
  ytdMg: number;
}

const REGION_ROWS: RegionRow[] = [
  { code: 'SE', name: 'Sweden', monthNr: 119.2, monthMg: 21.5, ytdNr: 566.6, ytdMg: 19.4 },
  { code: 'NO', name: 'Norway', monthNr: 25.5, monthMg: 11.1, ytdNr: 126.3, ytdMg: 11.7 },
  { code: 'NL', name: 'Netherlands', monthNr: 23.0, monthMg: 6.3, ytdNr: 123.3, ytdMg: 15.7 },
  { code: 'DE', name: 'DACH', monthNr: 11.6, monthMg: 34.6, ytdNr: 48.4, ytdMg: 20.1 },
  { code: 'US', name: 'USA', monthNr: 8.9, monthMg: 26.2, ytdNr: 38.7, ytdMg: 21.0 },
];

const regionCell = (r: RegionRow) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
    <Flag code={r.code} size="sm" label={r.name} />
    {r.name}
  </span>
);

const REGION_COLUMN: DataGridColumnDef<RegionRow> = {
  id: 'region',
  header: 'Region',
  pinned: true,
  width: 168,
  accessor: (r) => r.name,
  cell: regionCell,
};

const MONTH_GROUP: DataGridColumnDef<RegionRow> = {
  id: 'month',
  header: 'Month',
  columns: [
    { id: 'monthNr', header: 'NR', numeric: true, accessor: (r) => r.monthNr, cell: (r) => num(r.monthNr) },
    {
      id: 'monthMg',
      header: 'MG %',
      numeric: true,
      accessor: (r) => r.monthMg,
      cell: (r) => pct(r.monthMg),
      cellTone: () => 'muted',
    },
  ],
};

const YTD_GROUP: DataGridColumnDef<RegionRow> = {
  id: 'ytd',
  header: 'YTD',
  columns: [
    { id: 'ytdNr', header: 'NR', numeric: true, accessor: (r) => r.ytdNr, cell: (r) => num(r.ytdNr) },
    {
      id: 'ytdMg',
      header: 'MG %',
      numeric: true,
      accessor: (r) => r.ytdMg,
      cell: (r) => pct(r.ytdMg),
      cellTone: () => 'muted',
    },
  ],
};

/**
 * The compact **By Region** panel: a `DataGrid` with a two-tier header (Month / YTD,
 * each Net Revenue + Margin %), a pinned region column rendering a `Flag`, and muted
 * margin cells via `cellTone`. Use the controls to choose which period column groups
 * show (`period`: both / month / ytd) and to switch the grid's `accent` between the
 * finance data-viz palette and the brand accent.
 */
interface SummaryTableArgs {
  period: 'both' | 'month' | 'ytd';
  accent: DataGridAccent;
}

export const SummaryTable: StoryObj<SummaryTableArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    period: { control: 'inline-radio', options: ['both', 'month', 'ytd'] },
    accent: { control: 'inline-radio', options: ['finance', 'brand'] },
  },
  args: { period: 'both', accent: 'finance' },
  render: ({ period, accent }) => {
    const columns: DataGridColumnDef<RegionRow>[] = [
      REGION_COLUMN,
      ...(period !== 'ytd' ? [MONTH_GROUP] : []),
      ...(period !== 'month' ? [YTD_GROUP] : []),
    ];
    return (
      <div style={{ maxWidth: 560 }}>
        <DataGrid<RegionRow>
          aria-label="Net revenue and margin by region"
          accent={accent}
          columns={columns}
          data={REGION_ROWS}
          getRowId={(r) => r.code}
        />
      </div>
    );
  },
};

// ── Recipe 2: "Regional Overview" cards (deck pages 5–6) ─────────────────────

// Prior / forecast / current — neutral monochrome triple, matching the deck.
const SERIES = [
  { key: '2025', color: 'var(--eidra-finance-comparison)' },
  { key: 'FC1', color: 'var(--eidra-color-grey-300)' },
  { key: '2026', color: 'var(--eidra-fg)' },
] as const;
const periodConfig: ChartConfig = Object.fromEntries(
  SERIES.map((s) => [s.key, { label: s.key, color: s.color }]),
);

type Triple = [number, number, number]; // [2025, FC1, 2026]
interface RegionCard {
  code: string;
  name: string;
  ebitdaMargin: number;
  netRevenue: Triple;
  opEbitda: Triple;
  regionalContribution: Triple;
  legalContribution: Triple;
}

const REGION_CARDS: RegionCard[] = [
  { code: 'SE', name: 'Sweden', ebitdaMargin: 21.5, netRevenue: [104.9, 116.8, 119.2], opEbitda: [12.8, 18.6, 21.5], regionalContribution: [13.4, 21.7, 25.6], legalContribution: [9.5, 18.7, 22.5] },
  { code: 'NO', name: 'Norway', ebitdaMargin: 11.1, netRevenue: [21.4, 24.0, 25.5], opEbitda: [7.9, 9.8, 11.1], regionalContribution: [2.9, 3.6, 4.2], legalContribution: [1.7, 2.0, 2.5] },
  { code: 'NL', name: 'Netherlands', ebitdaMargin: 6.3, netRevenue: [19.8, 21.7, 23.0], opEbitda: [4.1, 5.5, 6.3], regionalContribution: [1.9, 2.6, 3.1], legalContribution: [1.2, 1.7, 2.0] },
  { code: 'DE', name: 'DACH', ebitdaMargin: 34.6, netRevenue: [8.4, 10.2, 11.6], opEbitda: [22.0, 29.5, 34.6], regionalContribution: [3.0, 3.7, 4.4], legalContribution: [2.1, 2.8, 3.3] },
  { code: 'US', name: 'USA', ebitdaMargin: 26.2, netRevenue: [6.2, 7.6, 8.9], opEbitda: [15.4, 21.5, 26.2], regionalContribution: [1.4, 2.0, 2.5], legalContribution: [0.9, 1.4, 1.8] },
];

const miniTitle = (text: string) => (
  <div
    style={{
      font: '600 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
      color: 'var(--eidra-fg-muted)',
      marginBottom: 'var(--eidra-space-2)',
    }}
  >
    {text}
  </div>
);

function MiniBars({ values, percent = false, showLabels = true }: { values: Triple; percent?: boolean; showLabels?: boolean }) {
  const data = SERIES.map((s, i) => ({ period: s.key, value: values[i] }));
  return (
    <Chart.Container config={periodConfig} style={{ height: 116 }}>
      <Chart.BarChart data={data} margin={{ top: 18, right: 4, bottom: 0, left: 4 }}>
        <Chart.XAxis dataKey="period" {...Chart.axisProps} />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="value" radius={[2, 2, 0, 0]}>
          {SERIES.map((s) => (
            <Chart.Cell key={s.key} fill={s.color} />
          ))}
          {showLabels && (
            <Chart.LabelList
              dataKey="value"
              position="top"
              fontSize={11}
              formatter={(v) => (percent ? pct(Number(v)) : num(Number(v)))}
            />
          )}
        </Chart.Bar>
      </Chart.BarChart>
    </Chart.Container>
  );
}

function RegionOverviewCard({ region, showLabels = true, showMargin = true }: { region: RegionCard; showLabels?: boolean; showMargin?: boolean }) {
  return (
    <Card variant="outline" padding="none">
      <Card.Header
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--eidra-space-2)' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-2)', fontWeight: 'var(--eidra-font-weight-medium)' }}>
          <Flag code={region.code} size="md" label={region.name} />
          {region.name}
        </span>
        {showMargin && <Badge tone="neutral" variant="subtle">{pct(region.ebitdaMargin)}</Badge>}
      </Card.Header>
      <Card.Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--eidra-space-4)' }}>
          <div>{miniTitle('Net Revenue (MSEK)')}<MiniBars values={region.netRevenue} showLabels={showLabels} /></div>
          <div>{miniTitle('OP EBITDA %')}<MiniBars values={region.opEbitda} percent showLabels={showLabels} /></div>
          <div>{miniTitle('Regional Contribution (MSEK)')}<MiniBars values={region.regionalContribution} showLabels={showLabels} /></div>
          <div>{miniTitle('Legal Contribution (MSEK)')}<MiniBars values={region.legalContribution} showLabels={showLabels} /></div>
        </div>
      </Card.Body>
    </Card>
  );
}

/**
 * The **Regional Overview** card grid: one `Card` per region with a `Flag` + name
 * header, an EBITDA-margin `Badge`, and a 2×2 grid of mini `Chart.BarChart`s comparing
 * 2025 / FC1 / 2026 (prior / forecast / current) with value labels. Use the controls
 * to toggle the mini-bar value labels (`showLabels`) and the EBITDA-margin `Badge`
 * (`showMargin`), and to lay out the grid — `columns` fixes the column count while
 * `minCardWidth` sets each card's minimum width.
 */
interface RegionalOverviewArgs {
  showLabels: boolean;
  showMargin: boolean;
  columns: number;
  minCardWidth: number;
}

export const RegionalOverview: StoryObj<RegionalOverviewArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showLabels: { control: 'boolean' },
    showMargin: { control: 'boolean' },
    columns: { control: { type: 'range', min: 1, max: 5, step: 1 } },
    minCardWidth: { control: { type: 'range', min: 240, max: 480, step: 20 } },
  },
  args: { showLabels: true, showMargin: true, columns: 2, minCardWidth: 340 },
  render: ({ showLabels, showMargin, columns, minCardWidth }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(${minCardWidth}px, 1fr))`,
        gap: 'var(--eidra-space-4)',
      }}
    >
      {REGION_CARDS.map((r) => (
        <RegionOverviewCard key={r.code} region={r} showLabels={showLabels} showMargin={showMargin} />
      ))}
    </div>
  ),
};
