# Changesets

This folder holds [changesets](https://github.com/changesets/changesets) — small markdown files describing intended version bumps.

The three packages (`@eidra/tokens`, `@eidra/icons`, `@eidra/react`) are a **fixed group**: any release bumps all three to the same version, so consumers only track one Eidra version.

## Releasing a new version

```bash
pnpm changeset          # describe the change; pick patch/minor/major
pnpm version-packages   # apply the bump to all three package.json + changelogs
pnpm release            # build + pack version-stamped tarballs into ./releases
```

Then update the consumer (see `docs/CONSUMING.md`).
