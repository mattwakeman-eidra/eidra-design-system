---
name: figma-token-sync
description: Push Eidra DTCG design tokens to the Figma mirror as Variables, via the Figma MCP. Use at release time when tokens changed, or to (re)build the Primitives and Theme variable collections in the design-system library file. Code is canon; this overwrites Figma.
---

# Figma token sync

Mirror the repo's DTCG tokens into the Figma library as Variables. One way: code is the source, Figma is the generated copy. Rationale is in `docs/adr/0007-figma-mirror.md`; the runbook is `docs/FIGMA.md`. This skill is the executable procedure.

## Non-negotiable rules

- **Code is canon.** Never read values back from Figma into the repo. This push overwrites whatever is in Figma.
- **Target the design-system library file, not the brand file.** The brand file (`eidra.com`, fileKey `7xGHMRc7rhqQSQ43ns1MsV`) is screenshot-only and is NOT the target. If the DS library fileKey is unknown, ask the user before writing anything.
- **Never hand-edit synced variables in Figma.** They are overwritten on the next push.
- **Scope of this skill: Primitives + Theme variables only.** Density modes, shadows, and typography styles are out of scope (see below).

## Source of truth

Read from `packages/tokens/tokens/`:

| File | Feeds | Notes |
| --- | --- | --- |
| `primitives/color.json` | Primitives (COLOR) | hex (`#rrggbb`), some shadows use rgba |
| `primitives/dimension.json` | Primitives (FLOAT) | `space`, `radius`, `size`, `z`; values are `rem` strings |
| `primitives/typography.json` | Primitives (STRING/FLOAT) | family, weight, size, line-height, letter-spacing |
| `semantic/light.json`, `semantic/dark.json` | Theme (light / dark modes) | values are aliases like `{color.grey.100}` |
| `primitives/effect.json` | (out of scope) | shadows are CSS strings, duration/easing have no Figma equivalent |

## Collections and modes

- **`Primitives`**: 1 mode. Raw palette + scales.
- **`Theme`**: 2 modes (`light`, `dark`). Every value is an alias to a Primitives variable.

**Density is not a variable axis, so it is not synced here.** There are no density tokens; compact is per-component CSS (each component steps its spacing/size down, and the root drops the base reading size 16→14px). The primitive scale does not change. In Figma, density is therefore a **component-variant property** (`comfortable` / `compact`) on the Tier-1 components, handled in the component build, not in this token sync. Theme and density still compose independently (a compact component on a dark frame), but through different Figma mechanisms: Theme is variable modes, density is variant props.

## Conversions (apply at push time)

| Source | `$type` | Figma | Rule |
| --- | --- | --- | --- |
| color | `color` | COLOR | hex as-is; preserve rgba alpha |
| space / radius / size | `dimension` (rem) | FLOAT | `value_px = rem * 16`; `"0rem"` to `0`; Figma FLOATs are unitless px |
| font size | `dimension`/`number` (rem) | FLOAT | `* 16` |
| font family | `fontFamily` (array) | STRING | primary family (first entry) |
| font weight | `fontWeight` | FLOAT or STRING | numeric stays FLOAT |
| line-height | `number` | FLOAT | as-is (unitless ratio) |
| letter-spacing | `dimension` (em) | (text-style %) | not a plain variable; defer to the typography styles pass |
| z-index | `number` | FLOAT | as-is |
| shadow | `shadow` | (effect style) | CSS string; not a variable. Defer to the styles pass |
| duration / easing | `duration`/`cubicBezier` | none | no Figma equivalent; skip, document on Foundations |

## Alias mapping

- A semantic value `{color.grey.100}` becomes a Figma variable **alias** pointing at the Primitives variable `color/grey/100` (DTCG dots become Figma slashes).
- If a semantic value is a literal (not wrapped in `{...}`), set it directly with the conversion above.
- **`DEFAULT` keys:** `bg.DEFAULT` imports as the variable `bg/DEFAULT`. Decide once whether to keep `DEFAULT` or rename to `base`; be consistent across the file. (Recommendation: rename to `base` for readability.)

## Procedure

1. **Confirm target.** Run `whoami` (Figma MCP) to confirm auth; confirm the DS library fileKey with the user if not already known. Never write to the brand file.
2. **Read** the token JSON from `packages/tokens/tokens/`.
3. **Ensure collections exist.** Create `Primitives` (1 mode) and `Theme` (modes `light`, `dark`) via the `/figma-use` workflow if missing.
4. **Upsert Primitives.** For each color/dimension/typography primitive, create or update the variable (named by path, e.g. `color/grey/100`, `space/4`) with the converted value.
5. **Upsert Theme.** For each semantic token, set its value in **both** modes as an alias to the resolved Primitives variable. Light values come from `light.json`, dark from `dark.json`.
6. **Verify.** Read back with `get_variable_defs`; diff against the (converted) source. Report adds, updates, and any mismatch.
7. **Do not** touch shadows, typography styles, density, or duration/easing here.

## Done criteria

- Every primitive color/dimension/typography token exists with the converted value.
- Every semantic token exists in both `light` and `dark`, aliasing the correct primitive.
- `get_variable_defs` read-back matches the converted source; any drift is reported, not silently accepted.

## Fallbacks

If agentic variable creation proves unreliable, switch the mechanism (not the canon direction) to **Tokens Studio** (git-backed, deterministic) or the **REST Variables API** (Enterprise, colour + dimension only). See `docs/FIGMA.md`.

## Related

- `docs/adr/0007-figma-mirror.md`, `docs/FIGMA.md`
- Companion skills (planned): `figma-code-connect`, `figma-release`
- MCP skills used: `/figma-use`, and `get_variable_defs` for verification
