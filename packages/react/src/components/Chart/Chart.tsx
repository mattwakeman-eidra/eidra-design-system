import { createContext, forwardRef, useContext } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TreemapNode, SunburstData } from 'recharts';
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
  payload?: Array<{ dataKey?: string | number; name?: string; value?: number | string; color?: string }>;
  label?: ReactNode;
  /** Format each value (e.g. a currency formatter). */
  formatter?: (value: number | string | undefined) => ReactNode;
  /** Format the tooltip heading (the axis label). */
  labelFormatter?: (label: ReactNode) => ReactNode;
  /** Hide the heading row. */
  hideLabel?: boolean;
  /** Extra content rendered below the series rows (e.g. an OPCO split). */
  footer?: ReactNode;
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
  className,
}: ChartTooltipContentProps) {
  const config = useChartConfig();
  if (!active || !payload?.length) return null;
  return (
    <div className={cn(styles.tooltip, className)}>
      {!hideLabel && (
        <div className={styles.tooltipLabel}>{labelFormatter ? labelFormatter(label) : label}</div>
      )}
      <div className={styles.tooltipItems}>
        {payload.map((item, i) => {
          const key = String(item.dataKey ?? item.name ?? i);
          const cfg = config[key];
          const color = item.color ?? cfg?.color ?? `var(--color-${key})`;
          return (
            <div key={i} className={styles.tooltipRow}>
              <span className={styles.tooltipSwatch} style={{ backgroundColor: color }} aria-hidden />
              <span className={styles.tooltipName}>{cfg?.label ?? item.name ?? key}</span>
              <span className={styles.tooltipValue}>
                {formatter ? formatter(item.value) : item.value}
              </span>
            </div>
          );
        })}
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

/** Recharts data-node types for the hierarchical charts (Treemap / Sunburst). */
export type { TreemapNode, SunburstData };

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
  /** `{ isAnimationActive: false }` — spread onto Bar/Line/Area to disable entry animation. */
  seriesDefaults,
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
};
