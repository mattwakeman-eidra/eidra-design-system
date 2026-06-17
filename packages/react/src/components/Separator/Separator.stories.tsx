import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator.js';

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */

/**
 * Drive `orientation` and `label` from the controls. A vertical separator needs
 * a sized parent, so this demo switches to a fixed-height row when vertical
 * (`label` applies to horizontal separators only).
 */
export const Playground: Story = {
  render: (args) => {
    const vertical = args.orientation === 'vertical';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: vertical ? 'row' : 'column',
          alignItems: vertical ? 'center' : 'stretch',
          gap: 'var(--eidra-space-4)',
          height: vertical ? 48 : undefined,
          maxWidth: 480,
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-sm)',
          color: 'var(--eidra-fg)',
        }}
      >
        <span>Before</span>
        <Separator {...args} />
        <span>After</span>
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */

export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)', maxWidth: 480 }}>
      <p style={{ margin: 0, color: 'var(--eidra-fg)', fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-sm)' }}>
        Eidra helps Nordic companies build products people love.
      </p>
      <Separator />
      <p style={{ margin: 0, color: 'var(--eidra-fg-muted)', fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-sm)' }}>
        Strategy. Design. Engineering.
      </p>
    </div>
  ),
};

/* ------------------------------------------------------------------ */

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-4)', height: 32 }}>
      {(['Services', 'Case Studies', 'About', 'Contact'] as const).map((item, idx, arr) => (
        <span key={item} style={{ display: 'contents' }}>
          <span
            style={{
              color: 'var(--eidra-fg)',
              fontFamily: 'var(--eidra-font-family-sans)',
              fontSize: 'var(--eidra-font-size-sm)',
            }}
          >
            {item}
          </span>
          {idx < arr.length - 1 && <Separator orientation="vertical" />}
        </span>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */

export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-6)', maxWidth: 480 }}>
      <Separator label="or continue with" />
      <Separator label="Services" />
      <Separator label="2024" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */

export const InCard: Story = {
  name: 'In Card Context',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        maxWidth: 360,
        padding: 'var(--eidra-space-6)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-4)',
        fontFamily: 'var(--eidra-font-family-sans)',
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 'var(--eidra-font-weight-semibold)', color: 'var(--eidra-fg)', fontSize: 'var(--eidra-font-size-base)' }}>
          Project Proposal
        </p>
        <p style={{ margin: '4px 0 0', color: 'var(--eidra-fg-muted)', fontSize: 'var(--eidra-font-size-sm)' }}>
          Nordic Digital Transformation 2024
        </p>
      </div>
      <Separator />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)' }}>
        <p style={{ margin: 0, color: 'var(--eidra-fg-subtle)', fontSize: 'var(--eidra-font-size-xs)' }}>CLIENT</p>
        <p style={{ margin: 0, color: 'var(--eidra-fg)', fontSize: 'var(--eidra-font-size-sm)' }}>Storebrand ASA</p>
      </div>
      <Separator />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-2)' }}>
        <p style={{ margin: 0, color: 'var(--eidra-fg-subtle)', fontSize: 'var(--eidra-font-size-xs)' }}>SCOPE</p>
        <p style={{ margin: 0, color: 'var(--eidra-fg)', fontSize: 'var(--eidra-font-size-sm)' }}>
          UX audit, design system, front-end build
        </p>
      </div>
    </div>
  )
};
