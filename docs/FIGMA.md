# Figma mirror: setup and maintenance

A Figma reproduction of the Eidra Design System so designers can **sketch new screens on real primitives** and **browse the system Figma-natively**. It is a one-way mirror: code is canon, Figma is generated/maintained from it, and design ideas return only as code proposals. The rationale and trade-offs are in ADR [`0007`](./adr/0007-figma-mirror.md); this file is the how-to.

## Mental model (read once)

- **Code → Figma, one way.** Never hand-edit synced variables; the next push overwrites them.
- **Tokens auto-sync; components are generated/import-maintained.** Different economics, different upkeep.
- **Figma proposes, code disposes.** Off-system ideas become DTCG/component PRs, then sync back.
- **The link is Code Connect, not a sync.** Figma components point at their React source; nothing flows back except a human-filed proposal.

## Token sync (Figma MCP, agent-driven)

**Mechanism:** the **Figma MCP**, driven by Claude in-session. Claude reads the DTCG JSON in `packages/tokens/tokens/`, creates/updates the Variable collections in the library file (design edits via the `use_figma` workflow / `/figma-use` skill), and reads them back with `get_variable_defs` to verify. It runs **at release time when a human invokes the push**; the MCP is a session bridge, not a cron job, so there is no unattended sync.

**Fallbacks (only if a hands-off CI sync is ever needed):**

- **Tokens Studio** plugin, git-backed, reading the same DTCG JSON. Free, deterministic, works headless. The cleanest non-agent path.
- **Figma REST Variables API** from CI. Enterprise plan only, colour + dimension only. Treat as a later bolt-on.

Whichever mechanism, the **collection shape is the same**:

| Collection   | Source                                    | Modes           |
| ------------ | ----------------------------------------- | --------------- |
| `Primitives` | `tokens/primitives/*.json`                | 1 (no mode)     |
| `Theme`      | `tokens/semantic/light.json`, `dark.json` | `light`, `dark` |

Semantic variables in `Theme` **alias** the `Primitives` collection (a Figma variable reference), so the primitive→semantic graph is preserved.

**Density is deliberately not a collection.** There are no density tokens and the primitive scale does not change between densities: compact is per-component CSS (each component steps its spacing/size down, the root drops the base reading size 16→14px). So density is a **component-variant property** (`comfortable` / `compact`), built into the Tier-1 components, not a variable mode. Theme and density still compose independently (a compact component on a dark frame), but Theme is a variable-mode axis and density is a variant axis.

### Schema fit: what's clean, what needs conversion

Verified against the current token JSON. Most types map cleanly; three wrinkles need a **conversion the agent applies at push time** (or, on the Tokens Studio path, a Style Dictionary format that emits a Tokens-Studio-friendly file alongside the CSS). Either way it is _not_ a hand-edit of the source.

| Token group                            | `$type`                   | Maps to            | Status                                                                                                                |
| -------------------------------------- | ------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `color.*`, `semantic.*`                | `color`                   | COLOR variable     | clean; aliases preserved                                                                                             |
| `space`, `radius`, `size`, `font.size` | `dimension` (rem)         | FLOAT variable     | convert `rem`→px (×16); Figma FLOAT variables are unitless px                                                        |
| `font.letter-spacing`                  | `dimension` (em)          | text-style prop    | convert `em`→% for text styles                                                                                       |
| `font.family`                          | `fontFamily`              | STRING variable    | clean (array → primary family)                                                                                       |
| `font.weight`                          | `fontWeight`              | STRING/FLOAT       | clean                                                                                                                |
| `font.line-height`                     | `number`                  | FLOAT / text-style | as variable; convert to %/px for text styles                                                                         |
| `z.*`                                  | `number`                  | FLOAT variable     | clean                                                                                                                |
| `shadow.*`                             | `shadow`                  | EFFECT style       | values are **CSS strings**, not structured `{offsetX,offsetY,blur,spread,color}`; parse into a structured shadow     |
| `duration.*`, `easing.*`               | `duration`, `cubicBezier` | none               | no Figma variable equivalent; stays code-only, document on Foundations                                              |

**Typography and effects are not variables.** Figma text styles and effect styles are separate surfaces, generated from the composite tokens. The density-driven base size (16→14px) can't live in a static text style: bind a **number variable** to the text layer's font-size instead.

**`DEFAULT` keys:** semantic groups use the Tailwind `DEFAULT` convention (`bg.DEFAULT`), which imports as a variable literally named `bg/DEFAULT`. Either accept it or rename to `bg/base` in the conversion; cosmetic, decide once.

## Component build (generation-first, three tiers)

| Tier                 | What                                                                                                                                       | How                                                                                | Upkeep                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------- |
| **1: Core (~18)**    | Button, Input, Field, Select, Checkbox, Radio, Switch, NumberField, OTPField, Card, Badge, Alert, Avatar, Tabs, Menu, Dialog, Drawer, PageHeader | Generate from code via `/figma-generate-library`; hand-tune where fidelity falls short. Variant props (incl. a `density` comfortable/compact variant) **bound to variables**, theme-mode-switchable. | Regenerate + eyeball each release |
| **2: Other visual**  | every remaining drawable component                                                                                                         | Import rendered stories from the deployed Storybook (HTML/URL-import plugin)        | Re-import on release              |
| **3: Code-only**     | `ThemeProvider`, `Form`, `Toast`, `SaveIndicator`, `Freshness`, `Chart`, `DataGrid`                                                        | Reference card: "code-only, mock with a screenshot"                                | None                              |

(60 components total. Tier 1 is the set designers assemble screens from; Tiers 2 and 3 are for browsing/reference.)

**Generation-first (Tier 1):** run `/figma-generate-library` against the codebase to build the core components rather than drawing them by hand. Treat the output as a starting point: verify each against Storybook, bind every fill/spacing/radius/type to the synced variables, and add the variant properties. Whatever generation can't reproduce faithfully is hand-finished. This shrinks (does not eliminate) the hand-built surface.

**Storybook source for Tier 2:** <https://mattwakeman-eidra.github.io/eidra-design-system/> (live, redeployed on every push to `main` by the Deploy Storybook workflow). Point the import plugin at individual story URLs; stories already enumerate the full variant/state matrix.

**Foundations page** (fully auto-synced from variables): colour swatches, type ramp, spacing scale, radius, elevation, icon grid. This is the browsable "view of the system" and it cannot lie because it's generated.

## Code Connect (the code↔design link)

Map each Tier-1 Figma component to its Eidra React source so designers see the real component code in Figma Dev Mode. Driven by the Figma MCP / `/figma-code-connect` skill:

1. `get_code_connect_suggestions` proposes mappings from the Figma components to source files.
2. Review and refine, then `add_code_connect_map` records each mapping.
3. `send_code_connect_mappings` publishes them to the file.

This is a link, not a sync: it surfaces the canonical code in Figma without round-tripping. A **stale map** (component API or source path changed) is a divergence signal to fix on the next release.

## Governance: keeping code canon

1. **Lock.** Library file (variables + master components) edit-restricted to the maintainer; published as a read-only team library designers consume in their own files. Synced variables are overwritten on every push, so hand-editing them is pointless by design.
2. **Detect.** Run a lint plugin (e.g. Design Lint) on consumer files to flag off-variable colour/spacing and detached instances; combine with stale Code Connect maps as the divergence signals.
3. **Valve.** A **Proposals** page is the designer inbox for off-system ideas. It is drained on each release: real gaps become DTCG/component PRs in this repo; the next sync carries them back into Figma. Nothing flows Figma→code except a human filing a proposal.

## Release ritual

Add to the release flow ([`RELEASING.md`](./RELEASING.md)); runs when a token or component release ships:

1. **Push tokens** via the Figma MCP (auto-covers colour/spacing across all tiers + Foundations).
2. **Re-import Tier-2** stories from the live Storybook.
3. **Regenerate / eyeball the ~18 Tier-1** components against Storybook; fix structural drift.
4. **Refresh Code Connect** maps for any component whose API or source path changed.
5. **Triage the Proposals page**; file/implement genuine asks as code PRs.

## Setup checklist (one-time)

- [ ] Confirm the Figma plan is at least **Professional** (required for variable _modes_ and library _publishing_; Enterprise only if using the REST sync).
- [ ] Confirm the Figma MCP is connected and authenticated for the workspace, and the library file is editable by the maintainer.
- [ ] Decide the conversion step for the three wrinkles (structured shadows, rem→px dimensions, optional `DEFAULT`→`base`): the agent applies it at push time, or a Style Dictionary format emits a Tokens-Studio file on the fallback path.
- [ ] Run the first MCP token push; create the three collections + modes; verify with `get_variable_defs`.
- [ ] Generate Tier-1 with `/figma-generate-library`; bind every fill/spacing/radius/type to variables; add variant props.
- [ ] Import Tier-2 from the live Storybook; build the Foundations + Tier-3 reference pages.
- [ ] Run `/figma-code-connect` to map Tier-1 components to source; publish the maps.
- [ ] Set library file permissions (maintainer edit, designers view); publish the team library.
- [ ] Create the Proposals page; install a lint plugin; add the release ritual to `RELEASING.md`.
