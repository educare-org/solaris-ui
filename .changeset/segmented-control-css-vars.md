---
'@educarehq/solaris-ui': patch
---

Segmented Control: restyle internals without visual changes — removed all `::ng-deep` selectors from `solaris-segmented-control` and all `solaris-segmented-control` `:host-context` selectors from `solaris-segmented-item`. Parent-to-item styling now flows through inherited `--solaris-segmented-*` custom properties (no `var()` fallbacks, no comments), with edge-item radius resolved by the item itself via `:first-of-type` / `:last-of-type`. Icon-only items use `calc(var(--solaris-font-size-md) * 1.125)`.
