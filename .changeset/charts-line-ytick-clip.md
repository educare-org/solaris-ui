---
'@educarehq/solaris-ui': patch
---

`line-chart` y-axis clipping: the top nice tick could land above the padded domain and render outside the plot, cut by the svg edge. The frame domain now snaps outwards to the outer ticks so every gridline and label stays inside the plot.
