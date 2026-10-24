---
'@educarehq/solaris-ui': patch
---

`line-chart` exit in two layers: the previous frame's data (lines/areas/dots) still slides out to the right, but grid, X/Y ticks and reference lines now only fade in place via a second snapshot layer — axis values no longer "travel". Verified with scripted screenshots (no ghost, no stacked charts mid-transition).
