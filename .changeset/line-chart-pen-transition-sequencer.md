---
'@educarehq/solaris-ui': patch
---

`line-chart` deterministic EXIT → RESCALE → ENTER transitions: staged rendered series/axes prevent old/new overlap, pen erase/draw follows path geometry via stroke-dashoffset, axes rescale only while empty, rapid period changes coalesce to the latest pending dataset with generation-guarded cancellation and resource cleanup.
