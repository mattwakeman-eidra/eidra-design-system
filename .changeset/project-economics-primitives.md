---
"@eidra/react": minor
---

Project Economics parity — extend three existing primitives so the invoicing app's project-economics views (budget-burn header, accounting matrix) compose entirely from the design system. No domain components ship; the recipes live in Storybook (`Patterns/Project Economics`).

- **`SegmentBar` threshold markers** — new `markers` prop (`{ value, label?, tone? }[]`) draws vertical lines over the bar, positioned on the same scale as `total`. Stacking bars with a shared `total` and the same marker `value` aligns the line across all of them — the "budget line" pattern. Adds `WithMarker` and `SharedBudgetLine` stories.
- **`DataGrid` value-driven cell tinting** — new per-column `cellTone(value, row)` returning `'positive' | 'negative' | 'caution' | 'muted'` tints individual cells (e.g. positive WIP green, negative deferred red, pending gold, locked grey). Composes with `EditableNumberCell` and overlays a `highlighted` column.
- **`DataGrid` cell drill-down** — new per-column `renderCellDetail(row, col)` makes a column's cells clickable: clicking opens a full-width detail row beneath (one open at a time across the grid). Adds a `CellTonesAndDrilldown` story.
- **`Statistic` accent border** — new `accent` prop draws a tone-coloured left border (with inset) for the accented KPI-card row. Adds an `AccentedKpiRow` story.

Also: renamed the `Chart` `ComposedChart` stories to be type-led for consistency (`Forecast` → `Composed`, `Headcount` → `ComposedBarLine`); the use-case is kept in each story's description.
