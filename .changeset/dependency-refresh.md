---
"@eidra/react": patch
"@eidra/icons": patch
"@eidra/tokens": patch
---

Dependency refresh (the open Dependabot bumps, batched):

- Shipped runtime deps: Base UI 1.5 → 1.6 (`@eidra/react`), lucide-react 1.18 → 1.21 and country-flag-icons → 1.6.18 (`@eidra/icons`).
- Build/dev tooling (devDependencies, no change to published output): Vite 7 → 8, TypeScript 5.9 → 6, the vitest family 3 → 4 (`vitest`, `@vitest/browser`, `@vitest/coverage-v8`, plus the new `@vitest/browser-playwright`), and style-dictionary 5.4 → 5.5.

vitest 4 moved the browser provider config from a string to a factory, so `vitest.config.ts` now imports `playwright` from `@vitest/browser-playwright` and uses `provider: playwright()`.
