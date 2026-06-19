# Eidra Design System

The shared design language and React component library Eidra uses to build web apps — internal tools, client-facing SaaS, marketing sites, and pitch demos. Built on [Base UI](https://base-ui.com/) (headless, accessible primitives) with Eidra's brand layered on through design tokens.

📖 **[Browse the components in Storybook →](https://mattwakeman-eidra.github.io/eidra-design-system/)** — the hosted workshop with every component, its props, and live theme/density toggles.

## Packages

| Package | What it is |
| --- | --- |
| [`@eidra/tokens`](./packages/tokens) | Design tokens (color, type, spacing, themes) authored in DTCG JSON, built with Style Dictionary to CSS custom properties + typed TS constants. |
| [`@eidra/icons`](./packages/icons) | Token-aware `<Icon>` wrapper around [Lucide](https://lucide.dev/), plus a tree-shakable re-export of the full icon set. |
| [`@eidra/react`](./packages/react) | The React component library, built on Base UI and styled with CSS Modules + the token custom properties. |

## Quick start

```bash
pnpm install
pnpm build        # build tokens → icons → react
pnpm storybook    # local workshop at http://localhost:6006 (hosted: mattwakeman-eidra.github.io/eidra-design-system)
```

### Using it in an app

```tsx
// Load fonts (correct @font-face URLs) and the compiled styles once, at your app root:
import '@eidra/tokens/fonts.css';
import '@eidra/react/styles.css';

import { ThemeProvider, Button, Field, Input } from '@eidra/react';

export function App() {
  return (
    <ThemeProvider theme="light" density="comfortable">
      <Field label="Email" hint="We’ll never share it.">
        <Input type="email" placeholder="you@eidra.com" />
      </Field>
      <Button tone="accent">Save</Button>
    </ThemeProvider>
  );
}
```

`<ThemeProvider>` applies the `eidra-root` scope plus `data-theme` and `data-density`. You can instead put `class="eidra-root" data-theme="dark"` on your own root element.

**Using Tailwind?** The tokens are available as utilities either way: Tailwind **v4** apps `@import '@eidra/react/tailwind.css'` (a generated, drift-proof `@theme` bridge); Tailwind **v3** apps add `presets: [require('@eidra/tokens/tailwind')]`. Both keep utilities reactive to the live theme. See [`docs/CONSUMING.md` §5](./docs/CONSUMING.md).

## Design decisions

- **Product-first foundation.** The brand guidelines define an editorial scale (bold-only type from 15px, coarse 10px spacing). For product UI this system uses a conventional type ramp (Regular→Bold from 12px) and a 4px spacing grid; the brand's large display sizes live in the **display tier** as opt-in expressive styles. Identity is carried by the palette and Eidra Sans. See [`docs/adr/0002`](./docs/adr/0002-product-first-foundation.md).
- **Tokens are the source of truth.** Three layers: primitive → semantic (themeable) → component. Components consume semantic tokens, so light/dark and future sub-brands are theme files, not code changes.
- **Zero-runtime styling.** CSS Modules compile to one stylesheet (`@eidra/react/styles.css`); theming is CSS-variable overrides. SSR/RSC-safe (`"use client"` boundary baked in).

See [`CONTEXT.md`](./CONTEXT.md) for the glossary and [`docs/adr/`](./docs/adr) for architecture decisions.

## Brand foundations

| Token | Value | |
| --- | --- | --- |
| `creme` | `#F5F2EC` | warm off-white neutral |
| `taupe` | `#7A756E` | warm grey-brown |
| `orange` | `#FAA21B` | primary accent |
| `coral` | `#FF6F61` | secondary warm accent |
| `grey-100…900` | `#E2E2E2 … #2B2B2B` | neutral ramp |

Typeface: **Eidra Sans** (bundled in `packages/tokens/fonts/`). It ships two real masters — Regular and Bold, plus italics — so the four weight tokens map onto them via `@font-face` weight ranges (400–550 → Regular, 551–900 → Bold) with `font-synthesis: none` to avoid faux weights. Load it with `import '@eidra/tokens/fonts.css'`.

## Releasing & consuming

Distributed as **version-stamped tarballs attached to GitHub Releases** (no npm registry). Releases are PR-driven with [Changesets](https://github.com/changesets/changesets) (the three packages move as one fixed-version group):

1. A feature PR includes a changeset — `pnpm changeset`. CI (`​.github/workflows/ci.yml`) fails the PR without one.
2. Merge to `main` → `​.github/workflows/release.yml` opens a **"Version Packages" PR** (bumps versions + changelogs).
3. Merge that PR → a **GitHub Release `v<version>`** is published with the tarballs attached.

```bash
# local / offline equivalents:
pnpm release          # build + catalog + pack ./releases/eidra-*-<version>.tgz + manifest.json
pnpm release:github   # the above + create the GitHub Release (used by CI; needs the gh CLI)
```

Step-by-step release runbook: **[docs/RELEASING.md](./docs/RELEASING.md)**. Consuming apps (e.g. frankly) copy `templates/sync-eidra.mjs` and run it against a release tag (or a local dir) to pull tarballs and reinstall. Full integration guide — layout, fonts, theming, example pages, agent setup — is in **[docs/CONSUMING.md](./docs/CONSUMING.md)**. Rationale in ADRs [`0003`](./docs/adr/0003-versioned-tarball-distribution.md) (tarballs) and [`0004`](./docs/adr/0004-github-releases-distribution.md) (GitHub Releases flow).

> Scope note: the package scope stays `@eidra` because GitHub Releases are plain file assets (unlike GitHub Packages, which would require the scope to match the repo owner).

## Workspace scripts

| Command | |
| --- | --- |
| `pnpm build` | Build all three packages in order. |
| `pnpm build:tokens` | Rebuild just the tokens (after editing `packages/tokens/tokens/**`). |
| `pnpm typecheck` | Typecheck every package. |
| `pnpm storybook` / `pnpm build-storybook` | Run / build the Storybook workshop. |
