import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fieldset } from './Fieldset.js';

const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset.Root,
  subcomponents: {
    'Fieldset.Legend': Fieldset.Legend,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic grouping of related form fields with an accessible legend. Built on Base UI `Fieldset`.',
      },
    },
  },
} satisfies Meta<typeof Fieldset.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// Minimal inline field layout for stories (avoids importing Field component)
const FormRow = ({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-1)' }}>
    <label
      htmlFor={id}
      style={{
        fontSize: 'var(--eidra-font-size-sm)',
        fontWeight: 'var(--eidra-font-weight-medium)',
        color: 'var(--eidra-fg)',
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  height: 'var(--eidra-size-control-md)',
  paddingInline: 'var(--eidra-space-3)',
  border: '1px solid var(--eidra-border)',
  borderRadius: 'var(--eidra-radius-md)',
  backgroundColor: 'var(--eidra-surface)',
  color: 'var(--eidra-fg)',
  fontFamily: 'var(--eidra-font-family-sans)',
  fontSize: 'var(--eidra-font-size-sm)',
};

export const Playground: Story = {
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
  render: (args) => (
    <form style={{ maxWidth: 480 }}>
      <Fieldset.Root {...args}>
        <Fieldset.Legend>Contact details</Fieldset.Legend>
        <FormRow label="Given name" id="given-name">
          <input id="given-name" placeholder="Ingrid" style={inputStyle} />
        </FormRow>
        <FormRow label="Family name" id="family-name">
          <input id="family-name" placeholder="Lindqvist" style={inputStyle} />
        </FormRow>
        <FormRow label="Email" id="email">
          <input id="email" type="email" placeholder="ingrid@example.no" style={inputStyle} />
        </FormRow>
      </Fieldset.Root>
    </form>
  ),
};

export const Default: Story = {
  render: () => (
    <form style={{ maxWidth: 480 }}>
      <Fieldset.Root>
        <Fieldset.Legend>Contact details</Fieldset.Legend>
        <FormRow label="Given name" id="s-given-name">
          <input id="s-given-name" placeholder="Ingrid" style={inputStyle} />
        </FormRow>
        <FormRow label="Email" id="s-email">
          <input id="s-email" type="email" placeholder="ingrid@example.no" style={inputStyle} />
        </FormRow>
      </Fieldset.Root>
    </form>
  ),
};

export const Disabled: Story = {
  render: () => (
    <form style={{ maxWidth: 480 }}>
      <Fieldset.Root disabled>
        <Fieldset.Legend>Delivery address</Fieldset.Legend>
        <FormRow label="Street" id="d-street">
          <input id="d-street" defaultValue="Karl Johans gate 1" style={inputStyle} disabled />
        </FormRow>
        <FormRow label="City" id="d-city">
          <input id="d-city" defaultValue="Oslo" style={inputStyle} disabled />
        </FormRow>
        <FormRow label="Postal code" id="d-postal">
          <input id="d-postal" defaultValue="0154" style={inputStyle} disabled />
        </FormRow>
      </Fieldset.Root>
    </form>
  ),
};

export const MultipleFieldsets: Story = {
  render: () => (
    <form
      style={{
        maxWidth: 560,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eidra-space-6)',
      }}
    >
      <Fieldset.Root>
        <Fieldset.Legend>Personal information</Fieldset.Legend>
        <FormRow label="Full name" id="m-name">
          <input id="m-name" placeholder="Ingrid Lindqvist" style={inputStyle} />
        </FormRow>
        <FormRow label="Date of birth" id="m-dob">
          <input id="m-dob" type="date" style={inputStyle} />
        </FormRow>
      </Fieldset.Root>

      <Fieldset.Root>
        <Fieldset.Legend>Account credentials</Fieldset.Legend>
        <FormRow label="Email" id="m-email">
          <input id="m-email" type="email" placeholder="ingrid@example.no" style={inputStyle} />
        </FormRow>
        <FormRow label="Password" id="m-password">
          <input id="m-password" type="password" placeholder="••••••••" style={inputStyle} />
        </FormRow>
      </Fieldset.Root>
    </form>
  ),
};

export const WithoutLegend: Story = {
  render: () => (
    <form style={{ maxWidth: 480 }}>
      <Fieldset.Root>
        <FormRow label="Message" id="wl-msg">
          <textarea
            id="wl-msg"
            rows={4}
            placeholder="Write your message here…"
            style={{
              ...inputStyle,
              height: 'auto',
              paddingBlock: 'var(--eidra-space-2)',
              resize: 'vertical',
            }}
          />
        </FormRow>
      </Fieldset.Root>
    </form>
  ),
};
