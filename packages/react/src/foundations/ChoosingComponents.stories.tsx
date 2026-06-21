import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * **Choosing between similar components.** Several components sit in adjacent
 * space — a row of figures, a popped-up panel, a loading state. They are *not*
 * duplicates: each has a distinct intent. This page is the tie-breaker when two
 * feel interchangeable. Pick by what you're expressing, not by what looks closest.
 */
const meta = {
  title: 'Foundations/Choosing Components',
  parameters: { layout: 'padded', controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface Choice {
  /** The component to reach for. */
  use: string;
  /** When it's the right call. */
  when: ReactNode;
}
interface Cluster {
  title: string;
  /** The shared space these components occupy (why they get confused). */
  space: string;
  choices: Choice[];
}

const CLUSTERS: Cluster[] = [
  {
    title: 'Metrics & figures',
    space: 'Showing numbers / KPIs',
    choices: [
      {
        use: 'Statistic',
        when: 'One headline metric, optionally with a delta, progress bar, or accent left-border.',
      },
      {
        use: 'StatisticBar',
        when: 'A horizontal strip of several figures separated by dividers — a compact KPI header.',
      },
      {
        use: 'StatusStrip',
        when: 'A "heat row" — equal-width cells each tinted by a RAG status (e.g. monthly momentum).',
      },
      {
        use: 'SegmentBar',
        when: 'A single bar split into proportional, tinted segments (a composition of a whole).',
      },
      {
        use: 'Meter / Progress',
        when: 'A scalar value within a range (Meter) vs. task completion incl. indeterminate (Progress).',
      },
    ],
  },
  {
    title: 'Selection controls',
    space: 'Choosing from options',
    choices: [
      {
        use: 'ToggleGroup',
        when: 'A cluster of buttons — single- or multi-select. Use appearance="segmented" for a filled view-switcher (formerly SegmentedControl).',
      },
      { use: 'RadioGroup', when: 'A single choice in a form (semantic radios + labels).' },
      { use: 'CheckboxGroup', when: 'Multiple choices in a form (agreements, preferences).' },
      { use: 'Switch', when: 'A single system on/off toggle (settings, feature flags).' },
      { use: 'Checkbox', when: 'A binary selection/agreement — supports an indeterminate state.' },
    ],
  },
  {
    title: 'Pickers & menus',
    space: 'Picking from a list / acting',
    choices: [
      { use: 'Select', when: 'Pick one from a fixed, non-searchable list.' },
      { use: 'Combobox', when: 'Searchable multi-select with inline chips (tags, team members).' },
      { use: 'Autocomplete', when: 'Single-select with type-ahead suggestion / completion.' },
      {
        use: 'FilterSelect',
        when: 'A compact filter pill summarising a multi-select (dashboards, tables).',
      },
      {
        use: 'Menu / ContextMenu',
        when: 'A list of actions — button-triggered (Menu) vs. right-click (ContextMenu).',
      },
    ],
  },
  {
    title: 'Overlays & disclosure',
    space: 'Revealing more content',
    choices: [
      {
        use: 'Dialog',
        when: 'Content, forms or detail panels — dismisses on outside-click and Esc.',
      },
      {
        use: 'AlertDialog',
        when: 'Destructive/critical confirmations — the backdrop does NOT dismiss (role="alertdialog"), so a stray click can’t lose the choice; Esc still closes.',
      },
      {
        use: 'Popover',
        when: 'A click-triggered panel with rich content + actions (role="dialog").',
      },
      { use: 'Tooltip', when: 'Hover/focus microcopy — text only (role="tooltip").' },
      { use: 'PreviewCard', when: 'A hover-triggered rich preview of a linked resource.' },
      {
        use: 'Accordion / Collapsible',
        when: 'Multi-section disclosure with headings (Accordion) vs. a single collapsible region.',
      },
    ],
  },
  {
    title: 'Feedback & status',
    space: 'Telling the user something',
    choices: [
      { use: 'Alert', when: 'Persistent inline callout at the point of action.' },
      {
        use: 'Toast',
        when: 'Transient, stacked notification that auto-dismisses (async results).',
      },
      { use: 'Badge', when: 'A static category/status label.' },
      {
        use: 'Freshness',
        when: 'A temporal/data-age signal — dot + relative time, optional pulse.',
      },
      {
        use: 'SaveIndicator',
        when: 'An inline, field-level "saved" tick (e.g. DataGrid cell edits).',
      },
      {
        use: 'Spinner / Skeleton',
        when: 'Indeterminate progress (Spinner) vs. layout-shaped placeholder that prevents shift (Skeleton).',
      },
    ],
  },
  {
    title: 'Bars & navigation',
    space: 'Page chrome',
    choices: [
      { use: 'Tabs', when: 'Switch between sections of the same page.' },
      { use: 'NavigationMenu', when: 'Site-wide hierarchical navigation with rich flyouts.' },
      { use: 'Menubar', when: 'App-style File / Edit / View menus.' },
      { use: 'Toolbar', when: 'Inline editor/formatting control grouping.' },
      { use: 'ActionBar', when: 'A selection-aware bulk-action bar (optionally sticky).' },
      {
        use: 'PageHeader',
        when: 'A page title + subtitle + actions (with an optional Breadcrumbs slot).',
      },
    ],
  },
];

function ClusterTable({ cluster }: { cluster: Cluster }) {
  return (
    <section style={{ marginBottom: 'var(--eidra-space-6)' }}>
      <h3
        style={{
          font: '600 var(--eidra-font-size-md)/1.2 var(--eidra-font-family-sans)',
          color: 'var(--eidra-fg)',
          margin: '0 0 var(--eidra-space-1)',
        }}
      >
        {cluster.title}
      </h3>
      <p
        style={{
          font: '400 var(--eidra-font-size-sm)/1.4 var(--eidra-font-family-sans)',
          color: 'var(--eidra-fg-muted)',
          margin: '0 0 var(--eidra-space-3)',
        }}
      >
        Shared space: {cluster.space}
      </p>
      <table
        style={{
          width: '100%',
          maxWidth: 760,
          borderCollapse: 'collapse',
          fontFamily: 'var(--eidra-font-family-sans)',
          fontSize: 'var(--eidra-font-size-sm)',
        }}
      >
        <tbody>
          {cluster.choices.map((c) => (
            <tr key={c.use} style={{ borderTop: '1px solid var(--eidra-border)' }}>
              <td
                style={{
                  padding: 'var(--eidra-space-2) var(--eidra-space-3) var(--eidra-space-2) 0',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'top',
                  fontWeight: 'var(--eidra-font-weight-semibold)',
                  color: 'var(--eidra-fg)',
                  fontFamily: 'var(--eidra-font-family-mono)',
                }}
              >
                {c.use}
              </td>
              <td
                style={{
                  padding: 'var(--eidra-space-2) 0',
                  verticalAlign: 'top',
                  color: 'var(--eidra-fg)',
                }}
              >
                {c.when}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * The full decision guide. When two components feel interchangeable, find the
 * cluster and pick by intent. (Maintained alongside `docs/COMPONENT-OVERLAP-AUDIT.md`.)
 */
export const Guide: Story = {
  render: () => (
    <div style={{ maxWidth: 820 }}>
      <p
        style={{
          font: '400 var(--eidra-font-size-base)/1.5 var(--eidra-font-family-sans)',
          color: 'var(--eidra-fg-muted)',
          margin: '0 0 var(--eidra-space-6)',
        }}
      >
        These components sit in adjacent space and are easy to confuse — but each has a distinct
        intent. Pick by what you're expressing, not by what looks closest.
      </p>
      {CLUSTERS.map((cluster) => (
        <ClusterTable key={cluster.title} cluster={cluster} />
      ))}
    </div>
  ),
};
