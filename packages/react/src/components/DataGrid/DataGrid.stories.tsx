import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataGrid, type DataGridColumnDef } from './DataGrid.js';
import { EditableNumberCell } from './EditableNumberCell.js';

const meta = {
  title: 'Data Display/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  // Placeholder required props; every story below supplies real data via `render`.
  args: { columns: [], data: [], getRowId: () => '' },
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Synthetic, domain-agnostic forecast data (no real invoicing data) ────────
interface MonthCell {
  total: number | null;
  sold: number | null;
  overridden?: boolean;
}
interface ForecastRow {
  id: string;
  client: string;
  opco: string;
  owner: string;
  months: Record<string, MonthCell>;
  children?: ForecastRow[];
}

const MONTHS = ['Jan', 'Feb', 'Mar'];

const SAMPLE: ForecastRow[] = [
  {
    id: 'acme',
    client: 'Acme Corp',
    opco: 'Fabrique',
    owner: 'A. Lindqvist',
    months: {
      Jan: { total: 120, sold: 120 },
      Feb: { total: 140, sold: 130, overridden: true },
      Mar: { total: 160, sold: 150 },
    },
    children: [
      {
        id: 'acme-p1',
        client: 'Platform rebuild',
        opco: 'Fabrique',
        owner: 'A. Lindqvist',
        months: {
          Jan: { total: 80, sold: 80 },
          Feb: { total: 90, sold: 90 },
          Mar: { total: 100, sold: 100 },
        },
      },
      {
        id: 'acme-p2',
        client: 'Design system',
        opco: 'Fabrique',
        owner: 'A. Lindqvist',
        months: {
          Jan: { total: 40, sold: 40 },
          Feb: { total: 50, sold: 40, overridden: true },
          Mar: { total: 60, sold: 50 },
        },
      },
    ],
  },
  {
    id: 'globex',
    client: 'Globex',
    opco: 'Q42',
    owner: 'M. Persson',
    months: {
      Jan: { total: 90, sold: 90 },
      Feb: { total: 110, sold: 110 },
      Mar: { total: null, sold: null },
    },
  },
  {
    id: 'initech',
    client: 'Initech',
    opco: 'GP NL',
    owner: 'J. de Vries',
    months: {
      Jan: { total: 60, sold: 55 },
      Feb: { total: 70, sold: 70 },
      Mar: { total: 75, sold: 70 },
    },
  },
];

const sum = (rows: ForecastRow[], month: string, field: keyof MonthCell) =>
  rows.reduce((acc, r) => acc + (Number(r.months[month]?.[field]) || 0), 0);

function buildColumns(
  onEdit: (rowId: string, month: string, value: number | null) => void,
): DataGridColumnDef<ForecastRow>[] {
  return [
    { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 200, sortable: true },
    { id: 'opco', header: 'Opco', accessor: (r) => r.opco, pinned: true, width: 130, sortable: true },
    { id: 'owner', header: 'Owner', accessor: (r) => r.owner, width: 150 },
    ...MONTHS.map(
      (m): DataGridColumnDef<ForecastRow> => ({
        id: m,
        header: m,
        columns: [
          {
            id: `${m}-total`,
            header: 'Total',
            numeric: true,
            width: 90,
            accessor: (r) => r.months[m]?.total ?? null,
            footer: (rows) => sum(rows, m, 'total'),
          },
          {
            id: `${m}-sold`,
            header: 'Sold',
            numeric: true,
            width: 110,
            footer: (rows) => sum(rows, m, 'sold'),
            cell: (r) => {
              const cell = r.months[m];
              const aggregated = !!r.children;
              return (
                <EditableNumberCell
                  value={cell?.sold ?? null}
                  overridden={cell?.overridden}
                  aggregated={aggregated}
                  onCommit={(v) => onEdit(r.id, m, v)}
                  title={aggregated ? 'Aggregated from projects' : 'Click to override'}
                />
              );
            },
          },
        ],
      }),
    ),
  ];
}

/** Full forecast-style grid: grouped header, pinned columns, sort, expandable rows, totals, inline edit. */
export const ForecastGrid: Story = {
  render: () => {
    const [data, setData] = useState(SAMPLE);
    const onEdit = (rowId: string, month: string, value: number | null) =>
      setData((prev) =>
        prev.map((r) => {
          if (r.id !== rowId) return r;
          const existing: MonthCell = r.months[month] ?? { total: null, sold: null };
          return { ...r, months: { ...r.months, [month]: { ...existing, sold: value, overridden: true } } };
        }),
      );
    return (
      <div style={{ height: 420 }}>
        <DataGrid<ForecastRow>
          aria-label="Sold & forecast"
          accent="finance"
          columns={buildColumns(onEdit)}
          data={data}
          getRowId={(r) => r.id}
          getSubRows={(r) => r.children}
          getRowSearchText={(r) => `${r.client} ${r.opco} ${r.owner}`}
        />
      </div>
    );
  },
};

// ── Sold & Forecast parity: 12 months, 3 pinned cols, NOW highlight, top totals ──
const YEAR_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const NOW_MONTH = 'Jun';

// Expand the 3-month SAMPLE into a full year deterministically (illustrative data).
const expandYear = (rows: ForecastRow[]): ForecastRow[] =>
  rows.map((r) => {
    const base = r.months.Jan?.total ?? 60;
    const months: Record<string, MonthCell> = {};
    YEAR_MONTHS.forEach((m, i) => {
      const total = base + i * 7 + (r.id.length % 5) * 3;
      const sold = Math.round(total * (i < 5 ? 1 : 0.85));
      months[m] = { total, sold, overridden: m === 'Feb' && i === 1 };
    });
    return { ...r, months, children: r.children ? expandYear(r.children) : undefined };
  });

const YEAR_SAMPLE = expandYear(SAMPLE);

function buildYearColumns(
  onEdit: (rowId: string, month: string, value: number | null) => void,
): DataGridColumnDef<ForecastRow>[] {
  return [
    { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 180, sortable: true },
    { id: 'opco', header: 'Company', accessor: (r) => r.opco, pinned: true, width: 140, sortable: true },
    { id: 'owner', header: 'Account owner', accessor: (r) => r.owner, pinned: true, width: 160 },
    ...YEAR_MONTHS.map(
      (m): DataGridColumnDef<ForecastRow> => ({
        id: m,
        header: m === NOW_MONTH ? `${m} · NOW` : m,
        columns: [
          {
            id: `${m}-total`,
            header: 'Total',
            numeric: true,
            width: 90,
            highlighted: m === NOW_MONTH,
            highlightTone: 'finance',
            accessor: (r) => r.months[m]?.total ?? null,
            footer: (rows) => sum(rows, m, 'total'),
          },
          {
            id: `${m}-sold`,
            header: 'Sold',
            numeric: true,
            width: 90,
            highlighted: m === NOW_MONTH,
            highlightTone: 'finance',
            footer: (rows) => sum(rows, m, 'sold'),
            cell: (r) => {
              const cell = r.months[m];
              const aggregated = !!r.children;
              return (
                <EditableNumberCell
                  value={cell?.sold ?? null}
                  overridden={cell?.overridden}
                  aggregated={aggregated}
                  onCommit={(v) => onEdit(r.id, m, v)}
                />
              );
            },
          },
        ],
      }),
    ),
  ];
}

/**
 * Full "Sold & Forecast" parity: 3 pinned leading columns + 12 grouped scrolling
 * months under fixed layout (pinned offsets stay aligned), top-placed totals, the
 * current month highlighted top-to-bottom, and compact density.
 */
export const SoldForecastParity: Story = {
  render: () => {
    const [data, setData] = useState(YEAR_SAMPLE);
    const onEdit = (rowId: string, month: string, value: number | null) =>
      setData((prev) =>
        prev.map((r) => {
          if (r.id !== rowId) return r;
          const existing: MonthCell = r.months[month] ?? { total: null, sold: null };
          return { ...r, months: { ...r.months, [month]: { ...existing, sold: value, overridden: true } } };
        }),
      );
    return (
      <div style={{ height: 460 }}>
        <DataGrid<ForecastRow>
          aria-label="Sold & forecast — full year"
          accent="finance"
          tableLayout="fixed"
          totalsPlacement="top"
          density="compact"
          columns={buildYearColumns(onEdit)}
          data={data}
          getRowId={(r) => r.id}
          getSubRows={(r) => r.children}
          getRowSearchText={(r) => `${r.client} ${r.opco} ${r.owner}`}
        />
      </div>
    );
  },
};

/**
 * Per-instance density: the same grid rendered comfortable and compact side by
 * side. Density is a prop, so one page can mix relaxed and information-dense tables.
 */
export const Density: Story = {
  render: () => {
    const cols: DataGridColumnDef<ForecastRow>[] = [
      { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 160 },
      { id: 'opco', header: 'Company', accessor: (r) => r.opco },
      { id: 'jan', header: 'Jan', numeric: true, accessor: (r) => r.months.Jan?.total ?? null, footer: (rows) => sum(rows, 'Jan', 'total') },
      { id: 'feb', header: 'Feb', numeric: true, accessor: (r) => r.months.Feb?.total ?? null, footer: (rows) => sum(rows, 'Feb', 'total') },
    ];
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-6)' }}>
        <div>
          <p style={{ font: 'var(--eidra-font-size-sm)/1.4 var(--eidra-font-family-sans)', color: 'var(--eidra-fg-muted)', marginBottom: 'var(--eidra-space-2)' }}>
            density=&quot;comfortable&quot; (default)
          </p>
          <DataGrid<ForecastRow> aria-label="Comfortable" density="comfortable" columns={cols} data={SAMPLE} getRowId={(r) => r.id} />
        </div>
        <div>
          <p style={{ font: 'var(--eidra-font-size-sm)/1.4 var(--eidra-font-family-sans)', color: 'var(--eidra-fg-muted)', marginBottom: 'var(--eidra-space-2)' }}>
            density=&quot;compact&quot;
          </p>
          <DataGrid<ForecastRow> aria-label="Compact" density="compact" columns={cols} data={SAMPLE} getRowId={(r) => r.id} />
        </div>
      </div>
    );
  },
};

/**
 * Fixed layout with multiple pinned columns. `tableLayout="fixed"` makes rendered
 * widths equal declared widths, so the 3 pinned columns stay flush and opaque with
 * nothing bleeding through as the 12 months scroll horizontally.
 */
export const FixedLayoutPinnedColumns: Story = {
  render: () => (
    <div style={{ height: 360 }}>
      <DataGrid<ForecastRow>
        aria-label="Fixed layout, pinned columns"
        accent="finance"
        tableLayout="fixed"
        columns={buildYearColumns(() => {})}
        data={YEAR_SAMPLE}
        getRowId={(r) => r.id}
        getSubRows={(r) => r.children}
      />
    </div>
  ),
};

/** Totals pinned to the top, directly under the header, instead of the foot. */
export const TotalsOnTop: Story = {
  render: () => (
    <div style={{ height: 320 }}>
      <DataGrid<ForecastRow>
        aria-label="Totals on top"
        accent="finance"
        tableLayout="fixed"
        totalsPlacement="top"
        columns={buildYearColumns(() => {})}
        data={YEAR_SAMPLE}
        getRowId={(r) => r.id}
        getSubRows={(r) => r.children}
      />
    </div>
  ),
};

/**
 * A single highlighted column tinted top-to-bottom (header → cells → totals) with a
 * top accent border — used to flag the current "NOW" month. `highlightTone` selects
 * the tint family.
 */
export const ColumnHighlight: Story = {
  render: () => (
    <DataGrid<ForecastRow>
      aria-label="Column highlight"
      columns={[
        { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 160 },
        { id: 'jan', header: 'Jan', numeric: true, accessor: (r) => r.months.Jan?.total ?? null, footer: (rows) => sum(rows, 'Jan', 'total') },
        { id: 'feb', header: 'Feb · NOW', numeric: true, highlighted: true, highlightTone: 'accent', accessor: (r) => r.months.Feb?.total ?? null, footer: (rows) => sum(rows, 'Feb', 'total') },
        { id: 'mar', header: 'Mar', numeric: true, accessor: (r) => r.months.Mar?.total ?? null, footer: (rows) => sum(rows, 'Mar', 'total') },
      ]}
      data={SAMPLE}
      getRowId={(r) => r.id}
    />
  ),
};

/** Minimal flat grid — no groups, no pinning, just sortable columns. */
export const Simple: Story = {
  render: () => (
    <DataGrid<ForecastRow>
      aria-label="Clients"
      columns={[
        { id: 'client', header: 'Client', accessor: (r) => r.client, sortable: true },
        { id: 'opco', header: 'Opco', accessor: (r) => r.opco, sortable: true },
        { id: 'owner', header: 'Owner', accessor: (r) => r.owner },
        { id: 'jan', header: 'Jan total', numeric: true, accessor: (r) => r.months.Jan?.total ?? null, sortable: true },
      ]}
      data={SAMPLE}
      getRowId={(r) => r.id}
    />
  ),
};
