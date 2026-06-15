// Creates a GitHub Release for the current version with the packed tarballs attached.
// Idempotent: if the release already exists it does nothing (so re-running on main is safe).
// Expects `pnpm release` to have produced ./releases/*.tgz + manifest.json, and the `gh`
// CLI to be authenticated (GH_TOKEN / GITHUB_TOKEN in CI).
import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RELEASES = path.join(ROOT, 'releases');

const capture = (cmd) => execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

function changelogSection(md, version) {
  // Grab the `## <version>` section from a Changesets CHANGELOG.md.
  const lines = md.split('\n');
  const start = lines.findIndex((l) => l.trim() === `## ${version}`);
  if (start === -1) return '';
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;
  return lines.slice(start + 1, end).join('\n').trim();
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(RELEASES, 'manifest.json'), 'utf8'));
  const { version } = manifest;
  const tag = `v${version}`;

  let exists = false;
  try {
    capture(`gh release view ${tag}`);
    exists = true;
  } catch {
    exists = false;
  }
  if (exists) {
    console.log(`Release ${tag} already exists — nothing to do.`);
    return;
  }

  const changelog = await fs.readFile(path.join(ROOT, 'packages/react/CHANGELOG.md'), 'utf8').catch(() => '');
  const notes =
    changelogSection(changelog, version) || `Eidra Design System ${tag}. Tarball assets attached.`;
  const notesFile = path.join(RELEASES, 'NOTES.md');
  await fs.writeFile(notesFile, `${notes}\n`);

  const assets = [
    ...Object.values(manifest.files).map((f) => path.join(RELEASES, f)),
    path.join(RELEASES, 'manifest.json'),
  ]
    .map((p) => `"${p}"`)
    .join(' ');

  run(`gh release create ${tag} ${assets} --title "${tag}" --notes-file "${notesFile}"`);
  console.log(`✓ Created GitHub Release ${tag} with ${Object.keys(manifest.files).length} tarballs`);
  // NOTE: do NOT emit a "New tag: <pkg>@<version>" line here. changesets/action parses that
  // pattern and tries to `git push origin <pkg>@<version>` — a per-package tag this flow never
  // creates (we tag a single `v<version>` via `gh release create`), which fails the run after
  // the release is already live. This repo's release model uses one `v<version>` tag only.
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
