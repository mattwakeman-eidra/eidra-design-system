---
"@eidra/react": minor
---

Client Dashboard parity — extend two existing components (the dashboard is otherwise covered by the DataGrid, Combobox, SegmentedControl, Input, EmptyState, Spinner, Alert and Statistic primitives already shipped):

- **`Chart` scatter/bubble support** — re-export Recharts `ScatterChart`, `Scatter`, and `ZAxis` under `Chart.*`, so apps can build scatter and bubble charts (bubble size via `ZAxis`) with the same themed `Chart.Container`/`TooltipContent`/`LegendContent`/`Cell`/`ReferenceLine` as the existing chart types. Adds a `Bubble` story (client revenue vs YoY growth, bubble size by total revenue, one series per size tier).
- **`Toggle` `shape` prop** — `shape="pill"` renders a fully-rounded chip (default `'rect'` is unchanged), for the quick-filter chip pattern. Adds a `QuickFilterChips` story.
- **`Chart` focus styling** — suppress the browser's default blue focus box on the (keyboard-focusable) chart surface and replace it with the token focus ring shown only for keyboard focus (`:focus-visible`), so clicking a chart no longer draws an unstyled box.
