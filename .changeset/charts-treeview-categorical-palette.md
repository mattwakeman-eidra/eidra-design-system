---
"@eidra/tokens": minor
"@eidra/react": minor
---

Add four chart types, a TreeView component, and a categorical colour ramp.

**New categorical token ramp** — `--eidra-chart-1` … `--eidra-chart-8`: eight meaning-neutral qualitative hues for charts, each with a tuned dark-theme variant (saturated in light, brighter in dark) so series/slice colours stay distinct and legible in both themes. Additive; existing tokens are unchanged.

**`Chart` — four new chart types** (re-exported Recharts primitives under the `Chart` namespace, themed with tokens, full + mini, light + dark):

- **Radar** (`Chart.RadarChart` + `Radar`/`PolarGrid`/`PolarAngleAxis`/`PolarRadiusAxis`) — multi-series radar; polar grid/axes themed via new `:global(.recharts-polar-*)` rules.
- **Pie & Donut** (`Chart.PieChart` + `Pie`) — categorical breakdown; slices map to `--eidra-chart-N` via `Chart.Cell`, separated by an `--eidra-surface` stroke. Ships a `Pie` and a `Donut` (with a centred total) story.
- **Treemap** (`Chart.Treemap`) — hierarchical; a custom node renderer colours leaves by category token and only labels tiles big enough to fit.
- **Sunburst** (`Chart.SunburstChart`) — self-contained hierarchical chart (per-node `fill`, children inherit); renders inside the standard responsive `Chart.Container`.

Each chart gets a full story under `Data Display/Chart`, a `size="sm"` mini in the `Minis` gallery, and a card in `Patterns/Data Visualization`. Also adds a **Magic Quadrant** story (a 2×2 `ScatterChart` with named, tinted quadrants via the newly re-exported `Chart.ReferenceArea`, labelled points, and titled axes). New re-exports: `Chart.ReferenceArea`, and the `TreemapNode` / `SunburstData` types.

**`TreeView`** (new component, `Data Display/TreeView`) — an interactive hierarchical tree: data-driven `items` API (`{ id, label, icon?, children?, disabled? }`), controlled/uncontrolled expansion (`expandedIds`/`defaultExpandedIds`) and single selection (`selectedId`/`defaultSelectedId`), optional per-node icons, and a rotating chevron. Full ARIA `tree` pattern — `role="tree"`/`treeitem"`/`"group"`, `aria-expanded`/`aria-selected`/`aria-level`/`aria-setsize`/`aria-posinset`, roving tabindex, and keyboard nav (Up/Down, Left/Right to collapse/expand or move to parent/child, Home/End, Enter/Space to select). CSS Module on tokens only, density-aware. Stories cover a file-explorer, controlled selection, compact density, a per-node **right-click `ContextMenu`**, and a **checkbox** multi-select tree (parent tri-state / cascade).
