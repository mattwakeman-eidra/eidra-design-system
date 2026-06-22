# @eidra/icons

## 1.6.0

### Patch Changes

- fc6359b: Dependency refresh (batched Dependabot bumps):

  - Shipped runtime deps: lucide-react 1.18 to 1.21 and country-flag-icons to 1.6.18 (`@eidra/icons`).
  - Build/dev tooling (devDependencies, no change to published output): Vite 7 to 8, TypeScript 5.9 to 6, the vitest family 3 to 4 (`vitest`, `@vitest/browser`, `@vitest/coverage-v8`, plus the new `@vitest/browser-playwright`), and style-dictionary 5.4 to 5.5.

  vitest 4 moved the browser provider config from a string to a factory, so `vitest.config.ts` now imports `playwright` from `@vitest/browser-playwright` and uses `provider: playwright()`.

## 1.5.0

### Minor Changes

- 821004d: Add country `Flag` to `@eidra/icons` and an extra-small icon size.

  **`Flag`** (new) — `<Flag code="SE" size="sm" label?="Sweden" />`. Looks a flag up by ISO 3166-1 alpha-2 `code` (case-insensitive) from the full `country-flag-icons` set (257 countries/territories, MIT, externalized so flags tree-shake out unless used). Sizes its height from `--eidra-size-icon-*` tokens with the width following the 3:2 ratio, and adds rounded corners + a hairline `--eidra-border` so it reads on any surface. Unlike `Icon`, flags are multicolour, so they ignore `currentColor`. An unknown code renders nothing; pass `label` to expose the flag to assistive tech (`role="img"`). Also exports `flagCodes` (every available code, sorted — useful for country pickers) and the `FlagProps` / `FlagCode` / `FlagSize` types.

  **New `--eidra-size-icon-xs` token** (0.75rem / 12px) — extends the icon size scale below `sm`, for dense tables and inline lists. Both `Icon` and `Flag` now accept `size="xs"`. Additive; existing sizes are unchanged.

  Storybook: `Foundations/Flags` — region set, sizes (xs–lg), inline-in-text, and a filterable gallery of all flags, each with controls.

## 1.4.0

## 1.3.0

## 1.2.0

## 1.1.0

## 1.0.0
