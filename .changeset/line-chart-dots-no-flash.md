---
'@educarehq/solaris-ui': patch
---

`line-chart` ENTER no longer gates markers behind the dots row: each dot reveals itself with a backwards-filled animation synced to the pen progress, eliminating the loose-dots flash between RESCALE and ENTER and the simultaneous pop-in when ENTER completes.
