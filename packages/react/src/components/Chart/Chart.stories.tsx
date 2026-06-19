import { useState, useRef, useLayoutEffect, type ReactNode, type ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Chart,
  formatCompactCurrency,
  type ChartConfig,
  type TreemapNode,
  type SunburstData,
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
type Story = StoryObj<typeof meta>;

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
 * Forecast.)
 */
export const Composed: Story = {
  render: () => {
    const [hidden, setHidden] = useState<string[]>([]);
    const toggle = (key: string) =>
      setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]));
    const isHidden = (k: string) => hidden.includes(k);

    return (
      <Chart.Container config={config} style={{ height: 360, maxWidth: 760 }}>
        <Chart.ComposedChart data={DATA} margin={{ top: 20, right: 12, bottom: 0, left: 4 }}>
          <Chart.CartesianGrid vertical={false} strokeDasharray="4 4" />
          <Chart.XAxis dataKey="month" tickLine={false} axisLine={false} />
          <Chart.YAxis
            tickLine={false}
            axisLine={false}
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
          <Chart.Line {...Chart.seriesDefaults}
            dataKey="ly"
            type="monotone"
            stroke="var(--color-ly)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            hide={isHidden('ly')}
          />
          <Chart.Line {...Chart.seriesDefaults}
            dataKey="budget"
            type="step"
            stroke="var(--color-budget)"
            strokeWidth={2.5}
            dot={false}
            hide={isHidden('budget')}
          />
          <Chart.Legend content={<Chart.LegendContent hidden={hidden} onToggle={toggle} />} />
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

/** **Bars** (`BarChart`) — grouped bars comparing two series. */
export const Bars: Story = {
  render: () => (
    <Chart.Container config={trendConfig} style={{ height: 300, maxWidth: 640 }}>
      <Chart.BarChart data={TREND} margin={{ top: 16, right: 12, bottom: 0, left: 4 }}>
        <Chart.CartesianGrid vertical={false} strokeDasharray="4 4" />
        <Chart.XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Chart.YAxis tickLine={false} axisLine={false} width={48} tickFormatter={fmt} />
        <Chart.Tooltip cursor={{ fill: 'var(--eidra-surface-hover)' }} content={<Chart.TooltipContent formatter={fmt} />} />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="revenue" fill="var(--color-revenue)" radius={[3, 3, 0, 0]} />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="target" fill="var(--color-target)" radius={[3, 3, 0, 0]} />
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.BarChart>
    </Chart.Container>
  ),
};

/** **Line** (`LineChart`) — a trend line vs target. */
export const Line: Story = {
  render: () => (
    <Chart.Container config={trendConfig} style={{ height: 300, maxWidth: 640 }}>
      <Chart.LineChart data={TREND} margin={{ top: 16, right: 12, bottom: 0, left: 4 }}>
        <Chart.CartesianGrid vertical={false} strokeDasharray="4 4" />
        <Chart.XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Chart.YAxis tickLine={false} axisLine={false} width={48} tickFormatter={fmt} />
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} />} />
        <Chart.Line {...Chart.seriesDefaults} dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 3 }} />
        <Chart.Line {...Chart.seriesDefaults} dataKey="target" type="monotone" stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.LineChart>
    </Chart.Container>
  ),
};

/** **Area** (`AreaChart`) — a filled trend with a target line. */
export const Area: Story = {
  render: () => (
    <Chart.Container config={trendConfig} style={{ height: 300, maxWidth: 640 }}>
      <Chart.AreaChart data={TREND} margin={{ top: 16, right: 12, bottom: 0, left: 4 }}>
        <Chart.CartesianGrid vertical={false} strokeDasharray="4 4" />
        <Chart.XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Chart.YAxis tickLine={false} axisLine={false} width={48} tickFormatter={fmt} />
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} />} />
        <Chart.Area {...Chart.seriesDefaults} dataKey="revenue" type="monotone" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.2} strokeWidth={2} />
        <Chart.Line {...Chart.seriesDefaults} dataKey="target" type="monotone" stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.AreaChart>
    </Chart.Container>
  ),
};

// ── A non-revenue use case: headcount budget vs demand vs actual ─────────────
// Proves the kit is domain-agnostic — generic tokens, plain (non-currency) units,
// budget as a black step line ("blackline"), demand as a line, actual as bars.
interface HeadcountDatum {
  period: string;
  actual: number;
  demand: number;
  budget: number;
}

const HEADCOUNT: HeadcountDatum[] = [
  { period: 'Q1', actual: 42, demand: 45, budget: 48 },
  { period: 'Q2', actual: 46, demand: 50, budget: 48 },
  { period: 'Q3', actual: 49, demand: 54, budget: 52 },
  { period: 'Q4', actual: 53, demand: 58, budget: 52 },
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
 * FTE units. (Used by Headcount.)
 */
export const ComposedBarLine: Story = {
  render: () => (
    <Chart.Container config={headcountConfig} style={{ height: 320, maxWidth: 640 }}>
      <Chart.ComposedChart data={HEADCOUNT} margin={{ top: 16, right: 12, bottom: 0, left: 4 }}>
        <Chart.CartesianGrid vertical={false} strokeDasharray="4 4" />
        <Chart.XAxis dataKey="period" tickLine={false} axisLine={false} />
        <Chart.YAxis tickLine={false} axisLine={false} width={40} />
        <Chart.Tooltip
          cursor={{ fill: 'var(--eidra-surface-hover)' }}
          content={<Chart.TooltipContent formatter={fte} />}
        />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="actual" fill="var(--color-actual)" radius={[3, 3, 0, 0]} barSize={28} />
        <Chart.Line {...Chart.seriesDefaults}
          dataKey="demand"
          type="monotone"
          stroke="var(--color-demand)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Chart.Line {...Chart.seriesDefaults} dataKey="budget" type="step" stroke="var(--color-budget)" strokeWidth={2.5} dot={false} />
        <Chart.Legend content={<Chart.LegendContent />} />
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

const bubbleConfig: ChartConfig = {
  small: { label: 'Small', color: 'var(--eidra-finance-comparison)' },
  mid: { label: 'Mid-market', color: 'var(--eidra-finance-revenue-sold)' },
  large: { label: 'Enterprise', color: 'var(--eidra-finance-accent)' },
  pillar: { label: 'Pillar', color: 'var(--eidra-finance-revenue-actuals)' },
};

const TIERS = ['small', 'mid', 'large', 'pillar'] as const;

/**
 * **Bubble / Scatter** (`ScatterChart`) — client revenue (x) vs YoY growth (y) with
 * bubble size by total revenue (`ZAxis`), one series per size tier. Uses the same
 * themed `Chart.Container` config, `ReferenceLine`, tooltip, and legend. (Used by the
 * Client Dashboard.)
 */
export const Bubble: Story = {
  render: () => (
    <Chart.Container config={bubbleConfig} style={{ height: 380, maxWidth: 680 }}>
      <Chart.ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 4 }}>
        <Chart.CartesianGrid strokeDasharray="4 4" />
        <Chart.XAxis
          type="number"
          dataKey="revenue"
          name="Revenue"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatCompactCurrency(v * 1000)}
        />
        <Chart.YAxis
          type="number"
          dataKey="growth"
          name="Growth"
          unit="%"
          width={44}
          tickLine={false}
          axisLine={false}
        />
        <Chart.ZAxis type="number" dataKey="total" range={[80, 700]} name="Total" />
        <Chart.ReferenceLine y={0} stroke="var(--eidra-border-strong)" strokeDasharray="2 2" />
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
            fill={`var(--color-${tier})`}
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
 * `Radar` uses a categorical chart colour with a translucent fill.
 */
export const Radar: Story = {
  render: () => (
    <Chart.Container
      config={radarConfig}
      style={{ height: 360, maxWidth: 560 }}
      aria-label="Team capability assessment across six skills, comparing the Platform and Product teams"
    >
      <Chart.RadarChart data={CAPABILITY} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
        <Chart.PolarGrid />
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
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Chart.Radar
          {...Chart.seriesDefaults}
          dataKey="product"
          stroke="var(--color-product)"
          fill="var(--color-product)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
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
}

const REVENUE_BY_LINE: SliceDatum[] = [
  { key: 'consulting', name: 'Consulting', value: 4200 },
  { key: 'managed', name: 'Managed Services', value: 3100 },
  { key: 'product', name: 'Product Licences', value: 2350 },
  { key: 'support', name: 'Support', value: 1450 },
  { key: 'training', name: 'Training', value: 780 },
  { key: 'other', name: 'Other', value: 420 },
];

const pieConfig: ChartConfig = {
  Consulting: { label: 'Consulting', color: 'var(--eidra-chart-1)' },
  'Managed Services': { label: 'Managed Services', color: 'var(--eidra-chart-2)' },
  'Product Licences': { label: 'Product Licences', color: 'var(--eidra-chart-3)' },
  Support: { label: 'Support', color: 'var(--eidra-chart-4)' },
  Training: { label: 'Training', color: 'var(--eidra-chart-5)' },
  Other: { label: 'Other', color: 'var(--eidra-chart-6)' },
};

const TOTAL_REVENUE = REVENUE_BY_LINE.reduce((sum, d) => sum + d.value, 0);

/**
 * **Pie** (`PieChart`) — a categorical breakdown (revenue by business line). Each
 * slice maps to a theme-reactive categorical token (`--eidra-chart-N`) via
 * `<Chart.Cell>`; a thin `--eidra-surface` stroke separates slices in both themes.
 */
export const Pie: Story = {
  render: () => (
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
          paddingAngle={2}
          stroke="var(--eidra-surface)"
          strokeWidth={2}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name} · ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {REVENUE_BY_LINE.map((d, i) => (
            <Chart.Cell key={d.key} fill={`var(--eidra-chart-${i + 1})`} />
          ))}
        </Chart.Pie>
        <Chart.Legend content={<Chart.LegendContent />} />
      </Chart.PieChart>
    </Chart.Container>
  ),
};

/**
 * **Donut** (`PieChart` with `innerRadius`) — same breakdown as a donut with a
 * centred total. The centre label is an overlay (Recharts has no native one),
 * `aria-hidden` + `pointer-events:none` so it never blocks slice hover.
 */
export const Donut: Story = {
  render: () => (
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
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              cornerRadius={3}
              stroke="var(--eidra-surface)"
              strokeWidth={2}
            >
              {REVENUE_BY_LINE.map((d, i) => (
                <Chart.Cell key={d.key} fill={`var(--eidra-chart-${i + 1})`} />
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
                width: 10,
                height: 10,
                borderRadius: 'var(--eidra-radius-full)',
                background: `var(--eidra-chart-${i + 1})`,
              }}
            />
            {d.name}
          </span>
        ))}
      </div>
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

const spendConfig: ChartConfig = {
  compute: { label: 'Compute', color: 'var(--eidra-chart-1)' },
  storage: { label: 'Storage', color: 'var(--eidra-chart-2)' },
  database: { label: 'Database', color: 'var(--eidra-chart-3)' },
  networking: { label: 'Networking', color: 'var(--eidra-chart-4)' },
  analytics: { label: 'Analytics', color: 'var(--eidra-chart-5)' },
};

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
          fill={isLeaf ? `var(--color-${colorKey})` : 'transparent'}
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
 * `--eidra-surface` stroke, and only large leaves are labelled.
 */
export const Treemap: Story = {
  render: () => (
    <Chart.Container
      config={spendConfig}
      style={{ height: 360, maxWidth: 680 }}
      aria-label="Cloud spend by service category and service"
    >
      <Chart.Treemap
        data={SPEND}
        dataKey="value"
        nameKey="name"
        aspectRatio={1.5}
        stroke="var(--eidra-surface)"
        {...Chart.seriesDefaults}
        content={renderSpendNode(true)}
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
const BUDGET_TREE: SunburstData = {
  name: 'Budget',
  value: 165,
  children: [
    {
      name: 'Engineering',
      value: 72,
      fill: 'var(--eidra-chart-1)',
      children: [
        { name: 'Platform', value: 32, fill: 'var(--eidra-chart-1)' },
        { name: 'Product', value: 26, fill: 'var(--eidra-chart-1)' },
        { name: 'Data', value: 14, fill: 'var(--eidra-chart-1)' },
      ],
    },
    {
      name: 'Sales',
      value: 46,
      fill: 'var(--eidra-chart-2)',
      children: [
        { name: 'Enterprise', value: 28, fill: 'var(--eidra-chart-2)' },
        { name: 'Mid-market', value: 18, fill: 'var(--eidra-chart-2)' },
      ],
    },
    {
      name: 'Marketing',
      value: 28,
      fill: 'var(--eidra-chart-3)',
      children: [
        { name: 'Brand', value: 12, fill: 'var(--eidra-chart-3)' },
        { name: 'Demand gen', value: 16, fill: 'var(--eidra-chart-3)' },
      ],
    },
    {
      name: 'Operations',
      value: 19,
      fill: 'var(--eidra-chart-4)',
      children: [
        { name: 'Finance', value: 10, fill: 'var(--eidra-chart-4)' },
        { name: 'People', value: 9, fill: 'var(--eidra-chart-4)' },
      ],
    },
  ],
};

/**
 * **Sunburst** (`SunburstChart`) — a 2-level hierarchy (budget → department → team)
 * in polar coordinates. Self-contained (no child series): a single hierarchical
 * `data` root, coloured per top-level branch with `--eidra-chart-N` (children
 * inherit), `--eidra-surface` segment separators, and `--eidra-fg` value labels.
 * The accessible name lives on the container (the chart takes no `aria-label`).
 */
export const Sunburst: Story = {
  render: () => (
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
            ringPadding={2}
            innerRadius={36}
            textOptions={{ fill: 'var(--eidra-fg)', stroke: 'none', fontSize: 11 }}
          >
            <Chart.Tooltip content={<Chart.TooltipContent hideLabel />} />
          </Chart.SunburstChart>
        )}
      </ResponsiveBox>
    </div>
  ),
};

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
      <Chart.ScatterChart margin={{ top: 24, right: 28, bottom: 28, left: 16 }}>
        {showGrid && <Chart.CartesianGrid strokeDasharray="4 4" />}
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
          type="number"
          dataKey="vision"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Completeness of Vision →', position: 'insideBottom', offset: -12, fill: 'var(--eidra-fg-muted)', fontSize: 12 }}
        />
        <Chart.YAxis
          type="number"
          dataKey="execution"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
          tickLine={false}
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

interface DumbbellTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DumbbellDatum }>;
}
function DumbbellTooltip({ active, payload }: DumbbellTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0]!.payload;
  const delta = d.after - d.before;
  const up = delta >= 0;
  return (
    <div
      style={{
        background: 'var(--eidra-surface)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-md)',
        boxShadow: 'var(--eidra-shadow-md)',
        padding: 'var(--eidra-space-2) var(--eidra-space-3)',
        font: 'var(--eidra-font-size-xs)/1.5 var(--eidra-font-family-sans)',
        color: 'var(--eidra-fg)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 'var(--eidra-space-1)' }}>{d.category}</div>
      <div>Last year: {fmt(d.before)}</div>
      <div>This year: {fmt(d.after)}</div>
      <div style={{ color: up ? 'var(--eidra-success-fg)' : 'var(--eidra-danger-fg)' }}>
        {up ? '▲' : '▼'} {fmt(Math.abs(delta))}
      </div>
    </div>
  );
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
        <Chart.ComposedChart layout="vertical" data={GROWTH} margin={{ top: 12, right: 16, bottom: 4, left: 8 }}>
          <Chart.CartesianGrid horizontal={false} />
          <Chart.XAxis type="number" domain={[0, (max: number) => Math.ceil((max + 20) / 20) * 20]} tickFormatter={fmt} />
          <Chart.YAxis type="category" dataKey="category" width={72} tickLine={false} axisLine={false} />
          <Chart.Tooltip cursor={{ fill: 'var(--eidra-surface-hover)', fillOpacity: 0.5 }} content={<DumbbellTooltip />} />
          <Chart.Bar
            {...Chart.seriesDefaults}
            dataKey={(d: DumbbellDatum) => [Math.min(d.before, d.after), Math.max(d.before, d.after)]}
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
 * can drop any chart into a small card.
 */
export const Minis: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
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
              {REVENUE_BY_LINE.map((d, i) => (
                <Chart.Cell key={d.key} fill={`var(--eidra-chart-${i + 1})`} />
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
            content={renderSpendNode(false)}
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
