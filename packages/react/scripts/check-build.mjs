// Regression guard for the CSS Modules / "use client" contract in the built output.
// Catches the failure mode where the bundler ships empty style-locals ({}) and unscoped
// CSS (the bug that rendered every component unstyled in consumers).
import { readFile } from 'node:fs/promises';

const js = await readFile('dist/index.js', 'utf8');
const css = await readFile('dist/index.css', 'utf8');
const errors = [];

if (/_default\s*=\s*\{\}\s*[;,]/.test(js)) {
  errors.push('Empty CSS Module locals ({}) in index.js — modules were not scoped by the build.');
}
if (!/\._[A-Za-z][\w-]*_[A-Za-z0-9]{4,}/.test(css)) {
  errors.push('No hashed CSS Module class names in index.css.');
}
const bare = css.match(/^\.(root|item|trigger|popup|thumb|indicator|content|track|label)\b/m);
if (bare) {
  errors.push(`Unscoped component class leaked into index.css: ${bare[0]}`);
}
if (!js.startsWith("'use client'") && !js.startsWith('"use client"')) {
  errors.push('Missing "use client" directive at the top of index.js.');
}

if (errors.length) {
  console.error(`✗ build check failed:\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
console.log('✓ build check: CSS Modules scoped, locals populated, "use client" present');
