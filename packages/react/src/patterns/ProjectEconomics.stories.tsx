import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Badge, DataGrid, SegmentBar, Statistic, type DataGridColumnDef } from '../index.js';

/**
 * **Project Economics — recipes.** These stories are *documentation*, not shipped
 * components: they assemble the invoicing app's project-economics views entirely
 * from design-system primitives. The DS stays domain-agnostic — the budget/rev-rec
 * semantics live here in the recipe, while the reusable parts (`SegmentBar` markers,
 * `Statistic` accent, `DataGrid` cell tones + drill-down) ship in the library.
 */
const meta = {
  title: 'Patterns/Project Economics',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const eur = (n: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

const kicker = (text: ReactNode) => (
  <div
    style={{
      font: '700 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--eidra-fg-muted)',
      marginBottom: 'var(--eidra-space-1)',
    }}
  >
    {text}
  </div>
);

// ── Recipe 1: Budget burn header ─────────────────────────────────────────────
/**
 * The project header KPI strip: a budget headline, then three stacked `SegmentBar`s
 * (Billable / Revenue / Net position) sharing **one `total`** so the budget `marker`
 * lines up across all of them, plus a status `Badge` and a warnings `Alert`. No new
 * component — pure composition.
 */
export const BudgetHeader: Story = {
  render: () => {
    const total = 1_200_000; // shared scale across all three bars
    const budget = [{ value: 1_200_000, label: 'Budget', tone: 'warning' as const }];
    const lifetimeSpent = 864_000;
    const remaining = total - lifetimeSpent;

    return (
      <div
        style={{
          maxWidth: 640,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--eidra-gap-4)',
          padding: 'var(--eidra-gap-4)',
          border: '1px solid var(--eidra-border)',
          borderRadius: 'var(--eidra-radius-lg)',
          background: 'var(--eidra-surface)',
        }}
      >
        {/* Budget headline */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Statistic label="Budget" value={eur(total)} size="lg" />
          <Statistic
            label="Remaining"
            value={eur(remaining)}
            tone="success"
            size="sm"
            style={{ textAlign: 'right', alignItems: 'flex-end' }}
          />
        </div>

        {/* Three bars sharing one scale; the budget line threads through all of them */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-3)' }}>
          <div>
            {kicker('Billable')}
            <SegmentBar
              size="lg"
              total={total}
              markers={budget}
              segments={[
                { value: 600_000, label: 'Before', color: 'var(--eidra-color-grey-900)' },
                { value: 96_000, label: 'This month', color: 'var(--eidra-color-grey-700)' },
                { value: 168_000, label: 'Planned', color: 'var(--eidra-color-grey-300)' },
              ]}
            />
          </div>
          <div>
            {kicker(
              <span
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>Revenue</span>
                <Badge tone="warning" variant="subtle" size="sm">
                  Pending
                </Badge>
              </span>,
            )}
            <SegmentBar
              size="lg"
              total={total}
              markers={budget}
              segments={[
                { value: 980_000, label: 'Booked', color: 'var(--eidra-finance-positive)' },
                {
                  value: 70_000,
                  label: 'This month (pending)',
                  color: 'var(--eidra-finance-revenue-hi-prob)',
                },
              ]}
            />
          </div>
          <div>
            {kicker(
              <span
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>Net position — Jun</span>
                <Badge tone="success" variant="subtle" size="sm">
                  Balanced
                </Badge>
              </span>,
            )}
            <SegmentBar
              size="lg"
              total={total}
              markers={budget}
              segments={[
                { value: 1_050_000, label: 'Invoiced', color: 'var(--eidra-color-grey-700)' },
                { value: 18_000, label: 'WIP', color: 'var(--eidra-finance-accent)' },
              ]}
            />
          </div>
        </div>

        <Alert tone="warning" title="Lifecycle check">
          One external invoice has progressed past draft while rev rec is still draft.
        </Alert>
      </div>
    );
  },
};

// ── Recipe 2: Accounting matrix ──────────────────────────────────────────────
interface MatrixEntry {
  entry: string;
  date: string;
  description: string;
  amount: number;
}
interface MatrixRow {
  id: string;
  label: string;
  values: Record<string, number | null>;
  entries?: Record<string, MatrixEntry[]>;
  children?: MatrixRow[];
}

const PERIODS = ['Mar', 'Apr', 'May', 'Jun'];
const NOW = 'Jun';

const MATRIX: MatrixRow[] = [
  {
    id: 'fabrique',
    label: 'Fabrique',
    values: { Mar: 80_000, Apr: 92_000, May: 88_000, Jun: 96_000 },
    entries: {
      Jun: [
        { entry: 'INV-1042', date: '2026-06-14', description: 'June retainer', amount: 80_000 },
        { entry: 'INV-1051', date: '2026-06-28', description: 'Sprint 24 overage', amount: 16_000 },
      ],
    },
    children: [
      {
        id: 'fabrique-exact',
        label: 'Exact',
        values: { Mar: 80_000, Apr: 92_000, May: 88_000, Jun: 80_000 },
      },
      {
        id: 'fabrique-delta',
        label: 'Delta (prelim)',
        values: { Mar: 0, Apr: 0, May: 0, Jun: 16_000 },
      },
    ],
  },
  {
    id: 'q42',
    label: 'Q42',
    values: { Mar: 40_000, Apr: 0, May: 0, Jun: -12_500 },
    entries: {
      Jun: [
        {
          entry: 'CN-2210',
          date: '2026-06-02',
          description: 'Deferred — discovery slip',
          amount: -12_500,
        },
      ],
    },
    children: [
      { id: 'q42-exact', label: 'Exact', values: { Mar: 40_000, Apr: 0, May: 0, Jun: 0 } },
      {
        id: 'q42-delta',
        label: 'Delta (prelim)',
        values: { Mar: 0, Apr: 0, May: 0, Jun: -12_500 },
      },
    ],
  },
  {
    id: 'gpnl',
    label: 'GP NL',
    values: { Mar: 64_000, Apr: 64_000, May: 64_000, Jun: 64_000 },
    entries: {
      Jun: [{ entry: 'INV-3300', date: '2026-06-10', description: 'Monthly fee', amount: 64_000 }],
    },
  },
];

const periodSum = (rows: MatrixRow[], p: string) =>
  rows.reduce((s, r) => s + (Number(r.values[p]) || 0), 0);
const rowTotal = (r: MatrixRow) => PERIODS.reduce((s, p) => s + (Number(r.values[p]) || 0), 0);

/**
 * The accounting matrix: OPCOs as rows, periods as columns. Built on `DataGrid` —
 * the app generates the period columns, tree rows expand each OPCO into Exact /
 * Delta, the current month is `highlighted`, `cellTone` tints values by sign
 * (positive green / negative red), and `renderCellDetail` drills a cell open to its
 * underlying invoice lines. Rendered at `density="compact"`.
 *
 * Click a **Jun** figure on a top-level OPCO row to drill into its entries.
 */
export const AccountingMatrix: Story = {
  render: () => {
    const columns: DataGridColumnDef<MatrixRow>[] = [
      { id: 'opco', header: 'Company', accessor: (r) => r.label, pinned: true, width: 200 },
      ...PERIODS.map(
        (p): DataGridColumnDef<MatrixRow> => ({
          id: p,
          header: p === NOW ? `${p} · NOW` : p,
          numeric: true,
          width: 130,
          highlighted: p === NOW,
          highlightTone: 'finance',
          accessor: (r) => r.values[p] ?? null,
          cell: (r) => (r.values[p] == null ? null : eur(Number(r.values[p]))),
          cellTone: (value) => {
            if (value == null) return undefined;
            const n = Number(value);
            if (n > 0) return 'positive';
            if (n < 0) return 'negative';
            return 'muted';
          },
          renderCellDetail: (r) => {
            const lines = r.entries?.[p];
            if (!lines?.length)
              return <span style={{ color: 'var(--eidra-fg-muted)' }}>No entries for {p}.</span>;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-1)' }}>
                {kicker(`${r.label} — ${p} entries`)}
                <table
                  style={{
                    width: '100%',
                    fontSize: 'var(--eidra-font-size-xs)',
                    borderCollapse: 'collapse',
                  }}
                >
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.entry}>
                        <td
                          style={{
                            padding: '2px 12px 2px 0',
                            fontFamily: 'var(--eidra-font-family-mono)',
                            color: 'var(--eidra-fg-muted)',
                          }}
                        >
                          {l.entry}
                        </td>
                        <td style={{ padding: '2px 12px 2px 0', color: 'var(--eidra-fg-muted)' }}>
                          {l.date}
                        </td>
                        <td style={{ padding: '2px 12px 2px 0' }}>{l.description}</td>
                        <td
                          style={{
                            padding: '2px 0',
                            textAlign: 'right',
                            fontFamily: 'var(--eidra-font-family-mono)',
                          }}
                        >
                          {eur(l.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
          footer: (rows) => eur(periodSum(rows, p)),
        }),
      ),
      {
        id: 'total',
        header: 'Total',
        numeric: true,
        width: 130,
        accessor: (r) => rowTotal(r),
        cell: (r) => eur(rowTotal(r)),
        footer: (rows) => eur(rows.reduce((s, r) => s + rowTotal(r), 0)),
      },
    ];

    return (
      <div style={{ height: 420 }}>
        <DataGrid<MatrixRow>
          aria-label="Revenue recognised by company and period"
          accent="finance"
          density="compact"
          totalsPlacement="top"
          columns={columns}
          data={MATRIX}
          getRowId={(r) => r.id}
          getSubRows={(r) => r.children}
          getRowSearchText={(r) => r.label}
        />
      </div>
    );
  },
};
