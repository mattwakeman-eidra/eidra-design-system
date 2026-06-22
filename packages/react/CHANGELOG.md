# @eidra/react

## 1.6.0

### Minor Changes

- 69778c2: Ship component styles in a cascade layer (`@layer eidra`) so consumer styles can override the DS.

  `@eidra/react/styles.css` shipped as **unlayered** CSS. Per the cascade, unlayered rules always beat layered ones — and Tailwind v4 utilities live in `@layer utilities` — so a DS rule like `.trigger { width: 100% }` could not be overridden by a `w-24` utility of equal specificity. Components accept `className`, but for these properties it was dead: the only escape was inline `style={{}}`.

  The built stylesheet is now wrapped in `@layer eidra` (a post-build step, guarded by `check-build.mjs`). Result:

  - **Tailwind utilities** (`@layer utilities`, registered after `eidra`) override DS rules — `<Select.Trigger className="w-24" />`, `<Toolbar.Root className="border-0 rounded-none shadow-none p-0" />`, etc.
  - **Unlayered consumer CSS** beats the DS, as expected.
  - DS defaults still apply when you set nothing.

  **Migration:** import `@eidra/react/styles.css` **before** Tailwind's utilities import (the natural/reference order) so the `eidra` layer registers first. You can now delete inline `style`/`eslint-disable` width and chrome overrides on DS components and use `className` instead. Because this changes the cascade, an element that was unknowingly held by a DS default may now pick up a consumer utility it previously ignored — worth a quick visual check on upgrade. See ADR-0008.

- c95b826: Add two components built on Base UI primitives:

  - **Drawer**: a panel that slides in from any edge (`side="right" | "left" | "top" | "bottom"`, default `right`) with swipe-to-dismiss gestures. Compound parts (Root/Trigger/Portal/Backdrop/Viewport/Popup/Title/Description/Close) plus Header/Body/Footer/CloseButton layout helpers, token-styled and density-aware.
  - **OTPField**: a one-time-code / PIN input rendering a row of single-character slots that auto-advance and accept pasted codes. Supports `length`, `validationType` (numeric/alphanumeric/alpha), `mask`, and slot `size`, and wires into `<Field>` for labels and validation.

- d2c1cac: One coherent width policy for every anchored overlay — fixes full-width menus.

  **The bug.** `Select` (and `Combobox`) set `min-width: var(--available-width)` on their popup. `--available-width` is Base UI's space from the popup to the viewport edge, so a trigger near the left of a wide screen opened a menu that spanned almost the whole viewport (~1584px in a 1600px window). Consumers were working around it with inline `style={{ minWidth: 'var(--anchor-width)', width: 'max-content' }}`.

  **The policy.** Overlay width is now decided in one place — the `[data-eidra-width]` block in `base.css` — driven by a typed `width` prop on each anchored popup:

  - `anchor` — at least as wide as the trigger, then hug content, capped at the viewport (`min-width: var(--anchor-width); width: max-content`). **Default** for `Select`, `Combobox`, `Autocomplete`.
  - `content` — hug content, capped at the viewport, with a readable per-component floor. **Default** for `Menu`, `ContextMenu`, `Menubar`, `FilterSelect`.
  - `fill` — exactly the trigger width.

  All three cap at `min(var(--eidra-overlay-max-width, 100vw), var(--available-width))` — `--available-width` is now only ever a ceiling, never a floor. The `OverlayWidth` type is exported from `@eidra/react`.

  **Tokens.** New `--eidra-size-container-2xs` (11.25rem) and `--eidra-size-container-xs` (20rem). The fixed overlay widths that were magic numbers (Menu/Menubar/ContextMenu/FilterSelect floors, Popover/Tooltip/ContextMenu/FilterSelect caps) now reference these instead of `180px`/`220px`/`280px`/`320px`.

  **Consumers:** after syncing, delete inline `minWidth`/`width` overrides on overlay popups (e.g. Frankly's Client Dashboard `Select.Popup`s) — the default behaviour now hugs the trigger/content. Use `width="fill"` if you specifically want a popup to match its trigger width, or `width="anchor"`/`"content"` to override a component's default.

- b2e5c69: Make the Tailwind theme reset opt-in instead of bundling it into the bridge.

  `@eidra/react/tailwind.css` (and `@eidra/tokens/tailwind.css`) used to include a `@theme { --*: initial }` reset that dropped Tailwind's entire built-in theme, so importing the bridge forced Eidra-only utilities on every consumer. Per the "enable, don't force" principle (ADR-0009), that reset is now a **separate, opt-in import** and the bridge only maps Eidra tokens onto Tailwind's `@theme`.

  **New export:** `@eidra/react/tailwind-reset.css` (and `@eidra/tokens/tailwind-reset.css`) — `@theme { --*: initial }`.

  ```css
  @import '@eidra/react/styles.css';
  @import 'tailwindcss';
  @import '@eidra/react/tailwind-reset.css'; /* opt-in: drop Tailwind's defaults */
  @import '@eidra/react/tailwind.css'; /* re-add only the Eidra tokens */
  ```

  **Migration:** if you were relying on the bundled reset to get Eidra-only utilities, add `@eidra/react/tailwind-reset.css` **after** `tailwindcss` and **before** `@eidra/react/tailwind.css`. If you omit it, Tailwind's default theme stays available alongside the Eidra tokens (the new default). The bridge import path itself is unchanged.

- 8959613: `ThemeProvider`: add `nonce` and `cspDisableStyleElements` props. When set, the scope is wrapped in Base UI's `CSPProvider` so the inline `<style>`/`<script>` tags Base UI injects carry a nonce (or are suppressed), letting the design system work under a strict `style-src` Content Security Policy. The default tree is unchanged when neither prop is provided.

### Patch Changes

- d40d345: Bump Base UI to 1.6 (`@eidra/react` runtime dependency). 1.6 removes arrow-key roving focus from Accordion to match the updated APG guidance (headers are now plain buttons in the Tab order; Enter/Space still toggles); the Accordion keyboard story is updated to reflect this.
- ffe8438: Compact density now reduces horizontal padding/gap (not just height) on Button, Input, NumberField, Toggle, PeriodNavigator, Collapsible, FilterSelect, and the DataGrid editable cells. Fix the ScrollArea scrollbar thumb overflowing its track, and add a horizontal-orientation gap variant to RadioGroup.
- fc6359b: Dependency refresh (batched Dependabot bumps):

  - Shipped runtime deps: lucide-react 1.18 to 1.21 and country-flag-icons to 1.6.18 (`@eidra/icons`).
  - Build/dev tooling (devDependencies, no change to published output): Vite 7 to 8, TypeScript 5.9 to 6, the vitest family 3 to 4 (`vitest`, `@vitest/browser`, `@vitest/coverage-v8`, plus the new `@vitest/browser-playwright`), and style-dictionary 5.4 to 5.5.

  vitest 4 moved the browser provider config from a string to a factory, so `vitest.config.ts` now imports `playwright` from `@vitest/browser-playwright` and uses `provider: playwright()`.

- 664cf42: Stop the box-sizing reset leaking into consumer apps.

  `@eidra/react/styles.css` shipped a global `*, *::before, *::after { box-sizing: border-box }` reset, so importing the stylesheet forced `border-box` onto **every** element in the host app — not just Eidra components. That's invasive and can conflict with a consumer's own layout (flagged in design-system adoption review).

  The reset is now **scoped to the Eidra subtree**: `.eidra-root` and its descendants, plus portaled popups (which render outside `.eidra-root`). `ThemeProvider` now stamps a bare `data-eidra-scope` marker on the popup positioner — via the same `useScopeDataAttrs` path that already replicates `data-theme`/`data-density`/`data-accent` — so menus, dialogs, and tooltips still get the reset. Component CSS Modules continue to get `border-box`; the host app's own elements are left untouched.

  No API change. If you relied on `@eidra/react/styles.css` to reset box-sizing for your **own** (non-Eidra) markup, add a reset in your app.

- 8959613: `ScrollArea`: the thumb now reacts to the Base UI 1.6 `data-scrolling` hook, deepening its colour while the user is actively scrolling (previously only the scrollbar track responded).
- Updated dependencies [fc6359b]
- Updated dependencies [d2c1cac]
- Updated dependencies [b2e5c69]
  - @eidra/icons@1.6.0
  - @eidra/tokens@1.6.0

## 1.5.0

### Minor Changes

- d63dca9: Add `Chart.BoxPlot` — a box-and-whisker chart for showing the distribution of a metric across categories. Recharts has no box primitive, so `BoxPlot` is a self-contained chart: drop it inside `Chart.Container` and it owns its `ComposedChart`, axes and value-domain, drawing one box per row at true axis scale (box = Q1–Q3, emphasised median, whiskers to the Tukey 1.5×IQR fences with caps, and outliers as dots). It reads the axis scales via Recharts' v3 hooks and positions each box on its axis tick centre, so boxes stay aligned with the category labels. Supports `orientation` (`vertical` | `horizontal`), per-category `color` (cycles `--eidra-chart-1…16` by default), and a hover tooltip showing the five-number summary (routed through the themed `Chart.TooltipContent` `rows` override). Ships with `Chart.computeBoxStats(values)` (also exported standalone) to derive a `{ min, q1, median, q3, max, outliers }` summary from raw samples using type-7 quartiles + Tukey outlier fences. Additive only.
- c1878d6: Chart kit gains shared helpers so every chart prepares data, colours, and tooltips the same way:

  - **Colour:** `Chart.chartColors` (the `--eidra-chart-1…16` ramp) + `Chart.categoricalConfig(rows, keyField)` build a `config` for categorical charts (pie/donut/treemap/sunburst/bubble) from the ramp, so their colours flow through `config` like keyed series and into the tooltip/legend. Categorical cells now read the colour from `config` (space-safe) instead of a per-key CSS variable.
  - **Tooltips:** `Chart.TooltipContent` accepts a `rows` override — composite charts (dumbbell, waterfall, drill sunburst) render derived rows through the same themed shell instead of bespoke tooltips.
  - **Data prep:** `Chart.toWaterfall`, `Chart.sumHierarchy`, `Chart.dumbbellRange` replace per-chart one-off transforms.
  - **Axes:** `Chart.margin`, `Chart.gridProps`, `Chart.axisProps` are spreadable defaults so charts stop re-specifying margin/grid/axis styling.

  All additive; existing chart APIs are unchanged.

- 3d4a0ce: Re-export `Chart.Sankey` — the native Recharts Sankey flow diagram — on the charting kit, and add a themed `Sankey` story (Data Display/Chart) showing the Eidra styling recipe: a per-node palette keyed by node name, source-tinted translucent link ribbons that brighten on hover, always-on node labels placed off the ribbons (left-edge nodes label left, sinks right, mid-stage above), and a themed tooltip that shows a node's throughput or a link's `source → target`, value and share of the source's outflow. The story models a monthly P&L flow (region → net revenue → personnel / other cost / EBITDA). `SankeyData` is re-exported for typing the `{ nodes, links }` input. Additive only.
- 04eb8e7: Add four chart types, a TreeView component, and a categorical colour ramp.

  **New categorical token ramp** — `--eidra-chart-1` … `--eidra-chart-8`: eight meaning-neutral qualitative hues for charts, each with a tuned dark-theme variant (saturated in light, brighter in dark) so series/slice colours stay distinct and legible in both themes. Additive; existing tokens are unchanged.

  **`Chart` — four new chart types** (re-exported Recharts primitives under the `Chart` namespace, themed with tokens, full + mini, light + dark):

  - **Radar** (`Chart.RadarChart` + `Radar`/`PolarGrid`/`PolarAngleAxis`/`PolarRadiusAxis`) — multi-series radar; polar grid/axes themed via new `:global(.recharts-polar-*)` rules.
  - **Pie & Donut** (`Chart.PieChart` + `Pie`) — categorical breakdown; slices map to `--eidra-chart-N` via `Chart.Cell`, separated by an `--eidra-surface` stroke. Ships a `Pie` and a `Donut` (with a centred total) story.
  - **Treemap** (`Chart.Treemap`) — hierarchical; a custom node renderer colours leaves by category token and only labels tiles big enough to fit.
  - **Sunburst** (`Chart.SunburstChart`) — self-contained hierarchical chart (per-node `fill`, children inherit); renders inside the standard responsive `Chart.Container`.

  Each chart gets a full story under `Data Display/Chart`, a `size="sm"` mini in the `Minis` gallery, and a card in `Patterns/Data Visualization`. Also adds a **Magic Quadrant** story (a 2×2 `ScatterChart` with named, tinted quadrants via the newly re-exported `Chart.ReferenceArea`, labelled points, and titled axes). New re-exports: `Chart.ReferenceArea`, and the `TreemapNode` / `SunburstData` types.

  **`TreeView`** (new component, `Data Display/TreeView`) — an interactive hierarchical tree: data-driven `items` API (`{ id, label, icon?, children?, disabled? }`), controlled/uncontrolled expansion (`expandedIds`/`defaultExpandedIds`) and single selection (`selectedId`/`defaultSelectedId`), optional per-node icons, and a rotating chevron. Full ARIA `tree` pattern — `role="tree"`/`treeitem"`/`"group"`, `aria-expanded`/`aria-selected`/`aria-level`/`aria-setsize`/`aria-posinset`, roving tabindex, and keyboard nav (Up/Down, Left/Right to collapse/expand or move to parent/child, Home/End, Enter/Space to select). CSS Module on tokens only, density-aware. Stories cover a file-explorer, controlled selection, compact density, a per-node **right-click `ContextMenu`**, and a **checkbox** multi-select tree (parent tri-state / cascade).

- df84d87: Make `data-density="compact"` noticeably denser (full density pass). Compact now:

  - **Shrinks the base reading size** 16px → 14px (`font-size` on the compact root) and drops control heights another notch (`--eidra-size-control-*`: sm 28→24px, md 32→28px, lg 40→36px).
  - **Tightens every component's compact block by two spacing steps from comfortable** (previously one). Padding and gap step down the ladder `6→4→3→2→1-5→1→0-5`, floored at `space-0-5` so nothing collapses to 0; large fonts (≥ base) step down two stops, floored at `sm`.

  Applied uniformly across all 41 density-aware components. Comfortable density is unchanged; only the compact scope is affected. The authoring convention in `base.css` is updated to the two-step rule for future components.

- d6b9704: Ship a Tailwind **v4** theme bridge so apps on Tailwind v4 (CSS-first) can use Eidra tokens as utilities.

  The existing `@eidra/tokens/tailwind` export is a **Tailwind v3 JS preset** (`presets: [require('@eidra/tokens/tailwind')]`). Tailwind v4 dropped JS-preset config in favour of a CSS `@theme`, so v4 apps couldn't use it and were hand-maintaining their own token→theme map in `globals.css` — which silently drifts from the tokens.

  **New export — `@eidra/tokens/tailwind.css` (and the same file re-shipped as `@eidra/react/tailwind.css`).** A generated CSS file that maps every `--eidra-*` token onto Tailwind v4's theme namespaces (`--color-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`, `--ease-*`) inside `@theme inline`, so utilities stay reactive to the live `var(--eidra-*)` values (light / dark / finance). It is generated from the same token walk as the v3 preset, so the two can't diverge.

  ```css
  /* app globals.css — Tailwind v4 */
  @import '@eidra/react/styles.css';
  @import 'tailwindcss';
  @import '@eidra/react/tailwind.css'; /* or @eidra/tokens/tailwind.css */
  ```

  The shipped file includes the `@layer` order and a `@theme { --*: initial }` reset (Eidra-only utilities); delete that block in your own copy if you want to keep Tailwind's default theme alongside. The v3 preset (`@eidra/tokens/tailwind`) is unchanged and still exported for v3 apps. See `docs/CONSUMING.md` §5.

- f8f1d73: `Timeline` gains an `orientation` prop. The default stays `'vertical'` (the stacked activity feed); `orientation="horizontal"` lays the items left-to-right along a horizontal rail — a step/progress reading for a few stages where width is plentiful (e.g. an approval flow across the top of a page), with the marker above each step and the title/timestamp beneath. Additive and non-breaking.
- 2b8ed7d: `Toast.Viewport` gains a `position` prop to anchor the toast stack to any corner or edge — `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` (defaults to `bottom-right`, unchanged). Placement is driven by a `data-position` attribute with a single `--_inset` distance (compact density tightens the inset). The Toast stories expose it as a "Viewport position" control.

### Patch Changes

- a34530d: Fix dark-theme legibility of the finance accent and of toned `EditableNumberCell` values, and stop a hovered editable cell from melting into its row.

  **Tokens** — the `--eidra-finance-accent*` family had no `[data-theme='dark']` entry, so `accent="finance"` repointed the accent to dark steel-blue (`#27567a`/`#1d4060`) that sat illegibly on dark surfaces (the brand orange accent already inverts per theme; finance never did). Adds a dark finance-accent ramp — lighter steel-blue primitives (`finance.blue-bright/-light/-deep`) and a `finance.accent*` group in `dark.json` that mirrors the brand inversion (lighter DEFAULT/active, darker subtle, black on-accent). Flows through every `accent="finance"` surface (DataGrid, `ThemeProvider`, `[data-accent='finance']`).

  **EditableNumberCell** — toned values (`tone`) coloured their text with the base tone token (red/green/orange-500), which dropped below the 4.5:1 AA floor on the hover background; danger-red negatives effectively vanished. Value text and the edit field now use the readable-on-surface tone foregrounds (`--eidra-success-fg`, `--eidra-warning-fg`, `--eidra-danger-fg`; accent uses `--eidra-accent-active`, since `--eidra-accent-fg` is the on-accent colour).

  **Editable-cell hover** — `EditableNumberCell`, `EditableTextCell` and `EditableSelectCell` now take the `--eidra-accent-subtle` wash on hover (the same "cell in play" colour as a committed override/rollup) instead of a neutral grey. The row already hovers to `--eidra-surface-hover`, so a neutral cell hover made the cell indistinguishable from its shaded row; the accent-subtle fill is a distinct colour channel and, being dark, keeps the `-fg` toned values well clear of AA.

  **Highlighted column** — a highlighted ("NOW") column painted a flat `accent-subtle` tint over its cells, which overrode the row background, so the column stayed frozen while the rest of a hovered row lifted to `--eidra-surface-hover`. Hovered-row highlighted cells now blend the column tint over the hover surface (`color-mix`, opaque so pinned cells stay solid) — the column lifts with the row yet still reads as the accent-tinted highlight. Per-cell value tones keep their fixed state tint.

  Untoned cells, override/aggregated affordances, and the markers (●/◆) are unchanged. Adds a dark-theme guard (`pnpm --filter @eidra/react test`) asserting: every toned value clears 4.5:1 on both the cell-hover and row-hover surfaces (brand and finance); the finance accent chrome clears the 3:1 graphical floor; the cell-hover colour stays distinct from the row-hover colour; and the hovered highlighted-column colour differs from both its resting tint and a plain hovered row while keeping body text legible — all parsed from the components' own CSS so none can silently regress.

- Updated dependencies [f5bee87]
- Updated dependencies [04eb8e7]
- Updated dependencies [a34530d]
- Updated dependencies [821004d]
- Updated dependencies [d6b9704]
  - @eidra/tokens@1.5.0
  - @eidra/icons@1.5.0

## 1.4.0

### Minor Changes

- 3107fe8: New components and DataGrid extensions distilled from a full sweep of the eidra-invoicing app (deduped against the existing library — most app "primitives" already had a DS home and were not rebuilt).

  **New components**

  - **PageHeader** (Layout) — a generic page title bar: optional breadcrumb row, prominent `<h1>` with optional muted subtitle, and a right-aligned action cluster.
  - **ActionBar** (Layout) — a selection-aware action bar (the generic form of an invoicing bulk-action bar): `selectedCount` summary, optional `message` slot, caller-supplied action buttons, an optional `sticky` mode that pins to the viewport bottom.
  - **Timeline** (Data Display) — a vertical activity feed: a connecting rail with a tone-coloured marker per item, title, optional muted timestamp and description. Data-driven `items` API.
  - **DescriptionList** (Data Display) — a semantic `<dl>` label/value list with `horizontal`/`vertical` orientation and multi-column layout, plus a `DescriptionList.Term`/`DescriptionList.Details` compound escape hatch.
  - **PeriodNavigator** (Navigation) — a compact `‹ value ›` prev/next stepper for moving through a discrete sequence (e.g. periods/months); fully domain-agnostic.

  **DataGrid extensions**

  - **EditableSelectCell** and **EditableTextCell** join the existing `EditableNumberCell` (text cell supports an optional `debounceMs`).
  - **Drag-fill**: opt-in per column via `fillable` (+ optional `fillValue`) and an `onFillRange(columnId, fromRowIndex, toRowIndex, value)` callback — drag a value down a contiguous column range. Fully no-op for grids that don't opt in.
  - **`EditableNumberCell` value tone**: a `tone` prop (`'neutral' | 'positive' | 'caution' | 'danger' | 'accent'`) colours the resting value text and the edit field with the matching theme-aware token (e.g. probability tiers). The override (●) and aggregated (◆) markers keep their accent colour and compose with `tone`.
  - **`EditableNumberCell` editable rollups**: `aggregated` now controls only the resting affordance (dashed border + ◆) and is independent of `disabled` — an aggregated cell is still click-to-edit, and an explicit `overridden` replaces the ◆ with ● (override wins). Combine `aggregated` with `disabled` for the old read-only rollup. (Previously `aggregated` forced read-only.)

  **New recipe stories** (composition only, no new component code): `Patterns/Funnel` and a `GlossaryTerm` recipe on the Tooltip page.

  **Overlap-audit follow-ups**

  - **`ToggleGroup` gains `appearance="segmented"`** (+ a group-level `size`) — a contiguous filled-track segmented control reproducing the former `SegmentedControl` visuals on Base UI Toggle children. **`SegmentedControl` has been removed** (breaking) — its capability now lives in `ToggleGroup`. Migrate `<SegmentedControl items value onValueChange />` to `<ToggleGroup.Root appearance="segmented" value={[v]} onValueChange={(v) => v[0] && setV(v[0])}>` with `<Toggle value="…">` segments (use a `Toggle`'s `render` prop for link mode).
  - **`Menu` gains radio items** — `Menu.RadioGroup`, `Menu.RadioItem`, `Menu.RadioItemIndicator` — for parity with `ContextMenu`.
  - **New `Foundations/Choosing Components` Storybook page** — a decision guide for picking between adjacent components (Statistic vs StatisticBar vs StatusStrip, Select vs Combobox vs Autocomplete, etc.).

  Deferred follow-up: grouped DataGrid header rows with bulk-action buttons (needs grid-level row-selection state + surgery to the multi-tier header render; left out to avoid destabilising pinning/header behaviour).

### Patch Changes

- @eidra/tokens@1.4.0
- @eidra/icons@1.4.0

## 1.3.0

### Minor Changes

- a68b337: Client Dashboard parity — extend two existing components (the dashboard is otherwise covered by the DataGrid, Combobox, SegmentedControl, Input, EmptyState, Spinner, Alert and Statistic primitives already shipped):

  - **`Chart` scatter/bubble support** — re-export Recharts `ScatterChart`, `Scatter`, and `ZAxis` under `Chart.*`, so apps can build scatter and bubble charts (bubble size via `ZAxis`) with the same themed `Chart.Container`/`TooltipContent`/`LegendContent`/`Cell`/`ReferenceLine` as the existing chart types. Adds a `Bubble` story (client revenue vs YoY growth, bubble size by total revenue, one series per size tier).
  - **`Toggle` `shape` prop** — `shape="pill"` renders a fully-rounded chip (default `'rect'` is unchanged), for the quick-filter chip pattern. Adds a `QuickFilterChips` story.
  - **`Chart` focus styling** — suppress the browser's default blue focus box on the (keyboard-focusable) chart surface and replace it with the token focus ring shown only for keyboard focus (`:focus-visible`), so clicking a chart no longer draws an unstyled box.

- 42fc45b: Project Economics parity — extend three existing primitives so the invoicing app's project-economics views (budget-burn header, accounting matrix) compose entirely from the design system. No domain components ship; the recipes live in Storybook (`Patterns/Project Economics`).

  - **`SegmentBar` threshold markers** — new `markers` prop (`{ value, label?, tone? }[]`) draws vertical lines over the bar, positioned on the same scale as `total`. Stacking bars with a shared `total` and the same marker `value` aligns the line across all of them — the "budget line" pattern. Adds `WithMarker` and `SharedBudgetLine` stories.
  - **`DataGrid` value-driven cell tinting** — new per-column `cellTone(value, row)` returning `'positive' | 'negative' | 'caution' | 'muted'` tints individual cells (e.g. positive WIP green, negative deferred red, pending gold, locked grey). Composes with `EditableNumberCell` and overlays a `highlighted` column.
  - **`DataGrid` cell drill-down** — new per-column `renderCellDetail(row, col)` makes a column's cells clickable: clicking opens a full-width detail row beneath (one open at a time across the grid). Adds a `CellTonesAndDrilldown` story.
  - **`Statistic` accent border** — new `accent` prop draws a tone-coloured left border (with inset) for the accented KPI-card row. Adds an `AccentedKpiRow` story.

  Also: renamed the `Chart` `ComposedChart` stories to be type-led for consistency (`Forecast` → `Composed`, `Headcount` → `ComposedBarLine`); the use-case is kept in each story's description.

- 9b460a7: `ThemeProvider` gains an **`accent`** prop (`'brand'` | `'finance'`, default `'brand'`). `accent="finance"` repoints the accent tokens to the financial data-viz blue (`--eidra-finance-accent*`) for the whole scope — mirroring `DataGrid`'s `accent` prop but at the theme level — and propagates to portaled components (menus, dialogs, tooltips) via the scope context. Implemented as a `[data-accent='finance']` token repoint in the base layer, so setting `data-accent="finance"` on your own root works too. The `Foundations/Theming` story gains an `accent` control plus an `Accent` showcase.

  Also: showcase stories that ignore args (`Statistic`'s `AccentedKpiRow`, `ThemeProvider`'s `Matrix`/`Accent`) now disable the Controls panel, which previously showed inapplicable controls.

### Patch Changes

- 51c1fed: Component audit follow-ups — consistency fixes from a catalog-wide review:

  - **Theme and density now propagate into portaled popups (bulletproof).** `ThemeProvider` publishes its `{ theme, density }` via context, and every portaled surface — `Dialog`, `AlertDialog`, `Popover`, `Menu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Select`, `Combobox`, `Autocomplete`, `Tooltip`, `PreviewCard`, `Toast` — stamps `data-theme`/`data-density` onto its positioner/popup. Popups render outside the `eidra-root` subtree (Base UI portals to `document.body`), so they previously missed both the theme (dark popups rendered light) and compact density (the trigger shrank but its menu/dialog/list stayed comfortable). Now they match the scope regardless of where it sits. Without a `ThemeProvider` above, behaviour is unchanged.
  - **Compact density blocks for overlays/menus/dropdowns.** Added `[data-density='compact']` blocks (documented `base.css` convention — both padding axes one step down) to the components above, and mirrored the control-size compact remap onto the bare `[data-density='compact']` attribute so controls rendered inside a portal shrink too.
  - **`Menubar` arrow** now uses the shared `fill`/`stroke` token treatment like the other arrows, removing the only hardcoded colour (`rgb(0 0 0 / 0.1)` drop-shadow) in the catalog.
  - **`Field`** ships its own Storybook story (`Forms/Field`) + autodocs page; previously it was only demonstrated inside the `Input` stories.

- 3afab36: Storybook + catalog taxonomy cleanup, now documented in `docs/STORYBOOK.md` (three tiers: `Foundations/*`, `‹Function›/‹Component›`, `Patterns/*`). No component code changes — story titles and the generated catalog/`llms.txt` categories only:

  - Folded the redundant `Inputs` category into `Forms` (`FilterSelect`, `SegmentedControl`).
  - Moved the cross-component `Data Visualization` gallery from `Foundations` to `Patterns`.
  - Moved the `Statistic` KPI compositions (KPI bar, stat-card grid) to a new `Patterns/KPIs` page; `Statistic`'s own page keeps its prop/variant stories.
  - Added a `Foundations/Theming` page for `ThemeProvider` (was uncategorised).
  - @eidra/tokens@1.3.0
  - @eidra/icons@1.3.0

## 1.2.0

### Minor Changes

- e0f7c8e: Add four `DataGrid` options that unblock 100% sizing/layout parity with the eidra-invoicing "Sold & Forecast" table.

  - `tableLayout?: 'auto' | 'fixed'` (default `'auto'`) — `'fixed'` sets `table-layout: fixed` and sizes columns strictly from their `width` (falling back to a default), so rendered widths equal declared widths and **multiple pinned columns keep their sticky offsets aligned** during horizontal scroll (fixes pinned-column bleed).
  - `totalsPlacement?: 'bottom' | 'top'` (default `'bottom'`) — `'top'` stacks the totals/aggregate row directly under the header, sticky on vertical scroll, with its pinned cells sticky on horizontal scroll (header height is measured via `ResizeObserver`).
  - Column `highlighted?: boolean` + `highlightTone?: 'accent' | 'finance'` — tints a whole column (header → body → totals) with a subtle token background and a 2px top accent border, for flagging the current "NOW" column.
  - `density?: 'comfortable' | 'compact'` — per-instance row density (also honours the ambient `data-density` scope), so one page can mix relaxed and information-dense grids. Compact reduces row padding to `--eidra-space-1` and numerals to `--eidra-font-size-xs`.

  All four use existing tokens (no new colours) and are additive — existing `DataGrid` usage is unchanged.

- 8b0d712: Add the components needed to rebuild the eidra-invoicing **Sold & Forecast** pages beyond the DataGrid, plus a density and charting polish.

  - **`FilterSelect`** — a compact multi-select filter pill: a trigger that summarises the selection (0→placeholder, 1→value, ≥2→`"{n} {noun}s"`), opening a popover with a searchable checkbox list, a selection count, and clear-all. Built on Base UI Popover + the DS `Checkbox`/`Button`.
  - **`StatisticBar`** — an inline strip of labelled metrics separated by dividers, with finance/accent tones, sizes, captions, and an `align="end"` trailing slot. Mono/tabular values.
  - **`SegmentBar`** — a stacked, proportional, tinted composition bar (defaults to the finance revenue palette) with optional inline labels and legend; degrades to a single segment.
  - **`SegmentedControl`** — a segmented view switcher; button mode is a radiogroup with arrow-key roving focus, or delegate segments to router links via an item `render` (no router coupling).
  - **`Freshness`** — a status dot + label + compact relative time (`● Data 12 min ago`) with `staleAfter` tone escalation and an optional `pulse`.
  - **Currency utils** — `formatCurrency` (`€2,916`), `formatCompactCurrency` (`€1.2M`, relocated from `Chart` and still re-exported), and `formatCurrencyThousands` (`€2,916k`).
  - **`Chart.seriesDefaults`** — `{ isAnimationActive: false }` to spread onto `Bar`/`Line`/`Area`, avoiding the first-frame blank flash and empty SSR/headless captures.
  - **Compact density across the catalog** — every component with a meaningful density dimension now honours the ambient `data-density="compact"` scope. Control components already scaled via the `--eidra-size-control-*` tokens; this adds compact rules (tighter padding/gaps, smaller control boxes, thinner bars, one-step-down large fonts) to the data-display and form components that previously used fixed spacing: DataGrid, StatisticBar, SegmentBar, StatusStrip, Statistic, Accordion, Alert, Badge, Card, Kbd, Tabs, Toast, Tooltip, PreviewCard, EmptyState, Checkbox, Radio, Switch, Field, Fieldset, Breadcrumbs, Meter, Progress, SaveIndicator, Freshness. (Components with no density dimension — Separator, Spinner, Typography, Form, ScrollArea, Collapsible, Chart, ThemeProvider — are intentionally untouched.) DataGrid compact rows are tighter (~24px).

### Patch Changes

- 2934c57: Fix `DataGrid` pinned columns overlapping (or showing gaps) under `table-layout: auto`. Sticky-left offsets were computed from each column's _declared_ `width`, but under auto layout the browser stretches/shrinks columns to fit the container, so the offsets drifted from the _rendered_ widths — most visibly in a narrow context like the Storybook Docs tab. The grid now measures the rendered `<col>` widths (via a `ResizeObserver`) and recomputes the offsets, so multiple pinned columns stay aligned in both `auto` and `fixed` layouts at any container width. `tableLayout="fixed"` is no longer needed just to avoid overlap — only for exact, content-independent column widths.
  - @eidra/tokens@1.2.0
  - @eidra/icons@1.2.0

## 1.1.0

### Minor Changes

- 2bc90aa: Migrate from the retired `@base-ui-components/react@1.0.0-rc.0` to the renamed, actively-maintained `@base-ui/react@^1.5.0`. The old package was frozen at a release candidate and deprecated ("renamed to @base-ui/react"); this moves onto stable 1.x. Import paths were renamed across all components and ref type annotations updated for Base UI 1.5's stricter element typings. No component API or styling changes. Note: per Base UI's stable release, unchecked Checkbox/Switch no longer submit an "off" value in forms unless `uncheckedValue` is set.
- 2bc90aa: Add a composable **charting kit** and **StatusStrip**, and fix a build regression.

  - `Chart` — atomic, composable charting on Recharts, themed with Eidra tokens: `Chart.Container` (responsive + injects series colours as `--color-<key>` from a `config`), `Chart.TooltipContent` and `Chart.LegendContent` (themed, toggleable), the `formatCompactCurrency` helper, and re-exported Recharts primitives (`Chart.ComposedChart`, `Bar`, `Line`, `Cell`, `LabelList`, axes, …) so apps build any chart without importing Recharts directly. Recharts (`^3.7.0`) is a new dependency (externalised, not bundled).
  - `StatusStrip` + `StatusStrip.Cell` — a RAG-coded heat-row (e.g. monthly momentum), tinted from the finance palette.
  - Fix: the build now externalises `@base-ui/react` (the externals regex still matched the pre-rename `@base-ui-components/*`, so Base UI was being bundled into `dist`). This shrinks `dist/index.js` from ~728 kB to ~90 kB and avoids duplicate Base UI instances in consumers.

### Patch Changes

- a5c56a6: Move `@eidra/tokens` and `@eidra/icons` from `peerDependencies` to `dependencies`. They aren't imported by react's runtime (tokens CSS is inlined at build; icons is imported by consumers directly), and classifying them as peers caused Changesets to force a major version bump on every tokens/icons change.
- Updated dependencies [2bc90aa]
  - @eidra/tokens@1.1.0
  - @eidra/icons@1.1.0

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
