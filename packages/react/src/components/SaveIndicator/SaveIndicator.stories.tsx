import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
