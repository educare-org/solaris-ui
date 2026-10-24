---
'@educarehq/solaris-ui': patch
---

fix(table-filter): keep the Filters count badge mounted inside a grid 0fr/1fr wrapper so the button width grows and shrinks smoothly in both directions (with a margin compensation for the parent gap and an inner fade/scale), instead of jumping when the badge mounts/unmounts. Reduced-motion safe.
