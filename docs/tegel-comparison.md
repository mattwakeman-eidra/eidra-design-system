# Tegel vs Eidra Design System

A feature and infrastructure comparison of Scania's **Tegel** design system against the **Eidra** design system, focused on what Tegel has that we do not.

> Method and scope: based on inspecting the public [scania-digital-design-system/tegel](https://github.com/scania-digital-design-system/tegel) repo (default branch `develop`, core `@scania/tegel` 1.58.0) and the npm registry on 2026-06-21, against this repo at the same date. It reads repo structure, `package.json` scripts/deps, workflows, and configs; it is not an exhaustive code audit. Some Tegel details are inferred from file names and scripts.
>
> Caveat: the two systems target different things. Tegel is a large, public, multi-framework product design system (Scania, MIT, 469 npm releases). Eidra is a younger, React plus Tailwind system for product apps, distributed privately. Several differences are deliberate positioning, not gaps.

## At a glance

| Dimension | Tegel | Eidra |
|---|---|---|
| Core technology | Stencil 4 web components (framework-agnostic) | React 19 + Base UI (headless primitives) |
| Framework support | Web components + auto-generated **React** and **Angular** wrappers | **React only** |
| Styling | SCSS (`@stencil/sass`) compiled per component | CSS Modules, token vars only, `@layer eidra` |
| Lightweight variant | **`tegel-lite`** (runtime-free compiled CSS) | none |
| Package manager / monorepo | npm (per-package `npm i`, no workspaces) | pnpm workspaces |
| Build | Stencil compiler + custom SCSS build | Vite (library mode) for all packages |
| Tokens | Style Dictionary 5 + **`figma-to-tokens.mjs`** (Figma sync) | Style Dictionary 5 (DTCG JSON), manual Figma pull |
| Distribution | **npm registry** (`@scania/tegel`, `-react`, `-angular`) | Versioned tarballs via GitHub Releases (no npm) |
| Versioning | Conventional commits + custom release workflows | Changesets |
| Storybook | 9.1 (`html-vite`) + a11y, docs, **dark-mode** addons | 10.4 (`react-vite`) + a11y, docs, **vitest** addons |
| Component docs | **Stencil auto-generated** per-component README + docs-json | Autodocs from TS types + generated `llms.txt` / `COMPONENTS.md` |
| Unit / e2e tests | Stencil spec + e2e (Jest) | Vitest (Storybook browser stories) |
| Visual regression | **Playwright snapshots, dockerized** for determinism | **none** |
| Accessibility tests | **Dedicated Playwright + axe-core CI suite** | axe via Storybook Vitest addon |
| Lint / format | **eslint, prettier, stylelint** | **none configured** |
| Commit hygiene | **commitlint + commitizen + husky** | none |
| Static analysis | **SonarQube** | none |
| Dependency automation | **Dependabot** | none |
| Custom guards | **CSP verify**, **prop-reflect lint** | catalog freshness guard, `check-build` |
| CI workflows | 8 (a11y, playwright, beta release, lite release, main release, dry-run cleanup cron, dependabot rebase, author-assign) | 3 (ci, release, storybook deploy) |
| Public docs site | **tegel.scania.com** | Storybook on GitHub Pages |
| Maturity | 469 npm versions, public, MIT | younger, private |

## What Tegel has that we do not

### Infrastructure and tooling

1. **Code-quality stack (biggest gap).** Tegel runs ESLint, Prettier, and Stylelint, with a `lint:check` gate (`lint && tsc && lint:prop-reflect`). This repo has **no ESLint, Prettier, or Stylelint config at all** and no lint step in CI. Adding at least ESLint + Prettier + a CI lint job is the highest-value, lowest-cost item.
2. **Commit hygiene.** commitlint + commitizen (`npm run commit` → `cz`) + Husky hooks enforce conventional commits. We have none (we rely on changesets for versioning, not commit messages).
3. **Static analysis.** `sonar-project.properties` wires SonarQube for code-quality and coverage tracking. We have Vitest coverage locally but no static-analysis gate.
4. **Dependency automation.** Dependabot (plus a `dependabot-rebase-check` workflow). We update deps manually.
5. **Custom safety lints.** A CSP verifier (`verify-csp.mjs`) and a prop-reflection lint (`check-prop-reflect.mjs`) catch Stencil-specific footguns. Our analogues are the catalog freshness guard and `check-build.mjs` (different concerns).

### Testing and QA

6. **Visual regression testing.** Playwright screenshot snapshots, run in a pinned Microsoft Playwright Docker image (`update:snapshots`, `docker-test-runner.js`) for deterministic rendering across machines. We have **no visual regression** of any kind. This is the most significant testing gap.
7. **Dedicated accessibility CI.** A standalone `accessibility-test.yml` runs `@axe-core/playwright` against a `playwright-axe.config.ts` suite. We run axe through the Storybook Vitest addon, which is lighter and coupled to story rendering.
8. **Stencil spec + e2e tests** (Jest based) at the component level, separate from stories.

### Product and architecture features

9. **Framework-agnostic core plus generated wrappers.** A Stencil web-component core compiles to `@scania/tegel`, with React and Angular bindings auto-generated via `@stencil/react-output-target` and `@stencil/angular-output-target`. Eidra is React-only (Base UI is React). Consumers on Angular, Vue, or plain HTML cannot use Eidra.
10. **Runtime-free CSS variant (`tegel-lite`).** SCSS compiled to plain CSS components for use without the Stencil runtime (its own release pipeline). We have no equivalent zero-JS path.
11. **Automated Figma to tokens pipeline.** `figma-to-tokens.mjs` pulls token values from Figma into the Style Dictionary source. We pull brand values from Figma manually (see the Figma source memory / the in-flight figma-mirror ADR).
12. **npm registry distribution.** Tegel publishes to npm (`@scania/tegel` and friends, 469 versions). We deliberately ship versioned tarballs via GitHub Releases (ADR-0003/0004), which is fine for private consumption but not open distribution.

### Release and docs

13. **Richer release automation.** Beta releases, a separate lite release, a "Holy Grail" main release flow, and a cron that cleans up stale dry-run branches. Our release is a single changesets-driven GitHub Release.
14. **Stencil auto-generated per-component docs** (`stencil build --docs`, `--docs-readme`) produce a README and a docs-json per component from the source. We generate autodocs from TS types plus the `llms.txt` / `COMPONENTS.md` catalog (arguably comparable or better for agents, but different in shape).
15. **Public hosted docs site** (tegel.scania.com) and a Storybook **dark-mode toggle addon**. Our Storybook (GitHub Pages) has theme and density toolbars but is not a branded public docs site.

## What we have that Tegel does not

1. **Agent-readable catalog.** A generated `llms.txt` shipped inside `@eidra/react` plus `docs/COMPONENTS.md`, kept fresh by a CI guard. Built for AI consumers; Tegel has no equivalent.
2. **Architecture Decision Records** (`docs/adr/`, 0001 to 0009) documenting and justifying choices.
3. **Modern headless foundation.** React 19 + Base UI primitives keep behaviour and ARIA in the library while we own styling, versus Stencil's bespoke component runtime.
4. **Cascade-layer override model.** `@layer eidra` plus the "opinionated but overridable" principle (ADR-0009) let consumer `className` and Tailwind utilities win without `!important` or inline styles. A deliberate, documented override contract.
5. **First-class Tailwind integration.** A v3 JS preset and a v4 `@theme` bridge (with an opt-in reset) map every token onto utilities. Tegel, being web-component first, has no Tailwind story.
6. **Density and accent systems.** `data-density` (comfortable / compact) and a `finance` accent, layered over light/dark theming.
7. **Newer Storybook and test stack.** Storybook 10 + Vitest browser tests, versus Tegel's Storybook 9 + Jest.
8. **Domain extras.** A Recharts-based Chart kit, 257 country flags, and a Lucide icon wrapper.
9. **Leaner, faster builds.** Vite across all packages, a smaller surface, and a simpler mental model.

## Recommendations (candidate adoptions, prioritised)

1. **Add ESLint + Prettier + a CI lint step** (and Stylelint for the CSS Modules). This is the clearest gap and the cheapest to close.
2. **Add visual regression testing.** Either Playwright snapshots (Tegel's approach) or a hosted service (Chromatic / Argos) wired to the Storybook build. Highest-value testing addition.
3. **Enable Dependabot** for dependency hygiene.
4. **Add commit hygiene** (commitlint + Husky + lint-staged) if we want conventional commits, though changesets already cover versioning, so this is optional.
5. **Automate the Figma to tokens pull** to reduce token drift, building on the existing Figma MCP and the figma-mirror ADR.
6. **Likely not worth it now:** multi-framework / web-component core (large rewrite, no non-React consumers today), `tegel-lite` style zero-JS variant, and npm publishing (the tarball model is a deliberate decision). Revisit only if non-React or external consumers appear.
