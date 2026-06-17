# @eidra/react

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
