# Publish to GitHub Packages via a Changesets release PR

> **Status: Superseded by [ADR-0004 — Distribute tarballs via GitHub Releases](./0004-github-releases-distribution.md).** GitHub Packages' npm registry requires the package scope to equal the repo owner; we kept the `@eidra/*` scope and ship tarballs attached to GitHub Releases instead. Retained for history. (This ADR was originally also numbered 0004 — the collision is the reason for the renumber.)

The design system publishes `@eidra/*` to **GitHub Packages** (the npm registry at `npm.pkg.github.com`). Releases are driven by **Changesets** and GitHub Actions:

1. Every feature PR that changes a package includes a changeset (`.changeset/*.md`). CI fails the PR if one is missing.
2. On merge to `main`, the `changesets/action` opens (or updates) a **"Version Packages" PR** that bumps the fixed group's version and writes changelogs.
3. Merging the Version Packages PR runs `changeset publish`, which publishes the updated packages to GitHub Packages.

So every release is a reviewable PR, and `main` is always the source of truth.

## Why

The goal is a shared, versioned package consumed across apps (frankly and beyond), released as code lands on `main`. A registry gives deterministic semver installs (`@eidra/react@^0.1.0`) and proper changelogs — better than the local tarball flow (ADR-0003) once there's more than one consumer or any CI. GitHub Packages keeps it on the same platform as the source with no extra service, using the built-in `GITHUB_TOKEN` for auth.

## Constraints & consequences

- **Scope must match the repo owner.** GitHub Packages requires the npm scope (`@eidra`) to equal the GitHub org/user that owns the repo. This assumes the repo is `github.com/eidra/eidra-design-system`. If the org differs, rename the scope across all `package.json` names + `publishConfig`, or rename the org.
- **Consumers authenticate.** Even read access needs a token. Apps add an `.npmrc` with `@eidra:registry=https://npm.pkg.github.com` and a PAT/`GITHUB_TOKEN` with `read:packages` (see `docs/CONSUMING.md`).
- **The local tarball flow (ADR-0003) stays** as the offline/inner-loop path (`pnpm release` → `sync-eidra`). It does not require the registry or auth.
- Migrating to public npm later is a registry-URL change in `publishConfig` + consumer `.npmrc`; the Changesets flow is unchanged.
