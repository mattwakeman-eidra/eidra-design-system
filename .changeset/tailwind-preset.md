---
"@eidra/tokens": minor
---

Add a Tailwind v3 preset at `@eidra/tokens/tailwind`. Generated from the DTCG tokens, it exposes every `--eidra-*` token as an `eidra-`-prefixed Tailwind utility (`bg-eidra-accent`, `p-eidra-4`, `rounded-eidra-lg`, `shadow-eidra-md`, `font-eidra-sans`, `z-eidra-modal`, …) mapped to the CSS variables, so utilities stay theme-reactive (light/dark/finance). Consuming apps add `presets: [require('@eidra/tokens/tailwind')]` to style with Eidra tokens via Tailwind instead of inline styles. DS component internals are unchanged (CSS Modules).
