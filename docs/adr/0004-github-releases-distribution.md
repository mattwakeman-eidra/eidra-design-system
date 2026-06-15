# Distribute tarballs via GitHub Releases

The design system is **not** published to an npm-style registry. Instead, each release attaches the packed tarballs (`eidra-*-<version>.tgz`) and `manifest.json` as assets to a **GitHub Release**, driven by Changesets + GitHub Actions:

1. A feature PR that changes a package includes a changeset (`.changeset/*.md`); CI fails the PR if one is missing.
2. On merge to `main`, `changesets/action` opens/updates a **"Version Packages" PR** (bumps the fixed group's version + changelogs).
3. Merging the Version Packages PR runs the publish step: build → pack → create a GitHub Release `v<version>` with the three tarballs + manifest attached.

Consumers install the tarballs from the release (URL dependency for public repos, or `gh release download` into a vendor dir for private repos).

## Why

GitHub Packages was rejected because its npm registry requires the package **scope to equal the GitHub owner** — we don't own the `eidra` org, and renaming the scope away from `@eidra` was undesirable. GitHub Releases have no such constraint: they're plain file assets, so the `@eidra/*` names are preserved and no registry, scope change, or extra service is needed. The source repo and the artifacts both live on GitHub, and releases are still driven by a reviewable PR landing on `main`.

## Consequences

- **Versioned URLs are deterministic.** A release URL embeds the version, so a consumer's lockfile pins exact bytes; bumping the version changes the URL and forces a clean reinstall.
- **Private repos need auth to download assets** — consumers use `gh release download` (or a tokened URL) rather than a bare URL. Public repos can use the URL directly with no auth.
- **The local tarball flow (ADR-0003) is unchanged** for offline/inner-loop work (`pnpm release` → `sync-eidra` from a local path).
- Switching to a real registry later only changes the publish step and the consumer install line; the Changesets/PR flow stays the same.
