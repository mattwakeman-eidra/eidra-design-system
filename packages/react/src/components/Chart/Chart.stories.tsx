import { useState, useRef, useLayoutEffect, useCallback, memo, type ReactNode, type ReactElement, type CSSProperties, type SVGProps, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Chart,
  formatCompactCurrency,
  computeBoxStats,
  type ChartConfig,
  type TreemapNode,
  type SunburstData,
  type SankeyData,
  type BoxPlotDatum,
  type WaterfallStep,
} from './Chart.js';

const meta = {
  title: 'Data Display/Chart',
  component: Chart.Container,
  tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  // Placeholder required props; every story supplies real content via `render`.
  args: { config: {}, children: null },
} satisfies Meta<typeof Chart.Container>;

export default meta;

// ── Synthetic forecast data (no real invoicing data) ────────────────────────
interface MonthDatum {
  month: string;
  closed: boolean; // actualized/closed month → bars rendered at full opacity
  actuals: number;
  sold: number;
  hiProb: number;
  additional: number;
  budget: number;
  ly: number;
}

const DATA: MonthDatum[] = [
  { month: 'Jan', closed: true, actuals: 120, sold: 0, hiProb: 0, additional: 0, budget: 110, ly: 100 },
  { month: 'Feb', closed: true, actuals: 130, sold: 0, hiProb: 0, additional: 0, budget: 120, ly: 115 },
  { month: 'Mar', closed: false, actuals: 40, sold: 70, hiProb: 25, additional: 10, budget: 130, ly: 125 },
  { month: 'Apr', closed: false, actuals: 0, sold: 80, hiProb: 40, additional: 20, budget: 140, ly: 130 },
  { month: 'May', closed: false, actuals: 0, sold: 60, hiProb: 50, additional: 35, budget: 150, ly: 140 },
  { month: 'Jun', closed: false, actuals: 0, sold: 40, hiProb: 55, additional: 50, budget: 160, ly: 150 },
];

const config: ChartConfig = {
  actuals: { label: 'Actuals', color: 'var(--eidra-finance-revenue-actuals)' },
  sold: { label: 'Sold', color: 'var(--eidra-finance-revenue-sold)' },
  hiProb: { label: 'Hi-Prob', color: 'var(--eidra-finance-revenue-hi-prob)' },
  additional: { label: 'Additional', color: 'var(--eidra-finance-revenue-additional)' },
  budget: { label: 'Budget', color: 'var(--eidra-finance-revenue-budget)' },
  ly: { label: 'Last year', color: 'var(--eidra-finance-comparison)' },
};

const fmt = (v: number | string | undefined) => formatCompactCurrency(Number(v) * 1000);

/**
 * **Composed** (`ComposedChart`) — stacked revenue bars + budget step line + dashed
 * LY line, themed tooltip, toggleable legend, dimmed closed months. (Used by Sold &
 * Forecast.) Use the controls to toggle the grid, the legend, the budget step line,
 * and the dashed last-year line. (The interactive legend still toggles each stacked
 * series on click.)
 */
interface ComposedArgs {
  showGrid: boolean;
  showLegend: boolean;
  showBudgetLine: boolean;
  showLastYearLine: boolean;
}

export const Composed: StoryObj<ComposedArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showBudgetLine: { control: 'boolean' },
    showLastYearLine: { control: 'boolean' },
  },
  args: { showGrid: true, showLegend: true, showBudgetLine: true, showLastYearLine: true },
  render: ({ showGrid, showLegend, showBudgetLine, showLastYearLine }) => {
    const [hidden, setHidden] = useState<string[]>([]);
    const toggle = (key: string) =>
      setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]));
    const isHidden = (k: string) => hidden.includes(k);

    return (
      <Chart.Container config={config} style={{ height: 360, maxWidth: 760 }}>
        {/* Custom margin kept: top space reserves room for the budget LabelList above the bars. */}
        <Chart.ComposedChart data={DATA} margin={{ top: 20, right: 12, bottom: 0, left: 4 }}>
          {showGrid && <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />}
          <Chart.XAxis {...Chart.axisProps} dataKey="month" />
          <Chart.YAxis
            {...Chart.axisProps}
            width={56}
            tickFormatter={(v: number) => formatCompactCurrency(v * 1000)}
          />
          <Chart.Tooltip
            cursor={{ fill: 'var(--eidra-surface-hover)' }}
            content={<Chart.TooltipContent formatter={fmt} />}
          />
          <Chart.Bar {...Chart.seriesDefaults} dataKey="actuals" stackId="s" fill="var(--color-actuals)" hide={isHidden('actuals')}>
            {DATA.map((d, i) => (
              <Chart.Cell key={i} fillOpacity={d.closed ? 1 : 0.55} />
            ))}
          </Chart.Bar>
          <Chart.Bar {...Chart.seriesDefaults} dataKey="sold" stackId="s" fill="var(--color-sold)" hide={isHidden('sold')} />
          <Chart.Bar {...Chart.seriesDefaults} dataKey="hiProb" stackId="s" fill="var(--color-hiProb)" hide={isHidden('hiProb')} />
          <Chart.Bar {...Chart.seriesDefaults}
            dataKey="additional"
            stackId="s"
            fill="var(--color-additional)"
            radius={[3, 3, 0, 0]}
            hide={isHidden('additional')}
          >
            <Chart.LabelList
              dataKey="budget"
              position="top"
              formatter={(v) => formatCompactCurrency(Number(v) * 1000)}
            />
          </Chart.Bar>
          {showLastYearLine && (
            <Chart.Line {...Chart.seriesDefaults}
              dataKey="ly"
              type="monotone"
              stroke="var(--color-ly)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              hide={isHidden('ly')}
            />
          )}
          {showBudgetLine && (
            <Chart.Line {...Chart.seriesDefaults}
              dataKey="budget"
              type="step"
              stroke="var(--color-budget)"
              strokeWidth={2.5}
              dot={false}
              hide={isHidden('budget')}
            />
          )}
          {showLegend && <Chart.Legend content={<Chart.LegendContent hidden={hidden} onToggle={toggle} />} />}
        </Chart.ComposedChart>
      </Chart.Container>
    );
  },
};

// ── A simple two-series dataset for the single-type examples (bars/line/area) ──
interface TrendDatum {
  month: string;
  revenue: number;
  target: number;
}
const TREND: TrendDatum[] = [
  { month: 'Jan', revenue: 120, target: 110 },
  { month: 'Feb', revenue: 138, target: 120 },
  { month: 'Mar', revenue: 131, target: 130 },
  { month: 'Apr', revenue: 154, target: 140 },
  { month: 'May', revenue: 149, target: 150 },
  { month: 'Jun', revenue: 168, target: 160 },
];
const trendConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: 'var(--eidra-finance-revenue-actuals)' },
  target: { label: 'Target', color: 'var(--eidra-finance-comparison)' },
};

/**
 * **Bars** (`BarChart`) — grouped bars comparing two series. Use the controls to
 * toggle the grid, per-bar value labels (`LabelList`), and the legend.
 */
interface BarsArgs {
  showGrid: boolean;
  showLabels: boolean;
  showLegend: boolean;
}

export const Bars: StoryObj<BarsArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showGrid: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
  args: { showGrid: true, showLabels: false, showLegend: true },
  render: ({ showGrid, showLabels, showLegend }) => (
    <Chart.Container config={trendConfig} style={{ height: 300, maxWidth: 640 }}>
      {/* Custom margin kept: top space reserves room for the per-bar value LabelLists. */}
      <Chart.BarChart data={TREND} margin={{ top: 16, right: 12, bottom: 0, left: 4 }}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />}
        <Chart.XAxis {...Chart.axisProps} dataKey="month" />
        <Chart.YAxis {...Chart.axisProps} width={48} tickFormatter={fmt} />
        <Chart.Tooltip cursor={{ fill: 'var(--eidra-surface-hover)' }} content={<Chart.TooltipContent formatter={fmt} />} />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="revenue" fill="var(--color-revenue)" radius={[3, 3, 0, 0]}>
          {showLabels && <Chart.LabelList dataKey="revenue" position="top" fontSize={11} formatter={(v) => fmt(Number(v))} />}
        </Chart.Bar>
        <Chart.Bar {...Chart.seriesDefaults} dataKey="target" fill="var(--color-target)" radius={[3, 3, 0, 0]}>
          {showLabels && <Chart.LabelList dataKey="target" position="top" fontSize={11} formatter={(v) => fmt(Number(v))} />}
        </Chart.Bar>
        {showLegend && <Chart.Legend content={<Chart.LegendContent />} />}
      </Chart.BarChart>
    </Chart.Container>
  ),
};

/**
 * **Line** (`LineChart`) — a trend line vs target. Use the controls to switch the
 * interpolation **curve** (monotone / linear / step), toggle the dots on the revenue
 * line, toggle the grid, and show/hide the dashed target line.
 */
type Curve = 'monotone' | 'linear' | 'step';

interface LineArgs {
  curve: Curve;
  showDots: boolean;
  showGrid: boolean;
  showTarget: boolean;
}

export const Line: StoryObj<LineArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    curve: { control: 'inline-radio', options: ['monotone', 'linear', 'step'] },
    showDots: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showTarget: { control: 'boolean' },
  },
  args: { curve: 'monotone', showDots: true, showGrid: true, showTarget: true },
  render: ({ curve, showDots, showGrid, showTarget }) => (
    <Chart.Container config={trendConfig} style={{ height: 300, maxWidth: 640 }}>
      <Chart.LineChart data={TREND} margin={Chart.margin}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />}
        <Chart.XAxis {...Chart.axisProps} dataKey="month" />
        <Chart.YAxis {...Chart.axisProps} width={48} tickFormatter={fmt} />
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} />} />
        <Chart.Line {...Chart.seriesDefaults} dataKey="revenue" type={curve} stroke="var(--color-revenue)" strokeWidth={2} dot={showDots ? { r: 3 } : false} />
        {showTarget && (
          <Chart.Line {...Chart.seriesDefaults} dataKey="target" type={curve} stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
        )}
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.LineChart>
    </Chart.Container>
  ),
};

/**
 * **Area** (`AreaChart`) — a filled trend with a target line. Use the controls to
 * switch the interpolation **curve**, tune the area **fillOpacity**, toggle the grid,
 * and show/hide the dashed target line.
 */
interface AreaArgs {
  curve: Curve;
  fillOpacity: number;
  showGrid: boolean;
  showTarget: boolean;
}

export const Area: StoryObj<AreaArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    curve: { control: 'inline-radio', options: ['monotone', 'linear', 'step'] },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    showGrid: { control: 'boolean' },
    showTarget: { control: 'boolean' },
  },
  args: { curve: 'monotone', fillOpacity: 0.2, showGrid: true, showTarget: true },
  render: ({ curve, fillOpacity, showGrid, showTarget }) => (
    <Chart.Container config={trendConfig} style={{ height: 300, maxWidth: 640 }}>
      <Chart.AreaChart data={TREND} margin={Chart.margin}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />}
        <Chart.XAxis {...Chart.axisProps} dataKey="month" />
        <Chart.YAxis {...Chart.axisProps} width={48} tickFormatter={fmt} />
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} />} />
        <Chart.Area {...Chart.seriesDefaults} dataKey="revenue" type={curve} stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={fillOpacity} strokeWidth={2} />
        {showTarget && (
          <Chart.Line {...Chart.seriesDefaults} dataKey="target" type={curve} stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
        )}
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.AreaChart>
    </Chart.Container>
  ),
};

// ── A non-revenue use case: headcount budget vs demand vs actual ─────────────
// Proves the kit is domain-agnostic — generic tokens, plain (non-currency) units,
// budget as a black step line ("blackline"), demand as a line, actual as bars.
interface HeadcountDatum {
  month: string;
  actual: number;
  demand: number;
  budget: number;
}

const HEADCOUNT: HeadcountDatum[] = [
  { month: 'Q1', actual: 42, demand: 45, budget: 48 },
  { month: 'Q2', actual: 46, demand: 50, budget: 48 },
  { month: 'Q3', actual: 49, demand: 54, budget: 52 },
  { month: 'Q4', actual: 53, demand: 58, budget: 52 },
];

const headcountConfig: ChartConfig = {
  actual: { label: 'Actual', color: 'var(--eidra-accent)' },
  demand: { label: 'Demand', color: 'var(--eidra-info)' },
  budget: { label: 'Budget', color: 'var(--eidra-fg)' },
};

const fte = (v: number | string | undefined) => `${Number(v)} FTE`;

/**
 * **Composed — bar + line** (`ComposedChart`) — actual (bars) vs demand (line)
 * against a budget **black step line**. Same kit, different domain: generic tokens,
 * FTE units. (Used by Headcount.) Use the controls to toggle the grid, legend, the
 * demand line, and the budget step line.
 */
interface ComposedBarLineArgs {
  showGrid: boolean;
  showLegend: boolean;
  showDemandLine: boolean;
  showBudgetLine: boolean;
}

export const ComposedBarLine: StoryObj<ComposedBarLineArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showDemandLine: { control: 'boolean' },
    showBudgetLine: { control: 'boolean' },
  },
  args: { showGrid: true, showLegend: true, showDemandLine: true, showBudgetLine: true },
  render: ({ showGrid, showLegend, showDemandLine, showBudgetLine }) => (
    <Chart.Container config={headcountConfig} style={{ height: 320, maxWidth: 640 }}>
      <Chart.ComposedChart data={HEADCOUNT} margin={Chart.margin}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />}
        <Chart.XAxis {...Chart.axisProps} dataKey="month" />
        <Chart.YAxis {...Chart.axisProps} width={40} />
        <Chart.Tooltip
          cursor={{ fill: 'var(--eidra-surface-hover)' }}
          content={<Chart.TooltipContent formatter={fte} />}
        />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="actual" fill="var(--color-actual)" radius={[3, 3, 0, 0]} barSize={28} />
        {showDemandLine && (
          <Chart.Line {...Chart.seriesDefaults}
            dataKey="demand"
            type="monotone"
            stroke="var(--color-demand)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        )}
        {showBudgetLine && (
          <Chart.Line {...Chart.seriesDefaults} dataKey="budget" type="step" stroke="var(--color-budget)" strokeWidth={2.5} dot={false} />
        )}
        {showLegend && <Chart.Legend content={<Chart.LegendContent />} />}
      </Chart.ComposedChart>
    </Chart.Container>
  ),
};

// ── Dual-axis combo: revenue bars (MSEK) + EBITDA-margin line (%) ────────────
// The financial-deck shape: revenue is plotted as stacked bars on a LEFT axis in
// MSEK (~0–2000), while the EBITDA margin (~10–22%) rides a separate RIGHT axis in
// percent. On a single axis the margin line would be a flat smear along the bottom —
// the two y-axes are what make the percentage legible against the revenue scale.
interface DualAxisDatum {
  month: string;
  /** Actualised revenue, MSEK (left axis, "rev" stack). */
  revActuals: number;
  /** Forecast (FC1) revenue, MSEK (left axis, stacked on top of actuals). */
  revForecast: number;
  /** EBITDA margin, % (right axis). */
  margin: number;
  /** Forecast (FC1) EBITDA margin, % (right axis, dashed). */
  marginFc1: number;
}

// 18 months: 12 actualised, then 6 forecast (actuals taper, forecast picks up).
const DUAL_AXIS: DualAxisDatum[] = [
  { month: "Jan '24", revActuals: 1180, revForecast: 0, margin: 11.2, marginFc1: 11.2 },
  { month: "Feb '24", revActuals: 1240, revForecast: 0, margin: 12.0, marginFc1: 12.0 },
  { month: "Mar '24", revActuals: 1390, revForecast: 0, margin: 13.4, marginFc1: 13.4 },
  { month: "Apr '24", revActuals: 1320, revForecast: 0, margin: 12.8, marginFc1: 12.8 },
  { month: "May '24", revActuals: 1450, revForecast: 0, margin: 14.1, marginFc1: 14.1 },
  { month: "Jun '24", revActuals: 1610, revForecast: 0, margin: 15.6, marginFc1: 15.6 },
  { month: "Jul '24", revActuals: 1380, revForecast: 0, margin: 13.0, marginFc1: 13.0 },
  { month: "Aug '24", revActuals: 1290, revForecast: 0, margin: 12.2, marginFc1: 12.2 },
  { month: "Sep '24", revActuals: 1540, revForecast: 0, margin: 15.0, marginFc1: 15.0 },
  { month: "Oct '24", revActuals: 1680, revForecast: 0, margin: 16.3, marginFc1: 16.3 },
  { month: "Nov '24", revActuals: 1620, revForecast: 0, margin: 15.8, marginFc1: 15.8 },
  { month: "Dec '24", revActuals: 1820, revForecast: 0, margin: 18.1, marginFc1: 18.1 },
  { month: "Jan '25", revActuals: 980, revForecast: 360, margin: 14.2, marginFc1: 15.0 },
  { month: "Feb '25", revActuals: 0, revForecast: 1380, margin: 14.8, marginFc1: 16.1 },
  { month: "Mar '25", revActuals: 0, revForecast: 1520, margin: 15.4, marginFc1: 17.0 },
  { month: "Apr '25", revActuals: 0, revForecast: 1610, margin: 15.9, marginFc1: 18.2 },
  { month: "May '25", revActuals: 0, revForecast: 1700, margin: 16.5, marginFc1: 19.4 },
  { month: "Jun '25", revActuals: 0, revForecast: 1880, margin: 17.1, marginFc1: 21.0 },
];

const dualAxisConfig: ChartConfig = {
  revActuals: { label: 'Revenue (actuals)', color: 'var(--eidra-finance-revenue-actuals)' },
  revForecast: { label: 'Revenue (FC1)', color: 'var(--eidra-finance-revenue-budget)' },
  margin: { label: 'EBITDA margin', color: 'var(--eidra-fg)' },
  marginFc1: { label: 'EBITDA margin (FC1)', color: 'var(--eidra-finance-comparison)' },
};

// Left axis in MSEK (data is already in MSEK; ×1_000_000 brings it to SEK so the
// shared currency helper can format it compactly). Right axis in percent.
const msekAxis = (v: number | string | undefined) => formatCompactCurrency(Number(v) * 1_000_000);
const pctAxis = (v: number | string | undefined) => `${Number(v)}%`;
// The tooltip mixes both units. TooltipContent's `formatter` only receives the value
// (not the series key), so disambiguate by magnitude: margins are ≤25, revenue rows
// are 0 or ≥360 MSEK — a positive value at/below the 25% ceiling is a percentage.
const dualAxisTooltip = (value: number | string | undefined) => {
  const n = Number(value);
  return n > 0 && n <= 25 ? pctAxis(value) : msekAxis(value);
};

/**
 * **Dual-axis combo** (`ComposedChart` with two `YAxis`) — the canonical financial-deck
 * chart: stacked **revenue bars in MSEK on the LEFT axis** (`yAxisId="left"`) plus an
 * **EBITDA-margin line in % on the RIGHT axis** (`yAxisId="right"`, `orientation="right"`).
 * Each series declares which axis it belongs to via `yAxisId`. Because the margin
 * (~10–22%) and revenue (~0–2000 MSEK) live on wildly different scales, a single axis
 * would flatten the margin line into the baseline — the second axis is what makes it
 * readable. Actuals + forecast (FC1) revenue share one `stackId`; a solid actual margin
 * and a dashed FC1 margin track the right axis. (Deck page 17.)
 */
interface DualAxisArgs {
  showFc1Margin: boolean;
  showGrid: boolean;
  showLegend: boolean;
}

export const DualAxis: StoryObj<DualAxisArgs> = {
  argTypes: {
    showFc1Margin: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
  args: { showFc1Margin: true, showGrid: true, showLegend: true },
  render: ({ showFc1Margin, showGrid, showLegend }) => (
    <Chart.Container config={dualAxisConfig} style={{ height: 380, maxWidth: 820 }}>
      <Chart.ComposedChart data={DUAL_AXIS} margin={Chart.margin}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />}
        <Chart.XAxis {...Chart.axisProps} dataKey="month" interval={0} />
        {/* Left axis: revenue in MSEK. */}
        <Chart.YAxis
          {...Chart.axisProps}
          yAxisId="left"
          width={56}
          tickFormatter={msekAxis}
        />
        {/* Right axis: EBITDA margin in percent, fixed 0–25 so the line sits mid-plot. */}
        <Chart.YAxis
          {...Chart.axisProps}
          yAxisId="right"
          orientation="right"
          domain={[0, 25]}
          width={44}
          tickFormatter={pctAxis}
        />
        <Chart.Tooltip
          cursor={{ fill: 'var(--eidra-surface-hover)' }}
          content={<Chart.TooltipContent formatter={dualAxisTooltip} />}
        />
        <Chart.Bar
          {...Chart.seriesDefaults}
          yAxisId="left"
          dataKey="revActuals"
          stackId="rev"
          fill="var(--color-revActuals)"
        />
        <Chart.Bar
          {...Chart.seriesDefaults}
          yAxisId="left"
          dataKey="revForecast"
          stackId="rev"
          fill="var(--color-revForecast)"
          radius={[3, 3, 0, 0]}
        />
        <Chart.Line
          {...Chart.seriesDefaults}
          yAxisId="right"
          dataKey="margin"
          type="monotone"
          stroke="var(--color-margin)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
        {showFc1Margin && (
          <Chart.Line
            {...Chart.seriesDefaults}
            yAxisId="right"
            dataKey="marginFc1"
            type="monotone"
            stroke="var(--color-marginFc1)"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={false}
          />
        )}
        {showLegend && <Chart.Legend content={<Chart.LegendContent />} />}
      </Chart.ComposedChart>
    </Chart.Container>
  ),
};

// ── Bubble / scatter: client revenue vs growth, bubble size = total revenue ──
interface ClientPoint {
  client: string;
  revenue: number; // €k (x)
  growth: number; // % YoY (y)
  total: number; // €k → bubble size (z)
  tier: 'small' | 'mid' | 'large' | 'pillar';
}

const CLIENTS: ClientPoint[] = [
  { client: 'Acme Corp', revenue: 2400, growth: 12, total: 2400, tier: 'large' },
  { client: 'Globex', revenue: 1800, growth: -5, total: 1800, tier: 'mid' },
  { client: 'Initech', revenue: 900, growth: 22, total: 900, tier: 'small' },
  { client: 'Umbrella', revenue: 3200, growth: 4, total: 3200, tier: 'pillar' },
  { client: 'Soylent', revenue: 1200, growth: 18, total: 1200, tier: 'mid' },
  { client: 'Hooli', revenue: 600, growth: -12, total: 600, tier: 'small' },
  { client: 'Stark', revenue: 2800, growth: 9, total: 2800, tier: 'large' },
  { client: 'Wayne', revenue: 3600, growth: 2, total: 3600, tier: 'pillar' },
  { client: 'Wonka', revenue: 750, growth: 30, total: 750, tier: 'small' },
  { client: 'Cyberdyne', revenue: 1500, growth: -3, total: 1500, tier: 'mid' },
];

const TIERS = ['small', 'mid', 'large', 'pillar'] as const;

// Categorical chart → colours flow from the ramp through `config` → `--color-<tier>`,
// via `Chart.categoricalConfig`, instead of hardcoded per-tier tokens.
const TIER_META = [
  { tier: 'small', label: 'Small' },
  { tier: 'mid', label: 'Mid-market' },
  { tier: 'large', label: 'Enterprise' },
  { tier: 'pillar', label: 'Pillar' },
] as const;

const bubbleConfig: ChartConfig = Chart.categoricalConfig(TIER_META, 'tier', { labelField: 'label' });

/**
 * **Bubble / Scatter** (`ScatterChart`) — client revenue (x) vs YoY growth (y) with
 * bubble size by total revenue (`ZAxis`), one series per size tier. Uses the same
 * themed `Chart.Container` config, `ReferenceLine`, tooltip, and legend. (Used by the
 * Client Dashboard.) Use the controls to toggle the grid, toggle the zero-growth
 * `ReferenceLine`, and scale the maximum bubble size (`ZAxis` range).
 */
interface BubbleArgs {
  showGrid: boolean;
  showZeroLine: boolean;
  maxBubbleSize: number;
}

export const Bubble: StoryObj<BubbleArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showGrid: { control: 'boolean' },
    showZeroLine: { control: 'boolean' },
    maxBubbleSize: { control: { type: 'range', min: 300, max: 1200, step: 50 } },
  },
  args: { showGrid: true, showZeroLine: true, maxBubbleSize: 700 },
  render: ({ showGrid, showZeroLine, maxBubbleSize }) => (
    <Chart.Container config={bubbleConfig} style={{ height: 380, maxWidth: 680 }}>
      <Chart.ScatterChart margin={Chart.margin}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} />}
        <Chart.XAxis
          {...Chart.axisProps}
          type="number"
          dataKey="revenue"
          name="Revenue"
          tickFormatter={(v: number) => formatCompactCurrency(v * 1000)}
        />
        <Chart.YAxis
          {...Chart.axisProps}
          type="number"
          dataKey="growth"
          name="Growth"
          unit="%"
          width={44}
        />
        <Chart.ZAxis type="number" dataKey="total" range={[80, maxBubbleSize]} name="Total" />
        {showZeroLine && <Chart.ReferenceLine y={0} stroke="var(--eidra-border-strong)" strokeDasharray="2 2" />}
        <Chart.Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={<Chart.TooltipContent hideLabel />}
        />
        {TIERS.map((tier) => (
          <Chart.Scatter
            {...Chart.seriesDefaults}
            key={tier}
            name={String(bubbleConfig[tier]?.label ?? tier)}
            data={CLIENTS.filter((c) => c.tier === tier)}
            fill={bubbleConfig[tier]?.color}
            fillOpacity={0.65}
          />
        ))}
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.ScatterChart>
    </Chart.Container>
  ),
};

// ── Radar: team capability assessment across six skill axes ─────────────────
// Non-financial, domain-agnostic. Categorical chart palette (--eidra-chart-N),
// theme-reactive (distinct in light, brighter in dark).
interface CapabilityDatum {
  skill: string;
  platform: number; // 0–100
  product: number; // 0–100
}

const CAPABILITY: CapabilityDatum[] = [
  { skill: 'Frontend', platform: 65, product: 90 },
  { skill: 'Backend', platform: 92, product: 70 },
  { skill: 'Infra / DevOps', platform: 88, product: 45 },
  { skill: 'Data', platform: 70, product: 60 },
  { skill: 'Design', platform: 40, product: 85 },
  { skill: 'Product sense', platform: 55, product: 95 },
];

const radarConfig: ChartConfig = {
  platform: { label: 'Platform team', color: 'var(--eidra-chart-1)' },
  product: { label: 'Product team', color: 'var(--eidra-chart-2)' },
};

const score = (v: number | string | undefined) => `${Number(v)} / 100`;

/**
 * **Radar** (`RadarChart`) — multi-series radar comparing two teams across six
 * capability axes. Polar grid + angle/radius axes are themed via tokens; each
 * `Radar` uses a categorical chart colour with a translucent fill. Use the controls
 * to toggle the polar grid, tune the area **fillOpacity**, and show/hide the Product
 * team series.
 */
interface RadarArgs {
  showGrid: boolean;
  fillOpacity: number;
  showProduct: boolean;
}

export const Radar: StoryObj<RadarArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showGrid: { control: 'boolean' },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    showProduct: { control: 'boolean' },
  },
  args: { showGrid: true, fillOpacity: 0.25, showProduct: true },
  render: ({ showGrid, fillOpacity, showProduct }) => (
    <Chart.Container
      config={radarConfig}
      style={{ height: 360, maxWidth: 560 }}
      aria-label="Team capability assessment across six skills, comparing the Platform and Product teams"
    >
      <Chart.RadarChart data={CAPABILITY} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
        {showGrid && <Chart.PolarGrid />}
        <Chart.PolarAngleAxis dataKey="skill" />
        {/* Keep the 0–100 scale numbers, but place them on the upper-right gap
            (angle 60°) between the Frontend and Backend spokes instead of straight
            up — at 90° the "100" tick collided with the "Frontend" axis label. */}
        <Chart.PolarRadiusAxis
          angle={60}
          domain={[0, 100]}
          tickCount={5}
          axisLine={false}
          tick={{ fill: 'var(--eidra-fg-muted)', fontSize: 11 }}
        />
        <Chart.Tooltip content={<Chart.TooltipContent formatter={score} />} />
        <Chart.Radar
          {...Chart.seriesDefaults}
          dataKey="platform"
          stroke="var(--color-platform)"
          fill="var(--color-platform)"
          fillOpacity={fillOpacity}
          strokeWidth={2}
        />
        {showProduct && (
          <Chart.Radar
            {...Chart.seriesDefaults}
            dataKey="product"
            stroke="var(--color-product)"
            fill="var(--color-product)"
            fillOpacity={fillOpacity}
            strokeWidth={2}
          />
        )}
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.RadarChart>
    </Chart.Container>
  ),
};

// ── Pie / Donut: categorical revenue breakdown by business line ──────────────
// One slice per category; colours come from the categorical chart tokens,
// mapped per-slice via <Chart.Cell>. Config is keyed by slice *name* (pie
// tooltip/legend payload uses `name` from `nameKey`).
interface SliceDatum {
  key: string;
  name: string;
  value: number; // €k
  // Index signature so the row satisfies `Chart.categoricalConfig`'s constraint.
  [k: string]: unknown;
}

const REVENUE_BY_LINE: SliceDatum[] = [
  { key: 'consulting', name: 'Consulting', value: 4200 },
  { key: 'managed', name: 'Managed Services', value: 3100 },
  { key: 'product', name: 'Product Licences', value: 2350 },
  { key: 'support', name: 'Support', value: 1450 },
  { key: 'training', name: 'Training', value: 780 },
  { key: 'other', name: 'Other', value: 420 },
];

// Categorical: colours flow from the ramp through `config` → `--color-<name>`.
// Keyed by slice `name` (the pie tooltip/legend payload uses `name` from `nameKey`).
const pieConfig: ChartConfig = Chart.categoricalConfig(REVENUE_BY_LINE, 'name');

const TOTAL_REVENUE = REVENUE_BY_LINE.reduce((sum, d) => sum + d.value, 0);

/**
 * **Pie** (`PieChart`) — a categorical breakdown (revenue by business line). Each
 * slice maps to a theme-reactive categorical token (`--eidra-chart-N`) via
 * `<Chart.Cell>`; a thin `--eidra-surface` stroke separates slices in both themes.
 * Use the controls to toggle per-slice labels, toggle the legend, and tune the
 * **paddingAngle** gap between slices.
 */
interface PieArgs {
  showLabels: boolean;
  showLegend: boolean;
  paddingAngle: number;
}

export const Pie: StoryObj<PieArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    paddingAngle: { control: { type: 'range', min: 0, max: 8, step: 1 } },
  },
  args: { showLabels: true, showLegend: true, paddingAngle: 2 },
  render: ({ showLabels, showLegend, paddingAngle }) => (
    <Chart.Container
      config={pieConfig}
      style={{ height: 360, maxWidth: 520 }}
      aria-label="Revenue by business line"
    >
      <Chart.PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
        <Chart.Pie
          {...Chart.seriesDefaults}
          data={REVENUE_BY_LINE}
          dataKey="value"
          nameKey="name"
          outerRadius="80%"
          paddingAngle={paddingAngle}
          stroke="var(--eidra-surface)"
          strokeWidth={2}
          label={
            showLabels
              ? ({ name, percent }: { name?: string; percent?: number }) =>
                  `${name} · ${((percent ?? 0) * 100).toFixed(0)}%`
              : false
          }
          labelLine={false}
        >
          {REVENUE_BY_LINE.map((d) => (
            <Chart.Cell key={d.key} fill={pieConfig[d.name]?.color} />
          ))}
        </Chart.Pie>
        {showLegend && <Chart.Legend content={<Chart.LegendContent />} />}
      </Chart.PieChart>
    </Chart.Container>
  ),
};

/**
 * **Donut** (`PieChart` with `innerRadius`) — same breakdown as a donut with a
 * centred total. The centre label is an overlay (Recharts has no native one),
 * `aria-hidden` + `pointer-events:none` so it never blocks slice hover. Use the
 * controls to tune the donut **innerRadius** (hole size), the **paddingAngle** gap,
 * and toggle the legend below the chart.
 */
interface DonutArgs {
  innerRadius: number;
  paddingAngle: number;
  showLegend: boolean;
}

export const Donut: StoryObj<DonutArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    innerRadius: { control: { type: 'range', min: 30, max: 75, step: 1 } },
    paddingAngle: { control: { type: 'range', min: 0, max: 8, step: 1 } },
    showLegend: { control: 'boolean' },
  },
  args: { innerRadius: 58, paddingAngle: 2, showLegend: true },
  render: ({ innerRadius, paddingAngle, showLegend }) => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-4)', maxWidth: 520 }}>
      {/* Chart + centred total. The legend lives below (not inside the chart) so it
          no longer reserves space at the bottom and pushes the donut — and its
          centred total — off-centre. */}
      <div style={{ position: 'relative' }}>
        <Chart.Container config={pieConfig} style={{ height: 320 }} aria-label="Revenue by business line">
          <Chart.PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
            <Chart.Pie
              {...Chart.seriesDefaults}
              data={REVENUE_BY_LINE}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={`${innerRadius}%`}
              outerRadius="82%"
              paddingAngle={paddingAngle}
              cornerRadius={3}
              stroke="var(--eidra-surface)"
              strokeWidth={2}
            >
              {REVENUE_BY_LINE.map((d) => (
                <Chart.Cell key={d.key} fill={pieConfig[d.name]?.color} />
              ))}
            </Chart.Pie>
          </Chart.PieChart>
        </Chart.Container>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              font: '600 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--eidra-fg-muted)',
            }}
          >
            Total
          </span>
          <span
            style={{
              font: '700 var(--eidra-font-size-xl)/1.1 var(--eidra-font-family-sans)',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--eidra-fg)',
            }}
          >
            {fmt(TOTAL_REVENUE)}
          </span>
        </div>
      </div>
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--eidra-space-3)',
            justifyContent: 'center',
            font: 'var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
            color: 'var(--eidra-fg-muted)',
          }}
        >
          {REVENUE_BY_LINE.map((d, i) => (
            <span key={d.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-1-5)' }}>
              <span
                aria-hidden
                style={{
                  // This legend lives outside Chart.Container, so --color-* isn't in
                  // scope here; reference the ramp directly (same colour as the slice).
                  width: 10,
                  height: 10,
                  borderRadius: 'var(--eidra-radius-full)',
                  background: Chart.chartColors[i % Chart.chartColors.length],
                }}
              />
              {d.name}
            </span>
          ))}
        </div>
      )}
    </div>
  ),
};

// ── Treemap: cloud spend by service category → service ───────────────────────
// Hierarchical. Each top-level category carries a `colorKey` (a ChartConfig key
// → --color-<key> → an --eidra-chart-N token); leaves inherit it via node.root.
interface SpendNode {
  name: string;
  value?: number;
  colorKey?: string;
  children?: SpendNode[];
  // Treemap's data type requires an index signature (TreemapDataType).
  [key: string]: unknown;
}

const SPEND: SpendNode[] = [
  {
    name: 'Compute',
    colorKey: 'compute',
    children: [
      { name: 'EC2', value: 48200, colorKey: 'compute' },
      { name: 'Lambda', value: 12400, colorKey: 'compute' },
      { name: 'ECS', value: 9100, colorKey: 'compute' },
    ],
  },
  {
    name: 'Storage',
    colorKey: 'storage',
    children: [
      { name: 'S3', value: 21800, colorKey: 'storage' },
      { name: 'EBS', value: 7300, colorKey: 'storage' },
    ],
  },
  {
    name: 'Database',
    colorKey: 'database',
    children: [
      { name: 'RDS', value: 18600, colorKey: 'database' },
      { name: 'DynamoDB', value: 6200, colorKey: 'database' },
    ],
  },
  {
    name: 'Networking',
    colorKey: 'networking',
    children: [
      { name: 'CloudFront', value: 8400, colorKey: 'networking' },
      { name: 'Data transfer', value: 5100, colorKey: 'networking' },
    ],
  },
  {
    name: 'Analytics',
    colorKey: 'analytics',
    children: [{ name: 'Redshift', value: 9700, colorKey: 'analytics' }],
  },
];

// Categorical: each top-level category keyed by its `colorKey` flows the ramp
// through `config` → `--color-<colorKey>` (the node renderer reads that var).
const spendConfig: ChartConfig = Chart.categoricalConfig(SPEND, 'colorKey', { labelField: 'name' });

// Custom Treemap node renderer: colour each leaf by its category's
// --color-<colorKey> token, separate tiles with an --eidra-surface stroke, and
// only label leaves big enough to fit. Parent rects stay transparent. Label uses
// a fixed light tone — legible on the saturated chart fills in both themes.
function renderSpendNode(showLabels: boolean) {
  return (node: TreemapNode): ReactElement => {
    const { x, y, width, height, depth, name } = node;
    const colorKey =
      (node.colorKey as string | undefined) ??
      ((node.root as TreemapNode | undefined)?.colorKey as string | undefined) ??
      'compute';
    const isLeaf = depth >= 2;
    const showLabel = showLabels && isLeaf && width > 56 && height > 24;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isLeaf ? spendConfig[colorKey]?.color : 'transparent'}
          stroke="var(--eidra-surface)"
          strokeWidth={2}
          strokeOpacity={isLeaf ? 1 : 0}
        />
        {showLabel && (
          <text
            x={x + 7}
            y={y + 17}
            fontSize={11}
            fontFamily="var(--eidra-font-family-sans)"
            fill="rgba(255, 255, 255, 0.96)"
            style={{ pointerEvents: 'none' }}
          >
            {name}
          </text>
        )}
      </g>
    );
  };
}

const fmtSpend = (v: number | string | undefined) => formatCompactCurrency(Number(v));

/**
 * **Treemap** (`Treemap`) — hierarchical cloud spend (service category → service).
 * Each top-level category is coloured with an `--eidra-chart-N` token via a custom
 * node renderer; leaves inherit their category colour, tiles are separated by an
 * `--eidra-surface` stroke, and only large leaves are labelled. Use the controls to
 * toggle leaf labels and tune the tile **aspectRatio** (tile proportions).
 */
interface TreemapArgs {
  showLabels: boolean;
  aspectRatio: number;
}

export const Treemap: StoryObj<TreemapArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showLabels: { control: 'boolean' },
    aspectRatio: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
  },
  args: { showLabels: true, aspectRatio: 1.5 },
  render: ({ showLabels, aspectRatio }) => (
    <Chart.Container
      config={spendConfig}
      style={{ height: 360, maxWidth: 680 }}
      aria-label="Cloud spend by service category and service"
    >
      <Chart.Treemap
        data={SPEND}
        dataKey="value"
        nameKey="name"
        aspectRatio={aspectRatio}
        stroke="var(--eidra-surface)"
        {...Chart.seriesDefaults}
        content={renderSpendNode(showLabels)}
      >
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmtSpend} />} />
      </Chart.Treemap>
    </Chart.Container>
  ),
};

// Recharts 3.8 SunburstChart computes its centre from the numeric `width`/`height`
// props — it does NOT read ResponsiveContainer's size, and `width="100%"` yields
// cx = NaN (blank chart). So measure the box ourselves and hand it real pixel
// numbers. The ref-dedupe stops the ResizeObserver's no-op ticks from re-rendering
// (and from scheduling updates outside act() in tests).
function ResponsiveBox({
  height,
  ariaLabel,
  children,
}: {
  height: number;
  ariaLabel: string;
  children: (width: number, height: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const last = useRef<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      if (last.current && last.current.w === w && last.current.h === h) return;
      last.current = { w, h };
      setSize({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} role="img" aria-label={ariaLabel} style={{ height, width: '100%' }}>
      {size && size.w > 0 ? children(size.w, size.h) : null}
    </div>
  );
}

// ── Sunburst: annual budget allocation (department → team) ───────────────────
// SunburstChart is self-contained (no child series): one hierarchical root with
// per-node `fill`. Top-level nodes carry the categorical colour; children inherit.
// recharts 3.8 SunburstChart does NOT auto-sum child values (unlike Treemap), so
// every node — including the root and each department — needs an explicit `value`
// equal to the sum of its children; otherwise the parent rings' angular spans come
// out NaN and the chart renders blank.
// Leaf values only; `Chart.sumHierarchy` fills each parent's `value` with the sum
// of its descendants (recharts SunburstChart needs a value on every node). Fills are
// inline --eidra-chart-* tokens because this chart renders without Chart.Container
// (no --color-* scope) — the colour comes from the ThemeProvider tokens directly.
const BUDGET_TREE: SunburstData = Chart.sumHierarchy<SunburstData>({
  name: 'Budget',
  children: [
    {
      name: 'Engineering',
      fill: 'var(--eidra-chart-1)',
      children: [
        { name: 'Platform', value: 32, fill: 'var(--eidra-chart-1)' },
        { name: 'Product', value: 26, fill: 'var(--eidra-chart-1)' },
        { name: 'Data', value: 14, fill: 'var(--eidra-chart-1)' },
      ],
    },
    {
      name: 'Sales',
      fill: 'var(--eidra-chart-2)',
      children: [
        { name: 'Enterprise', value: 28, fill: 'var(--eidra-chart-2)' },
        { name: 'Mid-market', value: 18, fill: 'var(--eidra-chart-2)' },
      ],
    },
    {
      name: 'Marketing',
      fill: 'var(--eidra-chart-3)',
      children: [
        { name: 'Brand', value: 12, fill: 'var(--eidra-chart-3)' },
        { name: 'Demand gen', value: 16, fill: 'var(--eidra-chart-3)' },
      ],
    },
    {
      name: 'Operations',
      fill: 'var(--eidra-chart-4)',
      children: [
        { name: 'Finance', value: 10, fill: 'var(--eidra-chart-4)' },
        { name: 'People', value: 9, fill: 'var(--eidra-chart-4)' },
      ],
    },
  ],
});

/**
 * **Sunburst** (`SunburstChart`) — a 2-level hierarchy (budget → department → team)
 * in polar coordinates. Self-contained (no child series): a single hierarchical
 * `data` root, coloured per top-level branch with `--eidra-chart-N` (children
 * inherit), `--eidra-surface` segment separators, and `--eidra-fg` value labels.
 * The accessible name lives on the container (the chart takes no `aria-label`).
 * Use the controls to toggle the value labels, tune the centre **innerRadius**, and
 * adjust the **ringPadding** gap between rings.
 */
interface SunburstArgs {
  showLabels: boolean;
  innerRadius: number;
  ringPadding: number;
}

export const Sunburst: StoryObj<SunburstArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showLabels: { control: 'boolean' },
    innerRadius: { control: { type: 'range', min: 0, max: 80, step: 2 } },
    ringPadding: { control: { type: 'range', min: 0, max: 8, step: 1 } },
  },
  args: { showLabels: true, innerRadius: 36, ringPadding: 2 },
  render: ({ showLabels, innerRadius, ringPadding }) => (
    // Sized via ResponsiveBox (numeric width/height) — SunburstChart needs real
    // pixels, not '100%' or ResponsiveContainer. Node fills are --eidra-chart-*
    // tokens from the ThemeProvider scope, so it doesn't need Chart.Container.
    <div style={{ maxWidth: 420 }}>
      <ResponsiveBox height={360} ariaLabel="Annual budget allocation by department and team">
        {(w, h) => (
          <Chart.SunburstChart
            width={w}
            height={h}
            data={BUDGET_TREE}
            dataKey="value"
            nameKey="name"
            stroke="var(--eidra-surface)"
            padding={2}
            ringPadding={ringPadding}
            innerRadius={innerRadius}
            textOptions={{ fill: showLabels ? 'var(--eidra-fg)' : 'transparent', stroke: 'none', fontSize: 11 }}
          >
            <Chart.Tooltip content={<Chart.TooltipContent hideLabel />} />
          </Chart.SunburstChart>
        )}
      </ResponsiveBox>
    </div>
  ),
};

// ── Interactive Sunburst: region → opco → capability, drill + detail ─────────
interface OrgRaw {
  name: string;
  value?: number;
  children?: OrgRaw[];
}

// Leaf values only; `enrich` below assigns ids, propagates the region colour, and
// sums each parent's value (recharts SunburstChart needs a value on every node).
const ORG_RAW: OrgRaw = {
  name: 'Global',
  children: [
    {
      name: 'EMEA',
      children: [
        { name: 'UK', children: [{ name: 'Advisory', value: 14 }, { name: 'Data', value: 11 }, { name: 'Design', value: 8 }] },
        { name: 'DACH', children: [{ name: 'Advisory', value: 10 }, { name: 'Data', value: 13 }, { name: 'Platform', value: 7 }] },
        { name: 'Nordics', children: [{ name: 'Advisory', value: 6 }, { name: 'Design', value: 9 }] },
      ],
    },
    {
      name: 'Americas',
      children: [
        { name: 'US', children: [{ name: 'Advisory', value: 18 }, { name: 'Data', value: 15 }, { name: 'Platform', value: 12 }] },
        { name: 'Brazil', children: [{ name: 'Advisory', value: 7 }, { name: 'Design', value: 5 }] },
      ],
    },
    {
      name: 'APAC',
      children: [
        { name: 'Singapore', children: [{ name: 'Data', value: 9 }, { name: 'Platform', value: 8 }] },
        { name: 'Australia', children: [{ name: 'Advisory', value: 8 }, { name: 'Design', value: 6 }] },
      ],
    },
  ],
};

const REGION_COLORS = ['var(--eidra-chart-1)', 'var(--eidra-chart-2)', 'var(--eidra-chart-3)'];

function enrich(node: OrgRaw, id: string, fill: string): SunburstData {
  const children = node.children?.map((c) => enrich(c, `${id}/${c.name}`, fill));
  const value = children ? children.reduce((sum, c) => sum + (c.value ?? 0), 0) : (node.value ?? 0);
  return { name: node.name, id, fill, value, ...(children ? { children } : {}) };
}

const ORG_TREE: SunburstData = (() => {
  const regions = ORG_RAW.children!.map((r, i) => enrich(r, `Global/${r.name}`, REGION_COLORS[i % REGION_COLORS.length]!));
  return {
    name: 'Global',
    id: 'Global',
    fill: 'var(--eidra-fg-subtle)',
    value: regions.reduce((sum, r) => sum + (r.value ?? 0), 0),
    children: regions,
  };
})();

function findById(node: SunburstData, id: string): SunburstData | null {
  if (node.id === id) return node;
  for (const c of node.children ?? []) {
    const found = findById(c, id);
    if (found) return found;
  }
  return null;
}

function OrgDetailPanel({ node, total }: { node: SunburstData; total: number }) {
  const nodeValue = node.value ?? 0;
  return (
    <div
      style={{
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
        padding: 'var(--eidra-space-4)',
        font: 'var(--eidra-font-size-sm)/1.5 var(--eidra-font-family-sans)',
        color: 'var(--eidra-fg)',
        minWidth: 220,
      }}
    >
      <div style={{ fontWeight: 700 }}>{node.name}</div>
      <div style={{ color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-xs)', marginBottom: 'var(--eidra-space-3)' }}>
        {fmt(nodeValue)} · {Math.round((nodeValue / total) * 100)}% of global
      </div>
      {node.children?.length ? (
        <div style={{ display: 'grid', gap: 'var(--eidra-space-2)' }}>
          {node.children.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
              <span aria-hidden style={{ width: 10, height: 10, borderRadius: 'var(--eidra-radius-full)', background: c.fill, flex: 'none' }} />
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--eidra-fg-muted)' }}>{fmt(c.value ?? 0)}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', width: 40, textAlign: 'right' }}>
                {Math.round(((c.value ?? 0) / (nodeValue || 1)) * 100)}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: 'var(--eidra-fg-muted)' }}>Capability leaf — no further breakdown.</div>
      )}
    </div>
  );
}

/**
 * **Interactive** — a drill-down sunburst (region → opco → capability). Click a
 * slice to zoom into it (it becomes the centre); the breadcrumb navigates back up.
 * Hovering a slice updates the detail panel with that node's value, share, and
 * child breakdown — so the chart reveals more data on interaction without losing
 * the overview. Use the controls to toggle the breadcrumb (drill-path navigation)
 * and the hover detail panel, while keeping the click-to-drill interaction.
 */
interface InteractiveArgs {
  showBreadcrumb: boolean;
  showDetailPanel: boolean;
}

export const Interactive: StoryObj<InteractiveArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showBreadcrumb: { control: 'boolean' },
    showDetailPanel: { control: 'boolean' },
  },
  args: { showBreadcrumb: true, showDetailPanel: true },
  render: ({ showBreadcrumb, showDetailPanel }) => (
    <InteractiveSunburst showBreadcrumb={showBreadcrumb} showDetailPanel={showDetailPanel} />
  ),
};

// Memoised so hovering (which updates the detail panel via parent state) doesn't
// re-render — and visibly jitter — the SunburstChart. Props stay referentially
// stable across hovers: rootData is a node from the static ORG_TREE, callbacks are
// useCallback'd.
const DrillChart = memo(function DrillChart({
  rootData,
  rootId,
  onDrill,
  onHover,
}: {
  rootData: SunburstData;
  rootId: string;
  onDrill: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  return (
    <ResponsiveBox height={320} ariaLabel={`Org breakdown, focused on ${rootData.name}`}>
      {(w, h) => (
        <Chart.SunburstChart
          // Remount on drill: SunburstChart leaves stale sectors behind when its
          // `data` changes in place, so key it by the focused node for a clean render.
          key={rootId}
          width={w}
          height={h}
          data={rootData}
          dataKey="value"
          nameKey="name"
          stroke="var(--eidra-surface)"
          padding={2}
          ringPadding={2}
          innerRadius={Math.max(24, Math.min(w, h) * 0.12)}
          textOptions={{ fill: 'var(--eidra-fg)', stroke: 'none', fontSize: 11 }}
          onClick={(node: SunburstData) => {
            const canonical = findById(ORG_TREE, (node as { id?: string }).id ?? '');
            if (canonical?.children?.length) onDrill(canonical.id as string);
          }}
          onMouseEnter={(node: SunburstData) => onHover((node as { id?: string }).id ?? null)}
          onMouseLeave={() => onHover(null)}
        >
          {/* Composite chart: derive the row from the hovered node (name + value),
              colouring the swatch with the node's own fill. */}
          <Chart.Tooltip
            content={
              <Chart.TooltipContent
                hideLabel
                rows={(d: SunburstData) => [{ label: d?.name, value: fmt(d?.value ?? 0), color: d?.fill }]}
              />
            }
          />
        </Chart.SunburstChart>
      )}
    </ResponsiveBox>
  );
});

function InteractiveSunburst({
  showBreadcrumb = true,
  showDetailPanel = true,
}: {
  showBreadcrumb?: boolean;
  showDetailPanel?: boolean;
}) {
  const [rootId, setRootId] = useState('Global');
  const [hoverId, setHoverId] = useState<string | null>(null);
  // findById returns the same node object for a given id, so displayRoot is a stable
  // reference across hover re-renders — keeping DrillChart's memo intact.
  const displayRoot = findById(ORG_TREE, rootId) ?? ORG_TREE;
  const focused = (hoverId && findById(ORG_TREE, hoverId)) || displayRoot;
  const onDrill = useCallback((id: string) => {
    setRootId(id);
    setHoverId(null);
  }, []);
  const onHover = useCallback((id: string | null) => setHoverId(id), []);
  const crumbs = rootId.split('/');

  return (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-3)', maxWidth: 720 }}>
      {/* Breadcrumb — each crumb zooms back to that level. */}
      {showBreadcrumb && (
      <nav
        aria-label="Drill path"
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-1)', font: 'var(--eidra-font-size-sm)/1 var(--eidra-font-family-sans)' }}
      >
        {crumbs.map((name, i) => {
          const id = crumbs.slice(0, i + 1).join('/');
          const isLast = i === crumbs.length - 1;
          return (
            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-1)' }}>
              {i > 0 && <span aria-hidden style={{ color: 'var(--eidra-fg-subtle)' }}>›</span>}
              <button
                type="button"
                onClick={() => onDrill(id)}
                disabled={isLast}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 'var(--eidra-space-1) var(--eidra-space-1-5)',
                  borderRadius: 'var(--eidra-radius-sm)',
                  cursor: isLast ? 'default' : 'pointer',
                  color: isLast ? 'var(--eidra-fg)' : 'var(--eidra-accent)',
                  fontWeight: isLast ? 700 : 500,
                  font: 'inherit',
                }}
              >
                {name}
              </button>
            </span>
          );
        })}
      </nav>
      )}

      {/* align-items: start so the detail panel resizing per hover doesn't shift the chart. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showDetailPanel ? 'minmax(0, 1fr) 260px' : 'minmax(0, 1fr)',
          gap: 'var(--eidra-space-4)',
          alignItems: 'start',
        }}
      >
        <DrillChart rootData={displayRoot} rootId={rootId} onDrill={onDrill} onHover={onHover} />
        {showDetailPanel && <OrgDetailPanel node={focused} total={ORG_TREE.value ?? 1} />}
      </div>
    </div>
  );
}

// ── Magic Quadrant: 2×2 positioning grid (vision × execution) ────────────────
interface QuadrantPoint {
  name: string;
  vision: number; // x, 0–100
  execution: number; // y, 0–100
}

const VENDORS: QuadrantPoint[] = [
  { name: 'Acme', vision: 78, execution: 82 },
  { name: 'Globex', vision: 64, execution: 71 },
  { name: 'Initech', vision: 38, execution: 30 },
  { name: 'Umbrella', vision: 85, execution: 40 },
  { name: 'Soylent', vision: 30, execution: 66 },
  { name: 'Hooli', vision: 55, execution: 52 },
];

const quadrantLabel = (value: string) => ({
  value,
  position: 'center' as const,
  fill: 'var(--eidra-fg-muted)',
  fontSize: 12,
  fontWeight: 600,
});

/**
 * **Magic Quadrant** — a 2×2 positioning grid (`ScatterChart`): two `ReferenceLine`s
 * split the plot into quadrants, each named and tinted with a `ReferenceArea`, the
 * plotted points are labelled, and both axes carry titles. The classic
 * vendor/competitor positioning map.
 */
interface MagicQuadrantArgs {
  /** Tint + name each quadrant. */
  showTints: boolean;
  /** Label each plotted point. */
  showPointLabels: boolean;
  /** Show the dashed background grid. */
  showGrid: boolean;
  /** Where the axes split into quadrants (0–100). */
  threshold: number;
}

export const MagicQuadrant: StoryObj<MagicQuadrantArgs> = {
  parameters: { controls: { disable: false } },
  args: { showTints: true, showPointLabels: true, showGrid: true, threshold: 50 },
  argTypes: {
    showTints: { control: 'boolean' },
    showPointLabels: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    threshold: { control: { type: 'range', min: 20, max: 80, step: 5 } },
  },
  render: ({ showTints, showPointLabels, showGrid, threshold }) => (
    <Chart.Container
      config={{}}
      style={{ height: 460, maxWidth: 560 }}
      aria-label="Magic quadrant: completeness of vision versus ability to execute"
    >
      {/* Custom margin kept: extra room on all sides for the axis titles + quadrant labels. */}
      <Chart.ScatterChart margin={{ top: 24, right: 28, bottom: 28, left: 16 }}>
        {showGrid && <Chart.CartesianGrid {...Chart.gridProps} />}
        {/* Quadrant tints + names, drawn under the points. */}
        {showTints && (
          <>
            <Chart.ReferenceArea x1={threshold} x2={100} y1={threshold} y2={100} fill="var(--eidra-chart-1)" fillOpacity={0.06} label={quadrantLabel('Leaders')} />
            <Chart.ReferenceArea x1={0} x2={threshold} y1={threshold} y2={100} fill="var(--eidra-chart-2)" fillOpacity={0.06} label={quadrantLabel('Challengers')} />
            <Chart.ReferenceArea x1={threshold} x2={100} y1={0} y2={threshold} fill="var(--eidra-chart-3)" fillOpacity={0.06} label={quadrantLabel('Visionaries')} />
            <Chart.ReferenceArea x1={0} x2={threshold} y1={0} y2={threshold} fill="var(--eidra-chart-4)" fillOpacity={0.06} label={quadrantLabel('Niche Players')} />
          </>
        )}
        <Chart.XAxis
          {...Chart.axisProps}
          type="number"
          dataKey="vision"
          domain={[0, 100]}
          // Explicit ticks give CartesianGrid its line positions; transparent tick
          // text keeps the grid lines (tick={false} drops the tick set entirely, so
          // the grid only drew its outer border). This is a positioning map, not a
          // scale, so the numbers stay hidden — intentional non-default tick.
          ticks={[0, 20, 40, 60, 80, 100]}
          tick={{ fill: 'transparent' }}
          label={{ value: 'Completeness of Vision →', position: 'insideBottom', offset: -12, fill: 'var(--eidra-fg-muted)', fontSize: 12 }}
        />
        <Chart.YAxis
          {...Chart.axisProps}
          type="number"
          dataKey="execution"
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          tick={{ fill: 'transparent' }}
          width={28}
          label={{ value: 'Ability to Execute →', angle: -90, position: 'insideLeft', fill: 'var(--eidra-fg-muted)', fontSize: 12 }}
        />
        <Chart.ReferenceLine x={threshold} stroke="var(--eidra-border-strong)" />
        <Chart.ReferenceLine y={threshold} stroke="var(--eidra-border-strong)" />
        <Chart.Tooltip cursor={{ strokeDasharray: '3 3' }} content={<Chart.TooltipContent hideLabel />} />
        <Chart.Scatter {...Chart.seriesDefaults} data={VENDORS} fill="var(--eidra-chart-1)" name="Vendor">
          {showPointLabels && <Chart.LabelList dataKey="name" position="top" fill="var(--eidra-fg)" fontSize={11} />}
        </Chart.Scatter>
      </Chart.ScatterChart>
    </Chart.Container>
  ),
};

// ── Dumbbell: two-point comparison per category (last year → this year) ──────
interface DumbbellDatum {
  category: string;
  before: number; // e.g. last year
  after: number; // e.g. this year
}

const GROWTH: DumbbellDatum[] = [
  { category: 'Advisory', before: 82, after: 110 },
  { category: 'Data', before: 64, after: 96 },
  { category: 'Design', before: 90, after: 84 }, // a decline — exercises direction-agnostic colouring
  { category: 'Platform', before: 48, after: 72 },
  { category: 'Brand', before: 70, after: 83 },
];

const dumbbellConfig: ChartConfig = {
  before: { label: 'Last year', color: 'var(--eidra-chart-3)' },
  after: { label: 'This year', color: 'var(--eidra-chart-1)' },
};

// Custom Bar shape: Recharts gives the floating bar's geometry (x/width span the
// [min,max] range); draw the connector line + an endpoint dot for each value.
interface DumbbellShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: DumbbellDatum;
  /** Endpoint dot radius. */
  r?: number;
  /** Connector line thickness. */
  connectorWidth?: number;
  /** Draw each value next to its dot. */
  showValues?: boolean;
}
function DumbbellShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  r = 5,
  connectorWidth = 2,
  showValues = false,
}: DumbbellShapeProps) {
  if (!payload) return <g />;
  const cy = y + height / 2;
  const left = x;
  const right = x + width;
  // The range is rendered low→high, so the left end is the smaller value.
  const beforeIsLeft = payload.before <= payload.after;
  const beforeX = beforeIsLeft ? left : right;
  const afterX = beforeIsLeft ? right : left;
  const labelStyle = { fill: 'var(--eidra-fg-muted)', fontSize: 11 } as const;
  return (
    <g>
      <line x1={left} y1={cy} x2={right} y2={cy} stroke="var(--eidra-border-strong)" strokeWidth={connectorWidth} />
      <circle cx={beforeX} cy={cy} r={r} fill="var(--color-before)" stroke="var(--eidra-surface)" strokeWidth={1.5} />
      <circle cx={afterX} cy={cy} r={r} fill="var(--color-after)" stroke="var(--eidra-surface)" strokeWidth={1.5} />
      {showValues && (
        <>
          <text x={left} y={cy - r - 4} textAnchor="middle" {...labelStyle}>
            {beforeIsLeft ? payload.before : payload.after}
          </text>
          <text x={right} y={cy - r - 4} textAnchor="middle" {...labelStyle}>
            {beforeIsLeft ? payload.after : payload.before}
          </text>
        </>
      )}
    </g>
  );
}

// Composite tooltip rows for a dumbbell datum: the two endpoints (coloured by the
// before/after ramp tokens) and the signed delta. Rendered through the themed
// `Chart.TooltipContent` shell via its `rows` prop.
function dumbbellRows(d: DumbbellDatum) {
  const delta = d.after - d.before;
  const up = delta >= 0;
  return [
    { label: dumbbellConfig.before!.label, value: fmt(d.before), color: dumbbellConfig.before!.color },
    { label: dumbbellConfig.after!.label, value: fmt(d.after), color: dumbbellConfig.after!.color },
    {
      label: up ? '▲ Change' : '▼ Change',
      value: fmt(Math.abs(delta)),
      color: up ? 'var(--eidra-success-fg)' : 'var(--eidra-danger-fg)',
    },
  ];
}

function DumbbellLegend() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--eidra-space-4)',
        font: 'var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
        color: 'var(--eidra-fg-muted)',
      }}
    >
      {(['before', 'after'] as const).map((key) => (
        <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--eidra-space-1-5)' }}>
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 'var(--eidra-radius-full)',
              background: dumbbellConfig[key]!.color,
            }}
          />
          {dumbbellConfig[key]!.label}
        </span>
      ))}
    </div>
  );
}

interface DumbbellArgs {
  /** Endpoint dot radius (px). */
  dotRadius: number;
  /** Connector line thickness (px). */
  connectorWidth: number;
  /** Show each value beside its dot. */
  showValueLabels: boolean;
}

/**
 * **Dumbbell** — a two-point comparison per category (here last year → this year):
 * a vertical `ComposedChart` with a single range `Bar` whose custom `shape` draws
 * the connector line and an endpoint dot for each value. Reads change at a glance —
 * the gap is the delta, the dot order shows direction (a decline keeps its colours).
 * Use the controls to tune the dot size, connector thickness, and value labels.
 */
export const Dumbbell: StoryObj<DumbbellArgs> = {
  parameters: { controls: { disable: false } },
  args: { dotRadius: 5, connectorWidth: 2, showValueLabels: false },
  argTypes: {
    dotRadius: { control: { type: 'range', min: 3, max: 10, step: 1 } },
    connectorWidth: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    showValueLabels: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-3)', maxWidth: 560 }}>
      <DumbbellLegend />
      <Chart.Container
        config={dumbbellConfig}
        style={{ height: 320 }}
        aria-label="Revenue by service line, last year versus this year"
      >
        {/* Custom margin kept: left space for the category labels on the Y axis. */}
        <Chart.ComposedChart layout="vertical" data={GROWTH} margin={{ top: 12, right: 16, bottom: 4, left: 8 }}>
          <Chart.CartesianGrid {...Chart.gridProps} horizontal={false} />
          <Chart.XAxis {...Chart.axisProps} type="number" domain={[0, (max: number) => Math.ceil((max + 20) / 20) * 20]} tickFormatter={fmt} />
          <Chart.YAxis {...Chart.axisProps} type="category" dataKey="category" width={72} />
          <Chart.Tooltip
            cursor={{ fill: 'var(--eidra-surface-hover)', fillOpacity: 0.5 }}
            content={<Chart.TooltipContent rows={dumbbellRows} />}
          />
          <Chart.Bar
            {...Chart.seriesDefaults}
            dataKey={(d: DumbbellDatum) => Chart.dumbbellRange(d.before, d.after)}
            shape={(props: unknown) => (
              <DumbbellShape
                {...(props as DumbbellShapeProps)}
                r={args.dotRadius}
                connectorWidth={args.connectorWidth}
                showValues={args.showValueLabels}
              />
            )}
            activeBar={false}
          />
        </Chart.ComposedChart>
      </Chart.Container>
    </div>
  ),
};

// ── Waterfall: cumulative build-up to a Total bar (deck p.7) ─────────────────
// Reproduces "Net Revenue & EBITDA Build-up": four waterfalls where regional
// contributions stack up cumulatively to a black "Total" bar. The waterfall is a
// stacked BarChart of two bars sharing one stackId: an invisible `base` (the
// running cumulative start) and a visible `delta` (the step's contribution). The
// final "Total" step has base 0 and delta = the full sum, drawn in --eidra-fg
// (black). `base` is fill="transparent" and excluded from the tooltip.
// `WaterfallStep` and the `Chart.toWaterfall` transform now live in the kit; the
// step datasets below are typed with the imported `WaterfallStep`.

// Each waterfall: regional contributions (+ a Global adjustment for EBITDA),
// closed by a Total step. The Total step carries the full sum of the contributions above it — the kit's
// `Chart.toWaterfall` draws an `isTotal` bar from 0 up to that value.
const NET_REVENUE_MONTH: WaterfallStep[] = [
  { label: 'Sweden', value: 42 },
  { label: 'Norway', value: 18 },
  { label: 'Netherlands', value: 13 },
  { label: 'DACH', value: 21 },
  { label: 'USA', value: 16 },
  { label: 'Total', value: 110, isTotal: true },
];

const NET_REVENUE_YTD: WaterfallStep[] = [
  { label: 'Sweden', value: 248 },
  { label: 'Norway', value: 104 },
  { label: 'Netherlands', value: 76 },
  { label: 'DACH', value: 122 },
  { label: 'USA', value: 91 },
  { label: 'Total', value: 641, isTotal: true },
];

const EBITDA_MONTH: WaterfallStep[] = [
  { label: 'Sweden', value: 9 },
  { label: 'Norway', value: 4 },
  { label: 'Netherlands', value: 2 },
  { label: 'DACH', value: 5 },
  { label: 'USA', value: 3 },
  { label: 'Global', value: 1 },
  { label: 'Total', value: 24, isTotal: true },
];

const EBITDA_YTD: WaterfallStep[] = [
  { label: 'Sweden', value: 54 },
  { label: 'Norway', value: 22 },
  { label: 'Netherlands', value: 14 },
  { label: 'DACH', value: 29 },
  { label: 'USA', value: 18 },
  { label: 'Global', value: 6 },
  { label: 'Total', value: 143, isTotal: true },
];

// Region → categorical chart token, applied per-bar via <Chart.Cell>; the Total
// bar uses --eidra-fg (black). The EBITDA "Global" adjustment step is tinted with
// --eidra-finance-comparison to read as a reconciliation rather than a region.
const WATERFALL_REGION_COLORS: Record<string, string> = {
  Sweden: 'var(--eidra-chart-1)',
  Norway: 'var(--eidra-chart-2)',
  Netherlands: 'var(--eidra-chart-3)',
  DACH: 'var(--eidra-chart-4)',
  USA: 'var(--eidra-chart-5)',
  Global: 'var(--eidra-finance-comparison)',
};

const waterfallConfig: ChartConfig = {
  delta: { label: 'Contribution', color: 'var(--eidra-chart-1)' },
};

const wfMsek = (v: number | string | undefined) => `${Number(v)} MSEK`;

// Composite tooltip rows for a waterfall bar. `Chart.toWaterfall` gives each bar a
// `delta` (this step's contribution, or the full total) and a cumulative `value` —
// so the rows show the step's own number and (for non-total steps) the running
// cumulative, without surfacing the transparent `base` riser as its own row.
type WaterfallBar = ReturnType<typeof Chart.toWaterfall>[number];
function waterfallRows(d: WaterfallBar) {
  return [
    { label: d.isTotal ? 'Total' : 'Contribution', value: wfMsek(d.delta) },
    ...(d.isTotal ? [] : [{ label: 'Cumulative', value: wfMsek(d.value) }]),
  ];
}

// One waterfall panel. The transparent `base` bar is rendered first (so the
// visible `delta` floats on top of it); the composite `rows` tooltip reads the
// row payload, so only the step's own contribution + cumulative show on hover.
function WaterfallPanel({ title, steps, showLabels = true }: { title: string; steps: WaterfallStep[]; showLabels?: boolean }) {
  const data = Chart.toWaterfall(steps);
  return (
    <div
      style={{
        padding: 'var(--eidra-space-3)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
      }}
    >
      <div
        style={{
          marginBottom: 'var(--eidra-space-2)',
          font: '600 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--eidra-fg-muted)',
        }}
      >
        {title}
      </div>
      <Chart.Container config={waterfallConfig} style={{ height: 240 }} aria-label={title}>
        {/* Custom margin kept: top space reserves room for the value LabelList above the bars. */}
        <Chart.BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
          <Chart.CartesianGrid {...Chart.gridProps} vertical={false} />
          <Chart.XAxis {...Chart.axisProps} dataKey="label" interval={0} />
          <Chart.YAxis {...Chart.axisProps} width={40} />
          <Chart.Tooltip cursor={{ fill: 'var(--eidra-surface-hover)' }} content={<Chart.TooltipContent rows={waterfallRows} />} />
          {/* Invisible riser: lifts each delta to its cumulative start. The
              composite `rows` tooltip reads the row's payload, so the base
              never shows as its own tooltip row. */}
          <Chart.Bar {...Chart.seriesDefaults} dataKey="base" stackId="wf" fill="transparent" />
          <Chart.Bar {...Chart.seriesDefaults} dataKey="delta" stackId="wf" radius={[3, 3, 0, 0]}>
            {data.map((d) => (
              <Chart.Cell
                key={d.label}
                fill={d.isTotal ? 'var(--eidra-fg)' : (WATERFALL_REGION_COLORS[d.label] ?? 'var(--eidra-chart-1)')}
              />
            ))}
            {showLabels && (
              // `delta` is the step's own contribution (the Total bar's delta is the
              // full sum); the kit's `value` is the running cumulative, not the label.
              <Chart.LabelList dataKey="delta" position="top" fontSize={11} formatter={(v) => String(Number(v))} />
            )}
          </Chart.Bar>
        </Chart.BarChart>
      </Chart.Container>
    </div>
  );
}

const WATERFALL_DATASETS = {
  'Net Revenue — Month (MSEK)': NET_REVENUE_MONTH,
  'Net Revenue — YTD (MSEK)': NET_REVENUE_YTD,
  'EBITDA — Month (MSEK)': EBITDA_MONTH,
  'EBITDA — YTD (MSEK)': EBITDA_YTD,
} as const;
type WaterfallDataset = keyof typeof WATERFALL_DATASETS;

interface WaterfallArgs {
  dataset: WaterfallDataset;
  showLabels: boolean;
}

/**
 * **Waterfall** — cumulative build-up to a Total bar, the canonical monthly-deck
 * "Net Revenue & EBITDA Build-up". Each regional contribution stacks onto the running
 * cumulative total; the final black `--eidra-fg` bar is the sum. Built from a stacked
 * `BarChart` of two bars sharing one `stackId`: a transparent `base` riser (the
 * cumulative start) and a visible `delta` segment (the step's value, or the full
 * total). Per-step colour via `<Chart.Cell>`, value labels via `<Chart.LabelList>`.
 * Use the **dataset** control to switch metric/period and **showLabels** to toggle
 * value labels.
 */
export const Waterfall: StoryObj<WaterfallArgs> = {
  argTypes: {
    dataset: { control: 'select', options: Object.keys(WATERFALL_DATASETS) },
    showLabels: { control: 'boolean' },
  },
  args: { dataset: 'Net Revenue — Month (MSEK)', showLabels: true },
  render: ({ dataset, showLabels }) => (
    <div style={{ maxWidth: 560 }}>
      <WaterfallPanel title={dataset} steps={WATERFALL_DATASETS[dataset]} showLabels={showLabels} />
    </div>
  ),
};

// A small labelled card wrapper for the mini gallery.
function MiniCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--eidra-space-3)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
      }}
    >
      <div
        style={{
          marginBottom: 'var(--eidra-space-2)',
          font: '600 var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--eidra-fg-muted)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/**
 * **Minis** — every chart type at `size="sm"` for dashboard summary / sparkline
 * cards: compact height, trimmed axes, no legend. One mini per type so consumers
 * can drop any chart into a small card. Use the controls to set the minimum card
 * width (which drives how many columns the gallery wraps into) and to toggle leaf
 * labels on the Treemap mini. (The other minis are deliberately label-free
 * sparklines, so the label toggle only affects the Treemap.)
 */
interface MinisArgs {
  minCardWidth: number;
  showTreemapLabels: boolean;
}

export const Minis: StoryObj<MinisArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    minCardWidth: { control: { type: 'range', min: 160, max: 360, step: 20 } },
    showTreemapLabels: { control: 'boolean' },
  },
  args: { minCardWidth: 240, showTreemapLabels: false },
  render: ({ minCardWidth, showTreemapLabels }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
        gap: 'var(--eidra-space-4)',
        maxWidth: 800,
      }}
    >
      <MiniCard title="Bars">
        <Chart.Container config={trendConfig} size="sm" style={{ height: 120 }}>
          <Chart.BarChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
            <Chart.Bar {...Chart.seriesDefaults} dataKey="revenue" fill="var(--color-revenue)" radius={[2, 2, 0, 0]} activeBar={false} />
          </Chart.BarChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Line">
        <Chart.Container config={trendConfig} size="sm" style={{ height: 120 }}>
          <Chart.LineChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
            <Chart.Line {...Chart.seriesDefaults} dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} activeDot={false} />
          </Chart.LineChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Area">
        <Chart.Container config={trendConfig} size="sm" style={{ height: 120 }}>
          <Chart.AreaChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
            <Chart.Area {...Chart.seriesDefaults} dataKey="revenue" type="monotone" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.2} strokeWidth={2} activeDot={false} />
          </Chart.AreaChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Composed (stacked)">
        <Chart.Container config={config} size="sm" style={{ height: 120 }}>
          <Chart.ComposedChart data={DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
            <Chart.Bar {...Chart.seriesDefaults} dataKey="actuals" stackId="s" fill="var(--color-actuals)" activeBar={false} />
            <Chart.Bar {...Chart.seriesDefaults} dataKey="sold" stackId="s" fill="var(--color-sold)" activeBar={false} />
            <Chart.Bar {...Chart.seriesDefaults} dataKey="hiProb" stackId="s" fill="var(--color-hiProb)" radius={[2, 2, 0, 0]} activeBar={false} />
          </Chart.ComposedChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Bubble">
        <Chart.Container config={bubbleConfig} size="sm" style={{ height: 120 }}>
          <Chart.ScatterChart margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis type="number" dataKey="revenue" hide />
            <Chart.YAxis type="number" dataKey="growth" hide />
            <Chart.ZAxis type="number" dataKey="total" range={[30, 240]} />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent hideLabel />} />
            <Chart.Scatter {...Chart.seriesDefaults} data={CLIENTS} fill="var(--color-large)" fillOpacity={0.6} />
          </Chart.ScatterChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Radar">
        <Chart.Container config={radarConfig} size="sm" style={{ height: 120 }}>
          <Chart.RadarChart data={CAPABILITY} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Chart.PolarGrid />
            <Chart.PolarAngleAxis dataKey="skill" tick={false} />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={score} hideLabel />} />
            <Chart.Radar {...Chart.seriesDefaults} dataKey="platform" stroke="var(--color-platform)" fill="var(--color-platform)" fillOpacity={0.25} strokeWidth={1.5} />
            <Chart.Radar {...Chart.seriesDefaults} dataKey="product" stroke="var(--color-product)" fill="var(--color-product)" fillOpacity={0.25} strokeWidth={1.5} />
          </Chart.RadarChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Donut">
        <Chart.Container config={pieConfig} size="sm" style={{ height: 120 }} aria-label="Revenue split">
          <Chart.PieChart margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
            <Chart.Pie
              {...Chart.seriesDefaults}
              data={REVENUE_BY_LINE}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="var(--eidra-surface)"
              strokeWidth={1.5}
            >
              {REVENUE_BY_LINE.map((d) => (
                <Chart.Cell key={d.key} fill={pieConfig[d.name]?.color} />
              ))}
            </Chart.Pie>
          </Chart.PieChart>
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Treemap">
        <Chart.Container config={spendConfig} size="sm" style={{ height: 120 }}>
          <Chart.Treemap
            data={SPEND}
            dataKey="value"
            nameKey="name"
            aspectRatio={1.6}
            stroke="var(--eidra-surface)"
            {...Chart.seriesDefaults}
            content={renderSpendNode(showTreemapLabels)}
          />
        </Chart.Container>
      </MiniCard>

      <MiniCard title="Sunburst">
        <ResponsiveBox height={120} ariaLabel="Budget allocation breakdown">
          {(w, h) => (
            <Chart.SunburstChart
              width={w}
              height={h}
              data={BUDGET_TREE}
              dataKey="value"
              stroke="var(--eidra-surface)"
              padding={2}
              ringPadding={1}
              innerRadius={14}
              textOptions={{ fill: 'transparent', stroke: 'none' }}
            />
          )}
        </ResponsiveBox>
      </MiniCard>
    </div>
  ),
};

// ── Box plot: distribution of a metric across categories ─────────────────────
// Raw samples per phase; the story derives the five-number summary with
// `computeBoxStats` (type-7 quartiles + Tukey 1.5×IQR outliers). "Review" carries
// two slow outliers above the upper fence to exercise the outlier dots.
const CYCLE_SAMPLES: Record<string, number[]> = {
  Discovery: [3, 4, 4, 5, 5, 6, 6, 7, 8, 9],
  Design: [4, 5, 6, 6, 7, 7, 8, 9, 10, 12],
  Build: [6, 8, 9, 10, 11, 12, 13, 14, 16, 19],
  Review: [2, 3, 3, 4, 4, 5, 5, 6, 18, 22],
  Release: [1, 1, 2, 2, 3, 3, 4, 4, 5, 6],
};

const days = (v: number) => `${Math.round(v)}d`;

interface BoxPlotArgs {
  orientation: 'vertical' | 'horizontal';
  showOutliers: boolean;
  perCategoryColor: boolean;
  boxRatio: number;
}

/**
 * **Box plot** (`Chart.BoxPlot`) — box-and-whisker distribution of a metric across
 * categories. Self-contained: drop it inside `Chart.Container` and it owns its
 * `ComposedChart`, axes and value-domain, drawing one box per row at true axis scale
 * (box = Q1–Q3, emphasised median, whiskers to the Tukey 1.5×IQR fences with caps,
 * outliers as dots). Hover a box for its five-number summary. Feed raw samples through
 * `Chart.computeBoxStats(values)` to get each row's `{ min, q1, median, q3, max, outliers }`.
 * Use the controls to flip **orientation**, toggle **outliers**, give each box its own
 * palette **colour**, and set the **box thickness** (fraction of the band).
 */
export const BoxPlot: StoryObj<BoxPlotArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    showOutliers: { control: 'boolean' },
    perCategoryColor: { control: 'boolean' },
    boxRatio: { control: { type: 'range', min: 0.2, max: 0.9, step: 0.1 } },
  },
  args: { orientation: 'vertical', showOutliers: true, perCategoryColor: false, boxRatio: 0.6 },
  render: ({ orientation, showOutliers, perCategoryColor, boxRatio }) => {
    const data: BoxPlotDatum[] = Object.entries(CYCLE_SAMPLES).map(([phase, samples], i) => ({
      phase,
      ...computeBoxStats(samples),
      // Per-category cycles the palette (the component default); otherwise one
      // shared series colour so the boxes read as a single distribution.
      color: perCategoryColor ? `var(--eidra-chart-${i + 1})` : 'var(--eidra-chart-1)',
    }));
    return (
      <div style={{ maxWidth: 640 }}>
        <Chart.Container config={{}} style={{ height: 360 }} aria-label="Cycle time by phase (days)">
          <Chart.BoxPlot
            data={data}
            categoryKey="phase"
            orientation={orientation}
            showOutliers={showOutliers}
            boxRatio={boxRatio}
            valueFormatter={days}
          />
        </Chart.Container>
      </div>
    );
  },
};

// ── Sankey: revenue flow (region → net revenue → cost / EBITDA) ───────────────
// Recharts ships a native Sankey; the kit re-exports it raw (`Chart.Sankey`) and
// the theming lives here — per-node palette, source-tinted links, always-on
// labels and a themed node/link tooltip. Links reference nodes by array index;
// values are conserved (Σ region revenue = Σ cost+EBITDA), as a real P&L flow is.
const SANKEY_NODES: Array<{ name: string }> = [
  { name: 'Sweden' }, // 0
  { name: 'Norway' }, // 1
  { name: 'Netherlands' }, // 2
  { name: 'Germany' }, // 3
  { name: 'US' }, // 4
  { name: 'UK' }, // 5
  { name: 'Net Revenue' }, // 6
  { name: 'Personnel' }, // 7
  { name: 'Other cost' }, // 8
  { name: 'EBITDA' }, // 9
];
const SANKEY_LINKS = [
  { source: 0, target: 6, value: 72 },
  { source: 1, target: 6, value: 48 },
  { source: 2, target: 6, value: 40 },
  { source: 3, target: 6, value: 34 },
  { source: 4, target: 6, value: 28 },
  { source: 5, target: 6, value: 15 },
  { source: 6, target: 7, value: 130 },
  { source: 6, target: 8, value: 50 },
  { source: 6, target: 9, value: 57 },
];
const SANKEY_DATA: SankeyData = { nodes: SANKEY_NODES, links: SANKEY_LINKS };

// Stable per-node palette colour, keyed by node name (so links inherit their
// source node's hue). Cycles the 16-colour categorical ramp.
const sankeyColor = (name: string): string =>
  `var(--eidra-chart-${(Math.max(0, SANKEY_NODES.findIndex((n) => n.name === name)) % 16) + 1})`;

const sankeyMsek = (v: number) => `${Math.round(v)} MSEK`;

// Node: coloured rect + always-on label. Source-edge nodes (no incoming links)
// label to the left, sink-edge nodes (no outgoing) to the right, middle nodes
// above — so labels never sit on top of the ribbons.
function renderSankeyNode(showValues: boolean) {
  return (props: {
    x: number;
    y: number;
    width: number;
    height: number;
    payload: { name: string; value: number; sourceLinks?: unknown[]; targetLinks?: unknown[] };
  }): ReactElement => {
    const { x, y, width, height, payload } = props;
    const color = sankeyColor(payload.name);
    // Recharts names the link arrays opposite to d3: a left-edge node (no
    // incoming flow) has empty `sourceLinks`; a right-edge node empty `targetLinks`.
    const isLeftEdge = (payload.sourceLinks?.length ?? 0) === 0;
    const isRightEdge = (payload.targetLinks?.length ?? 0) === 0;
    const label = showValues ? `${payload.name} · ${Math.round(payload.value)}` : payload.name;
    let tx = x + width / 2;
    let ty = y + height / 2;
    let anchor: 'start' | 'middle' | 'end' = 'middle';
    if (isLeftEdge) {
      tx = x - 6;
      anchor = 'end';
    } else if (isRightEdge) {
      tx = x + width + 6;
      anchor = 'start';
    } else {
      ty = y - 6;
    }
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} rx={2} fill={color} />
        <text
          x={tx}
          y={ty}
          textAnchor={anchor}
          dominantBaseline="middle"
          fontSize={11}
          fontFamily="var(--eidra-font-family-sans)"
          fill="var(--eidra-fg)"
        >
          {label}
        </text>
      </g>
    );
  };
}

// Link: a stroked bezier ribbon tinted from its source node's hue. Hover
// brightening is pure CSS (see the injected <style>), so no React state.
function renderSankeyLink() {
  return (props: {
    sourceX: number;
    targetX: number;
    sourceY: number;
    targetY: number;
    sourceControlX: number;
    targetControlX: number;
    linkWidth: number;
    payload: { source: { name: string } };
  }): ReactElement => {
    const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, payload } = props;
    const color = sankeyColor(payload.source.name);
    const d = `M${sourceX},${sourceY}C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;
    return (
      <path
        className="eidra-sankey-link"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={Math.max(linkWidth, 1)}
        strokeOpacity={0.35}
      />
    );
  };
}

const sankeyTooltipBox: CSSProperties = {
  minWidth: 160,
  padding: 'var(--eidra-space-2) var(--eidra-space-3)',
  background: 'var(--eidra-surface)',
  border: '1px solid var(--eidra-border)',
  borderRadius: 'var(--eidra-radius-md)',
  boxShadow: 'var(--eidra-shadow-md)',
  fontSize: 'var(--eidra-font-size-xs)',
  color: 'var(--eidra-fg)',
  fontFamily: 'var(--eidra-font-family-sans)',
};
const sankeyTipRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 'var(--eidra-space-3)',
};
const sankeyTipName: CSSProperties = { color: 'var(--eidra-fg-muted)' };
const sankeyTipVal: CSSProperties = {
  fontFamily: 'var(--eidra-font-family-mono)',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
};

// Themed tooltip handling both hovers. Recharts wraps the Sankey tooltip entry as
// `{ name, value, payload: <node|link data> }`, so the node/link object is one level
// in. A link's `source`/`target` are node objects post-layout; a node has neither.
function SankeyTooltip(props: {
  active?: boolean;
  payload?: Array<{ payload?: any }>;
}): ReactElement | null {
  const { active, payload } = props;
  const top = payload?.[0]?.payload;
  if (!active || !top) return null;
  const inner = top.payload ?? top; // the node or link data
  const value = Number(top.value ?? inner.value);
  const isLink = inner && inner.source != null && inner.target != null && typeof inner.source === 'object';
  if (isLink) {
    const srcName: string = inner.source.name;
    const tgtName: string = inner.target.name;
    const srcIdx = SANKEY_NODES.findIndex((n) => n.name === srcName);
    const outTotal = SANKEY_LINKS.filter((l) => l.source === srcIdx).reduce((a, l) => a + l.value, 0);
    const share = outTotal ? Math.round((value / outTotal) * 100) : 0;
    return (
      <div style={sankeyTooltipBox}>
        <div style={{ fontWeight: 600, marginBlockEnd: 'var(--eidra-space-1-5)' }}>
          {srcName} → {tgtName}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1)' }}>
          <div style={sankeyTipRow}>
            <span style={sankeyTipName}>value</span>
            <span style={sankeyTipVal}>{sankeyMsek(value)}</span>
          </div>
          <div style={sankeyTipRow}>
            <span style={sankeyTipName}>share</span>
            <span style={sankeyTipVal}>{share}%</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={sankeyTooltipBox}>
      <div style={{ fontWeight: 600, marginBlockEnd: 'var(--eidra-space-1-5)' }}>{top.name ?? inner.name}</div>
      <div style={sankeyTipRow}>
        <span style={sankeyTipName}>throughput</span>
        <span style={sankeyTipVal}>{sankeyMsek(value)}</span>
      </div>
    </div>
  );
}

interface SankeyArgs {
  nodePadding: number;
  nodeWidth: number;
  linkCurvature: number;
  showValues: boolean;
}

/**
 * **Sankey** (`Chart.Sankey`) — a flow diagram: width-proportional ribbons carry a
 * conserved quantity through stages. Here a monthly P&L flow: **Region → Net Revenue
 * → {Personnel, Other cost, EBITDA}**. Recharts owns the layout; the kit re-exports
 * `Chart.Sankey` raw and the theming is composed here — a per-node palette (`sankeyColor`,
 * keyed by node name), source-tinted translucent links (brightening on hover via CSS),
 * always-on node labels placed off the ribbons, and a themed `SankeyTooltip` that shows
 * a node's throughput or a link's `source → target`, value and **% of the source's
 * outflow**. Links reference nodes by array index (`{ source, target, value }`); keep the
 * values conserved per stage. Use the controls for **nodePadding**, **nodeWidth**,
 * **linkCurvature** and to toggle inline **values**.
 */
export const Sankey: StoryObj<SankeyArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    nodePadding: { control: { type: 'range', min: 4, max: 40, step: 2 } },
    nodeWidth: { control: { type: 'range', min: 6, max: 24, step: 2 } },
    linkCurvature: { control: { type: 'range', min: 0, max: 0.8, step: 0.1 } },
    showValues: { control: 'boolean' },
  },
  args: { nodePadding: 18, nodeWidth: 14, linkCurvature: 0.5, showValues: true },
  render: ({ nodePadding, nodeWidth, linkCurvature, showValues }) => (
    <div style={{ maxWidth: 760 }}>
      <style>{`.eidra-sankey-link{transition:stroke-opacity .15s ease}.eidra-sankey-link:hover{stroke-opacity:.6}`}</style>
      <Chart.Container config={{}} style={{ height: 420 }} aria-label="Revenue flow: region to net revenue to cost and EBITDA">
        <Chart.Sankey
          data={SANKEY_DATA}
          nodePadding={nodePadding}
          nodeWidth={nodeWidth}
          linkCurvature={linkCurvature}
          node={renderSankeyNode(showValues) as ComponentProps<typeof Chart.Sankey>['node']}
          link={renderSankeyLink() as ComponentProps<typeof Chart.Sankey>['link']}
          margin={{ top: 16, right: 96, bottom: 16, left: 112 }}
        >
          <Chart.Tooltip content={<SankeyTooltip />} />
        </Chart.Sankey>
      </Chart.Container>
    </div>
  ),
};
