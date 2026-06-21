---
'@eidra/react': patch
'@eidra/icons': patch
'@eidra/tokens': patch
---

Dependency refresh (batched Dependabot bumps):

- Shipped runtime deps: lucide-react 1.18 to 1.21 and country-flag-icons to 1.6.18 (`@eidra/icons`).
- Build/dev tooling (devDependencies, no change to published output): Vite 7 to 8, TypeScript 5.9 to 6, the vitest family 3 to 4 (`vitest`, `@vitest/browser`, `@vitest/coverage-v8`, plus the new `@vitest/browser-playwright`), and style-dictionary 5.4 to 5.5.

vitest 4 moved the browser provider config from a string to a factory, so `vitest.config.ts` now imports `playwright` from `@vitest/browser-playwright` and uses `provider: playwright()`.
