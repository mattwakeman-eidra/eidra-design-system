import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn.js';
import styles from './DataGrid.module.css';

export type DataGridAlign = 'start' | 'center' | 'end';
export type SortDirection = 'asc' | 'desc';
/**
 * Table sizing strategy. `'auto'` (default) lets the browser size columns from
 * content; `'fixed'` sets `table-layout: fixed` and sizes columns strictly from
 * their `width`. Pinned columns stay aligned in both modes — their sticky offsets
 * track the *rendered* column widths — so use `'fixed'` only when you want exact,
 * content-independent column widths (see {@link DataGridColumn.pinned}).
 */
export type DataGridTableLayout = 'auto' | 'fixed';
/** Where the totals/aggregate row sits: pinned to the `'bottom'` (default) or `'top'`, below the header. */
export type DataGridTotalsPlacement = 'bottom' | 'top';
/** Row density. `'compact'` reduces row padding and numeral size for information-dense tables. */
export type DataGridDensity = 'comfortable' | 'compact';
/** Tint family for a {@link DataGridColumn.highlighted} column. */
export type DataGridHighlightTone = 'accent' | 'finance';
/**
 * Value/state-driven tint for an individual cell (see {@link DataGridColumn.cellTone}).
 * `'positive'`/`'negative'` for sign-based tinting, `'caution'` for pending/needs-attention,
 * `'muted'` for locked/derived values.
 */
export type DataGridCellTone = 'positive' | 'negative' | 'caution' | 'muted';
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
  /**
   * Tint the entire column — header, every body cell, and the totals cell — to
   * mark it as the focus column (e.g. the current "NOW" month). Uses a subtle
   * background token plus a 2px top accent border on the header.
   */
  highlighted?: boolean;
  /** Tint family for {@link highlighted}. Defaults to `'accent'` (the grid's accent). */
  highlightTone?: DataGridHighlightTone;
  /**
   * Tint individual body cells by value/state — e.g. positive WIP green, negative
   * deferred red, pending gold, locked grey. Receives the cell's `accessor` value
   * and the row; return `undefined` to leave a cell untinted. Composes with
   * `EditableNumberCell` and overlays a {@link highlighted} column tint.
   */
  cellTone?: (value: string | number | null | undefined, row: Row) => DataGridCellTone | undefined;
  /**
   * Make this column's cells drill-downable: clicking a cell opens a full-width
   * detail row beneath it, rendered by this function. One detail is open at a time
   * across the whole grid. Receives the row and this column.
   */
  renderCellDetail?: (row: Row, col: DataGridColumn<Row>) => ReactNode;
  /**
   * Opt this column into drag-fill: each cell gets a small fill handle the user
   * can press and drag down (or up) to paint a contiguous range with this cell's
   * value. On release the grid calls {@link DataGridProps.onFillRange}. The value
   * dragged is read from `accessor` at the start row; supply `accessor` (or a
   * custom {@link fillValue}) for fill to carry a value. No-op without
   * `onFillRange`.
   */
  fillable?: boolean;
  /**
   * Override the value carried by a drag-fill started on this column's cell.
   * Defaults to `accessor(row)`. Use when the editable value differs from the
   * sorting/display accessor.
   */
  fillValue?: (row: Row) => unknown;
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
  /** Render a sticky totals row from each column's `footer`. Defaults to true when any column defines one. */
  showFooter?: boolean;
  /** Where the totals row sits. `'bottom'` (default) pins it to the foot; `'top'` stacks it under the header. */
  totalsPlacement?: DataGridTotalsPlacement;
  /**
   * Column sizing strategy. Defaults to `'auto'`. Pinned columns stay aligned in
   * either mode; choose `'fixed'` only for exact, content-independent column widths.
   */
  tableLayout?: DataGridTableLayout;
  /**
   * Per-instance row density. When omitted, the grid inherits the ambient
   * `data-density` scope; set it to force a density for this grid regardless of
   * the surrounding scope (so one page can mix comfortable and dense tables).
   */
  density?: DataGridDensity;
  /** Accent for the grid's interactive affordances. Defaults to `brand`. */
  accent?: DataGridAccent;
  /**
   * Apply a drag-fill. Called once on pointer release for a fill started on a
   * {@link DataGridColumn.fillable} cell. Receives the source column id, the
   * inclusive start/end row indices (in rendered, post-filter/sort/flatten
   * order), and the value dragged (from the start cell's `fillValue`/`accessor`).
   * The grid does not mutate data itself — apply the value to your row state here.
   * Omit to leave drag-fill disabled even on fillable columns.
   */
  onFillRange?: (columnId: string, fromRowIndex: number, toRowIndex: number, value: unknown) => void;
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
    totalsPlacement = 'bottom',
    tableLayout = 'auto',
    density,
    accent = 'brand',
    onFillRange,
    className,
    'aria-label': ariaLabel,
  }: DataGridProps<Row>,
  ref: React.Ref<HTMLDivElement>,
) {
  const hidden = useMemo(() => new Set(hiddenColumnIds ?? []), [hiddenColumnIds]);

  // Uncontrolled sort + expansion state.
  const [internalSort, setInternalSort] = useState<DataGridSort | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  // Drill-down: at most one cell detail open at a time, keyed by (row, column).
  const [openDetail, setOpenDetail] = useState<{ rowId: string; colId: string } | null>(null);
  // Drag-fill: an active gesture started from a fillable cell's handle. Tracks the
  // source column, the value being dragged, the start row index, and the row the
  // pointer is currently over (the live range end). Null when no fill is active.
  const [fill, setFill] = useState<{
    columnId: string;
    value: unknown;
    fromIndex: number;
    toIndex: number;
  } | null>(null);
  const activeSort = sort !== undefined ? sort : internalSort;

  const toggleDetail = useCallback((rowId: string, colId: string) => {
    setOpenDetail((prev) =>
      prev && prev.rowId === rowId && prev.colId === colId ? null : { rowId, colId },
    );
  }, []);

  // Drag-fill gesture: global mouseup applies the resolved [lo, hi] range via
  // `onFillRange`; Escape aborts. Mirrors the invoicing `useFillRange` model.
  // A ref keeps the listeners stable while reading the live fill state.
  const fillRef = useRef(fill);
  fillRef.current = fill;
  const onFillRangeRef = useRef(onFillRange);
  onFillRangeRef.current = onFillRange;
  useEffect(() => {
    const onUp = () => {
      const f = fillRef.current;
      if (!f) return;
      const lo = Math.min(f.fromIndex, f.toIndex);
      const hi = Math.max(f.fromIndex, f.toIndex);
      onFillRangeRef.current?.(f.columnId, lo, hi, f.value);
      setFill(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fillRef.current) setFill(null);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const startFill = useCallback(
    (columnId: string, fromIndex: number, value: unknown) => {
      if (!onFillRangeRef.current) return;
      setFill({ columnId, value, fromIndex, toIndex: fromIndex });
    },
    [],
  );

  const hoverFill = useCallback((rowIndex: number) => {
    setFill((prev) => (prev && prev.toIndex !== rowIndex ? { ...prev, toIndex: rowIndex } : prev));
  }, []);

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

  const hasFooter = leafColumns.some((c) => c.footer !== undefined);
  const renderFooter = (showFooter ?? hasFooter) && hasFooter;
  const totalsAtTop = renderFooter && totalsPlacement === 'top';

  // A top-placed totals row sticks below the header; its `top` offset must equal
  // the rendered header height, which varies with tier count + content. Measure it.
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const [theadHeight, setTheadHeight] = useState(0);
  useLayoutEffect(() => {
    const el = theadRef.current;
    if (!el || !totalsAtTop) return;
    const measure = () => setTheadHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [totalsAtTop, hasGroups, visibleLeaves]);

  // Fallback column width when none is declared (also the fixed-layout default).
  const DEFAULT_COL_WIDTH = 120;

  // Sticky-left offsets for pinned columns must equal each column's *rendered*
  // width, not its *declared* width. Under `table-layout: auto` the two diverge
  // (the browser stretches/shrinks columns to fit the container — most visibly in
  // a narrow context like the Storybook Docs tab), so declared-width offsets drift
  // and pinned columns overlap. Measure the rendered `<col>` widths and recompute.
  const tableRef = useRef<HTMLTableElement>(null);
  const [measuredPinnedLeft, setMeasuredPinnedLeft] = useState<Map<string, number> | null>(null);
  const hasPinned = useMemo(() => visibleLeaves.some((c) => c.pinned), [visibleLeaves]);
  useLayoutEffect(() => {
    const tableEl = tableRef.current;
    if (!tableEl || !hasPinned) {
      setMeasuredPinnedLeft(null);
      return;
    }
    const measure = () => {
      const cols = tableEl.querySelectorAll<HTMLTableColElement>(':scope > colgroup > col');
      const next = new Map<string, number>();
      let offset = 0;
      visibleLeaves.forEach((col, i) => {
        if (!col.pinned) return;
        next.set(col.id, offset);
        const rendered = cols[i]?.getBoundingClientRect().width || 0;
        offset += rendered || col.width || DEFAULT_COL_WIDTH;
      });
      setMeasuredPinnedLeft(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tableEl);
    return () => observer.disconnect();
  }, [hasPinned, visibleLeaves, tableLayout]);

  // Resolved sticky offset: measured rendered widths when available, else declared.
  const pinnedOffset = (colId: string) =>
    (measuredPinnedLeft ?? pinnedLeft).get(colId) ?? 0;

  const align = (col: DataGridColumn<Row>): DataGridAlign =>
    col.align ?? (col.numeric ? 'end' : 'start');

  // Highlight attributes for a column's header/body/footer cells.
  const highlightProps = (col: DataGridColumn<Row>) =>
    col.highlighted
      ? { 'data-highlighted': '', 'data-highlight-tone': col.highlightTone ?? 'accent' }
      : {};

  const stickyProps = (col: DataGridColumn<Row>, zKind: 'header' | 'body' | 'corner') => {
    if (!col.pinned) return {};
    return {
      'data-pinned': '',
      'data-z': zKind,
      style: { left: pinnedOffset(col.id) } as React.CSSProperties,
    };
  };

  const firstLeafId = visibleLeaves[0]?.id;

  // Only expose the scroll container as a labelled landmark when a name is
  // provided; an unnamed `role="region"` fails accessibility checks. `tabIndex`
  // stays so the scrollable area is always keyboard-reachable.
  const regionProps = ariaLabel ? { role: 'region' as const, 'aria-label': ariaLabel } : {};

  // Under fixed layout, columns size strictly from these widths, so every column
  // needs one for sticky offsets to stay aligned; fall back to a sensible default.
  const colWidth = (col: DataGridColumn<Row>) =>
    col.width ?? (tableLayout === 'fixed' ? DEFAULT_COL_WIDTH : undefined);

  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      data-accent={accent}
      data-density={density}
    >
      <div className={styles.scroll} tabIndex={0} {...regionProps}>
        <table ref={tableRef} className={styles.table} data-layout={tableLayout}>
          <colgroup>
            {visibleLeaves.map((col) => {
              const w = colWidth(col);
              return <col key={col.id} style={w ? { width: w } : undefined} />;
            })}
          </colgroup>

          <thead ref={theadRef} className={styles.thead}>
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
                      {...highlightProps(def)}
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
                    {...highlightProps(col)}
                    {...stickyProps(col, 'corner')}
                  >
                    {renderColHeaderContent(col)}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {totalsAtTop && (
              <tr className={styles.totalsRow}>{renderTotalsCells('top')}</tr>
            )}
            {flatRows.map((fr, rowIndex) => {
              const detailCol =
                openDetail?.rowId === fr.id ? colById.get(openDetail.colId) : undefined;
              const showDetail = !!detailCol?.renderCellDetail;
              return (
                <Fragment key={fr.id}>
                  <tr className={styles.row} data-depth={fr.depth || undefined}>
                    {visibleLeaves.map((col) => {
                      const isFirst = col.id === firstLeafId;
                      const tone = col.cellTone?.(col.accessor?.(fr.row), fr.row);
                      const canDrill = !!col.renderCellDetail;
                      const isOpen =
                        openDetail?.rowId === fr.id && openDetail?.colId === col.id;
                      // Drag-fill: a handle is shown only on fillable columns when
                      // an `onFillRange` is wired. A cell is in-range while a fill
                      // on this column has the pointer between start and current.
                      const canFill = !!col.fillable && !!onFillRange;
                      const inFillRange =
                        !!fill &&
                        fill.columnId === col.id &&
                        rowIndex >= Math.min(fill.fromIndex, fill.toIndex) &&
                        rowIndex <= Math.max(fill.fromIndex, fill.toIndex);
                      const inner = (
                        <>
                          {isFirst && fr.hasChildren && (
                            <ExpandToggle
                              expanded={fr.expanded}
                              onToggle={() => toggleExpand(fr.id)}
                            />
                          )}
                          {renderCell(col, fr.row)}
                        </>
                      );
                      return (
                        <td
                          key={col.id}
                          className={styles.cell}
                          data-align={align(col)}
                          data-numeric={col.numeric ? '' : undefined}
                          data-cell-tone={tone || undefined}
                          data-fill-range={inFillRange ? '' : undefined}
                          {...highlightProps(col)}
                          {...stickyProps(col, 'body')}
                          onMouseEnter={
                            fill && fill.columnId === col.id
                              ? () => hoverFill(rowIndex)
                              : undefined
                          }
                        >
                          <span
                            className={styles.cellInner}
                            style={
                              isFirst && fr.depth
                                ? { paddingInlineStart: `calc(${fr.depth} * var(--eidra-space-4))` }
                                : undefined
                            }
                          >
                            {canDrill ? (
                              <button
                                type="button"
                                className={styles.cellDrill}
                                data-open={isOpen ? '' : undefined}
                                aria-expanded={isOpen}
                                onClick={() => toggleDetail(fr.id, col.id)}
                              >
                                {inner}
                              </button>
                            ) : (
                              inner
                            )}
                            {canFill && (
                              <span
                                className={styles.fillHandle}
                                role="presentation"
                                title="Drag down to fill the column with this value"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const value = col.fillValue
                                    ? col.fillValue(fr.row)
                                    : col.accessor?.(fr.row);
                                  startFill(col.id, rowIndex, value);
                                }}
                              />
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  {showDetail && (
                    <tr className={styles.detailRow}>
                      <td className={styles.detailCell} colSpan={visibleLeaves.length}>
                        {detailCol!.renderCellDetail!(fr.row, detailCol!)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>

          {renderFooter && !totalsAtTop && (
            <tfoot className={styles.tfoot}>
              <tr>{renderTotalsCells('bottom')}</tr>
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

  function renderTotalsCells(placement: 'top' | 'bottom') {
    return visibleLeaves.map((col) => {
      // Top totals stick below the header (top: measured header height) and, when
      // pinned, also stick left; bottom totals reuse the sticky-footer treatment.
      const style: React.CSSProperties = {};
      if (col.pinned) style.left = pinnedOffset(col.id);
      if (placement === 'top') style.top = theadHeight;
      return (
        <td
          key={col.id}
          className={placement === 'top' ? styles.totalsCell : styles.footerCell}
          data-align={align(col)}
          data-numeric={col.numeric ? '' : undefined}
          {...(col.pinned ? { 'data-pinned': '', 'data-z': 'corner' } : {})}
          {...highlightProps(col)}
          style={style}
        >
          {col.footer ? col.footer(data) : null}
        </td>
      );
    });
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
