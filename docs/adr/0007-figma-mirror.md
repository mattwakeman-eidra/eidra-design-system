# Mirror the design system in Figma, code-canon and one-way

The design system is reproduced in Figma as a **mirror, not a source**. Truth stays in code: DTCG tokens flow code→Figma automatically, the component kit is built once and maintained best-effort, and design-side ideas return only as **code proposals** — never as a sync back into the repo. Figma exists so designers can sketch new screens on real Eidra primitives and browse the system in a Figma-native way.

## Why

The repo already holds the system in its authoritative form — DTCG JSON for tokens, React + Base UI + CSS Modules for components — and the npm tarballs are what apps actually consume. A Figma file is therefore a _second representation of the same system_, and two representations always drift. The only question is which one wins when they disagree.

Code has to win. The build pipeline (`pnpm build:tokens`, changesets, GitHub Releases) is built on "edit the JSON, never the generated output." If Figma were canon, every colour tweak would have to round-trip _out_ of Figma before it could ship — slower and more fragile than today. Bidirectional sync was rejected for the same reason: round-tripping mangles composite typography and aliased references, and it puts merge conflicts on _generated_ files.

The two halves have opposite economics, and conflating them is how design-system Figma files rot:

- **Tokens are structured data.** They sync to Figma Variables automatically and stay honest forever.
- **Components are hand-built vector/auto-layout objects.** No automated path turns React + CSS into faithful Figma components. They are human-owned and they drift.

With no dedicated design headcount (the system is maintained code-first), the design is tuned to **minimise the hand-built surface and maximise the auto-synced surface**, so one person can keep it alive.

## How

**Source of truth.** Code → Figma, one way. Figma proposes; code disposes.

**Tokens → Figma Variables** via **Tokens Studio** (git-backed, reads the existing DTCG JSON). Three collections mirror the JSON:

- `Primitives` — raw palette + scales, 1 mode.
- `Theme` — semantic aliases resolving to primitives, **2 modes: light / dark**.
- `Density` — spacing/sizing/base-type, **2 modes: comfortable / compact**.

Modes apply per-collection on a frame, so `Theme=Dark` + `Density=Compact` compose without multiplying — mirroring how `data-theme` and `data-density` stack independently in CSS. An optional REST Variables API script can drive the sync from CI **only on Figma Enterprise**, and even then only for colour + dimension; it is a bolt-on, not a prerequisite.

**Components — a three-tier hybrid:**

- **Tier 1 — ~15 core, hand-built true components** (Button, Input, Field, Select, Checkbox, Radio, Switch, NumberField, Card, Badge, Alert, Avatar, Tabs, Menu, Dialog, PageHeader). Variant properties, bound to variables, mode-switchable. The pieces designers assemble screens from.
- **Tier 2 — every other visual component, imported from Storybook** (an HTML/URL-import plugin against the deployed Storybook). The stories already enumerate the full state matrix, so coverage is free; regenerate by re-import on release, not by hand-redraw. Imports are flattened frames, not true components.
- **Tier 3 — logic/runtime/data components documented, not faked** (`ThemeProvider`, `Form`, `Toast`, `SaveIndicator`, `Freshness`, `Chart`, `DataGrid`). Reference cards saying "code-only — mock with a screenshot." Faking these is strictly worse than omitting them.

A **Foundations** page (colour swatches, type ramp, spacing scale, elevation, icon grid) is fully auto-synced from variables — the "feels complete / Figma-native view" that cannot lie.

**Governance keeps code canon:**

- **Lock** — the library file (variables + master components) is edit-restricted to the maintainer and published as a read-only team library. The token sync is authoritative and destructive: a hand-edited variable is overwritten on the next push, so editing it is futile.
- **Detect** — a lint plugin on consumer files flags off-variable colour/spacing and detached instances.
- **Valve** — a **Proposals** page is the designer inbox for off-system ideas; it is drained into code (DTCG/component PRs) on each release, and the next sync carries the result back.

The runbook for setup + maintenance lives in [`docs/FIGMA.md`](../FIGMA.md).

## Consequences

- Tokens stay correct for free; the Foundations view and all variable bindings update on sync across every tier.
- Tier-1 components are the only thing that still drifts by hand. With solo best-effort maintenance they will lag code by some amount — contained to ~15 components, accepted as the price of a one-person-maintainable mirror. They are sketching aids, not specs; Storybook remains the contract for exact states.
- Three known token-shape wrinkles need a transform step before Tokens Studio import, not a JSON rewrite (documented in `docs/FIGMA.md`): shadows are CSS strings rather than structured objects; dimensions are `rem`/`em` rather than Figma-unit numbers; `duration`/`easing`/`cubicBezier` have no Figma variable equivalent and stay code-only.
- A new line item enters the release ritual ([`docs/RELEASING.md`](../RELEASING.md)): push tokens, re-import Tier-2 stories, eyeball the Tier-1 set, triage the Proposals page.
