---
'@educarehq/solaris-ui': patch
---

Fix `solaris-select` trigger/panel width sync when searchable. The search input no longer contributes intrinsic width (`width: 0` with `flex: 1`/`min-width: 0`), and — like the multi-select floor — the trigger keeps a `min-width` estimated from the widest option row, backing the panel `min-width` when no explicit `panelMinWidth` is given. Opening a searchable select no longer widens the trigger while the `matchTriggerWidth` panel keeps its stale width; both render at the widest-option size from the closed state.
