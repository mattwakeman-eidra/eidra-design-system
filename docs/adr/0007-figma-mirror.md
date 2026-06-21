# Mirror the design system in Figma, code-canon and one-way

The design system is reproduced in Figma as a **mirror, not a source**. Truth stays in code: DTCG tokens flow code→Figma, the component kit is generated from code and maintained best-effort, design-side ideas return only as **code proposals**, and the code↔design link is made explicit with **Code Connect** rather than any sync-back. Figma exists so designers can sketch new screens on real Eidra primitives and browse the system Figma-natively. The sync is **agent-driven through the Figma MCP**, run at release time rather than by a hosted plugin or CI job.

## Why

The repo already holds the system in its authoritative form: DTCG JSON for tokens, React + Base UI + CSS Modules for components, and the npm tarballs are what apps actually consume. A Figma file is therefore a _second representation of the same system_, and two representations always drift. The only question is which one wins when they disagree.

Code has to win. The build pipeline (`pnpm build:tokens`, changesets, GitHub Releases) is built on "edit the JSON, never the generated output." If Figma were canon, every colour tweak would have to round-trip _out_ of Figma before it could ship, slower and more fragile than today. Bidirectional sync was rejected for the same reason: round-tripping mangles composite typography and aliased references, and it puts merge conflicts on _generated_ files.

The two halves have opposite economics, and conflating them is how design-system Figma files rot:

- **Tokens are structured data.** They sync to Figma Variables and stay honest.
- **Components are hand-built vector/auto-layout objects.** No tool turns React + CSS into faithful Figma components with certainty, though agent generation now gets part of the way (see below). They are largely human-owned and they drift.

With no dedicated design headcount (the system is maintained code-first), the design is tuned to **minimise the hand-built surface and maximise the auto-synced surface**, so one person can keep it alive.

## How this differs from Tegel

Worth stating, because the inversion is the cleanest justification for the whole design. Scania's Tegel runs the **opposite** direction of truth:

- **Tegel is design-canon for tokens.** Its `figma-to-tokens.mjs` converts raw Figma Variable exports into Style Dictionary source (resolving Figma aliases, flattening hex+alpha). Figma is upstream; code consumes it.
- **Tegel's Figma components are the design-owned source**, and the Stencil code implements to them. No code→Figma generation.
- **Tegel uses no Code Connect** (verified: zero references in the repo), which is structurally sensible: its artifact is framework-agnostic web components, so there is no single framework's code to point a mapping at.

That fits a large org with dedicated design headcount. Eidra is the inverse on every axis: code-canon, code→Figma mirror, solo code-first maintainer, and React-only, which is precisely why **Code Connect is viable and additive for us where it isn't for Tegel**. Our one-way stance is not lagging Tegel; it is the correct inversion for our org shape.

## How

**Source of truth.** Code → Figma, one way. Figma proposes; code disposes.

**Tokens → Figma Variables, agent-driven via the Figma MCP.** Claude reads the DTCG JSON in `packages/tokens/tokens/` and creates/updates the Variable collections in the library file through the MCP (design edits via the `use_figma` workflow; read-back/verification via `get_variable_defs`), converting the three shape mismatches inline. Three collections mirror the JSON:

- `Primitives`: raw palette + scales, 1 mode.
- `Theme`: semantic aliases resolving to primitives, **2 modes: light / dark**.

**Theme is the only variable-mode axis.** Density is _not_ a variable collection: there are no density tokens, and the primitive scale does not change between densities. Compact is per-component CSS (each component steps its spacing/size down two steps, and the root drops the base reading size 16→14px). In Figma it is a **component-variant property** (`comfortable` / `compact`) on the Tier-1 components, not a variable mode. The two axes still compose independently (a compact component on a dark frame), mirroring how `data-theme` and `data-density` stack in CSS, but through different Figma mechanisms: Theme via variable modes, density via variant props.

This runs **interactively at release time**: a human invokes the agent to push. The MCP is a session bridge, not a headless/cron primitive, so there is no unattended sync guarantee; that is the trade for not standing up a hosted plugin. Two documented fallbacks exist if a hands-off CI sync is ever needed: **Tokens Studio** (git-backed, free, deterministic) or the **REST Variables API** (Enterprise plan, colour + dimension only). Both are bolt-ons, not prerequisites (see `docs/FIGMA.md`).

**Components, generation-first (three tiers):**

- **Tier 1: ~18 core components.** Generated from code via the Figma MCP's library generation (`/figma-generate-library`) where fidelity holds, hand-tuned otherwise; variant properties (including a `density` comfortable/compact variant) bound to variables, theme-mode-switchable. The pieces designers assemble screens from: Button, Input, Field, Select, Checkbox, Radio, Switch, NumberField, **OTPField**, Card, Badge, Alert, Avatar, Tabs, Menu, Dialog, **Drawer**, PageHeader.
- **Tier 2: every other visual component, imported from Storybook** (an HTML/URL-import plugin against the deployed Storybook). The stories already enumerate the full state matrix, so coverage is free; regenerate by re-import on release, not by hand-redraw. Imports are flattened frames, not true components.
- **Tier 3: logic/runtime/data components documented, not faked** (`ThemeProvider`, `Form`, `Toast`, `SaveIndicator`, `Freshness`, `Chart`, `DataGrid`). Reference cards saying "code-only, mock with a screenshot." Faking these is strictly worse than omitting them.

(The kit covers a 60-component system; Tier 1 is the assembled-from set, Tiers 2 and 3 are browse/reference.)

A **Foundations** page (colour swatches, type ramp, spacing scale, elevation, icon grid) is fully auto-synced from variables: the "feels complete / Figma-native view" that cannot lie.

**Code Connect, the explicit code↔design link.** Each Tier-1 Figma component is mapped to its Eidra React source via Code Connect (MCP: `get_code_connect_suggestions` → `add_code_connect_map` → `send_code_connect_mappings`; the `/figma-code-connect` skill drives it). Designers see the real component code in Dev Mode. This is a *link, not a sync*: it gives the mirror a verifiable spine and reinforces code-canon without round-tripping anything back into the repo.

**Governance keeps code canon:**

- **Lock.** The library file (variables + master components) is edit-restricted to the maintainer and published as a read-only team library. The agent-driven push is authoritative and destructive: a hand-edited variable is overwritten on the next push, so editing it is futile.
- **Detect.** A lint plugin on consumer files flags off-variable colour/spacing and detached instances; stale Code Connect maps are an additional drift signal.
- **Valve.** A **Proposals** page is the designer inbox for off-system ideas; it is drained into code (DTCG/component PRs) on each release, and the next sync carries the result back.

The runbook for setup + maintenance lives in [`docs/FIGMA.md`](../FIGMA.md).

## Consequences

- Tokens stay correct across every tier, but the sync is **agent-run and interactive**: it depends on someone invoking the push at release time, with no unattended guarantee. Validate the first MCP variable push, since agentic variable creation is less battle-tested than a dedicated token plugin; if it proves fiddly, fall back to Tokens Studio without changing the canon direction.
- **Code Connect adds light upkeep**: maps need updating when a component's API or source path changes, and a stale map is now a divergence signal alongside detached instances. In return the mirror gains a real code↔design link that Tegel's multi-framework model cannot offer.
- Tier-1 components are the only thing that still drifts by hand, for whatever generation cannot reproduce. Contained to ~18 components, accepted as the price of a one-person-maintainable mirror. They are sketching aids, not specs; Storybook remains the contract for exact states.
- Three known token-shape wrinkles are handled by the agent at push time (documented in `docs/FIGMA.md`): shadows are CSS strings rather than structured objects; dimensions are `rem`/`em` rather than Figma-unit numbers; `duration`/`easing`/`cubicBezier` have no Figma variable equivalent and stay code-only.
- A new line item enters the release ritual ([`docs/RELEASING.md`](../RELEASING.md)): run the MCP token push, re-import Tier-2 stories, eyeball the Tier-1 set, refresh Code Connect maps, triage the Proposals page.
