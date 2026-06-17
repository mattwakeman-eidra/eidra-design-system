# Storybook hierarchy

The rules for where a story lives. The Storybook tree is also the **docs taxonomy** —
`scripts/catalog.mjs` derives each component's category in `docs/COMPONENTS.md` from
the first segment of its story `title`. So the title is not cosmetic; keep it correct.

## The three tiers

1. **`Foundations/*`** — system-level documentation with **no single component**:
   design tokens and cross-cutting rules. Current pages: `Colors`, `Typography`,
   `Density`, `Theming`.
2. **`‹Function›/‹Component›`** — **one page per component**, whose stories are that
   component's own variants, states, and props. This is where the vast majority of
   stories live. `‹Function›` is one of the functional categories below.
3. **`Patterns/*`** — recipes that **combine two or more components** into a reusable
   layout. Current pages: `Project Economics`, `Data Visualization`, `KPIs`.

## Decision tree (where does this story go?)

1. Does it document a token or system-wide rule with no single component?
   → **`Foundations/*`**
2. Does it document **one** component's own behaviour/props/variants?
   → **`‹Function›/‹Component›`**
3. Does it combine **≥2** components into a reusable layout/recipe?
   → **`Patterns/*`**
4. **If the functional category for a new component isn't obvious** — it plausibly
   fits two, or none — **stop and ask the user.** Don't guess; a wrong category
   silently mis-files the component in the generated catalog too.

## Functional categories (tier 2)

| Category | Rule — what belongs here | Examples |
|---|---|---|
| **Actions** | Controls whose purpose is to trigger an action | Button |
| **Forms** | Controls that capture user input | Input, Select, Combobox, Autocomplete, Checkbox, Radio, Switch, Slider, NumberField, Toggle, SegmentedControl, FilterSelect, Field, Fieldset, Form |
| **Navigation** | Move between views or sections | Breadcrumbs, Tabs, Menubar, NavigationMenu, Toolbar |
| **Overlays** | Float above the page, usually portaled | Dialog, AlertDialog, Popover, Menu, ContextMenu, Tooltip, PreviewCard |
| **Layout** | Structure and spacing of content | Accordion, Collapsible, ScrollArea, Separator |
| **Data Display** | Present persistent data and values | Avatar, Badge, Card, Chart, DataGrid, Kbd, SegmentBar, Statistic, StatisticBar, StatusStrip |
| **Feedback** | Communicate the status of a process or system state (often transient) | Alert, Toast, Spinner, Skeleton, Progress, Meter, SaveIndicator, Freshness, EmptyState |

### Boundary clarifications (so the fuzzy cases are decided, not guessed)

- **Feedback vs Data Display** — `Meter`/`Progress` measure progress toward a goal or
  limit (feedback on a process) → **Feedback**. `SegmentBar`/`Statistic`/`StatusStrip`
  present data values → **Data Display**.
- **A component page may import another component** only as a *necessary fixture*
  (e.g. a `Dialog` story needs a `Button` to open it). If the other component is part
  of the *point* of the story — a layout of several components — it's a **Pattern**,
  not a story on this component's page.

## Conventions

- Titles are **two-level** (`Forms/Input`). Don't introduce a third level
  (`Components/Forms/Input`) without updating `scripts/catalog.mjs` — it reads the
  first segment as the category and would flatten everything to "Components".
- Stories that render their own `ThemeProvider` scopes (theme/density showcases) set
  `parameters: { selfScoped: true }` so the global toolbar provider in
  `.storybook/preview.tsx` doesn't double-wrap them.
- Every component ships a `.stories.tsx` (CSF3, `tags: ['autodocs']`). The story file
  is co-located with the component even when its title is `Foundations/*` (e.g.
  `Typography`, `Theming`). Token-only pages with no component live in `src/foundations/`;
  cross-component recipes live in `src/patterns/`.
