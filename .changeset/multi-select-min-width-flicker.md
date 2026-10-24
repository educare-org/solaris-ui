---
'@educarehq/solaris-ui': patch
---

Fix `solaris-multi-select` width collapse and auto-display flicker. The trigger now keeps a `min-width` floor estimated from the widest option row (longest display label with a size-aware factor plus option chrome, also covering the summary text), and the same value backs the panel `min-width` when no explicit `panelMinWidth` is given — like a native `<select>`, long options no longer force count-only mode nor wrap inside a narrowed `matchTriggerWidth` panel. Because the trigger width no longer depends on the rendered chips/count state, `auto` mode cannot oscillate between `Brasil +1` and `2 selecionados` while open.
