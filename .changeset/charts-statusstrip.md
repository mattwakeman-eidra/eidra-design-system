---
"@eidra/react": minor
---

Add a composable **charting kit** and **StatusStrip**, and fix a build regression.

- `Chart` — atomic, composable charting on Recharts, themed with Eidra tokens: `Chart.Container` (responsive + injects series colours as `--color-<key>` from a `config`), `Chart.TooltipContent` and `Chart.LegendContent` (themed, toggleable), the `formatCompactCurrency` helper, and re-exported Recharts primitives (`Chart.ComposedChart`, `Bar`, `Line`, `Cell`, `LabelList`, axes, …) so apps build any chart without importing Recharts directly. Recharts (`^3.7.0`) is a new dependency (externalised, not bundled).
- `StatusStrip` + `StatusStrip.Cell` — a RAG-coded heat-row (e.g. monthly momentum), tinted from the finance palette.
- Fix: the build now externalises `@base-ui/react` (the externals regex still matched the pre-rename `@base-ui-components/*`, so Base UI was being bundled into `dist`). This shrinks `dist/index.js` from ~728 kB to ~90 kB and avoids duplicate Base UI instances in consumers.
