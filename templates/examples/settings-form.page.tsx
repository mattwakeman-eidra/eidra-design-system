// Drop into a consumer at: apps/web/src/app/design/settings/page.tsx  → visit /design/settings
'use client'

import { useState } from 'react'
import { Typography, Card, Field, Input, Switch, Button, Separator } from '@eidra/react'

export default function SettingsForm() {
  const [notify, setNotify] = useState(true)

  return (
    <main style={{ maxWidth: 560, margin: '0 auto' }}>
      <Card padding="lg">
        <Card.Header style={{ display: 'grid', gap: 'var(--eidra-space-1)' }}>
          <Typography variant="heading-2">Workspace settings</Typography>
          <Typography variant="body-sm" tone="muted">
            Manage how your workspace behaves.
          </Typography>
        </Card.Header>
        <Card.Body style={{ display: 'grid', gap: 'var(--eidra-space-5)' }}>
          <Field label="Workspace name" hint="Shown to everyone in the workspace.">
            <Input defaultValue="Eidra" />
          </Field>
          <Field label="Billing email" error="Enter a valid email address.">
            <Input type="email" defaultValue="not-an-email" />
          </Field>
          <Separator />
          <Switch.Root checked={notify} onCheckedChange={setNotify} label="Email me about sync failures">
            <Switch.Thumb />
          </Switch.Root>
        </Card.Body>
        <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--eidra-space-3)' }}>
          <Button variant="ghost" tone="neutral">
            Cancel
          </Button>
          <Button>Save changes</Button>
        </Card.Footer>
      </Card>
    </main>
  )
}
