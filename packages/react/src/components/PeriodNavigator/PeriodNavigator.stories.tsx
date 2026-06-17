import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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

/** Wire `onPrev` / `onNext` to local state; the caller formats the label. */
export const Default: Story = {
  args: { value: '', onPrev: () => {}, onNext: () => {} },
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
};

/** At the start of the range — the previous control is disabled. */
export const AtStart: Story = {
  args: {
    value: MONTHS[0],
    onPrev: () => {},
    onNext: () => {},
    prevDisabled: true,
  },
};

/** At the end of the range — the next control is disabled. */
export const AtEnd: Story = {
  args: {
    value: MONTHS[MONTHS.length - 1],
    onPrev: () => {},
    onNext: () => {},
    nextDisabled: true,
  },
};
