import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch.js';

const meta = {
  title: 'Forms/Switch',
  component: Switch.Root,
  tags: ['autodocs'],
  args: {
    label: 'Enable feature',
    name: 'feature',
    defaultChecked: false,
  },
  argTypes: {
    labelPosition: { control: 'inline-radio', options: ['start', 'end'] },
  },
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const Col = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-3)' }}>
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 'var(--eidra-space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ─── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: (args) => (
    <Col>
      <Switch.Root {...args} label="Unchecked" name="s1" />
      <Switch.Root {...args} label="Checked" name="s2" defaultChecked />
      <Switch.Root {...args} label="Disabled unchecked" name="s3" disabled />
      <Switch.Root {...args} label="Disabled checked" name="s4" defaultChecked disabled />
      <Switch.Root {...args} label="Read-only" name="s5" defaultChecked readOnly />
    </Col>
  ),
};

// ─── Label position ────────────────────────────────────────────────────────────

export const LabelPosition: Story = {
  render: (args) => (
    <Col>
      <Switch.Root {...args} label="Label at end (default)" name="lp1" labelPosition="end" />
      <Switch.Root {...args} label="Label at start" name="lp2" labelPosition="start" defaultChecked />
    </Col>
  ),
};

// ─── No label ──────────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <Row>
      <Switch.Root name="nl1" aria-label="Toggle dark mode" />
      <Switch.Root name="nl2" aria-label="Toggle notifications" defaultChecked />
    </Row>
  ),
};

// ─── Realistic: Workspace settings ────────────────────────────────────────────

export const WorkspaceSettings: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-0)',
        maxWidth: '28rem',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        overflow: 'hidden',
      }}
    >
      {[
        { label: 'Email notifications', name: 'email', defaultChecked: true },
        { label: 'Weekly digest', name: 'digest', defaultChecked: true },
        { label: 'Project updates', name: 'projects', defaultChecked: false },
        { label: 'Mention alerts', name: 'mentions', defaultChecked: true },
        { label: 'Beta features', name: 'beta', defaultChecked: false, disabled: true },
      ].map(({ label, name, defaultChecked, disabled }, i, arr) => (
        <div
          key={name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--eidra-space-4)',
            borderBottom: i < arr.length - 1 ? '1px solid var(--eidra-border-subtle)' : undefined,
            backgroundColor: 'var(--eidra-surface)',
          }}
        >
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--eidra-font-family-sans)', fontSize: 'var(--eidra-font-size-sm)', fontWeight: 'var(--eidra-font-weight-medium)', color: disabled ? 'var(--eidra-fg-disabled)' : 'var(--eidra-fg)' }}>
              {label}
            </p>
          </div>
          <Switch.Root
            name={name}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-label={label}
          />
        </div>
      ))}
    </div>
  ),
};
