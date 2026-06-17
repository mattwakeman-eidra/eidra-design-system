---
"@eidra/react": patch
---

Fix `DataGrid` pinned columns overlapping (or showing gaps) under `table-layout: auto`. Sticky-left offsets were computed from each column's *declared* `width`, but under auto layout the browser stretches/shrinks columns to fit the container, so the offsets drifted from the *rendered* widths — most visibly in a narrow context like the Storybook Docs tab. The grid now measures the rendered `<col>` widths (via a `ResizeObserver`) and recomputes the offsets, so multiple pinned columns stay aligned in both `auto` and `fixed` layouts at any container width. `tableLayout="fixed"` is no longer needed just to avoid overlap — only for exact, content-independent column widths.
