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

export const Playground: Story = {};

/* ------------------------------------------------------------------ */

export const Horizontal: Story = {
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
  ),
};
