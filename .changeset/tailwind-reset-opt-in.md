---
"@eidra/tokens": minor
"@eidra/react": minor
---

Make the Tailwind theme reset opt-in instead of bundling it into the bridge.

`@eidra/react/tailwind.css` (and `@eidra/tokens/tailwind.css`) used to include a `@theme { --*: initial }` reset that dropped Tailwind's entire built-in theme, so importing the bridge forced Eidra-only utilities on every consumer. Per the "enable, don't force" principle (ADR-0009), that reset is now a **separate, opt-in import** and the bridge only maps Eidra tokens onto Tailwind's `@theme`.

**New export:** `@eidra/react/tailwind-reset.css` (and `@eidra/tokens/tailwind-reset.css`) — `@theme { --*: initial }`.

```css
@import '@eidra/react/styles.css';
@import 'tailwindcss';
@import '@eidra/react/tailwind-reset.css';  /* opt-in: drop Tailwind's defaults */
@import '@eidra/react/tailwind.css';        /* re-add only the Eidra tokens */
```

**Migration:** if you were relying on the bundled reset to get Eidra-only utilities, add `@eidra/react/tailwind-reset.css` **after** `tailwindcss` and **before** `@eidra/react/tailwind.css`. If you omit it, Tailwind's default theme stays available alongside the Eidra tokens (the new default). The bridge import path itself is unchanged.
