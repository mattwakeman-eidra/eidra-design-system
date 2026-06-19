---
"@eidra/tokens": minor
---

Extend the categorical chart palette to 16 hues — `--eidra-chart-9` … `--eidra-chart-16`: eight more meaning-neutral qualitative hues, each with a tuned dark-theme variant (saturated in light, brighter in dark), mirroring how `--eidra-chart-1` … `--eidra-chart-8` are defined. The new hues are placed in the gaps of the existing ramp to maximise perceptual distinctness from each other and from 1–8, so high-cardinality categorical stacks (e.g. monthly revenue split by operating company, ~12–16 series) stay legible in both themes. Additive only; `--eidra-chart-1` … `--eidra-chart-8` and all other tokens are unchanged.
