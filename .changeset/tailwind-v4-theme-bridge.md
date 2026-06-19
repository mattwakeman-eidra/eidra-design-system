---
"@eidra/tokens": minor
"@eidra/react": minor
---

Ship a Tailwind **v4** theme bridge so apps on Tailwind v4 (CSS-first) can use Eidra tokens as utilities.

The existing `@eidra/tokens/tailwind` export is a **Tailwind v3 JS preset** (`presets: [require('@eidra/tokens/tailwind')]`). Tailwind v4 dropped JS-preset config in favour of a CSS `@theme`, so v4 apps couldn't use it and were hand-maintaining their own token→theme map in `globals.css` — which silently drifts from the tokens.

**New export — `@eidra/tokens/tailwind.css` (and the same file re-shipped as `@eidra/react/tailwind.css`).** A generated CSS file that maps every `--eidra-*` token onto Tailwind v4's theme namespaces (`--color-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`, `--ease-*`) inside `@theme inline`, so utilities stay reactive to the live `var(--eidra-*)` values (light / dark / finance). It is generated from the same token walk as the v3 preset, so the two can't diverge.

```css
/* app globals.css — Tailwind v4 */
@import '@eidra/react/styles.css';
@import 'tailwindcss';
@import '@eidra/react/tailwind.css';   /* or @eidra/tokens/tailwind.css */
```

The shipped file includes the `@layer` order and a `@theme { --*: initial }` reset (Eidra-only utilities); delete that block in your own copy if you want to keep Tailwind's default theme alongside. The v3 preset (`@eidra/tokens/tailwind`) is unchanged and still exported for v3 apps. See `docs/CONSUMING.md` §5.
