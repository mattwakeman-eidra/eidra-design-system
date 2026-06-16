# @eidra/react

## 2.0.0

### Minor Changes

- 61915e8: Migrate from the retired `@base-ui-components/react@1.0.0-rc.0` to the renamed, actively-maintained `@base-ui/react@^1.5.0`. The old package was frozen at a release candidate and deprecated ("renamed to @base-ui/react"); this moves onto stable 1.x. Import paths were renamed across all components and ref type annotations updated for Base UI 1.5's stricter element typings. No component API or styling changes. Note: per Base UI's stable release, unchecked Checkbox/Switch no longer submit an "off" value in forms unless `uncheckedValue` is set.
- d0e8d05: Add a composable **charting kit** and **StatusStrip**, and fix a build regression.

  - `Chart` — atomic, composable charting on Recharts, themed with Eidra tokens: `Chart.Container` (responsive + injects series colours as `--color-<key>` from a `config`), `Chart.TooltipContent` and `Chart.LegendContent` (themed, toggleable), the `formatCompactCurrency` helper, and re-exported Recharts primitives (`Chart.ComposedChart`, `Bar`, `Line`, `Cell`, `LabelList`, axes, …) so apps build any chart without importing Recharts directly. Recharts (`^3.7.0`) is a new dependency (externalised, not bundled).
  - `StatusStrip` + `StatusStrip.Cell` — a RAG-coded heat-row (e.g. monthly momentum), tinted from the finance palette.
  - Fix: the build now externalises `@base-ui/react` (the externals regex still matched the pre-rename `@base-ui-components/*`, so Base UI was being bundled into `dist`). This shrinks `dist/index.js` from ~728 kB to ~90 kB and avoids duplicate Base UI instances in consumers.

### Patch Changes

- Updated dependencies [d0e8d05]
  - @eidra/tokens@2.0.0
  - @eidra/icons@2.0.0

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
