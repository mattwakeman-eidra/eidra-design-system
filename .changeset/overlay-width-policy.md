---
"@eidra/react": minor
"@eidra/tokens": minor
---

One coherent width policy for every anchored overlay — fixes full-width menus.

**The bug.** `Select` (and `Combobox`) set `min-width: var(--available-width)` on their popup. `--available-width` is Base UI's space from the popup to the viewport edge, so a trigger near the left of a wide screen opened a menu that spanned almost the whole viewport (~1584px in a 1600px window). Consumers were working around it with inline `style={{ minWidth: 'var(--anchor-width)', width: 'max-content' }}`.

**The policy.** Overlay width is now decided in one place — the `[data-eidra-width]` block in `base.css` — driven by a typed `width` prop on each anchored popup:

- `anchor` — at least as wide as the trigger, then hug content, capped at the viewport (`min-width: var(--anchor-width); width: max-content`). **Default** for `Select`, `Combobox`, `Autocomplete`.
- `content` — hug content, capped at the viewport, with a readable per-component floor. **Default** for `Menu`, `ContextMenu`, `Menubar`, `FilterSelect`.
- `fill` — exactly the trigger width.

All three cap at `min(var(--eidra-overlay-max-width, 100vw), var(--available-width))` — `--available-width` is now only ever a ceiling, never a floor. The `OverlayWidth` type is exported from `@eidra/react`.

**Tokens.** New `--eidra-size-container-2xs` (11.25rem) and `--eidra-size-container-xs` (20rem). The fixed overlay widths that were magic numbers (Menu/Menubar/ContextMenu/FilterSelect floors, Popover/Tooltip/ContextMenu/FilterSelect caps) now reference these instead of `180px`/`220px`/`280px`/`320px`.

**Consumers:** after syncing, delete inline `minWidth`/`width` overrides on overlay popups (e.g. Frankly's Client Dashboard `Select.Popup`s) — the default behaviour now hugs the trigger/content. Use `width="fill"` if you specifically want a popup to match its trigger width, or `width="anchor"`/`"content"` to override a component's default.
