import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { PeriodNavigator } from './PeriodNavigator.js';

const meta = {
  title: 'Navigation/PeriodNavigator',
  component: PeriodNavigator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact prev/next stepper for moving through a discrete value — ' +
          '`‹ [value] ›`. It is domain-agnostic: the caller owns the value and the ' +
          'label and decides what a step means (a month, a quarter, a page). The ' +
          'control only emits `onPrev` / `onNext` and renders the current `value`.',
      },
    },
  },
  argTypes: {
    prevDisabled: {
      control: 'boolean',
      description: 'Disable the previous control (e.g. at the start of the range).',
    },
    nextDisabled: {
      control: 'boolean',
      description: 'Disable the next control (e.g. at the end of the range).',
    },
    // Dropped prevLabel/nextLabel controls: they only set the buttons' aria-labels,
    // which produce no visible change in the rendered story.
  },
} satisfies Meta<typeof PeriodNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

const MONTHS = [
  'January 2026',
  'February 2026',
  'March 2026',
  'April 2026',
  'May 2026',
  'June 2026',
];

/**
 * **Playground.** Step through the months with local state while the scalar props
 * (`prevDisabled` / `nextDisabled`) are driven by the controls. The range guards
 * still override the disabled controls at the ends.
 */
export const Playground: Story = {
  args: {
    value: MONTHS[3],
    onPrev: () => {},
    onNext: () => {},
    prevDisabled: false,
    nextDisabled: false,
  },
  render: (args) => {
    const [index, setIndex] = useState(3);
    return (
      <PeriodNavigator
        {...args}
        value={MONTHS[index]}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(MONTHS.length - 1, i + 1))}
        prevDisabled={args.prevDisabled || index === 0}
        nextDisabled={args.nextDisabled || index === MONTHS.length - 1}
        prevLabel="Previous month"
        nextLabel="Next month"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('button', { name: /previous month/i });
    const next = canvas.getByRole('button', { name: /next month/i });

    await step('starts at April (index 3)', async () => {
      await expect(canvas.getByText('April 2026')).toBeInTheDocument();
    });

    await step('clicking next steps the value forward', async () => {
      await userEvent.click(next);
      await expect(canvas.getByText('May 2026')).toBeInTheDocument();
    });

    await step('clicking previous steps the value back', async () => {
      await userEvent.click(prev);
      await expect(canvas.getByText('April 2026')).toBeInTheDocument();
    });
  },
};

/** Wire `onPrev` / `onNext` to local state; the caller formats the label. */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  args: { value: MONTHS[3], onPrev: () => {}, onNext: () => {} },
  render: () => {
    const [index, setIndex] = useState(3);
    return (
      <PeriodNavigator
        value={MONTHS[index]}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(MONTHS.length - 1, i + 1))}
        prevDisabled={index === 0}
        nextDisabled={index === MONTHS.length - 1}
        prevLabel="Previous month"
        nextLabel="Next month"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('button', { name: /previous month/i });
    const next = canvas.getByRole('button', { name: /next month/i });

    await step('starts at April (index 3)', async () => {
      await expect(canvas.getByText('April 2026')).toBeInTheDocument();
    });

    await step('clicking next steps the value forward', async () => {
      await userEvent.click(next);
      await expect(canvas.getByText('May 2026')).toBeInTheDocument();
    });

    await step('clicking previous steps the value back', async () => {
      await userEvent.click(prev);
      await expect(canvas.getByText('April 2026')).toBeInTheDocument();
    });

    await step('next disables when the end of the range is reached', async () => {
      await userEvent.click(next); // May
      await userEvent.click(next); // June (last)
      await expect(canvas.getByText('June 2026')).toBeInTheDocument();
      await expect(next).toBeDisabled();
    });
  },
};

/**
 * Activating either control with the keyboard. Both controls are native
 * `<button>`s, so they are focusable and fire on Enter and Space.
 */
export const KeyboardActivation: Story = {
  args: {
    value: 'Q2 2026',
    onPrev: fn(),
    onNext: fn(),
    prevLabel: 'Previous quarter',
    nextLabel: 'Next quarter',
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('button', { name: /previous quarter/i });
    const next = canvas.getByRole('button', { name: /next quarter/i });

    await step('Enter on the focused previous control fires onPrev', async () => {
      prev.focus();
      await expect(prev).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(args.onPrev).toHaveBeenCalledTimes(1);
    });

    await step('Space on the focused next control fires onNext', async () => {
      next.focus();
      await expect(next).toHaveFocus();
      await userEvent.keyboard(' ');
      await expect(args.onNext).toHaveBeenCalledTimes(1);
    });
  },
};

/** At the start of the range — the previous control is disabled. */
export const AtStart: Story = {
  args: {
    value: MONTHS[0],
    onPrev: fn(),
    onNext: fn(),
    prevDisabled: true,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('button', { name: /previous/i });
    const next = canvas.getByRole('button', { name: /next/i });

    await step('the disabled previous control is inert and swallows clicks', async () => {
      await expect(prev).toBeDisabled();
      await userEvent.click(prev);
      await expect(args.onPrev).not.toHaveBeenCalled();
    });

    await step('the enabled next control still fires', async () => {
      await userEvent.click(next);
      await expect(args.onNext).toHaveBeenCalledTimes(1);
    });
  },
};

/** At the end of the range — the next control is disabled. */
export const AtEnd: Story = {
  args: {
    value: MONTHS[MONTHS.length - 1],
    onPrev: fn(),
    onNext: fn(),
    nextDisabled: true,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('button', { name: /previous/i });
    const next = canvas.getByRole('button', { name: /next/i });

    await step('the disabled next control is inert and swallows clicks', async () => {
      await expect(next).toBeDisabled();
      await userEvent.click(next);
      await expect(args.onNext).not.toHaveBeenCalled();
    });

    await step('the enabled previous control still fires', async () => {
      await userEvent.click(prev);
      await expect(args.onPrev).toHaveBeenCalledTimes(1);
    });
  },
};
