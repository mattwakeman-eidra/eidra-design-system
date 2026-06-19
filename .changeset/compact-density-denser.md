---
"@eidra/react": minor
---

Make `data-density="compact"` noticeably denser (full density pass). Compact now:

- **Shrinks the base reading size** 16px → 14px (`font-size` on the compact root) and drops control heights another notch (`--eidra-size-control-*`: sm 28→24px, md 32→28px, lg 40→36px).
- **Tightens every component's compact block by two spacing steps from comfortable** (previously one). Padding and gap step down the ladder `6→4→3→2→1-5→1→0-5`, floored at `space-0-5` so nothing collapses to 0; large fonts (≥ base) step down two stops, floored at `sm`.

Applied uniformly across all 41 density-aware components. Comfortable density is unchanged; only the compact scope is affected. The authoring convention in `base.css` is updated to the two-step rule for future components.
