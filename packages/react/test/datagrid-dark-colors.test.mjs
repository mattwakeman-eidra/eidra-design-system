/**
 * Dark-theme contrast guard for EditableNumberCell toned values.
 *
 * A toned cell (`data-tone`) colours its value text, and hovering tints the
 * cell background. In dark theme those two must still clear the WCAG AA 4.5:1
 * floor for normal text — historically they didn't: base tone tokens
 * (red/green/orange-500) on the grey-700 surface-active hover dropped to
 * ~1.5–3.6:1, and red negatives effectively vanished.
 *
 * This test reads the component's *actual* CSS mappings (which token each tone
 * uses, which surface the hover uses) and resolves them through the shipped
 * dark-theme tokens — so reverting either fix (tone → base token, or hover →
 * surface-active) makes it fail rather than silently regressing.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

const TOKENS_CSS = readFileSync(
  here('../node_modules/@eidra/tokens/dist/eidra-tokens.css'),
  'utf8',
);
const CELL_CSS = readFileSync(
  here('../src/components/DataGrid/EditableNumberCell.module.css'),
  'utf8',
);
const GRID_CSS = readFileSync(here('../src/components/DataGrid/DataGrid.module.css'), 'utf8');

const AA_NORMAL = 4.5;

// ---- Token resolver -------------------------------------------------------
// Build a base map (primitives + light semantics) and a dark-theme override
// map, then resolve `var(--x)` chains with dark taking precedence.
function buildTokenMaps(css) {
  const darkStart = css.indexOf("[data-theme='dark']");
  assert.notEqual(darkStart, -1, "expected a [data-theme='dark'] block in tokens");
  const open = css.indexOf('{', darkStart);
  // Walk braces to find the matching close of the dark block.
  let depth = 0;
  let darkEnd = -1;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) {
      darkEnd = i;
      break;
    }
  }
  assert.notEqual(darkEnd, -1, 'unterminated dark-theme block');

  const decl = /(--[\w-]+)\s*:\s*([^;]+);/g;
  const base = new Map();
  const dark = new Map();
  let m;
  while ((m = decl.exec(css))) {
    const [, name, value] = [m[0], m[1], m[2].trim()];
    if (m.index > open && m.index < darkEnd) dark.set(name, value);
    else base.set(name, value);
  }
  return { base, dark };
}

const { base, dark } = buildTokenMaps(TOKENS_CSS);

function resolveDark(token, seen = new Set()) {
  assert.ok(!seen.has(token), `circular token reference at ${token}`);
  seen.add(token);
  const raw = dark.get(token) ?? base.get(token);
  assert.ok(raw !== undefined, `unknown token ${token}`);
  const ref = raw.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (ref) return resolveDark(ref[1], seen);
  return raw;
}

// ---- Colour / contrast maths ---------------------------------------------
function hexToRgb(hex) {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  assert.match(full, /^[0-9a-fA-F]{6}$/, `not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}
function relativeLuminance([r, g, b]) {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrast(fgHex, bgHex) {
  const l1 = relativeLuminance(hexToRgb(fgHex));
  const l2 = relativeLuminance(hexToRgb(bgHex));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// ---- Parse the component's own mappings ----------------------------------
function hoverBgToken(css) {
  const m = css.match(/\.cell:hover[^{]*\{[^}]*?background-color:\s*var\(\s*(--[\w-]+)\s*\)/s);
  assert.ok(m, 'could not find the .cell:hover background-color');
  return m[1];
}
function toneValueTokens(css) {
  const re = /\.cell\[data-tone='(\w+)'\]\s+\.value\s*\{\s*color:\s*var\(\s*(--[\w-]+)\s*\)/g;
  const out = {};
  let m;
  while ((m = re.exec(css))) out[m[1]] = m[2];
  return out;
}

const ROW_HOVER = '--eidra-surface-hover'; // the neutral shade a hovered row takes
const cellHoverToken = hoverBgToken(CELL_CSS);
const tones = toneValueTokens(CELL_CSS);

// The two dark surfaces a toned value realistically sits on while interacting:
// the cell's own hover wash (the cursor cell) and the row-hover shade (a toned
// value elsewhere in the hovered row). Both must keep the value legible.
const shadedSurfaces = [
  { label: 'cell hover', token: cellHoverToken },
  { label: 'row hover', token: ROW_HOVER },
];

test('all four tones are wired up', () => {
  assert.deepEqual(Object.keys(tones).sort(), ['accent', 'caution', 'danger', 'positive']);
});

// The cell-hover highlight must not reuse the row-hover colour, or a hovered
// cell melts into its already-shaded row (no cell-vs-row distinction).
test('cell hover is a distinct colour from the row-hover shade', () => {
  assert.notEqual(
    cellHoverToken,
    ROW_HOVER,
    `cell hover (${cellHoverToken}) must differ from the row-hover colour (${ROW_HOVER})`,
  );
  assert.notEqual(
    resolveDark(cellHoverToken),
    resolveDark(ROW_HOVER),
    'cell-hover and row-hover resolve to the same dark colour',
  );
});

for (const [tone, token] of Object.entries(tones)) {
  for (const surf of shadedSurfaces) {
    test(`dark-theme: ${tone} value on ${surf.label} clears AA (${AA_NORMAL}:1)`, () => {
      const fg = resolveDark(token);
      const bg = resolveDark(surf.token);
      const ratio = contrast(fg, bg);
      assert.ok(
        ratio >= AA_NORMAL,
        `${tone} (${token} → ${fg}) on ${surf.label} (${surf.token} → ${bg}) is ${ratio.toFixed(2)}:1, below ${AA_NORMAL}:1`,
      );
    });
  }
}

// ---- Finance accent in dark theme ----------------------------------------
// `accent="finance"` (DataGrid prop / ThemeProvider / [data-accent='finance'])
// repoints --eidra-accent* to the --eidra-finance-accent* family 1:1. Those had
// no dark-theme override and stayed dark steel-blue (#27567a/#1d4060), so accent
// chrome and accent-toned values went dark-on-dark. They must now invert to read
// on dark surfaces; if the dark override is dropped these fall back and fail.
const AA_GRAPHICAL = 3; // WCAG non-text (markers/borders) floor
// Under finance, the cursor cell's wash is the finance accent-subtle (the brand
// accent-subtle repointed), so check the finance accent value text against both
// that and the neutral row-hover shade.
const financeShaded = [
  { label: 'finance cell hover', token: '--eidra-finance-accent-subtle' },
  { label: 'row hover', token: ROW_HOVER },
];
for (const surf of financeShaded) {
  test(`dark-theme finance: accent-toned value on ${surf.label} clears AA (${AA_NORMAL}:1)`, () => {
    const fg = resolveDark('--eidra-finance-accent-active');
    const bg = resolveDark(surf.token);
    const ratio = contrast(fg, bg);
    assert.ok(
      ratio >= AA_NORMAL,
      `finance accent-active (${fg}) on ${surf.label} (${bg}) is ${ratio.toFixed(2)}:1, below ${AA_NORMAL}:1`,
    );
  });
}
test(`dark-theme finance: accent chrome (DEFAULT — markers/borders) on the resting cell surface clears ${AA_GRAPHICAL}:1`, () => {
  const fg = resolveDark('--eidra-finance-accent');
  const bg = resolveDark('--eidra-surface');
  const ratio = contrast(fg, bg);
  assert.ok(
    ratio >= AA_GRAPHICAL,
    `finance accent (${fg}) on surface (${bg}) is ${ratio.toFixed(2)}:1, below ${AA_GRAPHICAL}:1`,
  );
});

// ---- Highlighted column tracks the row state -----------------------------
// A highlighted ("NOW") column paints a flat tint over its cells. The cells
// must still react when their row is hovered/selected — otherwise the current
// column looks frozen while the rest of the row lifts. The hovered-row rule
// blends the column tint over the row-hover surface; that result must differ
// from BOTH the resting highlight (so the row state is visible) and the plain
// row-hover surface (so it still reads as the highlighted column).
function toHex([r, g, b]) {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}
// Evaluate a CSS colour value to a dark-theme hex: a hex, a var(), or a
// `color-mix(in srgb, <A> p%, <B>)` of two resolvable colours.
function resolveColorValue(value) {
  const v = value.trim();
  const mix = v.match(/^color-mix\(\s*in srgb\s*,\s*(.+?)\s+(\d+(?:\.\d+)?)%\s*,\s*(.+?)\s*\)$/);
  if (mix) {
    const a = hexToRgb(resolveColorValue(mix[1]));
    const b = hexToRgb(resolveColorValue(mix[3]));
    const p = Number(mix[2]) / 100;
    return toHex([0, 1, 2].map((i) => a[i] * p + b[i] * (1 - p)));
  }
  const ref = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (ref) return resolveDark(ref[1]);
  return v;
}
// Pull the background-color value from a `.row:hover ... [data-highlighted...]` rule.
function hoveredHighlightBg(css, toneAttr) {
  const re = new RegExp(
    `\\.row:hover[^{]*\\[${toneAttr}\\][^{]*\\{[^}]*?background-color:\\s*([^;]+);`,
    's',
  );
  const m = css.match(re);
  assert.ok(m, `could not find a .row:hover ...[${toneAttr}] background-color`);
  return resolveColorValue(m[1]);
}

for (const variant of [
  { label: 'accent', toneAttr: 'data-highlighted', resting: '--eidra-accent-subtle' },
  {
    label: 'finance',
    toneAttr: "data-highlight-tone='finance'",
    resting: '--eidra-finance-accent-subtle',
  },
]) {
  const hovered = hoveredHighlightBg(GRID_CSS, variant.toneAttr);
  const resting = resolveDark(variant.resting);
  const rowHover = resolveDark('--eidra-surface-hover');

  test(`dark-theme: hovered ${variant.label} highlight differs from its resting tint`, () => {
    assert.notEqual(
      hovered,
      resting,
      `${variant.label} highlight does not react to row hover (${hovered})`,
    );
  });
  test(`dark-theme: hovered ${variant.label} highlight still differs from a plain hovered row`, () => {
    assert.notEqual(
      hovered,
      rowHover,
      `${variant.label} highlight is indistinguishable from a normal hovered cell (${hovered})`,
    );
  });
  test(`dark-theme: body text stays legible on the hovered ${variant.label} highlight`, () => {
    const ratio = contrast(resolveDark('--eidra-fg'), hovered);
    assert.ok(
      ratio >= AA_NORMAL,
      `--eidra-fg on hovered ${variant.label} highlight (${hovered}) is ${ratio.toFixed(2)}:1`,
    );
  });
}
