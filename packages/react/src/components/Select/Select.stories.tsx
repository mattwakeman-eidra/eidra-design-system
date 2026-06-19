import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, screen, expect, waitFor, fn } from 'storybook/test';
import { Select } from './Select.js';

const meta = {
  title: 'Forms/Select',
  component: Select.Root,
  subcomponents: {
    'Select.Trigger': Select.Trigger,
    'Select.Value': Select.Value,
    'Select.Portal': Select.Portal,
    'Select.Backdrop': Select.Backdrop,
    'Select.Positioner': Select.Positioner,
    'Select.Popup': Select.Popup,
    'Select.List': Select.List,
    'Select.Item': Select.Item,
    'Select.ItemIndicator': Select.ItemIndicator,
    'Select.ItemText': Select.ItemText,
    'Select.Group': Select.Group,
    'Select.GroupLabel': Select.GroupLabel,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Args exposed by the Playground: real `Select.Root` knobs plus the `Select.Trigger` `size`. */
interface PlaygroundArgs {
  /** Disable the whole control (`Select.Root`). */
  disabled?: boolean;
  /** Uncontrolled initial selection (`Select.Root`). */
  defaultValue?: string;
  /** Trigger control size (`Select.Trigger`). */
  size?: 'sm' | 'md' | 'lg';
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    disabled: false,
    defaultValue: undefined,
    size: 'md',
  },
  argTypes: {
    disabled: { control: 'boolean', description: 'Disable the whole control (Select.Root).' },
    // Dropped `multiple`: toggling it shows nothing until the listbox is opened and
    // options are clicked. The dedicated "Multiple Selection" story demonstrates it.
    defaultValue: {
      control: 'select',
      // `undefined` as a select option breaks the controls panel — start unselected by
      // leaving the arg undefined; these are the selectable cities.
      options: ['oslo', 'bergen', 'trondheim', 'stavanger'],
      description: 'Uncontrolled initial selection (Select.Root).',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Trigger control size (Select.Trigger).',
    },
  },
  render: ({ disabled, defaultValue, size }) => (
    <div style={{ width: 240 }}>
      <Select.Root disabled={disabled} defaultValue={defaultValue}>
        <Select.Trigger aria-label="City" size={size} />
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

// ─── Behaviour ──────────────────────────────────────────────────────────────────

/**
 * **Behaviour.** Interaction coverage relocated from the Playground so the controls
 * panel can drive the Playground without a `play` re-running on every change. Fixed
 * args (no controls) keep this deterministic.
 */
export const Behaviour: Story = {
  name: 'Select behaviour',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root>
        <Select.Trigger aria-label="City" />
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /city/i });

    await step('clicking the trigger opens the listbox', async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(trigger);
      await screen.findByRole('listbox');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    await step('clicking an option selects it and closes the listbox', async () => {
      const option = await screen.findByRole('option', { name: /trondheim/i });
      await userEvent.click(option);
      await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
      await expect(trigger).toHaveTextContent(/trondheim/i);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Escape closes the listbox without changing the value', async () => {
      await userEvent.click(trigger);
      await screen.findByRole('listbox');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
      await expect(trigger).toHaveTextContent(/trondheim/i);
    });
  },
};

// ─── WithDefaultValue ─────────────────────────────────────────────────────────

export const WithDefaultValue: Story = {
  name: 'With Default Value',
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root defaultValue="bergen">
        <Select.Trigger aria-label="City" />
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /city/i });

    await step('the default value renders in the trigger', async () => {
      await expect(trigger).toHaveTextContent(/bergen/i);
    });

    await step('the matching option is marked selected when opened', async () => {
      await userEvent.click(trigger);
      const selected = await screen.findByRole('option', { name: /bergen/i });
      await expect(selected).toHaveAttribute('aria-selected', 'true');
      const other = screen.getByRole('option', { name: /oslo/i });
      await expect(other).toHaveAttribute('aria-selected', 'false');
      await userEvent.keyboard('{Escape}');
    });
  },
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
        <Select.Trigger aria-label="Role" />
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /role/i });

    await step('a disabled option is marked aria-disabled', async () => {
      await userEvent.click(trigger);
      const lead = await screen.findByRole('option', { name: /lead consultant/i });
      await expect(lead).toHaveAttribute('aria-disabled', 'true');
    });

    await step('clicking a disabled option does not select it or close', async () => {
      const lead = screen.getByRole('option', { name: /lead consultant/i });
      await userEvent.click(lead);
      await expect(screen.getByRole('listbox')).toBeInTheDocument();
      await expect(trigger).not.toHaveTextContent(/lead consultant/i);
      await userEvent.keyboard('{Escape}');
    });
  },
};

// ─── DisabledTrigger ──────────────────────────────────────────────────────────

export const DisabledTrigger: Story = {
  name: 'Disabled',
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root disabled>
        <Select.Trigger aria-label="City" />
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /city/i });
    await expect(trigger).toBeDisabled();
    // Clicking a disabled trigger must not open the listbox.
    await userEvent.click(trigger);
    await expect(screen.queryByRole('listbox')).toBeNull();
  },
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

// ─── KeyboardNavigation ─────────────────────────────────────────────────────────

/**
 * **Keyboard.** Open with Enter, move the highlight with Arrow/Home/End, jump with
 * type-ahead, then commit with Enter. All driven from the trigger via the keyboard.
 */
export const KeyboardNavigation: Story = {
  name: 'Keyboard Navigation',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root>
        <Select.Trigger aria-label="City" />
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /city/i });

    await step('Enter on the focused trigger opens the listbox', async () => {
      trigger.focus();
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('listbox');
    });

    await step('End highlights the last option, Home the first', async () => {
      await userEvent.keyboard('{End}');
      await waitFor(() =>
        expect(screen.getByRole('option', { name: /stavanger/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
      await userEvent.keyboard('{Home}');
      await waitFor(() =>
        expect(screen.getByRole('option', { name: /oslo/i })).toHaveAttribute('data-highlighted'),
      );
    });

    await step('ArrowDown moves the highlight to the next option', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(screen.getByRole('option', { name: /bergen/i })).toHaveAttribute('data-highlighted'),
      );
    });

    await step('type-ahead jumps to the matching option', async () => {
      await userEvent.keyboard('t');
      await waitFor(() =>
        expect(screen.getByRole('option', { name: /trondheim/i })).toHaveAttribute(
          'data-highlighted',
        ),
      );
    });

    await step('Enter commits the highlighted option and closes', async () => {
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
      await expect(trigger).toHaveTextContent(/trondheim/i);
    });
  },
};

// ─── UncontrolledCallback ───────────────────────────────────────────────────────

/** Uncontrolled value with an `onValueChange` spy — fires with the new value. */
const uncontrolledOnValueChange = fn();
const uncontrolledOnOpenChange = fn();

export const UncontrolledCallback: Story = {
  name: 'Uncontrolled (onValueChange)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root
        onValueChange={uncontrolledOnValueChange}
        onOpenChange={uncontrolledOnOpenChange}
      >
        <Select.Trigger aria-label="City" />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
                <Select.Item value="trondheim">Trondheim</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    uncontrolledOnValueChange.mockClear();
    uncontrolledOnOpenChange.mockClear();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /city/i });

    await step('opening the trigger fires onOpenChange(true)', async () => {
      await userEvent.click(trigger);
      await screen.findByRole('listbox');
      await expect(uncontrolledOnOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });

    await step('selecting an option fires onValueChange with the value', async () => {
      await userEvent.click(await screen.findByRole('option', { name: /bergen/i }));
      await expect(uncontrolledOnValueChange).toHaveBeenCalledWith('bergen', expect.anything());
    });

    await step('committing also fires onOpenChange(false)', async () => {
      await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
      await expect(uncontrolledOnOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });
  },
};

// ─── ControlledValue ────────────────────────────────────────────────────────────

/**
 * **Controlled.** The host owns `value`; the Select reports changes via
 * `onValueChange`. The trigger reflects only what the host renders back.
 */
export const ControlledValue: Story = {
  name: 'Controlled (value)',
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState<string>('oslo');
    return (
      <div style={{ display: 'grid', gap: 'var(--eidra-space-3)', width: 240 }}>
        <p style={{ margin: 0, font: 'inherit', color: 'var(--eidra-fg-muted)' }}>
          Value: <strong style={{ color: 'var(--eidra-fg)' }}>{value}</strong>
        </p>
        <Select.Root value={value} onValueChange={(v) => setValue(v as string)}>
          <Select.Trigger aria-label="City" />
          <Select.Portal>
            <Select.Positioner sideOffset={8}>
              <Select.Popup>
                <Select.List>
                  <Select.Item value="oslo">Oslo</Select.Item>
                  <Select.Item value="bergen">Bergen</Select.Item>
                  <Select.Item value="trondheim">Trondheim</Select.Item>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /city/i });

    await step('the controlled value renders in the trigger', async () => {
      await expect(trigger).toHaveTextContent(/oslo/i);
    });

    await step('selecting updates the host-owned value', async () => {
      await userEvent.click(trigger);
      await userEvent.click(await screen.findByRole('option', { name: /trondheim/i }));
      await waitFor(() => expect(trigger).toHaveTextContent(/trondheim/i));
      // The value appears twice: in the <strong> status line and the trigger's
      // value span — assert at least one occurrence rather than a unique match.
      await expect(canvas.getAllByText('trondheim').length).toBeGreaterThanOrEqual(1);
    });
  },
};

// ─── MultipleSelection ──────────────────────────────────────────────────────────

/**
 * **Multiple.** With `multiple`, the listbox stays open as options toggle and the
 * value is an array. Selected options stay marked `aria-selected`.
 */
const multipleOnValueChange = fn();

export const MultipleSelection: Story = {
  name: 'Multiple Selection',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 240 }}>
      <Select.Root multiple onValueChange={multipleOnValueChange}>
        <Select.Trigger aria-label="Cities" />
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="oslo">Oslo</Select.Item>
                <Select.Item value="bergen">Bergen</Select.Item>
                <Select.Item value="trondheim">Trondheim</Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    multipleOnValueChange.mockClear();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /cities/i });

    await step('selecting two options keeps the listbox open', async () => {
      await userEvent.click(trigger);
      const oslo = await screen.findByRole('option', { name: /oslo/i });
      const bergen = await screen.findByRole('option', { name: /bergen/i });
      await userEvent.click(oslo);
      await expect(screen.getByRole('listbox')).toBeInTheDocument();
      await userEvent.click(bergen);
      await expect(oslo).toHaveAttribute('aria-selected', 'true');
      await expect(bergen).toHaveAttribute('aria-selected', 'true');
    });

    await step('onValueChange receives an array of values', async () => {
      await expect(multipleOnValueChange).toHaveBeenCalledWith(
        expect.arrayContaining(['oslo', 'bergen']),
        expect.anything(),
      );
    });

    await step('toggling a selected option deselects it', async () => {
      const oslo = screen.getByRole('option', { name: /oslo/i });
      await userEvent.click(oslo);
      await expect(oslo).toHaveAttribute('aria-selected', 'false');
      await userEvent.keyboard('{Escape}');
    });
  },
};
