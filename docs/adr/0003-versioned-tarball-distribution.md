# Versioned tarball distribution

The packages are not published to a registry. Instead, `pnpm release` builds and `pnpm pack`s **version-stamped tarballs** (`eidra-<pkg>-<version>.tgz`) into `./releases/` with a `manifest.json`. Consuming apps reference them via `file:` dependencies and update by re-syncing. Versions are managed with **Changesets** (the three packages are a fixed group, so they always share one version).

## Why

There's one local consumer (frankly) during active co-development and no registry stood up yet. A registry (Verdaccio / GitHub Packages) was considered but adds infrastructure or auth we don't need for a single local consumer right now.

The load-bearing requirement is **deterministic updates**: a stable tarball filename lets pnpm serve stale cached bytes after the design system changes. Stamping the version into the filename changes the `file:` path on every release, which forces pnpm to reinstall the new code — no `--force`, no cache confusion.

Packing also resolves the `workspace:*` internal dependencies (`@eidra/react` → `@eidra/tokens`/`@eidra/icons`) to concrete versions, which a plain `file:`-link to the package directories cannot do outside the workspace.

## Consequences

- Consumers commit `vendor/eidra/*.tgz` so CI and teammates install identical bytes.
- Updating is a single command in the consumer (`sync-eidra.mjs` → copy tarballs, rewrite `file:` versions, install). See [CONSUMING.md](../CONSUMING.md).
- Migrating to a real registry later is low-cost: bump-and-publish replaces pack-and-sync; the Changesets versioning already in place carries over.
