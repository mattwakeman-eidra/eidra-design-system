---
---

Repo hygiene only — no published change. Stops tracking the generated
`packages/tokens/build/` scratch dir (gitignored; rebuilt from the DTCG JSON on
every build) and narrows the CI freshness guard to the committed+shipped
generated docs. Nothing in the published packages changes.
