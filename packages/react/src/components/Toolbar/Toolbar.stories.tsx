import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Search,
  Strikethrough,
} from '@eidra/icons';
import { Icon } from '@eidra/icons';
import { Toolbar } from './Toolbar.js';

const meta = {
  title: 'Navigation/Toolbar',
  component: Toolbar.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Toolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: () => (
    <Toolbar.Root aria-label="Text formatting">
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Link href="#">
        <Icon icon={Link2} size="sm" />
        Docs
      </Toolbar.Link>
    </Toolbar.Root>
  ),
};

// ─── WithLabels ──────────────────────────────────────────────────────────────

export const WithLabels: Story = {
  render: () => (
    <Toolbar.Root aria-label="Document actions">
      <Toolbar.Button>
        <Icon icon={Bold} size="sm" />
        Bold
      </Toolbar.Button>
      <Toolbar.Button>
        <Icon icon={Italic} size="sm" />
        Italic
      </Toolbar.Button>
      <Toolbar.Button>
        <Icon icon={Strikethrough} size="sm" />
        Strike
      </Toolbar.Button>
    </Toolbar.Root>
  ),
};

// ─── WithGroups ──────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => (
    <Toolbar.Root aria-label="Text editor toolbar">
      <Toolbar.Group aria-label="Text style">
        <Toolbar.Button aria-label="Bold">
          <Icon icon={Bold} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Italic">
          <Icon icon={Italic} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Underline">
          <Icon icon={Underline} size="sm" />
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group aria-label="Alignment">
        <Toolbar.Button aria-label="Align left">
          <Icon icon={AlignLeft} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Align center">
          <Icon icon={AlignCenter} size="sm" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Align right">
          <Icon icon={AlignRight} size="sm" />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  ),
};

// ─── WithInput ───────────────────────────────────────────────────────────────

export const WithInput: Story = {
  render: () => (
    <Toolbar.Root aria-label="Search toolbar">
      <Toolbar.Button aria-label="Search">
        <Icon icon={Search} size="sm" />
      </Toolbar.Button>
      <Toolbar.Input
        placeholder="Search engagements…"
        style={{ width: 220 }}
        aria-label="Search"
      />
      <Toolbar.Separator />
      <Toolbar.Button>All</Toolbar.Button>
      <Toolbar.Button>Active</Toolbar.Button>
      <Toolbar.Button>Archived</Toolbar.Button>
    </Toolbar.Root>
  ),
};

// ─── WithDisabled ────────────────────────────────────────────────────────────

export const WithDisabled: Story = {
  render: () => (
    <Toolbar.Root aria-label="Text formatting with disabled items">
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic" disabled>
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Strikethrough" disabled>
        <Icon icon={Strikethrough} size="sm" />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
};

// ─── Vertical ────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <Toolbar.Root orientation="vertical" aria-label="Page actions" style={{ width: 48 }}>
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Align left">
        <Icon icon={AlignLeft} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align center">
        <Icon icon={AlignCenter} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Align right">
        <Icon icon={AlignRight} size="sm" />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
};

// ─── DisabledAll ─────────────────────────────────────────────────────────────

export const DisabledAll: Story = {
  render: () => (
    <Toolbar.Root disabled aria-label="Disabled toolbar">
      <Toolbar.Button aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
};
