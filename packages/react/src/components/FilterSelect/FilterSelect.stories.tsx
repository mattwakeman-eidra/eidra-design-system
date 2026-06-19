import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { FilterSelect, type FilterSelectOption } from './FilterSelect.js';

const meta = {
  title: 'Forms/FilterSelect',
  component: FilterSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
  // Placeholder required props; every story supplies real state via `render`.
  args: { options: [], value: [], onValueChange: () => {} },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const REGIONS: FilterSelectOption[] = [
  { value: 'nordics', label: 'Nordics' },
  { value: 'benelux', label: 'Benelux' },
  { value: 'dach', label: 'DACH' },
  { value: 'uki', label: 'UK & Ireland' },
];

const OWNERS: FilterSelectOption[] = [
  { value: 'al', label: 'A. Lindqvist' },
  { value: 'mp', label: 'M. Persson' },
  { value: 'jdv', label: 'J. de Vries' },
  { value: 'ks', label: 'K. Sørensen' },
  { value: 'rt', label: 'R. Thoresen' },
  { value: 'eh', label: 'E. Hansen' },
  { value: 'nb', label: 'N. Bakker' },
  { value: 'cv', label: 'C. Visser' },
  { value: 'lm', label: 'L. Møller' },
  { value: 'sf', label: 'S. Fischer' },
];

/** Basic single filter — selecting keeps the popup open and updates the count. */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <FilterSelect
        aria-label="Region"
        placeholder="Region"
        noun="region"
        options={REGIONS}
        value={value}
        onValueChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /region/i });

    await step('clicking the trigger opens the popover', async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      // The option list is portaled to document.body — query with screen.
      const nordicsOption = await screen.findByRole('checkbox', { name: /Nordics/ });
      await waitFor(() => expect(nordicsOption).toBeVisible());
    });

    await step('toggling an option checks it and keeps the popup open', async () => {
      const nordics = await screen.findByRole('checkbox', { name: /Nordics/ });
      await userEvent.click(nordics);
      await expect(nordics).toBeChecked();
      // Popup stays open while toggling.
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      // Footer count reflects the selection.
      await waitFor(async () => expect(await screen.findByText('1 selected')).toBeVisible());
    });

    await step('a second selection updates the trigger summary to the noun count', async () => {
      await userEvent.click(await screen.findByRole('checkbox', { name: /Benelux/ }));
      await waitFor(async () => expect(await screen.findByText('2 selected')).toBeVisible());
      await expect(trigger).toHaveTextContent(/2 regions/);
    });

    await step('toggling a checked option deselects it', async () => {
      const benelux = await screen.findByRole('checkbox', { name: /Benelux/ });
      await userEvent.click(benelux);
      await expect(benelux).not.toBeChecked();
      // Single selection now shows that option's label, not the count summary.
      await expect(trigger).toHaveTextContent(/Nordics/);
    });

    await step('Escape closes the popover', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
      await waitFor(() =>
        expect(screen.queryByRole('checkbox', { name: /Nordics/ })).toBeNull(),
      );
    });
  },
};

/** A long list auto-shows the search box (default threshold: 8 options). */
export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['al', 'mp']);
    return (
      <FilterSelect
        aria-label="Account owner"
        placeholder="Owner"
        noun="owner"
        options={OWNERS}
        value={value}
        onValueChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /owner/i });

    await step('the long list auto-shows the search box', async () => {
      await userEvent.click(trigger);
      // searchPlaceholder defaults to "Search…" and is the search input's aria-label.
      const searchBox = await screen.findByRole('textbox', { name: /search/i });
      await waitFor(() => expect(searchBox).toBeVisible());
    });

    await step('typing filters the option list', async () => {
      const search = await screen.findByRole('textbox', { name: /search/i });
      await userEvent.type(search, 'Fischer');
      const fischer = await screen.findByRole('checkbox', { name: /Fischer/ });
      await waitFor(() => expect(fischer).toBeVisible());
      await waitFor(() =>
        expect(screen.queryByRole('checkbox', { name: /Lindqvist/ })).toBeNull(),
      );
    });

    await step('a query with no matches shows the empty message', async () => {
      const search = await screen.findByRole('textbox', { name: /search/i });
      await userEvent.clear(search);
      await userEvent.type(search, 'zzzzz');
      await waitFor(async () => expect(await screen.findByText(/No matches/i)).toBeVisible());
    });

    await step('clearing the query restores the full list', async () => {
      const search = await screen.findByRole('textbox', { name: /search/i });
      await userEvent.clear(search);
      const lindqvist = await screen.findByRole('checkbox', { name: /Lindqvist/ });
      await waitFor(() => expect(lindqvist).toBeVisible());
    });
  },
};

/** Pre-selected values: 1 selected shows the value, ≥2 shows "{n} {noun}s". */
export const Preselected: Story = {
  render: () => {
    const [one, setOne] = useState<string[]>(['nordics']);
    const [many, setMany] = useState<string[]>(['nordics', 'dach', 'uki']);
    return (
      <div style={{ display: 'flex', gap: 'var(--eidra-space-3)' }}>
        <FilterSelect aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={one} onValueChange={setOne} />
        <FilterSelect aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={many} onValueChange={setMany} />
      </div>
    );
  },
};

/** A custom `summary` renderer — here, listing the chosen labels inline. */
export const CustomSummary: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['nordics', 'benelux']);
    return (
      <FilterSelect
        aria-label="Region"
        placeholder="All regions"
        options={REGIONS}
        value={value}
        onValueChange={setValue}
        summary={(selected, options) =>
          selected.length === 0
            ? 'All regions'
            : options
                .filter((o) => selected.includes(o.value))
                .map((o) => o.label)
                .join(', ')
        }
      />
    );
  },
};

/** Compact `size="sm"` pill for dense toolbars. */
export const Small: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['dach']);
    return (
      <FilterSelect size="sm" aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={value} onValueChange={setValue} />
    );
  },
};

/** Disabled options inside the list, and a fully disabled control. */
export const DisabledStates: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['nordics']);
    const opts: FilterSelectOption[] = [
      { value: 'nordics', label: 'Nordics' },
      { value: 'benelux', label: 'Benelux (no access)', disabled: true },
      { value: 'dach', label: 'DACH' },
    ];
    return (
      <div style={{ display: 'flex', gap: 'var(--eidra-space-3)' }}>
        <FilterSelect aria-label="Region" placeholder="Region" noun="region" options={opts} value={value} onValueChange={setValue} />
        <FilterSelect aria-label="Region" placeholder="Region (disabled)" options={REGIONS} value={[]} onValueChange={() => {}} disabled />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('a fully disabled control is not interactive and stays closed', async () => {
      // Both triggers share the accessible name "Region" (the aria-label); the
      // "(disabled)" text is only the visible placeholder, not the a11y name.
      // The disabled control carries the native `disabled` attribute — pick it.
      const triggers = canvas.getAllByRole('button', { name: 'Region' });
      const disabledTrigger = triggers.find((b) => b.hasAttribute('disabled'))!;
      await expect(disabledTrigger).toBeDisabled();
      await userEvent.click(disabledTrigger, { pointerEventsCheck: 0 });
      await expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('a disabled option cannot be toggled', async () => {
      const trigger = canvas
        .getAllByRole('button', { name: 'Region' })
        .find((b) => !b.hasAttribute('disabled'))!;
      await userEvent.click(trigger);
      const benelux = await screen.findByRole('checkbox', { name: /Benelux/ });
      await waitFor(() => expect(benelux).toBeVisible());
      // Base UI marks the disabled option via aria-disabled (it's a role="checkbox"
      // span, not a native control), and disables pointer events on it.
      await expect(benelux).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(benelux, { pointerEventsCheck: 0 });
      await expect(benelux).not.toBeChecked();
      // Footer count is unchanged (the pre-selected Nordics remains the only selection).
      await waitFor(async () => expect(await screen.findByText('1 selected')).toBeVisible());
    });
  },
};

/** The invoicing toolbar: six filter pills side by side. */
export const FilterToolbar: Story = {
  render: () => {
    const [region, setRegion] = useState<string[]>([]);
    const [opco, setOpco] = useState<string[]>(['fabrique']);
    const [client, setClient] = useState<string[]>([]);
    const [owner, setOwner] = useState<string[]>(['al', 'mp', 'jdv']);
    const [size, setSize] = useState<string[]>([]);
    const [industry, setIndustry] = useState<string[]>([]);
    const opcos: FilterSelectOption[] = [
      { value: 'fabrique', label: 'Fabrique' },
      { value: 'q42', label: 'Q42' },
      { value: 'gpnl', label: 'GP NL' },
    ];
    const clients: FilterSelectOption[] = [
      { value: 'acme', label: 'Acme Corp' },
      { value: 'globex', label: 'Globex' },
      { value: 'initech', label: 'Initech' },
    ];
    const sizes: FilterSelectOption[] = [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Mid-market' },
      { value: 'lg', label: 'Enterprise' },
    ];
    const industries: FilterSelectOption[] = [
      { value: 'fin', label: 'Financial services' },
      { value: 'retail', label: 'Retail' },
      { value: 'public', label: 'Public sector' },
      { value: 'tech', label: 'Technology' },
    ];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--eidra-space-2)' }}>
        <FilterSelect size="sm" aria-label="Region" placeholder="Region" noun="region" options={REGIONS} value={region} onValueChange={setRegion} />
        <FilterSelect size="sm" aria-label="Opco" placeholder="Opco" noun="opco" options={opcos} value={opco} onValueChange={setOpco} />
        <FilterSelect size="sm" aria-label="Client" placeholder="Client" noun="client" options={clients} value={client} onValueChange={setClient} />
        <FilterSelect size="sm" aria-label="Owner" placeholder="Owner" noun="owner" options={OWNERS} value={owner} onValueChange={setOwner} />
        <FilterSelect size="sm" aria-label="Size" placeholder="Size" noun="size" options={sizes} value={size} onValueChange={setSize} />
        <FilterSelect size="sm" aria-label="Industry" placeholder="Industry" noun="industry" options={industries} value={industry} onValueChange={setIndustry} />
      </div>
    );
  },
};

const clearCallbackSpy = fn();

/**
 * **Clear-all & the `onValueChange` callback.** The footer's Clear button is
 * disabled while nothing is selected and resets the selection to `[]` once it is.
 * Here `onValueChange` is a spy wrapping the host state so we can assert both the
 * UI and the emitted payload.
 */
export const ClearAndCallback: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['nordics', 'dach']);
    return (
      <FilterSelect
        aria-label="Region"
        placeholder="Region"
        noun="region"
        options={REGIONS}
        value={value}
        onValueChange={(next) => {
          clearCallbackSpy(next);
          setValue(next);
        }}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const handler = clearCallbackSpy;
    const trigger = canvas.getByRole('button', { name: /region/i });

    await step('opening shows the pre-selected count and an enabled Clear', async () => {
      await userEvent.click(trigger);
      await waitFor(async () => expect(await screen.findByText('2 selected')).toBeVisible());
      const clear = await screen.findByRole('button', { name: /clear/i });
      await expect(clear).toBeEnabled();
    });

    await step('toggling an option fires onValueChange with the new value array', async () => {
      handler.mockClear();
      await userEvent.click(await screen.findByRole('checkbox', { name: /Benelux/ }));
      await expect(handler).toHaveBeenCalledWith(['nordics', 'dach', 'benelux']);
    });

    await step('Clear resets the selection to an empty array and disables itself', async () => {
      handler.mockClear();
      await userEvent.click(await screen.findByRole('button', { name: /clear/i }));
      await expect(handler).toHaveBeenCalledWith([]);
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled(),
      );
      await waitFor(async () => expect(await screen.findByText('0 selected')).toBeVisible());
      // Trigger falls back to the placeholder once nothing is selected.
      await expect(trigger).toHaveTextContent(/Region/);
    });
  },
};

/**
 * **Keyboard.** The trigger opens on Enter, options toggle with Space, and the
 * type-ahead search box (auto-shown for long lists) narrows the list from the
 * keyboard. Escape closes the popover and returns focus to the trigger.
 */
export const KeyboardInteraction: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <FilterSelect
        aria-label="Account owner"
        placeholder="Owner"
        noun="owner"
        options={OWNERS}
        value={value}
        onValueChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /owner/i });

    await step('Enter on the focused trigger opens the popover', async () => {
      trigger.focus();
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const searchBox = await screen.findByRole('textbox', { name: /search/i });
      await waitFor(() => expect(searchBox).toBeVisible());
    });

    await step('type-ahead in the search box narrows the list', async () => {
      const search = await screen.findByRole('textbox', { name: /search/i });
      await userEvent.type(search, 'Persson');
      const match = await screen.findByRole('checkbox', { name: /Persson/ });
      await waitFor(() => expect(match).toBeVisible());
      await waitFor(() =>
        expect(screen.queryByRole('checkbox', { name: /Lindqvist/ })).toBeNull(),
      );
    });

    await step('Space toggles the focused option', async () => {
      const match = await screen.findByRole('checkbox', { name: /Persson/ });
      match.focus();
      await userEvent.keyboard(' ');
      await expect(match).toBeChecked();
    });

    await step('Escape closes the popover and restores focus to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  },
};
