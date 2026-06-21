/**
 * Stylelint for the CSS Modules + base stylesheet.
 *
 * The house rule (see CLAUDE.md): components style off Eidra token CSS
 * variables (`var(--eidra-*)`), never raw colour literals. We enforce the
 * colour half of "tokens, not raw values" mechanically — hex and named
 * colours are errors, so a stray `#fff` or `red` fails CI and pushes the
 * author back to a token. Spacing/size raw values (`1px`, `100%`, `1`) stay
 * allowed: they're legitimately raw in places, and over-enforcing would just
 * breed disable comments.
 *
 * stylelint-config-css-modules teaches the parser about `composes`,
 * `:global`, etc. so Module syntax doesn't trip the standard config.
 */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    // Token custom properties use the `--eidra-*` public prefix and a
    // private `--_local` convention inside modules; allow both.
    'custom-property-pattern': null,
    // Module class names are camelCase locals, not kebab-case.
    'selector-class-pattern': null,
    // Recharts/Base UI data-attribute selectors and vendor bits vary.
    'keyframes-name-pattern': null,
    // The components deliberately order `:hover` before `:focus-visible`
    // (and density overrides last) for readability; the cascade still
    // resolves correctly because they target different states. Enforcing
    // descending specificity here would fight that house pattern, so it's off.
    'no-descending-specificity': null,
    // `text-rendering: optimizeLegibility` is a real camelCase keyword.
    'value-keyword-case': ['lower', { ignoreKeywords: ['optimizeLegibility'] }],
  },
};
