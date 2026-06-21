# CLAUDE.md — Eidra Design System

React component library on [Base UI](https://base-ui.com/) (headless, accessible primitives) styled with Eidra design tokens. pnpm monorepo.

## Where things live

- `packages/tokens/` — design tokens. **Edit DTCG JSON in `tokens/`**, never the generated CSS/TS. `pnpm build:tokens` regenerates `dist/eidra-tokens.css` (CSS variables) + typed TS. Eidra Sans fonts in `fonts/`, declared in `fonts.css`.
- `packages/icons/` — `<Icon>` wrapper + Lucide re-export.
- `packages/react/src/components/<Name>/` — one dir per component: `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, `index.ts`. `src/index.ts` re-exports every component dir.
- `docs/COMPONENTS.md` — **generated** catalog of all components (run `pnpm catalog`). The agent-readable index of what exists. Don't hand-edit.
- `docs/adr/` — architecture decisions. `CONTEXT.md` — glossary. `docs/CONSUMING.md` — how apps adopt the DS. `docs/STORYBOOK.md` — story title taxonomy (Foundations / ‹Function›/‹Component› / Patterns).

## The component pattern (follow the exemplars exactly)

Canonical references: `Button` (native element), `Input` + `Field` (wrapping Base UI). To add or change a component, mirror them:

- Wrap the Base UI primitive; let it keep behavior/ARIA. Style via a **CSS Module** using **only token CSS variables** (`var(--eidra-*)`). Never invent a token — the full list is in `docs/COMPONENTS.md` and `packages/tokens/dist/eidra-tokens.css`.
- Style states off Base UI's `data-*` attributes (`[data-disabled]`, `[data-open]`, `[data-checked]`, `[data-highlighted]`, …). Focus rings: `outline: 2px solid var(--eidra-focus-ring); outline-offset: 2px`.
- Multi-part components export a namespace object (`export const X = { Root, Trigger, … }`); for declaration portability, annotate the object's type explicitly when wrapping Base UI parts (see `Popover.tsx`). Their `.stories.tsx` **must list every part in the meta's `subcomponents`** (see `Dialog.stories.tsx`) so each part gets its own props table in autodocs, not just the one named by `component:`.
- ESM: relative imports use `.js` extensions. `forwardRef` for single-element wrappers.
- Always merge an incoming `className` (`cn(styles.x, className)`) and spread `...props` onto the element. The built `styles.css` is wrapped in **`@layer eidra`** (post-build `scripts/wrap-css-layer.mjs`, asserted by `check-build.mjs`; ADR-0008), so consumer `className`/Tailwind utilities override DS rules instead of needing inline `style`. Don't reach for `!important` to win specificity — the layer handles override order.
- Every component ships a `.stories.tsx` (CSF3, `title: 'Category/Name'`, `tags: ['autodocs']`). **Stories are type-checked**, so they catch API misuse — keep them green. Autodocs prop tables are generated from the TS types via `react-docgen-typescript` (`.storybook/main.ts`), so **put JSDoc on the exported `*Props` interface** — it becomes the prop's description, and inherited Base UI props surface automatically (a propFilter drops raw `@types/react` DOM noise). Document props at the type, not via story `argTypes`.
- **Story title taxonomy is governed by `docs/STORYBOOK.md`** (the category also drives the generated catalog). Three tiers: `Foundations/*` (tokens/system rules, no component), `‹Function›/‹Component›` (one page per component — Actions/Forms/Navigation/Overlays/Layout/Data Display/Feedback), `Patterns/*` (recipes combining ≥2 components). **When a new component's category isn't obvious (fits two, or none), stop and ask the user — don't guess**, since a wrong title mis-files it in the catalog too.

## Charts (the `Chart` kit)

Charts compose Recharts primitives re-exported from `Chart`. Build them through the shared helpers so data prep, colour, and tooltips stay consistent (see `Chart.stories.tsx` for exemplars):

- **Colour.** Keyed multi-series set explicit colours in the `Chart.Container` `config`. Categorical charts (pie/donut/treemap/sunburst/bubble) build `config` with `Chart.categoricalConfig(rows, keyField)` and colour cells from the config value — `fill={config[key]?.color}`. **Never** `fill={\`var(--color-${key})\`}` when the key can contain spaces (e.g. "Managed Services") — CSS custom-property names can't contain spaces, so the cell renders black.
- **Tooltips.** Use `<Chart.Tooltip content={<Chart.TooltipContent … />} />`. For composite charts whose Recharts payload isn't what to show (dumbbell, waterfall, drill sunburst), pass the `rows={(datum) => [{ label, value, color? }]}` override — don't hand-roll a tooltip component.
- **Data prep.** Use `Chart.toWaterfall` / `Chart.sumHierarchy` / `Chart.dumbbellRange` instead of bespoke transforms.
- **Axes / grid.** Spread `Chart.margin` / `Chart.gridProps` / `Chart.axisProps` onto the **real** Recharts `XAxis`/`YAxis`/`CartesianGrid` (Recharts detects them by component type, so you can't wrap them in presets). Override per-axis as needed (`width`, `tickFormatter`, …).
- Spread `{...Chart.seriesDefaults}` on every `Bar`/`Line`/`Area` (disables the first-frame animation flash that breaks headless capture).

## Overlays (width policy)

Every anchored floating surface decides its width through **one** shared rule, not per-component CSS — so menus hug their content/anchor instead of stretching toward the viewport edge. Follow it for any new popup:

- The popup carries a `width` prop typed `OverlayWidth` (`'anchor' | 'content' | 'fill'`, from `utils/overlayWidth.ts`) and spreads it as `data-eidra-width`. The sizing lives **only** in the `[data-eidra-width]` block in `base.css`: `anchor` = `min-width: var(--anchor-width); width: max-content`; `content` = `width: max-content`; `fill` = `width: var(--anchor-width)`. All three cap at `min(var(--eidra-overlay-max-width, 100vw), var(--available-width))`.
- **Never** set `min-width`/`width: var(--available-width)` in a module — `--available-width` (Base UI's space-to-viewport-edge) is a **ceiling only** (`max-width`). Using it as a floor is the bug that made a left-edge `Select` span the screen.
- Defaults: field dropdowns (`Select`/`Combobox`/`Autocomplete`) → `anchor`; command menus (`Menu`/`ContextMenu`/`Menubar`/`FilterSelect`) → `content`. A command menu sets its own readable floor (`min-width: var(--eidra-size-container-2xs)`) in its module; to also cap long content, set `--eidra-overlay-max-width: var(--eidra-size-container-xs)` (the policy mins it with the viewport — no cascade fight).
- Floating panels/tooltips (`Popover`/`PreviewCard`/`Tooltip`) and modals (`Dialog`/`AlertDialog`) are content/container-scaled in their own module and don't take the prop; tokenise any fixed cap onto `--eidra-size-container-*` (don't hard-code px).

## Theming

Semantic tokens resolve per `data-theme` (`light`/`dark`) on the `eidra-root` element; `data-density` (`comfortable`/`compact`) scales control sizes — `compact` also drops the base reading size (16→14px) and steps each component's padding/gap **two** spacing steps down (the two-step convention is documented in `base.css`; follow it for new components). Components consume **semantic** tokens (`--eidra-accent`, `--eidra-fg`…), never primitives directly, so themes stay swappable.

## Commands

- `pnpm storybook` / `pnpm build-storybook` — the workshop (theme + density toolbars, a11y addon).
- `pnpm typecheck` — all packages (includes stories).
- `pnpm build` — tokens → icons → react. **All three build with Vite** (shared `vite.config.base.ts`); react's CSS Modules require it — don't switch back to tsup (it ships empty style locals + unscoped CSS; see ADR-0005). The react build self-checks via `scripts/check-build.mjs`.
- `pnpm catalog` — regenerate `docs/COMPONENTS.md` + the shipped `packages/react/llms.txt`.
- `pnpm changeset` — record a version bump in a PR (CI requires one). Merging to `main` opens a "Version Packages" PR; merging that publishes a GitHub Release with the tarballs (`.github/workflows/release.yml`). `pnpm release` packs locally; `pnpm release:github` also creates the release. Runbook: `docs/RELEASING.md`. See also `docs/CONSUMING.md` + ADR-0004.

## Storybook is a workshop, not a test runner

Browsing Storybook never auto-runs tests. `play` functions are stripped from the browse build (`.storybook/strip-play.ts`, skipped under `VITEST`) and a11y axe defaults to manual (`initialGlobals.a11y.manual` in `preview.tsx`) — so opening a story just renders it. Interaction + a11y tests still run in CI and via the manual "Run component tests" button. Don't rely on `play` executing on view. Both are read at boot, so a config change needs a full Storybook restart, not HMR.

## Sandbox note

If running in a restricted sandbox, builds need cache redirection — see the project memory `eidra-sandbox-build-env`.
