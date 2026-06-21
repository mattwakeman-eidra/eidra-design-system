# Ship component styles in a cascade layer (`@layer eidra`)

`@eidra/react/styles.css` (`dist/index.css`) is wrapped in a single low-priority cascade layer, `@layer eidra`, by a post-build step (`scripts/wrap-css-layer.mjs`, asserted by `check-build.mjs`). Everything in the sheet — tokens, the base reset, the theme scope, and every component CSS Module — sits inside that one layer.

## Why

Component styles shipped as **ordinary (unlayered)** rules. Per the CSS cascade, unlayered declarations always beat layered ones — and Tailwind v4 puts its utilities in `@layer utilities`. So a DS rule like `.trigger { width: 100% }` (specificity `0,1,0`) could not be overridden by a consumer's `w-24` utility of equal specificity: the DS rule is unlayered, the utility is layered, unlayered wins regardless of source order. The components already accept and merge `className`, but for these properties it was silently dead — the only escape was inline `style={{}}` (which consuming apps were reaching for, with `eslint-disable no-restricted-syntax`).

Surfaced in design-system adoption (frankly#40): `Toolbar.Root` (border/radius/shadow/padding) and `Select.Trigger` (`width`) both required inline `style`.

We chose layering over per-property props: props can only ever cover the overrides we predict, whereas `className` is general. Layering makes the **existing** `className` contract honest instead of bolting on a parallel, partial API.

## How

- The Vite output has no leading `@charset`/`@import` (tokens are inlined), so the whole file is wrapped in `@layer eidra { … }`. Idempotent; `check-build.mjs` fails the build if the wrapper is missing.
- Cascade outcome, given the layer is registered before the consumer's utilities layer:
  - **Unlayered** consumer CSS (`.my-class { … }`) beats the DS — the normal escape hatch.
  - **Tailwind utilities** (`@layer utilities`, declared after `eidra`) beat the DS — `w-24`, `border-0`, etc. now win on a DS element.
  - DS defaults still apply when the consumer sets nothing.
- **Layer order is the consumer's responsibility.** `@eidra/react/styles.css` must be imported **before** Tailwind's `utilities` import so `eidra` registers first (lower priority). This is the natural order and what the reference setup uses (see `docs/CONSUMING.md`).
- `@eidra/react/tailwind.css` (the v4 `@theme` bridge) is **not** layered — `@theme` is Tailwind's own mechanism and must stay as-is.

## Consequences

- **Cascade behaviour change for all consumers** (shipped as a `minor`): consumer `className`/utilities that previously lost to a DS rule of equal specificity now win. This is the intended fix, but it can shift the appearance of an element that was unknowingly being held by a DS default — worth a visual once-over on adoption. No DS rule uses `!important` except the reduced-motion guard (whose layered-important precedence keeps it winning, as desired).
- Consumers can delete inline `style`/`eslint-disable` overrides on DS components and use `className` instead.
- `--eidra-*` tokens are now declared inside the layer, so a consumer's unlayered `:root { --eidra-… }` override wins — token theming is easier, not harder.
