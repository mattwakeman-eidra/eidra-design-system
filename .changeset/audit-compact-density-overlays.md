---
"@eidra/react": patch
---

Component audit follow-ups — consistency fixes from a catalog-wide review:

- **Theme and density now propagate into portaled popups (bulletproof).** `ThemeProvider` publishes its `{ theme, density }` via context, and every portaled surface — `Dialog`, `AlertDialog`, `Popover`, `Menu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Select`, `Combobox`, `Autocomplete`, `Tooltip`, `PreviewCard`, `Toast` — stamps `data-theme`/`data-density` onto its positioner/popup. Popups render outside the `eidra-root` subtree (Base UI portals to `document.body`), so they previously missed both the theme (dark popups rendered light) and compact density (the trigger shrank but its menu/dialog/list stayed comfortable). Now they match the scope regardless of where it sits. Without a `ThemeProvider` above, behaviour is unchanged.
- **Compact density blocks for overlays/menus/dropdowns.** Added `[data-density='compact']` blocks (documented `base.css` convention — both padding axes one step down) to the components above, and mirrored the control-size compact remap onto the bare `[data-density='compact']` attribute so controls rendered inside a portal shrink too.
- **`Menubar` arrow** now uses the shared `fill`/`stroke` token treatment like the other arrows, removing the only hardcoded colour (`rgb(0 0 0 / 0.1)` drop-shadow) in the catalog.
- **`Field`** ships its own Storybook story (`Forms/Field`) + autodocs page; previously it was only demonstrated inside the `Input` stories.
