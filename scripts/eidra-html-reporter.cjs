// Custom Istanbul coverage reporter: generates the standard HTML report, then
// brands it to match the Storybook workshop (.storybook/manager.ts) — Eidra Sans,
// the creme/orange/coral palette, and the logo in the header. Wired into
// vitest.config.ts (`coverage.reporter`), so it runs on every coverage pass —
// the `--coverage` CLI *and* the Storybook Vitest addon UI.
//
// CommonJS on purpose: Istanbul loads custom reporters with `require(name)`, so
// this must be require-able (hence .cjs) and is referenced by absolute path.
//
// It wraps the built-in `html` reporter (rather than reimplementing it) and, once
// the report is written, appends override rules to the single `base.css` every
// page links to, and copies the logo into the report root (CSS `url()` resolves
// relative to base.css, so one copy covers the nested file pages too).
//
// The green/amber/red coverage-level colours are deliberately left untouched —
// they encode the metric, not the brand.
const reports = require('istanbul-reports');
const fs = require('node:fs');
const path = require('node:path');

const LOGO_SRC = path.join(__dirname, '..', 'static', 'eidra-logo.svg');

// Mirrors the brand values in .storybook/manager.ts.
const BRAND_CSS = `
/* ===== Eidra branding (appended by scripts/eidra-html-reporter.cjs) ===== */
body, html { font-family: "Eidra Sans", "Helvetica Neue", Arial, sans-serif; }
body { background: #f5f2ec; color: #2b2b2b; }
a { color: #faa21b; }
a:hover { color: #ff6f61; }
h1 { color: #2b2b2b; font-weight: 700; }
.quiet { color: #6f6f6f; }
/* Brand the header bar with an accent rule + the Eidra logo. */
.wrapper > .pad1:first-child {
  background: #ffffff;
  border-top: 4px solid #faa21b;
  border-bottom: 1px solid #cbcbcb;
}
.wrapper > .pad1:first-child::before {
  content: "";
  display: block;
  height: 26px;
  margin-bottom: 10px;
  background: url(eidra-logo.svg) left center no-repeat;
  background-size: contain;
}
`;

module.exports = class EidraHtmlReport {
  constructor(opts = {}) {
    // Wrap the built-in html reporter; it extends Istanbul's ReportBase, which
    // provides execute(context) and drives the whole report internally.
    this.inner = reports.create('html', opts);
  }

  execute(context) {
    // Generate the standard HTML report first…
    this.inner.execute(context);
    // …then brand the output. Best-effort: never fail the run over cosmetics.
    try {
      const dir = (context && context.dir) || 'coverage';
      fs.appendFileSync(path.join(dir, 'base.css'), BRAND_CSS);
      fs.copyFileSync(LOGO_SRC, path.join(dir, 'eidra-logo.svg'));
    } catch (err) {
      console.warn(`[eidra-html-reporter] branding skipped: ${err && err.message}`);
    }
  }
};
