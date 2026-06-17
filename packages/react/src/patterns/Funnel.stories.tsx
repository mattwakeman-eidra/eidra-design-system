import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Card } from '../index.js';

/**
 * **Funnel** — a conversion funnel recipe. Each step is a token-styled bar whose
 * width is proportional to its value, plus a `Badge` showing the conversion rate
 * versus the previous step. This is a *recipe*, not a component: it composes the
 * shipped `Card` + `Badge` with token-styled markup, so it lives under `Patterns`.
 */
const meta = {
  title: 'Patterns/Funnel',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface Step {
  label: string;
  value: number;
}

const STEPS: Step[] = [
  { label: 'Sent', value: 4200 },
  { label: 'Opened', value: 3150 },
  { label: 'Clicked', value: 1260 },
  { label: 'Responded', value: 504 },
];

const pctOf = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
const nf = new Intl.NumberFormat('en-US');

function Funnel({ steps }: { steps: Step[] }) {
  const max = Math.max(steps[0]?.value ?? 1, 1);
  return (
    <Card variant="outline" padding="md" style={{ maxWidth: 520 }}>
      <div
        style={{
          fontSize: 'var(--eidra-font-size-xs)',
          fontWeight: 'var(--eidra-font-weight-semibold)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--eidra-fg-muted)',
          marginBottom: 'var(--eidra-space-4)',
        }}
      >
        Engagement funnel
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)' }}>
        {steps.map((step, i) => {
          const prev = i === 0 ? null : (steps[i - 1]?.value ?? null);
          const widthPct = (step.value / max) * 100;
          return (
            <div
              key={step.label}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-3)' }}
            >
              <div
                style={{
                  width: 90,
                  flex: 'none',
                  fontSize: 'var(--eidra-font-size-sm)',
                  fontWeight: 'var(--eidra-font-weight-medium)',
                  color: 'var(--eidra-fg)',
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 'var(--eidra-size-control-md)',
                  borderRadius: 'var(--eidra-radius-sm)',
                  backgroundColor: 'var(--eidra-bg-muted)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    minWidth: 'var(--eidra-space-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingInline: 'var(--eidra-space-3)',
                    borderRadius: 'var(--eidra-radius-sm)',
                    backgroundColor: 'var(--eidra-accent)',
                    color: 'var(--eidra-accent-fg)',
                    fontSize: 'var(--eidra-font-size-sm)',
                    fontWeight: 'var(--eidra-font-weight-semibold)',
                    fontVariantNumeric: 'tabular-nums',
                    boxSizing: 'border-box',
                  }}
                >
                  {nf.format(step.value)}
                </div>
              </div>
              <div style={{ width: 96, flex: 'none', textAlign: 'right' }}>
                {prev != null ? (
                  <Badge tone="accent" variant="subtle" size="sm">
                    {pctOf(step.value, prev)}% of prev
                  </Badge>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/** A four-step conversion funnel: Sent → Opened → Clicked → Responded. */
export const ConversionFunnel: Story = {
  render: () => <Funnel steps={STEPS} />,
};
