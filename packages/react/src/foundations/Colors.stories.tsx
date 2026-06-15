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
      <div style={{ fontSize: 'var(--eidra-font-size-sm)', fontWeight: 'var(--eidra-font-weight-medium)' }}>
        {name}
      </div>
      <code style={{ fontSize: 'var(--eidra-font-size-xs)', color: 'var(--eidra-fg-muted)' }}>{varName}</code>
    </div>
  );
}

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--eidra-space-4)' }}>
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
