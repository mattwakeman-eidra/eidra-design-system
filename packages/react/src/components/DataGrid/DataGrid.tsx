import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn.js';
import styles from './DataGrid.module.css';

export type DataGridAlign = 'start' | 'center' | 'end';
export type SortDirection = 'asc' | 'desc';
/**
 * Accent used for interactive affordances inside the grid (sort indicators,
 * focus rings, editable-cell override/aggregate markers). `'brand'` uses the
 * theme accent; `'finance'` scopes the grid to the financial data-viz palette's
 * action blue (`--eidra-finance-accent`) — chosen because in a financial colour
 * grammar the brand accent (orange) reads as caution/at-risk (RAG).
 */
export type DataGridAccent = 'brand' | 'finance';

/**
 * A single leaf column. Generic over the row shape — the design system never
 * knows about any consumer's domain types; callers wire `accessor`/`cell`.
 */
export interface DataGridColumn<Row> {
  /** Stable identifier — used for sorting, visibility, and React keys. */
  id: string;
  /** Header content for this column. */
  header: ReactNode;
  /**
   * Value accessor used for default cell rendering and for sorting. Return
   * `null`/`undefined` for empty cells (rendered as an em dash).
   */
  accessor?: (row: Row) => string | number | null | undefined;
  /** Custom cell renderer. Overrides `accessor` for display (sorting still uses `accessor`). */
  cell?: (row: Row) => ReactNode;
  /** Text alignment. Numeric columns default to `end`, others to `start`. */
  align?: DataGridAlign;
  /** Fixed column width in pixels. */
  width?: number;
  /** Pin this column to the left edge (sticky horizontal scroll). Pinned columns must lead the column list. */
  pinned?: boolean;
  /** Allow click-to-sort on this column's header (uses `accessor`). */
  sortable?: boolean;
  /** Render a totals/aggregate cell in the sticky footer row. */
  footer?: (rows: Row[]) => ReactNode;
  /** Render numerals in the monospace numeral face and right-align by default. */
  numeric?: boolean;
}

/** A header group spanning several leaf columns — drives the multi-tier header. */
export interface DataGridColumnGroup<Row> {
  id: string;
  header: ReactNode;
  columns: DataGridColumn<Row>[];
}

export type DataGridColumnDef<Row> = DataGridColumn<Row> | DataGridColumnGroup<Row>;

function isGroup<Row>(def: DataGridColumnDef<Row>): def is DataGridColumnGroup<Row> {
  return (def as DataGridColumnGroup<Row>).columns !== undefined;
}

export interface DataGridSort {
  columnId: string;
  direction: SortDirection;
}

export interface DataGridProps<Row> {
  /** Column definitions. Mix leaf columns and groups; groups render a second header tier. */
  columns: DataGridColumnDef<Row>[];
  /** Row data. */
  data: Row[];
  /** Stable row key. */
  getRowId: (row: Row) => string;
  /** Return a row's children to make it expandable (tree rows). */
  getSubRows?: (row: Row) => Row[] | undefined;
  /** Text used by the built-in global filter to match a row. */
  getRowSearchText?: (row: Row) => string;
  /** Controlled global filter string. Rows (and their ancestors) matching are kept. */
  globalFilter?: string;
  /** Controlled set of hidden leaf-column ids. */
  hiddenColumnIds?: string[];
  /** Controlled sort. Omit for uncontrolled (internal) sort state. */
  sort?: DataGridSort | null;
  /** Sort-change callback (required to drive controlled sort). */
  onSortChange?: (sort: DataGridSort | null) => void;
  /** Render a sticky totals footer from each column's `footer`. Defaults to true when any column defines one. */
  showFooter?: boolean;
  /** Accent for the grid's interactive affordances. Defaults to `brand`. */
  accent?: DataGridAccent;
  /** Accessible label for the grid. */
  'aria-label'?: string;
  className?: string;
}

interface FlatRow<Row> {
  row: Row;
  id: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

const EM_DASH = '—';

function SortGlyph({ direction }: { direction: SortDirection | null }) {
  return (
    <span aria-hidden className={styles.sortGlyph} data-direction={direction ?? 'none'}>
      {direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}
    </span>
  );
}

function ExpandToggle({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={styles.expandToggle}
      data-expanded={expanded ? '' : undefined}
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      aria-expanded={expanded}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <span aria-hidden>{'›'}</span>
    </button>
  );
}

/**
 * A generic, config-driven data grid: sticky pinned columns, a multi-tier
 * header from column groups, click-to-sort, global filtering, column
 * visibility, expandable tree rows, and a sticky totals footer. Built on a
 * native `<table>` (Base UI ships no table primitive) and styled with Eidra
 * tokens. Inline cell editing is provided by the companion `EditableNumberCell`.
 */
function DataGridInner<Row>(
  {
    columns,
    data,
    getRowId,
    getSubRows,
    getRowSearchText,
    globalFilter,
    hiddenColumnIds,
    sort,
    onSortChange,
    showFooter,
    accent = 'brand',
    className,
    'aria-label': ariaLabel,
  }: DataGridProps<Row>,
  ref: React.Ref<HTMLDivElement>,
) {
  const hidden = useMemo(() => new Set(hiddenColumnIds ?? []), [hiddenColumnIds]);

  // Uncontrolled sort + expansion state.
  const [internalSort, setInternalSort] = useState<DataGridSort | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const activeSort = sort !== undefined ? sort : internalSort;

  const toggleSort = useCallback(
    (columnId: string) => {
      const next: DataGridSort | null =
        activeSort?.columnId === columnId
          ? activeSort.direction === 'asc'
            ? { columnId, direction: 'desc' }
            : null
          : { columnId, direction: 'asc' };
      if (onSortChange) onSortChange(next);
      if (sort === undefined) setInternalSort(next);
    },
    [activeSort, onSortChange, sort],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Normalise defs into leaf columns (+ remember which had a group, for the header tiers).
  const leafColumns = useMemo(
    () => columns.flatMap((def) => (isGroup(def) ? def.columns : [def])),
    [columns],
  );
  const visibleLeaves = useMemo(
    () => leafColumns.filter((c) => !hidden.has(c.id)),
    [leafColumns, hidden],
  );
  const hasGroups = useMemo(() => columns.some(isGroup), [columns]);

  // Compute sticky-left offsets for pinned columns, in visible order.
  const pinnedLeft = useMemo(() => {
    const map = new Map<string, number>();
    let offset = 0;
    for (const col of visibleLeaves) {
      if (col.pinned) {
        map.set(col.id, offset);
        offset += col.width ?? 120;
      }
    }
    return map;
  }, [visibleLeaves]);

  const colById = useMemo(() => {
    const map = new Map<string, DataGridColumn<Row>>();
    for (const c of leafColumns) map.set(c.id, c);
    return map;
  }, [leafColumns]);

  // Filter (keep ancestors of matching descendants), then sort, then flatten by expansion.
  const flatRows = useMemo<FlatRow<Row>[]>(() => {
    const filter = globalFilter?.trim().toLowerCase();

    const matches = (row: Row): boolean => {
      if (!filter || !getRowSearchText) return true;
      return getRowSearchText(row).toLowerCase().includes(filter);
    };

    const keep = (row: Row): boolean => {
      if (matches(row)) return true;
      const kids = getSubRows?.(row);
      return kids ? kids.some(keep) : false;
    };

    const sortCol = activeSort ? colById.get(activeSort.columnId) : undefined;
    const sortRows = (rows: Row[]): Row[] => {
      if (!sortCol?.accessor || !activeSort) return rows;
      const dir = activeSort.direction === 'asc' ? 1 : -1;
      return [...rows].sort((a, b) => {
        const av = sortCol.accessor!(a);
        const bv = sortCol.accessor!(b);
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    };

    const out: FlatRow<Row>[] = [];
    const walk = (rows: Row[], depth: number) => {
      for (const row of sortRows(rows.filter(keep))) {
        const id = getRowId(row);
        const kids = getSubRows?.(row)?.filter(keep);
        const hasChildren = !!kids && kids.length > 0;
        const isExpanded = expanded.has(id);
        out.push({ row, id, depth, hasChildren, expanded: isExpanded });
        if (hasChildren && isExpanded) walk(kids!, depth + 1);
      }
    };
    walk(data, 0);
    return out;
  }, [data, globalFilter, getRowSearchText, getSubRows, getRowId, activeSort, colById, expanded]);

  const renderFooter =
    showFooter ?? leafColumns.some((c) => c.footer !== undefined);

  const align = (col: DataGridColumn<Row>): DataGridAlign =>
    col.align ?? (col.numeric ? 'end' : 'start');

  const stickyProps = (col: DataGridColumn<Row>, zKind: 'header' | 'body' | 'corner') => {
    if (!col.pinned) return {};
    return {
      'data-pinned': '',
      'data-z': zKind,
      style: { left: pinnedLeft.get(col.id) ?? 0 } as React.CSSProperties,
    };
  };

  const firstLeafId = visibleLeaves[0]?.id;

  return (
    <div ref={ref} className={cn(styles.root, className)} data-accent={accent}>
      <div className={styles.scroll} role="region" aria-label={ariaLabel} tabIndex={0}>
        <table className={styles.table}>
          <colgroup>
            {visibleLeaves.map((col) => (
              <col key={col.id} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>

          <thead className={styles.thead}>
            {hasGroups && (
              <tr>
                {columns.map((def) => {
                  if (isGroup(def)) {
                    const span = def.columns.filter((c) => !hidden.has(c.id)).length;
                    if (span === 0) return null;
                    return (
                      <th
                        key={def.id}
                        colSpan={span}
                        scope="colgroup"
                        className={styles.groupHeader}
                        data-z="header"
                      >
                        {def.header}
                      </th>
                    );
                  }
                  if (hidden.has(def.id)) return null;
                  // Leaf column with no group spans both header tiers.
                  return (
                    <th
                      key={def.id}
                      rowSpan={2}
                      scope="col"
                      className={styles.colHeader}
                      data-align={align(def)}
                      {...stickyProps(def, 'corner')}
                    >
                      {renderColHeaderContent(def)}
                    </th>
                  );
                })}
              </tr>
            )}
            <tr>
              {visibleLeaves.map((col) => {
                // Leaves that already rendered (rowSpan=2) in the first tier are skipped here.
                if (hasGroups) {
                  const inGroup = columns.some((d) => isGroup(d) && d.columns.includes(col));
                  if (!inGroup) return null;
                }
                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={styles.colHeader}
                    data-align={align(col)}
                    {...stickyProps(col, 'corner')}
                  >
                    {renderColHeaderContent(col)}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {flatRows.map((fr) => (
              <tr key={fr.id} className={styles.row} data-depth={fr.depth || undefined}>
                {visibleLeaves.map((col) => {
                  const isFirst = col.id === firstLeafId;
                  return (
                    <td
                      key={col.id}
                      className={styles.cell}
                      data-align={align(col)}
                      data-numeric={col.numeric ? '' : undefined}
                      {...stickyProps(col, 'body')}
                    >
                      <span
                        className={styles.cellInner}
                        style={
                          isFirst && fr.depth
                            ? { paddingInlineStart: `calc(${fr.depth} * var(--eidra-space-4))` }
                            : undefined
                        }
                      >
                        {isFirst && fr.hasChildren && (
                          <ExpandToggle
                            expanded={fr.expanded}
                            onToggle={() => toggleExpand(fr.id)}
                          />
                        )}
                        {renderCell(col, fr.row)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {renderFooter && (
            <tfoot className={styles.tfoot}>
              <tr>
                {visibleLeaves.map((col) => (
                  <td
                    key={col.id}
                    className={styles.footerCell}
                    data-align={align(col)}
                    data-numeric={col.numeric ? '' : undefined}
                    {...stickyProps(col, 'corner')}
                  >
                    {col.footer ? col.footer(data) : null}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );

  function renderColHeaderContent(col: DataGridColumn<Row>) {
    if (!col.sortable) return col.header;
    const dir = activeSort?.columnId === col.id ? activeSort.direction : null;
    return (
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => toggleSort(col.id)}
        aria-label={`Sort by ${typeof col.header === 'string' ? col.header : col.id}`}
      >
        {col.header}
        <SortGlyph direction={dir} />
      </button>
    );
  }

  function renderCell(col: DataGridColumn<Row>, row: Row): ReactNode {
    if (col.cell) return col.cell(row);
    const value = col.accessor?.(row);
    if (value == null || value === '') return <span className={styles.empty}>{EM_DASH}</span>;
    return value;
  }
}

/**
 * A generic, config-driven data grid built on a native `<table>`: sticky pinned
 * columns, a multi-tier header from column groups, click-to-sort, global
 * filtering, column visibility, expandable tree rows, and a sticky totals
 * footer. Pair with `EditableNumberCell` for inline cell editing.
 */
export const DataGrid = forwardRef(DataGridInner) as <Row>(
  props: DataGridProps<Row> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof DataGridInner>;
