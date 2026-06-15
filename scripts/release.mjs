// Builds the Eidra packages and packs version-stamped tarballs into ./releases,
// writing a manifest.json that consumers read to wire up file: dependencies.
//
//   pnpm release                 # build + pack into ./releases
//   pnpm release --to <dir>      # also copy the tarballs into <dir> (e.g. a consumer's vendor dir)
//   pnpm release --no-build      # skip the build (tarballs from existing dist)
import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const PKGS = ['tokens', 'icons', 'react'];
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'releases');

const args = process.argv.slice(2);
const toIdx = args.indexOf('--to');
const copyTo = toIdx !== -1 ? path.resolve(args[toIdx + 1]) : null;
const skipBuild = args.includes('--no-build');

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

async function main() {
  const version = (await readJson('packages/react/package.json')).version;
  for (const p of PKGS) {
    const v = (await readJson(`packages/${p}/package.json`)).version;
    if (v !== version) {
      throw new Error(
        `Version mismatch: @eidra/${p} is ${v} but @eidra/react is ${version}. ` +
          `Run "pnpm version-packages" so the fixed group is in sync.`,
      );
    }
  }

  console.log(`\n▶ Releasing @eidra/* v${version}\n`);
  if (!skipBuild) run('pnpm build');
  run('node scripts/catalog.mjs'); // refresh the shipped llms.txt agent catalog

  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const files = {};
  for (const p of PKGS) {
    run(`pnpm pack --pack-destination "${OUT}"`, { cwd: path.join(ROOT, 'packages', p) });
    files[`@eidra/${p}`] = `eidra-${p}-${version}.tgz`;
  }

  const manifest = { version, files, packedAt: new Date().toISOString() };
  await fs.writeFile(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  if (copyTo) {
    await fs.mkdir(copyTo, { recursive: true });
    for (const f of Object.values(files)) {
      await fs.copyFile(path.join(OUT, f), path.join(copyTo, f));
    }
    await fs.copyFile(path.join(OUT, 'manifest.json'), path.join(copyTo, 'manifest.json'));
    console.log(`\n✓ Copied tarballs + manifest to ${copyTo}`);
  }

  console.log(`\n✓ @eidra/* v${version} packed into ${path.relative(ROOT, OUT)}/`);
  console.log('\nConsumer package.json dependencies:');
  for (const [name, file] of Object.entries(files)) {
    console.log(`  "${name}": "file:vendor/eidra/${file}",`);
  }
  console.log('\nIn the consumer, run your sync script (see docs/consuming.md) then `pnpm install`.\n');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
