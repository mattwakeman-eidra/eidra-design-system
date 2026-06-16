---
"@eidra/react": patch
---

Move `@eidra/tokens` and `@eidra/icons` from `peerDependencies` to `dependencies`. They aren't imported by react's runtime (tokens CSS is inlined at build; icons is imported by consumers directly), and classifying them as peers caused Changesets to force a major version bump on every tokens/icons change.
