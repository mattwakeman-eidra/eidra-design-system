import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Send } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
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
  // Dropped `validationMode` control: behavioural (controls *when* validation
  // runs), not visible from a static toggle — dedicated stories below demonstrate
  // each mode via interaction.
  args: {
    onFormSubmit: fn(),
  },
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
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText(/email address/i);
    const name = canvas.getByLabelText(/full name/i);

    await step('typing fills the controls', async () => {
      await userEvent.type(email, 'jane@eidra.com');
      await userEvent.type(name, 'Jane Andersen');
      await expect(email).toHaveValue('jane@eidra.com');
      await expect(name).toHaveValue('Jane Andersen');
    });

    await step('submitting fires onFormSubmit with the collected values', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
      await waitFor(() => expect(args.onFormSubmit).toHaveBeenCalled());
      await expect(args.onFormSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'jane@eidra.com', name: 'Jane Andersen' }),
        expect.anything(),
      );
    });
  },
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('errors keyed by field name mark the controls invalid', async () => {
      const email = canvas.getByLabelText(/email address/i);
      const name = canvas.getByLabelText(/full name/i);
      await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
      await expect(name).toHaveAttribute('aria-invalid', 'true');
    });
    await step('editing a field clears its server error', async () => {
      const email = canvas.getByLabelText(/email address/i);
      await userEvent.type(email, 'x');
      await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid', 'true'));
    });
  },
};

export const ValidationModeOnBlur: Story = {
  name: 'Validation on blur',
  render: () => (
    <Form validationMode="onBlur">
      <Field name="company" label="Company name" hint="Tab away to trigger validation." required>
        <Input placeholder="Eidra AS" required />
      </Field>
      <Field name="role" label="Role" required>
        <Input placeholder="Senior Consultant" required />
      </Field>
      <Button type="submit">Save</Button>
    </Form>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const company = canvas.getByLabelText(/company name/i);

    await step('an untouched required field is not yet invalid', async () => {
      await expect(company).not.toHaveAttribute('aria-invalid', 'true');
    });

    await step('blurring an empty required field marks it invalid', async () => {
      // Base UI suppresses the `valueMissing` error until the field has been
      // dirtied at least once ("reduce error noise"): a field the user only
      // focused and left never flags. Type then clear to genuinely dirty it,
      // so blurring it while empty triggers real required-validation on blur.
      await userEvent.type(company, 'x');
      await userEvent.clear(company);
      await userEvent.tab();
      await waitFor(() => expect(company).toHaveAttribute('aria-invalid', 'true'));
    });

    await step('refilling and blurring clears the invalid state', async () => {
      await userEvent.type(company, 'Eidra AS');
      await userEvent.tab();
      await waitFor(() => expect(company).not.toHaveAttribute('aria-invalid', 'true'));
    });
  },
};

export const ValidationModeOnChange: Story = {
  name: 'Validation on change',
  render: () => (
    <Form validationMode="onChange">
      <Field name="username" label="Username" hint="Type to validate immediately." required>
        <Input placeholder="nordic_user" required />
      </Field>
      <Button type="submit">Create account</Button>
    </Form>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const username = canvas.getByLabelText(/username/i);

    await step('typing a valid value keeps the field valid', async () => {
      await userEvent.type(username, 'nordic');
      await expect(username).not.toHaveAttribute('aria-invalid', 'true');
    });

    await step('clearing a required field invalidates it on the same change', async () => {
      await userEvent.clear(username);
      await waitFor(() => expect(username).toHaveAttribute('aria-invalid', 'true'));
    });
  },
};

export const ControlledWithCallback: Story = {
  name: 'Controlled — onFormSubmit callback',
  render: () => {
    const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-gap-4)' }}>
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
            data-testid="submitted"
            style={{
              background: 'var(--eidra-bg-subtle)',
              border: '1px solid var(--eidra-border)',
              borderRadius: 'var(--eidra-radius-md)',
              padding: 'var(--eidra-gap-3)',
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('no submission output before submit', async () => {
      await expect(canvas.queryByTestId('submitted')).toBeNull();
    });

    await step('submitting routes the collected values into host state', async () => {
      await userEvent.type(canvas.getByLabelText(/project name/i), 'Eidra Platform Q3');
      await userEvent.type(canvas.getByLabelText(/contact email/i), 'lead@eidra.com');
      await userEvent.click(canvas.getByRole('button', { name: /submit project/i }));
      const output = await canvas.findByTestId('submitted');
      await expect(output).toHaveTextContent('Eidra Platform Q3');
      await expect(output).toHaveTextContent('lead@eidra.com');
    });
  },
};

export const SubmitBlockedByValidation: Story = {
  name: 'Submit blocked by required validation',
  args: {
    onFormSubmit: fn(),
  },
  render: (args) => (
    <Form {...args}>
      <Field name="email" label="Email address" required>
        <Input type="email" placeholder="you@eidra.com" required />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText(/email address/i);

    await step('submitting with an empty required field does not fire onFormSubmit', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
      await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
      await expect(args.onFormSubmit).not.toHaveBeenCalled();
    });

    await step('once the field is filled the form submits', async () => {
      await userEvent.type(email, 'you@eidra.com');
      // Default onSubmit mode re-validates on change after the first submit.
      await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid', 'true'));
      await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
      await waitFor(() => expect(args.onFormSubmit).toHaveBeenCalledTimes(1));
      await expect(args.onFormSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'you@eidra.com' }),
        expect.anything(),
      );
    });
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
      <div style={{ display: 'flex', gap: 'var(--eidra-gap-3)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" tone="neutral" type="reset">
          Clear
        </Button>
        <Button type="submit" endIcon={<Icon icon={Send} />}>
          Send enquiry
        </Button>
      </div>
    </Form>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const firstName = canvas.getByLabelText(/first name/i);
    const email = canvas.getByLabelText(/work email/i);

    await step('fields accept input', async () => {
      await userEvent.type(firstName, 'Ingrid');
      await userEvent.type(email, 'ingrid@company.com');
      await expect(firstName).toHaveValue('Ingrid');
      await expect(email).toHaveValue('ingrid@company.com');
    });

    await step('the reset button clears every control', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /clear/i }));
      await waitFor(() => expect(firstName).toHaveValue(''));
      await expect(email).toHaveValue('');
    });
  },
};
