import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, fireEvent, expect, waitFor, fn } from 'storybook/test';
import { Button } from '../Button/Button.js';
import { Input } from '../Input/Input.js';
import { DataGrid, type DataGridColumnDef, type DataGridSort } from './DataGrid.js';
import { EditableNumberCell } from './EditableNumberCell.js';
import { EditableSelectCell } from './EditableSelectCell.js';
import { EditableTextCell } from './EditableTextCell.js';

const meta = {
  title: 'Data Display/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
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

/**
 * **Playground.** Exercise the grid's scalar layout/theming props from the
 * controls panel against a fixed flat fixture (the columns/data/render props are
 * authored in code, not from controls). Toggle `accent`, `density`,
 * `totalsPlacement`, `tableLayout`, and `showFooter`.
 */
const PLAYGROUND_COLUMNS: DataGridColumnDef<ForecastRow>[] = [
  { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 180, sortable: true },
  { id: 'opco', header: 'Opco', accessor: (r) => r.opco, width: 140, sortable: true },
  { id: 'owner', header: 'Owner', accessor: (r) => r.owner, width: 160 },
  { id: 'jan', header: 'Jan', numeric: true, width: 100, accessor: (r) => r.months.Jan?.total ?? null, footer: (rows) => sum(rows, 'Jan', 'total') },
  { id: 'feb', header: 'Feb', numeric: true, width: 100, accessor: (r) => r.months.Feb?.total ?? null, footer: (rows) => sum(rows, 'Feb', 'total') },
  { id: 'mar', header: 'Mar', numeric: true, width: 100, accessor: (r) => r.months.Mar?.total ?? null, footer: (rows) => sum(rows, 'Mar', 'total') },
];

export const Playground: Story = {
  // Whitelist only the scalar layout/theming knobs — re-enabling *all* controls would
  // expose `columns`/`data`/`getRowId` (arrays + functions) as object editors, which crash.
  parameters: {
    controls: {
      include: ['accent', 'density', 'totalsPlacement', 'tableLayout', 'showFooter'],
    },
  },
  argTypes: {
    accent: { control: 'inline-radio', options: ['brand', 'finance'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    totalsPlacement: { control: 'inline-radio', options: ['bottom', 'top'] },
    tableLayout: { control: 'inline-radio', options: ['auto', 'fixed'] },
    showFooter: { control: 'boolean' },
  },
  args: {
    accent: 'brand',
    density: 'comfortable',
    totalsPlacement: 'bottom',
    tableLayout: 'auto',
    showFooter: true,
  },
  render: (args) => (
    <div style={{ height: 360 }}>
      <DataGrid<ForecastRow>
        {...args}
        aria-label="Playground"
        columns={PLAYGROUND_COLUMNS}
        data={SAMPLE}
        getRowId={(r) => r.id}
        getSubRows={(r) => r.children}
        getRowSearchText={(r) => `${r.client} ${r.opco} ${r.owner}`}
      />
    </div>
  ),
};

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
  // Tree-row expand/collapse + inline numeric edit (commit-on-Enter, the host
  // re-renders the new value). The expand toggle is an aria-labelled <button>.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('expanding a parent row reveals its child rows', async () => {
      // Acme Corp is collapsed initially → its projects are not in the DOM.
      await expect(canvas.queryByText('Platform rebuild')).toBeNull();
      const expand = canvas.getByRole('button', { name: /expand row/i });
      await userEvent.click(expand);
      await expect(canvas.getByText('Platform rebuild')).toBeInTheDocument();
      await expect(canvas.getByText('Design system')).toBeInTheDocument();
    });

    await step('collapsing the parent hides the children again', async () => {
      const collapse = canvas.getByRole('button', { name: /collapse row/i });
      await userEvent.click(collapse);
      await waitFor(() => expect(canvas.queryByText('Platform rebuild')).toBeNull());
    });

    await step('clicking a Sold cell opens an inline editor; Enter commits the new value', async () => {
      // Globex Jan Sold is 90 — find its click-to-edit button and override it.
      const soldButton = canvas.getByRole('button', { name: /^90/ });
      await userEvent.click(soldButton);
      const input = canvas.getByRole('spinbutton');
      await expect(input).toHaveFocus();
      await userEvent.clear(input);
      await userEvent.type(input, '95');
      await userEvent.keyboard('{Enter}');
      // The committed value re-renders as a resting cell button.
      await expect(canvas.getByRole('button', { name: /^95/ })).toBeInTheDocument();
    });
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
 * **Finance theme.** `accent="finance"` repoints the grid's accent tokens
 * (`--eidra-accent*` → `--eidra-finance-accent*`) for that grid subtree only — no
 * global theme change. Everything that reads the accent follows: sort glyphs, the
 * focus ring, the `EditableNumberCell` override/aggregate markers, and a
 * `highlightTone="accent"` column tint. It's scoped because in a financial colour
 * grammar the brand orange reads as caution/at-risk (RAG), so the action accent
 * becomes the data-viz blue. Below: the same grid as `brand` (default) vs `finance`.
 *
 * Edit a **Sold** cell in each to compare the override marker colour.
 */
export const FinanceTheme: Story = {
  render: () => {
    const [data, setData] = useState(SAMPLE);
    const onEdit = (rowId: string, value: number | null) =>
      setData((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? { ...r, months: { ...r.months, Jan: { ...(r.months.Jan ?? { total: null, sold: null }), sold: value, overridden: true } } }
            : r,
        ),
      );
    const cols: DataGridColumnDef<ForecastRow>[] = [
      { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 160, sortable: true },
      { id: 'owner', header: 'Owner', accessor: (r) => r.owner, sortable: true },
      {
        id: 'jan-sold',
        header: 'Jan sold',
        numeric: true,
        width: 130,
        footer: (rows) => sum(rows, 'Jan', 'sold'),
        cell: (r) => (
          <EditableNumberCell
            value={r.months.Jan?.sold ?? null}
            overridden={r.months.Jan?.overridden}
            onCommit={(v) => onEdit(r.id, v)}
          />
        ),
      },
      { id: 'feb', header: 'Feb · NOW', numeric: true, width: 110, highlighted: true, accessor: (r) => r.months.Feb?.total ?? null, footer: (rows) => sum(rows, 'Feb', 'total') },
    ];
    const label = { font: 'var(--eidra-font-size-sm)/1.4 var(--eidra-font-family-sans)', color: 'var(--eidra-fg-muted)', marginBottom: 'var(--eidra-space-2)' } as const;
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-6)' }}>
        <div>
          <p style={label}>accent=&quot;brand&quot; (default) — accent is orange</p>
          <DataGrid<ForecastRow> aria-label="Brand accent" accent="brand" columns={cols} data={data} getRowId={(r) => r.id} />
        </div>
        <div>
          <p style={label}>accent=&quot;finance&quot; — accent repointed to the data-viz blue</p>
          <DataGrid<ForecastRow> aria-label="Finance accent" accent="finance" columns={cols} data={data} getRowId={(r) => r.id} />
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

// ── Cell tone + cell drill-down ──────────────────────────────────────────────
interface LedgerLine {
  entry: string;
  date: string;
  description: string;
  amount: number;
}
interface LedgerRow {
  id: string;
  opco: string;
  revenue: number;
  /** Net position: positive = WIP, negative = deferred. */
  net: number;
  lines: LedgerLine[];
}

const LEDGER: LedgerRow[] = [
  {
    id: 'fabrique',
    opco: 'Fabrique',
    revenue: 120_000,
    net: 18_000,
    lines: [
      { entry: 'INV-1042', date: '2026-05-31', description: 'May retainer', amount: 80_000 },
      { entry: 'INV-1051', date: '2026-06-14', description: 'Sprint 24 overage', amount: 40_000 },
    ],
  },
  {
    id: 'q42',
    opco: 'Q42',
    revenue: 96_000,
    net: -12_500,
    lines: [
      { entry: 'INV-2210', date: '2026-06-02', description: 'Discovery phase', amount: 96_000 },
    ],
  },
  {
    id: 'gpnl',
    opco: 'GP NL',
    revenue: 64_000,
    net: 0,
    lines: [
      { entry: 'INV-3300', date: '2026-06-10', description: 'Monthly fee', amount: 64_000 },
    ],
  },
];

const eur = (n: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/**
 * **Cell tone + cell drill-down.** `cellTone` tints a cell by its value or state
 * (here: net position positive → green WIP, negative → red deferred, zero → muted).
 * `renderCellDetail` makes a column's cells clickable — clicking opens a full-width
 * detail row beneath (one at a time). Click a **Revenue** cell to see its invoice lines.
 */
export const CellTonesAndDrilldown: Story = {
  render: () => {
    const cols: DataGridColumnDef<LedgerRow>[] = [
      { id: 'opco', header: 'Company', accessor: (r) => r.opco, pinned: true, width: 160 },
      {
        id: 'revenue',
        header: 'Revenue',
        numeric: true,
        width: 150,
        accessor: (r) => r.revenue,
        cell: (r) => eur(r.revenue),
        footer: (rows) => eur(rows.reduce((s, r) => s + r.revenue, 0)),
        renderCellDetail: (r) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1)' }}>
            <div style={{ font: '600 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--eidra-fg-muted)' }}>
              {r.opco} — invoice lines
            </div>
            <table style={{ width: '100%', fontSize: 'var(--eidra-font-size-xs)', borderCollapse: 'collapse' }}>
              <tbody>
                {r.lines.map((l) => (
                  <tr key={l.entry}>
                    <td style={{ padding: '2px 12px 2px 0', fontFamily: 'var(--eidra-font-family-mono)', color: 'var(--eidra-fg-muted)' }}>{l.entry}</td>
                    <td style={{ padding: '2px 12px 2px 0', color: 'var(--eidra-fg-muted)' }}>{l.date}</td>
                    <td style={{ padding: '2px 12px 2px 0' }}>{l.description}</td>
                    <td style={{ padding: '2px 0', textAlign: 'right', fontFamily: 'var(--eidra-font-family-mono)' }}>{eur(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: 'net',
        header: 'Net position',
        numeric: true,
        width: 150,
        accessor: (r) => r.net,
        cell: (r) => (r.net === 0 ? 'Balanced' : r.net > 0 ? `${eur(r.net)} WIP` : `${eur(-r.net)} deferred`),
        cellTone: (value) => {
          const n = Number(value);
          if (n > 0) return 'positive';
          if (n < 0) return 'negative';
          return 'muted';
        },
        footer: (rows) => eur(rows.reduce((s, r) => s + r.net, 0)),
      },
    ];
    return (
      <div style={{ height: 320 }}>
        <DataGrid<LedgerRow>
          aria-label="Ledger with cell tones and drill-down"
          accent="finance"
          columns={cols}
          data={LEDGER}
          getRowId={(r) => r.id}
        />
      </div>
    );
  },
  // Cell drill-down: a renderCellDetail column's cells are <button aria-expanded>.
  // Clicking opens a full-width detail row beneath; only one detail is open at a
  // time across the grid, and clicking the same cell again closes it.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('clicking a Revenue cell opens its detail row with invoice lines', async () => {
      const fabriqueRevenue = canvas.getByRole('button', { name: /120,000/ });
      await expect(fabriqueRevenue).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(fabriqueRevenue);
      await expect(fabriqueRevenue).toHaveAttribute('aria-expanded', 'true');
      await expect(canvas.getByText('Fabrique — invoice lines')).toBeInTheDocument();
      await expect(canvas.getByText('INV-1042')).toBeInTheDocument();
    });

    await step('opening another cell closes the first (one detail at a time)', async () => {
      const q42Revenue = canvas.getByRole('button', { name: /96,000/ });
      await userEvent.click(q42Revenue);
      await expect(q42Revenue).toHaveAttribute('aria-expanded', 'true');
      await waitFor(() => expect(canvas.queryByText('Fabrique — invoice lines')).toBeNull());
      await expect(canvas.getByText('Q42 — invoice lines')).toBeInTheDocument();
    });

    await step('clicking the open cell again closes its detail', async () => {
      const q42Revenue = canvas.getByRole('button', { name: /96,000/ });
      await userEvent.click(q42Revenue);
      await expect(q42Revenue).toHaveAttribute('aria-expanded', 'false');
      await waitFor(() => expect(canvas.queryByText('Q42 — invoice lines')).toBeNull());
    });
  },
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
  // Uncontrolled sort: clicking a sortable header cycles asc → desc → off and
  // reorders the rendered rows. The header renders a <button> with an accessible
  // "Sort by …" name (no controlled `sort` prop, so the grid owns the state).
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const rowOrder = () =>
      canvas
        .getAllByRole('row')
        // drop the header row (no rowheader cell text we track); read first data cell
        .map((tr) => tr.querySelector('td')?.textContent ?? '')
        .filter(Boolean);

    await step('first click on Jan total sorts ascending (smallest first)', async () => {
      const janSort = canvas.getByRole('button', { name: /sort by jan total/i });
      await userEvent.click(janSort);
      // SAMPLE Jan totals: Acme 120, Globex 90, Initech 60 → asc: Initech, Globex, Acme
      const order = rowOrder();
      await expect(order[0]).toBe('Initech');
      await expect(order[order.length - 1]).toBe('Acme Corp');
    });

    await step('second click reverses to descending', async () => {
      const janSort = canvas.getByRole('button', { name: /sort by jan total/i });
      await userEvent.click(janSort);
      const order = rowOrder();
      await expect(order[0]).toBe('Acme Corp');
      await expect(order[order.length - 1]).toBe('Initech');
    });

    await step('third click clears the sort (back to data order)', async () => {
      const janSort = canvas.getByRole('button', { name: /sort by jan total/i });
      await userEvent.click(janSort);
      const order = rowOrder();
      // data order: Acme, Globex, Initech
      await expect(order[0]).toBe('Acme Corp');
      await expect(order[1]).toBe('Globex');
      await expect(order[2]).toBe('Initech');
    });
  },
};

/**
 * **Controlled sort.** The host owns `sort` and is notified via `onSortChange`;
 * the grid renders strictly from the prop. Clicking a sortable header fires the
 * callback with the next sort in the asc → desc → null cycle.
 */
const controlledSortSpy = fn();
export const ControlledSort: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [sort, setSort] = useState<DataGridSort | null>({ columnId: 'client', direction: 'asc' });
    return (
      <DataGrid<ForecastRow>
        aria-label="Controlled sort"
        columns={[
          { id: 'client', header: 'Client', accessor: (r) => r.client, sortable: true },
          { id: 'opco', header: 'Opco', accessor: (r) => r.opco, sortable: true },
          { id: 'owner', header: 'Owner', accessor: (r) => r.owner },
        ]}
        data={SAMPLE}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={(next) => {
          controlledSortSpy(next);
          setSort(next);
        }}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    controlledSortSpy.mockClear();

    await step('clicking the already-asc Client header advances to desc and notifies', async () => {
      const clientSort = canvas.getByRole('button', { name: /sort by client/i });
      await userEvent.click(clientSort);
      await expect(controlledSortSpy).toHaveBeenCalledWith({ columnId: 'client', direction: 'desc' });
    });

    await step('clicking a different header resets to asc on that column', async () => {
      const opcoSort = canvas.getByRole('button', { name: /sort by opco/i });
      await userEvent.click(opcoSort);
      await expect(controlledSortSpy).toHaveBeenLastCalledWith({ columnId: 'opco', direction: 'asc' });
    });
  },
};

// ── Editable select / text cells + drag-fill ─────────────────────────────────
type ReviewStatus = '' | 'todo' | 'investigating' | 'cleared';

interface ReviewRow {
  id: string;
  client: string;
  amount: number;
  status: ReviewStatus;
  note: string;
}

const STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: '', label: '—' },
  { value: 'todo', label: 'To do' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'cleared', label: 'Cleared' },
];

const REVIEW_SAMPLE: ReviewRow[] = [
  { id: 'r1', client: 'Acme Corp', amount: 120_000, status: 'todo', note: 'Awaiting PO' },
  { id: 'r2', client: 'Globex', amount: 96_000, status: '', note: '' },
  { id: 'r3', client: 'Initech', amount: 64_000, status: 'investigating', note: 'Disputed line' },
  { id: 'r4', client: 'Umbrella', amount: 48_000, status: '', note: '' },
  { id: 'r5', client: 'Soylent', amount: 32_000, status: 'cleared', note: 'Signed off' },
];

/**
 * **`EditableSelectCell`.** Click a status cell to pick from a dropdown; the
 * choice commits on change (Escape cancels). It mirrors `EditableNumberCell`'s
 * override/aggregated affordances and theming — here `accent="finance"` repoints
 * the override marker to the data-viz blue. Uses a native `<select>` for the
 * inline-cell feel rather than the heavier portal-based `Select` primitive.
 */
export const EditableSelect: Story = {
  render: () => {
    const [data, setData] = useState(REVIEW_SAMPLE);
    const setStatus = (id: string, status: ReviewStatus) =>
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const cols: DataGridColumnDef<ReviewRow>[] = [
      { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 180 },
      { id: 'amount', header: 'Amount', numeric: true, width: 130, accessor: (r) => r.amount },
      {
        id: 'status',
        header: 'Status',
        width: 200,
        accessor: (r) => r.status,
        cell: (r) => (
          <EditableSelectCell
            value={r.status || null}
            options={STATUS_OPTIONS}
            overridden={!!r.status}
            onCommit={(v) => setStatus(r.id, (v ?? '') as ReviewStatus)}
            title="Click to set review status"
          />
        ),
      },
    ];
    return (
      <div style={{ height: 320 }}>
        <DataGrid<ReviewRow>
          aria-label="Review status (editable select)"
          accent="finance"
          columns={cols}
          data={data}
          getRowId={(r) => r.id}
        />
      </div>
    );
  },
  // EditableSelectCell: click the resting cell to swap in a native <select>
  // (role combobox); choosing an option commits on change and re-renders the
  // resting label.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('clicking a status cell reveals the select and selecting commits', async () => {
      // Acme (r1) status = "To do" — a unique resting label to target.
      const todoCell = canvas.getByRole('button', { name: /to do/i });
      await userEvent.click(todoCell);
      const select = canvas.getByRole('combobox');
      await expect(select).toHaveValue('todo');
      // Soylent (r5) already shows "Cleared"; committing Acme to "cleared" makes two.
      await expect(canvas.getAllByRole('button', { name: /cleared/i })).toHaveLength(1);
      await userEvent.selectOptions(select, 'cleared');
      await expect(canvas.getAllByRole('button', { name: /cleared/i })).toHaveLength(2);
    });

    await step('Escape cancels an edit without committing', async () => {
      const investigatingCell = canvas.getByRole('button', { name: /investigating/i });
      await userEvent.click(investigatingCell);
      const select = canvas.getByRole('combobox');
      await userEvent.keyboard('{Escape}');
      // Editor closed, value unchanged.
      await waitFor(() => expect(select).not.toBeInTheDocument());
      await expect(canvas.getByRole('button', { name: /investigating/i })).toBeInTheDocument();
    });
  },
};

/**
 * **`EditableTextCell`.** Click a note cell to edit free text. The left column
 * commits on blur/Enter (`debounceMs={0}`, the default); the right column also
 * commits while typing after an 800ms pause (`debounceMs={800}`, the shape the
 * invoicing comment cell uses). Escape reverts either.
 */
export const EditableText: Story = {
  render: () => {
    const [data, setData] = useState(REVIEW_SAMPLE);
    const setNote = (id: string, note: string) =>
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, note } : r)));
    const cols: DataGridColumnDef<ReviewRow>[] = [
      { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 180 },
      {
        id: 'note',
        header: 'Note (commit on blur)',
        width: 260,
        accessor: (r) => r.note,
        cell: (r) => (
          <EditableTextCell
            value={r.note || null}
            placeholder="Add a note…"
            overridden={!!r.note}
            onCommit={(v) => setNote(r.id, v)}
          />
        ),
      },
      {
        id: 'note-debounced',
        header: 'Note (debounced 800ms)',
        width: 260,
        accessor: (r) => r.note,
        cell: (r) => (
          <EditableTextCell
            value={r.note || null}
            debounceMs={800}
            placeholder="Type — saves as you pause…"
            onCommit={(v) => setNote(r.id, v)}
          />
        ),
      },
    ];
    return (
      <div style={{ height: 320 }}>
        <DataGrid<ReviewRow>
          aria-label="Review notes (editable text)"
          columns={cols}
          data={data}
          getRowId={(r) => r.id}
        />
      </div>
    );
  },
  // EditableTextCell: click to edit (role textbox), Enter commits, Escape reverts.
  // Both note columns bind the same row.note, so a commit updates both.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter commits an edited note (both columns reflect the new value)', async () => {
      // r1 note "Awaiting PO" renders in both columns → two resting buttons.
      const restCell = canvas.getAllByRole('button', { name: /awaiting po/i })[0]!;
      await userEvent.click(restCell);
      const input = canvas.getByRole('textbox');
      await expect(input).toHaveFocus();
      await userEvent.clear(input);
      await userEvent.type(input, 'PO received');
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getAllByRole('button', { name: /po received/i })).toHaveLength(2);
    });

    await step('Escape reverts an in-progress edit', async () => {
      const restCell = canvas.getAllByRole('button', { name: /disputed line/i })[0]!;
      await userEvent.click(restCell);
      const input = canvas.getByRole('textbox');
      await userEvent.clear(input);
      await userEvent.type(input, 'this should be discarded');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull());
      // Original value preserved, discarded draft absent.
      await expect(canvas.getAllByRole('button', { name: /disputed line/i })).toHaveLength(2);
      await expect(canvas.queryByText('this should be discarded')).toBeNull();
    });
  },
};

/**
 * **Drag-fill.** Fillable columns (`fillable: true`) show a small accent handle
 * in each cell's corner on hover. Press it and drag down (or up) to paint a
 * contiguous range with that cell's value; release applies it via `onFillRange`
 * (Escape aborts). Opt-in per column, so non-fillable grids are unchanged. Here
 * both **Status** and **Note** are fillable — set a status, then drag its handle
 * down a few rows.
 */
const dragFillSpy = fn();
export const DragFill: Story = {
  render: () => {
    const [data, setData] = useState(REVIEW_SAMPLE);
    const setStatus = (id: string, status: ReviewStatus) =>
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const setNote = (id: string, note: string) =>
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, note } : r)));
    const cols: DataGridColumnDef<ReviewRow>[] = [
      { id: 'client', header: 'Client', accessor: (r) => r.client, pinned: true, width: 180 },
      { id: 'amount', header: 'Amount', numeric: true, width: 120, accessor: (r) => r.amount },
      {
        id: 'status',
        header: 'Status',
        width: 200,
        fillable: true,
        accessor: (r) => r.status,
        cell: (r) => (
          <EditableSelectCell
            value={r.status || null}
            options={STATUS_OPTIONS}
            overridden={!!r.status}
            onCommit={(v) => setStatus(r.id, (v ?? '') as ReviewStatus)}
          />
        ),
      },
      {
        id: 'note',
        header: 'Note',
        width: 240,
        fillable: true,
        accessor: (r) => r.note,
        cell: (r) => (
          <EditableTextCell
            value={r.note || null}
            placeholder="Add a note…"
            overridden={!!r.note}
            onCommit={(v) => setNote(r.id, v)}
          />
        ),
      },
    ];
    // Render order here equals data order (no sort/filter), so the row indices
    // from onFillRange map straight onto `data`.
    const onFillRange = (columnId: string, from: number, to: number, value: unknown) => {
      dragFillSpy(columnId, from, to, value);
      setData((prev) =>
        prev.map((r, i) => {
          if (i < from || i > to) return r;
          if (columnId === 'status') return { ...r, status: (value ?? '') as ReviewStatus };
          if (columnId === 'note') return { ...r, note: String(value ?? '') };
          return r;
        }),
      );
    };
    return (
      <div style={{ height: 340 }}>
        <DataGrid<ReviewRow>
          aria-label="Drag-fill review status and notes"
          accent="finance"
          columns={cols}
          data={data}
          getRowId={(r) => r.id}
          onFillRange={onFillRange}
        />
      </div>
    );
  },
  // Drag-fill gesture: mousedown a cell's fill handle to start, mouseEnter a
  // lower row to extend the range, mouseup (on window) to apply via onFillRange.
  // The handle is a role="presentation" span carrying a descriptive title.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    dragFillSpy.mockClear();

    // Fill handles, in DOM order: row0-status, row0-note, row1-status, … two per row.
    const handles = () =>
      Array.from(
        canvasElement.querySelectorAll<HTMLElement>('[title="Drag down to fill the column with this value"]'),
      );
    // The status <td> for a given row index (every row's status cell).
    const statusCells = () =>
      Array.from(canvasElement.querySelectorAll<HTMLTableCellElement>('tbody td:nth-child(3)'));

    await step('dragging the row-0 Status handle down extends and fills the range', async () => {
      const startHandle = handles()[0]!; // row 0 (Acme, status "todo") status handle
      fireEvent.mouseDown(startHandle);
      // Extend the live range to row 2 by entering its status cell. React maps
      // onMouseEnter onto native mouseover (not the native mouseenter event), so
      // drive the cell's handler with fireEvent.mouseOver — mouseEnter would not
      // reach React's onMouseEnter. The handler is attached once the fill is active.
      fireEvent.mouseOver(statusCells()[1]!);
      fireEvent.mouseOver(statusCells()[2]!);
      // Release anywhere → the grid applies the resolved range.
      fireEvent.mouseUp(window);
      await waitFor(() => expect(dragFillSpy).toHaveBeenCalled());
      // Source column + start row + dragged value are exact; the end row is the
      // last cell entered.
      const [columnId, from, to, value] = dragFillSpy.mock.calls.at(-1) as [
        string,
        number,
        number,
        unknown,
      ];
      await expect(columnId).toBe('status');
      await expect(from).toBe(0);
      await expect(value).toBe('todo');
      await expect(to).toBeGreaterThanOrEqual(from);
    });

    await step('the dragged "To do" status now spans the filled range', async () => {
      // Acme(0) plus the rows it was dragged over all show "To do".
      await waitFor(() =>
        expect(canvas.getAllByRole('button', { name: /to do/i }).length).toBeGreaterThanOrEqual(2),
      );
    });

    await step('Escape during a drag aborts it (no onFillRange call)', async () => {
      dragFillSpy.mockClear();
      const startHandle = handles()[0]!;
      fireEvent.mouseDown(startHandle);
      fireEvent.mouseOver(statusCells()[3]!);
      fireEvent.keyDown(window, { key: 'Escape' });
      fireEvent.mouseUp(window);
      await expect(dragFillSpy).not.toHaveBeenCalled();
    });
  },
};

// ── Editable probability tiers: value tone + editable aggregated rollup ───────
interface ProbRow {
  id: string;
  client: string;
  hi: number | null;
  med: number | null;
  sold: number | null;
  /** Manual override of the aggregated Sold rollup. */
  soldOverride?: boolean;
  children?: ProbRow[];
}

const PROB_SAMPLE: ProbRow[] = [
  {
    id: 'acme',
    client: 'Acme Corp',
    hi: 220,
    med: 90,
    sold: null,
    children: [
      { id: 'acme-web', client: 'Website rebuild', hi: 140, med: 40, sold: 120 },
      { id: 'acme-app', client: 'Mobile app', hi: 80, med: 50, sold: 70 },
    ],
  },
  {
    id: 'globex',
    client: 'Globex',
    hi: 160,
    med: 120,
    sold: 150,
    soldOverride: true,
    children: [
      { id: 'globex-ds', client: 'Design system', hi: 100, med: 60, sold: 90 },
      { id: 'globex-ai', client: 'AI pilot', hi: 60, med: 60, sold: 55 },
    ],
  },
];

const childSoldSum = (r: ProbRow) =>
  r.children?.reduce((s, c) => s + (c.sold ?? 0), 0) ?? null;
/** Resolved Sold: an overridden parent shows its own value, else the rollup. */
const resolvedSold = (r: ProbRow) => (r.children && !r.soldOverride ? childSoldSum(r) : r.sold);

const eurK = (v: number | null) => (v == null ? '—' : `€ ${v}k`);

/**
 * **Editable probability tiers — Sold & Forecast parity.** Two gaps from the
 * invoicing S&F table:
 *
 * - **Value tone** — the **Hi Prob** values render in the success token
 *   (`tone="positive"`) and **Med Prob** in the warning token (`tone="caution"`),
 *   so the tiers read at the *value* level (cell, edit field, and totals), not
 *   just the header.
 * - **Editable aggregated rollup** — a client's **Sold** cell shows the
 *   project-aggregated rollup with the ◆ "aggregated from projects" affordance
 *   **and** is editable. Commit a value and it flips to the ● override marker;
 *   clear it (empty + Enter) to return to the ◆ rollup. Expand a client to edit
 *   its projects.
 */
export const EditableProbabilityTiers: Story = {
  render: () => {
    const [data, setData] = useState(PROB_SAMPLE);

    const editTier = (id: string, key: 'hi' | 'med', value: number | null) =>
      setData((prev) =>
        prev.map((r) => ({
          ...r,
          ...(r.id === id ? { [key]: value } : null),
          children: r.children?.map((c) => (c.id === id ? { ...c, [key]: value } : c)),
        })),
      );

    const editSold = (id: string, value: number | null) =>
      setData((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            // Parent: a value overrides the rollup; clearing returns to aggregated.
            if (r.children) return { ...r, sold: value, soldOverride: value != null };
            return { ...r, sold: value };
          }
          return { ...r, children: r.children?.map((c) => (c.id === id ? { ...c, sold: value } : c)) };
        }),
      );

    const toned = (tone: 'positive' | 'caution', v: number | null) => (
      <span
        style={{
          color: tone === 'positive' ? 'var(--eidra-success)' : 'var(--eidra-warning)',
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {eurK(v)}
      </span>
    );

    const cols: DataGridColumnDef<ProbRow>[] = [
      { id: 'client', header: 'Client / project', accessor: (r) => r.client, pinned: true, width: 200 },
      {
        id: 'hi',
        header: 'Hi Prob',
        numeric: true,
        width: 110,
        accessor: (r) => r.hi,
        cell: (r) => (
          <EditableNumberCell value={r.hi} tone="positive" format={eurK} onCommit={(v) => editTier(r.id, 'hi', v)} />
        ),
        footer: (rows) => toned('positive', rows.reduce((s, r) => s + (r.hi ?? 0), 0)),
      },
      {
        id: 'med',
        header: 'Med Prob',
        numeric: true,
        width: 110,
        accessor: (r) => r.med,
        cell: (r) => (
          <EditableNumberCell value={r.med} tone="caution" format={eurK} onCommit={(v) => editTier(r.id, 'med', v)} />
        ),
        footer: (rows) => toned('caution', rows.reduce((s, r) => s + (r.med ?? 0), 0)),
      },
      {
        id: 'sold',
        header: 'Sold',
        numeric: true,
        width: 120,
        highlighted: true,
        highlightTone: 'finance',
        accessor: (r) => resolvedSold(r),
        cell: (r) => (
          <EditableNumberCell
            value={resolvedSold(r)}
            format={eurK}
            // Parent rows show the editable ◆ rollup until overridden (then ●).
            aggregated={!!r.children && !r.soldOverride}
            overridden={!!r.children && r.soldOverride}
            title={r.children ? 'Aggregated from projects — click to override' : 'Click to edit'}
            onCommit={(v) => editSold(r.id, v)}
          />
        ),
        footer: (rows) => eurK(rows.reduce((s, r) => s + (resolvedSold(r) ?? 0), 0)),
      },
    ];

    return (
      <div style={{ height: 320 }}>
        <DataGrid<ProbRow>
          aria-label="Editable probability tiers with aggregated Sold rollup"
          accent="finance"
          totalsPlacement="top"
          columns={cols}
          data={data}
          getRowId={(r) => r.id}
          getSubRows={(r) => r.children}
          getRowSearchText={(r) => r.client}
        />
      </div>
    );
  },
  // Editable aggregated rollup: a parent's Sold cell shows the project rollup with
  // the ◆ affordance yet stays click-to-edit (EditableNumberCell, unlike the
  // select/text cells, edits even when aggregated). Committing flips it to an
  // explicit override; clearing it (empty + Enter) returns to the rollup.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('editing an aggregated parent Sold overrides the rollup', async () => {
      // Acme rollup = 120 + 70 = 190 → "€ 190k".
      const acmeSold = canvas.getByRole('button', { name: /€ 190k/ });
      await userEvent.click(acmeSold);
      const input = canvas.getByRole('spinbutton');
      await userEvent.clear(input);
      await userEvent.type(input, '200');
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getByRole('button', { name: /€ 200k/ })).toBeInTheDocument();
    });

    await step('clearing the override (empty + Enter) returns to the aggregated rollup', async () => {
      const overridden = canvas.getByRole('button', { name: /€ 200k/ });
      await userEvent.click(overridden);
      const input = canvas.getByRole('spinbutton');
      await userEvent.clear(input);
      await userEvent.keyboard('{Enter}');
      // Back to the project rollup (190).
      await expect(canvas.getByRole('button', { name: /€ 190k/ })).toBeInTheDocument();
    });
  },
};

// ── Controlled global filter + column visibility (host-driven props) ───────────

/**
 * **Controlled global filter & column visibility.** Both are controlled props
 * with no built-in chrome — the host owns a search box (`globalFilter`) and a
 * column toggle (`hiddenColumnIds`). Filtering keeps matching rows (and their
 * ancestors); hiding a column drops it from the header and every body row.
 */
export const ControlledFilterAndVisibility: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [filter, setFilter] = useState('');
    const [hidden, setHidden] = useState<string[]>([]);
    const cols: DataGridColumnDef<ForecastRow>[] = [
      { id: 'client', header: 'Client', accessor: (r) => r.client, width: 180 },
      { id: 'opco', header: 'Opco', accessor: (r) => r.opco, width: 140 },
      { id: 'owner', header: 'Owner', accessor: (r) => r.owner, width: 160 },
    ];
    const toggleOwner = () =>
      setHidden((prev) => (prev.includes('owner') ? prev.filter((id) => id !== 'owner') : [...prev, 'owner']));
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--eidra-space-3)', alignItems: 'center' }}>
          <Input
            aria-label="Filter clients"
            placeholder="Filter…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={toggleOwner}>
            {hidden.includes('owner') ? 'Show Owner column' : 'Hide Owner column'}
          </Button>
        </div>
        <DataGrid<ForecastRow>
          aria-label="Filtered clients"
          columns={cols}
          data={SAMPLE}
          getRowId={(r) => r.id}
          getRowSearchText={(r) => `${r.client} ${r.opco} ${r.owner}`}
          globalFilter={filter}
          hiddenColumnIds={hidden}
        />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('typing in the host filter keeps only matching rows', async () => {
      await expect(canvas.getByText('Globex')).toBeInTheDocument();
      const filter = canvas.getByRole('textbox', { name: /filter clients/i });
      await userEvent.type(filter, 'Globex');
      await waitFor(() => expect(canvas.queryByText('Acme Corp')).toBeNull());
      await expect(canvas.getByText('Globex')).toBeInTheDocument();
    });

    await step('clearing the filter restores all rows', async () => {
      const filter = canvas.getByRole('textbox', { name: /filter clients/i });
      await userEvent.clear(filter);
      await waitFor(() => expect(canvas.getByText('Acme Corp')).toBeInTheDocument());
    });

    await step('toggling column visibility drops the Owner column header', async () => {
      await expect(canvas.getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: /hide owner column/i }));
      await waitFor(() => expect(canvas.queryByRole('columnheader', { name: /owner/i })).toBeNull());
      // And it comes back.
      await userEvent.click(canvas.getByRole('button', { name: /show owner column/i }));
      await expect(canvas.getByRole('columnheader', { name: /owner/i })).toBeInTheDocument();
    });
  },
};
