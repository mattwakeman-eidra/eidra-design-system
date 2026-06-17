---
"@eidra/react": patch
---

Storybook + catalog taxonomy cleanup, now documented in `docs/STORYBOOK.md` (three tiers: `Foundations/*`, `‹Function›/‹Component›`, `Patterns/*`). No component code changes — story titles and the generated catalog/`llms.txt` categories only:

- Folded the redundant `Inputs` category into `Forms` (`FilterSelect`, `SegmentedControl`).
- Moved the cross-component `Data Visualization` gallery from `Foundations` to `Patterns`.
- Moved the `Statistic` KPI compositions (KPI bar, stat-card grid) to a new `Patterns/KPIs` page; `Statistic`'s own page keeps its prop/variant stories.
- Added a `Foundations/Theming` page for `ThemeProvider` (was uncategorised).
