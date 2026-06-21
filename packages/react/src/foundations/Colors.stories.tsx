import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--eidra-space-1)' }}>
      <div
        style={{
          height: 64,
          borderRadius: 'var(--eidra-radius-md)',
          border: '1px solid var(--eidra-border)',
          background: `var(${varName})`,
        }}
      />
      <div
        style={{
          fontSize: 'var(--eidra-font-size-sm)',
          fontWeight: 'var(--eidra-font-weight-medium)',
        }}
      >
        {name}
      </div>
      <code style={{ fontSize: 'var(--eidra-font-size-xs)', color: 'var(--eidra-fg-muted)' }}>
        {varName}
      </code>
    </div>
  );
}

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 'var(--eidra-space-4)',
    }}
  >
    {children}
  </div>
);

export const Brand: Story = {
  render: () => (
    <Grid>
      <Swatch name="Creme" varName="--eidra-color-creme" />
      <Swatch name="Taupe" varName="--eidra-color-taupe" />
      <Swatch name="Orange" varName="--eidra-color-orange-500" />
      <Swatch name="Coral" varName="--eidra-color-coral-500" />
      <Swatch name="Black" varName="--eidra-color-black" />
      <Swatch name="White" varName="--eidra-color-white" />
    </Grid>
  ),
};

export const Greyscale: Story = {
  render: () => (
    <Grid>
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
        <Swatch key={n} name={`Grey ${n}`} varName={`--eidra-color-grey-${n}`} />
      ))}
    </Grid>
  ),
};

export const Semantic: Story = {
  render: () => (
    <Grid>
      {[
        'bg',
        'surface',
        'fg',
        'fg-muted',
        'border',
        'accent',
        'accent-subtle',
        'coral',
        'success',
        'danger',
        'warning',
        'info',
      ].map((role) => (
        <Swatch key={role} name={role} varName={`--eidra-${role}`} />
      ))}
    </Grid>
  ),
};

/**
 * The financial data-viz palette. These colours carry domain meaning, so they
 * are a dedicated family rather than generic UI roles: the action accent is
 * Eidra Blue (in a financial context orange reads as caution); RAG conveys
 * positive/caution/negative; and the revenue ramp runs green→gold from
 * confirmed actuals to speculative upside. Consumed by `DataGrid`
 * (`accent="finance"`) and finance charts.
 */
export const Finance: Story = {
  render: () => (
    <Grid>
      <Swatch name="Accent (action)" varName="--eidra-finance-accent" />
      <Swatch name="Accent hover" varName="--eidra-finance-accent-hover" />
      <Swatch name="Accent subtle" varName="--eidra-finance-accent-subtle" />
      <Swatch name="Positive" varName="--eidra-finance-positive" />
      <Swatch name="Caution" varName="--eidra-finance-caution" />
      <Swatch name="Negative" varName="--eidra-finance-negative" />
      <Swatch name="Revenue · Actuals" varName="--eidra-finance-revenue-actuals" />
      <Swatch name="Revenue · Sold" varName="--eidra-finance-revenue-sold" />
      <Swatch name="Revenue · Hi-prob" varName="--eidra-finance-revenue-hi-prob" />
      <Swatch name="Revenue · Additional" varName="--eidra-finance-revenue-additional" />
    </Grid>
  ),
};
