# Opinionated but overridable: how much the design system imposes

The Eidra DS ships opinionated **defaults** (theme tokens, component styles, brand type and colour on the `eidra-root` scope), but it must never **force** anything a consumer cannot override, and any global "hammer" is **opt-in**, not bundled. The DS enables a look; it does not seize the page.

## Why

Raised in design-system adoption review (frankly#40, @simon-tornqvist): a design system should "enable but not force." Concretely, consumers were hitting three places where the DS imposed and the app could not cleanly take it back:

1. Component CSS shipped **unlayered**, so it beat consumer `className` / Tailwind utilities of equal specificity. The only escape was inline `style`.
2. The Tailwind v4 bridge bundled a `@theme { --*: initial }` reset that **dropped Tailwind's entire default theme** for every consumer of the bridge, whether they wanted that or not.
3. A global `*` box-sizing reset leaked onto every element in the host document, not just DS components.

## The principle

- **Defaults, not mandates.** The DS provides sensible, on-token defaults. Every one must be overridable by ordinary consumer CSS.
- **Overridable by construction.** Consumer styles win without escape hatches (no inline `style`, no `!important`).
- **Global resets are opt-in.** Anything that reaches outside a DS component (resets the host's theme, the document box model, etc.) ships as a separate import the app chooses, never bundled into a default entrypoint.

## How it is implemented

- **Cascade layer (ADR-0008).** Component styles ship in `@layer eidra`, a low-priority layer. Consumer unlayered CSS and Tailwind utilities (a later layer) override DS rules via `className`. This covers the root brand type/colour/background too: they are defaults you can override, not forced styling.
- **Opt-in Tailwind reset.** The `@theme { --*: initial }` reset is split out of `@eidra/react/tailwind.css` (which now only maps Eidra tokens onto Tailwind's theme) into a separate `@eidra/react/tailwind-reset.css`. An app that wants Eidra-only utilities imports the reset; otherwise Tailwind's defaults stay. The choice lives in the app.
- **Scoped box-sizing reset.** The box-sizing reset is bounded to the `eidra-root` subtree (and portaled popups) instead of a global `*` selector, so it no longer touches host markup.

## Consequences

- Consumers can set their own fonts, background/foreground, layout, and utilities using the DS tokens, and they win over the DS defaults.
- The Tailwind bridge no longer drops Tailwind's defaults by default — apps that relied on that add `@eidra/react/tailwind-reset.css` (see `docs/CONSUMING.md` §5).
- The DS stays batteries-included for the common path, while remaining un-opinionated where it counts: it does not modify anything the consumer cannot reclaim.
