import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart2, FileText, Settings, Users } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
import { Tabs } from './Tabs.js';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs.Root,
  subcomponents: {
    'Tabs.List': Tabs.List,
    'Tabs.Tab': Tabs.Tab,
    'Tabs.Indicator': Tabs.Indicator,
    'Tabs.Panel': Tabs.Panel,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ──────────────────────────────────────────────────────────────

/**
 * Args exposed by the Playground: real `Tabs.Root` knobs.
 *
 * `activateOnFocus` and `loopFocus` dropped as controls — both are keyboard-navigation
 * behaviours with no visible effect in the rendered story (covered by the
 * KeyboardNavigation / ManualActivation stories instead).
 */
interface PlaygroundArgs {
  /** Layout flow direction (`Tabs.Root`). */
  orientation?: 'horizontal' | 'vertical';
  /** Uncontrolled initial active tab (`Tabs.Root`). */
  defaultValue?: number;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    orientation: 'horizontal',
    defaultValue: 0,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout flow direction (Tabs.Root).',
    },
    defaultValue: {
      control: 'inline-radio',
      options: [0, 1, 2],
      description: 'Uncontrolled initial active tab (Tabs.Root).',
    },
  },
  render: ({ orientation, defaultValue }) => (
    <Tabs.Root defaultValue={defaultValue} orientation={orientation}>
      <Tabs.List>
        <Tabs.Tab value={0}>Overview</Tabs.Tab>
        <Tabs.Tab value={1}>Details</Tabs.Tab>
        <Tabs.Tab value={2}>History</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value={0}>
        An overview of the selected engagement or project will appear here.
      </Tabs.Panel>
      <Tabs.Panel value={1}>
        Detailed information about deliverables, milestones, and contacts.
      </Tabs.Panel>
      <Tabs.Panel value={2}>
        A log of all changes and activity related to this engagement.
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

// ─── Behaviour ───────────────────────────────────────────────────────────────

/**
 * **Behaviour.** Interaction coverage relocated from the Playground so the controls
 * panel can drive the Playground without a `play` re-running on every change. Fixed
 * args (no controls) keep this deterministic.
 */
export const Behaviour: Story = {
  name: 'Tabs behaviour',
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs.Root defaultValue={0} orientation="horizontal">
      <Tabs.List>
        <Tabs.Tab value={0}>Overview</Tabs.Tab>
        <Tabs.Tab value={1}>Details</Tabs.Tab>
        <Tabs.Tab value={2}>History</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value={0}>
        An overview of the selected engagement or project will appear here.
      </Tabs.Panel>
      <Tabs.Panel value={1}>
        Detailed information about deliverables, milestones, and contacts.
      </Tabs.Panel>
      <Tabs.Panel value={2}>
        A log of all changes and activity related to this engagement.
      </Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: /Overview/ });
    const details = canvas.getByRole('tab', { name: /Details/ });
    const history = canvas.getByRole('tab', { name: /History/ });

    await step('the default tab is selected and its panel is shown', async () => {
      await expect(overview).toHaveAttribute('aria-selected', 'true');
      await expect(details).toHaveAttribute('aria-selected', 'false');
      await expect(canvas.getByText(/An overview of the selected/)).toBeVisible();
    });

    await step('clicking a tab selects it and swaps the visible panel', async () => {
      await userEvent.click(details);
      await expect(details).toHaveAttribute('aria-selected', 'true');
      await expect(overview).toHaveAttribute('aria-selected', 'false');
      await expect(canvas.getByText(/Detailed information about deliverables/)).toBeVisible();
      // The inactive panel may stay mounted briefly during its exit transition; Base UI
      // marks it inert + hidden rather than removing it immediately, so assert it is
      // hidden from users instead of asserting its absence.
      const overviewPanelId = overview.getAttribute('aria-controls');
      // Base UI ids contain colons (e.g. ":r1:") which are invalid in CSS selectors,
      // so resolve by id with getElementById rather than querySelector.
      const overviewPanel = overviewPanelId
        ? canvasElement.ownerDocument.getElementById(overviewPanelId)
        : null;
      if (overviewPanel) {
        await expect(overviewPanel).toHaveAttribute('inert');
      } else {
        // Already fully unmounted — also an acceptable end state.
        await expect(canvas.queryByText(/An overview of the selected/)).toBeNull();
      }
    });

    await step('selecting another tab leaves only one tab selected', async () => {
      await userEvent.click(history);
      await expect(history).toHaveAttribute('aria-selected', 'true');
      await expect(details).toHaveAttribute('aria-selected', 'false');
      await expect(overview).toHaveAttribute('aria-selected', 'false');
    });
  },
};

// ─── KeyboardNavigation ────────────────────────────────────────────────────────

/**
 * Arrow keys move focus between tabs and Home/End jump to the first/last tab. Base UI's
 * `Tabs.List` defaults to `activateOnFocus={false}`, so arrowing only moves focus — the
 * focused tab is activated with Enter or Space. Tabs use a roving tabindex, so only the
 * active tab is in the page tab sequence.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <Tabs.Root defaultValue={0}>
      <Tabs.List>
        <Tabs.Tab value={0}>Overview</Tabs.Tab>
        <Tabs.Tab value={1}>Details</Tabs.Tab>
        <Tabs.Tab value={2}>History</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value={0}>Overview content.</Tabs.Panel>
      <Tabs.Panel value={1}>Details content.</Tabs.Panel>
      <Tabs.Panel value={2}>History content.</Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: /Overview/ });
    const details = canvas.getByRole('tab', { name: /Details/ });
    const history = canvas.getByRole('tab', { name: /History/ });

    await step('ArrowRight moves focus to the next tab; Enter activates it', async () => {
      overview.focus();
      await expect(overview).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(details).toHaveFocus();
      // Manual activation: focus moved but selection has not changed yet.
      await expect(details).toHaveAttribute('aria-selected', 'false');
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(details).toHaveAttribute('aria-selected', 'true'));
    });

    await step('ArrowLeft moves focus back; Space activates the previous tab', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await expect(overview).toHaveFocus();
      await userEvent.keyboard(' ');
      await waitFor(() => expect(overview).toHaveAttribute('aria-selected', 'true'));
    });

    await step('End jumps to the last tab, Home back to the first (Enter activates)', async () => {
      await userEvent.keyboard('{End}');
      await expect(history).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(history).toHaveAttribute('aria-selected', 'true'));
      await userEvent.keyboard('{Home}');
      await expect(overview).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(overview).toHaveAttribute('aria-selected', 'true'));
    });
  },
};

// ─── ManualActivation ──────────────────────────────────────────────────────────

/**
 * With `activateOnFocus={false}`, arrow keys only move focus; the tab is activated
 * with Enter or Space. Useful when switching panels is expensive.
 */
export const ManualActivation: Story = {
  render: () => (
    <Tabs.Root defaultValue={0}>
      <Tabs.List activateOnFocus={false}>
        <Tabs.Tab value={0}>Overview</Tabs.Tab>
        <Tabs.Tab value={1}>Details</Tabs.Tab>
        <Tabs.Tab value={2}>History</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value={0}>Overview content.</Tabs.Panel>
      <Tabs.Panel value={1}>Details content.</Tabs.Panel>
      <Tabs.Panel value={2}>History content.</Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: /Overview/ });
    const details = canvas.getByRole('tab', { name: /Details/ });
    const history = canvas.getByRole('tab', { name: /History/ });

    await step('ArrowRight moves focus but does not change selection', async () => {
      overview.focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(details).toHaveFocus();
      await expect(details).toHaveAttribute('aria-selected', 'false');
      await expect(overview).toHaveAttribute('aria-selected', 'true');
    });

    await step('Enter activates the focused tab', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(details).toHaveAttribute('aria-selected', 'true');
      await expect(overview).toHaveAttribute('aria-selected', 'false');
    });

    await step('Space activates a newly focused tab', async () => {
      // ArrowLeft from the first tab wraps to the last tab (History) in the
      // roving order; manual activation means focus moves but selection does not.
      overview.focus();
      await userEvent.keyboard('{ArrowLeft}');
      await expect(history).toHaveFocus();
      await userEvent.keyboard(' ');
      await expect(history).toHaveAttribute('aria-selected', 'true');
    });
  },
};

// ─── WithIcons ────────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => (
    <Tabs.Root defaultValue="summary">
      <Tabs.List>
        <Tabs.Tab value="summary">
          <Icon icon={FileText} size="sm" />
          Summary
        </Tabs.Tab>
        <Tabs.Tab value="team">
          <Icon icon={Users} size="sm" />
          Team
        </Tabs.Tab>
        <Tabs.Tab value="analytics">
          <Icon icon={BarChart2} size="sm" />
          Analytics
        </Tabs.Tab>
        <Tabs.Tab value="settings">
          <Icon icon={Settings} size="sm" />
          Settings
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="summary">
        Project summary and key metrics for the Nordic Digital Transformation engagement.
      </Tabs.Panel>
      <Tabs.Panel value="team">
        Manage consultants, client contacts, and external partners.
      </Tabs.Panel>
      <Tabs.Panel value="analytics">
        Utilisation rates, burn rate, and delivery velocity dashboards.
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        Configure project notifications, access levels, and integrations.
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <Tabs.Root defaultValue={0} orientation="vertical" style={{ minHeight: 240 }}>
      <Tabs.List>
        <Tabs.Tab value={0}>Proposal</Tabs.Tab>
        <Tabs.Tab value={1}>Contract</Tabs.Tab>
        <Tabs.Tab value={2}>Invoices</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value={0}>
        Manage and review your submitted proposals here.
      </Tabs.Panel>
      <Tabs.Panel value={1}>
        Signed contracts and amendments for this client.
      </Tabs.Panel>
      <Tabs.Panel value={2}>
        All invoices issued and their current payment status.
      </Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const proposal = canvas.getByRole('tab', { name: /Proposal/ });
    const contract = canvas.getByRole('tab', { name: /Contract/ });

    await step('the list reports a vertical orientation', async () => {
      await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    });

    await step('ArrowDown moves focus to the next tab; Enter activates it', async () => {
      proposal.focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(contract).toHaveFocus();
      // Manual activation (activateOnFocus defaults to false): focus moved, selection has not.
      await expect(contract).toHaveAttribute('aria-selected', 'false');
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(contract).toHaveAttribute('aria-selected', 'true'));
    });

    await step('ArrowUp moves focus back; Enter activates the previous tab', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(proposal).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(proposal).toHaveAttribute('aria-selected', 'true'));
    });
  },
};

// ─── WithDisabledTab ─────────────────────────────────────────────────────────

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs.Root defaultValue={0}>
      <Tabs.List>
        <Tabs.Tab value={0}>Active</Tabs.Tab>
        <Tabs.Tab value={1}>In Review</Tabs.Tab>
        <Tabs.Tab value={2} disabled>
          Archived
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value={0}>
        Active engagements are listed here. Click a project to see full details.
      </Tabs.Panel>
      <Tabs.Panel value={1}>
        Proposals and deliverables currently under client review.
      </Tabs.Panel>
      <Tabs.Panel value={2}>
        Archived content is not accessible in this workspace tier.
      </Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const active = canvas.getByRole('tab', { name: /Active/ });
    const inReview = canvas.getByRole('tab', { name: /In Review/ });
    const archived = canvas.getByRole('tab', { name: /Archived/ });

    await step('the disabled tab advertises its disabled state', async () => {
      await expect(archived).toHaveAttribute('aria-disabled', 'true');
    });

    await step('clicking the disabled tab does not select it', async () => {
      await userEvent.click(archived);
      await expect(archived).toHaveAttribute('aria-selected', 'false');
      await expect(active).toHaveAttribute('aria-selected', 'true');
    });

    await step('focus can reach the disabled tab but it never activates', async () => {
      active.focus();
      // Manual activation (activateOnFocus defaults to false): arrowing moves focus,
      // and Enter activates the focused enabled tab.
      await userEvent.keyboard('{ArrowRight}');
      await expect(inReview).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(inReview).toHaveAttribute('aria-selected', 'true');
      // The disabled tab stays focusable (Base UI focusableWhenDisabled), but landing
      // on it and pressing Enter does not change selection — it never becomes selected.
      await userEvent.keyboard('{ArrowRight}');
      await expect(archived).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(archived).toHaveAttribute('aria-selected', 'false');
      await expect(inReview).toHaveAttribute('aria-selected', 'true');
    });
  },
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  args: { onValueChange: fn() },
  render: function ControlledStory(args) {
    const [value, setValue] = React.useState<number>(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--eidra-space-2)' }}>
          <span style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)' }}>
            Active tab: <strong>{value}</strong>
          </span>
        </div>
        <Tabs.Root
          {...args}
          value={value}
          onValueChange={(v, event) => {
            setValue(v as number);
            args.onValueChange?.(v, event);
          }}
        >
          <Tabs.List>
            <Tabs.Tab value={0}>Clients</Tabs.Tab>
            <Tabs.Tab value={1}>Projects</Tabs.Tab>
            <Tabs.Tab value={2}>Reports</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value={0}>Client list and relationship management.</Tabs.Panel>
          <Tabs.Panel value={1}>All active and archived projects.</Tabs.Panel>
          <Tabs.Panel value={2}>Quarterly and annual reporting dashboards.</Tabs.Panel>
        </Tabs.Root>
      </div>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const projects = canvas.getByRole('tab', { name: /Projects/ });

    await step('clicking a tab fires onValueChange with the new value', async () => {
      await userEvent.click(projects);
      await expect(args.onValueChange).toHaveBeenCalled();
      await expect(args.onValueChange).toHaveBeenLastCalledWith(1, expect.anything());
    });

    await step('the host-owned value drives selection and the readout', async () => {
      await expect(projects).toHaveAttribute('aria-selected', 'true');
      await expect(canvas.getByText('1')).toBeVisible();
      await expect(canvas.getByText(/All active and archived projects/)).toBeVisible();
    });
  },
};
