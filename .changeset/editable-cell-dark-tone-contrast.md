---
"@eidra/tokens": patch
"@eidra/react": patch
---

Fix dark-theme legibility of the finance accent and of toned `EditableNumberCell` values, and stop a hovered editable cell from melting into its row.

**Tokens** — the `--eidra-finance-accent*` family had no `[data-theme='dark']` entry, so `accent="finance"` repointed the accent to dark steel-blue (`#27567a`/`#1d4060`) that sat illegibly on dark surfaces (the brand orange accent already inverts per theme; finance never did). Adds a dark finance-accent ramp — lighter steel-blue primitives (`finance.blue-bright/-light/-deep`) and a `finance.accent*` group in `dark.json` that mirrors the brand inversion (lighter DEFAULT/active, darker subtle, black on-accent). Flows through every `accent="finance"` surface (DataGrid, `ThemeProvider`, `[data-accent='finance']`).

**EditableNumberCell** — toned values (`tone`) coloured their text with the base tone token (red/green/orange-500), which dropped below the 4.5:1 AA floor on the hover background; danger-red negatives effectively vanished. Value text and the edit field now use the readable-on-surface tone foregrounds (`--eidra-success-fg`, `--eidra-warning-fg`, `--eidra-danger-fg`; accent uses `--eidra-accent-active`, since `--eidra-accent-fg` is the on-accent colour).

**Editable-cell hover** — `EditableNumberCell`, `EditableTextCell` and `EditableSelectCell` now take the `--eidra-accent-subtle` wash on hover (the same "cell in play" colour as a committed override/rollup) instead of a neutral grey. The row already hovers to `--eidra-surface-hover`, so a neutral cell hover made the cell indistinguishable from its shaded row; the accent-subtle fill is a distinct colour channel and, being dark, keeps the `-fg` toned values well clear of AA.

**Highlighted column** — a highlighted ("NOW") column painted a flat `accent-subtle` tint over its cells, which overrode the row background, so the column stayed frozen while the rest of a hovered row lifted to `--eidra-surface-hover`. Hovered-row highlighted cells now blend the column tint over the hover surface (`color-mix`, opaque so pinned cells stay solid) — the column lifts with the row yet still reads as the accent-tinted highlight. Per-cell value tones keep their fixed state tint.

Untoned cells, override/aggregated affordances, and the markers (●/◆) are unchanged. Adds a dark-theme guard (`pnpm --filter @eidra/react test`) asserting: every toned value clears 4.5:1 on both the cell-hover and row-hover surfaces (brand and finance); the finance accent chrome clears the 3:1 graphical floor; the cell-hover colour stays distinct from the row-hover colour; and the hovered highlighted-column colour differs from both its resting tint and a plain hovered row while keeping body text legible — all parsed from the components' own CSS so none can silently regress.
