---
'@eidra/react': minor
---

`ThemeProvider`: add `nonce` and `cspDisableStyleElements` props. When set, the scope is wrapped in Base UI's `CSPProvider` so the inline `<style>`/`<script>` tags Base UI injects carry a nonce (or are suppressed), letting the design system work under a strict `style-src` Content Security Policy. The default tree is unchanged when neither prop is provided.
