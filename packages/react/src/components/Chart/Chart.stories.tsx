import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart, formatCompactCurrency, type ChartConfig } from './Chart.js';

const meta = {
  title: 'Data Display/Chart',
  component: Chart.Container,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
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

/** Full sold-&-forecast chart: stacked revenue bars + budget step line + dashed LY line, themed tooltip, toggleable legend, dimmed closed months. */
export const ForecastChart: Story = {
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

/** Compact (`size="sm"`) variant for a region/opco breakdown card. */
export const Mini: Story = {
  render: () => (
    <Chart.Container config={config} size="sm" style={{ maxWidth: 280 }}>
      <Chart.ComposedChart data={DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <Chart.XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Chart.Tooltip content={<Chart.TooltipContent formatter={fmt} hideLabel />} />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="actuals" stackId="s" fill="var(--color-actuals)" />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="sold" stackId="s" fill="var(--color-sold)" />
        <Chart.Bar {...Chart.seriesDefaults} dataKey="hiProb" stackId="s" fill="var(--color-hiProb)" radius={[2, 2, 0, 0]} />
      </Chart.ComposedChart>
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
 * Headcount: actual (bars) vs demand (line) against a budget **black step line**.
 * Same kit, different domain — generic tokens, FTE units instead of currency.
 */
export const HeadcountBudget: Story = {
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
 * Bubble (scatter) chart — client revenue (x) vs YoY growth (y) with bubble size
 * by total revenue (`ZAxis`), one series per size tier. Uses the same themed
 * `Chart.Container` config, `ReferenceLine`, tooltip, and legend as the other
 * chart types — the Client Dashboard's portfolio view.
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
