---
"@eidra/react": patch
---

Stop the box-sizing reset leaking into consumer apps.

`@eidra/react/styles.css` shipped a global `*, *::before, *::after { box-sizing: border-box }` reset, so importing the stylesheet forced `border-box` onto **every** element in the host app — not just Eidra components. That's invasive and can conflict with a consumer's own layout (flagged in design-system adoption review).

The reset is now **scoped to the Eidra subtree**: `.eidra-root` and its descendants, plus portaled popups (which render outside `.eidra-root`). `ThemeProvider` now stamps a bare `data-eidra-scope` marker on the popup positioner — via the same `useScopeDataAttrs` path that already replicates `data-theme`/`data-density`/`data-accent` — so menus, dialogs, and tooltips still get the reset. Component CSS Modules continue to get `border-box`; the host app's own elements are left untouched.

No API change. If you relied on `@eidra/react/styles.css` to reset box-sizing for your **own** (non-Eidra) markup, add a reset in your app.
