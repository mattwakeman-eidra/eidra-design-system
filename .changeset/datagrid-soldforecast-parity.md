---
"@eidra/react": minor
---

Add four `DataGrid` options that unblock 100% sizing/layout parity with the eidra-invoicing "Sold & Forecast" table.

- `tableLayout?: 'auto' | 'fixed'` (default `'auto'`) — `'fixed'` sets `table-layout: fixed` and sizes columns strictly from their `width` (falling back to a default), so rendered widths equal declared widths and **multiple pinned columns keep their sticky offsets aligned** during horizontal scroll (fixes pinned-column bleed).
- `totalsPlacement?: 'bottom' | 'top'` (default `'bottom'`) — `'top'` stacks the totals/aggregate row directly under the header, sticky on vertical scroll, with its pinned cells sticky on horizontal scroll (header height is measured via `ResizeObserver`).
- Column `highlighted?: boolean` + `highlightTone?: 'accent' | 'finance'` — tints a whole column (header → body → totals) with a subtle token background and a 2px top accent border, for flagging the current "NOW" column.
- `density?: 'comfortable' | 'compact'` — per-instance row density (also honours the ambient `data-density` scope), so one page can mix relaxed and information-dense grids. Compact reduces row padding to `--eidra-space-1` and numerals to `--eidra-font-size-xs`.

All four use existing tokens (no new colours) and are additive — existing `DataGrid` usage is unchanged.
