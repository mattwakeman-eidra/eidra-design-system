// Drop into a consumer at: apps/web/src/app/design/page.tsx  → visit /design
'use client';

import { Typography, Button, Badge, Alert, Card, Separator, Tabs } from '@eidra/react';
import { ArrowRight, Plus } from '@eidra/icons';
import { Icon } from '@eidra/icons';

export default function DesignShowcase() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gap: 'var(--eidra-space-8)' }}>
      <header style={{ display: 'grid', gap: 'var(--eidra-space-2)' }}>
        <Typography variant="display-md">Eidra UI</Typography>
        <Typography variant="body-lg" tone="muted">
          The shared component language for Eidra web apps.
        </Typography>
      </header>

      <Card padding="lg">
        <Card.Header>
          <Typography variant="heading-3">Buttons</Typography>
        </Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--eidra-space-3)' }}>
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button tone="coral">Coral</Button>
            <Button tone="danger" variant="subtle">
              Danger
            </Button>
            <Button startIcon={<Icon icon={Plus} />}>Create</Button>
            <Button endIcon={<Icon icon={ArrowRight} />}>Continue</Button>
            <Button loading>Saving…</Button>
          </div>
        </Card.Body>
      </Card>

      <Card padding="lg">
        <Card.Header>
          <Typography variant="heading-3">Badges & feedback</Typography>
        </Card.Header>
        <Card.Body style={{ display: 'grid', gap: 'var(--eidra-space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--eidra-space-2)', flexWrap: 'wrap' }}>
            <Badge tone="accent">Active</Badge>
            <Badge tone="success" variant="subtle">
              Synced
            </Badge>
            <Badge tone="warning" variant="subtle">
              Pending
            </Badge>
            <Badge tone="danger" variant="outline">
              Failed
            </Badge>
          </div>
          <Separator />
          <Alert tone="info" title="Heads up">
            Connect a data source to start syncing.
          </Alert>
          <Alert tone="success" title="All set" dismissible>
            Your changes were saved.
          </Alert>
        </Card.Body>
      </Card>

      <Card padding="lg">
        <Card.Header>
          <Typography variant="heading-3">Tabs</Typography>
        </Card.Header>
        <Card.Body>
          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="activity">Activity</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel value="overview" style={{ paddingTop: 'var(--eidra-space-4)' }}>
              <Typography>Overview content.</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="activity" style={{ paddingTop: 'var(--eidra-space-4)' }}>
              <Typography>Recent activity.</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="settings" style={{ paddingTop: 'var(--eidra-space-4)' }}>
              <Typography>Settings.</Typography>
            </Tabs.Panel>
          </Tabs.Root>
        </Card.Body>
      </Card>
    </main>
  );
}
