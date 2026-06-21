// Conventional Commits, enforced locally by the Husky commit-msg hook.
// (Not a CI gate: the GitHub-authored "Version Packages" and merge commits never
// run local hooks, and squash-merges take the PR title — so CI linting commit
// messages would fight the bots more than it'd help.)
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Bodies carry prose and URLs; trailers carry long Co-Authored-By /
    // session links. Hard-wrapping those at 100 cols is busywork, so the
    // length caps are off — the header cap (100) still applies.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
