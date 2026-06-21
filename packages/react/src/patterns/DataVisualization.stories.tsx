import type { ReactNode, ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Chart,
  Meter,
  Progress,
  SegmentBar,
  Statistic,
  StatisticBar,
  StatusStrip,
  formatCompactCurrency,
  type ChartConfig,
  type TreemapNode,
  type SunburstData,
} from '../index.js';

const meta = {
  title: 'Patterns/Data Visualization',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ── Shared mini datasets ─────────────────────────────────────────────────────
const TREND = [
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

const STACK = [
  { month: 'Mar', actuals: 40, sold: 70, hiProb: 25 },
  { month: 'Apr', actuals: 0, sold: 80, hiProb: 40 },
  { month: 'May', actuals: 0, sold: 60, hiProb: 50 },
  { month: 'Jun', actuals: 0, sold: 40, hiProb: 55 },
];
const stackConfig: ChartConfig = {
  actuals: { label: 'Actuals', color: 'var(--eidra-finance-revenue-actuals)' },
  sold: { label: 'Sold', color: 'var(--eidra-finance-revenue-sold)' },
  hiProb: { label: 'Hi-prob', color: 'var(--eidra-finance-revenue-hi-prob)' },
};

const POINTS = [
  { revenue: 2400, growth: 12, total: 2400 },
  { revenue: 1800, growth: -5, total: 1800 },
  { revenue: 900, growth: 22, total: 900 },
  { revenue: 3200, growth: 4, total: 3200 },
  { revenue: 1200, growth: 18, total: 1200 },
  { revenue: 600, growth: -12, total: 600 },
];
const bubbleConfig: ChartConfig = {
  clients: { label: 'Clients', color: 'var(--eidra-finance-accent)' },
};

// Categorical-palette demos (radar / donut / treemap / sunburst) — colours from
// the theme-reactive --eidra-chart-N ramp.
const CAPABILITY = [
  { skill: 'Frontend', platform: 65, product: 90 },
  { skill: 'Backend', platform: 92, product: 70 },
  { skill: 'Infra', platform: 88, product: 45 },
  { skill: 'Data', platform: 70, product: 60 },
  { skill: 'Design', platform: 40, product: 85 },
  { skill: 'Product', platform: 55, product: 95 },
];
const radarConfig: ChartConfig = {
  platform: { label: 'Platform', color: 'var(--eidra-chart-1)' },
  product: { label: 'Product', color: 'var(--eidra-chart-2)' },
};

const SLICES = [
  { key: 'consulting', name: 'Consulting', value: 4200 },
  { key: 'managed', name: 'Managed Services', value: 3100 },
  { key: 'product', name: 'Product Licences', value: 2350 },
  { key: 'support', name: 'Support', value: 1450 },
  { key: 'training', name: 'Training', value: 780 },
];
const sliceConfig: ChartConfig = Chart.categoricalConfig(SLICES, 'name');

interface AllocNode {
  name: string;
  value?: number;
  colorKey?: string;
  children?: AllocNode[];
  [key: string]: unknown;
}
const ALLOCATION: AllocNode[] = [
  {
    name: 'Equities',
    colorKey: 'equities',
    children: [
      { name: 'US', value: 42, colorKey: 'equities' },
      { name: 'EU', value: 18, colorKey: 'equities' },
      { name: 'EM', value: 11, colorKey: 'equities' },
    ],
  },
  {
    name: 'Fixed income',
    colorKey: 'bonds',
    children: [
      { name: 'Govt', value: 14, colorKey: 'bonds' },
      { name: 'Corp', value: 8, colorKey: 'bonds' },
    ],
  },
  {
    name: 'Cash',
    colorKey: 'cash',
    children: [{ name: 'Money market', value: 7, colorKey: 'cash' }],
  },
];
const allocConfig: ChartConfig = {
  equities: { label: 'Equities', color: 'var(--eidra-chart-1)' },
  bonds: { label: 'Fixed income', color: 'var(--eidra-chart-2)' },
  cash: { label: 'Cash', color: 'var(--eidra-chart-3)' },
};
const renderAllocNode = (node: TreemapNode): ReactElement => {
  const { x, y, width, height, depth } = node;
  const colorKey =
    (node.colorKey as string | undefined) ??
    ((node.root as TreemapNode | undefined)?.colorKey as string | undefined) ??
    'equities';
  const isLeaf = depth >= 2;
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
    </g>
  );
};

const SUNBURST_TREE: SunburstData = {
  name: 'Traffic',
  children: [
    {
      name: 'Organic',
      fill: 'var(--eidra-chart-1)',
      children: [
        { name: 'Search', value: 38, fill: 'var(--eidra-chart-1)' },
        { name: 'Direct', value: 22, fill: 'var(--eidra-chart-1)' },
      ],
    },
    {
      name: 'Paid',
      fill: 'var(--eidra-chart-2)',
      children: [
        { name: 'Search ads', value: 18, fill: 'var(--eidra-chart-2)' },
        { name: 'Social ads', value: 12, fill: 'var(--eidra-chart-2)' },
      ],
    },
    {
      name: 'Referral',
      fill: 'var(--eidra-chart-3)',
      children: [
        { name: 'Partners', value: 9, fill: 'var(--eidra-chart-3)' },
        { name: 'Press', value: 6, fill: 'var(--eidra-chart-3)' },
      ],
    },
  ],
};

const fmt = (v: number | string | undefined) => formatCompactCurrency(Number(v) * 1000);

// ── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-gap-2)',
        padding: 'var(--eidra-gap-3)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
        minHeight: 150,
      }}
    >
      <div
        style={{
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
 * Every chart type as a mini, plus the non-chart data-visualisation primitives —
 * the compact building blocks for dashboard cards. Charts render at `size="sm"`
 * with trimmed axes; the rest are shown at their natural compact size.
 */
export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'var(--eidra-gap-4)',
        maxWidth: 900,
      }}
    >
      {/* ── Chart kit, one mini per type ── */}
      <Card title="Bars">
        <Chart.Container config={trendConfig} size="sm" style={{ height: 110 }}>
          <Chart.BarChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip
              cursor={false}
              content={<Chart.TooltipContent formatter={fmt} hideLabel />}
            />
            <Chart.Bar
              {...Chart.seriesDefaults}
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[2, 2, 0, 0]}
              activeBar={false}
            />
          </Chart.BarChart>
        </Chart.Container>
      </Card>

      <Card title="Line">
        <Chart.Container config={trendConfig} size="sm" style={{ height: 110 }}>
          <Chart.LineChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip
              cursor={false}
              content={<Chart.TooltipContent formatter={fmt} hideLabel />}
            />
            <Chart.Line
              {...Chart.seriesDefaults}
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </Chart.LineChart>
        </Chart.Container>
      </Card>

      <Card title="Area">
        <Chart.Container config={trendConfig} size="sm" style={{ height: 110 }}>
          <Chart.AreaChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip
              cursor={false}
              content={<Chart.TooltipContent formatter={fmt} hideLabel />}
            />
            <Chart.Area
              {...Chart.seriesDefaults}
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              strokeWidth={2}
              activeDot={false}
            />
          </Chart.AreaChart>
        </Chart.Container>
      </Card>

      <Card title="Composed (stacked)">
        <Chart.Container config={stackConfig} size="sm" style={{ height: 110 }}>
          <Chart.ComposedChart data={STACK} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis dataKey="month" hide />
            <Chart.Tooltip
              cursor={false}
              content={<Chart.TooltipContent formatter={fmt} hideLabel />}
            />
            <Chart.Bar
              {...Chart.seriesDefaults}
              dataKey="actuals"
              stackId="s"
              fill="var(--color-actuals)"
              activeBar={false}
            />
            <Chart.Bar
              {...Chart.seriesDefaults}
              dataKey="sold"
              stackId="s"
              fill="var(--color-sold)"
              activeBar={false}
            />
            <Chart.Bar
              {...Chart.seriesDefaults}
              dataKey="hiProb"
              stackId="s"
              fill="var(--color-hiProb)"
              radius={[2, 2, 0, 0]}
              activeBar={false}
            />
          </Chart.ComposedChart>
        </Chart.Container>
      </Card>

      <Card title="Bubble">
        <Chart.Container config={bubbleConfig} size="sm" style={{ height: 110 }}>
          <Chart.ScatterChart margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.XAxis type="number" dataKey="revenue" hide />
            <Chart.YAxis type="number" dataKey="growth" hide />
            <Chart.ZAxis type="number" dataKey="total" range={[30, 240]} />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent hideLabel />} />
            <Chart.Scatter
              {...Chart.seriesDefaults}
              data={POINTS}
              fill="var(--color-clients)"
              fillOpacity={0.6}
            />
          </Chart.ScatterChart>
        </Chart.Container>
      </Card>

      <Card title="Radar">
        <Chart.Container config={radarConfig} size="sm" style={{ height: 110 }}>
          <Chart.RadarChart data={CAPABILITY} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Chart.PolarGrid />
            <Chart.PolarAngleAxis dataKey="skill" tick={false} />
            <Chart.Tooltip cursor={false} content={<Chart.TooltipContent hideLabel />} />
            <Chart.Radar
              {...Chart.seriesDefaults}
              dataKey="platform"
              stroke="var(--color-platform)"
              fill="var(--color-platform)"
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
            <Chart.Radar
              {...Chart.seriesDefaults}
              dataKey="product"
              stroke="var(--color-product)"
              fill="var(--color-product)"
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
          </Chart.RadarChart>
        </Chart.Container>
      </Card>

      <Card title="Donut">
        <Chart.Container
          config={sliceConfig}
          size="sm"
          style={{ height: 110 }}
          aria-label="Revenue split"
        >
          <Chart.PieChart margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <Chart.Tooltip
              cursor={false}
              content={<Chart.TooltipContent formatter={fmt} hideLabel />}
            />
            <Chart.Pie
              {...Chart.seriesDefaults}
              data={SLICES}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="var(--eidra-surface)"
              strokeWidth={1.5}
            >
              {SLICES.map((d) => (
                <Chart.Cell key={d.key} fill={sliceConfig[d.name]?.color} />
              ))}
            </Chart.Pie>
          </Chart.PieChart>
        </Chart.Container>
      </Card>

      <Card title="Treemap">
        <Chart.Container config={allocConfig} size="sm" style={{ height: 110 }}>
          <Chart.Treemap
            data={ALLOCATION}
            dataKey="value"
            nameKey="name"
            aspectRatio={1.6}
            stroke="var(--eidra-surface)"
            {...Chart.seriesDefaults}
            content={renderAllocNode}
          />
        </Chart.Container>
      </Card>

      <Card title="Sunburst">
        <Chart.Container
          config={{}}
          size="sm"
          role="img"
          aria-label="Traffic sources by channel"
          style={{ height: 110 }}
        >
          <Chart.SunburstChart
            data={SUNBURST_TREE}
            dataKey="value"
            stroke="var(--eidra-surface)"
            padding={2}
            innerRadius={14}
            textOptions={{ fill: 'transparent', stroke: 'none' }}
          />
        </Chart.Container>
      </Card>

      {/* ── Non-chart data-viz primitives ── */}
      <Card title="Proportion (SegmentBar)">
        <SegmentBar
          segments={[
            { value: 11.5, label: 'Actuals' },
            { value: 6.7, label: 'Sold' },
            { value: 3.4, label: 'Hi-prob' },
          ]}
          showLegend
        />
      </Card>

      <Card title="Momentum (StatusStrip)">
        <StatusStrip aria-label="Monthly momentum">
          <StatusStrip.Cell status="positive" label="Jan">
            +4%
          </StatusStrip.Cell>
          <StatusStrip.Cell status="positive" label="Feb">
            +2%
          </StatusStrip.Cell>
          <StatusStrip.Cell status="caution" label="Mar">
            0%
          </StatusStrip.Cell>
          <StatusStrip.Cell status="negative" label="Apr">
            −3%
          </StatusStrip.Cell>
          <StatusStrip.Cell status="positive" label="May">
            +6%
          </StatusStrip.Cell>
        </StatusStrip>
      </Card>

      <Card title="Gauge (Meter)">
        <Meter.Root value={72}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Meter.Label>Budget used</Meter.Label>
            <Meter.Value />
          </div>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
      </Card>

      <Card title="Progress">
        <Progress.Root value={62} aria-label="Pipeline coverage">
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </Card>

      <Card title="KPIs (Statistic)">
        <StatisticBar
          aria-label="Summary"
          size="sm"
          items={[
            { label: 'Clients', value: '128' },
            { label: 'Year-end', value: '€21.6M', tone: 'accent' },
          ]}
        />
        <Statistic label="Sold forecast" value="€18.2M" tone="success" caption="+8% vs LY" />
      </Card>
    </div>
  ),
};
