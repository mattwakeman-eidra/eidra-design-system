# Component overlap & duplication audit

**Date:** 2026-06-17 (snapshot) · **Scope:** all 58 `@eidra/react` components · **Status:** **actioned** — Tier 1 resolved in v1.4.0 (SegmentedControl→ToggleGroup merge; Menu radio parity); Tier 2 confusable pairs documented via the `Foundations/Choosing Components` page + sharpened docstrings.

Run after a dogfooding pass surfaced several components that *felt* redundant (Statistic/StatisticBar/StatusStrip, FacetBar/ActionBar/ToggleGroup). Each overlap-prone cluster was read at source (props + CSS + stories) and adjudicated. Methodology: classify every adjacent pair/group as **TRUE DUPLICATE**, **PARTIAL OVERLAP**, or **DISTINCT-BUT-CONFUSABLE**, then recommend MERGE / DEPRECATE / KEEP + clarify.

## Headline

**The library is not bloated with true duplicates.** Things feel redundant because the **boundaries between adjacent components aren't documented**, not because the components are the same. Most apparent overlaps are deliberate — the DS mirrors Base UI primitives, and Base UI itself separates Accordion/Collapsible, Popover/Tooltip/PreviewCard, Meter/Progress, and Menu/ContextMenu for sound accessibility reasons.

There is exactly **one** genuine "two implementations in the same space" case (SegmentedControl ↔ ToggleGroup) plus a small API-parity nit (Menu vs ContextMenu). Everything else is a **documentation** problem.

## Action tracker

| # | Item | Type | Recommendation | Status |
|---|------|------|----------------|--------|
| 1 | SegmentedControl ↔ ToggleGroup | Real overlap (bespoke vs Base UI) | Merged: `ToggleGroup` gained `appearance="segmented"`; `SegmentedControl` **removed** (single consumer migrated) | ✅ Done (v1.4.0) |
| 2 | Menu lacks ContextMenu's `RadioGroup`/`RadioItem` | API parity | Added `Menu.RadioGroup` / `Menu.RadioItem` / `Menu.RadioItemIndicator` | ✅ Done (v1.4.0) |
| 3 | Tier-2 "choosing between similar components" guide | Docs | Added `Foundations/Choosing Components` Storybook page | ✅ Done (v1.4.0) |

*(During dogfooding the FacetBar recipe was already removed — it was just `ToggleGroup` + `Badge`.)*

---

## Tier 1 — Genuine overlap worth a code decision

### 1. SegmentedControl ↔ ToggleGroup (single-select)
- **Type:** PARTIAL OVERLAP — real.
- **Why it's real:** SegmentedControl is **bespoke** (built from scratch); ToggleGroup wraps the Base UI primitive. Both render a row of mutually-exclusive options with roving focus. This is the only "two parallel implementations" case in the library.
- **Unique to SegmentedControl:** declarative `items` array, router-link delegation via `render`, filled-track visual, density-aware sizing, `role=radiogroup`.
- **Unique to ToggleGroup:** composition of `Toggle` children (per-item `variant`/`shape`/icon), single **and** multi-select via `multiple`, bordered container with dividers.
- **Recommendation:** ~~keep both with a sharp boundary, or merge.~~ **Resolved (v1.4.0): merged.** `ToggleGroup` gained `appearance="segmented"` (+ group `size`) reproducing the SegmentedControl visuals on Base UI Toggle children. `SegmentedControl` was **removed** (the only consumer was migrated) — breaking, but managed.

### 2. Menu ↔ ContextMenu (API parity)
- **Type:** DISTINCT triggers, but inconsistent API.
- **Why:** same Base UI Menu family, intentionally different triggers (button vs right-click/long-press) — fine. But **ContextMenu exposes `RadioGroup`/`RadioItem`/`RadioItemIndicator` and Menu does not.**
- **Recommendation:** keep both (trigger variants); ~~add the radio parts to Menu~~ **Resolved (v1.4.0):** added `Menu.RadioGroup` / `Menu.RadioItem` / `Menu.RadioItemIndicator`.

---

## Tier 2 — Distinct but confusable → documentation, not deletion

Each came back "keep + clarify." This is the bulk of the "why do we have three of these?" reaction. Fix with a **"Choosing between similar components"** guide + sharpened one-line docstrings/story blurbs.

| Cluster | Distinction (one line each) |
|---|---|
| **Statistic / StatisticBar / StatusStrip** | single rich metric (delta/progress/accent-border) · inline divider-separated figures · RAG heat-cells (per-cell background tint) |
| **Accordion / Collapsible** | multi-section disclosure w/ heading semantics · single collapsible region. *Flagged structurally duplicate, but mirrors Base UI's own split — keep + document; merge only to diverge from Base UI.* |
| **Popover / Tooltip / PreviewCard** | click panel (`role=dialog`) · hover microcopy (`role=tooltip`) · hover-link rich preview. *Same shape, but different ARIA roles + triggers — do **not** merge (would discard accessibility).* |
| **Dialog / AlertDialog** | generic modal for content/forms — dismisses on outside-click/Esc · `alertdialog` role for destructive/critical choices — backdrop does **not** dismiss (Esc still closes), so a stray click can't lose the decision |
| **Meter / Progress** | scalar measurement vs a range (`<meter>`) · task completion + indeterminate state (`<progress>`) |
| **Select / Combobox / Autocomplete / FilterSelect** | fixed non-searchable list · searchable multi-select w/ chips · single-select w/ suggestion/complete · high-level filter pill |
| **Switch / Checkbox** | system on/off toggle (animated) · selection/agreement (+ indeterminate, grouping) |
| **ToggleGroup / RadioGroup / CheckboxGroup** | button-cluster single/multi · form single-choice · form multi-choice |
| **Alert / Toast** | persistent inline callout · transient stacked notification (auto-dismiss) |
| **Badge / Freshness** | static category/status label · temporal/data-age signal (dot + relative time + pulse) |
| **SaveIndicator / Toast** | inline field-level save tick · system-wide async confirmation |
| **Spinner / Skeleton** | indeterminate progress · layout-shaped placeholder (prevents layout shift) |
| **Tabs / NavigationMenu / Menubar** | in-page section switching · site-wide hierarchical flyouts · app-style File/Edit/View menus |
| **ActionBar / Toolbar** | selection-aware bulk-action bar (sticky) · inline editor/formatting control grouping |
| **PageHeader / Breadcrumbs** | page title/subtitle/actions container (has a breadcrumbs slot) · standalone breadcrumb `<nav>`. Complementary — clarify the slot. |

---

## Tier 3 — Clean, no overlap concern

SegmentBar · Slider · ScrollArea · EmptyState · Field / Fieldset / Form (nest cleanly) · Card · DataGrid · Chart · Timeline · DescriptionList · Avatar · Kbd · Separator · Typography · Button · Input · NumberField · PeriodNavigator.

---

## Recommended sequencing

1. **Tier 2 docs first** (highest leverage, lowest risk) — a Foundations "Choosing between similar components" page + CONTEXT.md section + sharpened docstrings. Directly removes the "feels redundant" friction without API churn.
2. **Item 2 (Menu radio parity)** — small, additive.
3. **Item 1 (SegmentedControl ↔ ToggleGroup)** — the only decision with API consequences; settle boundary-vs-merge deliberately.
