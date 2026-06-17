---
"@eidra/react": patch
---

Component audit follow-ups — consistency fixes from a catalog-wide review:

- **Compact density now reaches overlays, menus, and dropdowns.** Added `[data-density='compact']` blocks (following the documented `base.css` convention — both padding axes reduced one step) to `Dialog`, `AlertDialog`, `Popover`, `Menu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Toolbar`, and the `Combobox` / `Select` / `Autocomplete` popups. Previously a compact scope shrank the control trigger but left its menu/dialog/list at comfortable spacing. Applies wherever `data-density` is on an ancestor of the portal (e.g. scoped at `html`/`body`), matching the existing density-aware overlays (`Tooltip`, `Toast`, `PreviewCard`).
- **`Menubar` arrow** now uses the shared `fill`/`stroke` token treatment like the other arrows, removing the only hardcoded colour (`rgb(0 0 0 / 0.1)` drop-shadow) in the catalog.
- **`Field`** ships its own Storybook story (`Forms/Field`) + autodocs page; previously it was only demonstrated inside the `Input` stories.
