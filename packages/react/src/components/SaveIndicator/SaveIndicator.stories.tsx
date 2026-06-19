import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { SaveIndicator, useSaveIndicator } from './SaveIndicator.js';
import { Button } from '../Button/Button.js';
import { Input } from '../Input/Input.js';

const meta = {
  title: 'Feedback/SaveIndicator',
  component: SaveIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { saved: false, duration: 2000 },
} satisfies Meta<typeof SaveIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Driven by `useSaveIndicator` — click Save to replay the confirmation. */
export const Playground: Story = {
  render: () => {
    const [saved, markSaved] = useSaveIndicator();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-3)' }}>
        <Button tone="accent" onClick={markSaved}>
          Save
        </Button>
        <SaveIndicator saved={saved} label="Saved" />
      </div>
    );
  },
};

/** Icon-only (the source-app default). Still announced as "Saved" to assistive tech. */
export const IconOnly: Story = {
  render: () => {
    const [saved, markSaved] = useSaveIndicator();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
        <Button variant="outline" size="sm" onClick={markSaved}>
          Save
        </Button>
        <SaveIndicator saved={saved} />
      </div>
    );
  },
};

/** Inline beside an edited field — the typical inline-edit pattern. */
export const InlineWithField: Story = {
  render: () => {
    const [saved, markSaved] = useSaveIndicator();
    const [value, setValue] = useState('120,000');
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
        <span style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)' }}>
          Sold
        </span>
        <Input
          value={value}
          size="sm"
          style={{ width: 120 }}
          onChange={(e) => setValue(e.target.value)}
          onBlur={markSaved}
        />
        <SaveIndicator saved={saved} />
      </label>
    );
  },
};

/**
 * Interaction: clicking Save replays the confirmation — the live region becomes
 * visible with the checkmark + label, then fades out on its own after `duration`.
 * (Short duration here so the test observes the full appear→fade lifecycle.)
 */
export const Confirms: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [saved, markSaved] = useSaveIndicator();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-3)' }}>
        <Button tone="accent" onClick={markSaved}>
          Save
        </Button>
        <SaveIndicator saved={saved} label="Saved" duration={400} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    // Hidden until a save fires.
    await expect(status).not.toHaveAttribute('data-visible');

    await userEvent.click(canvas.getByRole('button', { name: /save/i }));

    // Appears with the visible label, exposed via the aria-live region.
    await waitFor(() => expect(status).toHaveAttribute('data-visible'));
    await expect(within(status).getByText('Saved')).toBeInTheDocument();

    // Fades out on its own after `duration`.
    await waitFor(() => expect(status).not.toHaveAttribute('data-visible'));
  },
};

/**
 * Interaction: the icon-only form renders no visible label, but still exposes a
 * screen-reader-only "Saved" in the live region so the save is announced.
 */
export const IconOnlyAnnounced: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [saved, markSaved] = useSaveIndicator();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eidra-space-2)' }}>
        <Button variant="outline" size="sm" onClick={markSaved}>
          Save
        </Button>
        <SaveIndicator saved={saved} duration={400} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await userEvent.click(canvas.getByRole('button', { name: /save/i }));

    // No visible label, but "Saved" is present for assistive tech.
    await waitFor(() => expect(status).toHaveAttribute('data-visible'));
    await expect(within(status).getByText('Saved')).toBeInTheDocument();

    await waitFor(() => expect(status).not.toHaveAttribute('data-visible'));
  },
};
