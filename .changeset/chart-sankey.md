---
"@eidra/react": minor
---

Re-export `Chart.Sankey` — the native Recharts Sankey flow diagram — on the charting kit, and add a themed `Sankey` story (Data Display/Chart) showing the Eidra styling recipe: a per-node palette keyed by node name, source-tinted translucent link ribbons that brighten on hover, always-on node labels placed off the ribbons (left-edge nodes label left, sinks right, mid-stage above), and a themed tooltip that shows a node's throughput or a link's `source → target`, value and share of the source's outflow. The story models a monthly P&L flow (region → net revenue → personnel / other cost / EBITDA). `SankeyData` is re-exported for typing the `{ nodes, links }` input. Additive only.
