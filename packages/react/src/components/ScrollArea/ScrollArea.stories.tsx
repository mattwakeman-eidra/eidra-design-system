import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea.js';

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea.Root,
  subcomponents: {
    'ScrollArea.Viewport': ScrollArea.Viewport,
    'ScrollArea.Content': ScrollArea.Content,
    'ScrollArea.Scrollbar': ScrollArea.Scrollbar,
    'ScrollArea.Thumb': ScrollArea.Thumb,
    'ScrollArea.Corner': ScrollArea.Corner,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Helpers ----

const consultants = [
  { name: 'Astrid Lindqvist', role: 'Senior Strategist', location: 'Stockholm' },
  { name: 'Mikael Bergström', role: 'UX Lead', location: 'Gothenburg' },
  { name: 'Ingrid Halvorsen', role: 'Service Designer', location: 'Oslo' },
  { name: 'Lars Eriksson', role: 'Tech Lead', location: 'Malmö' },
  { name: 'Sigrid Thorvaldsen', role: 'Product Manager', location: 'Copenhagen' },
  { name: 'Bjørn Andersen', role: 'Data Analyst', location: 'Bergen' },
  { name: 'Freya Magnusson', role: 'Brand Designer', location: 'Helsinki' },
  { name: 'Ragnar Petersson', role: 'Solutions Architect', location: 'Stockholm' },
  { name: 'Solveig Dahl', role: 'Change Consultant', location: 'Trondheim' },
  { name: 'Viktor Holm', role: 'Digital Strategist', location: 'Uppsala' },
  { name: 'Maja Lindberg', role: 'Content Strategist', location: 'Lund' },
  { name: 'Einar Jørgensen', role: 'Innovation Lead', location: 'Aarhus' },
];

// ---- Stories ----

export const Playground: Story = {
  render: (args) => (
    <ScrollArea.Root {...args} style={{ height: 320, width: 420 }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <ul style={{ listStyle: 'none', margin: 0, padding: 'var(--eidra-gap-3)' }}>
            {consultants.map((c) => (
              <li
                key={c.name}
                style={{
                  padding: 'var(--eidra-gap-3)',
                  borderBottom: '1px solid var(--eidra-border-subtle)',
                  fontFamily: 'var(--eidra-font-family-sans)',
                  fontSize: 'var(--eidra-font-size-sm)',
                }}
              >
                <strong style={{ color: 'var(--eidra-fg)', display: 'block' }}>{c.name}</strong>
                <span style={{ color: 'var(--eidra-fg-muted)' }}>
                  {c.role} · {c.location}
                </span>
              </li>
            ))}
          </ul>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const VerticalOnly: Story = {
  name: 'Vertical scroll',
  render: () => (
    <ScrollArea.Root
      style={{
        height: 280,
        width: 360,
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
      }}
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div
            style={{
              padding: 'var(--eidra-gap-4)',
              fontFamily: 'var(--eidra-font-family-sans)',
              fontSize: 'var(--eidra-font-size-sm)',
              color: 'var(--eidra-fg)',
            }}
          >
            <p style={{ marginTop: 0 }}>
              Eidra is a Nordic management consultancy helping organisations navigate complex
              change.
            </p>
            <p>
              Our consultants bring deep sector expertise across public services, financial
              institutions, and technology companies throughout the Nordic region.
            </p>
            <p>
              We combine strategic insight with hands-on execution — from organisation design to
              digital transformation.
            </p>
            <p>
              Founded in Stockholm, we operate across Norway, Sweden, Denmark, and Finland with a
              growing presence in the UK.
            </p>
            <p>
              Our approach is rooted in curiosity, clarity, and a commitment to lasting impact for
              the organisations and people we work with.
            </p>
            <p>
              We believe good strategy is only as good as its implementation, and we stay with
              clients through that entire journey.
            </p>
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

export const HorizontalOnly: Story = {
  name: 'Horizontal scroll',
  render: () => (
    <ScrollArea.Root
      style={{
        width: 400,
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
      }}
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div
            style={{
              display: 'flex',
              gap: 'var(--eidra-gap-3)',
              padding: 'var(--eidra-gap-4)',
              width: 'max-content',
            }}
          >
            {consultants.slice(0, 8).map((c) => (
              <div
                key={c.name}
                style={{
                  flexShrink: 0,
                  width: 160,
                  padding: 'var(--eidra-gap-3)',
                  borderRadius: 'var(--eidra-radius-md)',
                  background: 'var(--eidra-surface)',
                  border: '1px solid var(--eidra-border-subtle)',
                  fontFamily: 'var(--eidra-font-family-sans)',
                  fontSize: 'var(--eidra-font-size-xs)',
                }}
              >
                <strong
                  style={{
                    color: 'var(--eidra-fg)',
                    display: 'block',
                    marginBottom: 'var(--eidra-space-1)',
                    fontSize: 'var(--eidra-font-size-sm)',
                  }}
                >
                  {c.name}
                </strong>
                <span style={{ color: 'var(--eidra-fg-muted)' }}>{c.role}</span>
                <br />
                <span style={{ color: 'var(--eidra-fg-subtle)' }}>{c.location}</span>
              </div>
            ))}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

export const BothAxes: Story = {
  name: 'Both axes',
  render: () => (
    <ScrollArea.Root
      style={{
        height: 320,
        width: 420,
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
      }}
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <table
            style={{
              borderCollapse: 'collapse',
              width: 'max-content',
              fontFamily: 'var(--eidra-font-family-sans)',
              fontSize: 'var(--eidra-font-size-sm)',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--eidra-bg-subtle)' }}>
                {['Name', 'Role', 'Location', 'Since', 'Status'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 'var(--eidra-gap-2) var(--eidra-gap-4)',
                      textAlign: 'left',
                      fontWeight: 'var(--eidra-font-weight-semibold)',
                      color: 'var(--eidra-fg)',
                      borderBottom: '1px solid var(--eidra-border)',
                      whiteSpace: 'nowrap',
                      minWidth: 140,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consultants.map((c, i) => (
                <tr
                  key={c.name}
                  style={{ background: i % 2 === 0 ? 'transparent' : 'var(--eidra-bg-inset)' }}
                >
                  <td
                    style={{
                      padding: 'var(--eidra-gap-2) var(--eidra-gap-4)',
                      color: 'var(--eidra-fg)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.name}
                  </td>
                  <td
                    style={{
                      padding: 'var(--eidra-gap-2) var(--eidra-gap-4)',
                      color: 'var(--eidra-fg-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.role}
                  </td>
                  <td
                    style={{
                      padding: 'var(--eidra-gap-2) var(--eidra-gap-4)',
                      color: 'var(--eidra-fg-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.location}
                  </td>
                  <td
                    style={{
                      padding: 'var(--eidra-gap-2) var(--eidra-gap-4)',
                      color: 'var(--eidra-fg-subtle)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {2018 + (i % 6)}
                  </td>
                  <td
                    style={{
                      padding: 'var(--eidra-gap-2) var(--eidra-gap-4)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px var(--eidra-gap-2)',
                        borderRadius: 'var(--eidra-radius-full)',
                        fontSize: 'var(--eidra-font-size-xs)',
                        background:
                          i % 3 === 0
                            ? 'var(--eidra-success-subtle)'
                            : 'var(--eidra-accent-subtle)',
                        color: i % 3 === 0 ? 'var(--eidra-success-fg)' : 'var(--eidra-accent-fg)',
                      }}
                    >
                      {i % 3 === 0 ? 'On Leave' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};
