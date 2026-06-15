# Product-first foundation, brand scale as display overrides

The Eidra brand guidelines specify an **editorial** type and spacing system: bold-only type from 15px up to 136/184px with tight tracking, and a coarse 10px-based spacing scale (10/20/40/60/80/120/200). This is built for marketing and presentation layouts.

The design system instead adopts a **product-first foundation**: a conventional type ramp (Eidra Sans in Regular/Medium/Semibold/Bold from 12px) and a **4px spacing grid**. The brand's large display sizes and coarse spacing are preserved as an opt-in **display tier** for expressive/marketing surfaces, not the default.

A future reader comparing the tokens to the brand portal will notice they do not match the guidelines' scales — this is deliberate, not drift.

## Why

The system must serve dense dashboards, client-facing SaaS, marketing sites, and pitch demos from one source. The brand scale cannot express 12–14px body text, a regular weight, or 4/8/12px component rhythm — all mandatory for functional UI. Forcing the editorial scale onto product UI would make every dashboard re-invent these. Brand identity is carried instead through the **palette** (orange, coral, creme, taupe, greys) and **Eidra Sans**, which apply at any scale.

## Consequences

- The 4px grid is a superset of the key brand stops (20/40/60/80/120/200 remain reachable), so display and product tiers stay visually coherent.
- Expressive brand fidelity is available but explicit (display tier), never automatic.
