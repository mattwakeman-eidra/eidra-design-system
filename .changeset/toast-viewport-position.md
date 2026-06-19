---
"@eidra/react": minor
---

`Toast.Viewport` gains a `position` prop to anchor the toast stack to any corner or edge — `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` (defaults to `bottom-right`, unchanged). Placement is driven by a `data-position` attribute with a single `--_inset` distance (compact density tightens the inset). The Toast stories expose it as a "Viewport position" control.
