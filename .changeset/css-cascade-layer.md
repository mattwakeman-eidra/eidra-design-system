---
"@eidra/react": minor
---

Ship component styles in a cascade layer (`@layer eidra`) so consumer styles can override the DS.

`@eidra/react/styles.css` shipped as **unlayered** CSS. Per the cascade, unlayered rules always beat layered ones — and Tailwind v4 utilities live in `@layer utilities` — so a DS rule like `.trigger { width: 100% }` could not be overridden by a `w-24` utility of equal specificity. Components accept `className`, but for these properties it was dead: the only escape was inline `style={{}}`.

The built stylesheet is now wrapped in `@layer eidra` (a post-build step, guarded by `check-build.mjs`). Result:

- **Tailwind utilities** (`@layer utilities`, registered after `eidra`) override DS rules — `<Select.Trigger className="w-24" />`, `<Toolbar.Root className="border-0 rounded-none shadow-none p-0" />`, etc.
- **Unlayered consumer CSS** beats the DS, as expected.
- DS defaults still apply when you set nothing.

**Migration:** import `@eidra/react/styles.css` **before** Tailwind's utilities import (the natural/reference order) so the `eidra` layer registers first. You can now delete inline `style`/`eslint-disable` width and chrome overrides on DS components and use `className` instead. Because this changes the cascade, an element that was unknowingly held by a DS default may now pick up a consumer utility it previously ignored — worth a quick visual check on upgrade. See ADR-0008.
