/**
 * Width policy for anchored overlay popups (Select, Combobox, Autocomplete, Menu,
 * ContextMenu, Menubar, FilterSelect). The popup component spreads the chosen value
 * as a `data-eidra-width` attribute; the actual sizing lives in one place — the
 * `[data-eidra-width]` rules in `styles/base.css` — so every floating surface
 * resolves its width the same way.
 *
 * Base UI's positioner exposes `--anchor-width` (the trigger width) and
 * `--available-width` (the space from the popup to the viewport edge). The policy:
 *
 *  - `anchor`  — at least as wide as the trigger, then hug content, never past the
 *    viewport (`min-width: var(--anchor-width); width: max-content;
 *    max-width: var(--available-width)`). Default for field dropdowns whose popup
 *    should line up with the control (Select, Combobox, Autocomplete).
 *  - `content` — hug content, never past the viewport, with no trigger floor.
 *    Default for command menus (Menu, ContextMenu, Menubar, FilterSelect), which
 *    set their own readable `min-width` token in their module CSS.
 *  - `fill`    — exactly the trigger width (`width: var(--anchor-width)`).
 *
 * `--available-width` is only ever used as a CEILING (`max-width`) — never as
 * `min-width`/`width`, or a popup near the viewport edge stretches almost
 * full-width (the original Select bug).
 */
export type OverlayWidth = 'anchor' | 'content' | 'fill';
