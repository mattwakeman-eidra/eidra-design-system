---
"@eidra/react": minor
---

New components and DataGrid extensions distilled from a full sweep of the eidra-invoicing app (deduped against the existing library — most app "primitives" already had a DS home and were not rebuilt).

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

- **`ToggleGroup` gains `appearance="segmented"`** (+ a group-level `size`) — a contiguous filled-track segmented control reproducing the former `SegmentedControl` visuals on Base UI Toggle children. **`SegmentedControl` is now deprecated**: it's a thin wrapper that delegates to `ToggleGroup appearance="segmented"` (no behavioural/visual change for existing callers; migrate to `ToggleGroup` when convenient).
- **`Menu` gains radio items** — `Menu.RadioGroup`, `Menu.RadioItem`, `Menu.RadioItemIndicator` — for parity with `ContextMenu`.
- **New `Foundations/Choosing Components` Storybook page** — a decision guide for picking between adjacent components (Statistic vs StatisticBar vs StatusStrip, Select vs Combobox vs Autocomplete, etc.).

Deferred follow-up: grouped DataGrid header rows with bulk-action buttons (needs grid-level row-selection state + surgery to the multi-tier header render; left out to avoid destabilising pinning/header behaviour).
