# CLAUDE.md — Eidra Design System

React component library on [Base UI](https://base-ui.com/) (headless, accessible primitives) styled with Eidra design tokens. pnpm monorepo.

## Where things live

- `packages/tokens/` — design tokens. **Edit DTCG JSON in `tokens/`**, never the generated CSS/TS. `pnpm build:tokens` regenerates `dist/eidra-tokens.css` (CSS variables) + typed TS. Eidra Sans fonts in `fonts/`, declared in `fonts.css`.
- `packages/icons/` — `<Icon>` wrapper + Lucide re-export.
- `packages/react/src/components/<Name>/` — one dir per component: `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, `index.ts`. `src/index.ts` re-exports every component dir.
- `docs/COMPONENTS.md` — **generated** catalog of all components (run `pnpm catalog`). The agent-readable index of what exists. Don't hand-edit.
- `docs/adr/` — architecture decisions. `CONTEXT.md` — glossary. `docs/consuming.md` — how apps adopt the DS.

## The component pattern (follow the exemplars exactly)

Canonical references: `Button` (native element), `Input` + `Field` (wrapping Base UI). To add or change a component, mirror them:

- Wrap the Base UI primitive; let it keep behavior/ARIA. Style via a **CSS Module** using **only token CSS variables** (`var(--eidra-*)`). Never invent a token — the full list is in `docs/COMPONENTS.md` and `packages/tokens/dist/eidra-tokens.css`.
- Style states off Base UI's `data-*` attributes (`[data-disabled]`, `[data-open]`, `[data-checked]`, `[data-highlighted]`, …). Focus rings: `outline: 2px solid var(--eidra-focus-ring); outline-offset: 2px`.
- Multi-part components export a namespace object (`export const X = { Root, Trigger, … }`); for declaration portability, annotate the object's type explicitly when wrapping Base UI parts (see `Popover.tsx`).
- ESM: relative imports use `.js` extensions. `forwardRef` for single-element wrappers.
- Every component ships a `.stories.tsx` (CSF3, `title: 'Category/Name'`, `tags: ['autodocs']`). **Stories are type-checked**, so they catch API misuse — keep them green.

## Theming

Semantic tokens resolve per `data-theme` (`light`/`dark`) on the `eidra-root` element; `data-density` (`comfortable`/`compact`) scales control sizes. Components consume **semantic** tokens (`--eidra-accent`, `--eidra-fg`…), never primitives directly, so themes stay swappable.

## Commands

- `pnpm storybook` / `pnpm build-storybook` — the workshop (theme + density toolbars, a11y addon).
- `pnpm typecheck` — all packages (includes stories).
- `pnpm build` — tokens → icons → react. **All three build with Vite** (shared `vite.config.base.ts`); react's CSS Modules require it — don't switch back to tsup (it ships empty style locals + unscoped CSS; see ADR-0005). The react build self-checks via `scripts/check-build.mjs`.
- `pnpm catalog` — regenerate `docs/COMPONENTS.md` + the shipped `packages/react/llms.txt`.
- `pnpm changeset` — record a version bump in a PR (CI requires one). Merging to `main` opens a "Version Packages" PR; merging that publishes a GitHub Release with the tarballs (`.github/workflows/release.yml`). `pnpm release` packs locally; `pnpm release:github` also creates the release. Runbook: `docs/RELEASING.md`. See also `docs/consuming.md` + ADR-0004.

## Sandbox note

If running in a restricted sandbox, builds need cache redirection — see the project memory `eidra-sandbox-build-env`.
