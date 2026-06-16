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
