---
"@eidra/react": minor
---

Chart kit gains shared helpers so every chart prepares data, colours, and tooltips the same way:

- **Colour:** `Chart.chartColors` (the `--eidra-chart-1…16` ramp) + `Chart.categoricalConfig(rows, keyField)` build a `config` for categorical charts (pie/donut/treemap/sunburst/bubble) from the ramp, so their colours flow through `config` like keyed series and into the tooltip/legend. Categorical cells now read the colour from `config` (space-safe) instead of a per-key CSS variable.
- **Tooltips:** `Chart.TooltipContent` accepts a `rows` override — composite charts (dumbbell, waterfall, drill sunburst) render derived rows through the same themed shell instead of bespoke tooltips.
- **Data prep:** `Chart.toWaterfall`, `Chart.sumHierarchy`, `Chart.dumbbellRange` replace per-chart one-off transforms.
- **Axes:** `Chart.margin`, `Chart.gridProps`, `Chart.axisProps` are spreadable defaults so charts stop re-specifying margin/grid/axis styling.

All additive; existing chart APIs are unchanged.
