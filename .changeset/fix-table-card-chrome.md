---
'@educarehq/solaris-ui': patch
---

fix(table): align card layout with desktop chrome

Card layout no longer paints the host background between cards, selection uses an integrated checkbox gutter plus a labeled select-all bar with selected/total count, and `appearance`, `striped`/`stripedMode`, and `radius` now apply to cards. Loading renders per-field skeleton cards instead of a single collapsed skeleton.
