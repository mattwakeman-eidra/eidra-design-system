---
---

Tooling/lint only; no behavioural change to the published packages. Resolve the
outstanding ESLint/Stylelint warnings ahead of 1.6.0:

- Remove redundant Storybook story `name`s; associate demo `<label>`s with their
  controls (`htmlFor` + `id`); hoist a `Date.now()` call out of render.
- Move DataGrid's latest-value ref writes into an effect (writing refs during render
  is what the new react-hooks rule flags; behaviour is unchanged).
- Document the intentional `any`s (dynamically-shaped Recharts payload/datum) and the
  deliberately focusable text tooltip triggers, rather than retyping/restructuring them.
- Ignore `.claude/` (git worktrees) in ESLint + Prettier so local lint matches CI, and
  rename the junit check to "Storybook test report" so it isn't confused with the
  `storybook-test` job.
