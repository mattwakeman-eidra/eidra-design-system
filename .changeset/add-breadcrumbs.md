---
"@eidra/react": minor
---

Add `Breadcrumbs` — a breadcrumb trail showing the path to the current page. Renders semantic `<nav aria-label="Breadcrumb">` → `<ol>` with the current page marked `aria-current="page"`. Links are plain `<a>` by default, or pass an item `render` callback to use a router link without coupling the design system to a router. Labels accept nodes (icons) and the separator is customizable (defaults to `/`).
