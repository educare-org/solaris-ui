---
'@educarehq/solaris-ui': patch
---

`line-chart` pen sync: the pen dot used `easeOutCubic` while the stroke dash animates with `cubic-bezier(0.4, 0, 0.2, 1)`, so the pen raced ahead of the visible tip and read as a floating dot. It now evaluates the same cubic-bezier in JS (Newton–Raphson), riding exactly on the dash tip — verified via scripted screenshots. Draw durations raised to 1000ms (mount) / 650ms (updates).
