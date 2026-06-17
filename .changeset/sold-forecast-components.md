---
"@eidra/react": minor
---

Add the components needed to rebuild the eidra-invoicing **Sold & Forecast** pages beyond the DataGrid, plus a density and charting polish.

- **`FilterSelect`** — a compact multi-select filter pill: a trigger that summarises the selection (0→placeholder, 1→value, ≥2→`"{n} {noun}s"`), opening a popover with a searchable checkbox list, a selection count, and clear-all. Built on Base UI Popover + the DS `Checkbox`/`Button`.
- **`StatBar`** — an inline strip of labelled metrics separated by dividers, with finance/accent tones, sizes, captions, and an `align="end"` trailing slot. Mono/tabular values.
- **`SegmentBar`** — a stacked, proportional, tinted composition bar (defaults to the finance revenue palette) with optional inline labels and legend; degrades to a single segment.
- **`SegmentedControl`** — a segmented view switcher; button mode is a radiogroup with arrow-key roving focus, or delegate segments to router links via an item `render` (no router coupling).
- **`Freshness`** — a status dot + label + compact relative time (`● Data 12 min ago`) with `staleAfter` tone escalation and an optional `pulse`.
- **Currency utils** — `formatCurrency` (`€2,916`), `formatCompactCurrency` (`€1.2M`, relocated from `Chart` and still re-exported), and `formatCurrencyThousands` (`€2,916k`).
- **`Chart.seriesDefaults`** — `{ isAnimationActive: false }` to spread onto `Bar`/`Line`/`Area`, avoiding the first-frame blank flash and empty SSR/headless captures.
- **Density** — `StatBar`, `SegmentBar`, `StatusStrip`, and `Statistic` now honour the ambient `data-density="compact"` scope (tighter padding/gaps, smaller numerals); `SegmentedControl`/`FilterSelect` scale via the control-size tokens. DataGrid compact rows are tighter (~24px).
