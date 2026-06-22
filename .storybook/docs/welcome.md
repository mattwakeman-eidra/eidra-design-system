# A branded, accessible component library

Eidra components wrap **Base UI** headless primitives — so behaviour and accessibility come for free — and dress them in Eidra's brand through design tokens. Everything you see here is themeable: try the **Theme** and **Density** toggles in the toolbar above to recolour and resize every story live.

## Navigating the sidebar

The catalog is organised into three tiers. Read it top to bottom.

| Tier                       | What it is                                                                                                             | Examples                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Foundations**            | System-level rules with no single component — design tokens and cross-cutting guidance.                                | Colors, Typography, Theming, Density, Choosing Components            |
| **‹Function›/‹Component›** | One page per component, grouped by what the component is for. Its stories are that component's own variants and props. | Actions, Forms, Navigation, Overlays, Layout, Data Display, Feedback |
| **Patterns**               | Recipes that combine two or more components into a reusable layout.                                                    | KPIs, Report Page, Project Economics, Top Clients                    |

## Install & use

Load the fonts and the compiled styles once at your app root, then wrap your tree in a `ThemeProvider`.

```tsx
import '@eidra/tokens/fonts.css';
import '@eidra/react/styles.css';

import { ThemeProvider, Button, Field, Input } from '@eidra/react';

export function App() {
  return (
    <ThemeProvider theme="light" density="comfortable">
      <Field label="Email">
        <Input type="email" placeholder="you@eidra.com" />
      </Field>
      <Button tone="accent">Save</Button>
    </ThemeProvider>
  );
}
```

`ThemeProvider` applies the `eidra-root` scope plus `data-theme` and `data-density`. You can instead set `class="eidra-root" data-theme="dark"` on your own root element.

## Learn more

- **[GitHub repository](https://github.com/mattwakeman-eidra/eidra-design-system)** — source, ADRs, and the release runbook.
- **[Component catalog](https://github.com/mattwakeman-eidra/eidra-design-system/blob/main/docs/COMPONENTS.md)** — the generated index of every component and its import.
- **[Consuming guide](https://github.com/mattwakeman-eidra/eidra-design-system/blob/main/docs/CONSUMING.md)** — how an app adopts the design system (fonts, theming, Tailwind).
