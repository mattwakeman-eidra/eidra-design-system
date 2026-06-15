import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Send } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Button } from '../Button/Button.js';
import { Field } from '../Field/Field.js';
import { Input } from '../Input/Input.js';
import { Form } from './Form.js';

const meta = {
  title: 'Forms/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Form {...args}>
      <Field name="email" label="Email address" hint="We will never share your email." required>
        <Input type="email" placeholder="you@eidra.com" />
      </Field>
      <Field name="name" label="Full name" required>
        <Input placeholder="Jane Andersen" />
      </Field>
      <Button type="submit" endIcon={<Icon icon={Send} />}>
        Submit
      </Button>
    </Form>
  ),
};

export const WithServerErrors: Story = {
  name: 'Server-side errors',
  render: () => (
    <Form
      errors={{
        email: 'This email address is already registered.',
        name: 'Name must be at least 2 characters.',
      }}
    >
      <Field name="email" label="Email address" required>
        <Input type="email" defaultValue="existing@eidra.com" />
      </Field>
      <Field name="name" label="Full name" required>
        <Input defaultValue="J" />
      </Field>
      <Button type="submit">Try again</Button>
    </Form>
  ),
};

export const ValidationModeOnBlur: Story = {
  name: 'Validation on blur',
  render: () => (
    <Form validationMode="onBlur">
      <Field name="company" label="Company name" hint="Tab away to trigger validation." required>
        <Input placeholder="Eidra AS" />
      </Field>
      <Field name="role" label="Role" required>
        <Input placeholder="Senior Consultant" />
      </Field>
      <Button type="submit">Save</Button>
    </Form>
  ),
};

export const ValidationModeOnChange: Story = {
  name: 'Validation on change',
  render: () => (
    <Form validationMode="onChange">
      <Field name="username" label="Username" hint="Type to validate immediately." required>
        <Input placeholder="nordic_user" />
      </Field>
      <Button type="submit">Create account</Button>
    </Form>
  ),
};

export const ControlledWithCallback: Story = {
  name: 'Controlled — onFormSubmit callback',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
        <Form
          onFormSubmit={(values) => {
            setSubmitted(values as Record<string, unknown>);
          }}
        >
          <Field name="projectName" label="Project name" required>
            <Input placeholder="Eidra Platform Q3" />
          </Field>
          <Field name="contact" label="Contact email" required>
            <Input type="email" placeholder="project.lead@eidra.com" />
          </Field>
          <Button type="submit" endIcon={<Icon icon={Send} />}>
            Submit project
          </Button>
        </Form>
        {submitted != null && (
          <pre
            style={{
              background: 'var(--eidra-bg-subtle)',
              border: '1px solid var(--eidra-border)',
              borderRadius: 'var(--eidra-radius-md)',
              padding: 'var(--eidra-space-3)',
              fontSize: 'var(--eidra-font-size-xs)',
              fontFamily: 'var(--eidra-font-family-mono)',
              color: 'var(--eidra-fg-muted)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

export const ContactForm: Story = {
  name: 'Full contact form',
  render: () => (
    <Form>
      <Field name="firstName" label="First name" required>
        <Input placeholder="Ingrid" />
      </Field>
      <Field name="lastName" label="Last name" required>
        <Input placeholder="Larsen" />
      </Field>
      <Field name="email" label="Work email" hint="Used to send you a confirmation." required>
        <Input type="email" placeholder="ingrid.larsen@company.com" />
      </Field>
      <Field name="phone" label="Phone number" hint="Optional — include country code.">
        <Input type="tel" placeholder="+47 900 00 000" />
      </Field>
      <div style={{ display: 'flex', gap: 'var(--eidra-space-3)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" tone="neutral" type="reset">
          Clear
        </Button>
        <Button type="submit" endIcon={<Icon icon={Send} />}>
          Send enquiry
        </Button>
      </div>
    </Form>
  ),
};
