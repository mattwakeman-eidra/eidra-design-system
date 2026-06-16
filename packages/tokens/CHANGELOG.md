# @eidra/tokens

## 1.0.0

### Minor Changes

- 3aadd76: Add the `finance` data-viz colour palette: primitives (`--eidra-color-finance-*`) and semantic tokens (`--eidra-finance-*`) for the action accent (Eidra Blue — orange reads as caution in a financial context), RAG (positive/caution/negative), and the revenue green→gold ramp (actuals → sold → hi-prob → additional). Grounded in the Eidra invoicing styleguide; consumed by `DataGrid` and finance charts.
- e497073: Add a Tailwind v3 preset at `@eidra/tokens/tailwind`. Generated from the DTCG tokens, it exposes every `--eidra-*` token as an `eidra-`-prefixed Tailwind utility (`bg-eidra-accent`, `p-eidra-4`, `rounded-eidra-lg`, `shadow-eidra-md`, `font-eidra-sans`, `z-eidra-modal`, …) mapped to the CSS variables, so utilities stay theme-reactive (light/dark/finance). Consuming apps add `presets: [require('@eidra/tokens/tailwind')]` to style with Eidra tokens via Tailwind instead of inline styles. DS component internals are unchanged (CSS Modules).
