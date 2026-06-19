import { createContext, forwardRef, useContext } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TreemapNode, SunburstData, SankeyData } from 'recharts';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Bar,
  Line,
  Area,
  Scatter,
  Cell,
  LabelList,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Legend,
  Tooltip as RechartsTooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Treemap,
  SunburstChart,
  Sankey,
  useXAxisScale,
  useYAxisScale,
  useXAxisTicks,
  useYAxisTicks,
  usePlotArea,
} from 'recharts';
import { cn } from '../../utils/cn.js';
import styles from './Chart.module.css';

/**
 * Per-series display config: maps a `dataKey` to a label and colour. The colour
 * is exposed to the chart as a CSS variable `--color-<key>`, so series elements
 * reference it with `fill="var(--color-actuals)"` / `stroke="var(--color-budget)"`.
 */
export type ChartConfig = Record<string, { label?: ReactNode; color?: string }>;

const ChartContext = createContext<ChartConfig | null>(null);

function useChartConfig(): ChartConfig {
  return useContext(ChartContext) ?? {};
}

export interface ChartContainerProps extends ComponentPropsWithoutRef<'div'> {
  /** Per-series labels and colours; each colour is injected as a `--color-<key>` CSS variable. */
  config: ChartConfig;
  /** Visual scale. `sm` tightens axis type/margins for compact cards. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** A single Recharts chart element (e.g. `<Chart.ComposedChart>…`). */
  children: ReactNode;
}

/**
 * Themed responsive wrapper for a Recharts chart. Injects each series colour as
 * a `--color-<key>` CSS variable from `config`, applies Eidra grid/axis styling,
 * and sizes the chart to its box via `ResponsiveContainer`. Set a height via
 * `style`/`className` (defaults to a sensible chart height).
 */
const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer(
  { config, size = 'md', className, children, style, ...props },
  ref,
) {
  const colorVars = Object.fromEntries(
    Object.entries(config)
      .filter(([, v]) => v.color)
      .map(([key, v]) => [`--color-${key}`, v.color as string]),
  ) as React.CSSProperties;

  return (
    <ChartContext.Provider value={config}>
      <div
        ref={ref}
        className={cn(styles.container, className)}
        data-size={size}
        style={{ ...colorVars, ...style }}
        {...props}
      >
        {/* initialDimension seeds the first paint with a valid size; Recharts'
            default is {-1,-1}, which renders one frame at -1×-1 and logs
            "width(-1)/height(-1) should be greater than 0" before the
            ResizeObserver reports the real 100% box. */}
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 200 }}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});

/** Recharts injects `active`/`payload`/`label` into tooltip `content`. */
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; name?: string; value?: number | string; color?: string; payload?: any }>;
  label?: ReactNode;
  /** Format each value (e.g. a currency formatter). */
  formatter?: (value: number | string | undefined) => ReactNode;
  /** Format the tooltip heading (the axis label). */
  labelFormatter?: (label: ReactNode) => ReactNode;
  /** Hide the heading row. */
  hideLabel?: boolean;
  /** Extra content rendered below the series rows (e.g. an OPCO split). */
  footer?: ReactNode;
  /**
   * Override the auto-mapped payload rows with explicit, derived rows computed
   * from the hovered datum — for composite charts (dumbbell, waterfall, drill
   * sunburst) where the Recharts payload isn't what should be shown. Receives
   * `payload[0].payload` (the datum); return `{ label, value, color? }` rows
   * (values pre-formatted). The themed shell, heading and footer are unchanged.
   */
  rows?: (datum: any) => Array<{ label?: ReactNode; value?: ReactNode; color?: string }>;
  className?: string;
}

/**
 * Themed tooltip body. Pass to a chart tooltip via
 * `<Chart.Tooltip content={<Chart.TooltipContent formatter={…} />} />`. Reads the
 * container `config` for per-series labels/colours. Compose `footer` for extra
 * sections (e.g. an OPCO breakdown) without forking the component.
 */
function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  hideLabel,
  footer,
  rows,
  className,
}: ChartTooltipContentProps) {
  const config = useChartConfig();
  if (!active || !payload?.length) return null;
  // Either derive rows from the hovered datum (composite charts) or auto-map the
  // Recharts payload via `config` (the default). Both render through one shell.
  const items: Array<{ name: ReactNode; value: ReactNode; color?: string }> = rows
    ? rows(payload[0]?.payload).map((r) => ({ name: r.label, value: r.value, color: r.color }))
    : payload.map((item, i) => {
        const key = String(item.dataKey ?? item.name ?? i);
        const cfg = config[key];
        return {
          name: cfg?.label ?? item.name ?? key,
          value: formatter ? formatter(item.value) : item.value,
          color: item.color ?? cfg?.color ?? `var(--color-${key})`,
        };
      });
  return (
    <div className={cn(styles.tooltip, className)}>
      {!hideLabel && (
        <div className={styles.tooltipLabel}>{labelFormatter ? labelFormatter(label) : label}</div>
      )}
      <div className={styles.tooltipItems}>
        {items.map((it, i) => (
          <div key={i} className={styles.tooltipRow}>
            {it.color != null && (
              <span className={styles.tooltipSwatch} style={{ backgroundColor: it.color }} aria-hidden />
            )}
            <span className={styles.tooltipName}>{it.name}</span>
            <span className={styles.tooltipValue}>{it.value}</span>
          </div>
        ))}
      </div>
      {footer != null && <div className={styles.tooltipFooter}>{footer}</div>}
    </div>
  );
}

interface ChartLegendContentProps {
  payload?: Array<{ dataKey?: string | number; value?: string; color?: string }>;
  /** Series keys currently hidden — rendered dimmed. */
  hidden?: string[];
  /** Called with a series key when its legend item is clicked (wire show/hide). */
  onToggle?: (key: string) => void;
  className?: string;
}

/**
 * Themed legend body. Pass to `<Chart.Legend content={<Chart.LegendContent … />} />`.
 * For a toggleable legend, pass `hidden` + `onToggle` and manage the hidden set in
 * the consumer; items render as buttons that dim when hidden.
 */
function ChartLegendContent({ payload, hidden = [], onToggle, className }: ChartLegendContentProps) {
  const config = useChartConfig();
  if (!payload?.length) return null;
  return (
    <div className={cn(styles.legend, className)}>
      {payload.map((item, i) => {
        const key = String(item.dataKey ?? item.value ?? i);
        const cfg = config[key];
        const isHidden = hidden.includes(key);
        const color = item.color ?? cfg?.color ?? `var(--color-${key})`;
        return (
          <button
            key={i}
            type="button"
            className={styles.legendItem}
            data-hidden={isHidden ? '' : undefined}
            onClick={onToggle ? () => onToggle(key) : undefined}
            disabled={!onToggle}
          >
            <span className={styles.legendSwatch} style={{ backgroundColor: color }} aria-hidden />
            {cfg?.label ?? item.value ?? key}
          </button>
        );
      })}
    </div>
  );
}

// Currency helpers live in the shared utils now; re-exported here for back-compat
// so `import { formatCompactCurrency } from '@eidra/react'` keeps working.
export { formatCompactCurrency } from '../../utils/currency.js';

/** Recharts data-node types for the hierarchical / flow charts (Treemap / Sunburst / Sankey). */
export type { TreemapNode, SunburstData, SankeyData };

/**
 * Default props for animated series (`Bar` / `Line` / `Area`): turns the entry
 * animation off. Spread it onto a series — `<Chart.Bar {...Chart.seriesDefaults} />`.
 *
 * Why: Recharts' enter animation renders bars/lines blank on the first frame,
 * which flashes on first paint and produces empty output under SSR/headless
 * capture (Storybook snapshots, screenshot tests). Recharts requires its own
 * primitives as direct chart children, so the kit can't wrap them to force a
 * default — spread this instead. Every series in the Sold & Forecast reference
 * disables animation.
 */
const seriesDefaults = { isAnimationActive: false } as const;

// ── Box plot ────────────────────────────────────────────────────────────────
// Recharts has no box-and-whisker primitive, so `Chart.BoxPlot` is a small
// self-contained chart: a ComposedChart owning its axes + a transparent anchor
// Bar (which forces a band scale and doubles as the hover hit-target for the
// per-category tooltip) + an SVG layer that reads the axis scales via Recharts'
// v3 hooks and draws box / median / whiskers / caps / outliers at true scale.

/** Default 16-colour categorical palette (semantic tokens) cycled per box. */
const CHART_PALETTE = Array.from({ length: 16 }, (_, i) => `var(--eidra-chart-${i + 1})`);

/**
 * Five-number summary for one box. `min`/`max` are the **whisker ends** (the most
 * extreme samples within the Tukey fences), not the absolute extremes — points
 * beyond the fences live in `outliers`. Build one from raw samples with
 * {@link computeBoxStats}.
 */
export interface BoxStats {
  /** Lower whisker end (smallest sample ≥ Q1 − 1.5×IQR). */
  min: number;
  /** First quartile (25th percentile) — bottom of the box. */
  q1: number;
  /** Median (50th percentile) — the emphasised line in the box. */
  median: number;
  /** Third quartile (75th percentile) — top of the box. */
  q3: number;
  /** Upper whisker end (largest sample ≤ Q3 + 1.5×IQR). */
  max: number;
  /** Samples beyond the 1.5×IQR fences, drawn as dots. */
  outliers?: number[];
}

/** One category's box: its label (under `categoryKey`), stats, and optional colour. */
export type BoxPlotDatum = BoxStats & {
  /** Per-box colour (any CSS colour, e.g. `var(--eidra-chart-3)`). Defaults to the palette cycle. */
  color?: string;
  [key: string]: unknown;
};

/** Type-7 quantile of an already-sorted ascending array. */
function quantileSorted(sorted: number[], p: number): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  if (n === 1) return sorted[0]!;
  const h = (n - 1) * p;
  const lo = Math.floor(h);
  const hi = Math.ceil(h);
  const a = sorted[lo]!;
  const b = sorted[hi]!;
  return a + (h - lo) * (b - a);
}

/**
 * Derive a {@link BoxStats} five-number summary from raw samples: type-7 quartiles
 * (the spreadsheet/most-stats-libs default) and Tukey 1.5×IQR outlier fences.
 * `min`/`max` are the most extreme samples **within** the fences; anything beyond
 * is returned in `outliers`. Feed the result to `Chart.BoxPlot`.
 *
 * @example
 * ```ts
 * const stats = computeBoxStats([12, 15, 9, 22, 18, 14, 40]);
 * // { min, q1, median, q3, max, outliers: [40] }
 * ```
 */
export function computeBoxStats(values: number[]): BoxStats {
  const sorted = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const q1 = quantileSorted(sorted, 0.25);
  const median = quantileSorted(sorted, 0.5);
  const q3 = quantileSorted(sorted, 0.75);
  const iqr = q3 - q1;
  const loFence = q1 - 1.5 * iqr;
  const hiFence = q3 + 1.5 * iqr;
  const inFence = sorted.filter((v) => v >= loFence && v <= hiFence);
  const outliers = sorted.filter((v) => v < loFence || v > hiFence);
  const min = (inFence.length ? inFence[0] : sorted[0]) ?? NaN;
  const max = (inFence.length ? inFence[inFence.length - 1] : sorted[sorted.length - 1]) ?? NaN;
  return { min, q1, median, q3, max, outliers: outliers.length ? outliers : undefined };
}

interface BoxLayerProps {
  data: BoxPlotDatum[];
  categoryKey: string;
  orientation: 'vertical' | 'horizontal';
  showOutliers: boolean;
  boxRatio: number;
  valueFormatter: (v: number) => ReactNode;
}

/**
 * SVG box-and-whisker layer. Rendered as a direct chart child so Recharts' v3
 * scale hooks resolve against the chart's axes (default ids). Draws each box at
 * true axis positions; returns nothing until the scales are ready.
 */
function BoxLayer({ data, categoryKey, orientation, showOutliers, boxRatio, valueFormatter }: BoxLayerProps) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const xTicks = useXAxisTicks();
  const yTicks = useYAxisTicks();
  const plot = usePlotArea();
  if (!xScale || !yScale) return null;

  const isV = orientation !== 'horizontal';
  const rawValScale = isV ? yScale : xScale;
  const valScale = (v: number) => rawValScale(v) ?? NaN;

  // The category axis reports a point-style scale here (bandwidth 0), so derive
  // each box's centre from the axis tick coordinates (the true, label-aligned
  // category centres) and the band width from the tick spacing.
  const catTicks = ((isV ? xTicks : yTicks) ?? []) as ReadonlyArray<{ value?: unknown; coordinate?: number }>;
  const centreOf = new Map(catTicks.map((t) => [String(t.value), t.coordinate ?? NaN]));
  const band =
    catTicks.length > 1
      ? Math.abs((catTicks[1]!.coordinate ?? 0) - (catTicks[0]!.coordinate ?? 0))
      : plot
        ? (isV ? plot.width : plot.height)
        : 0;

  return (
    <g className={styles.boxLayer} aria-hidden={false}>
      {data.map((d, i) => {
        const cat = d[categoryKey] as string | number;
        const center = centreOf.get(String(cat));
        if (center == null || Number.isNaN(center)) return null;
        const w = Math.max(band * boxRatio, 1);
        const capW = w * 0.5;
        const color = d.color ?? CHART_PALETTE[i % CHART_PALETTE.length]!;
        const fill = `color-mix(in srgb, ${color} 18%, transparent)`;
        const vMin = valScale(d.min);
        const vQ1 = valScale(d.q1);
        const vMed = valScale(d.median);
        const vQ3 = valScale(d.q3);
        const vMax = valScale(d.max);
        const f = valueFormatter;
        const title = `${cat}: median ${f(d.median)}, Q1 ${f(d.q1)}, Q3 ${f(d.q3)}, range ${f(d.min)}–${f(d.max)}${
          d.outliers?.length ? `, ${d.outliers.length} outlier(s)` : ''
        }`;

        // Box rect spans Q1↔Q3; whisker line spans min↔max; caps at both ends.
        const boxStart = isV ? center - w / 2 : Math.min(vQ1, vQ3);
        const boxCross = isV ? Math.min(vQ3, vQ1) : center - w / 2;
        const boxLen = isV ? Math.abs(vQ1 - vQ3) : Math.abs(vQ3 - vQ1);

        return (
          <g key={`${cat}-${i}`} stroke={color} strokeWidth={1.5} fill="none">
            <title>{title}</title>
            {/* whisker stem */}
            {isV ? (
              <line x1={center} x2={center} y1={vMax} y2={vMin} />
            ) : (
              <line x1={vMin} x2={vMax} y1={center} y2={center} />
            )}
            {/* whisker caps */}
            {isV ? (
              <>
                <line x1={center - capW / 2} x2={center + capW / 2} y1={vMax} y2={vMax} />
                <line x1={center - capW / 2} x2={center + capW / 2} y1={vMin} y2={vMin} />
              </>
            ) : (
              <>
                <line x1={vMax} x2={vMax} y1={center - capW / 2} y2={center + capW / 2} />
                <line x1={vMin} x2={vMin} y1={center - capW / 2} y2={center + capW / 2} />
              </>
            )}
            {/* box */}
            <rect
              x={isV ? boxStart : boxStart}
              y={isV ? boxCross : boxCross}
              width={isV ? w : boxLen}
              height={isV ? boxLen : w}
              fill={fill}
              rx={2}
            />
            {/* median */}
            {isV ? (
              <line x1={center - w / 2} x2={center + w / 2} y1={vMed} y2={vMed} strokeWidth={2.5} />
            ) : (
              <line x1={vMed} x2={vMed} y1={center - w / 2} y2={center + w / 2} strokeWidth={2.5} />
            )}
            {/* outliers */}
            {showOutliers &&
              d.outliers?.map((o, oi) => (
                <circle
                  key={oi}
                  cx={isV ? center : valScale(o)}
                  cy={isV ? valScale(o) : center}
                  r={2.5}
                  fill={color}
                  fillOpacity={0.85}
                />
              ))}
          </g>
        );
      })}
    </g>
  );
}

export interface BoxPlotProps {
  /** One row per category, each a {@link BoxStats} summary (+ optional `color`) keyed by `categoryKey`. */
  data: BoxPlotDatum[];
  /** Field holding each row's category label. Defaults to `'category'`. */
  categoryKey?: string;
  /** `vertical` (categories on X, value on Y — default) or `horizontal` (swapped). */
  orientation?: 'vertical' | 'horizontal';
  /** Format axis ticks and tooltip values (e.g. a currency/percent formatter). */
  valueFormatter?: (v: number) => ReactNode;
  /** Draw outlier dots beyond the whiskers. Defaults to `true`. */
  showOutliers?: boolean;
  /** Box thickness as a fraction of the category band (0–1). Defaults to `0.6`. */
  boxRatio?: number;
  /** Override the computed value-axis domain `[min, max]`. */
  domain?: [number, number];
  /** Hide the cartesian grid. */
  hideGrid?: boolean;
  /** Injected by `ResponsiveContainer` — forwarded to the chart. */
  width?: number;
  /** Injected by `ResponsiveContainer` — forwarded to the chart. */
  height?: number;
}

/**
 * Box-and-whisker chart. Drop inside `Chart.Container`; it owns its `ComposedChart`,
 * axes and value-domain, drawing one box per row at true axis scale (box = Q1–Q3,
 * emphasised median, whiskers to the Tukey fences with caps, plus outlier dots).
 * Hovering a box shows its five-number summary. Pre-aggregate raw samples with
 * {@link computeBoxStats}.
 *
 * @example
 * ```tsx
 * <Chart.Container config={{}} style={{ height: 320 }}>
 *   <Chart.BoxPlot
 *     data={[{ team: 'A', ...computeBoxStats(samplesA) }]}
 *     categoryKey="team"
 *     valueFormatter={(v) => `${v}d`}
 *   />
 * </Chart.Container>
 * ```
 */
function BoxPlot({
  data,
  categoryKey = 'category',
  orientation = 'vertical',
  valueFormatter = (v) => String(v),
  showOutliers = true,
  boxRatio = 0.6,
  domain,
  hideGrid = false,
  width,
  height,
}: BoxPlotProps) {
  const isV = orientation !== 'horizontal';
  const resolvedDomain: [number, number] = domain ?? (() => {
    const vals = data.flatMap((d) => [
      d.min,
      d.q1,
      d.median,
      d.q3,
      d.max,
      ...(showOutliers ? (d.outliers ?? []) : []),
    ]);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = (hi - lo) * 0.05 || 1;
    return [lo - pad, hi + pad];
  })();

  const valueAxis = (
    <YAxis
      type="number"
      domain={resolvedDomain}
      tickFormatter={(v) => String(valueFormatter(Number(v)))}
      allowDataOverflow
    />
  );
  const catAxis = <XAxis dataKey={categoryKey} type="category" />;

  return (
    <ComposedChart
      data={data}
      layout={isV ? 'horizontal' : 'vertical'}
      width={width}
      height={height}
      margin={{ top: 8, right: 12, bottom: 4, left: 4 }}
    >
      {!hideGrid && <CartesianGrid vertical={!isV} horizontal={isV} />}
      {isV ? catAxis : (
        <XAxis type="number" domain={resolvedDomain} tickFormatter={(v) => String(valueFormatter(Number(v)))} allowDataOverflow />
      )}
      {isV ? valueAxis : <YAxis dataKey={categoryKey} type="category" width={72} />}
      {/* Transparent anchor: forces a band scale and provides the per-category
          tooltip hit-target. Its only value (median) never widens the explicit domain. */}
      <Bar dataKey="median" fill="transparent" isAnimationActive={false} activeBar={false} />
      <BoxLayer
        data={data}
        categoryKey={categoryKey}
        orientation={orientation}
        showOutliers={showOutliers}
        boxRatio={boxRatio}
        valueFormatter={valueFormatter}
      />
      <RechartsTooltip
        cursor={{ fill: 'var(--eidra-fg)', fillOpacity: 0.04 }}
        content={
          <ChartTooltipContent
            rows={(d: BoxPlotDatum) => [
              { label: 'max', value: valueFormatter(d.max) },
              { label: 'Q3', value: valueFormatter(d.q3) },
              { label: 'median', value: valueFormatter(d.median) },
              { label: 'Q1', value: valueFormatter(d.q1) },
              { label: 'min', value: valueFormatter(d.min) },
              ...(d.outliers?.length ? [{ label: 'outliers', value: d.outliers.length }] : []),
            ]}
          />
        }
      />
    </ComposedChart>
  );
}

// ── Shared data + styling helpers ─────────────────────────────────────────────
// So every chart prepares data and styles axes/grids the same way instead of
// re-implementing it. Colours: keyed series set explicit colours in `config`;
// categorical charts derive their `config` from the ramp via `categoricalConfig`.

/** The 16-colour categorical ramp (`--eidra-chart-1..16`) as an array; cycles past 16. */
const chartColors = CHART_PALETTE;

/**
 * Build a {@link ChartConfig} for a categorical series by assigning the
 * `--eidra-chart-*` ramp to each row in order (wrapping after 16) — so
 * pie/donut/treemap/sunburst/bubble colours flow through `config` →
 * `--color-<key>` → tooltip/legend like keyed series, instead of hardcoding
 * `<Cell fill={\`var(--eidra-chart-${i})\`} />`.
 *
 * @example Chart.categoricalConfig(slices, 'name') // { Consulting: { color: 'var(--eidra-chart-1)' }, … }
 */
function categoricalConfig<T extends Record<string, unknown>>(
  rows: readonly T[],
  keyField: keyof T,
  opts: { labelField?: keyof T; offset?: number } = {},
): ChartConfig {
  const { labelField, offset = 0 } = opts;
  const cfg: ChartConfig = {};
  rows.forEach((row, i) => {
    const key = String(row[keyField]);
    cfg[key] = {
      label: labelField ? (row[labelField] as ReactNode) : key,
      color: chartColors[(i + offset) % chartColors.length]!,
    };
  });
  return cfg;
}

/** One waterfall step: a signed delta, or an absolute subtotal/total bar. */
export interface WaterfallStep {
  label: string;
  value: number;
  /** Render as an absolute bar from 0 (a subtotal/total), not a floating delta. */
  isTotal?: boolean;
}
/** A waterfall step resolved to a stacked `[base, delta]` bar (+ the running value). */
export interface WaterfallBar {
  label: string;
  base: number;
  delta: number;
  value: number;
  isTotal: boolean;
}
/**
 * Resolve signed waterfall steps into floating `{ base, delta }` bars: each delta
 * stacks on the running total; `isTotal` steps render from 0. Draw a transparent
 * `base` bar stacked under a visible `delta` bar.
 */
function toWaterfall(steps: readonly WaterfallStep[]): WaterfallBar[] {
  let running = 0;
  return steps.map((s) => {
    if (s.isTotal) {
      running = s.value;
      return { label: s.label, base: 0, delta: s.value, value: s.value, isTotal: true };
    }
    const base = s.value >= 0 ? running : running + s.value;
    const value = running + s.value;
    running = value;
    return { label: s.label, base, delta: Math.abs(s.value), value, isTotal: false };
  });
}

/**
 * Sum a hierarchy bottom-up: returns a copy where every parent's `value` is the
 * sum of its descendants — Sunburst/Treemap need a value on every node, so source
 * data can carry only leaf values.
 */
function sumHierarchy<T extends { value?: number; children?: T[] }>(node: T): T {
  if (!node.children?.length) return node;
  const children = node.children.map(sumHierarchy);
  return { ...node, children, value: children.reduce((sum, c) => sum + (c.value ?? 0), 0) };
}

/** Map a before/after pair to the `[min, max]` tuple a range `Bar` dataKey needs. */
function dumbbellRange(before: number, after: number): [number, number] {
  return [Math.min(before, after), Math.max(before, after)];
}

/** Default chart margin — `<Chart.BarChart margin={Chart.margin}>`. */
const margin = { top: 8, right: 8, bottom: 0, left: 0 } as const;
/** Default `CartesianGrid` props — `<Chart.CartesianGrid {...Chart.gridProps} />`. */
const gridProps = { strokeDasharray: '4 4' } as const;
/** Default axis props (no spine/tick lines, small type) — spread onto X/Y axes; colour comes from Container CSS. */
const axisProps = { tickLine: false, axisLine: false, tick: { fontSize: 11 } } as const;

/**
 * Composable charting kit built on Recharts and themed with Eidra tokens.
 * `Chart.Container` wires colours + responsiveness; `Chart.TooltipContent` and
 * `Chart.LegendContent` are themed bodies; the rest are Recharts primitives
 * re-exported so apps compose any chart without importing Recharts directly.
 *
 * @example
 * ```tsx
 * <Chart.Container config={{ actuals: { label: 'Actuals', color: 'var(--eidra-finance-revenue-actuals)' } }} style={{ height: 320 }}>
 *   <Chart.ComposedChart data={data}>
 *     <Chart.CartesianGrid vertical={false} />
 *     <Chart.XAxis dataKey="month" />
 *     <Chart.YAxis tickFormatter={(v) => formatCompactCurrency(v)} />
 *     <Chart.Tooltip content={<Chart.TooltipContent formatter={(v) => formatCompactCurrency(Number(v))} />} />
 *     <Chart.Bar {...Chart.seriesDefaults} dataKey="actuals" stackId="s" fill="var(--color-actuals)" />
 *   </Chart.ComposedChart>
 * </Chart.Container>
 * ```
 */
export const Chart = {
  Container: ChartContainer,
  TooltipContent: ChartTooltipContent,
  LegendContent: ChartLegendContent,
  /** Box-and-whisker chart (self-contained; drop inside `Chart.Container`). */
  BoxPlot,
  /** Derive a five-number summary (+ Tukey outliers) from raw samples. */
  computeBoxStats,
  /** `{ isAnimationActive: false }` — spread onto Bar/Line/Area to disable entry animation. */
  seriesDefaults,
  // ── Shared helpers (data prep + styling) ──
  /** The `--eidra-chart-1..16` categorical ramp as an array (cycles past 16). */
  chartColors,
  /** Build a categorical `config` (key → ramp colour) for pie/donut/treemap/sunburst/bubble. */
  categoricalConfig,
  /** Resolve signed waterfall steps into floating `{ base, delta }` bars. */
  toWaterfall,
  /** Fill every parent node's `value` with the sum of its descendants. */
  sumHierarchy,
  /** Map a before/after pair to the `[min, max]` tuple a range Bar needs. */
  dumbbellRange,
  /** Default chart `margin`. */
  margin,
  /** Default `CartesianGrid` props (`strokeDasharray`). */
  gridProps,
  /** Default axis props (no spine/tick lines, small type). */
  axisProps,
  // Re-exported Recharts primitives (so consumers never import `recharts` directly):
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Bar,
  Line,
  Area,
  Scatter,
  Cell,
  LabelList,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Legend,
  Tooltip: RechartsTooltip,
  // Radar
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  // Pie / Donut
  PieChart,
  Pie,
  // Hierarchical
  Treemap,
  SunburstChart,
  // Flow
  Sankey,
};
