---
---

Tooling only — no published change. Adds ESLint (flat config), Prettier, and
Stylelint with a fast, build-free `lint` CI gate (`pnpm lint` + `pnpm
format:check`), plus the genuine lint findings they surfaced (a dead
`tabular-nums` declaration, an overridden `animation: none`, redundant
`padding-inline-start`, unused imports). Nothing in the published packages
changes.
