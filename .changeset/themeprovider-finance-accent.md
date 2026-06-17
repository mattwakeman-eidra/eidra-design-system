---
"@eidra/react": minor
---

`ThemeProvider` gains an **`accent`** prop (`'brand'` | `'finance'`, default `'brand'`). `accent="finance"` repoints the accent tokens to the financial data-viz blue (`--eidra-finance-accent*`) for the whole scope — mirroring `DataGrid`'s `accent` prop but at the theme level — and propagates to portaled components (menus, dialogs, tooltips) via the scope context. Implemented as a `[data-accent='finance']` token repoint in the base layer, so setting `data-accent="finance"` on your own root works too. The `Foundations/Theming` story gains an `accent` control plus an `Accent` showcase.

Also: showcase stories that ignore args (`Statistic`'s `AccentedKpiRow`, `ThemeProvider`'s `Matrix`/`Accent`) now disable the Controls panel, which previously showed inapplicable controls.
