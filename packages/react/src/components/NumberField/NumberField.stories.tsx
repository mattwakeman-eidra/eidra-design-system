import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithoutRef } from 'react';
import { NumberField } from './NumberField.js';

const meta = {
  title: 'Forms/NumberField',
  component: NumberField.Root,
  tags: ['autodocs'],
  args: {
    defaultValue: 0,
    step: 1,
    min: 0,
    max: 100,
  },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 'var(--eidra-space-4)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberField.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultField = (props: ComponentPropsWithoutRef<typeof NumberField.Root>) => (
  <NumberField.Root defaultValue={0} step={1} {...props}>
    <NumberField.Group>
      <NumberField.Decrement />
      <NumberField.Input />
      <NumberField.Increment />
    </NumberField.Group>
  </NumberField.Root>
);

export const Playground: Story = {
  render: (args) => (
    <NumberField.Root {...args}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      <DefaultField size="sm" defaultValue={5} />
      <DefaultField size="md" defaultValue={5} />
      <DefaultField size="lg" defaultValue={5} />
    </>
  ),
};

export const WithMinMax: Story = {
  name: 'With min/max constraints',
  render: () => (
    <DefaultField min={0} max={10} defaultValue={5} step={1} />
  ),
};

export const WithDecimalStep: Story = {
  name: 'Decimal step (0.1)',
  render: () => (
    <DefaultField
      min={0}
      max={1}
      step={0.1}
      smallStep={0.01}
      defaultValue={0.5}
      format={{ minimumFractionDigits: 1, maximumFractionDigits: 2 }}
    />
  ),
};

export const CurrencyFormat: Story = {
  name: 'Currency formatting (NOK)',
  render: () => (
    <DefaultField
      min={0}
      max={1000000}
      step={1000}
      largeStep={10000}
      defaultValue={50000}
      format={{ style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }}
    />
  ),
};

export const PercentageFormat: Story = {
  name: 'Percentage format',
  render: () => (
    <DefaultField
      min={0}
      max={1}
      step={0.05}
      defaultValue={0.25}
      format={{ style: 'percent' }}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <DefaultField disabled defaultValue={42} />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <DefaultField readOnly defaultValue={99} />
  ),
};

export const WithScrubArea: Story = {
  name: 'With scrub area',
  render: () => (
    <NumberField.Root defaultValue={50} step={1} min={0} max={100}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.ScrubArea>
          <NumberField.Input />
          <NumberField.ScrubAreaCursor />
        </NumberField.ScrubArea>
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const ConsultancyRateExample: Story = {
  name: 'Consultancy daily rate (realistic)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--eidra-space-1)',
            fontSize: 'var(--eidra-font-size-sm)',
            fontWeight: 'var(--eidra-font-weight-medium)',
            color: 'var(--eidra-fg)',
            fontFamily: 'var(--eidra-font-family-sans)',
          }}
        >
          Daily rate (NOK)
        </label>
        <DefaultField
          min={0}
          max={50000}
          step={500}
          largeStep={5000}
          defaultValue={12500}
          format={{ style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }}
          size="md"
        />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--eidra-space-1)',
            fontSize: 'var(--eidra-font-size-sm)',
            fontWeight: 'var(--eidra-font-weight-medium)',
            color: 'var(--eidra-fg)',
            fontFamily: 'var(--eidra-font-family-sans)',
          }}
        >
          Billable hours per week
        </label>
        <DefaultField
          min={0}
          max={40}
          step={0.5}
          smallStep={0.25}
          defaultValue={37.5}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          size="md"
        />
      </div>
    </div>
  ),
  decorators: [(Story) => <Story />],
};
