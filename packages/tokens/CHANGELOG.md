# @eidra/tokens

## 1.5.0

### Minor Changes

- f5bee87: Extend the categorical chart palette to 16 hues — `--eidra-chart-9` … `--eidra-chart-16`: eight more meaning-neutral qualitative hues, each with a tuned dark-theme variant (saturated in light, brighter in dark), mirroring how `--eidra-chart-1` … `--eidra-chart-8` are defined. The new hues are placed in the gaps of the existing ramp to maximise perceptual distinctness from each other and from 1–8, so high-cardinality categorical stacks (e.g. monthly revenue split by operating company, ~12–16 series) stay legible in both themes. Additive only; `--eidra-chart-1` … `--eidra-chart-8` and all other tokens are unchanged.
- 04eb8e7: Add four chart types, a TreeView component, and a categorical colour ramp.

  **New categorical token ramp** — `--eidra-chart-1` … `--eidra-chart-8`: eight meaning-neutral qualitative hues for charts, each with a tuned dark-theme variant (saturated in light, brighter in dark) so series/slice colours stay distinct and legible in both themes. Additive; existing tokens are unchanged.

  **`Chart` — four new chart types** (re-exported Recharts primitives under the `Chart` namespace, themed with tokens, full + mini, light + dark):

  - **Radar** (`Chart.RadarChart` + `Radar`/`PolarGrid`/`PolarAngleAxis`/`PolarRadiusAxis`) — multi-series radar; polar grid/axes themed via new `:global(.recharts-polar-*)` rules.
  - **Pie & Donut** (`Chart.PieChart` + `Pie`) — categorical breakdown; slices map to `--eidra-chart-N` via `Chart.Cell`, separated by an `--eidra-surface` stroke. Ships a `Pie` and a `Donut` (with a centred total) story.
  - **Treemap** (`Chart.Treemap`) — hierarchical; a custom node renderer colours leaves by category token and only labels tiles big enough to fit.
  - **Sunburst** (`Chart.SunburstChart`) — self-contained hierarchical chart (per-node `fill`, children inherit); renders inside the standard responsive `Chart.Container`.

  Each chart gets a full story under `Data Display/Chart`, a `size="sm"` mini in the `Minis` gallery, and a card in `Patterns/Data Visualization`. Also adds a **Magic Quadrant** story (a 2×2 `ScatterChart` with named, tinted quadrants via the newly re-exported `Chart.ReferenceArea`, labelled points, and titled axes). New re-exports: `Chart.ReferenceArea`, and the `TreemapNode` / `SunburstData` types.

  **`TreeView`** (new component, `Data Display/TreeView`) — an interactive hierarchical tree: data-driven `items` API (`{ id, label, icon?, children?, disabled? }`), controlled/uncontrolled expansion (`expandedIds`/`defaultExpandedIds`) and single selection (`selectedId`/`defaultSelectedId`), optional per-node icons, and a rotating chevron. Full ARIA `tree` pattern — `role="tree"`/`treeitem"`/`"group"`, `aria-expanded`/`aria-selected`/`aria-level`/`aria-setsize`/`aria-posinset`, roving tabindex, and keyboard nav (Up/Down, Left/Right to collapse/expand or move to parent/child, Home/End, Enter/Space to select). CSS Module on tokens only, density-aware. Stories cover a file-explorer, controlled selection, compact density, a per-node **right-click `ContextMenu`**, and a **checkbox** multi-select tree (parent tri-state / cascade).

- 821004d: Add country `Flag` to `@eidra/icons` and an extra-small icon size.

  **`Flag`** (new) — `<Flag code="SE" size="sm" label?="Sweden" />`. Looks a flag up by ISO 3166-1 alpha-2 `code` (case-insensitive) from the full `country-flag-icons` set (257 countries/territories, MIT, externalized so flags tree-shake out unless used). Sizes its height from `--eidra-size-icon-*` tokens with the width following the 3:2 ratio, and adds rounded corners + a hairline `--eidra-border` so it reads on any surface. Unlike `Icon`, flags are multicolour, so they ignore `currentColor`. An unknown code renders nothing; pass `label` to expose the flag to assistive tech (`role="img"`). Also exports `flagCodes` (every available code, sorted — useful for country pickers) and the `FlagProps` / `FlagCode` / `FlagSize` types.

  **New `--eidra-size-icon-xs` token** (0.75rem / 12px) — extends the icon size scale below `sm`, for dense tables and inline lists. Both `Icon` and `Flag` now accept `size="xs"`. Additive; existing sizes are unchanged.

  Storybook: `Foundations/Flags` — region set, sizes (xs–lg), inline-in-text, and a filterable gallery of all flags, each with controls.

- d6b9704: Ship a Tailwind **v4** theme bridge so apps on Tailwind v4 (CSS-first) can use Eidra tokens as utilities.

  The existing `@eidra/tokens/tailwind` export is a **Tailwind v3 JS preset** (`presets: [require('@eidra/tokens/tailwind')]`). Tailwind v4 dropped JS-preset config in favour of a CSS `@theme`, so v4 apps couldn't use it and were hand-maintaining their own token→theme map in `globals.css` — which silently drifts from the tokens.

  **New export — `@eidra/tokens/tailwind.css` (and the same file re-shipped as `@eidra/react/tailwind.css`).** A generated CSS file that maps every `--eidra-*` token onto Tailwind v4's theme namespaces (`--color-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`, `--ease-*`) inside `@theme inline`, so utilities stay reactive to the live `var(--eidra-*)` values (light / dark / finance). It is generated from the same token walk as the v3 preset, so the two can't diverge.

  ```css
  /* app globals.css — Tailwind v4 */
  @import "@eidra/react/styles.css";
  @import "tailwindcss";
  @import "@eidra/react/tailwind.css"; /* or @eidra/tokens/tailwind.css */
  ```

  The shipped file includes the `@layer` order and a `@theme { --*: initial }` reset (Eidra-only utilities); delete that block in your own copy if you want to keep Tailwind's default theme alongside. The v3 preset (`@eidra/tokens/tailwind`) is unchanged and still exported for v3 apps. See `docs/CONSUMING.md` §5.

### Patch Changes

- a34530d: Fix dark-theme legibility of the finance accent and of toned `EditableNumberCell` values, and stop a hovered editable cell from melting into its row.

  **Tokens** — the `--eidra-finance-accent*` family had no `[data-theme='dark']` entry, so `accent="finance"` repointed the accent to dark steel-blue (`#27567a`/`#1d4060`) that sat illegibly on dark surfaces (the brand orange accent already inverts per theme; finance never did). Adds a dark finance-accent ramp — lighter steel-blue primitives (`finance.blue-bright/-light/-deep`) and a `finance.accent*` group in `dark.json` that mirrors the brand inversion (lighter DEFAULT/active, darker subtle, black on-accent). Flows through every `accent="finance"` surface (DataGrid, `ThemeProvider`, `[data-accent='finance']`).

  **EditableNumberCell** — toned values (`tone`) coloured their text with the base tone token (red/green/orange-500), which dropped below the 4.5:1 AA floor on the hover background; danger-red negatives effectively vanished. Value text and the edit field now use the readable-on-surface tone foregrounds (`--eidra-success-fg`, `--eidra-warning-fg`, `--eidra-danger-fg`; accent uses `--eidra-accent-active`, since `--eidra-accent-fg` is the on-accent colour).

  **Editable-cell hover** — `EditableNumberCell`, `EditableTextCell` and `EditableSelectCell` now take the `--eidra-accent-subtle` wash on hover (the same "cell in play" colour as a committed override/rollup) instead of a neutral grey. The row already hovers to `--eidra-surface-hover`, so a neutral cell hover made the cell indistinguishable from its shaded row; the accent-subtle fill is a distinct colour channel and, being dark, keeps the `-fg` toned values well clear of AA.

  **Highlighted column** — a highlighted ("NOW") column painted a flat `accent-subtle` tint over its cells, which overrode the row background, so the column stayed frozen while the rest of a hovered row lifted to `--eidra-surface-hover`. Hovered-row highlighted cells now blend the column tint over the hover surface (`color-mix`, opaque so pinned cells stay solid) — the column lifts with the row yet still reads as the accent-tinted highlight. Per-cell value tones keep their fixed state tint.

  Untoned cells, override/aggregated affordances, and the markers (●/◆) are unchanged. Adds a dark-theme guard (`pnpm --filter @eidra/react test`) asserting: every toned value clears 4.5:1 on both the cell-hover and row-hover surfaces (brand and finance); the finance accent chrome clears the 3:1 graphical floor; the cell-hover colour stays distinct from the row-hover colour; and the hovered highlighted-column colour differs from both its resting tint and a plain hovered row while keeping body text legible — all parsed from the components' own CSS so none can silently regress.

## 1.4.0

## 1.3.0

## 1.2.0

## 1.1.0

### Minor Changes

- 2bc90aa: Add two finance data-viz tokens for chart completeness: `--eidra-finance-revenue-budget` (the budget step line) and `--eidra-finance-comparison` (last-year / comparison series).

## 1.0.0

### Minor Changes

- 3aadd76: Add the `finance` data-viz colour palette: primitives (`--eidra-color-finance-*`) and semantic tokens (`--eidra-finance-*`) for the action accent (Eidra Blue — orange reads as caution in a financial context), RAG (positive/caution/negative), and the revenue green→gold ramp (actuals → sold → hi-prob → additional). Grounded in the Eidra invoicing styleguide; consumed by `DataGrid` and finance charts.
- e497073: Add a Tailwind v3 preset at `@eidra/tokens/tailwind`. Generated from the DTCG tokens, it exposes every `--eidra-*` token as an `eidra-`-prefixed Tailwind utility (`bg-eidra-accent`, `p-eidra-4`, `rounded-eidra-lg`, `shadow-eidra-md`, `font-eidra-sans`, `z-eidra-modal`, …) mapped to the CSS variables, so utilities stay theme-reactive (light/dark/finance). Consuming apps add `presets: [require('@eidra/tokens/tailwind')]` to style with Eidra tokens via Tailwind instead of inline styles. DS component internals are unchanged (CSS Modules).
