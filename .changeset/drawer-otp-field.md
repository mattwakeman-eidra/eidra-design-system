---
'@eidra/react': minor
---

Add two components built on Base UI primitives:

- **Drawer**: a panel that slides in from any edge (`side="right" | "left" | "top" | "bottom"`, default `right`) with swipe-to-dismiss gestures. Compound parts (Root/Trigger/Portal/Backdrop/Viewport/Popup/Title/Description/Close) plus Header/Body/Footer/CloseButton layout helpers, token-styled and density-aware.
- **OTPField**: a one-time-code / PIN input rendering a row of single-character slots that auto-advance and accept pasted codes. Supports `length`, `validationType` (numeric/alphanumeric/alpha), `mask`, and slot `size`, and wires into `<Field>` for labels and validation.
