---
'@educarehq/solaris-ui': patch
---

Tooltip: fix arrow tip overlapping panel text. The arrow element is now a clipping container placed strictly outside the panel with the diamond in `::before`, so only the outer triangle paints and no tip intrudes into the content on any placement (`top`, `bottom`, `left`, `right` and `-start`/`-end` variants).
