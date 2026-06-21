# Build every package with Vite

All three packages (`@eidra/tokens`, `@eidra/icons`, `@eidra/react`) build with **Vite** (library mode) + `vite-plugin-dts`, sharing one config factory in `vite.config.base.ts`. tsup was removed.

## Why

The packages originally used tsup. `@eidra/react` styles components with CSS Modules (`*.module.css`), and **tsup/esbuild did not scope them**: the imported `styles` locals shipped as empty `{}` and the CSS shipped with unscoped class names (`.root`, …), so every component rendered unstyled in consumers. (It was masked in development because Storybook builds from source with Vite, which scopes correctly — only the tsup-built tarball was broken.)

Vite scopes CSS Modules natively (the same pipeline Storybook already proved on this source). Once react had to move to Vite, keeping tokens/icons on tsup left **two toolchains for no reason** — so all three were standardized on Vite. One config, one mental model, one set of build deps.

## How

- `vite.config.base.ts` exports `libConfig({ root, external, emptyOutDir })`; each package's `vite.config.ts` is a 3-line call.
- ESM output, JSX via Vite's esbuild (`jsx: 'automatic'`; no `@vitejs/plugin-react`, which requires Vite 8 — the workspace is on Vite 7), externals per package, types via `vite-plugin-dts`.
- **`@eidra/tokens`**: `node build.mjs && vite build`. Style Dictionary (`build.mjs`) writes the CSS + fonts into `dist`, so tokens build with `emptyOutDir: false` (and `build.mjs` cleans `dist` itself).
- **`@eidra/react`**: `vite build && add-use-client.mjs && check-build.mjs`. `check-build.mjs` is a regression guard that fails the build if CSS-module locals are empty, the CSS isn't hashed, a bare class leaks, or `"use client"` is missing — i.e. it verifies the _built artifact_, the check that would have caught the original bug.

## Consequences

- Output contract is unchanged: each package ships `dist/index.js` (ESM) + `dist/index.d.ts`; react also `dist/index.css` (+ `"use client"`); tokens also `eidra-tokens.css`, `fonts.css`, `fonts/`.
- Verify the built tarball, not just Storybook.
