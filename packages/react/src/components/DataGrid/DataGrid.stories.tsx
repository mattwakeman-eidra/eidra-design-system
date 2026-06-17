import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataGrid, type DataGridColumnDef } from './DataGrid.js';
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
};

/**
 * **Drag-fill.** Fillable columns (`fillable: true`) show a small accent handle
 * in each cell's corner on hover. Press it and drag down (or up) to paint a
 * contiguous range with that cell's value; release applies it via `onFillRange`
 * (Escape aborts). Opt-in per column, so non-fillable grids are unchanged. Here
 * both **Status** and **Note** are fillable — set a status, then drag its handle
 * down a few rows.
 */
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
};
