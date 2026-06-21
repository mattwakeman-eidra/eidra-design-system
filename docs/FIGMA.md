# Figma mirror — setup & maintenance

A Figma reproduction of the Eidra Design System so designers can **sketch new screens on real primitives** and **browse the system Figma-natively**. It is a one-way mirror: code is canon, Figma is generated/maintained from it, and design ideas return only as code proposals. The rationale and trade-offs are in ADR [`0007`](./adr/0007-figma-mirror.md) — this file is the how-to.

## Mental model (read once)

- **Code → Figma, one way.** Never hand-edit synced variables; the next push overwrites them.
- **Tokens auto-sync; components are hand/import-maintained.** Different economics, different upkeep.
- **Figma proposes, code disposes.** Off-system ideas become DTCG/component PRs, then sync back.

## Token sync

**Mechanism:** [Tokens Studio](https://tokens.studio) plugin, git-backed, reading the DTCG JSON in `packages/tokens/tokens/`. (Optional CI alternative: the Figma REST Variables API — **Enterprise plan only**, colour + dimension only. Treat as a later bolt-on.)

**Variable collections** mirror the JSON one-to-one:

| Collection   | Source                                    | Modes                    |
| ------------ | ----------------------------------------- | ------------------------ |
| `Primitives` | `tokens/primitives/*.json`                | 1 (no mode)              |
| `Theme`      | `tokens/semantic/light.json`, `dark.json` | `light`, `dark`          |
| `Density`    | density-scaled spacing/sizing/base-type   | `comfortable`, `compact` |

Modes apply per-collection on a frame, so `Theme` and `Density` compose independently — exactly like `data-theme` + `data-density` in CSS. Semantic variables in `Theme`/`Density` **alias** the `Primitives` collection (Tokens Studio's `{color.orange.500}` syntax → a Figma variable reference), so the primitive→semantic graph is preserved.

### Schema fit — what's clean, what needs a transform

Verified against the current token JSON. Most types map cleanly; three wrinkles need a **transform step that emits a Tokens-Studio-friendly file alongside the CSS** — a Style Dictionary format, _not_ a hand-edit of the source.

| Token group                            | `$type`                   | Maps to            | Status                                                                                                                                   |
| -------------------------------------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `color.*`, `semantic.*`                | `color`                   | COLOR variable     | ✅ clean; aliases preserved                                                                                                              |
| `space`, `radius`, `size`, `font.size` | `dimension` (rem)         | FLOAT variable     | ⚠️ Figma variables are unitless px — convert `rem`→px (×16)                                                                              |
| `font.letter-spacing`                  | `dimension` (em)          | text-style prop    | ⚠️ convert `em`→% for text styles                                                                                                        |
| `font.family`                          | `fontFamily`              | STRING variable    | ✅ clean (array → primary family)                                                                                                        |
| `font.weight`                          | `fontWeight`              | STRING/FLOAT       | ✅ clean                                                                                                                                 |
| `font.line-height`                     | `number`                  | FLOAT / text-style | ✅ as variable; convert to %/px for text styles                                                                                          |
| `z.*`                                  | `number`                  | FLOAT variable     | ✅ clean                                                                                                                                 |
| `shadow.*`                             | `shadow`                  | EFFECT style       | ❌ values are **CSS strings**, not structured `{offsetX,offsetY,blur,spread,color}` objects — parse into structured shadow before import |
| `duration.*`, `easing.*`               | `duration`, `cubicBezier` | —                  | ⛔ no Figma variable equivalent — stays code-only, document on Foundations                                                               |

**Typography & effects are not variables.** Figma text styles and effect styles are separate surfaces; Tokens Studio generates them from the composite tokens. The density-driven base size (16→14px) can't live in a static text style — bind a **number variable** to the text layer's font-size instead.

**`DEFAULT` keys:** semantic groups use the Tailwind `DEFAULT` convention (`bg.DEFAULT`), which imports as a variable literally named `bg/DEFAULT`. Either accept it or rename to `bg/base` in the transform — cosmetic, decide once.

## Component build (three tiers)

| Tier                 | What                                                                                                                           | How                                                                                | Upkeep                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------- |
| **1 — Core (~15)**   | Button, Input, Field, Select, Checkbox, Radio, Switch, NumberField, Card, Badge, Alert, Avatar, Tabs, Menu, Dialog, PageHeader | Hand-built true components: variant props, **bound to variables**, mode-switchable | Eyeball vs Storybook each release |
| **2 — Other visual** | every remaining drawable component                                                                                             | Import rendered stories from the deployed Storybook (HTML/URL-import plugin)       | Re-import on release              |
| **3 — Code-only**    | `ThemeProvider`, `Form`, `Toast`, `SaveIndicator`, `Freshness`, `Chart`, `DataGrid`                                            | Reference card: "code-only — mock with a screenshot"                               | None                              |

**Storybook source for Tier 2:** <https://mattwakeman-eidra.github.io/eidra-design-system/> (live, redeployed on every push to `main` by `.github/workflows` Deploy Storybook). Point the import plugin at individual story URLs; stories already enumerate the full variant/state matrix.

**Foundations page** (fully auto-synced from variables): colour swatches, type ramp, spacing scale, radius, elevation, icon grid. This is the browsable "view of the system" and it cannot lie because it's generated.

## Governance — keeping code canon

1. **Lock.** Library file (variables + master components) edit-restricted to the maintainer; published as a read-only team library designers consume in their own files. Synced variables are overwritten on every push, so hand-editing them is pointless by design.
2. **Detect.** Run a lint plugin (e.g. Design Lint) on consumer files to flag off-variable colour/spacing and detached instances — those are your divergence signals.
3. **Valve.** A **Proposals** page is the designer inbox for off-system ideas. It is drained on each release: real gaps become DTCG/component PRs in this repo; the next sync carries them back into Figma. Nothing flows Figma→code except a human filing a proposal.

## Release ritual

Add to the release flow ([`RELEASING.md`](./RELEASING.md)) — runs when a token or component release ships:

1. **Push tokens** — Tokens Studio sync (auto-covers colour/spacing across all tiers + Foundations).
2. **Re-import Tier-2** stories from the live Storybook.
3. **Eyeball the ~15 Tier-1** components against Storybook; fix structural drift.
4. **Triage the Proposals page** — file/implement genuine asks as code PRs.

## Setup checklist (one-time)

- [ ] Confirm Figma plan ≥ **Professional** (required for variable _modes_ and library _publishing_; Enterprise only if using the REST sync).
- [ ] Add the Style Dictionary transform that emits the Tokens-Studio file (structured shadows, px dimensions, optional `DEFAULT`→`base`).
- [ ] Install Tokens Studio; connect it to this repo; create the three collections + modes; run first push.
- [ ] Build the Tier-1 components against Storybook; bind every fill/spacing/radius/type to variables.
- [ ] Import Tier-2 from the live Storybook; build the Foundations + Tier-3 reference pages.
- [ ] Set library file permissions (maintainer edit, designers view); publish the team library.
- [ ] Create the Proposals page; install a lint plugin; add the release ritual to `RELEASING.md`.
