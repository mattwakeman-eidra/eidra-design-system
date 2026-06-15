import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select.js';

const meta = {
  title: 'Forms/Select',
  component: Select.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root>
        <Select.Trigger />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
                <Select.Item value="trondheim">Trondheim</Select.Item>
                <Select.Item value="stavanger">Stavanger</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
};

// ─── WithDefaultValue ─────────────────────────────────────────────────────────

export const WithDefaultValue: Story = {
  name: 'With Default Value',
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root defaultValue="bergen">
        <Select.Trigger />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
                <Select.Item value="trondheim">Trondheim</Select.Item>
                <Select.Item value="stavanger">Stavanger</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)', width: 240 }}>
      <Select.Root>
        <Select.Trigger size="sm" />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <Select.Root>
        <Select.Trigger size="md" />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <Select.Root>
        <Select.Trigger size="lg" />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
};

// ─── WithGroups ───────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  name: 'With Groups',
  render: () => (
    <div style={{ width: 260 }}>
      <Select.Root>
        <Select.Trigger />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Group>
                  <Select.GroupLabel>Norway</Select.GroupLabel>
                  <Select.Item value="oslo">Oslo</Select.Item>
                  <Select.Item value="bergen">Bergen</Select.Item>
                  <Select.Item value="trondheim">Trondheim</Select.Item>
                </Select.Group>
                <Select.Group>
                  <Select.GroupLabel>Sweden</Select.GroupLabel>
                  <Select.Item value="stockholm">Stockholm</Select.Item>
                  <Select.Item value="gothenburg">Gothenburg</Select.Item>
                  <Select.Item value="malmo">Malmö</Select.Item>
                </Select.Group>
                <Select.Group>
                  <Select.GroupLabel>Denmark</Select.GroupLabel>
                  <Select.Item value="copenhagen">Copenhagen</Select.Item>
                  <Select.Item value="aarhus">Aarhus</Select.Item>
                </Select.Group>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
};

// ─── WithDisabledItems ────────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  name: 'With Disabled Items',
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root>
        <Select.Trigger />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="junior">Junior Consultant</Select.Item>
                <Select.Item value="senior">Senior Consultant</Select.Item>
                <Select.Item value="lead" disabled>Lead Consultant (unavailable)</Select.Item>
                <Select.Item value="principal">Principal Consultant</Select.Item>
                <Select.Item value="partner" disabled>Partner (unavailable)</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
};

// ─── DisabledTrigger ──────────────────────────────────────────────────────────

export const DisabledTrigger: Story = {
  name: 'Disabled',
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root disabled>
        <Select.Trigger />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
};

// ─── ConsultancyForm ──────────────────────────────────────────────────────────

export const ConsultancyForm: Story = {
  name: 'Consultancy Form Example',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-4)',
        width: 320,
        padding: 'var(--eidra-space-6)',
        border: '1px solid var(--eidra-border)',
        borderRadius: 'var(--eidra-radius-lg)',
        background: 'var(--eidra-surface)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1)' }}>
        <label
          style={{
            fontSize: 'var(--eidra-font-size-sm)',
            fontWeight: 'var(--eidra-font-weight-medium)',
            color: 'var(--eidra-fg)',
          }}
        >
          Practice area
        </label>
        <Select.Root>
          <Select.Trigger />
          <Select.Portal>
            <Select.Positioner sideOffset={8}>
              <Select.Popup>
                <Select.List>
                  <Select.Item value="strategy">Strategy</Select.Item>
                  <Select.Item value="technology">Technology</Select.Item>
                  <Select.Item value="design">Design</Select.Item>
                  <Select.Item value="sustainability">Sustainability</Select.Item>
                  <Select.Item value="finance">Finance</Select.Item>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1)' }}>
        <label
          style={{
            fontSize: 'var(--eidra-font-size-sm)',
            fontWeight: 'var(--eidra-font-weight-medium)',
            color: 'var(--eidra-fg)',
          }}
        >
          Office location
        </label>
        <Select.Root defaultValue="oslo">
          <Select.Trigger />
          <Select.Portal>
            <Select.Positioner sideOffset={8}>
              <Select.Popup>
                <Select.List>
                  <Select.Group>
                    <Select.GroupLabel>Norway</Select.GroupLabel>
                    <Select.Item value="oslo">Oslo</Select.Item>
                    <Select.Item value="bergen">Bergen</Select.Item>
                    <Select.Item value="trondheim">Trondheim</Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.GroupLabel>Nordic</Select.GroupLabel>
                    <Select.Item value="stockholm">Stockholm</Select.Item>
                    <Select.Item value="copenhagen">Copenhagen</Select.Item>
                    <Select.Item value="helsinki">Helsinki</Select.Item>
                  </Select.Group>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  ),
};
