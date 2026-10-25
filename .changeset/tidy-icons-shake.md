---
'@educarehq/solaris-ui': patch
---

fix(icon): render SolarisIconComponent SVG structurally for SSR

Replace the `[innerHTML]` binding with structured `@for`/`@switch` rendering of allowlisted SVG nodes. Angular SSR (Domino) does not implement the `innerHTML` setter, so every prerendered route using `solaris-icon` failed with `NotYetImplemented`. Server markup is now identical to the browser markup and hydration stays clean. Also preserve `vector-effect` for `absoluteStrokeWidth` (previously stripped by the sanitizer allowlist).
