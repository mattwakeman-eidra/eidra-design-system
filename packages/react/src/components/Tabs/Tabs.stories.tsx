import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart2, FileText, Settings, Users } from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Tabs } from './Tabs.js';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: () => (
    <Tabs.Root defaultValue={0}>
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
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<number>(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eidra-space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--eidra-space-2)' }}>
          <span style={{ fontSize: 'var(--eidra-font-size-sm)', color: 'var(--eidra-fg-muted)' }}>
            Active tab: <strong>{value}</strong>
          </span>
        </div>
        <Tabs.Root value={value} onValueChange={(v) => setValue(v as number)}>
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
};
