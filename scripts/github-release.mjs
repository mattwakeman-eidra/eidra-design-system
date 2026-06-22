// Creates a GitHub Release for the current version with the packed tarballs attached.
// Idempotent: if the release already exists it does nothing (so re-running on main is safe).
// Expects `pnpm release` to have produced ./releases/*.tgz + manifest.json, and the `gh`
// CLI to be authenticated (GH_TOKEN / GITHUB_TOKEN in CI).
import { execSync } from 'node:child_process';
import { promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RELEASES = path.join(ROOT, 'releases');

const capture = (cmd) =>
  execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

function changelogSection(md, version) {
  // Grab the `## <version>` section from a Changesets CHANGELOG.md.
  const lines = md.split('\n');
  const start = lines.findIndex((l) => l.trim() === `## ${version}`);
  if (start === -1) return '';
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;
  return lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
}

// Strip Changesets' "Updated dependencies" boilerplate. The fixed group writes
// each changeset's human summary into every listed package's changelog, plus a
// per-package "Updated dependencies" block that differs between them — dropping
// that boilerplate lets packages sharing the same summary dedupe to one block.
function stripDepBumps(section) {
  const lines = section.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*-\s*Updated dependencies/i.test(lines[i])) {
      while (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1])) i++; // skip indented refs
      continue;
    }
    out.push(lines[i]);
  }
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// True if a section has content beyond its `###`/`####` headings (i.e. it's not
// just a "### Patch Changes" left empty after stripping dependency bumps).
function hasSubstance(section) {
  return section.replace(/^#{2,}.*$/gm, '').trim().length > 0;
}

// Build release notes by aggregating the `## <version>` changelog section of
// every published package, grouping packages that share an identical summary.
function buildNotes(publishedPkgs, version, tag) {
  const ORDER = ['@eidra/react', '@eidra/tokens', '@eidra/icons'];
  const ordered = [
    ...ORDER.filter((p) => publishedPkgs.includes(p)),
    ...publishedPkgs.filter((p) => !ORDER.includes(p)),
  ];
  const groups = [];
  for (const pkg of ordered) {
    const dir = pkg.replace(/^@eidra\//, '');
    let md;
    try {
      md = readFileSync(path.join(ROOT, 'packages', dir, 'CHANGELOG.md'), 'utf8');
    } catch {
      md = '';
    }
    const body = stripDepBumps(changelogSection(md, version));
    if (!hasSubstance(body)) continue;
    const g = groups.find((x) => x.body === body);
    if (g) g.pkgs.push(pkg);
    else groups.push({ pkgs: [pkg], body });
  }
  if (groups.length === 0) return `Eidra Design System ${tag}. Tarball assets attached.`;
  return groups.map((g) => `## ${g.pkgs.join(' · ')}\n\n${g.body}`).join('\n\n');
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(RELEASES, 'manifest.json'), 'utf8'));
  const { version } = manifest;
  const tag = `v${version}`;

  let exists;
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

  // Prefer hand-curated release notes (docs/releases/v<version>.md) when present:
  // the Highlights / theme-grouped / upgrade-notes layer that aggregating the raw
  // changesets can't produce. Falls back to aggregating each package's CHANGELOG
  // section, so a missing file is no worse than the previous behaviour.
  const curatedPath = path.join(ROOT, 'docs', 'releases', `${tag}.md`);
  let notes;
  try {
    notes = (await fs.readFile(curatedPath, 'utf8')).trim();
    console.log(`Using curated release notes: docs/releases/${tag}.md`);
  } catch {
    notes = buildNotes(Object.keys(manifest.files), version, tag);
  }
  const notesFile = path.join(RELEASES, 'NOTES.md');
  await fs.writeFile(notesFile, `${notes}\n`);

  const assets = [
    ...Object.values(manifest.files).map((f) => path.join(RELEASES, f)),
    path.join(RELEASES, 'manifest.json'),
  ]
    .map((p) => `"${p}"`)
    .join(' ');

  run(`gh release create ${tag} ${assets} --title "${tag}" --notes-file "${notesFile}"`);
  console.log(
    `✓ Created GitHub Release ${tag} with ${Object.keys(manifest.files).length} tarballs`,
  );
  // NOTE: do NOT emit a "New tag: <pkg>@<version>" line here. changesets/action parses that
  // pattern and tries to `git push origin <pkg>@<version>` — a per-package tag this flow never
  // creates (we tag a single `v<version>` via `gh release create`), which fails the run after
  // the release is already live. This repo's release model uses one `v<version>` tag only.
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
