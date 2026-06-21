// Consumer-side updater for the Eidra Design System.
//
// Copy this into the CONSUMER repo (e.g. frankly: apps/web/scripts/sync-eidra.mjs),
// adjust TARGET_PACKAGE_JSON / VENDOR_DIR for your layout, then run one of:
//
//   node scripts/sync-eidra.mjs OWNER/eidra-design-system            # latest GitHub Release (needs `gh`)
//   node scripts/sync-eidra.mjs OWNER/eidra-design-system v0.1.2     # a specific release tag
//   node scripts/sync-eidra.mjs /path/to/eidra-design-system/releases  # a local releases dir
//   node scripts/sync-eidra.mjs                                       # $EIDRA_RELEASES or the default path
//
// It fetches the version-stamped tarballs, copies them into the vendor dir, rewrites the
// @eidra/* file: dependencies to that version, and runs `pnpm install`.
import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// --- adjust for your repo layout ---
const TARGET_PACKAGE_JSON = path.resolve('package.json'); // run from the consuming package's dir
const VENDOR_DIR = path.resolve('vendor/eidra');
const DEFAULT_RELEASES = path.resolve('../../../eidra-design-system/releases');
// ------------------------------------

const arg = process.argv[2] ?? process.env.EIDRA_RELEASES ?? DEFAULT_RELEASES;
const tag = process.argv[3];
const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

async function resolveReleasesDir() {
  const looksLikeRepo = /^[\w.-]+\/[\w.-]+$/.test(arg) && !(await exists(arg));
  if (!looksLikeRepo) return path.resolve(arg);

  // GitHub Release mode: download assets via the gh CLI into a temp dir.
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'eidra-release-'));
  const tagArg = tag ?? '';
  console.log(`▶ Downloading ${arg} release ${tag ?? '(latest)'} via gh`);
  execSync(
    `gh release download ${tagArg} --repo ${arg} --dir "${dir}" --pattern "*.tgz" --pattern "manifest.json" --clobber`,
    { stdio: 'inherit' },
  );
  return dir;
}

const exists = (p) =>
  fs
    .access(p)
    .then(() => true)
    .catch(() => false);

async function main() {
  const releasesDir = await resolveReleasesDir();
  const manifestPath = path.join(releasesDir, 'manifest.json');
  let manifest;
  try {
    manifest = await readJson(manifestPath);
  } catch {
    throw new Error(`No manifest at ${manifestPath}. Pass a releases dir or OWNER/REPO.`);
  }

  console.log(`▶ Syncing @eidra/* v${manifest.version}`);
  await fs.mkdir(VENDOR_DIR, { recursive: true });
  for (const f of await fs.readdir(VENDOR_DIR)) {
    if (f.endsWith('.tgz')) await fs.rm(path.join(VENDOR_DIR, f));
  }
  for (const file of Object.values(manifest.files)) {
    await fs.copyFile(path.join(releasesDir, file), path.join(VENDOR_DIR, file));
  }

  const pkg = await readJson(TARGET_PACKAGE_JSON);
  pkg.dependencies ??= {};
  const vendorRel = path.relative(path.dirname(TARGET_PACKAGE_JSON), VENDOR_DIR);
  for (const [name, file] of Object.entries(manifest.files)) {
    pkg.dependencies[name] = `file:${path.join(vendorRel, file)}`;
  }
  await fs.writeFile(TARGET_PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`✓ Updated @eidra/* deps to v${manifest.version}`);

  console.log('▶ pnpm install');
  execSync('pnpm install', { stdio: 'inherit' });
  console.log(`\n✓ @eidra/* v${manifest.version} installed.`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
