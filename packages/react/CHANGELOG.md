# @eidra/react

## 1.4.0

### Minor Changes

- 3107fe8: New components and DataGrid extensions distilled from a full sweep of the eidra-invoicing app (deduped against the existing library — most app "primitives" already had a DS home and were not rebuilt).

  **New components**

  - **PageHeader** (Layout) — a generic page title bar: optional breadcrumb row, prominent `<h1>` with optional muted subtitle, and a right-aligned action cluster.
  - **ActionBar** (Layout) — a selection-aware action bar (the generic form of an invoicing bulk-action bar): `selectedCount` summary, optional `message` slot, caller-supplied action buttons, an optional `sticky` mode that pins to the viewport bottom.
  - **Timeline** (Data Display) — a vertical activity feed: a connecting rail with a tone-coloured marker per item, title, optional muted timestamp and description. Data-driven `items` API.
  - **DescriptionList** (Data Display) — a semantic `<dl>` label/value list with `horizontal`/`vertical` orientation and multi-column layout, plus a `DescriptionList.Term`/`DescriptionList.Details` compound escape hatch.
  - **PeriodNavigator** (Navigation) — a compact `‹ value ›` prev/next stepper for moving through a discrete sequence (e.g. periods/months); fully domain-agnostic.

  **DataGrid extensions**

  - **EditableSelectCell** and **EditableTextCell** join the existing `EditableNumberCell` (text cell supports an optional `debounceMs`).
  - **Drag-fill**: opt-in per column via `fillable` (+ optional `fillValue`) and an `onFillRange(columnId, fromRowIndex, toRowIndex, value)` callback — drag a value down a contiguous column range. Fully no-op for grids that don't opt in.
  - **`EditableNumberCell` value tone**: a `tone` prop (`'neutral' | 'positive' | 'caution' | 'danger' | 'accent'`) colours the resting value text and the edit field with the matching theme-aware token (e.g. probability tiers). The override (●) and aggregated (◆) markers keep their accent colour and compose with `tone`.
  - **`EditableNumberCell` editable rollups**: `aggregated` now controls only the resting affordance (dashed border + ◆) and is independent of `disabled` — an aggregated cell is still click-to-edit, and an explicit `overridden` replaces the ◆ with ● (override wins). Combine `aggregated` with `disabled` for the old read-only rollup. (Previously `aggregated` forced read-only.)

  **New recipe stories** (composition only, no new component code): `Patterns/Funnel` and a `GlossaryTerm` recipe on the Tooltip page.

  **Overlap-audit follow-ups**

  - **`ToggleGroup` gains `appearance="segmented"`** (+ a group-level `size`) — a contiguous filled-track segmented control reproducing the former `SegmentedControl` visuals on Base UI Toggle children. **`SegmentedControl` has been removed** (breaking) — its capability now lives in `ToggleGroup`. Migrate `<SegmentedControl items value onValueChange />` to `<ToggleGroup.Root appearance="segmented" value={[v]} onValueChange={(v) => v[0] && setV(v[0])}>` with `<Toggle value="…">` segments (use a `Toggle`'s `render` prop for link mode).
  - **`Menu` gains radio items** — `Menu.RadioGroup`, `Menu.RadioItem`, `Menu.RadioItemIndicator` — for parity with `ContextMenu`.
  - **New `Foundations/Choosing Components` Storybook page** — a decision guide for picking between adjacent components (Statistic vs StatisticBar vs StatusStrip, Select vs Combobox vs Autocomplete, etc.).

  Deferred follow-up: grouped DataGrid header rows with bulk-action buttons (needs grid-level row-selection state + surgery to the multi-tier header render; left out to avoid destabilising pinning/header behaviour).

### Patch Changes

- @eidra/tokens@1.4.0
- @eidra/icons@1.4.0

## 1.3.0

### Minor Changes

- a68b337: Client Dashboard parity — extend two existing components (the dashboard is otherwise covered by the DataGrid, Combobox, SegmentedControl, Input, EmptyState, Spinner, Alert and Statistic primitives already shipped):

  - **`Chart` scatter/bubble support** — re-export Recharts `ScatterChart`, `Scatter`, and `ZAxis` under `Chart.*`, so apps can build scatter and bubble charts (bubble size via `ZAxis`) with the same themed `Chart.Container`/`TooltipContent`/`LegendContent`/`Cell`/`ReferenceLine` as the existing chart types. Adds a `Bubble` story (client revenue vs YoY growth, bubble size by total revenue, one series per size tier).
  - **`Toggle` `shape` prop** — `shape="pill"` renders a fully-rounded chip (default `'rect'` is unchanged), for the quick-filter chip pattern. Adds a `QuickFilterChips` story.
  - **`Chart` focus styling** — suppress the browser's default blue focus box on the (keyboard-focusable) chart surface and replace it with the token focus ring shown only for keyboard focus (`:focus-visible`), so clicking a chart no longer draws an unstyled box.

- 42fc45b: Project Economics parity — extend three existing primitives so the invoicing app's project-economics views (budget-burn header, accounting matrix) compose entirely from the design system. No domain components ship; the recipes live in Storybook (`Patterns/Project Economics`).

  - **`SegmentBar` threshold markers** — new `markers` prop (`{ value, label?, tone? }[]`) draws vertical lines over the bar, positioned on the same scale as `total`. Stacking bars with a shared `total` and the same marker `value` aligns the line across all of them — the "budget line" pattern. Adds `WithMarker` and `SharedBudgetLine` stories.
  - **`DataGrid` value-driven cell tinting** — new per-column `cellTone(value, row)` returning `'positive' | 'negative' | 'caution' | 'muted'` tints individual cells (e.g. positive WIP green, negative deferred red, pending gold, locked grey). Composes with `EditableNumberCell` and overlays a `highlighted` column.
  - **`DataGrid` cell drill-down** — new per-column `renderCellDetail(row, col)` makes a column's cells clickable: clicking opens a full-width detail row beneath (one open at a time across the grid). Adds a `CellTonesAndDrilldown` story.
  - **`Statistic` accent border** — new `accent` prop draws a tone-coloured left border (with inset) for the accented KPI-card row. Adds an `AccentedKpiRow` story.

  Also: renamed the `Chart` `ComposedChart` stories to be type-led for consistency (`Forecast` → `Composed`, `Headcount` → `ComposedBarLine`); the use-case is kept in each story's description.

- 9b460a7: `ThemeProvider` gains an **`accent`** prop (`'brand'` | `'finance'`, default `'brand'`). `accent="finance"` repoints the accent tokens to the financial data-viz blue (`--eidra-finance-accent*`) for the whole scope — mirroring `DataGrid`'s `accent` prop but at the theme level — and propagates to portaled components (menus, dialogs, tooltips) via the scope context. Implemented as a `[data-accent='finance']` token repoint in the base layer, so setting `data-accent="finance"` on your own root works too. The `Foundations/Theming` story gains an `accent` control plus an `Accent` showcase.

  Also: showcase stories that ignore args (`Statistic`'s `AccentedKpiRow`, `ThemeProvider`'s `Matrix`/`Accent`) now disable the Controls panel, which previously showed inapplicable controls.

### Patch Changes

- 51c1fed: Component audit follow-ups — consistency fixes from a catalog-wide review:

  - **Theme and density now propagate into portaled popups (bulletproof).** `ThemeProvider` publishes its `{ theme, density }` via context, and every portaled surface — `Dialog`, `AlertDialog`, `Popover`, `Menu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Select`, `Combobox`, `Autocomplete`, `Tooltip`, `PreviewCard`, `Toast` — stamps `data-theme`/`data-density` onto its positioner/popup. Popups render outside the `eidra-root` subtree (Base UI portals to `document.body`), so they previously missed both the theme (dark popups rendered light) and compact density (the trigger shrank but its menu/dialog/list stayed comfortable). Now they match the scope regardless of where it sits. Without a `ThemeProvider` above, behaviour is unchanged.
  - **Compact density blocks for overlays/menus/dropdowns.** Added `[data-density='compact']` blocks (documented `base.css` convention — both padding axes one step down) to the components above, and mirrored the control-size compact remap onto the bare `[data-density='compact']` attribute so controls rendered inside a portal shrink too.
  - **`Menubar` arrow** now uses the shared `fill`/`stroke` token treatment like the other arrows, removing the only hardcoded colour (`rgb(0 0 0 / 0.1)` drop-shadow) in the catalog.
  - **`Field`** ships its own Storybook story (`Forms/Field`) + autodocs page; previously it was only demonstrated inside the `Input` stories.

- 3afab36: Storybook + catalog taxonomy cleanup, now documented in `docs/STORYBOOK.md` (three tiers: `Foundations/*`, `‹Function›/‹Component›`, `Patterns/*`). No component code changes — story titles and the generated catalog/`llms.txt` categories only:

  - Folded the redundant `Inputs` category into `Forms` (`FilterSelect`, `SegmentedControl`).
  - Moved the cross-component `Data Visualization` gallery from `Foundations` to `Patterns`.
  - Moved the `Statistic` KPI compositions (KPI bar, stat-card grid) to a new `Patterns/KPIs` page; `Statistic`'s own page keeps its prop/variant stories.
  - Added a `Foundations/Theming` page for `ThemeProvider` (was uncategorised).
  - @eidra/tokens@1.3.0
  - @eidra/icons@1.3.0

## 1.2.0

### Minor Changes

- e0f7c8e: Add four `DataGrid` options that unblock 100% sizing/layout parity with the eidra-invoicing "Sold & Forecast" table.

  - `tableLayout?: 'auto' | 'fixed'` (default `'auto'`) — `'fixed'` sets `table-layout: fixed` and sizes columns strictly from their `width` (falling back to a default), so rendered widths equal declared widths and **multiple pinned columns keep their sticky offsets aligned** during horizontal scroll (fixes pinned-column bleed).
  - `totalsPlacement?: 'bottom' | 'top'` (default `'bottom'`) — `'top'` stacks the totals/aggregate row directly under the header, sticky on vertical scroll, with its pinned cells sticky on horizontal scroll (header height is measured via `ResizeObserver`).
  - Column `highlighted?: boolean` + `highlightTone?: 'accent' | 'finance'` — tints a whole column (header → body → totals) with a subtle token background and a 2px top accent border, for flagging the current "NOW" column.
  - `density?: 'comfortable' | 'compact'` — per-instance row density (also honours the ambient `data-density` scope), so one page can mix relaxed and information-dense grids. Compact reduces row padding to `--eidra-space-1` and numerals to `--eidra-font-size-xs`.

  All four use existing tokens (no new colours) and are additive — existing `DataGrid` usage is unchanged.

- 8b0d712: Add the components needed to rebuild the eidra-invoicing **Sold & Forecast** pages beyond the DataGrid, plus a density and charting polish.

  - **`FilterSelect`** — a compact multi-select filter pill: a trigger that summarises the selection (0→placeholder, 1→value, ≥2→`"{n} {noun}s"`), opening a popover with a searchable checkbox list, a selection count, and clear-all. Built on Base UI Popover + the DS `Checkbox`/`Button`.
  - **`StatisticBar`** — an inline strip of labelled metrics separated by dividers, with finance/accent tones, sizes, captions, and an `align="end"` trailing slot. Mono/tabular values.
  - **`SegmentBar`** — a stacked, proportional, tinted composition bar (defaults to the finance revenue palette) with optional inline labels and legend; degrades to a single segment.
  - **`SegmentedControl`** — a segmented view switcher; button mode is a radiogroup with arrow-key roving focus, or delegate segments to router links via an item `render` (no router coupling).
  - **`Freshness`** — a status dot + label + compact relative time (`● Data 12 min ago`) with `staleAfter` tone escalation and an optional `pulse`.
  - **Currency utils** — `formatCurrency` (`€2,916`), `formatCompactCurrency` (`€1.2M`, relocated from `Chart` and still re-exported), and `formatCurrencyThousands` (`€2,916k`).
  - **`Chart.seriesDefaults`** — `{ isAnimationActive: false }` to spread onto `Bar`/`Line`/`Area`, avoiding the first-frame blank flash and empty SSR/headless captures.
  - **Compact density across the catalog** — every component with a meaningful density dimension now honours the ambient `data-density="compact"` scope. Control components already scaled via the `--eidra-size-control-*` tokens; this adds compact rules (tighter padding/gaps, smaller control boxes, thinner bars, one-step-down large fonts) to the data-display and form components that previously used fixed spacing: DataGrid, StatisticBar, SegmentBar, StatusStrip, Statistic, Accordion, Alert, Badge, Card, Kbd, Tabs, Toast, Tooltip, PreviewCard, EmptyState, Checkbox, Radio, Switch, Field, Fieldset, Breadcrumbs, Meter, Progress, SaveIndicator, Freshness. (Components with no density dimension — Separator, Spinner, Typography, Form, ScrollArea, Collapsible, Chart, ThemeProvider — are intentionally untouched.) DataGrid compact rows are tighter (~24px).

### Patch Changes

- 2934c57: Fix `DataGrid` pinned columns overlapping (or showing gaps) under `table-layout: auto`. Sticky-left offsets were computed from each column's _declared_ `width`, but under auto layout the browser stretches/shrinks columns to fit the container, so the offsets drifted from the _rendered_ widths — most visibly in a narrow context like the Storybook Docs tab. The grid now measures the rendered `<col>` widths (via a `ResizeObserver`) and recomputes the offsets, so multiple pinned columns stay aligned in both `auto` and `fixed` layouts at any container width. `tableLayout="fixed"` is no longer needed just to avoid overlap — only for exact, content-independent column widths.
  - @eidra/tokens@1.2.0
  - @eidra/icons@1.2.0

## 1.1.0

### Minor Changes

- 2bc90aa: Migrate from the retired `@base-ui-components/react@1.0.0-rc.0` to the renamed, actively-maintained `@base-ui/react@^1.5.0`. The old package was frozen at a release candidate and deprecated ("renamed to @base-ui/react"); this moves onto stable 1.x. Import paths were renamed across all components and ref type annotations updated for Base UI 1.5's stricter element typings. No component API or styling changes. Note: per Base UI's stable release, unchecked Checkbox/Switch no longer submit an "off" value in forms unless `uncheckedValue` is set.
- 2bc90aa: Add a composable **charting kit** and **StatusStrip**, and fix a build regression.

  - `Chart` — atomic, composable charting on Recharts, themed with Eidra tokens: `Chart.Container` (responsive + injects series colours as `--color-<key>` from a `config`), `Chart.TooltipContent` and `Chart.LegendContent` (themed, toggleable), the `formatCompactCurrency` helper, and re-exported Recharts primitives (`Chart.ComposedChart`, `Bar`, `Line`, `Cell`, `LabelList`, axes, …) so apps build any chart without importing Recharts directly. Recharts (`^3.7.0`) is a new dependency (externalised, not bundled).
  - `StatusStrip` + `StatusStrip.Cell` — a RAG-coded heat-row (e.g. monthly momentum), tinted from the finance palette.
  - Fix: the build now externalises `@base-ui/react` (the externals regex still matched the pre-rename `@base-ui-components/*`, so Base UI was being bundled into `dist`). This shrinks `dist/index.js` from ~728 kB to ~90 kB and avoids duplicate Base UI instances in consumers.

### Patch Changes

- a5c56a6: Move `@eidra/tokens` and `@eidra/icons` from `peerDependencies` to `dependencies`. They aren't imported by react's runtime (tokens CSS is inlined at build; icons is imported by consumers directly), and classifying them as peers caused Changesets to force a major version bump on every tokens/icons change.
- Updated dependencies [2bc90aa]
  - @eidra/tokens@1.1.0
  - @eidra/icons@1.1.0

## 1.0.0

### Minor Changes

- 9777af6: Add `Breadcrumbs` — a breadcrumb trail showing the path to the current page. Renders semantic `<nav aria-label="Breadcrumb">` → `<ol>` with the current page marked `aria-current="page"`. Links are plain `<a>` by default, or pass an item `render` callback to use a router link without coupling the design system to a router. Labels accept nodes (icons) and the separator is customizable (defaults to `/`).
- 3aadd76: Add `DataGrid` (and the `EditableNumberCell` companion) — a generic, config-driven data grid built on a native `<table>`: sticky pinned columns, a multi-tier header from column groups, click-to-sort, global filtering, column visibility, expandable tree rows, and a sticky totals footer. `EditableNumberCell` provides click-to-edit numeric cells with override/aggregate markers. The grid's `accent="finance"` scopes interactive affordances to the finance data-viz palette.
- 05d9e43: Add `EmptyState` — a centered placeholder for empty lists, tables, and search results. Composes an optional icon, a title, supporting description, and an optional actions slot (e.g. a primary `Button`). Has `sm`/`md` sizes so it fits both full pages and compact containers like a `DataGrid` body.
- c9b45e9: Add `SaveIndicator` (and the `useSaveIndicator` hook) — a transient inline confirmation that fades in after a successful save and out again, standardised for inline-edit interactions (pairs with `DataGrid` cell editing). Renders an `aria-live` status region so the save is announced to assistive tech; supports an optional visible label or icon-only display.
- 109d928: Add `Statistic` — a single labelled metric (uppercase label, prominent value, optional trailing delta, caption, and progress bar). The reusable building block for KPI bars and stat-card grids: compose several with `Separator` for a row or `Card` for a grid. Threshold/colour logic stays with the caller via the `tone` prop; the optional progress bar composes the `Progress` component.

### Patch Changes

- Updated dependencies [3aadd76]
- Updated dependencies [e497073]
  - @eidra/tokens@1.0.0
  - @eidra/icons@1.0.0
