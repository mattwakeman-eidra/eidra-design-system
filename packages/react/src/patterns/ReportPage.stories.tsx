import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  Chart,
  PageHeader,
  Separator,
  Statistic,
  StatisticBar,
  type ChartConfig,
} from '../index.js';

/**
 * **Report Page (slide shell) — recipe.** These stories are *documentation*, not a
 * shipped component: they reproduce the chrome of a monthly financial deck's slides
 * — a 16:9 page on the brand creme background, a numbered header band, framed
 * content, and a footer band — so a web-app report can wrap *any* content in the
 * same shell. The DS stays domain-agnostic: the slide layout lives here in the
 * recipe (`ReportPage` / `CoverPage`), composed entirely from shipped primitives
 * (`PageHeader`, `Avatar`, `Statistic`/`StatisticBar`, `Chart`, `Separator`).
 *
 * `layout: 'fullscreen'` so the slide frame controls its own padding and centring
 * (a padded canvas would double-pad the deck).
 */
const meta = {
  title: 'Patterns/Report Page',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

const eur = (n: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

// ── Brand wordmark ───────────────────────────────────────────────────────────
function Wordmark({ size = 'md' }: { size?: 'md' | 'xl' }) {
  return (
    <span
      style={{
        font: `var(--eidra-font-weight-bold) ${
          size === 'xl' ? 'var(--eidra-font-size-5xl)' : 'var(--eidra-font-size-xl)'
        }/1 var(--eidra-font-family-sans)`,
        letterSpacing: '-0.01em',
        color: 'var(--eidra-fg)',
      }}
    >
      Eidra
    </span>
  );
}

// ── ReportPage helper ────────────────────────────────────────────────────────
export interface ReportPageProps {
  /** Optional slide number, shown in a circular badge before the title. */
  index?: number;
  /** Section title for the slide's header band. */
  title: ReactNode;
  /** Muted supporting line beneath the title (e.g. the reporting period). */
  subtitle?: ReactNode;
  /** Page number shown in the footer (e.g. `2`). */
  pageNumber?: number;
  /** Total pages, paired with `pageNumber` as "2 / 18". */
  totalPages?: number;
  /** Generation date shown in the footer (already formatted). */
  generated?: string;
  /** Slide body — any content the report wants to frame. */
  children: ReactNode;
}

/**
 * One content slide: a creme 16:9 frame with a numbered header band
 * (`Avatar` badge + `PageHeader` title/subtitle, brand wordmark top-right),
 * the framed body, and a footer band with the confidentiality line and the
 * page number / generation date.
 */
export function ReportPage({
  index,
  title,
  subtitle,
  pageNumber,
  totalPages,
  generated,
  children,
}: ReportPageProps) {
  return (
    <div
      style={{
        aspectRatio: '16 / 9',
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--eidra-bg)',
        color: 'var(--eidra-fg)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        overflow: 'hidden',
        padding: 'var(--eidra-gap-8)',
        fontFamily: 'var(--eidra-font-family-sans)',
      }}
    >
      {/* Header band */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--eidra-gap-4)' }}>
        {index != null && (
          <Avatar.Root size="md" aria-hidden>
            <Avatar.Fallback>{index}</Avatar.Fallback>
          </Avatar.Root>
        )}
        <PageHeader title={title} subtitle={subtitle} actions={<Wordmark />} style={{ flex: 1 }} />
      </div>

      {/* Framed content */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 'var(--eidra-space-6)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>

      {/* Footer band */}
      <div style={{ marginTop: 'var(--eidra-space-6)' }}>
        <Separator />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 'var(--eidra-gap-4)',
            marginTop: 'var(--eidra-space-3)',
            font: 'var(--eidra-font-weight-regular) var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
            color: 'var(--eidra-fg-muted)',
          }}
        >
          <span>Monthly Financials · Confidential</span>
          <span style={{ display: 'flex', gap: 'var(--eidra-gap-4)' }}>
            {generated != null && <span>Generated {generated}</span>}
            {pageNumber != null && (
              <span style={{ fontFamily: 'var(--eidra-font-family-mono)' }}>
                {pageNumber}
                {totalPages != null && ` / ${totalPages}`}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── CoverPage helper ─────────────────────────────────────────────────────────
export interface CoverPageProps {
  /** Letter-spaced coral eyebrow (e.g. "MONTHLY FINANCIAL DECK"). */
  eyebrow: string;
  /** The deck's big cover title. */
  title: ReactNode;
  /** Confidentiality / classification line. */
  confidential?: ReactNode;
}

/**
 * The title/cover slide (deck p1): a coral letter-spaced eyebrow, a large title,
 * a confidentiality line, a short coral rule, and a large `Eidra` wordmark — all
 * on the same creme 16:9 frame as a content slide.
 */
export function CoverPage({ eyebrow, title, confidential = 'Confidential' }: CoverPageProps) {
  return (
    <div
      style={{
        aspectRatio: '16 / 9',
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--eidra-bg)',
        color: 'var(--eidra-fg)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        overflow: 'hidden',
        padding: 'var(--eidra-gap-12)',
        fontFamily: 'var(--eidra-font-family-sans)',
      }}
    >
      <div
        style={{
          font: 'var(--eidra-font-weight-bold) var(--eidra-font-size-xs)/1.2 var(--eidra-font-family-sans)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--eidra-coral)',
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-4)' }}>
        <h1
          style={{
            margin: 0,
            font: 'var(--eidra-font-weight-bold) var(--eidra-font-size-5xl)/1.05 var(--eidra-font-family-sans)',
            letterSpacing: '-0.02em',
            color: 'var(--eidra-fg)',
          }}
        >
          {title}
        </h1>
        <span
          style={{
            font: 'var(--eidra-font-weight-medium) var(--eidra-font-size-sm)/1.4 var(--eidra-font-family-sans)',
            color: 'var(--eidra-fg-muted)',
          }}
        >
          {confidential}
        </span>
        {/* Short coral rule */}
        <div
          style={{
            width: 'var(--eidra-space-16)',
            height: 'var(--eidra-space-1)',
            background: 'var(--eidra-coral)',
            borderRadius: 'var(--eidra-radius-full)',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Wordmark size="xl" />
      </div>
    </div>
  );
}

// ── Demo content for a content slide ─────────────────────────────────────────
const TREND = [
  { month: 'Jan', revenue: 120 },
  { month: 'Feb', revenue: 138 },
  { month: 'Mar', revenue: 131 },
  { month: 'Apr', revenue: 154 },
  { month: 'May', revenue: 149 },
];
const trendConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: 'var(--eidra-finance-revenue-actuals)' },
};

function ExecSummary() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-gap-6)',
        height: '100%',
      }}
    >
      <StatisticBar
        aria-label="Exec summary"
        size="lg"
        items={[
          { label: 'Revenue YTD', value: eur(692_000) },
          { label: 'Net margin', value: '18.4%', tone: 'positive' },
          { label: 'Pipeline', value: eur(2_350_000), tone: 'accent' },
          { label: 'Year-end forecast', value: eur(1_810_000), align: 'end' },
        ]}
      />
      <Separator />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 'var(--eidra-gap-8)',
          flex: 1,
          minHeight: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-4)' }}>
          <Statistic
            label="Billable utilisation"
            value="78%"
            tone="success"
            caption="+3 pts vs Apr"
            progress={78}
          />
          <Statistic label="Cash runway" value="14 mo" caption="Stable" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Chart.Container config={trendConfig} style={{ flex: 1 }} aria-label="Monthly revenue">
            <Chart.BarChart data={TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <Chart.XAxis {...Chart.axisProps} dataKey="month" />
              <Chart.Tooltip cursor={false} content={<Chart.TooltipContent hideLabel />} />
              <Chart.Bar
                {...Chart.seriesDefaults}
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[3, 3, 0, 0]}
                activeBar={false}
              />
            </Chart.BarChart>
          </Chart.Container>
        </div>
      </div>
    </div>
  );
}

// ── Stories ──────────────────────────────────────────────────────────────────

/**
 * The deck's title/cover slide (p1): coral eyebrow, big title, coral rule, wordmark.
 * Use the controls to edit the `eyebrow`, `title`, and `confidential` lines wired
 * into `CoverPage`.
 */
interface CoverArgs {
  eyebrow: string;
  title: string;
  confidential: string;
}

export const Cover: StoryObj<CoverArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    eyebrow: { control: 'text' },
    title: { control: 'text' },
    confidential: { control: 'text' },
  },
  args: {
    eyebrow: 'Monthly Financial Deck',
    title: 'Financial update May 2026',
    confidential: 'Confidential',
  },
  render: ({ eyebrow, title, confidential }) => (
    <div style={{ padding: 'var(--eidra-gap-6)' }}>
      <CoverPage eyebrow={eyebrow} title={title} confidential={confidential} />
    </div>
  ),
};

/**
 * A content slide: `ReportPage` chrome wrapping a real exec-summary body
 * (a `StatisticBar` headline, two `Statistic`s, and a revenue `Chart`) — the
 * template a report fills per section. Use the controls to edit the `ReportPage`
 * shell props — the header `index` badge, `title`/`subtitle`, and the footer's
 * `pageNumber` / `totalPages` / `generated` date.
 */
interface ContentSlideArgs {
  index: number;
  title: string;
  subtitle: string;
  pageNumber: number;
  totalPages: number;
  generated: string;
}

export const ContentSlide: StoryObj<ContentSlideArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    index: { control: 'number' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    pageNumber: { control: 'number' },
    totalPages: { control: 'number' },
    generated: { control: 'text' },
  },
  args: {
    index: 2,
    title: 'Executive summary',
    subtitle: 'Month — May 2026',
    pageNumber: 2,
    totalPages: 18,
    generated: '19 Jun 2026',
  },
  render: ({ index, title, subtitle, pageNumber, totalPages, generated }) => (
    <div style={{ padding: 'var(--eidra-gap-6)' }}>
      <ReportPage
        index={index}
        title={title}
        subtitle={subtitle}
        pageNumber={pageNumber}
        totalPages={totalPages}
        generated={generated}
      >
        <ExecSummary />
      </ReportPage>
    </div>
  ),
};

/**
 * The whole system: a cover plus two content slides stacked, showing how the
 * shared chrome carries different bodies through a deck. Use the `showCover` control
 * to include or omit the cover slide — the multi-page composition is otherwise a
 * fixed showcase, so the per-page props aren't exposed here (edit them on the
 * `Cover` and `ContentSlide` stories instead).
 */
interface DeckArgs {
  showCover: boolean;
}

export const Deck: StoryObj<DeckArgs> = {
  parameters: { controls: { disable: false } },
  argTypes: {
    showCover: { control: 'boolean' },
  },
  args: { showCover: true },
  render: ({ showCover }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-gap-8)',
        padding: 'var(--eidra-gap-6)',
        background: 'var(--eidra-bg-muted)',
      }}
    >
      {showCover && (
        <CoverPage eyebrow="Monthly Financial Deck" title="Financial update May 2026" />
      )}
      <ReportPage
        index={2}
        title="Executive summary"
        subtitle="Month — May 2026"
        pageNumber={2}
        totalPages={18}
        generated="19 Jun 2026"
      >
        <ExecSummary />
      </ReportPage>
      <ReportPage
        index={3}
        title="Revenue by client"
        subtitle="Month — May 2026"
        pageNumber={3}
        totalPages={18}
        generated="19 Jun 2026"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-4)' }}>
          <StatisticBar
            aria-label="Top clients"
            items={[
              { label: 'Fabrique', value: eur(96_000) },
              { label: 'GP NL', value: eur(64_000) },
              { label: 'Q42', value: eur(40_000) },
              { label: 'Top-3 share', value: '58%', tone: 'accent', align: 'end' },
            ]}
          />
          <Chart.Container config={trendConfig} style={{ flex: 1 }} aria-label="Revenue trend">
            <Chart.LineChart data={TREND} margin={Chart.margin}>
              <Chart.XAxis {...Chart.axisProps} dataKey="month" />
              <Chart.Tooltip cursor={false} content={<Chart.TooltipContent hideLabel />} />
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
        </div>
      </ReportPage>
    </div>
  ),
};
